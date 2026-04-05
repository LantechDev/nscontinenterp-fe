<script setup lang="ts">
import { ref, computed, watch } from "vue";
import {
  Loader2,
  Download,
  ArrowLeft,
  Save,
  RotateCcw,
  CheckCircle2,
  X,
  AlertTriangle,
  Info,
  Edit,
  Send,
} from "lucide-vue-next";
import { toast } from "vue-sonner";
import { useAuth } from "~/composables/useAuth";

import JobEblList from "./ebl/JobEblList.vue";
import JobEblEditForm from "./ebl/JobEblEditForm.vue";
import JobEblPreview from "./ebl/JobEblPreview.vue";
import type {
  ActiveJobData,
  ActiveBlData,
  EblContainer,
  EblContainerItem,
  EditFormType,
  EblParty,
  EblVessel,
} from "./ebl/types";

const props = defineProps<{
  job: ActiveJobData;
  initialBlId?: string;
}>();

const { getBlRender, finalizeBl, unfinalizeBl, updateBlDraft, requestFinalizeBl, rejectBl } =
  useJobs();
const { confirm } = useConfirm();
const { canApproveJobs, user } = useAuth();
const activeBl = ref<ActiveBlData | null>(null);
const isRendering = ref(false);
const isSavingDraft = ref(false);
const isGeneratingPDF = ref(false);
const editMode = ref(false);
const isFinalizing = ref(false);
const isRejecting = ref(false);
const showRejectReason = ref(false);
const showRejectModal = ref(false);
const rejectReasonForm = ref("");
const listApprovingId = ref<string | null>(null);
const listRejectingId = ref<string | null>(null);

const previewRef = ref<InstanceType<typeof JobEblPreview> | null>(null);

const blStatus = computed(() => {
  const s = activeBl.value?.status;
  const raw = activeBl.value?.statusRaw;

  if (!s) return "";
  if (typeof s === "string") {
    const lower = s.toLowerCase();
    if (lower === "finalized" || lower === "confirmed") return "confirmed";
    return lower;
  }

  const code = s.code?.toLowerCase() || "";
  // High-priority fallback: if the DB status string is "finalized" but code is still "draft", prioritize finalized.
  if (code === "draft" && raw?.toLowerCase() === "finalized") return "confirmed";
  if (code === "pending_approval") return "pending_approval";

  return code;
});

const isDraft = computed(() => blStatus.value === "draft");
const isPendingApproval = computed(() => blStatus.value === "pending_approval");
const isFinalized = computed(
  () => blStatus.value === "finalized" || blStatus.value === "confirmed",
);

const editForm = ref<EditFormType>({
  shipperId: "",
  shipperAddressId: "",
  consigneeId: "",
  consigneeAddressId: "",
  notifyPartyId: "",
  notifyPartyAddressId: "",
  forwarderId: "",
  forwarderAddressId: "",
  isNotifySameAsConsignee: false,

  mainDescription: "",
  commodity: "",
  hsCode: "",
  shippingMark: "",

  blNumber: "",
  blType: "DRAFT",
  freightTerm: "PREPAID",
  freightPayment: "",
  prepaidValue: "",
  collectValue: "",
  totalBlCount: 1,
  isNegotiable: false,
  placeOfIssue: "",
  dateOfIssue: "",
  dateCargoReceived: "",

  pol: "",
  pod: "",
  vesselId: "",
  voyageNumber: "",
  preCarriageBy: "",
  placeOfReceipt: "",
  placeOfDelivery: "",
  finalDestination: "",
  etd: "",
  eta: "",
  tradeTypeId: "EXPORT",
  cargoMovementId: "FCL_FCL",
  deliveryMovementId: "CY_CY",

  containers: [],
  vessels: [],
  shipperReferences: [],
  showShipperReferencesOnBl: true,
});

const jobData = computed(() => activeBl.value?.job || props.job);

