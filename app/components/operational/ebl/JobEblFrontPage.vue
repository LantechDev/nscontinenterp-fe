<script setup lang="ts">
import { computed } from "vue";
import type {
  ActiveJobData,
  ActiveBlData,
  EblParty,
  EblContainer,
  EblContainerItem,
} from "./types";

interface RenderedPage {
  key: string;
  type: "front" | "back";
  pageIndex: number;
  pageItems: EblContainer[];
  copyLabel: string;
  showWatermark: boolean;
}

const props = defineProps<{
  page: RenderedPage;
  jobData: ActiveJobData;
  activeBl: ActiveBlData | null;
  logoUrl: string;
  isAir: boolean;
  isTrucking: boolean;
  watermarkColor: string;
  paginatedPagesLength: number;
  documentMode?: "bl" | "fcr";
}>();

const isFcr = computed(() => props.documentMode === "fcr");

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

const documentTitle = computed(() =>
  isFcr.value
    ? "FORWARDER CERTIFICATE OF RECEIPT"
    : props.isAir
      ? "AIR WAYBILL"
      : props.isTrucking
        ? "TRUCKING WAYBILL"
        : "BILL OF LADING",
);
const documentNumberLabel = computed(() =>
  isFcr.value
    ? "MBL NO."
    : props.isAir
      ? "AIR WAYBILL NO."
      : props.isTrucking
        ? "WAYBILL NO."
        : "BILL OF LADING NO.",
);
const transportScheduleLabel = computed(() =>
  props.isAir ? "AIRLINE / FLIGHT NO." : props.isTrucking ? "TRUCK / DRIVER" : "VESSEL/VOYAGE",
);
const primaryTransportLabel = computed(() =>
  props.isAir ? "FEEDER AIRCRAFT" : props.isTrucking ? "VEHICLE NO." : "FEEDER VESSEL",
);
const loadingPlaceLabel = computed(() => (props.isAir ? "AIRPORT OF LOADING" : "PORT OF LOADING"));
const dischargePlaceLabel = computed(() =>
  props.isAir ? "AIRPORT OF DISCHARGE" : "PORT OF DISCHARGE",
);
const continuedTransportLabel = computed(() =>
  props.isAir ? "FLIGHT" : props.isTrucking ? "TRUCK / VEHICLE" : "VESSEL VOYAGE",
);
const loadedDateLabel = computed(() =>
  props.isAir ? "FLIGHT DEPARTURE DATE" : props.isTrucking ? "PICKUP DATE" : "DATE LADEN ON BOARD",
);
const issuePlaceLabel = computed(() =>
  isFcr.value
    ? "PLACE OF FCR ISSUE"
    : props.isAir
      ? "PLACE OF AWB ISSUE"
      : props.isTrucking
        ? "PLACE OF WAYBILL ISSUE"
        : "PLACE OF BILL(S) ISSUE",
);
const transportList = computed(() => props.activeBl?.vessels || props.jobData?.vessels || []);

const getTransportName = (transport?: (typeof transportList.value)[number]) => {
  if (!transport) return "";
  if (props.isAir) {
    return (
      transport.plane?.name ||
      (transport.transportType === "plane" ? transport.vesselName : "") ||
      transport.vesselName ||
      ""
    );
  }
  return transport.vessel?.name || transport.vesselName || "";
};

const getTransportVoyage = (transport?: (typeof transportList.value)[number]) =>
  transport?.voyageNumber || "";

const formatTransportLeg = (label: string, transport?: (typeof transportList.value)[number]) => {
  if (!transport) return "";
  const name = getTransportName(transport);
  const voyage = getTransportVoyage(transport);
  if (!name && !voyage) return "";
  return `${label}: ${[name, voyage].filter(Boolean).join(" / ")}`;
};

const feederTransport = computed(() => {
  const list = transportList.value;
  return list.find((v) => v.vesselType?.toLowerCase() === "feeder") || list[0];
});

const motherTransport = computed(() => {
  const list = transportList.value;
  return (
    list.find((v) => v.vesselType?.toLowerCase() === "mother") ||
    (list.length > 1 ? list[list.length - 1] : undefined)
  );
});

// Plain "<name> / <voyage>" with no FEEDER:/MV: label prefix.
const vesselVoyageText = (transport?: (typeof transportList.value)[number]) => {
  if (!transport) return "";
  const name = getTransportName(transport);
  const voyage = getTransportVoyage(transport);
  return [name, voyage].filter(Boolean).join(" / ");
};

// A distinct mother leg only exists on a transshipment (2+ legs). For a direct
// shipment the single vessel is the ocean vessel, so it belongs in VESSEL/VOYAGE.
const hasDistinctMother = computed(
  () => !!motherTransport.value && motherTransport.value !== feederTransport.value,
);

// FEEDER VESSEL cell = feeder vessel + voyage; only shown when there's a separate
// mother leg (a real transshipment), otherwise blank for a direct shipment.
const feederVesselDisplay = computed(() => {
  if (!hasDistinctMother.value) return "-";
  return vesselVoyageText(feederTransport.value) || "-";
});

// VESSEL/VOYAGE cell = mother vessel + voyage; falls back to the single/first vessel
// for a direct shipment so the cell is never blank.
const motherVesselDisplay = computed(() => {
  const primary = hasDistinctMother.value ? motherTransport.value : feederTransport.value;
  return (
    vesselVoyageText(primary) ||
    (props.isAir
      ? getVal(props.jobData?.plane?.name, "-")
      : getVal(props.jobData?.vessel?.name, "-"))
  );
});

const transportLegs = computed(() => {
  if (props.isTrucking) {
    const truckTypeStr = props.jobData?.truckType || "";
    const vehicleLegs = containers.value
      .map((c) => c?.driverName || "")
      .filter((s) => s.trim())
      .join(", ");
    if (truckTypeStr && vehicleLegs) {
      return `${truckTypeStr} / ${vehicleLegs}`;
    }
    return truckTypeStr || vehicleLegs || "-";
  }
  const feeder = formatTransportLeg("FEEDER", feederTransport.value);
  const mother =
    motherTransport.value && motherTransport.value !== feederTransport.value
      ? formatTransportLeg(props.isAir ? "MAIN FLIGHT" : "MV", motherTransport.value)
      : "";
  return [feeder, mother].filter(Boolean).join(", ");
});

const primaryTransportName = computed(
  () =>
    getTransportName(feederTransport.value) ||
    (props.isAir
      ? getVal(props.jobData?.plane?.name, "-")
      : props.isTrucking
        ? getVal(containers.value[0]?.vehicleNumber, "-")
        : getVal(props.jobData?.vessel?.name, "-")),
);

