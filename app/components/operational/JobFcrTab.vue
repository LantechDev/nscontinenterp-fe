<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any -- FCR maps loose snapshot data into eBL print shape */
import { computed, nextTick, onMounted, ref } from "vue";
import {
  Download,
  CheckCircle2,
  Loader2,
  Plus,
  RotateCcw,
  Trash2,
  FileText,
  ArrowLeft,
  Edit,
  Save,
  X,
} from "lucide-vue-next";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "vue-sonner";
import JobEblFrontPage from "./ebl/JobEblFrontPage.vue";
import type { ActiveBlData, ActiveJobData, EblContainer, EblContainerItem } from "./ebl/types";
import JobBcEditForm from "./booking-confirmation/JobBcEditForm.vue";
import type { BookingConfirmationForm } from "./booking-confirmation/JobBcEditForm.vue";
import { useFcr, type Fcr } from "~/composables/useFcr";
import { buildBcDocumentEditForm, createEmptyBcDocumentForm } from "~/utils/bcDocumentForm";

const props = defineProps<{
  job: any;
  canManageJob?: boolean;
}>();

const { fetchFcrs, createFcr, updateFcrDraftById, finalizeFcrById, unfinalizeFcrById, deleteFcr } =
  useFcr();
const { confirm } = useConfirm();
const bcData = ref<Fcr | null>(null);
const bcList = ref<Fcr[]>([]);
const isLoading = ref(false);
const isCreating = ref(false);
const isSaving = ref(false);
const editMode = ref(false);
const isGeneratingPDF = ref(false);
const fcrContainer = ref<HTMLElement | null>(null);
const logoUrl = ref("/images/transparentnscontinenttebal.png");

const editForm = ref<BookingConfirmationForm>(createEmptyBcDocumentForm());
const isFinalized = computed(() => bcData.value?.status === "finalized");

const replaceActiveFcr = (bc: Fcr) => {
  bcData.value = bc;
  const idx = bcList.value.findIndex((item) => item.id === bc.id);
  if (idx === -1) bcList.value = [bc, ...bcList.value];
  else bcList.value[idx] = bc;
};

onMounted(async () => {
  if (typeof window !== "undefined") {
    logoUrl.value = window.location.origin + "/images/transparentnscontinenttebal.png";
  }
  if (!props.job?.id) return;
  isLoading.value = true;
  const res = await fetchFcrs(props.job.id);
  if (res.success) {
    bcList.value = res.data || [];
    bcData.value = null;
  }
  isLoading.value = false;
});

const selectFcrSource = (bc: Fcr) => {
  bcData.value = bc;
};

const closeFcr = () => {
  bcData.value = null;
  editMode.value = false;
};