const toggleEditMode = () => {
  if (editMode.value) {
    editMode.value = false;
    return;
  }
  const d = jobData.value;
  const blDoc = activeBl.value;

  let containerSource: EblContainer[] = [];

  if (blDoc?.blContainers && Array.isArray(blDoc.blContainers) && blDoc.blContainers.length > 0) {
    containerSource = blDoc.blContainers;
  } else if (blDoc?.containers && Array.isArray(blDoc.containers) && blDoc.containers.length > 0) {
    containerSource = blDoc.containers;
  } else if (
    blDoc?.jobContainers &&
    Array.isArray(blDoc.jobContainers) &&
    blDoc.jobContainers.length > 0
  ) {
    containerSource = blDoc.jobContainers;
  } else if (d?.jobContainers && Array.isArray(d.jobContainers) && d.jobContainers.length > 0) {
    containerSource = d.jobContainers;
  } else if (
    d?.job?.jobContainers &&
    Array.isArray(d.job.jobContainers) &&
    d.job.jobContainers.length > 0
  ) {
    containerSource = d.job.jobContainers;
  }

  const findRole = (code: string) => {
    return (
      d?.jobParties?.find((p: EblParty) => p.partyRole?.code === code) ||
      d?.job?.jobParties?.find((p: EblParty) => p.partyRole?.code === code)
    );
  };

  const TRADE_TYPES = [
    { id: "EXPORT", name: "Export" },
    { id: "IMPORT", name: "Import" },
  ];
  const CARGO_MOVEMENTS = [
    { id: "FCL_FCL", name: "FCL/FCL" },
    { id: "LCL_LCL", name: "LCL/LCL" },
    { id: "FCL_LCL", name: "FCL/LCL" },
    { id: "LCL_FCL", name: "LCL/FCL" },
  ];
  const DELIVERY_MOVEMENTS = [
    { id: "CY_CY", name: "CY-CY" },
    { id: "CY_DOOR", name: "CY-DOOR" },
    { id: "DOOR_CY", name: "DOOR-CY" },
    { id: "DOOR_DOOR", name: "DOOR-DOOR" },
  ];

  editForm.value = {
    shipperId: findRole("SHIPPER")?.companyId || "",
    shipperAddressId: findRole("SHIPPER")?.addressBookId || "",
    consigneeId: findRole("CONSIGNEE")?.companyId || "",
    consigneeAddressId: findRole("CONSIGNEE")?.addressBookId || "",
    notifyPartyId: findRole("NOTIFY_PARTY")?.companyId || findRole("NOTIFY PARTY")?.companyId || "",
    notifyPartyAddressId:
      findRole("NOTIFY_PARTY")?.addressBookId || findRole("NOTIFY PARTY")?.addressBookId || "",
    forwarderId: findRole("FORWARDER")?.companyId || "",
    forwarderAddressId: findRole("FORWARDER")?.addressBookId || "",
    isNotifySameAsConsignee: false,

    mainDescription: d?.mainDescription || d?.job?.mainDescription || "",
    commodity: d?.commodity || d?.job?.commodity || "",
    hsCode: d?.hsCode || d?.job?.hsCode || "",
    shippingMark: d?.shippingMark || d?.job?.shippingMark || "",

    blNumber: blDoc?.blNumber || "",
    blType: blDoc?.blType || "DRAFT",
    freightTerm: blDoc?.freightTerm || "PREPAID",
    prepaidValue: blDoc?.prepaid || "",
    collectValue: blDoc?.collect || "",
    freightPayment: blDoc?.prepaid
      ? blDoc.prepaid.includes(d?.polName || d?.pol || "")
        ? "PREPAID_POL"
        : "PREPAID_POD"
      : blDoc?.collect
        ? blDoc.collect.includes(d?.polName || d?.pol || "")
          ? "COLLECT_POL"
          : "COLLECT_POD"
        : "",
    totalBlCount: d?.totalBlCount || d?.job?.totalBlCount || 1,
    isNegotiable: blDoc?.isNegotiable || false,
    placeOfIssue: blDoc?.placeOfIssue || "",
    dateOfIssue: blDoc?.dateOfIssue || "",
    dateCargoReceived: blDoc?.dateCargoReceived || "",

    pol: d?.pol || props.job?.pol || "",
    pod: d?.pod || props.job?.pod || "",
    vesselId: d?.vesselId || props.job?.vesselId || "",
    voyageNumber: d?.voyageNumber || props.job?.voyageNumber || "",
    preCarriageBy: d?.preCarriageBy || props.job?.preCarriageBy || "",
    placeOfReceipt: d?.placeOfReceipt || props.job?.placeOfReceipt || "",
    placeOfDelivery: d?.placeOfDelivery || props.job?.placeOfDelivery || "",
    finalDestination: d?.finalDestination || props.job?.finalDestination || "",
    etd: d?.etd || d?.job?.etd || "",
    eta: d?.eta || d?.job?.eta || "",
    tradeTypeId:
      TRADE_TYPES.find(
        (t) =>
          t.id ===
          (d?.tradeType?.code || d?.job?.tradeType?.code || d?.tradeTypeId || d?.job?.tradeTypeId),
      )?.id || "EXPORT",
    cargoMovementId:
      CARGO_MOVEMENTS.find(
        (m) =>
          m.id ===
          (d?.cargoMovement?.code ||
            d?.job?.cargoMovement?.code ||
            d?.cargoMovementId ||
            d?.job?.cargoMovementId),
      )?.id || "FCL_FCL",
    deliveryMovementId:
      DELIVERY_MOVEMENTS.find(
        (m) =>
          m.id ===
          (d?.deliveryMovement?.code ||
            d?.job?.deliveryMovement?.code ||
            d?.deliveryMovementId ||
            d?.job?.deliveryMovementId),
      )?.id || "CY_CY",
    shipperReferences: blDoc?.shipperReferences ? [...blDoc.shipperReferences] : [],
    showShipperReferencesOnBl: blDoc?.showShipperReferencesOnBl !== false,

    containers: containerSource.map((bc: { container?: EblContainer } & EblContainer) => {
      const container = bc.container || bc;
      return {
        containerNumber: container?.containerNumber || "",
        sealNumber: container?.sealNumber || "",
        containerTypeId: container?.containerTypeId || container?.containerType?.id || "",
        isHazardous: container?.isHazardous || false,
        items:
          container?.items?.map((it: EblContainerItem) => ({
            sequenceNo: it.sequenceNo || 1,
            qty: it.qty || 1,
            packageTypeCode:
              it.packageTypeCode ||
              (typeof it.packageType === "object" && it.packageType !== null
                ? it.packageType.code
                : typeof it.packageType === "string"
                  ? it.packageType
                  : "") ||
              "",
            grossWeight: it.grossWeight || it.grossWeight === 0 ? Number(it.grossWeight) : null,
            netWeight: it.netWeight || it.netWeight === 0 ? Number(it.netWeight) : null,
            measurementCbm:
              it.measurementCbm || it.measurementCbm === 0 ? Number(it.measurementCbm) : null,
            description: it.description || "",
            hsCode: it.hsCode || "",
          })) || [],
      };
    }),

    vessels: (d?.vessels || props.job?.vessels || []).map((v: EblVessel) => ({
      vesselId: v.vesselId || "",
      vesselName: v.vesselName || "",
      voyageNumber: v.voyageNumber || "",
      etd: v.etd || "",
      sequence: v.sequence || 0,
    })),
  };

  editMode.value = true;
};