const exportReferences = computed(() => {
  const references = new Set<string>();
  if (props.activeBl?.showShipperReferencesOnBl !== false) {
    (props.activeBl?.shipperReferences || []).forEach((ref) => {
      const value = getVal(ref);
      if (value) references.add(value);
    });
  }
  const bookingReference = getVal(props.jobData?.customerReference);
  if (bookingReference && references.size === 0) references.add(bookingReference);
  return Array.from(references);
});

const exportReferenceText = computed(() =>
  exportReferences.value.length > 0 ? exportReferences.value.join(", ") : "-",
);

const bookingNumberDisplay = computed(() =>
  isFcr.value ? getVal(props.jobData?.carrierBookingNumber, "-") : getVal(props.jobData?.jobNumber),
);

const documentNumberDisplay = computed(() =>
  isFcr.value ? getVal(props.jobData?.mblNumber, "-") : getVal(props.activeBl?.blNumber),
);

const bookingNumberLabel = computed(() => (isFcr.value ? "CARRIER BOOKING NO." : "BOOKING NO."));

const exportReferenceLabel = computed(() =>
  isFcr.value ? "FCR NO. / EXPORT REFERENCE" : "EXPORT REFERENCE",
);

const exportReferenceDisplay = computed(() => {
  if (!isFcr.value) return exportReferenceText.value;
  const parts = [getVal(props.jobData?.jobNumber), exportReferenceText.value].filter(
    (part) => part && part !== "-",
  );
  return parts.length ? parts.join(" / ") : "-";
});

const receivedTermsDocumentName = computed(() =>
  isFcr.value
    ? "Forwarder Certificate of Receipt"
    : props.isAir
      ? "Air Waybill"
      : props.isTrucking
        ? "Waybill"
        : "Bill of Lading",
);

const placeOfReceiptVal = computed(() =>
  props.isTrucking
    ? getVal(props.jobData?.pickupAddress)
    : getVal(props.jobData?.placeOfReceipt, getVal(props.jobData?.polName, props.jobData?.pol)),
);

const placeOfDeliveryVal = computed(() =>
  props.isTrucking
    ? getVal(props.jobData?.deliveryAddress)
    : getVal(props.jobData?.placeOfDelivery, getVal(props.jobData?.podName, props.jobData?.pod)),
);

const finalDestinationVal = computed(() =>
  props.isTrucking
    ? getVal(props.jobData?.deliveryAddress)
    : getVal(props.jobData?.finalDestination, getVal(props.jobData?.podName, props.jobData?.pod)),
);

const getVal = (val: unknown, fallback: unknown = "") => {
  const s = val ? String(val).trim() : fallback ? String(fallback).trim() : "";
  return s;
};

const limitText = (val: unknown, maxLength = 18) => {
  const text = getVal(val);
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
};

// "Freight & charges payable at/by" must follow the freight-payment choice, not
// always the POD. The prepaid/collect summary already encodes the city
// (e.g. "PREPAID AT BELAWAN"), so extract it from there. Falls back to POL for a
// prepaid selection and POD otherwise.
const freightPayableAtRaw = computed(() => {
  const summary = getVal(props.activeBl?.prepaid) || getVal(props.activeBl?.collect);
  const match = summary.match(/\bAT\s+(.+)$/i);
  if (match?.[1]) return match[1].trim();
  if (getVal(props.activeBl?.prepaid)) return getVal(props.jobData?.polName, props.jobData?.pol);
  return getVal(props.jobData?.podName, props.jobData?.pod);
});
const freightPayableAt = computed(() => limitText(freightPayableAtRaw.value, 18));

// Combined PREPAID/COLLECT indicator shown above the payable city. Only one shows,
// driven by which side the freight-payment selection populated.
const freightTermLabel = computed(() => {
  if (getVal(props.activeBl?.prepaid)) return "FREIGHT PREPAID";
  if (getVal(props.activeBl?.collect)) return "FREIGHT COLLECT";
  const term = getVal(props.activeBl?.freightTerm);
  return term ? `FREIGHT ${term.toUpperCase()}` : "";
});

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

// Cargo figure sourced ONLY from real data: sum the line items, else fall back to
// the container's OWN same-named total. No cross-field or job-level fallback, so an
// absent value returns null and the cell shows "-" instead of fabricating a number
// (e.g. the quantity leaking into net weight).
const cargoFigure = (
  cnt: EblContainer,
  itemKey: "qty" | "grossWeight" | "netWeight" | "measurementCbm",
  containerKeys: Array<keyof EblContainer>,
): number | null => {
  const items = Array.isArray(cnt.items) ? cnt.items : [];
  let sum = 0;
  let hasValue = false;
  for (const it of items) {
    const raw = it?.[itemKey];
    if (raw == null) continue;
    const n = Number(raw);
    if (!Number.isNaN(n)) {
      sum += n;
      hasValue = true;
    }
  }
  if (hasValue) return sum;
  for (const key of containerKeys) {
    const raw = cnt?.[key];
    if (raw == null) continue;
    const n = Number(raw);
    if (!Number.isNaN(n)) return n;
  }
  return null;
};

// Renders "<number> <unit>" or a bare "-" when the value is missing.
const figureText = (val: number | null | undefined, unit: string, decimals = 3) =>
  val === null || val === undefined ? "-" : `${formatNumber(val, decimals)} ${unit}`;

// Package unit shown next to a container's total quantity (e.g. "PKGS").
const containerPackageUnit = (cnt: EblContainer) => {
  const items = Array.isArray(cnt.items) ? cnt.items : [];
  const codes = Array.from(
    new Set(items.map((it) => (it.packageTypeCode || "").trim()).filter(Boolean)),
  );
  return codes.length === 1 ? codes[0] : "PKGS";
};

// "<qty> <unit>" for the container header row, or "-" when there's no quantity.
const containerQtyText = (cnt: EblContainer) => {
  const qty = cargoFigure(cnt, "qty", ["totalQty", "quantity"]);
  return qty === null ? "-" : `${formatNumber(qty, 0)} ${containerPackageUnit(cnt)}`;
};

// A container with a single line item shows its qty/weights/measurement once, in the
// header row, so the per-item row omits those columns to avoid duplication. With
// multiple items each row keeps its own figures.
const isSingleDetail = (cnt: EblContainer) =>
  (Array.isArray(cnt.items) ? cnt.items.length : (cnt.renderItems?.length ?? 0)) === 1;
const showItemFigures = (cnt: EblContainer) => !isSingleDetail(cnt) || !cnt.isHeaderVisible;
const showRenderedItemFigures = (
  cnt: EblContainer,
  item: EblContainerItem & { isContinuationSegment?: boolean },
) => showItemFigures(cnt) && !item.isContinuationSegment;

