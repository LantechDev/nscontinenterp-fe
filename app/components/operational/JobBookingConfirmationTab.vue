<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any -- loose job/BC snapshot data */
import { ref, computed, watch, onMounted } from "vue";
import {
  Loader2,
  Edit,
  Save,
  X,
  CheckCircle2,
  RotateCcw,
  AlertTriangle,
  Download,
  Plus,
  Trash2,
  FileText,
  ArrowLeft,
} from "lucide-vue-next";
import { toast } from "vue-sonner";

import JobBcPreview from "./booking-confirmation/JobBcPreview.vue";
import JobBcEditForm from "./booking-confirmation/JobBcEditForm.vue";
import type { BookingConfirmationForm } from "./booking-confirmation/JobBcEditForm.vue";
import {
  useBookingConfirmation,
  type BookingConfirmation,
} from "~/composables/useBookingConfirmation";
import { buildBcDocumentEditForm, createEmptyBcDocumentForm } from "~/utils/bcDocumentForm";

const props = defineProps<{
  job: any;
  canManageJob?: boolean;
}>();

const {
  isLoading,
  fetchBookingConfirmations,
  createBookingConfirmation,
  updateBookingConfirmationDraftById,
  copyBookingConfirmationFromJobById,
  finalizeBookingConfirmationById,
  unfinalizeBookingConfirmationById,
  deleteBookingConfirmation,
} = useBookingConfirmation();

const { confirm } = useConfirm();
const bcData = ref<BookingConfirmation | null>(null);
const bcList = ref<BookingConfirmation[]>([]);
const isFetching = ref(false);
const isSaving = ref(false);
const isCreating = ref(false);
const editMode = ref(false);
const previewRef = ref<InstanceType<typeof JobBcPreview> | null>(null);

const replaceActiveBc = (bc: BookingConfirmation) => {
  bcData.value = bc;
  const idx = bcList.value.findIndex((item) => item.id === bc.id);
  if (idx === -1) bcList.value = [bc, ...bcList.value];
  else bcList.value[idx] = bc;
};

const selectBc = (bc: BookingConfirmation) => {
  if (editMode.value && bcData.value?.id !== bc.id) editMode.value = false;
  bcData.value = bc;
};

const closeBc = () => {
  bcData.value = null;
  editMode.value = false;
};

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    const parts = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).formatToParts(d);
    return `${parts.find((p) => p.type === "day")?.value} ${parts.find((p) => p.type === "month")?.value.toUpperCase()} ${parts.find((p) => p.type === "year")?.value}`;
  } catch {
    return dateStr;
  }
};

const getBcStatusClass = (status?: string | null) =>
  status === "finalized"
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : "bg-amber-50 text-amber-700 border-amber-200";

const editForm = ref<BookingConfirmationForm>(createEmptyBcDocumentForm());

const isFinalized = computed(() => bcData.value?.status === "finalized");

const REQUIRED_FIELDS: Array<{ key: keyof BookingConfirmation; label: string }> = [
  { key: "bookingNumber", label: "Booking Number" },
  { key: "warehouseDepotName", label: "Warehouse/Depot Name" },
];

const missingFields = computed(() => {
  if (!bcData.value) return [];
  return REQUIRED_FIELDS.filter((f) => {
    const v = bcData.value?.[f.key];
    return v === null || v === undefined || String(v).trim() === "";
  }).map((f) => f.label);
});

const isComplete = computed(() => missingFields.value.length === 0);

const loadData = async () => {
  if (!props.job?.id) return;
  isFetching.value = true;
  const res = await fetchBookingConfirmations(props.job.id);
  if (res.success) {
    bcList.value = res.data || [];
    bcData.value = null;
  }
  isFetching.value = false;
};

onMounted(() => {
  loadData();
});

const handleCreateDraft = async () => {
  if (!props.job?.id) return;
  isCreating.value = true;
  const res = await createBookingConfirmation(props.job.id);
  if (res.success && res.data) {
    replaceActiveBc(res.data);
    toast.success("Draft booking confirmation created.");
  } else {
    toast.error(res.error || "Failed to create booking confirmation.");
  }
  isCreating.value = false;
};

const toggleEditMode = () => {
  if (editMode.value) {
    editMode.value = false;
    return;
  }
  if (isFinalized.value) return;

  if (bcData.value) {
    editForm.value = buildBcDocumentEditForm({
      document: bcData.value,
      job: props.job || {},
    });
  }
  editMode.value = true;
};

