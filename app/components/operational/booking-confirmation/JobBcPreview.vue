<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any -- loose job/BC snapshot data */
import { ref, computed, nextTick, onMounted } from "vue";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "vue-sonner";
import type { BookingConfirmation } from "~/composables/useBookingConfirmation";
import JobBcFrontPage from "./JobBcFrontPage.vue";

// Standalone Booking Confirmation preview. Copy-adapted from operational/ebl/JobEblPreview.vue
// (pagination + PDF export only). It does NOT import or modify any eBL component.
// No copy/original/watermark export modes — those were struck out in Mas Naufal's markup,
// so a separate JobBcExportConfig is unnecessary; export is a single plain action here.

const props = defineProps<{
  jobData: any;
  bcData: BookingConfirmation;
}>();

const logoUrl = ref("/images/transparentnscontinenttebal.png");
onMounted(() => {
  if (typeof window !== "undefined") {
    logoUrl.value = window.location.origin + "/images/transparentnscontinenttebal.png";
  }
});

const isAir = computed(
  () => props.jobData?.shipmentType === "AIR" || props.jobData?.serviceType === "AIR",
);
const isTrucking = computed(() => props.jobData?.serviceType === "TRUCKING");

// Prefer the BC's own snapshot; fall back to the live Job for BCs created before
// the standalone snapshot existed (so they still render).
const containers = computed(() => props.bcData?.containers || props.jobData?.jobContainers || []);

// --- Pagination (adapted from JobEblPreview). ---
// Page 1 has the full routing section above the cargo grid, so it holds fewer rows than
// continuation pages (which only carry a minimal vessel header). Like the invoice budget
// model, page 1 fills up to its smaller budget first, then overflow drops to page 2+.
const LINE_HEIGHT = 16;
const PAGE_1_MAX_HEIGHT = 520; // cargo room on page 1 (after routing section)
const PAGE_N_MAX_HEIGHT = 780; // cargo room on continuation pages
const CHARS_PER_LINE = 32;

const paginatedPages = computed(() => {
  const pages: any[][] = [];
  let currentPageContent: any[] = [];
  let currentHeight = 0;
  let isFirstPage = true;

  const getMaxHeight = () => (isFirstPage ? PAGE_1_MAX_HEIGHT : PAGE_N_MAX_HEIGHT);

  if (!containers.value || containers.value.length === 0) {
    return [[{ isHeaderVisible: true, isFallback: true, renderItems: [] }]];
  }

  containers.value.forEach((container: any) => {
    if (!container) return;
    const headerHeight = 60;

    if (currentHeight + headerHeight > getMaxHeight()) {
      pages.push(currentPageContent);
      currentPageContent = [];
      currentHeight = 0;
      isFirstPage = false;
    }

    let currentContainerOnPage: any = { ...container, renderItems: [], isHeaderVisible: true };
    currentHeight += headerHeight;

    (container.items || []).forEach((item: any) => {
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

      const itemTotalHeight = processedLines.length * LINE_HEIGHT + 12;

      if (currentHeight + itemTotalHeight > getMaxHeight()) {
        currentPageContent.push(currentContainerOnPage);
        pages.push(currentPageContent);
        currentPageContent = [];
        currentHeight = 10;
        isFirstPage = false;
        currentContainerOnPage = { ...container, renderItems: [], isHeaderVisible: false };
      }

      currentContainerOnPage.renderItems.push({ ...item, displayLines: processedLines });
      currentHeight += itemTotalHeight;
    });

    currentPageContent.push(currentContainerOnPage);
    currentHeight += 20;
  });

  if (currentPageContent.length > 0) pages.push(currentPageContent);
  return pages;
});

const renderedPages = computed(() =>
  paginatedPages.value.map((pageItems, pageIndex) => ({ pageIndex, pageItems })),
);

// --- PDF export (adapted from JobEblPreview.generatePDF, watermark drawing removed) ---
const bcContainer = ref<HTMLElement | null>(null);
const isGeneratingPDF = ref(false);

const handleExportPdf = async () => {
  if (!bcContainer.value || !props.jobData) return false;
  try {
    isGeneratingPDF.value = true;
    toast.info("Generating PDF, please wait...");
    await nextTick();

    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pages = bcContainer.value.querySelectorAll(".a4-page-wrapper");

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

      const imgData = canvas.toDataURL("image/jpeg", 0.85);
      pdf.addImage(imgData, "JPEG", 0, 0, 210, 297, undefined, "FAST");
    }

    pdf.save(`Booking_Confirmation_${props.jobData.jobNumber || "Draft"}.pdf`);
    toast.success("PDF exported successfully");
    return true;
  } catch (error) {
    console.error("PDF generation failed:", error);
    toast.error("Failed to generate PDF");
    return false;
  } finally {
    isGeneratingPDF.value = false;
  }
};

defineExpose({ handleExportPdf, isGeneratingPDF });
</script>

<template>
  <div class="flex justify-center bg-gray-50/50 py-12 rounded-2xl overflow-auto">
    <div class="relative flex flex-col gap-10" ref="bcContainer">
      <JobBcFrontPage
        v-for="page in renderedPages"
        :key="page.pageIndex"
        :page="page"
        :jobData="jobData"
        :bcData="bcData"
        :logoUrl="logoUrl"
        :isAir="isAir"
        :isTrucking="isTrucking"
        :paginatedPagesLength="paginatedPages.length"
      />
    </div>
  </div>
</template>