const findPartyByRole = (roleCodes: string[]) => {
  const normalizedRoles = roleCodes.map((role) => role.replace(/[\s-]/g, "_").toUpperCase());
  const parties = [
    ...(props.activeBl?.job?.jobParties || []),
    ...(props.jobData?.jobParties || []),
    ...(props.activeBl?.parties || []),
  ];

  return parties.find((party: EblParty) => {
    const code = party.partyRole?.code?.replace(/[\s-]/g, "_").toUpperCase();
    return code ? normalizedRoles.includes(code) : false;
  });
};

const shipper = computed(() => findPartyByRole(["SHIPPER"]));
const consignee = computed(() => findPartyByRole(["CONSIGNEE"]));
const notifyParty = computed(() => findPartyByRole(["NOTIFY_PARTY", "NOTIFY PARTY"]));
const forwardingAgent = computed(() =>
  findPartyByRole(["FORWARDER", "FORWARDING_AGENT", "FORWARDING AGENT", "AGENT"]),
);

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

const containerTypeSummary = computed(() => {
  const counts = new Map<string, number>();
  containers.value.forEach((cnt) => {
    if (!cnt) return;
    const typeCode = cnt.containerType?.code || cnt.containerType?.name || "";
    if (typeCode) {
      counts.set(typeCode, (counts.get(typeCode) || 0) + 1);
    }
  });
  if (counts.size === 0) return "";
  const parts = Array.from(counts.entries()).map(([code, count]) => `${count}X${code}`);
  return `S.T.C ${parts.join(", ")}`;
});

