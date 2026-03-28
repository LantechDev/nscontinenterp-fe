<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Loader2, Download, ArrowLeft, Save } from "lucide-vue-next";
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
} from "./ebl/types";

const props = defineProps<{
  job: ActiveJobData;
}>();

const { getBlRender, finalizeBl, updateBlDraft } = useJobs();
const activeBl = ref<ActiveBlData | null>(null);
const isRendering = ref(false);
const isSavingDraft = ref(false);
const isGeneratingPDF = ref(false);
const editMode = ref(false);

const previewRef = ref<InstanceType<typeof JobEblPreview> | null>(null);

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
      shipperId: f.shipperId,
      shipperAddressId: f.shipperAddressId,
      consigneeId: f.consigneeId,
      consigneeAddressId: f.consigneeAddressId,
      notifyPartyId: f.notifyPartyId,
      notifyPartyAddressId: f.notifyPartyAddressId,
      forwarderId: f.forwarderId,
      forwarderAddressId: f.forwarderAddressId,

      cargoDescription: f.mainDescription,
      mainDescription: f.mainDescription,
      shippingMark: f.shippingMark,
      commodity: f.commodity,
      hsCode: f.hsCode,

      blNumber: f.blNumber,
      blType: f.blType,
      freightTerm: f.freightTerm,
      prepaid: f.prepaidValue,
      collect: f.collectValue,
      totalBlCount: Number(f.totalBlCount) || 1,
      isNegotiable: f.isNegotiable,
      placeOfIssue: f.placeOfIssue,
      dateOfIssue: f.dateOfIssue,
      dateCargoReceived: f.dateCargoReceived,
      shipperReferences: f.shipperReferences,
      showShipperReferencesOnBl: f.showShipperReferencesOnBl,

      pol: f.pol,
      pod: f.pod,
      vesselId: f.vesselId,
      etd: f.etd,
      eta: f.eta,
      voyageNumber: f.voyageNumber,
      preCarriageBy: f.preCarriageBy,
      placeOfReceipt: f.placeOfReceipt,
      placeOfDelivery: f.placeOfDelivery,
      finalDestination: f.finalDestination,

      tradeTypeId: f.tradeTypeId,
      cargoMovementId: f.cargoMovementId,
      deliveryMovementId: f.deliveryMovementId,

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
    };

    const resp = await updateBlDraft(activeBl.value.id, payload);
    if (resp.success) {
      toast.success("Draft saved successfully!");
      editMode.value = false;
      await loadBlRender(activeBl.value.id);
    } else {
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
      const data = resp.data as ActiveBlData;
      activeBl.value = "bl" in data ? ((data as Record<string, unknown>).bl as ActiveBlData) : data;
      if (data.renderContainers) activeBl.value.renderContainers = data.renderContainers;
      if (data.jobContainers) activeBl.value.jobContainers = data.jobContainers;
      if (data.parties) activeBl.value.parties = data.parties;
      if (data.mainDescription !== undefined) activeBl.value.mainDescription = data.mainDescription;
    }
  } finally {
    isRendering.value = false;
  }
};

const closeBl = () => {
  activeBl.value = null;
  editMode.value = false;
};

const handleGeneratePDF = async () => {
  if (!previewRef.value) return;
  isGeneratingPDF.value = true;
  await previewRef.value.generatePDF();
  isGeneratingPDF.value = false;
};

const handleFinalize = async () => {
  if (!activeBl.value || !jobData.value) return;

  if (confirm("Are you sure you want to Finalize this BL? It will lock all related fields.")) {
    const blId = jobData.value.billsOfLading?.[0]?.id || props.job?.billsOfLading?.[0]?.id;
    if (!blId) return;

    const resp = await finalizeBl(blId);
    if (resp.success) {
      toast.success("BL has been successfully finalized with sequence!");
      if (activeBl.value?.id) {
        await loadBlRender(activeBl.value.id);
      }
    } else {
      toast.error(resp.error || "Failed to finalize BL");
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
                  activeBl.status.toLowerCase() === 'finalized'
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    : 'bg-amber-50 text-amber-600 border-amber-100'
                "
              >
                {{ activeBl.status }}
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
            v-if="activeBl?.status?.toLowerCase() === 'draft'"
            @click="toggleEditMode"
            :disabled="isRendering"
            class="px-4 py-2 text-xs font-semibold rounded-md border border-border bg-white hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-colors"
          >
            {{ editMode ? "Cancel Edit" : "Edit BL Draft" }}
          </button>

          <button
            v-if="activeBl?.status?.toLowerCase() === 'draft' && !editMode"
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
