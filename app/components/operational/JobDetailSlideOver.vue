<script setup lang="ts">
import { cn } from "~/lib/utils";
import {
  X,
  Building2,
  MapPin,
  Ship,
  Mail,
  Phone,
  Calendar,
  Loader2,
  Box,
  Settings,
  CheckCircle2,
  CalendarClock,
  Edit,
  Receipt,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Check,
  Plane as PlaneIcon,
} from "lucide-vue-next";
import JobFinanceTab from "./JobFinanceTab.vue";
import JobEblTab from "./JobEblTab.vue";
import JobDocumentTab from "./JobDocumentTab.vue";
import { useAuth } from "~/composables/useAuth";
const { canApproveJobs } = useAuth();
import Combobox from "~/components/ui/Combobox.vue";
import DatePicker from "~/components/ui/DatePicker.vue";
import { toast } from "vue-sonner";
import type { EblVessel, ActiveJobData } from "./ebl/types";
import type { Vessel } from "~/composables/useMasterData";
import type { Plane } from "~/composables/usePlanes";
import VesselQuickAddModal from "./VesselQuickAddModal.vue";
import PlaneQuickAddModal from "./PlaneQuickAddModal.vue";

interface Props {
  modelValue: boolean;
  jobId: string;
  initialTab?: string;
  initialBlId?: string;
  initialInvoiceId?: string;
  initialSubTab?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const { currentJob, getJob, isLoading, updateJob, completeJob, cancelCompleteJob } = useJobs();
const { canManage, requireManage } = useFeatureAccess("operational.job");

const activeTab = ref("overview");
const tabs = [
  { id: "overview", label: "Overview" },
  { id: "ebl", label: "eBL" },
  { id: "finance", label: "Finance" },
  { id: "document", label: "Upload Document" },
];

const { fetchVessels, fetchPlanes, createVessel, createPlane, fetchPorts } = useMasterData();
const masterPorts = ref<Port[]>([]);
const refreshPorts = async (query?: string) => {
  masterPorts.value = await fetchPorts(query);
};
const { confirm } = useConfirm();

const isEditingVessels = ref(false);
const editableVessels = ref<EblVessel[]>([]);
const activeVesselObj = ref<EblVessel | null>(null);
const masterVessels = ref<Vessel[]>([]);
const masterPlanes = ref<Plane[]>([]);
const editablePol = ref("");
const editablePod = ref("");

const refreshMasterData = async () => {
  masterVessels.value = await fetchVessels();
  masterPlanes.value = await fetchPlanes();
  masterPorts.value = await fetchPorts();
};

// Vessel Modal State
const isVesselModalOpen = ref(false);
const presetVesselName = ref("");

// Plane Modal State (Air Freight)
const isPlaneModalOpen = ref(false);
const presetPlaneName = ref("");

// Unified create handler for Vessel or Plane
const handleCreateTransport = async (name: string, item?: EblVessel) => {
  if (!requireManage("You only have view access for jobs.")) return;

  if (isAir.value) {
    presetPlaneName.value = name;
    activeVesselObj.value = item || null; // reuse for simplicity
    isPlaneModalOpen.value = true;
  } else {
    presetVesselName.value = name;
    activeVesselObj.value = item || null;
    isVesselModalOpen.value = true;
  }
};

// Keep alias for existing calls in template
const handleCreateVessel = handleCreateTransport;

const onVesselCreateSuccess = async (vessel: { id: string; name: string }) => {
  await refreshMasterData();

  if (activeVesselObj.value) {
    activeVesselObj.value.vesselId = vessel.id;
  }

  isVesselModalOpen.value = false;
  toast.success(`Vessel "${vessel.name}" created successfully.`);
};

const onPlaneCreateSuccess = async (plane: { id: string; name: string }) => {
  await refreshMasterData();

  if (activeVesselObj.value) {
    activeVesselObj.value.vesselId = plane.id;
  }

  isPlaneModalOpen.value = false;
  toast.success(`Plane "${plane.name}" created successfully.`);
};

const startEditVessels = () => {
  if (!requireManage("You only have view access for jobs.")) return;

  editableVessels.value = JSON.parse(JSON.stringify(job.value?.vessels || []));
  editablePol.value = job.value?.pol || "";
  editablePod.value = job.value?.pod || "";
  isEditingVessels.value = true;
};

const cancelEditVessels = () => {
  isEditingVessels.value = false;
};

const addVessel = () => {
  if (!requireManage("You only have view access for jobs.")) return;

  const lastVessel = editableVessels.value[editableVessels.value.length - 1];
  editableVessels.value.push({
    vesselId: "",
    vesselName: "",
    voyageNumber: "",
    tsPortId: lastVessel?.tsPortId || "", // Auto carry
    etd: new Date().toISOString().split("T")[0],
    eta: "",
    sequence: editableVessels.value.length + 1,
    vesselType: "mother",
  });
};

const removeVessel = (idx: number) => {
  if (!requireManage("You only have view access for jobs.")) return;

  editableVessels.value.splice(idx, 1);
};

const saveVessels = async () => {
  if (!props.jobId) return;
  if (!requireManage("You only have view access for jobs.")) return;

  syncTransportNames();

  const lastLeg =
    editableVessels.value.length > 0
      ? editableVessels.value[editableVessels.value.length - 1]
      : null;

  const res = await updateJob(props.jobId, {
    vessels: editableVessels.value,
    pol: editablePol.value,
    pod: editablePod.value,
    eta: lastLeg?.eta || undefined,
  });
  if (res.success) {
    isEditingVessels.value = false;
    await getJob(props.jobId);
  }
};

const syncTransportNames = () => {
  const list = isAir.value ? masterPlanes.value : masterVessels.value;

  editableVessels.value.forEach((leg) => {
    if (leg.vesselId) {
      const selected = list.find((item) => item.id === leg.vesselId);
      if (selected?.name) {
        leg.vesselName = selected.name;
      }
    }
  });
};

const job = computed(() => currentJob.value);
const isAir = computed(() => job.value?.shipmentType === "AIR" || job.value?.serviceType === "AIR");
const isCompleting = ref(false);
const isCancelingComplete = ref(false);
const isCompleted = computed(() => {
  const status = job.value?.status;
  if (!status) return false;
  const code = (typeof status === "string" ? status : status.code || "").trim().toUpperCase();
  return ["COMPLETED", "CLOSED", "DONE"].includes(code);
});

const hasUnfinalizedEbl = computed(() => {
  if (!job.value?.billsOfLading?.length) return false;
  return job.value.billsOfLading.some((bl) => {
    const s = bl.status;
    if (!s) return true;

    let code = "";
    if (typeof s === "string") {
      code = s.toLowerCase();
    } else {
      code = s.code?.toLowerCase() || "";
    }

    if (code === "confirmed" || code === "finalized") return false;
    return true;
  });
});

const hasUnpaidInvoice = computed(() => {
  if (!job.value?.invoices?.length) return false;
  return job.value.invoices.some((inv) => {
    const s = inv.status;
    if (!s) return true;

    let code = "";
    if (typeof s === "string") {
      code = s.toUpperCase();
    } else {
      code = s.code?.toUpperCase() || "";
    }

    if (code === "PAID" || code === "VOID") return false;
    return true;
  });
});

const isDraft = computed(() => {
  const code = job.value?.status?.code?.toUpperCase();
  return code === "DRAFT";
});

// Final ETA for header summary: prefer top-level job.eta, fallback to last vessel leg eta
// (very important for AIR/Plane jobs and multi-leg schedules)
const finalEta = computed(() => {
  if (job.value?.eta) return job.value.eta;
  const vessels = job.value?.vessels;
  if (vessels && vessels.length > 0) {
    return vessels[vessels.length - 1]?.eta || null;
  }
  return null;
});

watch(
  () => props.modelValue,
  async (isOpen) => {
    if (isOpen && props.jobId) {
      activeTab.value = props.initialTab || "overview";
      await Promise.all([getJob(props.jobId), refreshMasterData()]);
    }
  },
  { immediate: true },
);

// Ensure fresh job data (incl. vessels + eta for AIR) whenever user enters the eBL tab.
// This guarantees JobEblTab always receives up-to-date props.job for form seeding (ETA POD etc.)
// without requiring the user to close/reopen the slideover.
watch(activeTab, (tab) => {
  if (tab === "ebl" && props.jobId) {
    getJob(props.jobId);
  }
});

const formatDate = (dateString?: string | null) => {
  if (!dateString) return "-";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(dateString));
  } catch (e) {
    return dateString;
  }
};