const toggleEditMode = () => {
  if (editMode.value) {
    editMode.value = false;
    return;
  }
  if (!bcData.value) return;
  if (isFinalized.value) return;

  editForm.value = buildBcDocumentEditForm({
    document: bcData.value,
    job: props.job || {},
  });
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
    etd: f.vessels?.[0]?.etd || null,
    eta: f.eta || null,
    dateCargoReceived: f.dateCargoReceived || null,
    freightPayment: f.freightPayment || null,
    prepaidValue: f.prepaidValue || null,
    collectValue: f.collectValue || null,
    shipperReferences: f.shipperReferences || [],
    showShipperReferencesOnFcr: f.showShipperReferencesOnBc,
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

const handleSaveFcr = async () => {
  if (!bcData.value?.id) return;
  if (isFinalized.value) {
    toast.error("Finalized FCR cannot be edited.");
    return;
  }
  isSaving.value = true;
  const res = await updateFcrDraftById(bcData.value.id, buildDraftPayload());
  if (res.success && res.data) {
    replaceActiveFcr(res.data);
    editMode.value = false;
    toast.success("FCR saved successfully.");
  } else {
    toast.error(res.error || "Failed to save FCR.");
  }
  isSaving.value = false;
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

const handleCreateFcr = async () => {
  if (!props.job?.id) return;
  isCreating.value = true;
  const res = await createFcr(props.job.id);
  if (res.success && res.data) {
    bcList.value = [res.data, ...bcList.value];
    bcData.value = res.data;
    toast.success("Draft FCR created.");
  } else {
    toast.error(res.error || "Failed to create FCR.");
  }
  isCreating.value = false;
};

const handleDeleteFcr = async () => {
  if (!bcData.value?.id) return;
  if (isFinalized.value) {
    toast.error("Finalized FCR cannot be deleted.");
    return;
  }
  const yes = await confirm({
    title: "Delete FCR?",
    message: "Hapus draft FCR ini?",
    confirmText: "Delete",
  });
  if (!yes) return;

  const deletingId = bcData.value.id;
  const res = await deleteFcr(deletingId);
  if (res.success) {
    bcList.value = bcList.value.filter((bc) => bc.id !== deletingId);
    bcData.value = null;
    toast.success("FCR deleted.");
  } else {
    toast.error(res.error || "Failed to delete FCR.");
  }
};

const handleFinalize = async () => {
  if (!bcData.value?.id) return;
  const yes = await confirm({
    title: "Finalize FCR?",
    message: "Once finalized, you cannot edit it until it is unfinalized.",
    confirmText: "Yes, Finalize",
  });
  if (!yes) return;

  const res = await finalizeFcrById(bcData.value.id);
  if (res.success && res.data) {
    replaceActiveFcr(res.data);
    editMode.value = false;
    toast.success("FCR finalized.");
  } else {
    toast.error(res.error || "Failed to finalize FCR.");
  }
};

const handleUnfinalize = async () => {
  if (!bcData.value?.id) return;
  const yes = await confirm({
    title: "Unfinalize FCR?",
    message: "This will change the status back to Draft so you can edit it.",
    confirmText: "Yes, Unfinalize",
  });
  if (!yes) return;

  const res = await unfinalizeFcrById(bcData.value.id);
  if (res.success && res.data) {
    replaceActiveFcr(res.data);
    toast.success("FCR unfinalized.");
  } else {
    toast.error(res.error || "Failed to unfinalize FCR.");
  }
};

const sameAsConsigneeParty = {
  partyRole: { code: "NOTIFY_PARTY" },
  companyName: "SAME AS CONSIGNEE",
  addressBook: { fullAddress: "" },
};

const normalizeParty = (party: any, role: string) => ({
  partyRole: { code: role },
  companyId: party?.companyId || party?.company?.id || null,
  companyName: party?.companyName || party?.company?.name || "",
  company: party?.company || (party?.companyName ? { name: party.companyName } : undefined),
  addressBookId: party?.addressBookId || party?.addressBook?.id || null,
  addressBook: {
    fullAddress:
      party?.fullAddress || party?.addressBook?.fullAddress || party?.addressBook?.address || "",
    address: party?.fullAddress || party?.addressBook?.address || "",
    city: party?.city || party?.addressBook?.city || "",
  },
});

const findRole = (items: any[] | undefined, role: string) =>
  (items || []).find((p) => (p.partyRole?.code || p.partyRoleCode || "").toUpperCase() === role);

const isSameParty = (a?: any, b?: any) => {
  if (!a || !b) return false;
  const aCompany = a.companyId || a.company?.id || a.companyName || a.company?.name;
  const bCompany = b.companyId || b.company?.id || b.companyName || b.company?.name;
  const aAddress =
    a.addressBookId || a.addressBook?.id || a.fullAddress || a.addressBook?.fullAddress;
  const bAddress =
    b.addressBookId || b.addressBook?.id || b.fullAddress || b.addressBook?.fullAddress;
  return Boolean(
    aCompany &&
    bCompany &&
    aCompany === bCompany &&
    (!aAddress || !bAddress || aAddress === bAddress),
  );
};

const fcrParties = computed(() => {
  const bcParties = bcData.value?.parties || [];
  const jobParties = props.job?.jobParties || [];
  const shipper = findRole(bcParties, "SHIPPER") || findRole(jobParties, "SHIPPER");
  const consignee = findRole(bcParties, "CONSIGNEE") || findRole(jobParties, "CONSIGNEE");
  const notify = findRole(bcParties, "NOTIFY_PARTY") || findRole(jobParties, "NOTIFY_PARTY");
  const forwarder = findRole(bcParties, "FORWARDER") || findRole(jobParties, "FORWARDER");
  return [
    shipper ? normalizeParty(shipper, "SHIPPER") : null,
    consignee ? normalizeParty(consignee, "CONSIGNEE") : null,
    notify
      ? isSameParty(notify, consignee)
        ? sameAsConsigneeParty
        : normalizeParty(notify, "NOTIFY_PARTY")
      : null,
    forwarder ? normalizeParty(forwarder, "FORWARDER") : null,
  ].filter(Boolean) as ActiveBlData["parties"];
});

const mapContainers = (containers: any[] | undefined): EblContainer[] =>
  (containers || []).map((container, idx) => ({
    id: container.id || idx,
    containerNumber: container.containerNumber || "",
    sealNumber: container.sealNumber || "",
    containerTypeId: container.containerTypeId || "",
    containerType: container.containerType || undefined,
    vehicleNumber: container.vehicleNumber || null,
    driverName: container.driverName || null,
    driverContactNumber: container.driverContactNumber || null,
    isHazardous: Boolean(container.isHazardous),
    totalQty: Number(container.totalQty || 0) || undefined,
    totalGrossWeight: Number(container.totalGrossWeight || 0) || undefined,
    totalNetWeight: Number(container.totalNetWeight || 0) || undefined,
    totalMeasurementCbm: Number(container.totalMeasurementCbm || 0) || undefined,
    items: (container.items || []).map((item: any, itemIdx: number) => ({
      id: item.id || `${idx}-${itemIdx}`,
      sequenceNo: item.sequenceNo || itemIdx + 1,
      qty: Number(item.qty || 0) || undefined,
      packageTypeCode: item.packageTypeCode || undefined,
      grossWeight: Number(item.grossWeight || 0) || undefined,
      netWeight: Number(item.netWeight || 0) || undefined,
      measurementCbm: Number(item.measurementCbm || 0) || undefined,
      description:
        item.description ||
        bcData.value?.mainDescription ||
        props.job?.mainDescription ||
        props.job?.commodity ||
        "",
      hsCode: item.hsCode || props.job?.hsCode || "",
    })),
  }));

const fcrContainers = computed(() => {
  const source = bcData.value?.containers?.length
    ? bcData.value.containers
    : props.job?.jobContainers;
  const mapped = mapContainers(source);
  if (mapped.length) return mapped;
  return [
    {
      id: "fallback",
      isFallback: true,
      items: [],
      totalQty: Number(props.job?.quantity || 0) || undefined,
      totalGrossWeight: Number(props.job?.grossWeight || 0) || undefined,
      totalNetWeight: Number(props.job?.netWeight || 0) || undefined,
      totalMeasurementCbm: Number(props.job?.measurement || 0) || undefined,
    },
  ];
});

const fcrJob = computed<ActiveJobData>(() => ({
  ...props.job,
  pol: bcData.value?.pol || props.job?.pol,
  pod: bcData.value?.pod || props.job?.pod,
  polName: bcData.value?.polName || props.job?.polName,
  podName: bcData.value?.podName || props.job?.podName,
  preCarriageBy: bcData.value?.preCarriageBy || props.job?.preCarriageBy,
  placeOfReceipt: bcData.value?.placeOfReceipt || props.job?.placeOfReceipt,
  placeOfDelivery: bcData.value?.placeOfDelivery || props.job?.placeOfDelivery,
  finalDestination: bcData.value?.finalDestination || props.job?.finalDestination,
  mainDescription: bcData.value?.mainDescription || props.job?.mainDescription,
  shippingMark: bcData.value?.shippingMark || props.job?.shippingMark,
  etd: bcData.value?.etd || props.job?.etd,
  eta: bcData.value?.eta || props.job?.eta,
  jobContainers: fcrContainers.value,
  jobParties: fcrParties.value,
}));

const fcrBl = computed<ActiveBlData>(() => ({
  id: `fcr-${bcData.value?.id || props.job?.id || "draft"}`,
  blNumber: bcData.value?.bookingNumber || props.job?.jobNumber || "",
  blType: "DRAFT",
  status: "draft",
  job: fcrJob.value,
  parties: fcrParties.value,
  containers: fcrContainers.value,
  jobContainers: fcrContainers.value,
  renderContainers: fcrContainers.value,
  vessels: bcData.value?.vessels?.length ? bcData.value.vessels : props.job?.vessels || [],
  placeOfIssue: props.job?.placeOfIssue || props.job?.polName || props.job?.pol || "",
  dateOfIssue: bcData.value?.bookingDate || new Date().toISOString(),
  dateCargoReceived:
    bcData.value?.dateCargoReceived || props.job?.billsOfLading?.[0]?.dateCargoReceived || "",
  mainDescription:
    bcData.value?.mainDescription || props.job?.mainDescription || props.job?.commodity || "",
  cargoDescription:
    bcData.value?.mainDescription || props.job?.mainDescription || props.job?.commodity || "",
  freightTerm: props.job?.freightTerm || "PREPAID",
  prepaid:
    props.job?.freightTerm === "COLLECT"
      ? ""
      : `PREPAID AT ${props.job?.polName || props.job?.pol || ""}`,
  collect:
    props.job?.freightTerm === "COLLECT"
      ? `COLLECT AT ${props.job?.podName || props.job?.pod || ""}`
      : "",
  shipperReferences: bcData.value?.shipperReferences || props.job?.shipperReferences || [],
  showShipperReferencesOnBl: true,
}));

const LINE_HEIGHT = 16;
const PAGE_1_MAX_HEIGHT = 230;
const PAGE_2_MAX_HEIGHT = 750;
const CHARS_PER_LINE = 32;

const paginatedPages = computed(() => {
  const pages: EblContainer[][] = [];
  let currentPageContent: EblContainer[] = [];
  let currentHeight = 0;
  let isFirstPage = true;
  const getMaxHeight = () => (isFirstPage ? PAGE_1_MAX_HEIGHT : PAGE_2_MAX_HEIGHT);

  fcrContainers.value.forEach((container) => {
    const headerHeight = 60;
    if (currentHeight + headerHeight > getMaxHeight()) {
      pages.push(currentPageContent);
      currentPageContent = [];
      currentHeight = 0;
      isFirstPage = false;
    }

    let currentContainerOnPage: EblContainer = {
      ...container,
      renderItems: [],
      isHeaderVisible: true,
    };
    currentHeight += headerHeight;

    const pushCurrentPage = () => {
      currentPageContent.push(currentContainerOnPage);
      if (currentPageContent.length > 0) pages.push(currentPageContent);
      currentPageContent = [];
      currentHeight = 10;
      isFirstPage = false;
      currentContainerOnPage = { ...container, renderItems: [], isHeaderVisible: false };
    };

    (container.items || []).forEach((item: EblContainerItem) => {
      const lines: string[] = [];
      (item.description || "").split("\n").forEach((line) => {
        if (line.length <= CHARS_PER_LINE) {
          lines.push(line);
        } else {
          lines.push(...(line.match(new RegExp(`.{1,${CHARS_PER_LINE}}`, "g")) || []));
        }
      });

      let remainingLines = lines.length ? [...lines] : [""];
      let isFirstSegment = true;
      while (remainingLines.length > 0) {
        const availableHeight = getMaxHeight() - currentHeight - 12;
        const linesFit = Math.max(0, Math.floor(availableHeight / LINE_HEIGHT));
        if (linesFit <= 0) {
          pushCurrentPage();
          continue;
        }

        const chunk = remainingLines.slice(0, linesFit);
        remainingLines = remainingLines.slice(linesFit);
        const isFinalSegment = remainingLines.length === 0;
        currentContainerOnPage.renderItems?.push({
          ...item,
          qty: isFirstSegment ? item.qty : undefined,
          grossWeight: isFirstSegment ? item.grossWeight : undefined,
          netWeight: isFirstSegment ? item.netWeight : undefined,
          measurementCbm: isFirstSegment ? item.measurementCbm : undefined,
          hsCode: isFinalSegment ? item.hsCode : undefined,
          displayLines: chunk,
          isContinuationSegment: !isFirstSegment,
        });
        currentHeight += chunk.length * LINE_HEIGHT + 12;
        isFirstSegment = false;
        if (remainingLines.length > 0) pushCurrentPage();
      }
    });

    currentPageContent.push(currentContainerOnPage);
    currentHeight += 20;
  });

  if (currentPageContent.length > 0) pages.push(currentPageContent);
  return pages.length ? pages : [[{ isHeaderVisible: true, isFallback: true, renderItems: [] }]];
});

const renderedPages = computed(() =>
  paginatedPages.value.map((pageItems, pageIndex) => ({
    key: `fcr-front-${pageIndex}`,
    type: "front" as const,
    pageIndex,
    pageItems,
    copyLabel: "NOT NEGOTIABLE",
    showWatermark: false,
  })),
);

const generatePDF = async () => {
  if (!fcrContainer.value || !props.job) return;
  try {
    isGeneratingPDF.value = true;
    toast.info("Generating FCR PDF...");
    await nextTick();

    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pages = fcrContainer.value.querySelectorAll(".a4-page-wrapper");

    for (let i = 0; i < pages.length; i++) {
      const pageEl = pages[i];
      if (!pageEl) continue;
      if (i > 0) pdf.addPage();
      const canvas = await html2canvas(pageEl as HTMLElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        scrollY: 0,
        scrollX: 0,
      });
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.85), "JPEG", 0, 0, 210, 297, undefined, "FAST");
    }

    pdf.save(`FCR_${bcData.value?.bookingNumber || props.job.jobNumber || "JOB"}.pdf`);
    toast.success("FCR exported successfully.");
  } catch (error) {
    console.error("FCR PDF generation failed:", error);
    toast.error("Failed to generate FCR PDF.");
  } finally {
    isGeneratingPDF.value = false;
  }
};
</script>

