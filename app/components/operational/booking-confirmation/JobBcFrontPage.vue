<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any -- loose job/BC snapshot data */
import { computed } from "vue";
import type { BookingConfirmation } from "~/composables/useBookingConfirmation";

// Copy-adapted from operational/ebl/JobEblFrontPage.vue.
// This is a STANDALONE Booking Confirmation page — it does NOT import or modify any eBL
// component. All shipment data is read live from the Job; only bookingNumber and the
// warehouse/depot fields come from the booking_confirmations row.
//
// Mas Naufal's red markup applied here:
//  - Title: BILL OF LADING -> BOOKING CONFIRMATION
//  - Removed "DRAFT - NON NEGOTIABLE" copy-label band
//  - "FORWARDING AGENT - REFERENCES" -> "WAREHOUSE / DEPOT" (from BC fields)
//  - Kept: shipper, consignee, notify, routing, particulars + cargo grid, SIGNED BY
//  - Removed: declared cargo value, doc form / commodity code / exchange rate, the
//    prepaid/collect freight table, and the back-page conditions.
//  - Restored (later request): a trimmed footer with FREIGHT & CHARGES PAYABLE AT/BY,
//    SERVICE CONTRACT NO., DATE CARGO RECEIVED and DATE LADEN ON BOARD. All but the
//    service contract number are derived from the Job/BL just like the eBL footer.

interface PageData {
  pageIndex: number;
  pageItems: any[];
}

const props = defineProps<{
  page: PageData;
  jobData: any;
  bcData: BookingConfirmation;
  logoUrl: string;
  isAir: boolean;
  isTrucking: boolean;
  paginatedPagesLength: number;
}>();

const getVal = (val: unknown, fallback: unknown = "") => {
  const s = val ? String(val).trim() : fallback ? String(fallback).trim() : "";
  return s;
};

const documentNumberLabel = computed(() =>
  props.isAir ? "AIR WAYBILL NO." : props.isTrucking ? "WAYBILL NO." : "BILL OF LADING NO.",
);
const transportScheduleLabel = computed(() =>
  props.isAir ? "AIRLINE / FLIGHT NO." : props.isTrucking ? "TRUCK / DRIVER" : "VESSEL/VOYAGE",
);
const loadingPlaceLabel = computed(() => (props.isAir ? "AIRPORT OF LOADING" : "PORT OF LOADING"));
const dischargePlaceLabel = computed(() =>
  props.isAir ? "AIRPORT OF DISCHARGE" : "PORT OF DISCHARGE",
);
const continuedTransportLabel = computed(() =>
  props.isAir ? "FLIGHT" : props.isTrucking ? "TRUCK / VEHICLE" : "VESSEL VOYAGE",
);

// Prefer the BC's own snapshot; fall back to the live Job for legacy BCs without one.
const transportList = computed(() =>
  props.bcData?.vessels?.length ? props.bcData.vessels : props.jobData?.vessels || [],
);

