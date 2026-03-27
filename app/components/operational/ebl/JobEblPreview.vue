<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from "vue";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "vue-sonner";
import type {
  ActiveJobData,
  ActiveBlData,
  EblParty,
  EblContainer,
  EblContainerItem,
} from "./types";

const props = defineProps<{
  jobData: ActiveJobData;
  activeBl: ActiveBlData | null;
}>();

const logoUrl = ref("/images/transparentnscontinenttebal.png");
onMounted(() => {
  if (typeof window !== "undefined") {
    logoUrl.value = window.location.origin + "/images/transparentnscontinenttebal.png";
  }
});

const isGeneratingPDF = ref(false);
const eblContainer = ref<HTMLElement | null>(null);

const getVal = (val: unknown, fallback: unknown = "") =>
  val ? String(val) : fallback ? String(fallback) : "";

const formatNumber = (num: unknown, decimals: number = 3): string => {
  if (!num && num !== 0) return "-";
  const n = parseFloat(num as string);
  if (isNaN(n)) return "-";
  return n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: decimals });
};

const getContainerTotals = (cnt: EblContainer) => {
  let gw = 0,
    nw = 0,
    cbm = 0,
    qty = 0;
  if (cnt.items && Array.isArray(cnt.items)) {
    cnt.items.forEach((item: EblContainerItem) => {
      qty += Number(item.qty) || 0;
      gw += Number(item.grossWeight) || 0;
      nw += Number(item.netWeight) || 0;
      cbm += Number(item.measurementCbm) || 0;
    });
  }

  if (qty === 0) qty = Number(cnt.totalQty) || Number(cnt.quantity) || 0;
  if (gw === 0) gw = Number(cnt.totalGrossWeight) || Number(cnt.grossWeight) || 0;
  if (nw === 0) nw = Number(cnt.totalNetWeight) || Number(cnt.netWeight) || 0;
  if (cbm === 0) cbm = Number(cnt.totalMeasurementCbm) || Number(cnt.measurement) || 0;

  if (containers.value?.length === 1) {
    if (qty === 0) qty = Number(props.activeBl?.totalQty) || Number(props.jobData?.quantity) || 0;
    if (gw === 0)
      gw = Number(props.activeBl?.totalGrossWeight) || Number(props.jobData?.grossWeight) || 0;
    if (nw === 0)
      nw = Number(props.activeBl?.totalNetWeight) || Number(props.jobData?.netWeight) || 0;
    if (cbm === 0)
      cbm = Number(props.activeBl?.totalMeasurementCbm) || Number(props.jobData?.measurement) || 0;
  }

  return { gw, nw, cbm, qty };
};