watch(
  () => editForm.value.containers,
  (containers) => {
    if (!containers || !Array.isArray(containers)) return;

    let totalGw = 0;
    let totalNw = 0;
    let totalCbm = 0;
    let hasItems = false;

    containers.forEach((container) => {
      if (container.items && Array.isArray(container.items)) {
        container.items.forEach((item: EblContainerItem) => {
          hasItems = true;
          totalGw += Number(item.grossWeight) || 0;
          totalNw += Number(item.netWeight) || 0;
          totalCbm += Number(item.measurementCbm) || 0;
        });
      }
    });

    if (hasItems && activeBl.value) {
      if (totalGw > 0) activeBl.value.totalGrossWeight = totalGw;
      if (totalNw > 0) activeBl.value.totalNetWeight = totalNw;
      if (totalCbm > 0) activeBl.value.totalMeasurementCbm = totalCbm;
    }
  },
  { deep: true },
);

const handleSaveDraft = async () => {
  if (!activeBl.value?.id) return;
  isSavingDraft.value = true;
  try {
    const f = editForm.value;

    const payload: Record<string, unknown> = {
      shipperId: f.shipperId || undefined,
      shipperAddressId: f.shipperAddressId || undefined,
      consigneeId: f.consigneeId || undefined,
      consigneeAddressId: f.consigneeAddressId || undefined,
      notifyPartyId: f.notifyPartyId || undefined,
      notifyPartyAddressId: f.notifyPartyAddressId || undefined,
      forwarderId: f.forwarderId || undefined,
      forwarderAddressId: f.forwarderAddressId || undefined,

      cargoDescription: f.mainDescription || undefined,
      mainDescription: f.mainDescription || undefined,
      shippingMark: f.shippingMark || undefined,
      commodity: f.commodity || undefined,
      hsCode: f.hsCode || undefined,

      blNumber: f.blNumber || undefined,
      blType: f.blType || undefined,
      freightTerm: (f.freightTerm as "PREPAID" | "COLLECT") || undefined,
      prepaid: f.prepaidValue || undefined,
      collect: f.collectValue || undefined,
      totalBlCount: Number(f.totalBlCount) || 1,
      isNegotiable: f.isNegotiable,
      placeOfIssue: f.placeOfIssue,
      dateOfIssue: f.dateOfIssue,
      dateCargoReceived: f.dateCargoReceived,
      shipperReferences: f.shipperReferences,
      showShipperReferencesOnBl: f.showShipperReferencesOnBl,

      pol: f.pol || undefined,
      pod: f.pod || undefined,
      vesselId: f.vesselId || undefined,
      etd: f.etd || undefined,
      eta: f.eta || undefined,
      voyageNumber: f.voyageNumber || undefined,
      preCarriageBy: f.preCarriageBy || undefined,
      placeOfReceipt: f.placeOfReceipt || undefined,
      placeOfDelivery: f.placeOfDelivery || undefined,
      finalDestination: f.finalDestination || undefined,

      tradeTypeId: f.tradeTypeId || undefined,
      cargoMovementId: f.cargoMovementId || undefined,
      deliveryMovementId: f.deliveryMovementId || undefined,

      containers: f.containers.map((c: EblContainer) => ({
        containerNumber: c.containerNumber,
        sealNumber: c.sealNumber,
        containerTypeId: c.containerTypeId,
        isHazardous: c.isHazardous,
        items: c.items?.map((it: EblContainerItem) => ({
          sequenceNo: Number(it.sequenceNo),
          qty: Number(it.qty),
          packageTypeCode: it.packageTypeCode,
          grossWeight: Number(it.grossWeight) || 0,
          netWeight: Number(it.netWeight) || 0,
          measurementCbm: Number(it.measurementCbm) || 0,
          description: it.description,
          hsCode: it.hsCode,
        })),
      })),
      vessels: f.vessels.map((v) => ({
        vesselId: v.vesselId || null,
        vesselName: v.vesselName || null,
        voyageNumber: v.voyageNumber || null,
        etd: v.etd || null,
        sequence: Number(v.sequence) || 0,
      })),
    };

    const resp = await updateBlDraft(activeBl.value.id, payload);
    if (resp.success) {
      toast.success("Draft saved successfully!");
      editMode.value = false;
      await loadBlRender(activeBl.value.id);
    } else {
      console.error("Failed to save draft:", resp);
      toast.error(resp.error || "Failed to save draft");
    }
  } catch (err: unknown) {
    toast.error("An error occurred: " + (err as Error)?.message);
  } finally {
    isSavingDraft.value = false;
  }
};

