// @ts-ignore
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { formatExchangeRateLabel } from "./currency";
import {
  formatQuotationDate,
  getQuotationLineTaxGroupedTotals,
  getQuotationPreviewGroupedTotals,
  getQuotationFormGroupedTotals,
  getQuotationStatusBadgeClass,
  getQuotationRouteDisplay,
  getQuotationServiceFlags,
  getQuotationServiceLabels,
} from "./quotation-display";

const root = process.cwd();

describe("quotation service items display", () => {
  it("does not show IDR zero as the primary amount for full USD service items", () => {
    const helper = readFileSync(join(root, "app/utils/quotation-display.ts"), "utf8");
    const detail = readFileSync(
      join(root, "app/components/operational/QuotationDetailSlideOver.vue"),
      "utf8",
    );

    expect(helper).toContain("export function getQuotationItemsTotalDisplay");
    expect(detail).toContain("getQuotationItemsTotalDisplay");
    expect(detail).toContain("itemsTotalDisplay.primaryAmount");
    expect(detail).not.toContain('formatCurrency(itemsTotalRevenue.idrTotal, "IDR")');
  });

  it("keeps full USD quotations as USD in the quotation index table", () => {
    const helper = readFileSync(join(root, "app/utils/quotation-display.ts"), "utf8");
    const page = readFileSync(join(root, "app/pages/operational/quotations/index.vue"), "utf8");

    expect(helper).toContain("export function getQuotationTotals");
    expect(helper).toContain("export function getQuotationCurrencies");
    expect(page).toContain("getQuotationTotals(q)");
    expect(page).toContain("getQuotationCurrencies(q)");
    expect(page).not.toContain("const isFullUsd = billableCharges.length > 0 && !hasIdrCharge");
  });

  it("uses the shared currency formatter for quotation money display", () => {
    const currency = readFileSync(join(root, "app/utils/currency.ts"), "utf8");
    const page = readFileSync(join(root, "app/pages/operational/quotations/index.vue"), "utf8");
    const detail = readFileSync(
      join(root, "app/components/operational/QuotationDetailSlideOver.vue"),
      "utf8",
    );

    expect(currency).toContain("export function formatCurrencyAmount");
    expect(page).toContain("formatCurrencyAmount(amount, curr)");
    expect(detail).toContain("formatCurrencyAmount(");
    expect(page).not.toContain("function formatCurrency(amount");
    expect(detail).not.toContain("const formatCurrency =");
  });

  it("uses the shared decimal formatter for quotation PDF preview totals", () => {
    const currency = readFileSync(join(root, "app/utils/currency.ts"), "utf8");
    const preview = readFileSync(
      join(root, "app/components/operational/QuotationPreview.vue"),
      "utf8",
    );

    expect(currency).toContain("export function formatCurrencyDecimal");
    expect(preview).toContain("formatCurrencyDecimal(");
    expect(preview).not.toContain("const formatCurrency =");
  });

  it("does not keep unused IDR conversion formatters in quotation display components", () => {
    const preview = readFileSync(
      join(root, "app/components/operational/QuotationPreview.vue"),
      "utf8",
    );
    const detail = readFileSync(
      join(root, "app/components/operational/QuotationDetailSlideOver.vue"),
      "utf8",
    );

    expect(preview).not.toContain("const formatCurrencyIDR =");
    expect(detail).not.toContain("const formatCurrencyIDR =");
  });

  it("formats exchange-rate labels for quotation detail and PDF preview", () => {
    expect(formatExchangeRateLabel(16000, { idrPosition: "suffix", defaultLabel: "" })).toBe(
      "1 USD = 16.000 IDR",
    );
    expect(
      formatExchangeRateLabel(16000, {
        idrPosition: "prefix",
        defaultLabel: "1 USD = USD 1",
      }),
    ).toBe("1 USD = IDR 16.000");
    expect(formatExchangeRateLabel(1, { idrPosition: "suffix", defaultLabel: "" })).toBe("");
    expect(
      formatExchangeRateLabel(1, { idrPosition: "prefix", defaultLabel: "1 USD = USD 1" }),
    ).toBe("1 USD = USD 1");
  });

  it("centralizes quotation service labels and route display helpers", () => {
    const trucking = {
      serviceType: "TRUCKING",
      tradeTypeId: "DOMESTIC",
      pickupAddress: "Warehouse A",
      deliveryAddress: "Warehouse B",
      truckType: "CDD",
    };
    const air = {
      serviceType: "OCEAN",
      shipmentType: "AIR",
      tradeTypeId: "IMPORT",
      polName: "CGK",
      podName: "SIN",
      containerTypeName: "ULD",
    };
    const clearance = {
      serviceType: "CUSTOM_CLEARANCE",
      tradeTypeId: "EXPORT",
      pol: "Mundra",
      pod: "Jakarta",
    };

    expect(getQuotationServiceLabels(trucking)).toEqual({
      tradeTypeLabel: "Domestic",
      serviceTypeLabel: "TRUCKING",
      shipmentTypeLabel: "-",
    });
    expect(getQuotationServiceFlags(air)).toEqual({
      isOceanService: true,
      isAirFreight: true,
      isTrucking: false,
      isCustomClearance: false,
    });
    expect(getQuotationRouteDisplay(trucking, { labelCase: "title" })).toMatchObject({
      originLabel: "Pickup Address",
      destinationLabel: "Delivery Address",
      originValue: "Warehouse A",
      destinationValue: "Warehouse B",
      truckTypeValue: "CDD",
    });
    expect(getQuotationRouteDisplay(clearance, { labelCase: "upper" })).toMatchObject({
      originLabel: "CLEARANCE ORIGIN / PORT",
      destinationLabel: "CLEARANCE DESTINATION / PORT",
      containerTypeValue: "-",
    });
  });

  it("centralizes quotation date formatting for detail and PDF preview", () => {
    const preview = readFileSync(
      join(root, "app/components/operational/QuotationPreview.vue"),
      "utf8",
    );
    const detail = readFileSync(
      join(root, "app/components/operational/QuotationDetailSlideOver.vue"),
      "utf8",
    );

    expect(formatQuotationDate("2026-07-28", "long")).toBe("28 July 2026");
    expect(formatQuotationDate("2026-07-28", "pdf")).toBe("28 JUL 2026");
    expect(formatQuotationDate(null, "long")).toBe("-");
    expect(formatQuotationDate(null, "pdf")).toBe("");
    expect(preview).toContain('formatQuotationDate(quotation?.date, "pdf")');
    expect(detail).toContain('formatQuotationDate(quotation.date, "long")');
    expect(preview).not.toContain("const formatDate =");
    expect(detail).not.toContain("const formatDate =");
  });

  it("centralizes quotation index row display helpers", () => {
    const page = readFileSync(join(root, "app/pages/operational/quotations/index.vue"), "utf8");

    expect(formatQuotationDate("2026-07-28", "index")).toBe("28 Jul 2026");
    expect(page).toContain('formatQuotationDate(q.date, "index")');
    expect(page).toContain('getQuotationRouteDisplay(q, { labelCase: "short" })');
    expect(page).toContain("getQuotationServiceLabels(q).serviceTypeLabel");
    expect(page).not.toContain("function formatDate(");
    expect(page).not.toContain("const getRouteOriginLabel =");
    expect(page).not.toContain("const getServiceScopeLabel =");
  });

  it("centralizes quotation status badge classes while preserving tone variants", () => {
    const page = readFileSync(join(root, "app/pages/operational/quotations/index.vue"), "utf8");
    const detail = readFileSync(
      join(root, "app/components/operational/QuotationDetailSlideOver.vue"),
      "utf8",
    );

    expect(getQuotationStatusBadgeClass("SENT", "subtle")).toBe(
      "bg-amber-50 text-amber-700 border-amber-200",
    );
    expect(getQuotationStatusBadgeClass("SENT", "soft")).toBe(
      "bg-amber-100 text-[#8a5d00] border-amber-200",
    );
    expect(getQuotationStatusBadgeClass(null, "soft")).toBe(
      "bg-gray-50 text-gray-600 border-gray-200",
    );
    expect(page).toContain("getQuotationStatusBadgeClass(q.status, 'subtle')");
    expect(detail).toContain("getQuotationStatusBadgeClass(quotation.status, 'soft')");
    expect(page).not.toContain("const getStatusClass =");
    expect(detail).not.toContain("const getStatusBadgeClass =");
  });

  it("centralizes grouped totals without mixing detail and preview tax behavior", () => {
    const detail = readFileSync(
      join(root, "app/components/operational/QuotationDetailSlideOver.vue"),
      "utf8",
    );
    const preview = readFileSync(
      join(root, "app/components/operational/QuotationPreview.vue"),
      "utf8",
    );
    const quotation = {
      exchangeRate: 15000,
      taxId: "T10",
      charges: [
        { currency: "USD", quantity: 2, unitPrice: 10, taxId: "T10" },
        { currency: "IDR", quantity: 1, unitPrice: 1000, taxId: null },
        { currency: "IDR", quantity: 1, unitPrice: 100, atCost: true },
      ],
    };
    const taxes = [
      { id: "T10", rate: 10 },
      { id: "T5", rate: 5 },
    ];

    expect(getQuotationLineTaxGroupedTotals(quotation, taxes).IDR).toEqual({
      subTotal: 301100,
      taxAmount: 30110,
      total: 331210,
    });
    expect(getQuotationPreviewGroupedTotals(quotation, taxes).IDR).toEqual({
      subTotal: 301000,
      taxAmount: 30100,
      total: 331100,
    });
    expect(detail).toContain("getQuotationLineTaxGroupedTotals(");
    expect(preview).toContain("getQuotationPreviewGroupedTotals(");
    expect(detail).not.toContain("quotation.value.charges.forEach((ch)");
    expect(preview).not.toContain("props.quotation.charges.forEach((ch)");
  });

  it("centralizes create and edit quotation form grouped totals", () => {
    const create = readFileSync(join(root, "app/pages/operational/quotations/create.vue"), "utf8");
    const edit = readFileSync(join(root, "app/pages/operational/quotations/[id]/edit.vue"), "utf8");
    const quotation = {
      exchangeRate: 15000,
      taxId: "T10",
      charges: [
        { currency: "USD", quantity: 2, unitPrice: 10 },
        { currency: "IDR", quantity: 1, unitPrice: 1000 },
        { currency: "IDR", quantity: 1, unitPrice: 100, atCost: true },
      ],
    };

    expect(getQuotationFormGroupedTotals(quotation, [{ id: "T10", rate: 10 }]).IDR).toEqual({
      subTotal: 301000,
      taxAmount: 30100,
      total: 331100,
    });
    expect(create).toContain(
      "getQuotationFormGroupedTotals(formData, masterData.value?.taxes || [])",
    );
    expect(edit).toContain(
      "getQuotationFormGroupedTotals(formData, masterData.value?.taxes || [])",
    );
    expect(create).toContain("formatCurrencyAmount(amount, currency)");
    expect(edit).toContain("formatCurrencyAmount(amount, currency)");
    expect(create).not.toContain("formData.charges.forEach((ch)");
    expect(edit).not.toContain("formData.charges.forEach((ch)");
  });

  it("sends the selected quotation tax with each charge so preview/detail tax cards stay consistent", () => {
    const create = readFileSync(join(root, "app/pages/operational/quotations/create.vue"), "utf8");
    const edit = readFileSync(join(root, "app/pages/operational/quotations/[id]/edit.vue"), "utf8");

    expect(create).toContain("taxId: ch.taxId || formData.taxId || null");
    expect(edit).toContain("taxId: ch.taxId || formData.taxId || null");
  });

  it("shows quotation list financial cards as display-only quotation numbers", () => {
    const page = readFileSync(join(root, "app/pages/operational/quotations/index.vue"), "utf8");
    const composable = readFileSync(join(root, "app/composables/useQuotations.ts"), "utf8");

    expect(page).toContain("quotationFinancialSummary");
    expect(page).toContain("Total Sales Proposals");
    expect(page).toContain("Draft Quotations");
    expect(page).toContain("Sent to Clients");
    expect(page).toContain("Approved (Confirmed)");
    expect(page).toContain("Total Quotation");
    expect(page).toContain("Est. Tax");
    expect(page).toContain("Est. Profit");
    expect(page).toContain("text-lg font-bold");
    expect(page).not.toContain("Before Tax");
    expect(page).not.toContain("Pajak hanya display quotation");
    expect(page).not.toContain("Before tax: revenue dikurangi cost");
    expect(composable).toContain("financialSummary");
  });

  it("uses shared formatters across quotation costing and invoice views", () => {
    const costing = readFileSync(
      join(root, "app/components/operational/QuotationCostingTab.vue"),
      "utf8",
    );
    const invoiceForm = readFileSync(
      join(root, "app/components/operational/QuotationInvoiceForm.vue"),
      "utf8",
    );
    const invoicePreview = readFileSync(
      join(root, "app/components/operational/QuotationInvoicePreview.vue"),
      "utf8",
    );

    expect(costing).toContain("formatCurrencyAmount(amount, currency)");
    expect(invoiceForm).toContain("formatCurrencyAmount(amount, currency)");
    expect(invoicePreview).toContain('formatQuotationDate(invoice?.date, "pdf")');
    expect(costing).not.toContain('new Intl.NumberFormat(currency === "USD" ? "en-US" : "id-ID"');
    expect(invoiceForm).not.toContain('style: "currency"');
    expect(invoicePreview).not.toContain("const formatDate =");
  });

  it("uses shared PDF preview formatters for costing documents", () => {
    const costingPreview = readFileSync(
      join(root, "app/components/operational/QuotationCostingPreview.vue"),
      "utf8",
    );
    const costDetailPreview = readFileSync(
      join(root, "app/components/operational/QuotationCostDetailPreview.vue"),
      "utf8",
    );
    const invoicePreview = readFileSync(
      join(root, "app/components/operational/QuotationInvoicePreview.vue"),
      "utf8",
    );

    expect(costingPreview).toContain('formatQuotationDate(quotation?.date, "pdf")');
    expect(costingPreview).toContain("formatExchangeRateLabel(quotationExchangeRate.value");
    expect(costingPreview).toContain("formatCurrencyCode(toNumber(val), currency)");
    expect(costDetailPreview).toContain('formatQuotationDate(cost?.date, "pdf")');
    expect(costDetailPreview).toContain("formatExchangeRateLabel(costExchangeRate.value");
    expect(costDetailPreview).toContain("formatCurrencyDecimal(displayAmount(amount, currency)");
    expect(invoicePreview).toContain("formatExchangeRateLabel(documentExchangeRate.value");
    expect(invoicePreview).toContain("formatCurrencyDecimal(displayAmount(amount, currency)");
    expect(costingPreview).not.toContain("const formatDate =");
    expect(costDetailPreview).not.toContain("const formatDate =");
  });
});
