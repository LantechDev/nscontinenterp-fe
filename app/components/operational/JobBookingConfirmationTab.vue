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
} from "lucide-vue-next";
import { toast } from "vue-sonner";

import JobBcPreview from "./booking-confirmation/JobBcPreview.vue";
import JobBcEditForm from "./booking-confirmation/JobBcEditForm.vue";
import type { BookingConfirmationForm } from "./booking-confirmation/JobBcEditForm.vue";
import {
  useBookingConfirmation,
  type BookingConfirmation,
} from "~/composables/useBookingConfirmation";

const props = defineProps<{
  job: any;
  canManageJob?: boolean;
}>();

const {
  isLoading,
  getBookingConfirmation,
  createBookingConfirmation,
  updateBookingConfirmationDraft,
  copyBookingConfirmationFromJob,
  finalizeBookingConfirmation,
  unfinalizeBookingConfirmation,
} = useBookingConfirmation();

const { confirm } = useConfirm();
const bcData = ref<BookingConfirmation | null>(null);
const isFetching = ref(false);
const isSaving = ref(false);
const isCreating = ref(false);
const editMode = ref(false);
const previewRef = ref<InstanceType<typeof JobBcPreview> | null>(null);

const createEmptyForm = (): BookingConfirmationForm => ({
  bookingNumber: "",
  bookingDate: null,
  serviceContractNo: "",
  warehouseDepotName: "",
  warehouseDepotAddress: "",
  pickupLocation: "",
  cutoffDate: null,
  cutoffTime: "",
  remarks: "",
  shipperId: "",
  shipperAddressId: "",
  consigneeId: "",
  consigneeAddressId: "",
  notifyPartyId: "",
  notifyPartyAddressId: "",
  isNotifySameAsConsignee: false,
  mainDescription: "",
  shippingMark: "",
  pol: "",
  pod: "",
  cargoMovementId: "",
  deliveryMovementId: "",
  eta: "",
  dateCargoReceived: "",
  freightPayment: "",
  prepaidValue: "",
  collectValue: "",
  shipperReferences: [],
  showShipperReferencesOnBc: true,
  vessels: [],
  containers: [],
});

const editForm = ref<BookingConfirmationForm>(createEmptyForm());

const findParty = (roleCode: string) =>
  (bcData.value?.parties || []).find((p) => (p.partyRole?.code || p.partyRoleCode) === roleCode);

