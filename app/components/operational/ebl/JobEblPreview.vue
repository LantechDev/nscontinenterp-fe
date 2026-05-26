<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch } from "vue";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "vue-sonner";
import type { ActiveJobData, ActiveBlData, EblContainer, EblContainerItem } from "./types";
import { useBlConditions } from "~/composables/useBlConditions";
import JobEblExportConfig from "./JobEblExportConfig.vue";
import JobEblFrontPage from "./JobEblFrontPage.vue";
import JobEblBackPage from "./JobEblBackPage.vue";

const props = defineProps<{
  jobData: ActiveJobData;
  activeBl: ActiveBlData | null;
}>();

const { conditions, fetchConditions } = useBlConditions();
const activeConditions = computed(() =>
  conditions.value
    .filter((c) => c.isActive)
    .map((c) => ({
      ...c,
      clauseContent: (c.clauseContent || "").trim(),
    })),
);

const logoUrl = ref("/images/transparentnscontinenttebal.png");
onMounted(async () => {
  if (typeof window !== "undefined") {
    logoUrl.value = window.location.origin + "/images/transparentnscontinenttebal.png";
  }
  await fetchConditions();
});

const isGeneratingPDF = ref(false);
const eblContainer = ref<HTMLElement | null>(null);

const isAir = computed(
  () =>
    props.jobData?.shipmentType === "AIR" ||
    props.activeBl?.job?.shipmentType === "AIR" ||
    props.jobData?.serviceType === "AIR" ||
    props.activeBl?.job?.serviceType === "AIR",
);

const containers = computed(() => {
  if (
    props.activeBl?.renderContainers &&
    Array.isArray(props.activeBl.renderContainers) &&
    props.activeBl.renderContainers.length > 0
  ) {
    return props.activeBl.renderContainers;
  }
  if (
    props.activeBl?.jobContainers &&
    Array.isArray(props.activeBl.jobContainers) &&
    props.activeBl.jobContainers.length > 0
  ) {
    return props.activeBl.jobContainers;
  }
  if (
    props.activeBl?.blContainers &&
    Array.isArray(props.activeBl.blContainers) &&
    props.activeBl.blContainers.length > 0
  ) {
    return props.activeBl.blContainers.map(
      (bc: { container?: EblContainer } & EblContainer) => bc.container,
    );
  }
  if (
    props.activeBl?.containers &&
    Array.isArray(props.activeBl.containers) &&
    props.activeBl.containers.length > 0
  ) {
    return props.activeBl.containers;
  }
  if (
    props.jobData?.jobContainers &&
    Array.isArray(props.jobData.jobContainers) &&
    props.jobData.jobContainers.length > 0
  ) {
    return props.jobData.jobContainers;
  }
  return [];
});

const LINE_HEIGHT = 16;
const PAGE_1_MAX_HEIGHT = 200;
const PAGE_2_MAX_HEIGHT = 750;
const CHARS_PER_LINE = 32;

const paginatedPages = computed(() => {
  const pages: Array<EblContainer[]> = [];
  let currentPageContent: EblContainer[] = [];
  let currentHeight = 0;
  let isFirstPage = true;

  const getMaxHeight = () => (isFirstPage ? PAGE_1_MAX_HEIGHT : PAGE_2_MAX_HEIGHT);

  if (!containers.value || containers.value.length === 0) {
    return [[{ isHeaderVisible: true, isFallback: true, renderItems: [] } as EblContainer]];
  }

  containers.value.forEach((container: EblContainer | undefined) => {
    if (!container) return;

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

    (container.items || []).forEach((item: EblContainerItem) => {
      const descriptionText = (item.description || "").trim();
      const rawLines = descriptionText.split("\n");
      const processedLines: string[] = [];

      rawLines.forEach((line: string) => {
        if (line.length <= CHARS_PER_LINE) {
          processedLines.push(line);
        } else {
          const regex = new RegExp(`.{1,${CHARS_PER_LINE}}`, "g");
          const chunks = line.match(regex);
          if (chunks) processedLines.push(...chunks);
        }
      });

      const itemLinesCount = processedLines.length;
      const itemTotalHeight = itemLinesCount * LINE_HEIGHT + 12;

      if (currentHeight + itemTotalHeight > getMaxHeight()) {
        currentPageContent.push(currentContainerOnPage);
        pages.push(currentPageContent);

        currentPageContent = [];
        currentHeight = 10;
        isFirstPage = false;

        currentContainerOnPage = {
          ...container,
          renderItems: [],
          isHeaderVisible: false,
        };
      }

      if (!currentContainerOnPage.renderItems) currentContainerOnPage.renderItems = [];
      currentContainerOnPage.renderItems.push({
        ...item,
        displayLines: processedLines,
      });
      currentHeight += itemTotalHeight;
    });

    currentPageContent.push(currentContainerOnPage);
    currentHeight += 20;
  });

  if (currentPageContent.length > 0) pages.push(currentPageContent);
  return pages;
});