const formatDateTime = (dateString?: string | null) => {
  if (!dateString) return "-";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  } catch (e) {
    return dateString;
  }
};

const getCustomerName = computed(
  () => job.value?.customer?.name || job.value?.customerId || "CUST-001",
);
const getStatusName = computed(() => {
  return job.value?.status?.name || "Active";
});
const getJobTypeName = computed(
  () => job.value?.tradeType?.name || job.value?.tradeTypeId || "Export",
);
const getVesselName = computed(
  () => job.value?.vessel?.name || job.value?.plane?.name || job.value?.vesselId || "-",
);

const getServiceName = computed(
  () => job.value?.service?.name || job.value?.serviceId || "Ocean Freight",
);
const getVendorName = computed(() => job.value?.vendor?.name || "PT Nova Sync Continent");
const getPol = computed(() => {
  if (job.value?.serviceType === "TRUCKING") return job.value.pickupAddress || "-";
  if (!job.value?.pol) return "-";
  if (job.value.polName) return `${job.value.polName} (${job.value.pol})`;
  return job.value.pol;
});

const getPod = computed(() => {
  if (job.value?.serviceType === "TRUCKING") return job.value.deliveryAddress || "-";
  if (!job.value?.pod) return "-";
  if (job.value.podName) return `${job.value.podName} (${job.value.pod})`;
  return job.value.pod;
});
const getTotalContainers = computed(() => job.value?.totalBlCount || 2);

const getServiceTypeBadge = computed(() => {
  const sType = job.value?.serviceType || "OCEAN";
  const shType = job.value?.shipmentType || "OCEAN";

  if (sType === "TRUCKING") {
    return {
      name: "Trucking",
      class: "bg-amber-50 text-amber-700 border-amber-200",
    };
  }
  if (sType === "AIR" || shType === "AIR") {
    return {
      name: "Air Freight",
      class: "bg-sky-50 text-sky-700 border-sky-200",
    };
  }
  return {
    name: "Ocean Freight",
    class: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };
});

const getPartyAddress = (roleCode: string) => {
  const party = job.value?.jobParties?.find((p) => p.partyRole?.code === roleCode);
  if (!party) return "-";

  if (party.addressBook?.fullAddress) {
    return party.addressBook.fullAddress;
  }

  if (roleCode === "SHIPPER") return "";
  if (roleCode === "CONSIGNEE") return "";

  return "-";
};
const expandedItems = ref(new Set<string>());

const toggleItem = (itemId: string | number) => {
  const id = String(itemId);
  if (expandedItems.value.has(id)) {
    expandedItems.value.delete(id);
  } else {
    expandedItems.value.add(id);
  }
};

const handleCompleteJob = async () => {
  if (!job.value?.id) return;

  // Instead of blocking, we let the user click and show warning if needed
  if (hasUnfinalizedEbl.value || hasUnpaidInvoice.value) {
    const warningMsg =
      hasUnfinalizedEbl.value && hasUnpaidInvoice.value
        ? "Ada eBL yang belum final dan Invoice yang belum lunas."
        : hasUnfinalizedEbl.value
          ? "Masih ada eBL yang belum final."
          : "Masih ada Invoice yang belum lunas.";

    const proceed = await confirm({
      title: "Peringatan Syarat Belum Lengkap",
      message: `${warningMsg} Apakah Anda yakin ingin mencoba menyelesaikan job ini anyway? (Backend tetap akan memvalidasi)`,
      confirmText: "Coba Selesaikan",
      type: "warning",
    });
    if (!proceed) return;
  } else {
    const confirmed = await confirm({
      title: "Complete Job",
      message: `Apakah Anda yakin ingin menyelesaikan job ${job.value.jobNumber}?`,
      confirmText: "Complete",
      type: "info",
    });
    if (!confirmed) return;
  }

  isCompleting.value = true;
  const result = await completeJob(job.value.id);
  if (result.success) {
    toast.success("Job berhasil diselesaikan.");
  } else {
    toast.error(result.error || "Gagal menyelesaikan job.");
  }
  isCompleting.value = false;
};