const loadBlRender = async (blId: string) => {
  isRendering.value = true;
  try {
    const resp = await getBlRender(blId);
    if (resp.success && resp.data) {
      const data = resp.data;
      const mappedBl = data.bl || (data as unknown as ActiveBlData);
      if (data.renderContainers) mappedBl.renderContainers = data.renderContainers;
      if (data.jobContainers) mappedBl.jobContainers = data.jobContainers;
      if (data.parties) mappedBl.renderParties = data.parties;
      if (data.mainDescription !== undefined) mappedBl.mainDescription = data.mainDescription;

      activeBl.value = mappedBl;
    }
  } finally {
    isRendering.value = false;
  }
};

const closeBl = () => {
  activeBl.value = null;
  editMode.value = false;
};

watch(
  () => props.initialBlId,
  (newBlId) => {
    if (newBlId) {
      loadBlRender(newBlId);
    }
  },
  { immediate: true },
);

const handleGeneratePDF = async () => {
  if (!previewRef.value) return;
  isGeneratingPDF.value = true;
  await previewRef.value.generatePDF();
  isGeneratingPDF.value = false;
};

const handleRequestFinalize = async () => {
  if (!activeBl.value?.id) return;

  const isConfirmed = await confirm({
    title: "Request Finalization",
    message:
      "Are you sure you want to request finalization for this BL? It will be sent to the owner for approval.",
    confirmText: "Request Now",
    type: "info",
  });

  if (isConfirmed) {
    const resp = await requestFinalizeBl(activeBl.value.id);
    if (resp.success && resp.data) {
      toast.success("Finalization request sent!");
      await loadBlRender(activeBl.value.id);
    } else {
      toast.error(resp.error || "Failed to request finalization");
    }
  }
};