<template>
  <div class="space-y-6 relative">
    <UiLoadingSkeleton v-if="isLoading" variant="form" />

    <template v-else-if="!bcData">
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-base font-bold text-foreground">FCR</h3>
          </div>
          <button
            v-if="canManageJob"
            type="button"
            @click="handleCreateFcr"
            :disabled="isCreating"
            class="px-3 py-2 rounded-md text-xs font-semibold transition-colors flex items-center gap-2 bg-[#012D5A] text-white hover:bg-[#012D5A]/90 disabled:opacity-50"
          >
            <Loader2 v-if="isCreating" class="w-4 h-4 animate-spin" />
            <Plus v-else class="w-4 h-4" />
            ADD FCR
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
          <p class="text-sm font-semibold text-foreground mb-1">No FCR available</p>
          <p class="text-xs text-muted-foreground max-w-[240px] mx-auto leading-relaxed">
            There are no FCR documents linked to this job yet.
          </p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="bc in bcList"
            :key="bc.id"
            @click="selectFcrSource(bc)"
            class="group p-4 rounded-xl border border-border bg-white hover:border-[#012D5A]/30 hover:shadow-md transition-all cursor-pointer"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span
                    class="font-bold text-sm text-foreground group-hover:text-[#012D5A] transition-colors flex items-center gap-1.5"
                  >
                    {{ bc.bookingNumber || "Draft FCR" }}
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
                  :class="[
                    'px-2.5 py-1 rounded-md text-[10px] font-bold border uppercase tracking-widest leading-none',
                    bc.status === 'finalized'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-amber-200 bg-amber-50 text-amber-700',
                  ]"
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
        <div class="flex items-start gap-4">
          <button
            @click="closeFcr"
            class="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shrink-0 mt-0.5"
          >
            <ArrowLeft class="w-5 h-5" />
          </button>
          <div class="flex flex-col gap-2 mt-1">
            <h1 class="text-2xl font-bold text-foreground leading-none">
              {{ bcData.bookingNumber || "FCR Details" }}
            </h1>
            <p class="text-sm text-muted-foreground leading-none mb-1">
              Forwarder certificate of receipt for this job.
            </p>
            <div class="flex items-center gap-3">
              <span
                :class="[
                  'px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border leading-none max-w-fit',
                  isFinalized
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-amber-200 bg-amber-50 text-amber-700',
                ]"
              >
                {{ isFinalized ? "Finalized" : "Draft" }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="!editMode" class="flex flex-wrap items-center justify-end gap-3 shrink-0">
          <button
            v-if="canManageJob && !isFinalized"
            type="button"
            @click="toggleEditMode"
            class="px-4 py-2 text-xs font-semibold rounded-md border border-border bg-white hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-colors"
          >
            <Edit class="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            v-if="canManageJob && !isFinalized"
            type="button"
            @click="handleDeleteFcr"
            class="px-4 py-2 text-xs font-semibold rounded-md border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 flex items-center gap-2 shadow-sm transition-colors"
          >
            <Trash2 class="w-3.5 h-3.5" />
            Delete
          </button>
          <button
            v-if="canManageJob && isFinalized"
            type="button"
            @click="handleUnfinalize"
            class="px-4 py-2 text-xs font-semibold rounded-md border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 flex items-center gap-2 shadow-sm transition-colors"
          >
            <RotateCcw class="w-3.5 h-3.5" />
            Reopen Draft
          </button>
          <button
            v-else-if="canManageJob"
            type="button"
            @click="handleFinalize"
            class="px-4 py-2 text-xs font-semibold rounded-md border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center gap-2 shadow-sm transition-colors"
          >
            <CheckCircle2 class="w-3.5 h-3.5" />
            Finalize
          </button>
          <button
            type="button"
            @click="generatePDF"
            :disabled="isGeneratingPDF || isLoading"
            class="px-4 py-2 bg-[#012D5A] hover:bg-[#012D5A]/90 text-white rounded-md shadow-sm text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Loader2 v-if="isGeneratingPDF" class="w-3.5 h-3.5 animate-spin" />
            <Download v-else class="w-3.5 h-3.5" />
            {{ isGeneratingPDF ? "Generating..." : "Download PDF" }}
          </button>
        </div>
      </div>

      <div v-if="editMode" class="w-full relative">
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
            @click="handleSaveFcr"
            :disabled="isSaving"
            class="px-4 py-2 bg-[#012D5A] hover:bg-[#012D5A]/90 text-white rounded-md shadow-sm text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Loader2 v-if="isSaving" class="w-3.5 h-3.5 animate-spin" />
            <Save v-else class="w-3.5 h-3.5" />
            {{ isSaving ? "Saving..." : "Save Changes" }}
          </button>
        </div>
      </div>
      <div v-else class="flex justify-center bg-gray-50/50 py-12 rounded-2xl overflow-auto">
        <div ref="fcrContainer" class="relative group flex flex-col gap-10">
          <JobEblFrontPage
            v-for="page in renderedPages"
            :key="page.key"
            :page="page"
            :jobData="fcrJob"
            :activeBl="fcrBl"
            :logoUrl="logoUrl"
            :isAir="false"
            :isTrucking="false"
            watermarkColor="red"
            :paginatedPagesLength="paginatedPages.length"
            documentMode="fcr"
          />
        </div>
      </div>
    </template>
  </div>
</template>