const getTransportName = (transport?: any) => {
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

const getTransportVoyage = (transport?: any) => transport?.voyageNumber || "";

// Plain "<name> / <voyage>" with no leading FEEDER:/MV: label prefix.
const vesselVoyageText = (transport?: any) => {
  if (!transport) return "";
  const name = getTransportName(transport);
  const voyage = getTransportVoyage(transport);
  return [name, voyage].filter(Boolean).join(" / ");
};

const feederTransport = computed(() => {
  const list = transportList.value;
  return list.find((v: any) => v.vesselType?.toLowerCase() === "feeder") || list[0];
});

const motherTransport = computed(() => {
  const list = transportList.value;
  return (
    list.find((v: any) => v.vesselType?.toLowerCase() === "mother") ||
    (list.length > 1 ? list[list.length - 1] : undefined)
  );
});

// Naufal markup:
//  - PRE-CARRIAGE BY           = feeder vessel + voyage
//  - VESSEL/VOYAGE (was FEEDER VESSEL cell) = mother vessel + voyage
//  - old combined VESSEL/VOYAGE cell removed (merged into the RECEIVED-by box)
//
// A "distinct mother" only exists on a transshipment (2+ legs). For a direct
// shipment (a single vessel) that one vessel IS the ocean vessel, so it belongs
// in the VESSEL/VOYAGE cell — not PRE-CARRIAGE BY. Otherwise the prominent
// VESSEL/VOYAGE cell renders "-" even though the job has a vessel.
const hasDistinctMother = computed(() => {
  const mother = motherTransport.value;
  return !!mother && mother !== feederTransport.value;
});

const feederVesselDisplay = computed(() => {
  // Pre-carriage = the feeder leg, shown only when there's a separate mother leg.
  if (!hasDistinctMother.value) return "-";
  return vesselVoyageText(feederTransport.value) || "-";
});

const motherVesselDisplay = computed(() => {
  // VESSEL/VOYAGE = the mother leg when present, else fall back to the single
  // (first) vessel so a direct shipment still fills this cell.
  const primary = hasDistinctMother.value ? motherTransport.value : feederTransport.value;
  return (
    vesselVoyageText(primary) ||
    (props.isAir
      ? getVal(props.jobData?.plane?.name, "-")
      : getVal(props.jobData?.vessel?.name, "-"))
  );
});

const exportReferences = computed(() => {
  const references = new Set<string>();
  const source = props.bcData?.shipperReferences?.length
    ? props.bcData.shipperReferences
    : props.jobData?.shipperReferences || [];
  source.forEach((ref: string) => {
    const value = getVal(ref);
    if (value) references.add(value);
  });
  const bookingReference = getVal(props.jobData?.customerReference);
  if (bookingReference && references.size === 0) references.add(bookingReference);
  return Array.from(references);
});

const exportReferenceText = computed(() =>
  exportReferences.value.length > 0 ? exportReferences.value.join(", ") : "-",
);

const blNumber = computed(() => getVal(props.jobData?.billsOfLading?.[0]?.blNumber, "-"));

// BC-first routing resolvers (fall back to Job).
const polDisplay = computed(() =>
  getVal(
    props.bcData?.polName,
    getVal(props.bcData?.pol, getVal(props.jobData?.polName, props.jobData?.pol)),
  ),
);
const podDisplay = computed(() =>
  getVal(
    props.bcData?.podName,
    getVal(props.bcData?.pod, getVal(props.jobData?.podName, props.jobData?.pod)),
  ),
);
const shippingMarkDisplay = computed(() =>
  getVal(props.bcData?.shippingMark, props.jobData?.shippingMark),
);
const cargoMovementCode = computed(
  () =>
    props.bcData?.cargoMovementId ||
    props.jobData?.cargoMovement?.code ||
    props.jobData?.cargoMovementId ||
    "FCL_FCL",
);
const deliveryMovementCode = computed(
  () =>
    props.bcData?.deliveryMovementId ||
    props.jobData?.deliveryMovement?.code ||
    props.jobData?.deliveryMovementId ||
    "CY_CY",
);

const placeOfReceiptVal = computed(() =>
  getVal(props.bcData?.placeOfReceipt, getVal(props.jobData?.placeOfReceipt, polDisplay.value)),
);
const placeOfDeliveryVal = computed(() =>
  getVal(props.bcData?.placeOfDelivery, getVal(props.jobData?.placeOfDelivery, podDisplay.value)),
);
const finalDestinationVal = computed(() =>
  getVal(props.bcData?.finalDestination, getVal(props.jobData?.finalDestination, podDisplay.value)),
);

const formatNumber = (num: unknown, decimals = 3): string => {
  if (!num && num !== 0) return "-";
  const n = parseFloat(num as string);
  if (isNaN(n)) return "-";
  return n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: decimals });
};

const containers = computed(() => props.bcData?.containers || props.jobData?.jobContainers || []);

