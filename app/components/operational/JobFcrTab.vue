<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any -- FCR maps loose job/BC data into eBL print shape */
import { computed, nextTick, onMounted, ref } from "vue";
import { Download, Loader2 } from "lucide-vue-next";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "vue-sonner";
import JobEblFrontPage from "./ebl/JobEblFrontPage.vue";
import type { ActiveBlData, ActiveJobData, EblContainer, EblContainerItem } from "./ebl/types";
import {
  useBookingConfirmation,
  type BookingConfirmation,
} from "~/composables/useBookingConfirmation";

const props = defineProps<{
  job: any;
}>();

const { getBookingConfirmation } = useBookingConfirmation();
const bcData = ref<BookingConfirmation | null>(null);
const isLoading = ref(false);
const isGeneratingPDF = ref(false);
const fcrContainer = ref<HTMLElement | null>(null);
const logoUrl = ref("/images/transparentnscontinenttebal.png");

onMounted(async () => {
  if (typeof window !== "undefined") {
    logoUrl.value = window.location.origin + "/images/transparentnscontinenttebal.png";
  }
  if (!props.job?.id) return;
  isLoading.value = true;
  const res = await getBookingConfirmation(props.job.id);
  if (res.success && res.data) bcData.value = res.data;
  isLoading.value = false;
});

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
  id: `fcr-${props.job?.id || "draft"}`,
  blNumber: props.job?.jobNumber || "",
  blType: "DRAFT",
  status: "draft",
  job: fcrJob.value,
  parties: fcrParties.value,
  containers: fcrContainers.value,
  jobContainers: fcrContainers.value,
  renderContainers: fcrContainers.value,
  vessels: bcData.value?.vessels?.length ? bcData.value.vessels : props.job?.vessels || [],
  placeOfIssue: props.job?.placeOfIssue || props.job?.polName || props.job?.pol || "",
  dateOfIssue: new Date().toISOString(),
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

    pdf.save(`FCR_${props.job.jobNumber || "JOB"}.pdf`);
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
  <div class="space-y-6 animate-fade-in pb-12 pt-4">
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-6 mb-6"
    >
      <div class="flex flex-col gap-2 mt-1">
        <h1 class="text-2xl font-bold text-foreground leading-none">FCR</h1>
        <p class="text-sm text-muted-foreground leading-none mb-1">
          Forwarder certificate of receipt for this job.
        </p>
      </div>
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

    <div class="flex justify-center bg-gray-50/50 py-12 rounded-2xl overflow-auto">
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
  </div>
</template>