const toNum = (v: unknown): number | null => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
};

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
  const res = await getBookingConfirmation(props.job.id);
  if (res.success && res.data) {
    bcData.value = res.data;
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
    bcData.value = res.data;
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
    const bc = bcData.value;
    const job: any = props.job || {};
    const jobParties: any[] = job.jobParties || [];

    // Seed each section from the BC's own snapshot first; fall back to the live Job
    // when the BC hasn't been populated yet, so the form opens pre-filled (not blank).
    // Saving still writes only to the BC's own tables — the Job stays untouched.
    const pickParty = (role: string) => {
      const bcP = findParty(role);
      if (bcP?.companyId)
        return { companyId: bcP.companyId || "", addressBookId: bcP.addressBookId || "" };
      const jp = jobParties.find((p: any) => (p.partyRole?.code || p.partyRoleCode) === role);
      if (jp)
        return {
          companyId: jp.companyId || jp.company?.id || "",
          addressBookId: jp.addressBookId || jp.addressBook?.id || "",
        };
      return { companyId: "", addressBookId: "" };
    };

    const shipper = pickParty("SHIPPER");
    const consignee = pickParty("CONSIGNEE");
    const notify = pickParty("NOTIFY_PARTY");

    const vesselSrc: any[] = bc.vessels?.length ? bc.vessels : job.vessels || [];
    const containerSrc: any[] = bc.containers?.length ? bc.containers : job.jobContainers || [];

    editForm.value = {
      ...createEmptyForm(),
      // BC-only general fields (no Job fallback)
      bookingNumber: bc.bookingNumber || "",
      bookingDate: bc.bookingDate || null,
      serviceContractNo: bc.serviceContractNo || "",
      warehouseDepotName: bc.warehouseDepotName || "",
      warehouseDepotAddress: bc.warehouseDepotAddress || "",
      pickupLocation: bc.pickupLocation || "",
      cutoffDate: bc.cutoffDate || null,
      cutoffTime: bc.cutoffTime || "",
      remarks: bc.remarks || "",

      shipperId: shipper.companyId,
      shipperAddressId: shipper.addressBookId,
      consigneeId: consignee.companyId,
      consigneeAddressId: consignee.addressBookId,
      notifyPartyId: notify.companyId,
      notifyPartyAddressId: notify.addressBookId,

      mainDescription: bc.mainDescription || job.mainDescription || "",
      shippingMark: bc.shippingMark || job.shippingMark || "",
      pol: bc.pol || job.pol || "",
      pod: bc.pod || job.pod || "",
      cargoMovementId: bc.cargoMovementId || job.cargoMovement?.code || job.cargoMovementId || "",
      deliveryMovementId:
        bc.deliveryMovementId || job.deliveryMovement?.code || job.deliveryMovementId || "",
      eta: bc.eta || job.eta || "",
      dateCargoReceived: bc.dateCargoReceived || job.billsOfLading?.[0]?.dateCargoReceived || "",
      freightPayment: bc.freightPayment || "",
      prepaidValue: bc.prepaidValue || "",
      collectValue: bc.collectValue || "",
      shipperReferences: [
        ...(bc.shipperReferences ||
          job.billsOfLading?.[0]?.shipperReferences ||
          job.shipperReferences ||
          []),
      ],
      showShipperReferencesOnBc: bc.showShipperReferencesOnBc ?? true,

      vessels: vesselSrc.map((v: any, idx: number) => ({
        id: v.id ?? idx,
        vesselId: v.transportId || v.vesselId || "",
        vesselName: v.vesselName || v.vessel?.name || v.plane?.name || "",
        voyageNumber: v.voyageNumber || "",
        etd: v.etd || "",
        eta: v.eta || "",
        tsPortId: v.tsPortId || "",
        sequence: v.sequence ?? idx,
        vesselType: v.vesselType || (idx === 0 ? "feeder" : "mother"),
      })),
      containers: containerSrc.map((c: any) => ({
        containerNumber: c.containerNumber || "",
        sealNumber: c.sealNumber || "",
        containerTypeId: c.containerTypeId || "",
        vehicleNumber: c.vehicleNumber || "",
        driverName: c.driverName || "",
        driverContactNumber: c.driverContactNumber || "",
        isHazardous: c.isHazardous || false,
        items: (c.items || []).map((it: any, i: number) => ({
          sequenceNo: it.sequenceNo ?? i + 1,
          qty: toNum(it.qty) ?? 1,
          packageTypeCode: it.packageTypeCode || "",
          grossWeight: toNum(it.grossWeight),
          netWeight: toNum(it.netWeight),
          measurementCbm: toNum(it.measurementCbm),
          description: it.description || "",
          hsCode: it.hsCode || "",
        })),
      })),
    };
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
  if (!props.job?.id) return;
  isSaving.value = true;
  const res = await updateBookingConfirmationDraft(props.job.id, buildDraftPayload());
  if (res.success && res.data) {
    bcData.value = res.data;
    editMode.value = false;
    toast.success("Booking confirmation saved successfully.");
  } else {
    toast.error(res.error || "Failed to save booking confirmation.");
  }
  isSaving.value = false;
};

