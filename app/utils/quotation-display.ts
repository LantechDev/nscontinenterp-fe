import { ceilTaxByCurrency, roundByCurrency } from "./currency";

export interface QuotationDisplayCharge {
  atCost?: boolean | null;
  currency?: string | null;
  quantity?: string | number | null;
  unitPrice?: string | number | null;
  taxRate?: string | number | null;
  taxId?: string | null;
}

export interface QuotationDisplaySource {
  charges?: QuotationDisplayCharge[] | null;
  serviceType?: string | null;
  shipmentType?: string | null;
  tradeTypeId?: string | null;
  currency?: string | null;
  exchangeRate?: string | number | null;
  total?: string | number | null;
  pol?: string | null;
  polName?: string | null;
  pod?: string | null;
  podName?: string | null;
  pickupAddress?: string | null;
  deliveryAddress?: string | null;
  containerTypeId?: string | null;
  containerTypeName?: string | null;
  truckType?: string | null;
  taxId?: string | null;
}

export interface QuotationDisplayTax {
  id?: string | null;
  rate?: string | number | null;
}

export interface QuotationGroupedTotal {
  subTotal: number;
  taxAmount: number;
  total: number;
}

export type QuotationGroupedTotals = {
  IDR: QuotationGroupedTotal;
  USD: QuotationGroupedTotal;
  [key: string]: QuotationGroupedTotal;
};

export interface QuotationItemsTotalDisplay {
  primaryAmount: number;
  primaryCurrency: string;
  secondaryAmount: number;
  secondaryCurrency: string;
  showSecondary: boolean;
}

function toNumber(value: string | number | null | undefined) {
  return Number(value || 0);
}

function getBillableCharges(quotation: QuotationDisplaySource) {
  return (quotation.charges || []).filter((charge) => !charge.atCost);
}

function createEmptyGroupedTotals(): QuotationGroupedTotals {
  return {
    IDR: { subTotal: 0, taxAmount: 0, total: 0 },
    USD: { subTotal: 0, taxAmount: 0, total: 0 },
  };
}

function getTaxRate(
  taxes: QuotationDisplayTax[],
  taxId: string | null | undefined,
  fallbackTaxId?: string | null,
) {
  const selectedTaxId = taxId || fallbackTaxId;
  if (!selectedTaxId) return 0;
  const tax = taxes.find((item) => item.id === selectedTaxId);
  return Number(tax?.rate || 0);
}

function ensureGroupedTotal(totals: QuotationGroupedTotals, currency: string) {
  if (!totals[currency]) {
    totals[currency] = { subTotal: 0, taxAmount: 0, total: 0 };
  }
  return totals[currency];
}

export function formatQuotationDate(
  dateString: string | null | undefined,
  format: "long" | "datetime" | "pdf" | "index",
): string {
  if (!dateString) return format === "pdf" ? "" : "-";
  try {
    const date = new Date(dateString);
    if (format === "index") {
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date);
    }

    if (format === "pdf") {
      const parts = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).formatToParts(date);
      return `${parts.find((part) => part.type === "day")?.value} ${parts
        .find((part) => part.type === "month")
        ?.value.toUpperCase()} ${parts.find((part) => part.type === "year")?.value}`;
    }

    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      ...(format === "datetime" ? { hour: "2-digit", minute: "2-digit" } : {}),
    }).format(date);
  } catch {
    return dateString;
  }
}

export function getQuotationServiceFlags(quotation: QuotationDisplaySource) {
  return {
    isOceanService: quotation.serviceType === "OCEAN",
    isAirFreight: quotation.serviceType === "AIR" || quotation.shipmentType === "AIR",
    isTrucking: quotation.serviceType === "TRUCKING",
    isCustomClearance: quotation.serviceType === "CUSTOM_CLEARANCE",
  };
}

export function getQuotationServiceLabels(quotation: QuotationDisplaySource) {
  let tradeTypeLabel = "Export";
  if (quotation.tradeTypeId === "IMPORT") tradeTypeLabel = "Import";
  if (quotation.tradeTypeId === "DOMESTIC") tradeTypeLabel = "Domestic";

  let serviceTypeLabel = "FREIGHT";
  const flags = getQuotationServiceFlags(quotation);
  if (flags.isAirFreight) serviceTypeLabel = "AIR FREIGHT";
  if (flags.isTrucking) serviceTypeLabel = "TRUCKING";
  if (flags.isCustomClearance) serviceTypeLabel = "CUSTOM CLEARANCE";

  let shipmentTypeLabel = "-";
  if (quotation.shipmentType === "AIR") shipmentTypeLabel = "Air Freight";
  if (quotation.shipmentType === "OCEAN") shipmentTypeLabel = "Ocean Freight";

  return { tradeTypeLabel, serviceTypeLabel, shipmentTypeLabel };
}