const handleFinalize = async () => {
  if (!activeBl.value || !jobData.value) return;

  const isConfirmed = await confirm({
    title: "Finalize Bill of Lading",
    message:
      "Are you sure you want to Finalize this BL? This action will assign a BL number and lock all details for further editing.",
    confirmText: "Finalize BL",
    type: "warning",
  });

  if (isConfirmed) {
    isFinalizing.value = true;
    const blId = activeBl.value.id || jobData.value.billsOfLading?.[0]?.id;
    const resp = await finalizeBl(blId!);
    if (resp.success && resp.data) {
      toast.success("BL Finalized successfully");
      await loadBlRender(blId!);
    } else {
      toast.error(resp.error || "Failed to finalize BL");
    }
    isFinalizing.value = false;
  }
};

const handleListApprove = async (id: string) => {
  listApprovingId.value = id;
  await loadBlRender(id);
  listApprovingId.value = null;
  await handleFinalize();
};

const handleListReject = async (id: string) => {
  listRejectingId.value = id;
  await loadBlRender(id);
  listRejectingId.value = null;
  await handleReject();
};

const handleUnfinalize = async () => {
  if (!activeBl.value?.id) return;

  const isConfirmed = await confirm({
    title: "Unfinalize Bill of Lading",
    message:
      "Are you sure you want to revert this BL to Draft? This will clear the assigned BL number and allow further edits.",
    confirmText: "Unfinalize BL",
    type: "warning",
  });

  if (isConfirmed) {
    const resp = await unfinalizeBl(activeBl.value.id);
    if (resp.success && resp.data) {
      toast.success("BL reverted to Draft successfully");
      await loadBlRender(activeBl.value.id);
    } else {
      toast.error(resp.error || "Failed to unfinalize BL");
    }
  }
};

const handleReject = () => {
  if (!activeBl.value?.id) return;
  rejectReasonForm.value = "";
  showRejectModal.value = true;
};

const submitReject = async () => {
  if (!activeBl.value?.id || !rejectReasonForm.value.trim()) return;

  isRejecting.value = true;
  const resp = await rejectBl(activeBl.value.id, rejectReasonForm.value.trim());
  if (resp.success && resp.data) {
    toast.success("BL rejected and sent back to Draft.");
    showRejectModal.value = false;
    await loadBlRender(activeBl.value.id);
  } else {
    toast.error(resp.error || "Failed to reject BL");
  }
  isRejecting.value = false;
};
</script>