const normalizeBlStatus = (status?: string | null) => {
  const lower = status?.toLowerCase();
  if (!lower) return "";
  if (lower === "finalized" || lower === "confirmed") return "confirmed";
  if (lower === "pending_approval") return "pending_approval";
  return lower;
};

const permanentBlType = computed(() => {
  const rawStatus =
    typeof props.activeBl?.status === "string"
      ? props.activeBl.status
      : props.activeBl?.status?.code || props.activeBl?.status?.name || "";
  const statusCandidates = [props.activeBl?.statusRaw, props.activeBl?.statusId, rawStatus].map(
    (status) => normalizeBlStatus(status),
  );
  const isFinalized = statusCandidates.includes("confirmed");
  const type = (props.activeBl?.blType || props.jobData?.blType || "").toUpperCase();

  if (isFinalized && (!type || type === "DRAFT")) return "ORIGINAL";
  return type || "DRAFT";
});

const defaultExportMode = computed(() => {
  const pType = permanentBlType.value;
  if (pType === "ORIGINAL") return "ORIGINAL";
  if (pType === "TELEX_RELEASE") return "EXPRESS_RELEASE";
  if (pType === "SEAWAYBILL") return "SEAWAYBILL";
  return "DRAFT";
});

const exportMode = ref(defaultExportMode.value);
const jumlahOriginal = ref(3);
const jumlahCopy = ref(2);
const watermarkColor = ref<string>("red");

let lastBlType: string | null = null;
watch(
  permanentBlType,
  (newType) => {
    if (newType === lastBlType) return;
    lastBlType = newType;
    exportMode.value = defaultExportMode.value;

    if (newType === "ORIGINAL") {
      jumlahOriginal.value = 3;
      jumlahCopy.value = 2;
    } else {
      jumlahOriginal.value = 0;
      jumlahCopy.value = 3;
    }
  },
  { immediate: true },
);

watch(exportMode, (newMode) => {
  if (newMode === "ORIGINAL") {
    if (jumlahOriginal.value === 0) jumlahOriginal.value = 3;
    if (jumlahCopy.value === 0) jumlahCopy.value = 2;
    return;
  }

  jumlahOriginal.value = 0;
  if (jumlahCopy.value === 0) jumlahCopy.value = 3;
});

interface RenderedPage {
  key: string;
  type: "front" | "back";
  pageIndex: number;
  pageItems: EblContainer[];
  copyLabel: string;
  showWatermark: boolean;
}

const getOrdinalLabel = (o: number) => {
  const ordinals = [
    "FIRST",
    "SECOND",
    "THIRD",
    "FOURTH",
    "FIFTH",
    "SIXTH",
    "SEVENTH",
    "EIGHTH",
    "NINTH",
    "TENTH",
  ];
  if (o >= 1 && o <= ordinals.length) {
    return `${ordinals[o - 1]} ORIGINAL`;
  }
  return `${o}TH ORIGINAL`;
};