const blGrandTotals = computed(() => {
  let qty = 0;
  let grossWeight = 0;
  let netWeight = 0;
  let measurement = 0;

  containers.value.forEach((cnt) => {
    if (!cnt) return;
    const ct = getContainerTotals(cnt);
    qty += ct.qty;
    grossWeight += ct.gw;
    netWeight += ct.nw;
    measurement += ct.cbm;
  });

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
  if ((partyInfo.companyName || "").trim().toUpperCase() === "SAME AS CONSIGNEE") {
    return "SAME AS CONSIGNEE";
  }
  const name = (partyInfo.companyName || partyInfo.company?.name || "").trim();

  let rawAddress = (
    partyInfo.addressBook?.fullAddress ||
    partyInfo.addressBook?.address ||
    ""
  ).trim();

  const city = (partyInfo.addressBook?.city || "").trim();
  const hasCity = city && rawAddress.toLowerCase().includes(city.toLowerCase());

  if (city && !hasCity) {
    if (rawAddress.endsWith(",")) {
      rawAddress += " " + city;
    } else {
      rawAddress += ", " + city;
    }
  }

  // Replace all newlines with a comma and space
  let cleanAddress = rawAddress
    .replace(/[\r\n]+/g, ", ")
    .replace(/,\s*,/g, ",")
    .replace(/\s+/g, " ");

  cleanAddress = cleanAddress.trim();
  while (cleanAddress.includes(", ,") || cleanAddress.includes(",,")) {
    cleanAddress = cleanAddress.replace(", ,", ",").replace(",,", ",");
  }

  if (cleanAddress.endsWith(",")) {
    cleanAddress = cleanAddress.slice(0, -1).trim();
  }

  const parts = [name, cleanAddress].filter((p) => p.length > 0);
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
</script>

<template>
  <div
    class="a4-page-wrapper bg-white shadow-xl shrink-0 flex flex-col text-[#062c58] border"
    style="
      width: 794px;
      height: 1123px;
      padding: 20px 30px;
      box-sizing: border-box;
      position: relative;
    "
  >
    <!-- Watermark Overlay (Only Front Page) -->
    <div v-if="page.showWatermark" class="watermark-container" data-html2canvas-ignore="true">
      <div class="watermark-cell">
        <div class="watermark-overlay" :class="watermarkColor">EXPRESS RELEASE</div>
      </div>
    </div>

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
        <span class="text-sm font-bold tracking-widest uppercase block leading-none text-[#062c58]">
          {{ page.copyLabel }}
        </span>
      </div>
      <div class="w-[35%] text-right pb-1 flex flex-col items-end justify-end h-full">
        <div class="text-[0.6rem] font-mono mb-1 text-black">
          PAGE: {{ (page.pageIndex ?? 0) + 1 }} OF {{ paginatedPagesLength }}
        </div>
        <h1 class="text-lg font-bold tracking-widest uppercase leading-none">
          {{ documentTitle }}
        </h1>
      </div>
    </div>

    <div
      class="main-border-container border border-[#062c58] flex-1 flex flex-col text-[0.7rem] relative overflow-hidden h-full"
    >
      <div v-if="page.pageIndex === 0" class="routing-section relative z-[1] bg-white">
        <!-- Trucking Optimized Layout: No Notify Party and No Forwarding Agent -->
        <template v-if="isTrucking">
          <div class="flex border-b border-[#062c58]" style="min-height: 90px">
            <div class="w-1/2 border-r border-[#062c58] pt-1 px-2 pb-2">
              <span class="font-bold mb-0.5 text-[0.6rem] leading-none block"
                >SHIPPER/EXPORTER</span
              >
              <div
                class="whitespace-pre-wrap font-mono uppercase text-[10px] leading-tight text-black"
              >
                {{ formatPartyDisplay(shipper) || "-" }}
              </div>
            </div>
            <div class="w-1/2">
              <div class="flex border-b border-[#062c58]" style="min-height: 40px">
                <div class="w-1/2 border-r border-[#062c58] pt-1 px-2 pb-2">
                  <span class="font-bold text-[0.6rem] leading-none mb-0.5 block">{{
                    bookingNumberLabel
                  }}</span>
                  <span class="font-mono text-[10px] text-black leading-none">{{
                    bookingNumberDisplay
                  }}</span>
                </div>
                <div class="w-1/2 pt-1 px-2 pb-2">
                  <span class="font-bold text-[0.6rem] leading-none mb-0.5 block">{{
                    documentNumberLabel
                  }}</span>
                  <span class="font-mono text-[10px] text-black leading-none">{{
                    documentNumberDisplay
                  }}</span>
                </div>
              </div>
              <div class="pt-1 px-2 pb-3">
                <span class="font-bold text-[0.6rem] block leading-none">{{
                  exportReferenceLabel
                }}</span>
                <div class="font-mono text-[10px] text-black pb-1.5">
                  {{ exportReferenceDisplay }}
                </div>
              </div>
            </div>
          </div>
          <div class="flex border-b border-[#062c58]" style="min-height: 80px">
            <div class="w-1/2 border-r border-[#062c58] pt-1 px-2 pb-2">
              <span class="font-bold mb-0.5 text-[0.6rem] leading-none block">CONSIGNEE</span>
              <div
                class="whitespace-pre-wrap font-mono uppercase text-[10px] leading-tight text-black"
              >
                {{ formatPartyDisplay(consignee) || "-" }}
              </div>
            </div>
            <div class="w-1/2 pt-1 px-2 pb-2">
              <span class="font-bold mb-0.5 text-[0.6rem] leading-none block"
                >CUSTOMER (BILL TO)</span
              >
              <div
                class="whitespace-pre-wrap font-mono uppercase text-[10px] leading-tight text-black"
              >
                {{ getVal(jobData?.customer?.name, "-") }}
              </div>
            </div>
          </div>
          <div class="flex border-b border-[#062c58]" style="min-height: 80px">
            <div class="w-1/2 border-r border-[#062c58] pt-1 px-2 pb-2">
              <span class="font-bold mb-1 text-[0.6rem] leading-none block">CARRIER'S RECEIPT</span>
              <div class="grid grid-cols-2 gap-x-3 gap-y-1.5">
                <div>
                  <span class="font-bold text-[0.45rem] leading-none block opacity-80"
                    >DATE CARGO RECEIVED</span
                  >
                  <span class="font-mono text-[10px] uppercase leading-none text-black">{{
                    formatDate(activeBl?.dateCargoReceived) || "-"
                  }}</span>
                </div>
                <div>
                  <span class="font-bold text-[0.45rem] leading-none block opacity-80"
                    >PACKAGES / UNITS</span
                  >
                  <span class="font-mono text-[10px] uppercase leading-none text-black">{{
                    formatNumber(totals.qty)
                  }}</span>
                </div>
                <div>
                  <span class="font-bold text-[0.45rem] leading-none block opacity-80"
                    >GROSS WEIGHT</span
                  >
                  <span class="font-mono text-[10px] uppercase leading-none text-black"
                    >{{ formatNumber(totals.grossWeight) }} KGS</span
                  >
                </div>
                <div>
                  <span class="font-bold text-[0.45rem] leading-none block opacity-80"
                    >MEASUREMENT</span
                  >
                  <span class="font-mono text-[10px] uppercase leading-none text-black"
                    >{{ formatNumber(totals.measurement) }} CBM</span
                  >
                </div>
              </div>
            </div>
            <div
              class="w-1/2 pt-1 px-2 pb-2 text-[0.45rem] text-justify leading-[1.1] font-medium text-[#062c58]"
            >
              Received by the Carrier in apparent good order and condition, unless otherwise stated
              herein, the packages or units described in this Waybill, to be carried from the Place
              of Pickup to the Place of Delivery. Delivery of the Goods to the Carrier constitutes
              acceptance by the Merchant of the terms and conditions of this Waybill.
            </div>
          </div>
        </template>

        <!-- Standard Ocean/Air Layout with Shipper, Consignee, Forwarder, Notify Party, and Terms -->
        <template v-else>
          <div class="flex border-b border-[#062c58]" style="min-height: 75px">
            <div class="w-1/2 border-r border-[#062c58] pt-1 px-2 pb-2">
              <span class="font-bold mb-0.5 text-[0.6rem] leading-none block"
                >SHIPPER/EXPORTER</span
              >
              <div
                class="whitespace-pre-wrap font-mono uppercase text-[10px] leading-tight text-black"
              >
                {{ formatPartyDisplay(shipper) || "-" }}
              </div>
            </div>
            <div class="w-1/2">
              <div class="flex border-b border-[#062c58]" style="min-height: 35px">
                <div class="w-1/2 border-r border-[#062c58] pt-1 px-2 pb-2">
                  <span class="font-bold text-[0.6rem] leading-none mb-0.5 block">{{
                    bookingNumberLabel
                  }}</span>
                  <span class="font-mono text-[10px] text-black leading-none">{{
                    bookingNumberDisplay
                  }}</span>
                </div>
                <div class="w-1/2 pt-1 px-2 pb-2">
                  <span class="font-bold text-[0.6rem] leading-none mb-0.5 block">{{
                    documentNumberLabel
                  }}</span>
                  <span class="font-mono text-[10px] text-black leading-none">{{
                    documentNumberDisplay
                  }}</span>
                </div>
              </div>
              <div class="pt-1 px-2 pb-3">
                <span class="font-bold text-[0.6rem] block leading-none">{{
                  exportReferenceLabel
                }}</span>
                <div class="font-mono text-[10px] text-black pb-1.5">
                  {{ exportReferenceDisplay }}
                </div>
              </div>
            </div>
          </div>
          <div class="flex border-b border-[#062c58]" style="min-height: 75px">
            <div class="w-1/2 border-r border-[#062c58] pt-1 px-2 pb-2">
              <span class="font-bold mb-0.5 text-[0.6rem] leading-none block">CONSIGNEE</span>
              <div
                class="whitespace-pre-wrap font-mono uppercase text-[10px] leading-tight text-black"
              >
                {{ formatPartyDisplay(consignee) || "-" }}
              </div>
            </div>
            <div class="w-1/2 pt-1 px-2 pb-2">
              <span class="font-bold mb-0.5 text-[0.6rem] leading-none block"
                >FORWARDING AGENT - REFERENCES</span
              >
              <div
                class="whitespace-pre-wrap font-mono uppercase text-[10px] leading-tight text-black"
              >
                {{ formatPartyDisplay(forwardingAgent) || "-" }}
              </div>
            </div>
          </div>
          <div class="flex border-b border-[#062c58]" style="min-height: 100px">
            <div class="w-1/2 border-r border-[#062c58]">
              <div class="pt-1 px-2 pb-2">
                <span class="font-bold text-[0.6rem] mb-0.5 leading-none block">NOTIFY PARTY</span>
                <div
                  class="whitespace-pre-wrap font-mono uppercase text-[10px] leading-tight text-black"
                >
                  {{ formatPartyDisplay(notifyParty) || "-" }}
                </div>
              </div>
            </div>
            <div
              class="w-1/2 pt-1 px-2 pb-2 text-[0.45rem] text-justify leading-[1.1] font-medium text-[#062c58]"
            >
              RECEIVED by the Carrier in apparent good order and condition (unless otherwise stated
              herein) the total number or quantity of
              {{
                isAir || isTrucking ? "packages or units" : "Containers or other packages or units"
              }}
              indicated in the box entitled "Carrier's Receipt", to be carried subject to all the
              terms and conditions hereof from the Place of Receipt or
              {{
                isAir ? "Airport of Loading" : isTrucking ? "Place of Pickup" : "Port of Loading"
              }}
              to the
              {{
                isAir
                  ? "Airport of Discharge"
                  : isTrucking
                    ? "Place of Delivery"
                    : "Port of Discharge"
              }}
              or Place of Delivery, as applicable. Delivery of the Goods to the Carrier for Carriage
              hereunder constitutes acceptance by the Merchant of all the terms and conditions of
              this {{ receivedTermsDocumentName }}.
            </div>
          </div>
        </template>
        <div class="flex border-b border-[#062c58]" style="min-height: 40px">
          <!-- PRE-CARRIAGE BY carries the feeder vessel + voyage for ocean BLs (the old
               standalone FEEDER VESSEL cell was removed). Air/Trucking keep their fields. -->
          <div
            :class="isTrucking || isAir ? 'w-[25%]' : 'w-[50%]'"
            class="border-r border-[#062c58] pt-0.5 px-2 pb-1.5"
          >
            <span class="font-bold text-[0.6rem] block leading-none mb-0.5">{{
              isTrucking ? "DRIVER CONTACT" : "PRE-CARRIAGE BY"
            }}</span>
            <span class="font-mono text-[10px] uppercase leading-none text-black">{{
              isTrucking
                ? getVal(containers[0]?.driverContactNumber, "-")
                : isAir
                  ? getVal(jobData?.preCarriageBy, "-")
                  : feederVesselDisplay
            }}</span>
          </div>
          <div
            :class="isTrucking || isAir ? 'w-[25%] border-r border-[#062c58]' : 'w-[50%]'"
            class="pt-0.5 px-2 pb-1.5"
          >
            <span class="font-bold text-[0.6rem] block leading-none mb-0.5">{{
              isTrucking ? "PICKUP ADDRESS" : "PLACE OF RECEIPT"
            }}</span>
            <span class="font-mono text-[10px] uppercase leading-none text-black">{{
              placeOfReceiptVal
            }}</span>
          </div>
          <!-- Combined VESSEL/VOYAGE cell only for Air/Trucking; ocean BLs show the mother
               vessel in the VESSEL/VOYAGE cell of the PORT OF LOADING row below. -->
          <div v-if="isTrucking || isAir" class="w-[50%] pt-0.5 px-2 pb-1.5">
            <span class="font-bold text-[0.6rem] block leading-none mb-0.5">{{
              transportScheduleLabel
            }}</span>
            <span class="font-mono text-[10px] uppercase text-black leading-none">
              {{ transportLegs || "-" }}
            </span>
          </div>
        </div>
        <div class="flex border-b border-[#062c58]" style="min-height: 40px">
          <div class="w-[25%] border-r border-[#062c58] pt-0.5 px-2 pb-1.5">
            <span class="font-bold text-[0.6rem] block leading-none mb-0.5">{{
              isTrucking || isAir ? primaryTransportLabel : transportScheduleLabel
            }}</span>
            <span class="font-mono text-[10px] uppercase leading-none text-black">
              {{ isTrucking || isAir ? primaryTransportName : motherVesselDisplay }}
            </span>
          </div>
          <div class="w-[25%] border-r border-[#062c58] pt-0.5 px-2 pb-1.5">
            <span class="font-bold text-[0.6rem] block leading-none mb-0.5">{{
              isTrucking ? "PICKUP DATE & TIME" : loadingPlaceLabel
            }}</span>
            <span class="font-mono text-[10px] uppercase leading-none text-black">{{
              isTrucking
                ? jobData?.pickupDate
                  ? `${formatDate(jobData.pickupDate)} ${jobData.pickupTime || ""}`.trim()
                  : "-"
                : getVal(jobData?.polName, jobData?.pol)
            }}</span>
          </div>
          <div class="w-[50%] pt-0.5 px-2 pb-1.5">
            <span class="font-bold text-[0.6rem] block leading-none mb-0.5">{{
              isTrucking ? "DELIVERY DATE & TIME" : dischargePlaceLabel
            }}</span>
            <span class="font-mono text-[10px] uppercase leading-none text-black">{{
              isTrucking
                ? jobData?.deliveryDate
                  ? `${formatDate(jobData.deliveryDate)} ${jobData.deliveryTime || ""}`.trim()
                  : "-"
                : getVal(jobData?.podName, jobData?.pod)
            }}</span>
          </div>
        </div>
        <div class="flex border-b border-[#062c58]" style="min-height: 40px">
          <template v-if="isTrucking">
            <div class="w-[75%] border-r border-[#062c58] pt-0.5 px-2 pb-1.5">
              <span class="font-bold text-[0.6rem] block leading-none mb-0.5"
                >DELIVERY ADDRESS</span
              >
              <span class="font-mono text-[10px] uppercase leading-none text-black">{{
                placeOfDeliveryVal
              }}</span>
            </div>
            <div class="w-[25%] pt-0.5 px-2 pb-1.5">
              <span class="font-bold text-[0.6rem] block leading-none mb-0.5">CARRIER</span>
              <span class="font-mono text-[10px] uppercase text-black leading-none">{{
                getVal(jobData?.vendor?.name, "-")
              }}</span>
            </div>
          </template>
          <template v-else>
            <div class="w-[25%] border-r border-[#062c58] pt-0.5 px-2 pb-1.5">
              <span class="font-bold text-[0.6rem] block leading-none mb-0.5"
                >PLACE OF DELIVERY</span
              >
              <span class="font-mono text-[10px] uppercase leading-none text-black">{{
                placeOfDeliveryVal
              }}</span>
            </div>
            <div class="w-[25%] border-r border-[#062c58] pt-0.5 px-2 pb-1.5">
              <span class="font-bold text-[0.6rem] block leading-none mb-0.5"
                >TYPE OF MOVEMENT</span
              >
              <span class="font-mono text-[10px] uppercase text-black leading-none">
                {{
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
                }}
              </span>
            </div>
            <div class="w-[50%] pt-0.5 px-2 pb-1.5">
              <span class="font-bold text-[0.6rem] block leading-none mb-0.5"
                >FINAL DESTINATION</span
              >
              <span class="font-mono text-[10px] uppercase leading-none text-black">{{
                finalDestinationVal
              }}</span>
            </div>
          </template>
        </div>
      </div>

      <div
        v-if="page.pageIndex > 0"
        class="vessel-minimal-header flex justify-between items-end border-b border-[#062c58] p-2 text-black font-mono text-[0.6rem] uppercase relative z-[1] bg-white"
        style="height: 30px"
      >
        <span
          >{{ continuedTransportLabel }}:
          {{
            transportList
              .map((v) => `${getTransportName(v)} ${v.voyageNumber || ""}`)
              .filter((s) => s.trim())
              .join(", ") || "-"
          }}</span
        >
        <span class="text-[#062c58] text-[0.6rem] font-bold tracking-widest leading-none">
          {{ page.copyLabel }}
        </span>
      </div>

      <div class="flex flex-col border-b border-[#062c58] bg-white relative z-[1]">
        <div class="flex border-b border-[#062c58]" style="min-height: 25px">
          <div
            class="w-[32%] px-2 py-1 text-[0.55rem] italic flex items-center border-r border-[#062c58]"
          >
            (CHECK "DG" COLUMN IF DANGEROUS GOODS)
          </div>
          <div
            class="flex-1 text-center font-bold text-[0.65rem] px-2 py-1 flex items-center justify-center"
          >
            PARTICULARS DECLARED BY SHIPPER BUT NOT ACKNOWLEDGED BY THE CARRIER
          </div>
        </div>

        <div class="flex bg-[#062c58]/5 font-bold text-[0.55rem] h-[45px]">
          <div
            class="w-[22%] border-r border-[#062c58] p-1 flex flex-col items-center justify-center leading-tight"
          >
            <template v-if="isAir"> <span>MARKS & NUMBERS</span><span>PACKAGE ID</span> </template>
            <template v-else-if="isTrucking"> <span>VEHICLE NO. / DRIVER</span> </template>
            <template v-else>
              <span>CNTR. NOS. W/SEAL NOS.</span><span>MARKS & NUMBERS</span>
            </template>
          </div>
          <div
            class="w-[10%] border-r border-[#062c58] px-1 flex flex-col items-center justify-center leading-none text-[0.5rem]"
          >
            <span>QUANTITY</span><span class="font-normal">(FOR CUSTOMS</span
            ><span class="font-normal">DECLARATION</span><span class="font-normal">ONLY)</span>
          </div>
          <div
            class="w-[3%] border-r border-[#062c58] p-1 flex flex-col items-center justify-center leading-none"
          >
            <span>D</span><span class="mt-0.5">G</span>
          </div>
          <div class="w-[40%] border-r border-[#062c58] p-1 flex items-center justify-center">
            DESCRIPTION OF PACKAGES AND GOODS
          </div>
          <div class="w-[12.5%] border-r border-[#062c58] p-1 flex items-center justify-center">
            GROSS WEIGHT
          </div>
          <div class="w-[12.5%] p-1 flex items-center justify-center">MEASUREMENT</div>
        </div>
      </div>

      <div
        :class="[
          page.pageIndex === 0
            ? page.pageIndex < paginatedPagesLength - 1
              ? 'cargo-window-p1-continued'
              : 'cargo-window-p1'
            : 'cargo-window-p2',
        ]"
        class="relative"
      >
        <div
          class="vertical-grid-lines"
          :class="[
            page.pageIndex === paginatedPagesLength - 1 &&
            page.pageItems.length > 0 &&
            !page.pageItems[0]?.isFallback
              ? 'with-total-strip'
              : '',
          ]"
        >
          <div class="w-[22%] border-r border-[#062c58]"></div>
          <div class="w-[10%] border-r border-[#062c58]"></div>
          <div class="w-[3%] border-r border-[#062c58]"></div>
          <div class="w-[40%] border-r border-[#062c58]"></div>
          <div class="w-[12.5%] border-r border-[#062c58]"></div>
          <div class="w-[12.5%]"></div>
        </div>

        <div
          class="relative z-[1] text-black font-mono pt-2"
          :class="[
            page.pageIndex === paginatedPagesLength - 1 &&
            page.pageItems.length > 0 &&
            !page.pageItems[0]?.isFallback
              ? 'pb-[18px]'
              : '',
          ]"
        >
          <div
            v-if="page.pageIndex === 0 && containerTypeSummary && !page.pageItems[0]?.isFallback"
            class="flex w-full mb-1 font-semibold text-[9.5px] border-b border-[#062c58]/20 pb-0.5"
          >
            <div class="w-[22%]"></div>
            <div class="w-[10%]"></div>
            <div class="w-[3%]"></div>
            <div class="w-[40%] px-3 text-left tracking-[0]">{{ containerTypeSummary }}</div>
            <div class="w-[12.5%]"></div>
            <div class="w-[12.5%]"></div>
          </div>
          <template v-for="(cnt, cIdx) in page.pageItems" :key="cIdx">
            <div
              v-if="cnt.isHeaderVisible && !cnt.isFallback"
              class="flex w-full mb-1 font-bold italic border-b border-[#062c58]/10"
            >
              <div class="w-[22%] pl-3 pr-6 break-words whitespace-pre-wrap text-[11px]">
                <template v-if="isAir">
                  {{ page.pageIndex === 0 && cIdx === 0 ? getVal(jobData?.shippingMark) : "" }}
                </template>
                <template v-else-if="isTrucking">
                  {{ cnt.vehicleNumber || "" }}
                  <span v-if="cnt.driverName" class="ml-1">/ {{ cnt.driverName }}</span>
                  <span v-if="cnt.driverContactNumber" class="ml-1"
                    >({{ cnt.driverContactNumber }})</span
                  >
                </template>
                <template v-else>
                  {{ cnt.containerNumber || ""
                  }}<span v-if="cnt.containerType?.code || cnt.containerType?.name" class="ml-1"
                    >/ {{ cnt.containerType?.code || cnt.containerType?.name }}</span
                  ><span v-if="cnt.sealNumber" class="ml-1">/ {{ cnt.sealNumber }}</span>
                </template>
              </div>
              <div class="w-[10%] px-2 text-right text-[11px]">
                {{ containerQtyText(cnt) }}
              </div>
              <div class="w-[3%] flex items-center justify-center text-[10px] leading-none">
                {{ cnt.isHazardous ? "X" : "" }}
              </div>
              <div class="w-[40%] px-3 font-mono text-[11px]">
                {{
                  isAir
                    ? "SAID TO CONTAIN:"
                    : isTrucking
                      ? `1X${cnt.containerType?.name || cnt.containerType?.code || ""} S.T.C.:`
                      : `1X${cnt.containerType?.code || ""} S.T.C.:`
                }}
              </div>
              <div class="w-[12.5%] px-3 text-right text-[11px] leading-tight">
                <div>
                  GW
                  {{
                    figureText(
                      cargoFigure(cnt, "grossWeight", ["totalGrossWeight", "grossWeight"]),
                      "KGS",
                    )
                  }}
                </div>
                <div>
                  NW
                  {{
                    figureText(
                      cargoFigure(cnt, "netWeight", ["totalNetWeight", "netWeight"]),
                      "KGS",
                    )
                  }}
                </div>
              </div>
              <div class="w-[12.5%] px-3 text-right text-[11px]">
                {{
                  figureText(
                    cargoFigure(cnt, "measurementCbm", ["totalMeasurementCbm", "measurement"]),
                    "CBM",
                    2,
                  )
                }}
              </div>
            </div>

            <div
              v-for="(item, iIdx) in cnt.renderItems"
              :key="iIdx"
              class="flex w-full mb-1 tracking-tight"
            >
              <div class="w-[22%] pl-3 text-[9px] uppercase leading-tight">
                {{ page.pageIndex === 0 && cIdx === 0 && iIdx === 0 ? jobData?.shippingMark : "" }}
              </div>
              <div class="w-[10%] px-2 text-right text-[11px]">
                <template v-if="showRenderedItemFigures(cnt, item)">
                  {{
                    item.qty === null || item.qty === undefined
                      ? "-"
                      : `${formatNumber(item.qty, 0)} ${item.packageTypeCode || "PKGS"}`
                  }}
                </template>
              </div>
              <div class="w-[3%] flex items-center justify-center text-[10px] leading-none">
                {{ cnt.isHazardous ? "X" : "" }}
              </div>
              <div class="w-[40%] px-3 font-mono">
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
              <div class="w-[12.5%] px-3 text-right text-[11px] leading-tight">
                <template v-if="showRenderedItemFigures(cnt, item)">
                  <div>GW {{ figureText(item.grossWeight, "KGS") }}</div>
                  <div>NW {{ figureText(item.netWeight, "KGS") }}</div>
                </template>
              </div>
              <div class="w-[12.5%] px-3 text-right text-[11px]">
                <template v-if="showRenderedItemFigures(cnt, item)">
                  {{ figureText(item.measurementCbm, "CBM", 2) }}
                </template>
              </div>
            </div>

            <div class="mb-1.5"></div>
          </template>

          <template v-if="page.pageItems[0]?.isFallback">
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

        <div
          v-if="
            page.pageIndex === paginatedPagesLength - 1 &&
            page.pageItems.length > 0 &&
            !page.pageItems[0]?.isFallback
          "
          class="absolute left-0 right-0 bottom-0 z-[2] flex w-full border-t border-[#062c58] font-medium text-[8.5px] text-[#062c58] bg-white"
        >
          <div class="w-[22%] pl-3 py-1 text-[8px] font-semibold">TOTAL</div>
          <div class="w-[10%] px-2 py-1 text-right text-[8px]">
            {{ formatNumber(blGrandTotals.qty, 0) }} PKGS
          </div>
          <div class="w-[3%]"></div>
          <div class="w-[40%] px-3 py-1 text-[8px]">
            Gross Weight: {{ formatNumber(blGrandTotals.grossWeight) }} KGS
          </div>
          <div class="w-[12.5%] px-3 py-1 text-right text-[8px] leading-tight">
            <div>GW {{ formatNumber(blGrandTotals.grossWeight) }} KGS</div>
            <div>NW {{ formatNumber(blGrandTotals.netWeight) }} KGS</div>
          </div>
          <div class="w-[12.5%] px-3 py-1 text-right text-[8px]">
            {{ formatNumber(blGrandTotals.measurement, 2) }} CBM
          </div>
        </div>
      </div>

      <div
        v-if="page.pageIndex < paginatedPagesLength - 1"
        class="border-b border-[#062c58] text-center font-bold text-[0.55rem] py-1 mt-auto font-mono bg-white"
      >
        ** TO BE CONTINUED ON PAGE {{ page.pageIndex + 2 }} **
      </div>

      <div
        v-if="page.pageIndex === 0"
        class="bl-footer flex flex-col relative z-[1] bg-white"
        :class="[page.pageIndex < paginatedPagesLength - 1 ? 'bl-footer-continued' : '']"
      >
        <div class="flex shrink-0 border-b border-[#062c58] text-[#062c58]" style="height: 20px">
          <div class="px-3 w-1/4 font-bold flex items-start pt-1 text-[0.55rem] leading-none">
            {{ isFcr ? "Cargo Receipt Value US $" : "Declared Cargo Value US $" }}
          </div>
          <div
            class="border-l border-[#062c58] flex-1 text-left font-normal text-[0.45rem] leading-tight flex items-start pt-1 px-2 text-black"
          >
            . If Merchant enters a value, Carrier's limitation of liability shall not apply and the
            ad valorem rate will be charged.
          </div>
        </div>
        <div
          class="flex shrink-0 overflow-hidden border-b border-[#062c58] text-[0.5rem] font-bold"
          style="height: 45px"
        >
          <div class="w-[20%] border-r border-[#062c58] px-2 py-0.5">
            <span class="text-[0.5rem] leading-none text-[#062c58] font-bold uppercase block"
              >FREIGHT &amp; CHARGES PAYABLE AT / BY:</span
            >
            <span
              v-if="freightTermLabel"
              class="uppercase font-mono text-[0.56rem] text-black font-bold mt-0.5 block leading-none"
              >{{ freightTermLabel }}</span
            >
            <span
              class="uppercase font-mono text-[0.5rem] text-black leading-none font-normal mt-0.5 block break-words"
              :title="freightPayableAtRaw"
              >{{ freightPayableAt || "-" }}</span
            >
          </div>
          <div class="w-[15%] border-r border-[#062c58] p-1">
            <span class="text-[#062c58] font-bold block">SERVICE CONTRACT NO.</span>
            <span
              class="uppercase font-mono text-[0.55rem] text-black leading-tight font-normal mt-1 block break-words"
              >{{ getVal(activeBl?.serviceContractNo) }}</span
            >
          </div>
          <div class="w-[12%] border-r border-[#062c58] p-1">
            <span class="text-[#062c58] font-bold block">DOC FORM NO.</span>
          </div>
          <div class="w-[12%] border-r border-[#062c58] p-1">
            <span class="text-[#062c58] font-bold block">COMMODITY CODE</span>
          </div>
          <div class="w-[12%] border-r border-[#062c58] p-1">
            <span class="text-[#062c58] font-bold block">EXCHANGE RATE</span>
          </div>
          <div
            class="w-[29%] p-0.5 text-[0.42rem] font-normal leading-tight text-justify flex items-start text-black"
          >
            <template v-if="isFcr">
              THIS FORWARDER CERTIFICATE OF RECEIPT IS NOT NEGOTIABLE AND DOES NOT CONSTITUTE A BILL
              OF LADING.
            </template>
            <template v-else>
              [1] ORIGINAL
              {{ isAir ? "AIR WAYBILL(S)" : isTrucking ? "WAYBILL(S)" : "BILL(S) OF LADING" }}
              HAVE BEEN SIGNED, WHERE DELIVERED AGAINST ONE, THE OTHERS(S) TO BE VOID.
            </template>
          </div>
        </div>
        <div class="flex min-h-0 flex-1 overflow-hidden">
          <div class="w-[71%] border-r border-[#062c58] flex flex-col">
            <div
              class="flex border-b border-[#062c58] text-[0.55rem] text-center font-bold"
              style="min-height: 20px"
            >
              <div
                class="w-[15%] border-r border-[#062c58] h-full p-1 flex items-center justify-center"
              >
                CODE
              </div>
              <div
                class="w-[20%] border-r border-[#062c58] h-full p-1 flex items-center justify-center"
              >
                TARIFF ITEM
              </div>
              <div
                class="w-[15%] border-r border-[#062c58] h-full p-1 flex items-center justify-center"
              >
                FREIGHTED AS
              </div>
              <div
                class="w-[15%] border-r border-[#062c58] h-full p-1 flex items-center justify-center"
              >
                RATE
              </div>
              <div
                class="w-[17.5%] border-r border-[#062c58] h-full p-1 flex items-center justify-center"
              >
                PREPAID
              </div>
              <div class="w-[17.5%] h-full p-1 flex items-center justify-center">COLLECT</div>
            </div>
            <div class="flex-1 relative">
              <div class="absolute inset-0 flex pointer-events-none text-[#062c58]">
                <div class="w-[15%] border-r border-[#062c58] h-full"></div>
                <div class="w-[20%] border-r border-[#062c58] h-full"></div>
                <div class="w-[15%] border-r border-[#062c58] h-full"></div>
                <div class="w-[15%] border-r border-[#062c58] h-full"></div>
                <div class="w-[17.5%] border-r border-[#062c58] h-full"></div>
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
                  {{ activeBl?.prepaid ? "" : activeBl?.collect }}
                </div>
              </div>
            </div>
          </div>
          <div class="w-[29%] flex min-h-0 flex-col text-[0.5rem]">
            <div class="ebl-issue-field ebl-issue-field-compact border-b border-[#062c58]">
              <span class="ebl-issue-label">DATE CARGO RECEIVED</span>
              <span class="ebl-issue-value font-mono">{{
                formatDate(activeBl?.dateCargoReceived)
              }}</span>
            </div>
            <div class="ebl-issue-field ebl-issue-field-tall border-b border-[#062c58]">
              <span class="ebl-issue-label">{{ loadedDateLabel }}</span>
              <span class="ebl-issue-value font-mono">{{
                isTrucking
                  ? jobData?.pickupDate
                    ? `${formatDate(jobData.pickupDate)} ${jobData.pickupTime || ""}`.trim()
                    : formatDate(jobData?.etd)
                  : formatDate(jobData?.etd)
              }}</span>
            </div>
            <div class="ebl-issue-field ebl-issue-field-compact border-b border-[#062c58]">
              <span class="ebl-issue-label">{{ issuePlaceLabel }}</span>
              <span class="ebl-issue-value font-mono">{{ getVal(activeBl?.placeOfIssue) }}</span>
            </div>
            <div class="ebl-issue-field ebl-issue-field-fill">
              <span class="ebl-issue-label">DATED</span>
              <span class="ebl-issue-value font-mono">{{
                formatDate(activeBl?.dateOfIssue) || formatDate(new Date().toISOString())
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-0.5 flex justify-between text-[#062c58]" style="height: 74px">
      <div class="text-[0.45rem] w-1/2 mt-0.5 italic leading-tight">
        The printed terms and conditions on this
        {{ isFcr ? "FCR" : isAir ? "Air Waybill" : isTrucking ? "Waybill" : "Bill" }} are available
        at its website at www.nscontinent.com
      </div>
      <div
        v-if="page.pageIndex === paginatedPagesLength - 1"
        class="ebl-signature-columns w-[270px] flex items-start justify-end gap-2 mt-3"
      >
        <div
          class="ebl-signature-caption flex-1 text-left font-mono bg-white pt-0"
          style="font-size: 7.2px; line-height: 8.2px"
        >
          PT Nova Sync Continent<br />
          <span class="italic" style="font-size: 5.8px; line-height: 6.8px"
            >, as agent for and on behalf of NS CONTINENT</span
          >
        </div>
        <div
          class="ebl-signature-box w-[150px] h-[58px] bg-white border border-[#062c58] px-2 pt-1.5 font-mono text-left"
          style="font-size: 8px; line-height: 9px"
        >
          <span class="font-bold">Signed By:</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  border: 1px solid #062c58;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.cargo-window-p1 {
  height: 256px;
  flex-shrink: 0;
  overflow: hidden;
  position: relative;
  border-bottom: 1px solid #062c58;
}

.cargo-window-p1-continued {
  height: 250px;
  flex-shrink: 0;
  overflow: hidden;
  position: relative;
  border-bottom: 1px solid #062c58;
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

.vertical-grid-lines.with-total-strip > div {
  height: calc(100% - 17px);
}

.bl-footer {
  height: 245px;
  flex-shrink: 0;
  background: white;
}

.bl-footer-continued {
  height: 225px;
}

.font-mono {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New",
    monospace;
  white-space: pre-wrap;
  word-break: break-all;
}

.ebl-issue-field {
  flex: 0 0 auto;
  min-height: 0;
  padding: 2px 8px;
  box-sizing: border-box;
  overflow: hidden;
}

.ebl-issue-field-compact {
  height: 28px;
}

.ebl-issue-field-tall {
  height: 40px;
}

.ebl-issue-field-fill {
  flex: 1 1 auto;
  min-height: 30px;
}

.ebl-issue-label {
  display: block;
  color: #062c58;
  font-size: 0.38rem;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 6px;
  opacity: 0.8;
  text-transform: uppercase;
}

.ebl-issue-value {
  display: block;
  margin-top: 2px;
  color: #000;
  font-size: 0.56rem;
  line-height: 8.8px;
  text-transform: uppercase;
}

.watermark-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 794px;
  height: 1123px;
  display: table;
  pointer-events: none;
  z-index: 2;
  box-sizing: border-box;
}

.watermark-cell {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  padding-bottom: 8%;
}

.watermark-overlay {
  display: inline-block;
  transform: rotate(-30deg);
  border: 8px solid;
  border-radius: 4px;
  padding: 20px 60px;
  font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
  font-size: 72px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 6px;
  line-height: 1.1;
  white-space: nowrap;
  opacity: 0.18;
  user-select: none;
}

.watermark-overlay.red {
  color: #c62828;
  border-color: #c62828;
}

.watermark-overlay.blue {
  color: #0d47a1;
  border-color: #0d47a1;
}
</style>
