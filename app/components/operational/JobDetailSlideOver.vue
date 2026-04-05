<script setup lang="ts">
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
} from "lucide-vue-next";
import JobInvoiceTab from "./JobInvoiceTab.vue";
import JobEblTab from "./JobEblTab.vue";
import { useAuth } from "~/composables/useAuth";
const { canApproveJobs } = useAuth();
import Combobox from "~/components/ui/Combobox.vue";
import DatePicker from "~/components/ui/DatePicker.vue";
import { toast } from "vue-sonner";
import type { EblVessel } from "./ebl/types";
import type { Vessel } from "~/composables/useMasterData";

interface Props {
  modelValue: boolean;
  jobId: string;
  initialTab?: string;
  initialBlId?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const { currentJob, getJob, isLoading } = useJobs();

const activeTab = ref("overview");
const tabs = [
  { id: "overview", label: "Overview" },
  { id: "ebl", label: "eBL" },
  { id: "invoice", label: "Invoice" },
];

const { updateJob } = useJobs();
const { fetchVessels, createVessel } = useMasterData();
const { confirm } = useConfirm();

const isEditingVessels = ref(false);
const editableVessels = ref<EblVessel[]>([]);
const masterVessels = ref<Vessel[]>([]);

const refreshMasterData = async () => {
  masterVessels.value = await fetchVessels();
};

const handleCreateVessel = async (name: string, vessel?: EblVessel) => {
  const isConfirmed = await confirm({
    title: "Create New Vessel",
    message: `Are you sure you want to create a new vessel named "${name}"?`,
    confirmText: "Create Vessel",
    type: "info",
  });
  if (!isConfirmed) return;

  const result = await createVessel(name);
  if (result.success && result.data) {
    await refreshMasterData();
    if (vessel) {
      vessel.vesselId = result.data.id;
    }
    toast.success(`Vessel "${name}" created successfully.`);
  } else {
    toast.error("Failed to create vessel: " + (result.error || "Unknown error"));
  }
};

const startEditVessels = () => {
  editableVessels.value = JSON.parse(JSON.stringify(job.value?.vessels || []));
  isEditingVessels.value = true;
};

const cancelEditVessels = () => {
  isEditingVessels.value = false;
};

const addVessel = () => {
  editableVessels.value.push({
    vesselName: "",
    voyageNumber: "",
    etd: new Date().toISOString().split("T")[0],
    sequence: editableVessels.value.length + 1,
  });
};

const removeVessel = (idx: number) => {
  editableVessels.value.splice(idx, 1);
};

const saveVessels = async () => {
  if (!props.jobId) return;
  const res = await updateJob(props.jobId, { vessels: editableVessels.value });
  if (res.success) {
    isEditingVessels.value = false;
    await getJob(props.jobId);
  }
};

const job = computed(() => currentJob.value);

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
  const name = job.value?.status?.name || "Not Invoiced";
  return name.toUpperCase() === "CONFIRMED" ? "FINALIZED" : name;
});
const getJobTypeName = computed(
  () => job.value?.tradeType?.name || job.value?.tradeTypeId || "Export",
);
const getVesselName = computed(() => job.value?.vessel?.name || job.value?.vesselId || "-");
const getServiceName = computed(
  () => job.value?.service?.name || job.value?.serviceId || "Ocean Freight",
);
const getVendorName = computed(() => job.value?.vendor?.name || "PT Nova Sync Continent");
const getPol = computed(() => {
  if (!job.value?.pol) return "-";
  if (job.value.polName) return `${job.value.polName} (${job.value.pol})`;
  return job.value.pol;
});

const getPod = computed(() => {
  if (!job.value?.pod) return "-";
  if (job.value.podName) return `${job.value.podName} (${job.value.pod})`;
  return job.value.pod;
});
const getTotalContainers = computed(() => job.value?.totalBlCount || 2);