const isActivating = ref(false);
const handleActivateJob = async () => {
  if (!job.value?.id) return;

  const confirmed = await confirm({
    title: "Activate Job",
    message: `Apakah Anda yakin ingin mengaktifkan job ${job.value.jobNumber}? Setelah aktif, menu Finance dan eBL akan terbuka.`,
    confirmText: "Aktifkan",
    type: "info",
  });
  if (!confirmed) return;

  isActivating.value = true;
  const result = await updateJob(job.value.id, { status: "IN_PROGRESS" });
  if (result.success) {
    toast.success("Job berhasil diaktifkan.");
    await getJob(job.value.id);
  } else {
    toast.error(result.error || "Gagal mengaktifkan job.");
  }
  isActivating.value = false;
};

const handleCancelCompleteJob = async () => {
  if (!job.value?.id) return;
  const confirmed = await confirm({
    title: "Batalkan Complete Job",
    message: `Batalkan status complete untuk job ${job.value.jobNumber}?`,
    confirmText: "Batalkan",
    type: "warning",
  });
  if (!confirmed) return;

  isCancelingComplete.value = true;
  const result = await cancelCompleteJob(job.value.id);
  if (result.success) {
    toast.success("Complete job dibatalkan.");
  } else {
    toast.error(result.error || "Gagal membatalkan complete job.");
  }
  isCancelingComplete.value = false;
};

function getVesselLabels(index: number, list: (EblVessel | JobVessel)[]) {
  const isFirst = index === 0;
  const isLast = index === list.length - 1;
  const isIntermediate = !isFirst && !isLast;

  const transportLabel = isAir.value ? "Plane" : "Vessel";

  return {
    header: isFirst
      ? `Feeder ${transportLabel}`
      : isLast
        ? `Mother ${transportLabel} ${index} (Last)`
        : `Mother ${transportLabel} ${index + 1}`,
    etd: isFirst ? "ETD POL" : "ETD T/S PORT",
    eta: isLast ? "ETA POD" : "ETA NEXT PORT",
    leftPortLabel: isFirst
      ? isAir
        ? "Airport POL"
        : "POL Name"
      : isAir
        ? "T/S Airport Name"
        : "T/S Port Name",
    rightPortLabel: isLast
      ? isAir
        ? "Airport POD"
        : "POD Name"
      : isAir
        ? "Next Airport Name"
        : "Next Port Name",
    isFirst,
    isLast,
    isIntermediate,
    hasTransit: list.length > 1,
  };
}

watch(
  () => editableVessels.value,
  (vessels) => {
    vessels.forEach((v, idx) => {
      v.sequence = idx + 1;
      v.vesselType = idx === 0 ? "feeder" : "mother";
    });

    // Keep transport names in sync while the user is editing (live)
    syncTransportNames();
  },
  { deep: true },
);
</script>