export function getQuotationRouteDisplay(
  quotation: QuotationDisplaySource,
  options: { labelCase: "title" | "upper" | "short" },
) {
  const flags = getQuotationServiceFlags(quotation);
  const labels = {
    pickup: "Pickup Address",
    delivery: "Delivery Address",
    clearanceOrigin: "Clearance Origin / Port",
    clearanceDestination: "Clearance Destination / Port",
    airOrigin: "Origin Airport",
    airDestination: "Destination Airport",
    pol: "Port of Loading (POL)",
    pod: "Port of Discharge (POD)",
  };
  const shortLabels = {
    pickup: "Pickup",
    delivery: "Delivery",
    clearanceOrigin: "Clearance Origin",
    clearanceDestination: "Clearance Destination",
    airOrigin: "Origin Airport",
    airDestination: "Destination Airport",
    pol: "POL",
    pod: "POD",
  };
  const formatLabel = (label: string) =>
    options.labelCase === "upper" ? label.toUpperCase() : label;

  const labelSet = options.labelCase === "short" ? shortLabels : labels;
  let originLabel = flags.isAirFreight ? labelSet.airOrigin : labelSet.pol;
  let destinationLabel = flags.isAirFreight ? labelSet.airDestination : labelSet.pod;
  if (flags.isTrucking) {
    originLabel = labelSet.pickup;
    destinationLabel = labelSet.delivery;
  }
  if (flags.isCustomClearance) {
    originLabel = labelSet.clearanceOrigin;
    destinationLabel = labelSet.clearanceDestination;
  }

  return {
    originLabel: formatLabel(originLabel),
    destinationLabel: formatLabel(destinationLabel),
    originValue: flags.isTrucking
      ? quotation.pickupAddress || "-"
      : quotation.polName || quotation.pol || "-",
    destinationValue: flags.isTrucking
      ? quotation.deliveryAddress || "-"
      : quotation.podName || quotation.pod || "-",
    containerTypeValue: flags.isCustomClearance
      ? "-"
      : quotation.containerTypeName || quotation.containerTypeId || "-",
    truckTypeValue: flags.isTrucking ? quotation.truckType || "-" : "-",
  };
}