const buildDraftPayload = () => {
  const f = editForm.value;
  const parties = [
    { partyRoleCode: "SHIPPER", companyId: f.shipperId, addressBookId: f.shipperAddressId },
    { partyRoleCode: "CONSIGNEE", companyId: f.consigneeId, addressBookId: f.consigneeAddressId },
    {
      partyRoleCode: "NOTIFY_PARTY",
      companyId: f.notifyPartyId,
      addressBookId: f.notifyPartyAddressId,
    },
  ].filter((p) => p.companyId);

  return {
    bookingNumber: f.bookingNumber,
    bookingDate: f.bookingDate,
    serviceContractNo: f.serviceContractNo,
    warehouseDepotName: f.warehouseDepotName,
    warehouseDepotAddress: f.warehouseDepotAddress,
    pickupLocation: f.pickupLocation,
    cutoffDate: f.cutoffDate,
    cutoffTime: f.cutoffTime,
    remarks: f.remarks,

    pol: f.pol || null,
    pod: f.pod || null,
    preCarriageBy: f.preCarriageBy || null,
    placeOfReceipt: f.placeOfReceipt || null,
    placeOfDelivery: f.placeOfDelivery || null,
    finalDestination: f.finalDestination || null,
    cargoMovementId: f.cargoMovementId || null,
    deliveryMovementId: f.deliveryMovementId || null,
    mainDescription: f.mainDescription || null,
    shippingMark: f.shippingMark || null,
    // DATE LADEN ON BOARD prints from the feeder (first) leg's ETD.
    etd: f.vessels?.[0]?.etd || null,
    eta: f.eta || null,
    dateCargoReceived: f.dateCargoReceived || null,
    freightPayment: f.freightPayment || null,
    prepaidValue: f.prepaidValue || null,
    collectValue: f.collectValue || null,
    shipperReferences: f.shipperReferences || [],
    showShipperReferencesOnBc: f.showShipperReferencesOnBc,

    parties,
    vessels: (f.vessels || []).map((v, idx) => ({
      vesselId: v.vesselId || null,
      vesselName: v.vesselName || null,
      voyageNumber: v.voyageNumber || null,
      tsPortId: v.tsPortId || null,
      etd: v.etd || null,
      eta: v.eta || null,
      sequence: v.sequence ?? idx,
      vesselType: v.vesselType || (idx === 0 ? "feeder" : "mother"),
    })),
    containers: (f.containers || []).map((c) => ({
      containerNumber: c.containerNumber || "",
      sealNumber: c.sealNumber || null,
      containerTypeId: c.containerTypeId || null,
      vehicleNumber: c.vehicleNumber || null,
      driverName: c.driverName || null,
      driverContactNumber: c.driverContactNumber || null,
      isHazardous: c.isHazardous || false,
      items: (c.items || []).map((it, i) => ({
        sequenceNo: it.sequenceNo ?? i + 1,
        qty: Number(it.qty) || 1,
        packageTypeCode: it.packageTypeCode || "",
        grossWeight: it.grossWeight ?? undefined,
        netWeight: it.netWeight ?? undefined,
        measurementCbm: it.measurementCbm ?? undefined,
        description: it.description || "",
        hsCode: it.hsCode || "",
      })),
    })),
  };
};

const handleSave = async () => {
  if (!bcData.value?.id) return;
  isSaving.value = true;
  const res = await updateBookingConfirmationDraftById(bcData.value.id, buildDraftPayload());
  if (res.success && res.data) {
    replaceActiveBc(res.data);
    editMode.value = false;
    toast.success("Booking confirmation saved successfully.");
  } else {
    toast.error(res.error || "Failed to save booking confirmation.");
  }
  isSaving.value = false;
};

const isCopying = ref(false);
const handleCopyFromJob = async () => {
  if (!bcData.value?.id) return;
  const proceed = await confirm({
    title: "Copy from Job?",
    message:
      "This overwrites the Booking Confirmation's parties, containers, vessels and routing with the current Job data. Continue?",
    confirmText: "Yes, Copy",
  });
  if (!proceed) return;

  isCopying.value = true;
  const res = await copyBookingConfirmationFromJobById(bcData.value.id);
  if (res.success && res.data) {
    replaceActiveBc(res.data);
    if (editMode.value) {
      editMode.value = false;
      toggleEditMode();
    }
    toast.success("Copied shipment data from Job.");
  } else {
    toast.error(res.error || "Failed to copy from Job.");
  }
  isCopying.value = false;
};