const shipper = computed(
  () =>
    props.activeBl?.job?.jobParties?.find((p: EblParty) => p.partyRole?.code === "SHIPPER") ||
    props.jobData?.jobParties?.find((p: EblParty) => p.partyRole?.code === "SHIPPER"),
);
const consignee = computed(
  () =>
    props.activeBl?.job?.jobParties?.find((p: EblParty) => p.partyRole?.code === "CONSIGNEE") ||
    props.jobData?.jobParties?.find((p: EblParty) => p.partyRole?.code === "CONSIGNEE"),
);
const notifyParty = computed(
  () =>
    props.activeBl?.job?.jobParties?.find(
      (p: EblParty) => p.partyRole?.code === "NOTIFY PARTY" || p.partyRole?.code === "NOTIFY_PARTY",
    ) || props.jobData?.jobParties?.find((p: EblParty) => p.partyRole?.code === "NOTIFY PARTY"),
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

const totals = computed(() => {
  let qty = 0;
  let grossWeight = 0;
  let netWeight = 0;
  let measurement = 0;

  if (containers.value && containers.value.length > 0) {
    ((containers.value || []) as EblContainer[]).forEach((cnt: EblContainer) => {
      const ct = getContainerTotals(cnt);
      qty += ct.qty;
      grossWeight += ct.gw;
      netWeight += ct.nw;
      measurement += ct.cbm;
    });
  }

  if (qty === 0) qty = Number(props.activeBl?.totalQty) || Number(props.jobData?.quantity) || 0;
  if (grossWeight === 0)
    grossWeight =
      Number(props.activeBl?.totalGrossWeight) || Number(props.jobData?.grossWeight) || 0;
  if (netWeight === 0)
    netWeight = Number(props.activeBl?.totalNetWeight) || Number(props.jobData?.netWeight) || 0;
  if (measurement === 0)
    measurement =
      Number(props.activeBl?.totalMeasurementCbm) || Number(props.jobData?.measurement) || 0;

  return { qty, grossWeight, netWeight, measurement };
});

const formatPartyDisplay = (partyInfo: EblParty | undefined) => {
  if (!partyInfo) return "";
  const name = partyInfo.companyName || partyInfo.company?.name || "";
  const address = partyInfo.addressBook?.fullAddress || partyInfo.addressBook?.address || "";
  const city = partyInfo.addressBook?.city || "";
  const parts = [name, address, city].filter(Boolean);
  return parts.join("\n");
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
      const descriptionText = item.description || "";
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
      if (i > 0) pdf.addPage();

      const canvas = await html2canvas(pages[i] as HTMLElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        scrollY: 0,
        scrollX: 0,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.8);
      pdf.addImage(imgData, "JPEG", 0, 0, 210, 297, undefined, "FAST");
    }

    pdf.save(`BL_${props.jobData.jobNumber || "DRAFT"}.pdf`);
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
  <div class="flex justify-center bg-gray-50/50 py-12 rounded-2xl overflow-auto">
    <div class="relative group flex flex-col gap-10" ref="eblContainer">
      <div
        v-for="(pageItems, pIdx) in paginatedPages"
        :key="'page-' + pIdx"
        class="a4-page-wrapper bg-white shadow-xl shrink-0 flex flex-col text-blue-900 border"
        style="
          width: 794px;
          height: 1123px;
          padding: 20px 30px;
          box-sizing: border-box;
          position: relative;
        "
      >
        <div
          class="header-section flex justify-between items-end mb-1 relative z-[1] bg-white"
          style="height: 70px"
        >
          <div class="w-[35%] pb-1">
            <img
              :src="logoUrl"
              alt="NS Continent Logo"
              class="h-16 object-contain max-w-[190px]"
              crossorigin="anonymous"
            />
          </div>
          <div class="w-[30%] text-center pb-2 flex flex-col justify-end h-full relative">
            <template v-if="activeBl?.status?.toLowerCase() === 'draft' || !activeBl">
              <span
                class="text-sm font-bold tracking-widest uppercase block leading-none text-blue-900"
                >DRAFT - NON NEGOTIABLE</span
              >
            </template>
            <template v-else>
              <span
                class="text-sm font-bold tracking-widest uppercase block leading-none text-blue-900"
                >ORIGINAL NEGOTIABLE</span
              >
            </template>
          </div>
          <div class="w-[35%] text-right pb-1 flex flex-col items-end justify-end h-full">
            <div class="text-[0.6rem] font-mono mb-1 text-black">
              PAGE: {{ pIdx + 1 }} OF {{ paginatedPages.length }}
            </div>
            <h1 class="text-lg font-bold tracking-widest uppercase leading-none">BILL OF LADING</h1>
          </div>
        </div>

        <div
          class="main-border-container border border-blue-900 flex-1 flex flex-col text-[0.7rem] relative overflow-hidden h-full"
        >
          <div v-if="pIdx === 0" class="routing-section relative z-[1] bg-white">
            <div class="flex border-b border-blue-900" style="min-height: 75px">
              <div class="w-1/2 border-r border-blue-900 pt-1 px-2 pb-2">
                <span class="font-bold mb-0.5 text-[0.6rem] leading-none block"
                  >SHIPPER/EXPORTER</span
                >
                <div
                  class="whitespace-pre-wrap font-mono uppercase text-[0.75rem] leading-tight text-black"
                >
                  {{ formatPartyDisplay(shipper) || "-" }}
                </div>
              </div>
              <div class="w-1/2">
                <div class="flex border-b border-blue-900" style="min-height: 35px">
                  <div class="w-1/2 border-r border-blue-900 pt-1 px-2 pb-2">
                    <span class="font-bold text-[0.6rem] leading-none mb-0.5 block"
                      >BOOKING NO.</span
                    >
                    <span class="font-mono text-[0.8rem] text-black leading-none">{{
                      getVal(jobData?.jobNumber)
                    }}</span>
                  </div>
                  <div class="w-1/2 pt-1 px-2 pb-2">
                    <span class="font-bold text-[0.6rem] leading-none mb-0.5 block"
                      >BILL OF LADING NO.</span
                    >
                    <span class="font-mono text-[0.8rem] text-black leading-none">{{
                      getVal(activeBl?.blNumber)
                    }}</span>
                  </div>
                </div>
                <div class="pt-1 px-2 pb-3">
                  <span class="font-bold text-[0.6rem] block leading-none">EXPORT REFERENCES</span>
                  <div class="font-mono text-[0.75rem] text-black pb-1.5">
                    {{ getVal(jobData?.customerReference, "-") }}
                  </div>
                  <div
                    v-if="
                      activeBl?.showShipperReferencesOnBl !== false &&
                      activeBl?.shipperReferences?.length
                    "
                    class="pt-1.5 border-t border-blue-900 -mx-2 px-2"
                  >
                    <span class="font-bold text-[0.6rem] block leading-none mb-0.5"
                      >SHIPPER REFERENCE</span
                    >
                    <div class="font-mono text-[0.75rem] text-black">
                      {{ activeBl.shipperReferences.join(", ") }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex border-b border-blue-900" style="min-height: 75px">
              <div class="w-1/2 border-r border-blue-900 pt-1 px-2 pb-2">
                <span class="font-bold mb-0.5 text-[0.6rem] leading-none block">CONSIGNEE</span>
                <div
                  class="whitespace-pre-wrap font-mono uppercase text-[0.75rem] leading-tight text-black"
                >
                  {{ formatPartyDisplay(consignee) || "-" }}
                </div>
              </div>
              <div class="w-1/2 pt-1 px-2 pb-2">
                <span class="font-bold mb-0.5 text-[0.6rem] leading-none block"
                  >FORWARDING AGENT - REFERENCES</span
                >
                <div
                  class="whitespace-pre-wrap font-mono uppercase text-[0.75rem] leading-tight text-black"
                >
                  PT NOVA SYNC CONTINENT<br />KMP MUARA BAHARI NOMOR 189 RT.010<br />RW.013, TANJUNG
                  PRIOK
                </div>
              </div>
            </div>
            <div class="flex border-b border-blue-900" style="min-height: 100px">
              <div class="w-1/2 border-r border-blue-900">
                <div class="pt-1 px-2 pb-2">
                  <span class="font-bold text-[0.6rem] mb-0.5 leading-none block"
                    >NOTIFY PARTY</span
                  >
                  <div
                    class="whitespace-pre-wrap font-mono uppercase text-[0.75rem] leading-tight text-black"
                  >
                    {{ formatPartyDisplay(notifyParty) || "-" }}
                  </div>
                </div>
              </div>
              <div
                class="w-1/2 pt-1 px-2 pb-2 text-[0.45rem] text-justify leading-[1.1] font-medium text-blue-900"
              >
                RECEIVED by the Carrier in apparent good order and condition (unless otherwise
                stated herein) the total number or quantity of Containers or other packages or units
                indicated in the box entitled "Carrier's Receipt", to be carried subject to all the
                terms and conditions hereof from the Place of Receipt or Port of Loading to the Port
                of Discharge or Place of Delivery, as applicable. Delivery of the Goods to the
                Carrier for Carriage hereunder constitutes acceptance by the Merchant of all the
                terms and conditions of this Bill of Lading.
              </div>
            </div>
            <div class="flex border-b border-blue-900" style="min-height: 40px">
              <div class="w-[25%] border-r border-blue-900 pt-0.5 px-2 pb-1.5">
                <span class="font-bold text-[0.6rem] block leading-none mb-0.5"
                  >PRE-CARRIAGE BY</span
                >
                <span class="font-mono text-[0.75rem] uppercase leading-none text-black">{{
                  getVal(jobData?.preCarriageBy, "-")
                }}</span>
              </div>
              <div class="w-[25%] border-r border-blue-900 pt-0.5 px-2 pb-1.5">
                <span class="font-bold text-[0.6rem] block leading-none mb-0.5"
                  >PLACE OF RECEIPT</span
                >
                <span class="font-mono text-[0.75rem] uppercase leading-none text-black">{{
                  getVal(jobData?.placeOfReceipt, getVal(jobData?.polName, jobData?.pol))
                }}</span>
              </div>
              <div class="w-[50%] pt-0.5 px-2 pb-1.5">
                <span class="font-bold text-[0.6rem] block leading-none mb-0.5">VESSEL/VOYAGE</span>
                <span class="font-mono text-[0.75rem] uppercase text-black leading-none"
                  >{{ getVal(jobData?.vessel?.name) }} / {{ getVal(jobData?.voyageNumber) }}</span
                >
              </div>
            </div>
            <div class="flex border-b border-blue-900" style="min-height: 40px">
              <div class="w-[25%] border-r border-blue-900 pt-0.5 px-2 pb-1.5">
                <span class="font-bold text-[0.6rem] block leading-none mb-0.5">OCEAN VESSEL</span>
                <span class="font-mono text-[0.75rem] uppercase leading-none text-black">{{
                  getVal(jobData?.vessel?.name)
                }}</span>
              </div>
              <div class="w-[25%] border-r border-blue-900 pt-0.5 px-2 pb-1.5">
                <span class="font-bold text-[0.6rem] block leading-none mb-0.5"
                  >PORT OF LOADING</span
                >
                <span class="font-mono text-[0.75rem] uppercase leading-none text-black">{{
                  getVal(jobData?.polName, jobData?.pol)
                }}</span>
              </div>
              <div class="w-[50%] pt-0.5 px-2 pb-1.5">
                <span class="font-bold text-[0.6rem] block leading-none mb-0.5"
                  >PORT OF DISCHARGE</span
                >
                <span class="font-mono text-[0.75rem] uppercase leading-none text-black">{{
                  getVal(jobData?.podName, jobData?.pod)
                }}</span>
              </div>
            </div>
            <div class="flex border-b border-blue-900" style="min-height: 40px">
              <div class="w-[25%] border-r border-blue-900 pt-0.5 px-2 pb-1.5">
                <span class="font-bold text-[0.55rem] block leading-none mb-0.5"
                  >PLACE OF DELIVERY</span
                >
                <span class="font-mono text-[0.75rem] uppercase leading-none text-black">{{
                  getVal(jobData?.placeOfDelivery, getVal(jobData?.podName, jobData?.pod))
                }}</span>
              </div>
              <div class="w-[25%] border-r border-blue-900 pt-0.5 px-2 pb-1.5">
                <span class="font-bold text-[0.55rem] block leading-none mb-0.5"
                  >TYPE OF MOVEMENT</span
                >
                <span class="font-mono text-[0.7rem] uppercase text-black leading-none"
                  >{{
                    (jobData?.cargoMovement?.code || jobData?.cargoMovementId || "FCL_FCL").replace(
                      "_",
                      "/",
                    )
                  }}
                  -
                  {{
                    (
                      jobData?.deliveryMovement?.code ||
                      jobData?.deliveryMovementId ||
                      "CY_CY"
                    ).replace("_", "/")
                  }}</span
                >
              </div>
              <div class="w-[50%] pt-0.5 px-2 pb-1.5">
                <span class="font-bold text-[0.55rem] block leading-none mb-0.5"
                  >FINAL DESTINATION</span
                >
                <span class="font-mono text-[0.75rem] uppercase leading-none text-black">{{
                  getVal(jobData?.finalDestination, getVal(jobData?.podName, jobData?.pod))
                }}</span>
              </div>
            </div>
          </div>

          <div
            v-if="pIdx > 0"
            class="vessel-minimal-header flex justify-between items-end border-b border-blue-900 p-2 text-black font-mono text-[0.6rem] uppercase relative z-[1] bg-white"
            style="height: 30px"
          >
            <span
              >VESSEL VOYAGE: {{ getVal(jobData?.vessel?.name) }}
              {{ getVal(jobData?.voyageNumber) }}</span
            >
            <span class="text-blue-900 text-[0.6rem] font-bold tracking-widest leading-none">
              <template v-if="activeBl?.status?.toLowerCase() === 'draft' || !activeBl"
                >DRAFT - NON NEGOTIABLE</template
              >
              <template v-else>ORIGINAL NEGOTIABLE</template>
            </span>
          </div>

          <div class="flex flex-col border-b border-blue-900 bg-white relative z-[1]">
            <div class="flex border-b border-blue-900" style="min-height: 25px">
              <div
                class="w-[32%] px-2 py-1 text-[0.55rem] italic flex items-center border-r border-blue-900"
              >
                (CHECK "HM" COLUMN IF HAZARDOUS MATERIAL)
              </div>
              <div
                class="flex-1 text-center font-bold text-[0.65rem] px-2 py-1 flex items-center justify-center"
              >
                PARTICULARS DECLARED BY SHIPPER BUT NOT ACKNOWLEDGED BY THE CARRIER
              </div>
            </div>

            <div class="flex bg-blue-50/30 font-bold text-[0.55rem] h-[45px]">
              <div
                class="w-[22%] border-r border-blue-900 p-1 flex flex-col items-center justify-center leading-tight"
              >
                <span>CNTR. NOS. W/SEAL NOS.</span><span>MARKS & NUMBERS</span>
              </div>
              <div
                class="w-[10%] border-r border-blue-900 p-1 flex flex-col items-center justify-center leading-tight text-[0.5rem]"
              >
                <span>QUANTITY</span><span class="font-normal">(FOR CUSTOMS</span
                ><span class="font-normal">DECLARATION ONLY)</span>
              </div>
              <div
                class="w-[3%] border-r border-blue-900 p-1 flex flex-col items-center justify-center leading-none"
              >
                <span>H</span><span class="mt-0.5">M</span>
              </div>
              <div class="w-[40%] border-r border-blue-900 p-1 flex items-center justify-center">
                DESCRIPTION OF PACKAGES AND GOODS
              </div>
              <div class="w-[12.5%] border-r border-blue-900 p-1 flex items-center justify-center">
                GROSS WEIGHT
              </div>
              <div class="w-[12.5%] p-1 flex items-center justify-center">GROSS MEASUREMENT</div>
            </div>
          </div>

          <div :class="[pIdx === 0 ? 'cargo-window-p1' : 'cargo-window-p2']" class="relative">
            <div class="vertical-grid-lines">
              <div class="w-[22%] border-r border-blue-900"></div>
              <div class="w-[10%] border-r border-blue-900"></div>
              <div class="w-[3%] border-r border-blue-900"></div>
              <div class="w-[40%] border-r border-blue-900"></div>
              <div class="w-[12.5%] border-r border-blue-900"></div>
              <div class="w-[12.5%]"></div>
            </div>

            <div class="relative z-[1] text-black font-mono pt-4">
              <template v-for="(cnt, cIdx) in pageItems" :key="cIdx">
                <div
                  v-if="cnt.isHeaderVisible && !cnt.isFallback"
                  class="flex w-full mb-1 font-bold italic border-b border-blue-900/10"
                >
                  <div class="w-[22%] pl-3 pr-6 break-words whitespace-pre-wrap text-[11px]">
                    {{ cnt.containerNumber || ""
                    }}<span v-if="cnt.sealNumber" class="ml-1">/{{ cnt.sealNumber }}</span>
                  </div>
                  <div class="w-[10%] px-2 text-right text-[11px]">
                    {{ formatNumber(getContainerTotals(cnt).qty, 0) }}
                  </div>
                  <div class="w-[3%] flex items-center justify-center text-[10px] leading-none">
                    {{ cnt.isHazardous ? "X" : "" }}
                  </div>
                  <div class="w-[40%] px-3 font-mono text-[11px]">
                    1X{{ cnt.containerType?.code || "" }} S.T.C.:
                  </div>
                  <div class="w-[12.5%] px-3 text-right text-[11px]">
                    {{ formatNumber(getContainerTotals(cnt).gw) }}KGS
                  </div>
                  <div class="w-[12.5%] px-3 text-right text-[11px]">
                    {{ formatNumber(getContainerTotals(cnt).cbm) }}CBM
                  </div>
                </div>

                <div
                  v-for="(item, iIdx) in cnt.renderItems"
                  :key="iIdx"
                  class="flex w-full mb-3 tracking-tight"
                >
                  <div class="w-[22%] pl-3 text-[9px] uppercase leading-tight">
                    {{ pIdx === 0 && cIdx === 0 && iIdx === 0 ? jobData?.shippingMark : "" }}
                  </div>
                  <div class="w-[10%] px-2 text-right text-[11px]">
                    {{ formatNumber(item.qty, 0) }}
                  </div>
                  <div class="w-[3%] flex items-center justify-center text-[10px] leading-none">
                    {{ cnt.isHazardous ? "X" : "" }}
                  </div>
                  <div class="w-[40%] px-3 font-mono">
                    <div class="font-bold underline mb-0.5 text-[11px]">
                      {{ item.packageTypeCode || "PKGS" }} OF:
                    </div>
                    <div
                      v-for="(line, lIdx) in item.displayLines"
                      :key="lIdx"
                      class="break-all text-[11px] leading-[14px]"
                    >
                      {{ line }}
                    </div>
                    <div v-if="item.hsCode" class="text-[10px] mt-1 font-bold">
                      (HS CODE: {{ item.hsCode }})
                    </div>
                  </div>
                  <div class="w-[12.5%] px-3 text-right text-[11px]">
                    {{ formatNumber(item.grossWeight, 0) }}
                  </div>
                  <div class="w-[12.5%] px-3 text-right text-[11px]">
                    {{ formatNumber(item.measurementCbm, 2) }}
                  </div>
                </div>

                <div class="mb-4"></div>
              </template>

              <template v-if="pageItems[0]?.isFallback">
                <div class="flex w-full mb-2 tracking-tight text-[11px]">
                  <div class="w-[22%] pl-2 pr-6 whitespace-pre-wrap break-words">
                    {{ getVal(jobData?.shippingMark) }}
                  </div>
                  <div class="w-[10%] px-2 text-right">
                    <div>{{ formatNumber(totals.qty, 0) }}</div>
                    <div>PACKAGES</div>
                  </div>
                  <div class="w-[3%]"></div>
                  <div class="w-[40%] px-2 whitespace-pre-wrap break-words">
                    {{ "NO CARGO DATA" }}
                  </div>
                  <div class="w-[12.5%] px-2 text-right text-black">
                    {{ formatNumber(totals.grossWeight) }}KGS
                  </div>
                  <div class="w-[12.5%] px-2 text-right text-black">
                    {{ formatNumber(totals.measurement) }}CBM
                  </div>
                </div>
              </template>
            </div>
          </div>

          <div
            v-if="pIdx < paginatedPages.length - 1"
            class="border-t border-blue-900 text-center font-bold text-[0.55rem] py-1 mt-auto"
          >
            ** TO BE CONTINUED ON PAGE {{ pIdx + 2 }} **
          </div>

          <div
            v-if="pIdx === 0"
            class="bl-footer border-t border-blue-900 flex flex-col relative z-[1] bg-white"
          >
            <div class="flex border-b border-blue-900 text-blue-900" style="min-height: 20px">
              <div class="px-3 w-1/4 font-bold flex items-start pt-1 text-[0.55rem] leading-none">
                Declared Cargo Value US $
              </div>
              <div
                class="border-l border-blue-900 flex-1 text-left font-normal text-[0.45rem] leading-tight flex items-start pt-1 px-2 text-black"
              >
                . If Merchant enters a value, Carrier's limitation of liability shall not apply and
                the ad valorem rate will be charged.
              </div>
            </div>
            <div
              class="flex border-b border-blue-900 text-[0.5rem] font-bold"
              style="min-height: 35px"
            >
              <div class="w-[20%] border-r border-blue-900 pt-1 px-2 pb-2">
                <span class="text-[0.55rem] leading-tight text-blue-900 font-bold uppercase block"
                  >FREIGHT & CHARGES PAYABLE AT / BY:</span
                >
                <span
                  class="uppercase font-mono text-[0.6rem] text-black leading-none font-normal mt-1 block"
                  >{{ getVal(jobData?.podName, jobData?.pod) }}</span
                >
              </div>
              <div class="w-[15%] border-r border-blue-900 p-1">
                <span class="text-blue-900 font-bold block">SERVICE CONTRACT NO.</span>
              </div>
              <div class="w-[12%] border-r border-blue-900 p-1">
                <span class="text-blue-900 font-bold block">DOC FORM NO.</span>
              </div>
              <div class="w-[12%] border-r border-blue-900 p-1">
                <span class="text-blue-900 font-bold block">COMMODITY CODE</span>
              </div>
              <div class="w-[12%] border-r border-blue-900 p-1">
                <span class="text-blue-900 font-bold block">EXCHANGE RATE</span>
              </div>
              <div
                class="w-[29%] p-0.5 text-[0.42rem] font-normal leading-tight text-justify flex items-start text-black"
              >
                [1] ORIGINAL BILL(S) OF LADING HAVE BEEN SIGNED, WHERE DELIVERED AGAINST ONE, THE
                OTHERS(S) TO BE VOID.
              </div>
            </div>
            <div class="flex flex-1" style="min-height: 110px">
              <div class="w-[71%] border-r border-blue-900 flex flex-col">
                <div
                  class="flex border-b border-blue-900 text-[0.55rem] text-center font-bold"
                  style="min-height: 20px"
                >
                  <div
                    class="w-[15%] border-r border-blue-900 h-full p-1 flex items-center justify-center"
                  >
                    CODE
                  </div>
                  <div
                    class="w-[20%] border-r border-blue-900 h-full p-1 flex items-center justify-center"
                  >
                    TARIFF ITEM
                  </div>
                  <div
                    class="w-[15%] border-r border-blue-900 h-full p-1 flex items-center justify-center"
                  >
                    FREIGHTED AS
                  </div>
                  <div
                    class="w-[15%] border-r border-blue-900 h-full p-1 flex items-center justify-center"
                  >
                    RATE
                  </div>
                  <div
                    class="w-[17.5%] border-r border-blue-900 h-full p-1 flex items-center justify-center"
                  >
                    PREPAID
                  </div>
                  <div class="w-[17.5%] h-full p-1 flex items-center justify-center">COLLECT</div>
                </div>
                <div class="flex-1 relative">
                  <div class="absolute inset-0 flex pointer-events-none text-blue-900">
                    <div class="w-[15%] border-r border-blue-900 h-full"></div>
                    <div class="w-[20%] border-r border-blue-900 h-full"></div>
                    <div class="w-[15%] border-r border-blue-900 h-full"></div>
                    <div class="w-[15%] border-r border-blue-900 h-full"></div>
                    <div class="w-[17.5%] border-r border-blue-900 h-full"></div>
                    <div class="w-[17.5%] h-full"></div>
                  </div>
                  <div
                    class="relative z-[1] flex h-full items-start pt-1 font-mono text-[8.5px] uppercase"
                  >
                    <div class="w-[15%]"></div>
                    <div class="w-[20%]"></div>
                    <div class="w-[15%]"></div>
                    <div class="w-[15%]"></div>
                    <div
                      class="w-[17.5%] px-2 text-left text-black font-normal text-[8.1px] break-words"
                    >
                      {{ activeBl?.prepaid }}
                    </div>
                    <div
                      class="w-[17.5%] px-2 text-left text-black font-normal text-[8.1px] break-words"
                    >
                      {{ activeBl?.collect }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="w-[29%] flex flex-col text-[0.5rem]">
                <div class="border-b border-blue-900 px-2 pt-0.5 pb-2" style="min-height: 35px">
                  <span
                    class="text-blue-900 text-[0.38rem] tracking-tighter uppercase opacity-80 font-bold leading-none block"
                    >DATE CARGO RECEIVED</span
                  >
                  <span
                    class="font-mono text-[0.65rem] text-black uppercase leading-none mt-1 block"
                    >{{ formatDate(activeBl?.dateCargoReceived) }}</span
                  >
                </div>
                <div class="border-b border-blue-900 px-2 pt-0.5 pb-2" style="min-height: 35px">
                  <span
                    class="text-blue-900 text-[0.38rem] tracking-tighter opacity-80 uppercase font-bold leading-none block"
                    >DATE LADEN ON BOARD</span
                  >
                  <span
                    class="font-mono text-[0.65rem] text-black uppercase leading-none mt-1 block"
                    >{{ formatDate(jobData?.etd) }}</span
                  >
                </div>
                <div class="border-b border-blue-900 px-2 pt-0.5 pb-2" style="min-height: 35px">
                  <span
                    class="text-blue-900 text-[0.38rem] tracking-tighter opacity-80 uppercase font-bold leading-none block"
                    >PLACE OF BILL(S) ISSUE</span
                  >
                  <span
                    class="font-mono text-[0.65rem] text-black uppercase leading-none mt-1 block"
                    >{{ getVal(activeBl?.placeOfIssue) }}</span
                  >
                </div>
                <div class="px-2 pt-1 pb-2" style="min-height: 35px">
                  <span
                    class="text-blue-900 text-[0.38rem] tracking-tighter uppercase opacity-80 font-bold leading-none block"
                    >DATED</span
                  >
                  <span
                    class="font-mono text-[0.65rem] text-black uppercase leading-none mt-1 block"
                    >{{
                      formatDate(activeBl?.dateOfIssue) || formatDate(new Date().toISOString())
                    }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-1 flex justify-between pr-2 text-blue-900" style="height: 35px">
          <div class="text-[0.45rem] w-1/2 mt-0.5 italic leading-tight">
            The printed terms and conditions on this Bill are available at its website at
            www.nscontinent.com
          </div>
          <div
            v-if="pIdx === paginatedPages.length - 1"
            class="w-[260px] text-[0.45rem] flex flex-col items-end"
          >
            <div class="w-full text-left font-mono leading-tight bg-white p-2">
              <span class="font-bold">SIGNED BY: </span>PT. SAMUDERA AGENCIES INDONESIA<br />
              <span class="pl-14 text-[0.4rem] italic"
                >, as agent for and on behalf of NS CONTINENT</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#print-target {
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

.a4-page-wrapper {
  width: 794px;
  height: 1123px;

  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 15px 30px;

  box-sizing: border-box;
  background: white;
  position: relative;
}

.main-border-container {
  border: 1px solid #1e3a8a;
  display: flex;
  flex-direction: column;
  flex: 1;

  min-height: 0;

  overflow: hidden;
}

.cargo-window-p1 {
  height: 220px;

  flex-shrink: 0;
  overflow: hidden;
  position: relative;
  border-bottom: 1px solid #1e3a8a;
}

.cargo-window-p2 {
  flex: 1 1 0%;

  display: flex;
  flex-direction: column;
  min-height: 0;
  position: relative;
  overflow: hidden;
}

.vertical-grid-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  pointer-events: none;
  z-index: 0;
}

.vertical-grid-lines > div {
  height: 100%;
}

.bl-footer {
  height: 310px;

  flex-shrink: 0;
  background: white;
}

.font-mono {
  font-family: "Courier New", Courier, monospace;
  font-size: 11px;
  line-height: 14px;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