const getPartyAddress = (roleCode: string) => {
  const party = job.value?.jobParties?.find((p) => p.partyRole?.code === roleCode);
  if (!party) return "-";

  if (party.addressBook?.fullAddress) {
    return party.addressBook.fullAddress;
  }

  if (roleCode === "SHIPPER")
    return "No. 88 Jinxiu Road, Pudong new District\nShanghai China 200120";
  if (roleCode === "CONSIGNEE")
    return "No. 88 Jinxiu Road, Pudong new District\nLos Angeles US 200120";

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
</script>

<template>
  <div v-if="modelValue" class="fixed inset-0 top-10 z-[999] flex justify-end">
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-black/40 transition-opacity"
      @click="$emit('update:modelValue', false)"
    ></div>

    <!-- Drawer Panel -->
    <div
      class="relative w-full max-w-5xl bg-white h-full shadow-2xl flex flex-col animate-slide-in-right"
    >
      <!-- Header -->
      <div
        class="px-6 pt-5 pb-4 border-b border-border flex items-center justify-between shrink-0 bg-white z-20"
      >
        <div class="flex items-center gap-2 text-sm text-muted-foreground font-medium">
          Job <span class="mx-1">›</span>
          <span class="text-foreground">{{ job?.jobNumber || "..." }}</span>
        </div>
        <div class="flex items-center gap-2">
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
                  class="inline-flex items-center px-3 py-1 rounded-md text-xs font-bold leading-none bg-yellow-100 text-yellow-800 border border-yellow-200"
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
                <CalendarClock class="w-4 h-4" /> ETD - ETA
              </div>
              <div class="font-medium">{{ formatDate(job.etd) }} - {{ formatDate(job.eta) }}</div>
            </div>
          </div>

          <!-- Tabs -->
          <div class="px-8 mt-6 pt-4 border-b border-border flex gap-6 sticky top-0 bg-white z-10">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="pb-3 text-sm font-medium transition-colors relative"
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
            <!-- Overview Tab -->
            <div v-if="activeTab === 'overview'" class="space-y-8 animate-fade-in">
              <section>
                <h3 class="text-base font-bold">Shipments Details</h3>
                <div class="grid grid-cols-2 gap-x-8 gap-y-6 mt-6">
                  <div class="flex gap-4 items-center">
                    <div
                      class="w-10 h-10 rounded-full bg-blue-50/80 flex items-center justify-center text-[#012D5A] shrink-0 border border-blue-100"
                    >
                      <Building2 class="w-5 h-5 text-[#012D5A]/80" />
                    </div>
                    <div>
                      <p class="text-xs text-muted-foreground mb-0.5">Port of Landing</p>
                      <p class="font-bold text-sm text-foreground">{{ getPol }}</p>
                    </div>
                  </div>

                  <div class="flex gap-4 items-center">
                    <div
                      class="w-10 h-10 rounded-full bg-blue-50/80 flex items-center justify-center text-[#012D5A] shrink-0 border border-blue-100"
                    >
                      <Building2 class="w-5 h-5 text-[#012D5A]/80" />
                    </div>
                    <div>
                      <p class="text-xs text-muted-foreground mb-0.5">Port of Discharge</p>
                      <p class="font-bold text-sm text-foreground">{{ getPod }}</p>
                    </div>
                  </div>

                  <div class="flex gap-4 items-start col-span-2">
                    <div
                      class="w-10 h-10 rounded-full bg-blue-50/80 flex items-center justify-center text-[#012D5A] shrink-0 border border-blue-100"
                    >
                      <Ship class="w-5 h-5 text-[#012D5A]/80" />
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center justify-between mb-2">
                        <p class="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                          Vessel Schedule
                        </p>
                        <div v-if="!isEditingVessels" class="flex items-center gap-2">
                          <button
                            @click="startEditVessels"
                            class="p-1.5 rounded-md hover:bg-blue-50 text-[#012D5A] transition-colors"
                            title="Edit Schedule"
                          >
                            <Edit class="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div v-else class="flex items-center gap-2">
                          <button
                            @click="addVessel"
                            class="flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors text-[10px] font-bold uppercase tracking-wider"
                          >
                            <Plus class="w-3 h-3" /> Add
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
                          v-for="(vessel, idx) in job.vessels"
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
                                {{ vessel.vesselName || vessel.vessel?.name || "Unknown Vessel" }}
                              </p>
                              <p class="text-[11px] text-muted-foreground">
                                Voyage: {{ vessel.voyageNumber || "-" }}
                              </p>
                            </div>
                          </div>
                          <div class="text-right">
                            <p
                              class="text-[11px] font-bold text-primary uppercase tracking-tighter"
                            >
                              ETD
                            </p>
                            <p class="text-xs font-semibold text-foreground">
                              {{ formatDate(vessel.etd) }}
                            </p>
                          </div>
                        </div>
                        <div
                          v-if="!job.vessels || job.vessels.length === 0"
                          class="text-sm font-medium text-muted-foreground italic"
                        >
                          No vessels assigned
                        </div>
                      </div>

                      <!-- Edit Mode -->
                      <div v-else class="space-y-4">
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
                                >Vessel Name</label
                              >
                              <Combobox
                                v-model="vessel.vesselId"
                                :options="masterVessels"
                                label-key="name"
                                value-key="id"
                                placeholder="Search Vessel..."
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
                                  >ETD</label
                                >
                                <DatePicker
                                  v-model="vessel.etd"
                                  placeholder="ETD..."
                                  class="h-8 shadow-none"
                                />
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

                  <div class="flex gap-4 items-center">
                    <div
                      class="w-10 h-10 rounded-full bg-blue-50/80 flex items-center justify-center text-[#012D5A] shrink-0 border border-blue-100"
                    >
                      <Mail class="w-5 h-5 text-[#012D5A]/80" />
                    </div>
                    <div>
                      <p class="text-xs text-muted-foreground mb-0.5">Shipping Line</p>
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
                        (party as any).addressBook?.fullAddress ||
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
                        <p class="text-xs text-muted-foreground mb-1.5 font-medium tracking-wide">
                          Packages
                        </p>
                        <p class="font-bold text-sm text-foreground">
                          {{ container.totalQty || "1" }}
                        </p>
                      </div>
                      <div class="text-center">
                        <p class="text-xs text-muted-foreground mb-1.5 font-medium tracking-wide">
                          Gross Weight
                        </p>
                        <p class="font-bold text-sm text-foreground">
                          {{ container.totalGrossWeight || "-" }} KGS
                        </p>
                      </div>
                      <div class="text-center">
                        <p class="text-xs text-muted-foreground mb-1.5 font-medium tracking-wide">
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
                          <div class="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border/50">
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
                    <p class="text-muted-foreground">Commodity</p>
                    <p class="font-medium">{{ job.commodity || "-" }}</p>
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

            <!-- Invoice Tab -->
            <div v-else-if="activeTab === 'invoice'" class="space-y-8 animate-fade-in pb-12 pt-4">
              <JobInvoiceTab
                :job-id="job.id"
                :job-number="job.jobNumber"
                :customer-id="job.customerId || undefined"
              />
            </div>

            <!-- eBL Tab -->
            <div v-else-if="activeTab === 'ebl'" class="space-y-8 animate-fade-in pb-12 pt-4">
              <JobEblTab
                :job="job as any"
                :initial-bl-id="initialBlId"
                @refresh="getJob(props.jobId)"
              />
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
              v-if="job?.id"
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
</template>