const getContainerTotals = (cnt: any) => {
  let gw = 0,
    nw = 0,
    cbm = 0,
    qty = 0;
  if (cnt.items && Array.isArray(cnt.items)) {
    cnt.items.forEach((item: any) => {
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
    if (qty === 0) qty = Number(props.jobData?.quantity) || 0;
    if (gw === 0) gw = Number(props.jobData?.grossWeight) || 0;
    if (nw === 0) nw = Number(props.jobData?.netWeight) || 0;
    if (cbm === 0) cbm = Number(props.jobData?.measurement) || 0;
  }

  return { gw, nw, cbm, qty };
};

const findPartyByRole = (roleCodes: string[]) => {
  const normalizedRoles = roleCodes.map((role) => role.replace(/[\s-]/g, "_").toUpperCase());
  const parties = props.bcData?.parties?.length
    ? props.bcData.parties
    : props.jobData?.jobParties || [];
  return parties.find((party: any) => {
    const code = party.partyRole?.code?.replace(/[\s-]/g, "_").toUpperCase();
    return code ? normalizedRoles.includes(code) : false;
  });
};

const shipper = computed(() => findPartyByRole(["SHIPPER"]));
const consignee = computed(() => findPartyByRole(["CONSIGNEE"]));
const notifyParty = computed(() => findPartyByRole(["NOTIFY_PARTY", "NOTIFY PARTY"]));

const totalsValue = computed(() => {
  let qty = 0;
  let grossWeight = 0;
  let netWeight = 0;
  let measurement = 0;

  if (containers.value && containers.value.length > 0) {
    containers.value.forEach((cnt: any) => {
      const ct = getContainerTotals(cnt);
      qty += ct.qty;
      grossWeight += ct.gw;
      netWeight += ct.nw;
      measurement += ct.cbm;
    });
  }

  if (qty === 0) qty = Number(props.jobData?.quantity) || 0;
  if (grossWeight === 0) grossWeight = Number(props.jobData?.grossWeight) || 0;
  if (netWeight === 0) netWeight = Number(props.jobData?.netWeight) || 0;
  if (measurement === 0) measurement = Number(props.jobData?.measurement) || 0;

  return { qty, grossWeight, netWeight, measurement };
});

const formatPartyDisplay = (partyInfo: any) => {
  if (!partyInfo) return "";
  const name = (partyInfo.companyName || partyInfo.company?.name || "").trim();

  let rawAddress = (
    partyInfo.addressBook?.fullAddress ||
    partyInfo.addressBook?.address ||
    partyInfo.fullAddress ||
    ""
  ).trim();

  const city = (partyInfo.addressBook?.city || partyInfo.city || "").trim();
  const hasCity = city && rawAddress.toLowerCase().includes(city.toLowerCase());

  if (city && !hasCity) {
    rawAddress += rawAddress.endsWith(",") ? " " + city : ", " + city;
  }

  let cleanAddress = rawAddress
    .replace(/[\r\n]+/g, ", ")
    .replace(/,\s*,/g, ",")
    .replace(/\s+/g, " ")
    .trim();
  while (cleanAddress.includes(", ,") || cleanAddress.includes(",,")) {
    cleanAddress = cleanAddress.replace(", ,", ",").replace(",,", ",");
  }
  if (cleanAddress.endsWith(",")) cleanAddress = cleanAddress.slice(0, -1).trim();

  return [name, cleanAddress].filter((p) => p.length > 0).join("\n");
};

// WAREHOUSE / DEPOT block (replaces Forwarding Agent per Mas Naufal's markup).
const warehouseDisplay = computed(() => {
  const name = (props.bcData?.warehouseDepotName || "").trim();
  const address = (props.bcData?.warehouseDepotAddress || "").trim();
  return [name, address].filter((p) => p.length > 0).join("\n") || "-";
});

// --- Footer block ---------------------------------------------------------
// All footer values read from the BC's own snapshot first, then fall back to the
// Job/BL for legacy BCs that were never seeded.
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

const loadedDateLabel = computed(() =>
  props.isAir ? "FLIGHT DEPARTURE DATE" : props.isTrucking ? "PICKUP DATE" : "DATE LADEN ON BOARD",
);

// FREIGHT & CHARGES PAYABLE AT/BY — BC freight selection (prepaid/collect) if set,
// otherwise the discharge port. The cell is wide, so show the full value (no truncation).
const freightPayableAtRaw = computed(() =>
  getVal(props.bcData?.prepaidValue, getVal(props.bcData?.collectValue, podDisplay.value)),
);
const freightPayableAt = computed(() => freightPayableAtRaw.value);

// SERVICE CONTRACT NO. — BC-owned, entered in the edit form.
const serviceContractNo = computed(() => getVal(props.bcData?.serviceContractNo, "-"));

// DATE CARGO RECEIVED — BC snapshot first, else the linked Bill of Lading.
const dateCargoReceived = computed(
  () =>
    formatDate(props.bcData?.dateCargoReceived) ||
    formatDate(props.jobData?.billsOfLading?.[0]?.dateCargoReceived) ||
    "-",
);

// DATE LADEN ON BOARD — BC ETD first; pickup date for trucking, otherwise Job ETD.
const dateLaden = computed(() => {
  if (props.bcData?.etd) return formatDate(props.bcData.etd);
  if (props.isTrucking && props.jobData?.pickupDate) {
    return `${formatDate(props.jobData.pickupDate)} ${props.jobData.pickupTime || ""}`.trim();
  }
  return formatDate(props.jobData?.etd) || "-";
});
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
    <!-- Header (no DRAFT - NON NEGOTIABLE band) -->
    <div
      class="header-section flex justify-between items-end mb-1 relative z-[1] bg-white"
      style="height: 70px"
    >
      <div class="w-[40%] pb-1">
        <img
          :src="logoUrl"
          alt="NS Continent Logo"
          class="h-16 object-contain max-w-[190px]"
          crossorigin="anonymous"
        />
      </div>
      <div class="w-[60%] text-right pb-1 flex flex-col items-end justify-end h-full">
        <div class="text-[0.6rem] font-mono mb-1 text-black">
          PAGE: {{ (page.pageIndex ?? 0) + 1 }} OF {{ paginatedPagesLength }}
        </div>
        <h1 class="text-lg font-bold tracking-widest uppercase leading-none">
          BOOKING CONFIRMATION
        </h1>
      </div>
    </div>

    <div
      class="main-border-container border border-[#062c58] flex-1 flex flex-col text-[0.7rem] relative overflow-hidden h-full"
    >
      <div v-if="page.pageIndex === 0" class="routing-section relative z-[1] bg-white">
        <div class="flex border-b border-[#062c58]" style="min-height: 75px">
          <div class="w-1/2 border-r border-[#062c58] pt-1 px-2 pb-2">
            <span class="font-bold mb-0.5 text-[0.6rem] leading-none block">SHIPPER/EXPORTER</span>
            <div
              class="whitespace-pre-wrap font-mono uppercase text-[10px] leading-tight text-black"
            >
              {{ formatPartyDisplay(shipper) || "-" }}
            </div>
          </div>
          <div class="w-1/2">
            <div class="flex border-b border-[#062c58]" style="min-height: 35px">
              <div class="w-1/2 border-r border-[#062c58] pt-1 px-2 pb-2">
                <span class="font-bold text-[0.6rem] leading-none mb-0.5 block">BOOKING NO.</span>
                <span class="font-mono text-[10px] text-black leading-none">{{
                  getVal(bcData?.bookingNumber, "-")
                }}</span>
              </div>
              <div class="w-1/2 pt-1 px-2 pb-2">
                <span class="font-bold text-[0.6rem] leading-none mb-0.5 block">{{
                  documentNumberLabel
                }}</span>
                <span class="font-mono text-[10px] text-black leading-none">{{ blNumber }}</span>
              </div>
            </div>
            <div class="pt-1 px-2 pb-3">
              <span class="font-bold text-[0.6rem] block leading-none">EXPORT REFERENCE</span>
              <div class="font-mono text-[10px] text-black pb-1.5">{{ exportReferenceText }}</div>
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
          <!-- WAREHOUSE / DEPOT (was FORWARDING AGENT - REFERENCES) -->
          <div class="w-1/2 pt-1 px-2 pb-2">
            <span class="font-bold mb-0.5 text-[0.6rem] leading-none block">WAREHOUSE / DEPOT</span>
            <div
              class="whitespace-pre-wrap font-mono uppercase text-[10px] leading-tight text-black"
            >
              {{ warehouseDisplay }}
            </div>
          </div>
        </div>

        <div class="flex border-b border-[#062c58]">
          <div class="w-1/2 border-r border-[#062c58] flex flex-col">
            <div class="pt-1 px-2 pb-2 border-b border-[#062c58]" style="min-height: 100px">
              <span class="font-bold text-[0.6rem] mb-0.5 leading-none block">NOTIFY PARTY</span>
              <div
                class="whitespace-pre-wrap font-mono uppercase text-[10px] leading-tight text-black"
              >
                {{ formatPartyDisplay(notifyParty) || "-" }}
              </div>
            </div>
            <!-- PRE-CARRIAGE BY now carries the feeder vessel; the old VESSEL/VOYAGE
                 cell was removed and its space merged into the RECEIVED-by box. -->
            <div class="flex" style="min-height: 40px">
              <div class="w-1/2 border-r border-[#062c58] pt-0.5 px-2 pb-1.5">
                <span class="font-bold text-[0.6rem] block leading-none mb-0.5"
                  >PRE-CARRIAGE BY</span
                >
                <span class="font-mono text-[10px] uppercase leading-none text-black">{{
                  feederVesselDisplay
                }}</span>
              </div>
              <div class="w-1/2 pt-0.5 px-2 pb-1.5">
                <span class="font-bold text-[0.6rem] block leading-none mb-0.5"
                  >PLACE OF RECEIPT</span
                >
                <span class="font-mono text-[10px] uppercase leading-none text-black">{{
                  placeOfReceiptVal
                }}</span>
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
            {{ isAir ? "Airport of Loading" : "Port of Loading" }}
            to the
            {{ isAir ? "Airport of Discharge" : "Port of Discharge" }}
            or Place of Delivery, as applicable.
          </div>
        </div>

        <div class="flex border-b border-[#062c58]" style="min-height: 40px">
          <div class="w-[25%] border-r border-[#062c58] pt-0.5 px-2 pb-1.5">
            <span class="font-bold text-[0.6rem] block leading-none mb-0.5">{{
              transportScheduleLabel
            }}</span>
            <span class="font-mono text-[10px] uppercase leading-none text-black">
              {{ motherVesselDisplay }}
            </span>
          </div>
          <div class="w-[25%] border-r border-[#062c58] pt-0.5 px-2 pb-1.5">
            <span class="font-bold text-[0.6rem] block leading-none mb-0.5">{{
              loadingPlaceLabel
            }}</span>
            <span class="font-mono text-[10px] uppercase leading-none text-black">{{
              polDisplay
            }}</span>
          </div>
          <div class="w-[50%] pt-0.5 px-2 pb-1.5">
            <span class="font-bold text-[0.6rem] block leading-none mb-0.5">{{
              dischargePlaceLabel
            }}</span>
            <span class="font-mono text-[10px] uppercase leading-none text-black">{{
              podDisplay
            }}</span>
          </div>
        </div>

        <div class="flex border-b border-[#062c58]" style="min-height: 40px">
          <div class="w-[25%] border-r border-[#062c58] pt-0.5 px-2 pb-1.5">
            <span class="font-bold text-[0.6rem] block leading-none mb-0.5">PLACE OF DELIVERY</span>
            <span class="font-mono text-[10px] uppercase leading-none text-black">{{
              placeOfDeliveryVal
            }}</span>
          </div>
          <div class="w-[25%] border-r border-[#062c58] pt-0.5 px-2 pb-1.5">
            <span class="font-bold text-[0.6rem] block leading-none mb-0.5">TYPE OF MOVEMENT</span>
            <span class="font-mono text-[10px] uppercase text-black leading-none">
              {{ cargoMovementCode.replace("_", "/") }}
              -
              {{ deliveryMovementCode.replace("_", "/") }}
            </span>
          </div>
          <div class="w-[50%] pt-0.5 px-2 pb-1.5">
            <span class="font-bold text-[0.6rem] block leading-none mb-0.5">FINAL DESTINATION</span>
            <span class="font-mono text-[10px] uppercase leading-none text-black">{{
              finalDestinationVal
            }}</span>
          </div>
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
              .map((v: any) => `${getTransportName(v)} ${v.voyageNumber || ""}`)
              .filter((s: string) => s.trim())
              .join(", ") || "-"
          }}</span
        >
        <span class="text-[#062c58] text-[0.6rem] font-bold tracking-widest leading-none"
          >BOOKING CONFIRMATION</span
        >
      </div>

      <!-- Particulars header -->
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
            <template v-else>
              <span>CNTR. NOS. W/SEAL NOS.</span><span>MARKS & NUMBERS</span>
            </template>
          </div>
          <div
            class="w-[10%] border-r border-[#062c58] p-1 flex flex-col items-center justify-center leading-tight text-[0.5rem]"
          >
            <span>QUANTITY</span><span class="font-normal">(FOR CUSTOMS</span
            ><span class="font-normal">DECLARATION ONLY)</span>
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
          <div class="w-[12.5%] p-1 flex items-center justify-center">GROSS MEASUREMENT</div>
        </div>
      </div>

      <!-- Cargo window (fills remaining space; BL footer removed per markup) -->
      <div class="cargo-window relative">
        <div class="vertical-grid-lines">
          <div class="w-[22%] border-r border-[#062c58]"></div>
          <div class="w-[10%] border-r border-[#062c58]"></div>
          <div class="w-[3%] border-r border-[#062c58]"></div>
          <div class="w-[40%] border-r border-[#062c58]"></div>
          <div class="w-[12.5%] border-r border-[#062c58]"></div>
          <div class="w-[12.5%]"></div>
        </div>

        <div class="relative z-[1] text-black font-mono pt-1">
          <template v-for="(cnt, cIdx) in page.pageItems" :key="cIdx">
            <div
              v-if="cnt.isHeaderVisible && !cnt.isFallback"
              class="flex w-full mb-1 font-bold italic border-b border-[#062c58]/10"
            >
              <div class="w-[22%] pl-3 pr-6 break-words whitespace-pre-wrap text-[11px]">
                <template v-if="isAir">
                  {{ page.pageIndex === 0 && cIdx === 0 ? shippingMarkDisplay : "" }}
                </template>
                <template v-else>
                  {{ cnt.containerNumber || ""
                  }}<span v-if="cnt.sealNumber" class="ml-1">/{{ cnt.sealNumber }}</span>
                </template>
              </div>
              <div class="w-[10%] px-2 text-right text-[11px]">
                {{ formatNumber(getContainerTotals(cnt).qty, 0) }}
              </div>
              <div class="w-[3%] flex items-center justify-center text-[10px] leading-none">
                {{ cnt.isHazardous ? "X" : "" }}
              </div>
              <div class="w-[40%] px-3 font-mono text-[11px]">
                {{ isAir ? "SAID TO CONTAIN:" : `1X${cnt.containerType?.code || ""} S.T.C.:` }}
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
              class="flex w-full mb-1 tracking-tight"
            >
              <div class="w-[22%] pl-3 text-[9px] uppercase leading-tight">
                {{ page.pageIndex === 0 && cIdx === 0 && iIdx === 0 ? shippingMarkDisplay : "" }}
              </div>
              <div class="w-[10%] px-2 text-right text-[11px]">{{ formatNumber(item.qty, 0) }}</div>
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

          <template v-if="page.pageItems[0]?.isFallback">
            <div class="flex w-full mb-2 tracking-tight text-[11px]">
              <div class="w-[22%] pl-2 pr-6 whitespace-pre-wrap break-words">
                {{ shippingMarkDisplay }}
              </div>
              <div class="w-[10%] px-2 text-right">
                <div>{{ formatNumber(totalsValue.qty, 0) }}</div>
                <div>PACKAGES</div>
              </div>
              <div class="w-[3%]"></div>
              <div class="w-[40%] px-2 whitespace-pre-wrap break-words">NO CARGO DATA</div>
              <div class="w-[12.5%] px-2 text-right text-black">
                {{ formatNumber(totalsValue.grossWeight) }}KGS
              </div>
              <div class="w-[12.5%] px-2 text-right text-black">
                {{ formatNumber(totalsValue.measurement) }}CBM
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Footer: freight payable / service contract / cargo + laden dates (last page only) -->
      <div
        v-if="page.pageIndex === paginatedPagesLength - 1"
        class="bc-footer border-t border-[#062c58] flex relative z-[1] bg-white"
        style="min-height: 38px"
      >
        <div class="w-[28%] border-r border-[#062c58] pt-1 px-2 pb-2">
          <span class="text-[0.55rem] leading-tight text-[#062c58] font-bold uppercase block"
            >FREIGHT & CHARGES PAYABLE AT / BY:</span
          >
          <span
            class="uppercase font-mono text-[0.55rem] text-black leading-tight mt-1 block break-words"
            :title="freightPayableAtRaw"
            >{{ freightPayableAt || "-" }}</span
          >
        </div>
        <div class="w-[24%] border-r border-[#062c58] pt-1 px-2 pb-2">
          <span class="text-[0.55rem] leading-tight text-[#062c58] font-bold uppercase block"
            >SERVICE CONTRACT NO.</span
          >
          <span
            class="uppercase font-mono text-[0.55rem] text-black leading-tight mt-1 block break-words"
            >{{ serviceContractNo }}</span
          >
        </div>
        <div class="w-[24%] border-r border-[#062c58] pt-1 px-2 pb-2">
          <span class="text-[0.55rem] leading-tight text-[#062c58] font-bold uppercase block"
            >DATE CARGO RECEIVED</span
          >
          <span class="uppercase font-mono text-[0.55rem] text-black leading-tight mt-1 block">{{
            dateCargoReceived
          }}</span>
        </div>
        <div class="w-[24%] pt-1 px-2 pb-2">
          <span class="text-[0.55rem] leading-tight text-[#062c58] font-bold uppercase block">{{
            loadedDateLabel
          }}</span>
          <span class="uppercase font-mono text-[0.55rem] text-black leading-tight mt-1 block">{{
            dateLaden
          }}</span>
        </div>
      </div>

      <div
        v-if="page.pageIndex < paginatedPagesLength - 1"
        class="border-t border-[#062c58] text-center font-bold text-[0.55rem] py-1 mt-auto font-mono"
      >
        ** TO BE CONTINUED ON PAGE {{ page.pageIndex + 2 }} **
      </div>
    </div>

    <!-- Bottom note + signature (BL footer / freight block removed per markup) -->
    <div class="mt-1 flex justify-between pr-2 text-[#062c58]" style="height: 45px">
      <div class="text-[0.45rem] w-1/2 mt-0.5 italic leading-tight">
        The printed terms and conditions on this Booking Confirmation are available at its website
        at www.nscontinent.com
      </div>
      <div
        v-if="page.pageIndex === paginatedPagesLength - 1"
        class="w-[260px] flex flex-col items-end"
      >
        <div
          class="w-full text-left font-mono bg-white p-1.5"
          style="font-size: 8.5px; line-height: 10.5px"
        >
          <span class="font-bold">SIGNED BY: </span>PT. SAMUDERA AGENCIES INDONESIA<br />
          <span class="pl-14 italic" style="font-size: 7px; line-height: 8.5px"
            >, as agent for and on behalf of NS CONTINENT</span
          >
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

.cargo-window {
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

.font-mono {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New",
    monospace;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
