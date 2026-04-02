<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Loader2, Download, ArrowLeft, Save, RotateCcw } from "lucide-vue-next";
import { toast } from "vue-sonner";

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

const { getBlRender, finalizeBl, unfinalizeBl, updateBlDraft } = useJobs();
const { confirm } = useConfirm();
const activeBl = ref<ActiveBlData | null>(null);
const isRendering = ref(false);
const isSavingDraft = ref(false);
const isGeneratingPDF = ref(false);
const editMode = ref(false);

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

  return code;
});

const isDraft = computed(() => blStatus.value === "draft");
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
    const blId = activeBl.value.id || jobData.value.billsOfLading?.[0]?.id;
    const resp = await finalizeBl(blId!);
    if (resp.success && resp.data) {
      toast.success("BL Finalized successfully");
      await loadBlRender(blId!);
    } else {
      toast.error(resp.error || "Failed to finalize BL");
    }
  }
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
</script>

<template>
  <div class="space-y-6 relative">
    <!-- List View (No Active BL) -->
    <JobEblList v-if="!activeBl" :job="job" @select="loadBlRender" />

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
          <div>
            <h1 class="text-xl font-bold flex items-center gap-2 text-foreground">
              {{ activeBl?.blNumber || "Bill of Lading Details" }}
              <span
                v-if="activeBl?.status"
                class="ml-2 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider border"
                :class="
                  isFinalized
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    : 'bg-amber-50 text-amber-600 border-amber-100'
                "
              >
                {{
                  isFinalized
                    ? "Finalized"
                    : typeof activeBl.status === "string"
                      ? activeBl.status
                      : activeBl.status.name || activeBl.status.code
                }}
              </span>
            </h1>
            <p class="text-sm text-muted-foreground mt-1">
              Review and manage your bill of lading details
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-wrap items-center gap-3 shrink-0">
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
            v-if="isDraft"
            @click="toggleEditMode"
            :disabled="isRendering"
            class="px-4 py-2 text-xs font-semibold rounded-md border border-border bg-white hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-colors"
          >
            {{ editMode ? "Cancel Edit" : "Edit BL Draft" }}
          </button>

          <button
            v-if="isDraft && !editMode"
            @click="handleFinalize"
            :disabled="isRendering"
            class="px-4 py-2 text-xs font-semibold rounded-md border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors shadow-sm flex items-center gap-2"
          >
            Finalize BL
          </button>

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