<template>
  <Teleport to="body">
    <Transition name="slide-over">
      <div v-if="modelValue" class="fixed inset-0 z-[1050] flex justify-end">
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/40 transition-opacity"
          @click="$emit('update:modelValue', false)"
        ></div>

        <!-- Drawer Panel -->
        <div class="slide-panel relative w-full max-w-5xl bg-white h-full shadow-2xl flex flex-col">
          <!-- Header -->
          <div
            class="px-6 pt-5 pb-4 border-b border-border flex items-center justify-between shrink-0 bg-white relative z-20"
          >
            <div class="flex items-center gap-2 text-sm text-muted-foreground font-medium">
              Job <span class="mx-1">›</span>
              <span class="text-foreground">{{ job?.jobNumber || "..." }}</span>
            </div>
            <div class="flex items-center gap-2">
              <button
                v-if="isDraft"
                @click="handleActivateJob"
                :disabled="isActivating"
                class="px-3 py-2 rounded-md text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <Loader2 v-if="isActivating" class="w-4 h-4 animate-spin" />
                <CheckCircle2 v-else class="w-4 h-4" />
                <span>Aktifkan Job</span>
              </button>
              <button
                v-else
                @click="isCompleted ? handleCancelCompleteJob() : handleCompleteJob()"
                :disabled="isCompleting || isCancelingComplete || !canApproveJobs"
                :title="
                  !canApproveJobs
                    ? 'Anda tidak memiliki akses untuk menutup job'
                    : hasUnfinalizedEbl || hasUnpaidInvoice
                      ? 'Syarat eBL atau Invoice mungkin belum lengkap'
                      : ''
                "
                :class="
                  cn(
                    'px-3 py-2 rounded-md text-xs font-semibold transition-colors flex items-center gap-2',
                    isCompleted
                      ? 'border border-red-200 text-red-600 hover:bg-red-50'
                      : 'bg-[#012D5A] text-white hover:bg-[#012D5A]/90',
                    !canApproveJobs && 'opacity-50 cursor-not-allowed',
                  )
                "
              >
                <Loader2 v-if="isCompleting || isCancelingComplete" class="w-4 h-4 animate-spin" />
                <Check v-else-if="!isCompleted" class="w-4 h-4" />
                <X v-else class="w-4 h-4" />
                <span>{{ isCompleted ? "Batalkan Close Job" : "Close Job" }}</span>
              </button>
              <button
                @click="$emit('update:modelValue', false)"
                class="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <X class="w-5 h-5" />
              </button>
            </div>
          </div>

          <div v-if="isLoading" class="flex-1 flex items-center justify-center">
            <Loader2 class="w-8 h-8 animate-spin text-primary" />
          </div>

          <div v-else-if="job" class="flex-1 flex flex-col min-h-0">
            <div class="flex-1 overflow-y-auto">
              <!-- Job Summary Header -->
              <div class="px-8 py-6 pb-2">
                <h2 class="text-2xl font-bold text-foreground mb-1">{{ job.jobNumber }}</h2>
                <p class="text-sm text-muted-foreground mb-6">{{ getCustomerName }}</p>

                <div class="grid grid-cols-[140px_1fr] gap-y-3 text-sm">
                  <div class="flex items-center gap-2 text-muted-foreground">
                    <Calendar class="w-4 h-4" /> Created Time
                  </div>
                  <div class="font-medium">{{ formatDateTime(job.createdAt) }}</div>

                  <div class="flex items-center gap-2 text-muted-foreground">
                    <Settings class="w-4 h-4" /> Status
                  </div>
                  <div>
                    <span
                      :class="
                        cn(
                          'inline-flex items-center px-3 py-1 rounded-md text-xs font-bold leading-none border',
                          isCompleted
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : 'bg-yellow-100 text-yellow-800 border-yellow-200',
                        )
                      "
                    >
                      {{ getStatusName }}
                    </span>
                  </div>

                  <div class="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 class="w-4 h-4" /> Job Type
                  </div>
                  <div>
                    <span
                      class="inline-flex items-center px-3 py-1 rounded-md text-xs font-bold leading-none bg-blue-50 text-blue-700 border border-blue-200"
                    >
                      {{ getJobTypeName }}
                    </span>
                  </div>

                  <div class="flex items-center gap-2 text-muted-foreground">
                    <Box class="w-4 h-4" /> Service Type
                  </div>
                  <div>
                    <span
                      :class="
                        cn(
                          'inline-flex items-center px-3 py-1 rounded-md text-xs font-bold leading-none border',
                          getServiceTypeBadge.class,
                        )
                      "
                    >
                      {{ getServiceTypeBadge.name }}
                    </span>
                  </div>

                  <div class="flex items-center gap-2 text-muted-foreground">
                    <CalendarClock class="w-4 h-4" />
                    {{ job.serviceType === "TRUCKING" ? "Target Dates" : "ETD - ETA" }}
                  </div>
                  <div class="font-medium">
                    <template v-if="job.serviceType === 'TRUCKING'">
                      {{ formatDate(job.pickupDate) }} - {{ formatDate(job.deliveryDate) }}
                    </template>
                    <template v-else>
                      {{ formatDate(job.etd) }} - {{ formatDate(finalEta) }}
                    </template>
                  </div>
                </div>
              </div>

              <!-- Tabs -->
              <div
                class="px-8 mt-6 pt-4 border-b border-border flex gap-8 sticky top-0 bg-white z-10"
              >
                <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  @click="!(isDraft && tab.id !== 'overview') && (activeTab = tab.id)"
                  :disabled="isDraft && tab.id !== 'overview'"
                  class="pb-3 text-base font-bold transition-colors relative tracking-tight disabled:opacity-50 disabled:cursor-not-allowed"
                  :class="
                    activeTab === tab.id
                      ? 'text-[#012D5A]'
                      : 'text-muted-foreground hover:text-foreground'
                  "
                >
                  {{ tab.label }}
                  <div
                    v-if="activeTab === tab.id"
                    class="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#012D5A] rounded-t-full"
                  ></div>
                </button>
              </div>

              <!-- Tab Content -->
              <div class="p-8">
                <div v-if="activeTab === 'overview'" class="space-y-8 animate-fade-in">
                  <section>
                    <h3 class="text-base font-bold">Shipments Details</h3>
                    <div class="grid grid-cols-2 gap-x-8 gap-y-6 mt-6">
                      <div class="flex gap-4 items-center">
                        <div
                          class="w-10 h-10 rounded-full bg-blue-50/80 flex items-center justify-center text-[#012D5A] shrink-0 border border-blue-100"
                        >
                          <MapPin
                            v-if="job.serviceType === 'TRUCKING'"
                            class="w-5 h-5 text-[#012D5A]/80"
                          />
                          <Building2 v-else class="w-5 h-5 text-[#012D5A]/80" />
                        </div>
                        <div>
                          <p class="text-xs text-muted-foreground mb-0.5">
                            {{
                              job.serviceType === "TRUCKING" ? "Pickup Address" : "Port of Landing"
                            }}
                          </p>
                          <p class="font-bold text-sm text-foreground">{{ getPol }}</p>
                        </div>
                      </div>

                      <div class="flex gap-4 items-center">
                        <div
                          class="w-10 h-10 rounded-full bg-blue-50/80 flex items-center justify-center text-[#012D5A] shrink-0 border border-blue-100"
                        >
                          <MapPin
                            v-if="job.serviceType === 'TRUCKING'"
                            class="w-5 h-5 text-[#012D5A]/80"
                          />
                          <Building2 v-else class="w-5 h-5 text-[#012D5A]/80" />
                        </div>
                        <div>
                          <p class="text-xs text-muted-foreground mb-0.5">
                            {{
                              job.serviceType === "TRUCKING"
                                ? "Delivery Address"
                                : "Port of Discharge"
                            }}
                          </p>
                          <p class="font-bold text-sm text-foreground">{{ getPod }}</p>
                        </div>
                      </div>

                      <!-- Vessel Schedule (Ocean Only) -->
                      <div
                        v-if="job.serviceType !== 'TRUCKING'"
                        class="flex gap-4 items-start col-span-2"
                      >
                        <div
                          class="w-10 h-10 rounded-full bg-blue-50/80 flex items-center justify-center text-[#012D5A] shrink-0 border border-blue-100"
                        >
                          <component
                            :is="isAir ? PlaneIcon : Ship"
                            class="w-5 h-5 text-[#012D5A]/80"
                          />
                        </div>
                        <div class="flex-1">
                          <div class="flex items-center justify-between mb-2">
                            <p
                              class="text-xs text-muted-foreground uppercase font-bold tracking-wider"
                            >
                              {{ isAir ? "Plane Schedule" : "Vessel Schedule" }}
                            </p>
                            <div
                              v-if="canManage && !isEditingVessels && !isCompleted"
                              class="flex items-center gap-2"
                            >
                              <button
                                @click="startEditVessels"
                                class="p-1.5 rounded-md hover:bg-blue-50 text-[#012D5A] transition-colors"
                                title="Edit Schedule"
                              >
                                <Edit class="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div
                              v-else-if="canManage && isEditingVessels"
                              class="flex items-center gap-2"
                            >
                              <button
                                @click="addVessel"
                                class="flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors text-[10px] font-bold uppercase tracking-wider"
                              >
                                <Plus class="w-3 h-3" /> ADD {{ isAir ? "PLANE" : "VESSEL" }}
                              </button>
                              <button
                                @click="saveVessels"
                                class="p-1.5 rounded-md bg-[#012D5A] text-white hover:bg-[#012D5A]/90 transition-colors"
                                title="Save Changes"
                              >
                                <Check class="w-3.5 h-3.5" />
                              </button>
                              <button
                                @click="cancelEditVessels"
                                class="p-1.5 rounded-md hover:bg-gray-100 text-muted-foreground transition-colors"
                                title="Cancel"
                              >
                                <X class="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <!-- View Mode -->
                          <div v-if="!isEditingVessels" class="space-y-3">
                            <div
                              v-for="(vessel, idx) in job.vessels || []"
                              :key="idx"
                              class="flex items-center justify-between group"
                            >
                              <div class="flex items-center gap-3">
                                <div
                                  class="w-6 h-6 rounded bg-[#012D5A] text-white flex items-center justify-center text-[10px] font-bold"
                                >
                                  {{ idx + 1 }}
                                </div>
                                <div>
                                  <p class="font-bold text-sm text-foreground leading-tight">
                                    {{
                                      vessel.vesselName ||
                                      vessel.plane?.name ||
                                      vessel.vessel?.name ||
                                      "No transport assigned"
                                    }}
                                  </p>
                                  <div class="flex items-center gap-2 mt-0.5">
                                    <span
                                      class="text-[10px] px-1.5 py-0.5 bg-muted rounded font-bold text-muted-foreground uppercase tracking-tighter"
                                    >
                                      {{ getVesselLabels(idx, job.vessels || []).header }}
                                    </span>
                                    <p class="text-[11px] text-muted-foreground">
                                      Voyage: {{ vessel.voyageNumber || "-" }}
                                    </p>
                                    <span
                                      class="text-[10px] px-1.5 py-0.5 bg-emerald-50 rounded font-bold text-emerald-600 uppercase tracking-tighter"
                                      :title="
                                        vessel.polName ||
                                        (idx === 0
                                          ? job.pol
                                          : job.vessels?.[idx - 1]?.tsPortId || '-') ||
                                        undefined
                                      "
                                    >
                                      {{ idx === 0 ? "POL" : "T/S" }}:
                                      {{
                                        vessel.polName ||
                                        (idx === 0
                                          ? job.pol
                                          : job.vessels?.[idx - 1]?.tsPortId || "-")
                                      }}
                                    </span>
                                    <span
                                      class="text-[10px] px-1.5 py-0.5 bg-blue-50 rounded font-bold text-blue-600 uppercase tracking-tighter"
                                      :title="
                                        vessel.podName ||
                                        (idx === (job.vessels?.length || 0) - 1
                                          ? job.pod
                                          : vessel.tsPortId || '-') ||
                                        undefined
                                      "
                                    >
                                      {{ idx === (job.vessels?.length || 0) - 1 ? "POD" : "T/S" }}:
                                      {{
                                        vessel.podName ||
                                        (idx === (job.vessels?.length || 0) - 1
                                          ? job.pod
                                          : vessel.tsPortId || "-")
                                      }}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div class="text-right flex items-center gap-4">
                                <div>
                                  <p
                                    class="text-[10px] font-bold text-primary uppercase tracking-tighter leading-none mb-0.5"
                                  >
                                    {{ getVesselLabels(idx, job.vessels || []).etd }}
                                  </p>
                                  <p class="text-[11px] font-semibold text-foreground">
                                    {{ formatDate(vessel.etd) }}
                                  </p>
                                </div>
                                <div class="w-px h-6 bg-border mx-1"></div>
                                <div>
                                  <p
                                    class="text-[10px] font-bold text-primary uppercase tracking-tighter leading-none mb-0.5"
                                  >
                                    {{ getVesselLabels(idx, job.vessels || []).eta }}
                                  </p>
                                  <p class="text-[11px] font-semibold text-foreground">
                                    {{ formatDate(vessel.eta) }}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div
                              v-if="!job.vessels || job.vessels.length === 0"
                              class="text-sm font-medium text-muted-foreground italic"
                            >
                              No {{ isAir ? "planes" : "vessels" }} assigned
                            </div>
                          </div>

                          <!-- Edit Mode -->
                          <div v-else-if="canManage" class="space-y-4">
                            <div
                              v-for="(vessel, idx) in editableVessels"
                              :key="idx"
                              class="p-3 bg-gray-50/50 rounded-lg border border-border space-y-3 relative group"
                            >
                              <button
                                @click="removeVessel(idx)"
                                class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-border shadow-sm flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors z-10"
                              >
                                <Trash2 class="w-3 h-3" />
                              </button>

                              <div class="grid grid-cols-1 gap-3">
                                <div>
                                  <label
                                    class="text-[9px] font-bold text-muted-foreground uppercase mb-1 block"
                                    >{{ getVesselLabels(idx, editableVessels).header }}</label
                                  >
                                  <Combobox
                                    v-model="vessel.vesselId"
                                    :options="isAir ? masterPlanes : masterVessels"
                                    label-key="name"
                                    value-key="id"
                                    :placeholder="isAir ? 'Search Plane...' : 'Search Vessel...'"
                                    allow-create
                                    @create="(name) => handleCreateVessel(name, vessel)"
                                    class="h-8"
                                  />
                                </div>
                                <div class="grid grid-cols-2 gap-3">
                                  <div>
                                    <label
                                      class="text-[9px] font-bold text-muted-foreground uppercase mb-1 block"
                                      >Voyage</label
                                    >
                                    <input
                                      v-model="vessel.voyageNumber"
                                      type="text"
                                      class="w-full h-8 px-2 text-xs rounded border border-border focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                                      placeholder="Voyage..."
                                    />
                                  </div>
                                  <div>
                                    <label
                                      class="text-[9px] font-bold text-muted-foreground uppercase mb-1 block"
                                      >{{ getVesselLabels(idx, editableVessels).etd }}</label
                                    >
                                    <DatePicker
                                      v-model="vessel.etd"
                                      placeholder="ETD..."
                                      class="h-8 shadow-none"
                                    />
                                  </div>
                                  <div>
                                    <label
                                      class="text-[9px] font-bold text-muted-foreground uppercase mb-1 block"
                                      >{{ getVesselLabels(idx, editableVessels).eta }}</label
                                    >
                                    <DatePicker
                                      v-model="vessel.eta"
                                      placeholder="ETA..."
                                      class="h-8 shadow-none"
                                    />
                                  </div>
                                  <div
                                    class="col-span-2 grid grid-cols-2 gap-3 mt-1 pt-3 border-t border-border/40"
                                  >
                                    <!-- Left Port Picker -->
                                    <div>
                                      <label
                                        class="text-[9px] font-bold text-muted-foreground uppercase mb-1 block"
                                      >
                                        {{ getVesselLabels(idx, editableVessels).leftPortLabel }}
                                      </label>
                                      <Combobox
                                        v-if="idx === 0"
                                        v-model="editablePol"
                                        :options="masterPorts"
                                        label-key="name"
                                        value-key="code"
                                        placeholder="Search POL..."
                                        class="h-8"
                                        :filter-local="false"
                                        @search="refreshPorts"
                                      />
                                      <Combobox
                                        v-else
                                        v-model="editableVessels[idx - 1]!.tsPortId"
                                        :options="masterPorts"
                                        label-key="name"
                                        value-key="code"
                                        placeholder="Search T/S Port..."
                                        class="h-8"
                                        :filter-local="false"
                                        @search="refreshPorts"
                                      />
                                    </div>

                                    <!-- Right Port Picker -->
                                    <div>
                                      <label
                                        class="text-[9px] font-bold text-muted-foreground uppercase mb-1 block"
                                      >
                                        {{ getVesselLabels(idx, editableVessels).rightPortLabel }}
                                      </label>
                                      <Combobox
                                        v-if="idx === editableVessels.length - 1"
                                        v-model="editablePod"
                                        :options="masterPorts"
                                        label-key="name"
                                        value-key="code"
                                        placeholder="Search POD..."
                                        class="h-8"
                                        :filter-local="false"
                                        @search="refreshPorts"
                                      />
                                      <Combobox
                                        v-else
                                        v-model="vessel.tsPortId"
                                        :options="masterPorts"
                                        label-key="name"
                                        value-key="code"
                                        placeholder="Search Next Port..."
                                        class="h-8"
                                        :filter-local="false"
                                        @search="refreshPorts"
                                      />
                                    </div>
                                    <div
                                      class="col-span-2"
                                      v-if="
                                        (idx === 0
                                          ? editablePol
                                          : editableVessels[idx - 1]?.tsPortId) ===
                                          (idx === editableVessels.length - 1
                                            ? editablePod
                                            : vessel.tsPortId) &&
                                        (idx === 0
                                          ? editablePol
                                          : editableVessels[idx - 1]?.tsPortId)
                                      "
                                    >
                                      <p
                                        class="text-[9px] text-destructive font-bold animate-pulse flex items-center gap-1 bg-destructive/5 p-1.5 rounded border border-destructive/10"
                                      >
                                        ⚠️ Left and Right port cannot be the same
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div
                              v-if="editableVessels.length === 0"
                              class="text-xs text-center py-4 text-muted-foreground italic bg-gray-50 border border-dashed border-border rounded-lg"
                            >
                              Click "Add" to add a vessel to the schedule
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Truck Details (Trucking Only) -->
                      <div v-if="job.serviceType === 'TRUCKING'" class="flex gap-4 items-center">
                        <div
                          class="w-10 h-10 rounded-full bg-blue-50/80 flex items-center justify-center text-[#012D5A] shrink-0 border border-blue-100"
                        >
                          <Box class="w-5 h-5 text-[#012D5A]/80" />
                        </div>
                        <div>
                          <p class="text-xs text-muted-foreground mb-0.5">Truck Type</p>
                          <p class="font-bold text-sm text-foreground uppercase">
                            {{ job.truckType || "Standard Truck" }}
                          </p>
                        </div>
                      </div>

                      <!-- Pickup Target (Trucking Only) -->
                      <div v-if="job.serviceType === 'TRUCKING'" class="flex gap-4 items-center">
                        <div
                          class="w-10 h-10 rounded-full bg-blue-50/80 flex items-center justify-center text-[#012D5A] shrink-0 border border-blue-100"
                        >
                          <Calendar class="w-5 h-5 text-[#012D5A]/80" />
                        </div>
                        <div>
                          <p class="text-xs text-muted-foreground mb-0.5">Target Pickup</p>
                          <p class="font-bold text-sm text-foreground">
                            {{ formatDate(job.pickupDate) }}
                            <span
                              v-if="job.pickupTime"
                              class="text-xs font-semibold text-muted-foreground"
                              >({{ job.pickupTime }})</span
                            >
                          </p>
                        </div>
                      </div>

                      <!-- Delivery Target (Trucking Only) -->
                      <div v-if="job.serviceType === 'TRUCKING'" class="flex gap-4 items-center">
                        <div
                          class="w-10 h-10 rounded-full bg-blue-50/80 flex items-center justify-center text-[#012D5A] shrink-0 border border-blue-100"
                        >
                          <Calendar class="w-5 h-5 text-[#012D5A]/80" />
                        </div>
                        <div>
                          <p class="text-xs text-muted-foreground mb-0.5">Target Delivery</p>
                          <p class="font-bold text-sm text-foreground">
                            {{ formatDate(job.deliveryDate) }}
                            <span
                              v-if="job.deliveryTime"
                              class="text-xs font-semibold text-muted-foreground"
                              >({{ job.deliveryTime }})</span
                            >
                          </p>
                        </div>
                      </div>

                      <div class="flex gap-4 items-center">
                        <div
                          class="w-10 h-10 rounded-full bg-blue-50/80 flex items-center justify-center text-[#012D5A] shrink-0 border border-blue-100"
                        >
                          <Building2 class="w-5 h-5 text-[#012D5A]/80" />
                        </div>
                        <div>
                          <p class="text-xs text-muted-foreground mb-0.5">
                            {{
                              job.serviceType === "TRUCKING"
                                ? "Vendor"
                                : isAir
                                  ? "Airline"
                                  : "Shipping Line"
                            }}
                          </p>
                          <p class="font-bold text-sm text-foreground">{{ getVendorName }}</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <!-- Involved Parties -->
                  <section>
                    <h3 class="text-base font-bold">Involved Parties</h3>
                    <div class="grid grid-cols-2 gap-4 mt-4">
                      <div
                        v-for="party in job.jobParties"
                        :key="party.id"
                        class="p-5 rounded-xl border border-border bg-white shadow-sm hover:shadow-md transition-shadow"
                      >
                        <p
                          class="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider"
                        >
                          {{ party.partyRole?.name || party.partyRoleId }}
                        </p>
                        <p class="font-bold text-base text-foreground mb-2">
                          {{ party.companyName || party.company?.name || "-" }}
                        </p>
                        <p
                          v-if="
                            party.addressBook?.fullAddress ||
                            party.partyRole?.code === 'SHIPPER' ||
                            party.partyRole?.code === 'CONSIGNEE'
                          "
                          class="text-xs text-muted-foreground leading-relaxed whitespace-pre-line"
                        >
                          {{ getPartyAddress(party.partyRole?.code || "") }}
                        </p>
                      </div>
                      <div
                        v-if="!job.jobParties || job.jobParties.length === 0"
                        class="col-span-2 p-8 text-muted-foreground text-center bg-gray-50/50 rounded-xl border border-dashed border-border"
                      >
                        No parties assigned to this job yet.
                      </div>
                    </div>
                  </section>

                  <!-- Container -->
                  <section>
                    <h3 class="text-base font-bold">Container</h3>
                    <div class="space-y-4 mt-4">
                      <div
                        v-for="container in job.jobContainers"
                        :key="container.id"
                        class="border border-border rounded-xl p-5 shadow-sm bg-white hover:shadow-md transition-shadow"
                      >
                        <div class="flex items-start justify-between mb-8">
                          <div class="flex gap-4 items-center">
                            <div
                              class="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100"
                            >
                              <Box class="w-6 h-6 text-gray-700" />
                            </div>
                            <div>
                              <h3 class="font-bold text-base text-foreground">
                                {{ container.containerNumber || "MSKU9081234" }}
                              </h3>
                              <p class="text-xs text-muted-foreground mt-0.5">
                                Seal: {{ container.sealNumber || "ML-882211" }}
                              </p>
                            </div>
                          </div>
                          <span
                            class="px-2.5 py-1 bg-gray-100/80 text-gray-700 rounded text-xs font-semibold tracking-wide border border-gray-200"
                          >
                            {{ container.containerType?.name || container.containerTypeId || "" }}
                          </span>
                        </div>

                        <div
                          class="grid grid-cols-3 divide-x divide-border mt-4 border-t border-border pt-6"
                        >
                          <div class="text-center">
                            <p
                              class="text-xs text-muted-foreground mb-1.5 font-medium tracking-wide"
                            >
                              Packages
                            </p>
                            <p class="font-bold text-sm text-foreground">
                              {{ container.totalQty || "1" }}
                            </p>
                          </div>
                          <div class="text-center">
                            <p
                              class="text-xs text-muted-foreground mb-1.5 font-medium tracking-wide"
                            >
                              Gross Weight
                            </p>
                            <p class="font-bold text-sm text-foreground">
                              {{ container.totalGrossWeight || "-" }} KGS
                            </p>
                          </div>
                          <div class="text-center">
                            <p
                              class="text-xs text-muted-foreground mb-1.5 font-medium tracking-wide"
                            >
                              Measurement
                            </p>
                            <p class="font-bold text-sm text-foreground">
                              {{ container.totalMeasurementCbm || "-" }} CBM
                            </p>
                          </div>
                        </div>

                        <!-- Container Breakdown Items -->
                        <div
                          v-if="container.items && container.items.length > 0"
                          class="mt-6 border-t border-border pt-5"
                        >
                          <div class="flex items-center justify-between mb-4">
                            <p
                              class="text-xs font-bold text-muted-foreground tracking-widest uppercase"
                            >
                              Item Breakdown
                            </p>
                            <span
                              class="text-[10px] px-2 py-0.5 bg-muted rounded-full text-muted-foreground font-medium"
                            >
                              {{ container.items.length }} Items
                            </span>
                          </div>

                          <div class="space-y-3">
                            <div
                              v-for="(item, idx) in container.items"
                              :key="item.id || idx"
                              class="group relative flex flex-col p-4 bg-gray-50/40 border border-border rounded-xl transition-all hover:bg-white hover:shadow-md hover:border-primary/20"
                            >
                              <!-- Item Header & Main Info -->
                              <div class="flex items-start justify-between gap-4">
                                <div class="flex-1 min-w-0">
                                  <div class="flex items-center gap-2 mb-1.5">
                                    <span
                                      class="shrink-0 flex items-center justify-center w-5 h-5 bg-[#012D5A] text-white rounded text-[10px] font-bold shadow-sm"
                                    >
                                      {{ item.sequenceNo }}
                                    </span>
                                    <h4
                                      :class="[
                                        'font-semibold text-foreground transition-all duration-300',
                                        expandedItems.has(String(item.id || idx))
                                          ? 'whitespace-normal'
                                          : 'truncate',
                                      ]"
                                    >
                                      {{ item.description || "-" }}
                                    </h4>
                                  </div>
                                  <div class="flex items-center gap-2">
                                    <span
                                      class="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tighter shrink-0"
                                      >HS CODE</span
                                    >
                                    <p
                                      :class="[
                                        'text-xs font-medium text-muted-foreground transition-all duration-300',
                                        expandedItems.has(String(item.id || idx))
                                          ? 'whitespace-normal'
                                          : 'truncate',
                                      ]"
                                    >
                                      {{ item.hsCode || "-" }}
                                    </p>
                                  </div>
                                </div>

                                <!-- Toggle Button -->
                                <button
                                  @click="toggleItem(item.id || idx)"
                                  class="shrink-0 p-1.5 rounded-lg border border-border bg-white text-muted-foreground hover:text-primary hover:border-primary/30 transition-all shadow-sm"
                                >
                                  <component
                                    :is="
                                      expandedItems.has(String(item.id || idx))
                                        ? ChevronUp
                                        : ChevronDown
                                    "
                                    class="w-3.5 h-3.5"
                                  />
                                </button>
                              </div>

                              <!-- Item Metrics Grid -->
                              <div
                                class="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border/50"
                              >
                                <div class="space-y-1">
                                  <p
                                    class="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase"
                                  >
                                    Quantity
                                  </p>
                                  <p class="font-bold text-xs text-[#012D5A]">
                                    {{ item.qty }}
                                    <span class="text-[10px] font-medium opacity-70">{{
                                      item.packageTypeCode
                                    }}</span>
                                  </p>
                                </div>
                                <div class="space-y-1 px-2 border-x border-border/50">
                                  <p
                                    class="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase"
                                  >
                                    Gross / Net
                                  </p>
                                  <p class="font-bold text-xs text-[#012D5A]">
                                    {{ item.grossWeight || "-" }}
                                    <span class="text-[10px] font-medium opacity-60">/</span>
                                    {{ item.netWeight || "-" }}
                                    <span class="text-[9px] font-medium opacity-70">KG</span>
                                  </p>
                                </div>
                                <div class="space-y-1 pl-1 text-right">
                                  <p
                                    class="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase text-right"
                                  >
                                    Volume
                                  </p>
                                  <p class="font-bold text-xs text-[#012D5A]">
                                    {{ item.measurementCbm || "-" }}
                                    <span class="text-[10px] font-medium opacity-70">CBM</span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        v-if="!job.jobContainers || job.jobContainers.length === 0"
                        class="border border-dashed border-border rounded-xl p-8 text-center bg-gray-50/50"
                      >
                        <div
                          class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3"
                        >
                          <Box class="w-6 h-6 text-muted-foreground opacity-60" />
                        </div>
                        <p class="text-sm font-medium text-foreground mb-1">No Containers Found</p>
                        <p class="text-xs text-muted-foreground">
                          This job does not have any attached containers or bills of lading.
                        </p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 class="text-base font-bold mb-4 border-b pb-2">Movement Details</h3>
                    <div class="grid grid-cols-2 gap-6 text-sm">
                      <div>
                        <p class="text-muted-foreground">Cargo Movement</p>
                        <p class="font-medium">
                          {{ job.cargoMovement?.name || job.cargoMovementId || "-" }}
                        </p>
                      </div>
                      <div>
                        <p class="text-muted-foreground">Delivery Movement</p>
                        <p class="font-medium">
                          {{ job.deliveryMovement?.name || job.deliveryMovementId || "-" }}
                        </p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 class="text-base font-bold mb-4 border-b pb-2">Cargo Information</h3>
                    <div class="grid grid-cols-1 gap-6 text-sm">
                      <div>
                        <p class="text-muted-foreground">Main Description</p>
                        <p class="font-medium whitespace-pre-wrap">
                          {{ job.mainDescription || "-" }}
                        </p>
                      </div>
                      <div>
                        <p class="text-muted-foreground">Shipping Mark</p>
                        <p class="font-medium whitespace-pre-wrap">{{ job.shippingMark || "-" }}</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 class="text-base font-bold mb-4 border-b pb-2">Weight & Measurement</h3>
                    <div class="grid grid-cols-3 gap-6 text-sm">
                      <div>
                        <p class="text-muted-foreground">Gross Weight</p>
                        <p class="font-medium">{{ job.grossWeight || "-" }} KGS</p>
                      </div>
                      <div>
                        <p class="text-muted-foreground">Net Weight</p>
                        <p class="font-medium">{{ job.netWeight || "-" }} KGS</p>
                      </div>
                      <div>
                        <p class="text-muted-foreground">Measurement</p>
                        <p class="font-medium">{{ job.measurement || "-" }} CBM</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 class="text-base font-bold mb-4 border-b pb-2">BL Setup</h3>
                    <div class="grid grid-cols-2 gap-6 text-sm">
                      <div>
                        <p class="text-muted-foreground">Total BL Count</p>
                        <p class="font-medium">{{ job.totalBlCount || "-" }}</p>
                      </div>
                    </div>
                  </section>
                </div>

                <div
                  v-else-if="isDraft"
                  class="flex flex-col items-center justify-center py-20 text-center"
                >
                  <div
                    class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4"
                  >
                    <Settings class="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 class="text-lg font-bold text-foreground">Menu Terkunci</h3>
                  <p class="text-sm text-muted-foreground max-w-sm mt-1">
                    Silakan aktifkan job terlebih dahulu untuk mengakses menu ini.
                  </p>
                  <button
                    @click="handleActivateJob"
                    :disabled="isActivating"
                    class="mt-6 px-4 py-2 bg-[#012D5A] text-white rounded-md text-sm font-semibold hover:bg-[#012D5A]/90 transition-colors flex items-center gap-2"
                  >
                    <Loader2 v-if="isActivating" class="w-4 h-4 animate-spin" />
                    Aktifkan Sekarang
                  </button>
                </div>

                <!-- Finance Tab (AR & AP) -->
                <div
                  v-else-if="activeTab === 'finance'"
                  class="space-y-8 animate-fade-in pb-12 pt-4"
                >
                  <JobFinanceTab
                    :job-id="job.id"
                    :job-number="job.jobNumber"
                    :customer-id="job.customerId || undefined"
                    :job-parties="job.jobParties"
                    :initial-invoice-id="initialInvoiceId"
                    :initial-sub-tab="initialSubTab"
                    @refresh-job="getJob(props.jobId)"
                    :is-completed="isCompleted"
                  />
                </div>

                <!-- eBL Tab -->
                <div v-else-if="activeTab === 'ebl'" class="space-y-8 animate-fade-in pb-12 pt-4">
                  <JobEblTab
                    :job="job as ActiveJobData"
                    :initial-bl-id="initialBlId"
                    @refresh="getJob(props.jobId)"
                    :is-completed="isCompleted"
                    :can-manage-job="canManage"
                  />
                </div>

                <!-- Document Tab -->
                <div
                  v-else-if="activeTab === 'document'"
                  class="space-y-8 animate-fade-in pb-12 pt-4"
                >
                  <JobDocumentTab :job-id="job.id" />
                </div>

                <div v-else class="py-12 text-center text-muted-foreground">
                  <p>{{ tabs.find((t) => t.id === activeTab)?.label }} content coming soon.</p>
                </div>
              </div>
            </div>

            <!-- Footer Actions -->
            <div class="p-4 border-t border-border flex justify-end bg-white shrink-0">
              <div class="flex gap-3">
                <NuxtLink
                  v-if="canManage && job?.id"
                  :to="`/operational/jobs/${job.id}/edit`"
                  @click="$emit('update:modelValue', false)"
                  class="px-4 py-2 font-medium border border-border hover:bg-muted text-foreground rounded-md transition-colors flex items-center gap-2 text-sm shadow-sm"
                >
                  <Edit class="w-4 h-4" /> Edit Job
                </NuxtLink>
              </div>
            </div>
          </div>

          <div v-else class="flex-1 flex items-center justify-center text-muted-foreground">
            Job not found
          </div>
        </div>
      </div>
    </Transition>

    <!-- Quick Add Vessel Modal -->
    <VesselQuickAddModal
      v-model:is-open="isVesselModalOpen"
      :initial-name="presetVesselName"
      @success="onVesselCreateSuccess"
    />

    <!-- Quick Add Plane Modal -->
    <PlaneQuickAddModal
      v-model:is-open="isPlaneModalOpen"
      :initial-name="presetPlaneName"
      @success="onPlaneCreateSuccess"
    />
  </Teleport>
</template>

<style scoped>
.slide-over-enter-active {
  transition: opacity 0.4s ease;
}

.slide-over-leave-active {
  transition: opacity 0.3s ease;
}

.slide-over-enter-from,
.slide-over-leave-to {
  opacity: 0;
}

.slide-panel {
  will-change: transform;
}

.slide-over-enter-active .slide-panel {
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-over-leave-active .slide-panel {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-over-enter-from .slide-panel,
.slide-over-leave-to .slide-panel {
  transform: translateX(100%);
}
</style>