<template>
  <div class="space-y-6 relative">
    <!-- Rejection Modal -->
    <UiModal v-model="showRejectModal" width="max-w-lg">
      <div class="p-4">
        <div class="flex flex-col items-center text-center gap-4 py-4">
          <div
            class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600"
          >
            <AlertTriangle class="w-6 h-6" />
          </div>
          <div class="space-y-2 w-full">
            <h3 class="text-lg font-semibold">Reject Bill of Lading</h3>
            <p class="text-sm text-muted-foreground w-full mb-6">
              Please provide a reason for rejecting this BL. It will be reverted to Draft for
              revision.
            </p>
            <div class="text-left w-full pt-2">
              <label
                class="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5"
              >
                Rejection Reason <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="rejectReasonForm"
                class="input-field min-h-[120px] py-3 resize-y transition-all duration-200"
                placeholder="E.g., Cargo description is incomplete"
              ></textarea>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-3 mt-4">
          <button
            type="button"
            class="btn-secondary flex-1 justify-center"
            @click="showRejectModal = false"
            :disabled="isRejecting"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn-primary flex-1 justify-center bg-red-600 hover:bg-red-700 border-red-600 disabled:opacity-50"
            @click="submitReject"
            :disabled="!rejectReasonForm.trim() || isRejecting"
          >
            <Loader2 v-if="isRejecting" class="w-4 h-4 animate-spin mr-2" />
            {{ isRejecting ? "Rejecting..." : "Confirm Reject" }}
          </button>
        </div>
      </div>
    </UiModal>

    <!-- View Reason Modal -->
    <UiModal v-model="showRejectReason" width="max-w-md">
      <div class="p-4">
        <div class="flex flex-col items-center text-center gap-4 py-4">
          <div
            class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600"
          >
            <AlertTriangle class="w-6 h-6" />
          </div>
          <div class="space-y-2 w-full">
            <h3 class="text-lg font-semibold">Rejection Reason</h3>
            <p class="text-sm text-muted-foreground w-full mb-6">
              This Bill of Lading was rejected for the following reason:
            </p>
            <div class="text-left w-full pt-2">
              <div
                class="w-full min-h-[80px] text-sm p-3 bg-muted/30 border border-border rounded-md text-foreground whitespace-pre-wrap"
              >
                {{ activeBl?.rejectReason }}
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-center mt-4 w-full">
          <button
            type="button"
            class="btn-secondary px-8 justify-center w-full"
            @click="showRejectReason = false"
          >
            Close
          </button>
        </div>
      </div>
    </UiModal>

    <!-- List View (No Active BL) -->
    <JobEblList
      v-if="!activeBl"
      :job="job"
      :approving-id="listApprovingId"
      :rejecting-id="listRejectingId"
      @select="loadBlRender"
      @approve="handleListApprove"
      @reject="handleListReject"
      @request-finalize="
        async (id) => {
          await loadBlRender(id);
          await handleRequestFinalize();
        }
      "
    />

    <!-- Detail/Edit View -->
    <template v-else>
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-6 mb-6"
      >
        <!-- Header Title -->
        <div class="flex items-start gap-4">
          <button
            @click="closeBl"
            class="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shrink-0 mt-0.5"
          >
            <ArrowLeft class="w-5 h-5" />
          </button>
          <div class="flex flex-col gap-2 mt-1">
            <h1 class="text-2xl font-bold text-foreground leading-none">
              {{ activeBl?.blNumber || "Bill of Lading Details" }}
            </h1>
            <p class="text-sm text-muted-foreground leading-none mb-1">
              Review and manage your bill of lading details
            </p>
            <div class="flex items-center gap-3">
              <span
                v-if="activeBl?.status"
                class="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border leading-none max-w-fit"
                :class="{
                  'bg-emerald-50 text-emerald-600 border-emerald-100': isFinalized,
                  'bg-amber-50 text-amber-600 border-amber-100': isDraft && !activeBl.rejectReason,
                  'bg-red-50 text-red-600 border-red-100': isDraft && !!activeBl.rejectReason,
                  'bg-blue-50 text-blue-600 border-blue-100': isPendingApproval,
                }"
              >
                {{
                  isFinalized
                    ? "Finalized"
                    : isPendingApproval
                      ? "Pending Approval"
                      : isDraft && activeBl.rejectReason
                        ? "Revision Required"
                        : typeof activeBl.status === "string"
                          ? activeBl.status
                          : activeBl.status.name || activeBl.status.code
                }}
              </span>
              <button
                v-if="isDraft && activeBl?.rejectReason"
                @click="showRejectReason = true"
                class="text-xs text-red-600 font-bold hover:underline flex items-center gap-1 bg-red-50/50 hover:bg-red-50 px-2 py-1 rounded-md border border-transparent hover:border-red-100 transition-colors"
              >
                <Info class="w-3.5 h-3.5" />
                View Reason
              </button>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-wrap items-center justify-end gap-3 shrink-0">
          <button
            v-if="isFinalized"
            @click="handleUnfinalize"
            :disabled="isRendering"
            class="px-4 py-2 text-xs font-semibold rounded-md border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 flex items-center gap-2 shadow-sm transition-colors"
          >
            <RotateCcw class="w-4 h-4" />
            Batal Finalized
          </button>

          <button
            v-if="isDraft || (isPendingApproval && canApproveJobs)"
            @click="toggleEditMode"
            :disabled="isRendering"
            class="px-4 py-2 text-xs font-semibold rounded-md border border-border bg-white hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-colors"
          >
            <X v-if="editMode" class="w-3.5 h-3.5" />
            <Edit v-else class="w-3.5 h-3.5" />
            {{ editMode ? "Cancel Edit" : "Edit BL" }}
          </button>

          <button
            v-if="isDraft && !editMode"
            @click="handleRequestFinalize"
            :disabled="isRendering"
            class="px-4 py-2 text-xs font-semibold rounded-md border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors shadow-sm flex items-center gap-2"
          >
            <Send class="w-3.5 h-3.5" />
            Request Finalize
          </button>

          <button
            v-if="isPendingApproval && !editMode && canApproveJobs"
            @click="handleReject"
            :disabled="isRendering || isRejecting"
            class="px-4 py-2 text-xs font-semibold rounded-md border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 flex items-center gap-2 shadow-sm transition-colors"
          >
            <Loader2 v-if="isRejecting" class="w-4 h-4 animate-spin" />
            <X v-else class="w-4 h-4" />
            {{ isRejecting ? "REJECTING..." : "REJECT / REVISE" }}
          </button>

          <button
            v-if="isPendingApproval && !editMode && canApproveJobs"
            @click="handleFinalize"
            :disabled="isRendering || isFinalizing"
            class="px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            <Loader2 v-if="isFinalizing" class="w-4 h-4 animate-spin" />
            <CheckCircle2 v-else class="w-4 h-4" />
            {{ isFinalizing ? "APPROVING..." : "APPROVE & FINALIZE" }}
          </button>

          <div
            v-if="isPendingApproval && !canApproveJobs"
            class="px-4 py-2 text-xs font-semibold rounded-md border border-blue-100 bg-blue-50/50 text-blue-400 flex items-center gap-2 cursor-not-allowed"
          >
            Awaiting Approval
          </div>

          <button
            v-if="editMode"
            @click="handleSaveDraft"
            :disabled="isSavingDraft"
            class="px-4 py-2 bg-[#012D5A] hover:bg-[#012D5A]/90 text-white rounded-md shadow-sm text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Save v-if="!isSavingDraft" class="w-3.5 h-3.5" />
            <Loader2 v-else class="w-3.5 h-3.5 animate-spin" />
            {{ isSavingDraft ? "Saving..." : "Save Draft" }}
          </button>

          <button
            v-if="!editMode"
            @click="handleGeneratePDF"
            :disabled="isGeneratingPDF || !jobData"
            class="px-4 py-2 bg-[#012D5A] hover:bg-[#012D5A]/90 text-white rounded-md shadow-sm text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Loader2 v-if="isGeneratingPDF" class="w-3.5 h-3.5 animate-spin" />
            <Download v-else class="w-3.5 h-3.5" />
            {{ isGeneratingPDF ? "Generating..." : "Download PDF" }}
          </button>
        </div>
      </div>

      <!-- Interaction Logs Banner -->
      <div
        v-if="activeBl?.revisionCount || activeBl?.finalizeRequestCount"
        class="flex flex-col sm:flex-row sm:items-center gap-3 bg-muted/20 border border-border/50 rounded-lg p-3 mb-6"
      >
        <span
          class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 shrink-0"
        >
          <Info class="w-3.5 h-3.5" /> BL History:
        </span>
        <div class="flex flex-wrap items-center gap-2">
          <div
            v-if="activeBl?.revisionCount"
            class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#012D5A] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 shadow-sm"
            title="Number of times this BL was revised"
          >
            <RotateCcw class="w-3 h-3" /> {{ activeBl.revisionCount }}x Revised
          </div>
          <div
            v-if="activeBl?.finalizeRequestCount"
            class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 shadow-sm"
            title="Number of times finalization was requested"
          >
            <Send class="w-3 h-3" /> {{ activeBl.finalizeRequestCount }}x Requested
          </div>
        </div>
      </div>

      <!-- Edit Form -->
      <div v-if="editMode" class="w-full relative">
        <div class="flex-1 w-full min-w-0">
          <JobEblEditForm v-model="editForm" :jobData="jobData" />
        </div>
      </div>

      <!-- PDF Preview -->
      <JobEblPreview v-show="!editMode" ref="previewRef" :jobData="jobData" :activeBl="activeBl" />
    </template>
  </div>
</template>