const handleFinalize = async () => {
  if (!bcData.value?.id) return;
  if (!isComplete.value) {
    toast.error(`Please complete required fields first: ${missingFields.value.join(", ")}`);
    return;
  }
  const proceed = await confirm({
    title: "Finalize Booking Confirmation?",
    message: "Once finalized, you cannot edit it until it is unfinalized.",
    confirmText: "Yes, Finalize",
  });
  if (!proceed) return;

  const res = await finalizeBookingConfirmationById(bcData.value.id);
  if (res.success && res.data) {
    replaceActiveBc(res.data);
    toast.success("Booking confirmation finalized.");
  } else {
    toast.error(res.error || "Failed to finalize.");
  }
};

const handleUnfinalize = async () => {
  if (!bcData.value?.id) return;
  const proceed = await confirm({
    title: "Unfinalize Booking Confirmation?",
    message: "This will change the status back to Draft so you can edit it.",
    confirmText: "Yes, Unfinalize",
  });
  if (!proceed) return;

  const res = await unfinalizeBookingConfirmationById(bcData.value.id);
  if (res.success && res.data) {
    replaceActiveBc(res.data);
    toast.success("Booking confirmation unfinalized.");
  } else {
    toast.error(res.error || "Failed to unfinalize.");
  }
};

const handleDelete = async () => {
  if (!bcData.value?.id) return;
  if (isFinalized.value) {
    toast.error("Finalized booking confirmation cannot be deleted.");
    return;
  }
  const proceed = await confirm({
    title: "Delete Booking Confirmation?",
    message: "Hapus booking confirmation ini?",
    confirmText: "Delete",
  });
  if (!proceed) return;

  const deletingId = bcData.value.id;
  const res = await deleteBookingConfirmation(deletingId);
  if (res.success) {
    bcList.value = bcList.value.filter((bc) => bc.id !== deletingId);
    bcData.value = null;
    editMode.value = false;
    toast.success("Booking confirmation deleted.");
  } else {
    toast.error(res.error || "Failed to delete booking confirmation.");
  }
};
</script>