const isCopying = ref(false);
const handleCopyFromJob = async () => {
  if (!props.job?.id) return;
  const proceed = await confirm({
    title: "Copy from Job?",
    message:
      "This overwrites the Booking Confirmation's parties, containers, vessels and routing with the current Job data. Continue?",
    confirmText: "Yes, Copy",
  });
  if (!proceed) return;

  isCopying.value = true;
  const res = await copyBookingConfirmationFromJob(props.job.id);
  if (res.success && res.data) {
    bcData.value = res.data;
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
  if (!props.job?.id) return;
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

  const res = await finalizeBookingConfirmation(props.job.id);
  if (res.success && res.data) {
    bcData.value = res.data;
    toast.success("Booking confirmation finalized.");
  } else {
    toast.error(res.error || "Failed to finalize.");
  }
};

const handleUnfinalize = async () => {
  if (!props.job?.id) return;
  const proceed = await confirm({
    title: "Unfinalize Booking Confirmation?",
    message: "This will change the status back to Draft so you can edit it.",
    confirmText: "Yes, Unfinalize",
  });
  if (!proceed) return;

  const res = await unfinalizeBookingConfirmation(props.job.id);
  if (res.success && res.data) {
    bcData.value = res.data;
    toast.success("Booking confirmation unfinalized.");
  } else {
    toast.error(res.error || "Failed to unfinalize.");
  }
};
</script>

<template>
  <div class="max-w-[1400px] mx-auto w-full">
    <div v-if="isFetching" class="flex items-center justify-center h-48">
      <Loader2 class="w-8 h-8 animate-spin text-primary" />
    </div>

    <div
      v-else-if="!bcData"
      class="flex flex-col items-center justify-center h-48 text-muted-foreground gap-3"
    >
      <AlertTriangle class="w-8 h-8 opacity-50" />
      <p>No Booking Confirmation found for this job.</p>
      <button
        v-if="canManageJob"
        @click="handleCreateDraft"
        :disabled="isCreating"
        class="btn-primary h-9 px-4 text-xs font-bold uppercase tracking-wider"
      >
        <Loader2 v-if="isCreating" class="w-4 h-4 mr-2 animate-spin" />
        <Plus v-else class="w-4 h-4 mr-2" />
        Create Draft Booking Confirmation
      </button>
    </div>

    <template v-else>
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 px-6 pt-6 pb-5"
      >
        <!-- Header Title -->
        <div class="flex flex-col gap-2">
          <h1 class="text-2xl font-bold text-foreground leading-none">Booking Confirmation</h1>
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
            <span v-if="bcData.bookingNumber" class="text-xs text-muted-foreground font-medium">
              #{{ bcData.bookingNumber }}
            </span>
            <span
              v-if="!isFinalized && !isComplete"
              class="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border leading-none max-w-fit bg-red-50 text-red-600 border-red-100 flex items-center gap-1"
              :title="`Missing required fields: ${missingFields.join(', ')}`"
            >
              <AlertTriangle class="w-3 h-3" />
              Incomplete · {{ missingFields.length }} field{{
                missingFields.length > 1 ? "s" : ""
              }}
              left
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-wrap items-center justify-end gap-3 shrink-0">
          <template v-if="!editMode">
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
          </template>

          <template v-else>
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
            <button
              @click="toggleEditMode"
              :disabled="isSaving"
              class="px-4 py-2 text-xs font-semibold rounded-md border border-border bg-white hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-colors"
            >
              <X class="w-3.5 h-3.5" />
              Cancel
            </button>
            <button
              @click="handleSave"
              :disabled="isSaving"
              class="px-4 py-2 bg-[#012D5A] hover:bg-[#012D5A]/90 text-white rounded-md shadow-sm text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Loader2 v-if="isSaving" class="w-3.5 h-3.5 animate-spin" />
              <Save v-else class="w-3.5 h-3.5" />
              Save Changes
            </button>
          </template>
        </div>
      </div>

      <div class="bg-muted/10 p-6">
        <div v-if="editMode">
          <JobBcEditForm v-model="editForm" :jobData="job" />
        </div>
        <div v-else>
          <JobBcPreview ref="previewRef" :bcData="bcData" :jobData="job" />
        </div>
      </div>
    </template>
  </div>
</template>