const renderedPages = computed(() => {
  const list: RenderedPage[] = [];
  const P = paginatedPages.value.length;
  const hasBackPage = activeConditions.value.length > 0;
  const mode = exportMode.value;

  if (mode === "ORIGINAL") {
    // 1. Generate Originals
    for (let o = 1; o <= jumlahOriginal.value; o++) {
      const label = getOrdinalLabel(o);
      for (let p = 0; p < P; p++) {
        list.push({
          key: `original-${o}-front-${p}`,
          type: "front",
          pageIndex: p,
          pageItems: paginatedPages.value[p] || [],
          copyLabel: label,
          showWatermark: false,
        });
      }
      if (hasBackPage) {
        list.push({
          key: `original-${o}-back`,
          type: "back",
          pageIndex: 0,
          pageItems: [],
          copyLabel: label,
          showWatermark: false,
        });
      }
    }

    // 2. Generate Copies
    for (let c = 1; c <= jumlahCopy.value; c++) {
      const label = "NON NEGOTIABLE COPY";
      for (let p = 0; p < P; p++) {
        list.push({
          key: `copy-${c}-front-${p}`,
          type: "front",
          pageIndex: p,
          pageItems: paginatedPages.value[p] || [],
          copyLabel: label,
          showWatermark: false,
        });
      }
      if (hasBackPage) {
        list.push({
          key: `copy-${c}-back`,
          type: "back",
          pageIndex: 0,
          pageItems: [],
          copyLabel: label,
          showWatermark: false,
        });
      }
    }
  } else if (mode === "EXPRESS_RELEASE") {
    // Generate Copies with EXPRESS RELEASE watermark
    for (let c = 1; c <= jumlahCopy.value; c++) {
      const label = "NON NEGOTIABLE COPY";
      for (let p = 0; p < P; p++) {
        list.push({
          key: `express-${c}-front-${p}`,
          type: "front",
          pageIndex: p,
          pageItems: paginatedPages.value[p] || [],
          copyLabel: label,
          showWatermark: true,
        });
      }
      if (hasBackPage) {
        list.push({
          key: `express-${c}-back`,
          type: "back",
          pageIndex: 0,
          pageItems: [],
          copyLabel: label,
          showWatermark: false,
        });
      }
    }
  } else if (mode === "SEAWAYBILL") {
    // Generate Copies labeled "SEA WAYBILL"
    for (let c = 1; c <= jumlahCopy.value; c++) {
      const label = "SEA WAYBILL";
      for (let p = 0; p < P; p++) {
        list.push({
          key: `seaway-${c}-front-${p}`,
          type: "front",
          pageIndex: p,
          pageItems: paginatedPages.value[p] || [],
          copyLabel: label,
          showWatermark: false,
        });
      }
      if (hasBackPage) {
        list.push({
          key: `seaway-${c}-back`,
          type: "back",
          pageIndex: 0,
          pageItems: [],
          copyLabel: label,
          showWatermark: false,
        });
      }
    }
  } else if (mode === "DRAFT") {
    // Generate Draft copies (labeled DRAFT - NON NEGOTIABLE)
    for (let c = 1; c <= jumlahCopy.value; c++) {
      const label = "DRAFT - NON NEGOTIABLE";
      for (let p = 0; p < P; p++) {
        list.push({
          key: `draft-${c}-front-${p}`,
          type: "front",
          pageIndex: p,
          pageItems: paginatedPages.value[p] || [],
          copyLabel: label,
          showWatermark: false,
        });
      }
      if (hasBackPage) {
        list.push({
          key: `draft-${c}-back`,
          type: "back",
          pageIndex: 0,
          pageItems: [],
          copyLabel: label,
          showWatermark: false,
        });
      }
    }
  }

  return list;
});

const printSummary = computed(() => {
  const P = paginatedPages.value.length;
  const hasBack = activeConditions.value.length > 0;
  const pagesPerSet = hasBack ? P + 1 : P;
  const mode = exportMode.value;

  if (mode === "ORIGINAL") {
    const sets = jumlahOriginal.value + jumlahCopy.value;
    const totalPages = sets * pagesPerSet;
    return {
      type: "ORIGINAL",
      details: `${jumlahOriginal.value} Original Set(s) + ${jumlahCopy.value} Copy Set(s)`,
      sets,
      totalPages,
    };
  } else if (mode === "EXPRESS_RELEASE") {
    const sets = jumlahCopy.value;
    const totalPages = sets * pagesPerSet;
    return {
      type: "EXPRESS RELEASE",
      details: `${jumlahCopy.value} Copy Set(s) with EXPRESS RELEASE Watermark`,
      sets,
      totalPages,
    };
  } else if (mode === "SEAWAYBILL") {
    const sets = jumlahCopy.value;
    const totalPages = sets * pagesPerSet;
    return {
      type: "SEAWAYBILL",
      details: `${jumlahCopy.value} Copy Set(s) (Seawaybill)`,
      sets,
      totalPages,
    };
  } else {
    const sets = jumlahCopy.value;
    const totalPages = sets * pagesPerSet;
    return {
      type: "DRAFT",
      details: `${jumlahCopy.value} Draft Copy Set(s) (DRAFT - NON NEGOTIABLE)`,
      sets,
      totalPages,
    };
  }
});