<template>
  <div class="space-y-6 relative">
    <UiLoadingSkeleton v-if="isFetching" variant="form" />

    <template v-else-if="!bcData">
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-base font-bold text-foreground">Booking Confirmation</h3>
          </div>
          <button
            v-if="canManageJob"
            @click="handleCreateDraft"
            :disabled="isCreating"
            class="px-3 py-2 rounded-md text-xs font-semibold transition-colors flex items-center gap-2 bg-[#012D5A] text-white hover:bg-[#012D5A]/90 disabled:opacity-50"
          >
            <Loader2 v-if="isCreating" class="w-4 h-4 animate-spin" />
            <Plus v-else class="w-4 h-4" />
            ADD BC
          </button>
        </div>

        <div
          v-if="bcList.length === 0"
          class="border border-dashed border-border rounded-xl p-10 text-center bg-gray-50/50"
        >
          <div
            class="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4 border border-border"
          >
            <FileText class="w-6 h-6 text-muted-foreground opacity-40" />
          </div>
          <p class="text-sm font-semibold text-foreground mb-1">
            No Booking Confirmation available
          </p>
          <p class="text-xs text-muted-foreground max-w-[260px] mx-auto leading-relaxed">
            There are no booking confirmations linked to this job yet.
          </p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="bc in bcList"
            :key="bc.id"
            @click="selectBc(bc)"
            class="group p-4 rounded-xl border border-border bg-white hover:border-[#012D5A]/30 hover:shadow-md transition-all cursor-pointer"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span
                    class="font-bold text-sm text-foreground group-hover:text-[#012D5A] transition-colors flex items-center gap-1.5"
                  >
                    {{ bc.bookingNumber || "Draft Booking Confirmation" }}
                    <ArrowLeft
                      class="w-3 h-3 rotate-180 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </span>
                </div>
                <p class="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                  Created on {{ formatDate(bc.createdAt) }}
                </p>
              </div>
              <div class="flex items-center gap-2">
                <span
                  class="px-2.5 py-1 rounded-md text-[10px] font-bold border uppercase tracking-widest leading-none"
                  :class="getBcStatusClass(bc.status)"
                >
                  {{ bc.status || "draft" }}
                </span>
              </div>
            </div>

            <div class="border-t border-border pt-4">
              <p
                class="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider font-semibold"
              >
                Cargo Description
              </p>
              <p class="text-sm text-foreground line-clamp-2">
                {{ bc.mainDescription || "-" }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-6 mb-6"
      >
        <!-- Header Title -->
        <div class="flex items-start gap-4">
          <button
            @click="closeBc"
            class="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shrink-0 mt-0.5"
          >
            <ArrowLeft class="w-5 h-5" />
          </button>
          <div class="flex flex-col gap-2 mt-1">
            <h1 class="text-2xl font-bold text-foreground leading-none">
              {{ bcData.bookingNumber || "Booking Confirmation Details" }}
            </h1>
            <p class="text-sm text-muted-foreground leading-none mb-1">
              Review and manage your booking confirmation details
            </p>
            <div class="flex items-center gap-3">
              <span
                class="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border leading-none max-w-fit"
                :class="
                  isFinalized
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    : 'bg-amber-50 text-amber-600 border-amber-100'
                "
              >
                {{ isFinalized ? "Finalized" : "Draft" }}
              </span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-wrap items-center justify-end gap-3 shrink-0">
          <template v-if="bcData && !editMode">
            <button
              @click="previewRef?.handleExportPdf"
              :disabled="previewRef?.isGeneratingPDF || !job"
              class="px-4 py-2 bg-[#012D5A] hover:bg-[#012D5A]/90 text-white rounded-md shadow-sm text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Loader2 v-if="previewRef?.isGeneratingPDF" class="w-3.5 h-3.5 animate-spin" />
              <Download v-else class="w-3.5 h-3.5" />
              {{ previewRef?.isGeneratingPDF ? "Generating..." : "Download PDF" }}
            </button>
            <button
              v-if="isFinalized && canManageJob"
              @click="handleUnfinalize"
              :disabled="isLoading"
              class="px-4 py-2 text-xs font-semibold rounded-md border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 flex items-center gap-2 shadow-sm transition-colors"
            >
              <RotateCcw class="w-3.5 h-3.5" />
              Unfinalize
            </button>
            <button
              v-else-if="!isFinalized && canManageJob"
              @click="handleFinalize"
              :disabled="isLoading || !isComplete"
              :title="!isComplete ? `Missing required fields: ${missingFields.join(', ')}` : ''"
              class="px-4 py-2 text-xs font-semibold rounded-md border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 class="w-3.5 h-3.5" />
              Finalize
            </button>

            <button
              v-if="!isFinalized && canManageJob"
              @click="toggleEditMode"
              class="px-4 py-2 text-xs font-semibold rounded-md border border-border bg-white hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-colors"
            >
              <Edit class="w-3.5 h-3.5" />
              Edit
            </button>
            <button
              v-if="!isFinalized && canManageJob"
              @click="handleDelete"
              class="px-4 py-2 text-xs font-semibold rounded-md border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 flex items-center gap-2 shadow-sm transition-colors"
            >
              <Trash2 class="w-3.5 h-3.5" />
              Delete
            </button>
          </template>

          <template v-else-if="bcData && editMode">
            <button
              @click="handleCopyFromJob"
              :disabled="isSaving || isCopying"
              class="px-4 py-2 text-xs font-semibold rounded-md border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50"
              title="Overwrite this Booking Confirmation's snapshot with current Job data"
            >
              <Loader2 v-if="isCopying" class="w-3.5 h-3.5 animate-spin" />
              <RotateCcw v-else class="w-3.5 h-3.5" />
              Copy from Job
            </button>
          </template>
        </div>
      </div>

      <div>
        <div v-if="editMode && bcData" class="w-full relative">
          <JobBcEditForm v-model="editForm" :jobData="job" />

          <div
            class="sticky bottom-0 z-20 -mx-8 mt-6 flex items-center justify-end gap-3 border-t border-border bg-white/95 px-8 py-4 backdrop-blur-sm"
          >
            <button
              type="button"
              @click="toggleEditMode"
              :disabled="isSaving"
              class="px-4 py-2 text-xs font-semibold rounded-md border border-border bg-white hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50"
            >
              <X class="w-3.5 h-3.5" />
              Cancel Edit
            </button>
            <button
              type="button"
              @click="handleSave"
              :disabled="isSaving"
              class="px-4 py-2 bg-[#012D5A] hover:bg-[#012D5A]/90 text-white rounded-md shadow-sm text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Loader2 v-if="isSaving" class="w-3.5 h-3.5 animate-spin" />
              <Save v-else class="w-3.5 h-3.5" />
              {{ isSaving ? "Saving..." : "Save Changes" }}
            </button>
          </div>
        </div>
        <div v-else-if="bcData">
          <JobBcPreview ref="previewRef" :bcData="bcData" :jobData="job" />
        </div>
      </div>
    </template>
  </div>
</template>