export function getQuotationStatusBadgeClass(
  status: string | null | undefined,
  variant: "soft" | "subtle" = "subtle",
) {
  if (!status) return "bg-gray-50 text-gray-600 border-gray-200";

  const s = status.toUpperCase();
  const classes = {
    subtle: {
      CONVERTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
      CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
      DRAFT: "bg-gray-100 text-gray-700 border-gray-300",
      SENT: "bg-amber-50 text-amber-700 border-amber-200",
      CANCELLED: "bg-rose-50 text-rose-700 border-rose-200",
      EXPIRED: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
    soft: {
      CONVERTED: "bg-emerald-100 text-emerald-800 border-emerald-200",
      CONFIRMED: "bg-blue-100 text-blue-800 border-blue-200",
      DRAFT: "bg-gray-100 text-gray-800 border-gray-300",
      SENT: "bg-amber-100 text-[#8a5d00] border-amber-200",
      CANCELLED: "bg-rose-100 text-rose-800 border-rose-200",
      EXPIRED: "bg-indigo-100 text-indigo-800 border-indigo-200",
    },
  };

  return (
    classes[variant][s as keyof (typeof classes)[typeof variant]] ||
    "bg-gray-50 text-gray-600 border-gray-200"
  );
}

export function getQuotationLineTaxGroupedTotals(
  quotation: QuotationDisplaySource,
  taxes: QuotationDisplayTax[],
) {
  const totals = createEmptyGroupedTotals();
  if (!quotation.charges) return totals;

  const rate = Number(quotation.exchangeRate || 1);
  const shouldConvert = rate > 1;

  quotation.charges.forEach((charge) => {
    const currency = charge.currency || "IDR";
    const quantity = toNumber(charge.quantity);
    const unitPrice = toNumber(charge.unitPrice);
    const amount = quantity * unitPrice;
    const taxRate = getTaxRate(taxes, charge.taxId, quotation.taxId);
    const taxValue = amount * (taxRate / 100);

    if (shouldConvert && currency === "USD") {
      totals.IDR.subTotal += amount * rate;
      totals.IDR.taxAmount += taxValue * rate;
      return;
    }

    const entry = ensureGroupedTotal(totals, currency);
    entry.subTotal += amount;
    entry.taxAmount += taxValue;
  });

  totals.IDR.subTotal = roundByCurrency(totals.IDR.subTotal, "IDR");
  totals.IDR.taxAmount = ceilTaxByCurrency(totals.IDR.taxAmount, "IDR");
  totals.IDR.total = totals.IDR.subTotal + totals.IDR.taxAmount;

  totals.USD.taxAmount = ceilTaxByCurrency(totals.USD.taxAmount, "USD");
  totals.USD.total = totals.USD.subTotal + totals.USD.taxAmount;

  return totals;
}

export function getQuotationPreviewGroupedTotals(
  quotation: QuotationDisplaySource,
  taxes: QuotationDisplayTax[],
) {
  const totals = createEmptyGroupedTotals();
  if (!quotation.charges) return totals;

  const exchangeRate = Number(quotation.exchangeRate || 1);
  const taxRate = getTaxRate(taxes, quotation.taxId);

  getBillableCharges(quotation).forEach((charge) => {
    const sourceCurrency = charge.currency || "IDR";
    const shouldConvertToIDR = sourceCurrency === "USD" && exchangeRate > 1;
    const currency = shouldConvertToIDR ? "IDR" : sourceCurrency;
    const amount = toNumber(charge.quantity) * toNumber(charge.unitPrice);
    const entry = ensureGroupedTotal(totals, currency);
    entry.subTotal += amount * (shouldConvertToIDR ? exchangeRate : 1);
  });

  Object.keys(totals).forEach((currency) => {
    const entry = totals[currency];
    if (!entry) return;
    entry.subTotal = roundByCurrency(entry.subTotal, currency);
    entry.taxAmount = ceilTaxByCurrency(entry.subTotal * (taxRate / 100), currency);
    entry.total = roundByCurrency(entry.subTotal + entry.taxAmount, currency);
  });

  return totals;
}

export function getQuotationFormGroupedTotals(
  quotation: QuotationDisplaySource,
  taxes: QuotationDisplayTax[],
) {
  const totals = createEmptyGroupedTotals();
  const rate = Number(quotation.exchangeRate || 1);
  const shouldConvert = rate > 1;
  const taxRate = getTaxRate(taxes, quotation.taxId);

  getBillableCharges(quotation).forEach((charge) => {
    const currency = charge.currency || "IDR";
    const amount = toNumber(charge.quantity) * toNumber(charge.unitPrice);

    if (shouldConvert && currency === "USD") {
      totals.IDR.subTotal += amount * rate;
      return;
    }

    const entry = ensureGroupedTotal(totals, currency);
    entry.subTotal += amount;
  });

  Object.keys(totals).forEach((currency) => {
    const entry = totals[currency];
    if (!entry) return;
    entry.subTotal = Math.round(entry.subTotal);
    entry.taxAmount = Math.round(entry.subTotal * (taxRate / 100));
    entry.total = entry.subTotal + entry.taxAmount;
  });

  return totals;
}

export function getQuotationTotals(quotation: QuotationDisplaySource) {
  const totals: Record<string, number> = {};
  const rate = Number(quotation.exchangeRate || 1);
  const shouldConvert = rate > 1;

  if (!quotation.charges || quotation.charges.length === 0) {
    const currency = quotation.currency || "IDR";
    const total = toNumber(quotation.total);
    if (shouldConvert && currency === "USD") {
      totals.IDR = Math.round(total * rate);
    } else {
      totals[currency] = total;
    }
    return totals;
  }

  const billableCharges = getBillableCharges(quotation);
  const hasIdrCharge = billableCharges.some((charge) => (charge.currency || "IDR") !== "USD");
  const isFullUsd = billableCharges.length > 0 && !hasIdrCharge;

  billableCharges.forEach((charge) => {
    const currency = charge.currency || "IDR";
    const amount = toNumber(charge.quantity) * toNumber(charge.unitPrice);
    const taxRate = toNumber(charge.taxRate);
    const lineTotal = amount + amount * (taxRate / 100);

    if (shouldConvert && currency === "USD" && !isFullUsd) {
      totals.IDR = (totals.IDR || 0) + Math.round(lineTotal * rate);
    } else {
      totals[currency] = (totals[currency] || 0) + lineTotal;
    }
  });

  if (totals.IDR !== undefined) {
    totals.IDR = Math.round(totals.IDR);
  }
  return totals;
}

export function getQuotationCurrencies(quotation: QuotationDisplaySource) {
  const rate = Number(quotation.exchangeRate || 1);
  if (!quotation.charges || quotation.charges.length === 0) {
    return [quotation.currency || "IDR"];
  }

  const currencies = Array.from(
    new Set(getBillableCharges(quotation).map((charge) => charge.currency || "IDR")),
  );
  if (rate > 1 && currencies.some((currency) => currency !== "USD")) return ["IDR"];
  return currencies;
}

export function getQuotationItemsTotalDisplay(
  quotation: QuotationDisplaySource,
): QuotationItemsTotalDisplay {
  let idrTotal = 0;
  let usdTotal = 0;
  const rate = Number(quotation.exchangeRate || 1);

  getBillableCharges(quotation).forEach((charge) => {
    const amount = toNumber(charge.quantity) * toNumber(charge.unitPrice);
    if ((charge.currency || "IDR") === "USD") {
      usdTotal += amount;
      if (rate > 1) idrTotal += amount * rate;
    } else {
      idrTotal += amount;
    }
  });

  if (usdTotal > 0 && idrTotal <= 0) {
    return {
      primaryAmount: usdTotal,
      primaryCurrency: "USD",
      secondaryAmount: 0,
      secondaryCurrency: "IDR",
      showSecondary: false,
    };
  }

  return {
    primaryAmount: idrTotal,
    primaryCurrency: "IDR",
    secondaryAmount: usdTotal,
    secondaryCurrency: "USD",
    showSecondary: usdTotal > 0,
  };
}