const generatePDF = async () => {
  if (!eblContainer.value || !props.jobData) return false;

  try {
    isGeneratingPDF.value = true;
    await nextTick();

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pages = eblContainer.value.querySelectorAll(".a4-page-wrapper");

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

      // Draw watermark on canvas if the element has watermark container
      const hasWatermark = pageEl.querySelector(".watermark-container") !== null;
      if (hasWatermark) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.save();

          // Reset transform matrix to absolute canvas pixels
          ctx.setTransform(1, 0, 0, 1, 0, 0);

          // Calculate scale factor relative to base A4 design width (794px)
          const scale = canvas.width / 794;

          // Calculate center of the absolute canvas
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2 - 0.08 * canvas.height; // shifts watermark up by 8% of page height

          ctx.translate(centerX, centerY);
          ctx.rotate((-30 * Math.PI) / 180); // Rotate -30 degrees

          const text = "EXPRESS RELEASE";
          const fontSize = 72 * scale;

          // Configure text styling
          ctx.font = `900 ${fontSize}px Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif`;
          ctx.textBaseline = "middle";
          ctx.textAlign = "center";

          // Apply letter spacing (6px in CSS -> 12px on canvas)
          const letterSpacing = 6 * scale;
          if ("letterSpacing" in ctx) {
            (ctx as unknown as { letterSpacing: string }).letterSpacing = `${letterSpacing}px`;
          }

          const textMetrics = ctx.measureText(text);
          const textWidth = textMetrics.width;
          const textHeight = fontSize * 0.8; // Approximate uppercase letter height

          const padY = 20 * scale;
          const padX = 60 * scale;
          const boxWidth = textWidth + padX * 2;
          const boxHeight = textHeight + padY * 2;
          const borderRadius = 4 * scale;
          const borderThickness = 8 * scale;

          // Apply watermark color
          const isRed = watermarkColor.value === "red";
          const color = isRed ? "#c62828" : "#0d47a1";

          ctx.strokeStyle = color;
          ctx.fillStyle = color;
          ctx.lineWidth = borderThickness;
          ctx.globalAlpha = 0.18; // Opacity of 0.18 for both box and text

          const x = -boxWidth / 2;
          const y = -boxHeight / 2;

          ctx.beginPath();
          if (typeof ctx.roundRect === "function") {
            ctx.roundRect(x, y, boxWidth, boxHeight, borderRadius);
          } else {
            ctx.rect(x, y, boxWidth, boxHeight);
          }
          ctx.stroke();

          // Draw the text
          ctx.fillText(text, 0, 0);
          ctx.restore();
        }
      }

      const imgData = canvas.toDataURL("image/jpeg", 0.8);
      pdf.addImage(imgData, "JPEG", 0, 0, 210, 297, undefined, "FAST");
    }

    pdf.save(`${isAir.value ? "AWB" : "BL"}_${props.jobData.jobNumber || "DRAFT"}.pdf`);
    return true;
  } catch (error) {
    console.error(error);
    toast.error("Gagal membuat PDF. Cek console.");
    return false;
  } finally {
    isGeneratingPDF.value = false;
  }
};

defineExpose({
  generatePDF,
  isGeneratingPDF,
});
</script>

<template>
  <div class="space-y-6 w-full">
    <!-- PDF Print Options Card -->
    <JobEblExportConfig
      v-model:exportMode="exportMode"
      :permanentBlType="permanentBlType"
      v-model:jumlahOriginal="jumlahOriginal"
      v-model:jumlahCopy="jumlahCopy"
      v-model:watermarkColor="watermarkColor"
      :printSummary="printSummary"
      :isGeneratingPDF="isGeneratingPDF"
    />

    <!-- Preview Canvas -->
    <div class="flex justify-center bg-gray-50/50 py-12 rounded-2xl overflow-auto">
      <div class="relative group flex flex-col gap-10" ref="eblContainer">
        <template v-for="page in renderedPages" :key="page.key">
          <!-- Front Page -->
          <JobEblFrontPage
            v-if="page.type === 'front'"
            :page="page"
            :jobData="jobData"
            :activeBl="activeBl"
            :logoUrl="logoUrl"
            :isAir="isAir"
            :watermarkColor="watermarkColor"
            :paginatedPagesLength="paginatedPages.length"
          />

          <!-- Conditions of Contract Page (Back Page) -->
          <JobEblBackPage
            v-else-if="page.type === 'back'"
            :isAir="isAir"
            :activeConditions="activeConditions"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
#print-target {
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}
</style>
