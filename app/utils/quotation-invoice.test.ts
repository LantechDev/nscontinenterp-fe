// @ts-ignore
import { describe, expect, it } from "bun:test";
import { buildInvoiceItems, findServiceIdForInvoiceDescription } from "./quotationInvoice";

interface QuotationCost {
  id?: string;
  amount: number;
  items?: Array<{ amount: number }>;
}

interface QuotationCharge {
  id?: string;
  tempId?: number;
  currency?: string;
  quantity?: number;
  unitPrice?: number;
  taxRate?: number;
  atCost?: boolean;
  description?: string;
}

interface QuotationInvoice {
  id?: string;
  number?: string | null;
  items?: Array<{
    chargeId?: string | null;
    description: string;
    quantity: number;
    unitPrice: number;
    currency?: string;
    amount: number;
  }>;
  total: number;
  subTotal: number;
  taxAmount: number;
  notes?: string | null;
}

interface Quotation {
  id: string;
  number: string;
  currency?: string;
  total?: number;
  exchangeRate?: number;
  status: string;
  notes?: string | null;
  taxId?: string | null;
  customerName?: string;
  costs?: QuotationCost[];
  totalEstimatedCost?: number;
  charges?: QuotationCharge[];
  quotationInvoices?: QuotationInvoice[];
  allowMultipleInvoices?: boolean;
}

// --- Pure functions extracted for testability ---

function getQuotationCostTotal(q: Quotation): number {
  const costs = q.costs || [];
  if (costs.length > 0) {
    return costs.reduce((sum, c) => sum + Number(c.amount || 0), 0);
  }
  return Number(q.totalEstimatedCost || 0);
}

function hasCostData(q: Quotation): boolean {
  return getQuotationCostTotal(q) > 0;
}

function canUseQuotationForInvoice(q: Quotation, currentJobQuotationId?: string | null): boolean {
  if (q.status === "CONFIRMED") return true;
  if (q.status === "CONVERTED") {
    return q.id === currentJobQuotationId || Boolean(q.allowMultipleInvoices);
  }
  return false;
}

function getQuotationTotals(q: Quotation): Record<string, number> {
  const totals: Record<string, number> = {};
  const rate = Number(q.exchangeRate || 1);
  const shouldConvert = rate > 1;

  if (!q.charges || q.charges.length === 0) {
    if (shouldConvert && (q.currency || "IDR") === "USD") {
      totals.IDR = Math.round(Number(q.total || 0) * rate);
    } else {
      totals[q.currency || "IDR"] = Number(q.total || 0);
    }
    return totals;
  }

  q.charges.forEach((ch) => {
    const currency = ch.currency || "IDR";
    const qty = Number(ch.quantity || 0);
    const price = Number(ch.unitPrice || 0);
    const amount = qty * price;
    const taxRate = Number(ch.taxRate || 0);
    const taxAmount = amount * (taxRate / 100);
    const lineTotal = amount + taxAmount;

    if (shouldConvert && currency === "USD") {
      totals.IDR = (totals.IDR || 0) + Math.round(lineTotal * rate);
    } else {
      totals[currency] = (totals[currency] || 0) + lineTotal;
    }
  });

  (q.quotationInvoices || []).forEach((invoice) => {
    (invoice.items || []).forEach((item) => {
      if (item.chargeId) return;
      const currency = item.currency || "IDR";
      const lineTotal = Number(
        item.amount || Number(item.quantity || 0) * Number(item.unitPrice || 0),
      );

      if (shouldConvert && currency === "USD") {
        totals.IDR = (totals.IDR || 0) + Math.round(lineTotal * rate);
      } else {
        totals[currency] = (totals[currency] || 0) + lineTotal;
      }
    });
  });

  if (totals.IDR !== undefined) {
    totals.IDR = Math.round(totals.IDR);
  }
  return totals;
}

function getQuotationRevenue(q: Quotation): number {
  if (!q.charges || q.charges.length === 0) return 0;
  let total = 0;
  const rate = Number(q.exchangeRate || 1);
  q.charges.forEach((ch) => {
    if (ch.atCost) return;
    const amt = Number(ch.quantity || 0) * Number(ch.unitPrice || 0);
    total += (ch.currency || "IDR") === "USD" && rate > 1 ? amt * rate : amt;
  });
  (q.quotationInvoices || []).forEach((invoice) => {
    (invoice.items || []).forEach((item) => {
      if (item.chargeId) return;
      const amt = Number(item.amount || Number(item.quantity || 0) * Number(item.unitPrice || 0));
      total += (item.currency || "IDR") === "USD" && rate > 1 ? amt * rate : amt;
    });
  });
  return total;
}

function shouldShowSourcePicker(q: Quotation): boolean {
  return (q.quotationInvoices || []).length > 0;
}

// --- Tests ---

describe("getQuotationCostTotal", () => {
  it("sums costs from costs[] when available", () => {
    const q: Quotation = {
      id: "1",
      number: "Q-001",
      status: "CONFIRMED",
      costs: [
        { amount: 100000, items: [] },
        { amount: 50000, items: [] },
      ],
      totalEstimatedCost: 200000, // should be ignored
    };
    expect(getQuotationCostTotal(q)).toBe(150000);
  });

  it("fallback to totalEstimatedCost when costs[] is empty", () => {
    const q: Quotation = {
      id: "2",
      number: "Q-002",
      status: "CONFIRMED",
      costs: [],
      totalEstimatedCost: 300000,
    };
    expect(getQuotationCostTotal(q)).toBe(300000);
  });

  it("fallback to totalEstimatedCost when costs[] is undefined", () => {
    const q: Quotation = {
      id: "3",
      number: "Q-003",
      status: "CONFIRMED",
      totalEstimatedCost: 500000,
    };
    expect(getQuotationCostTotal(q)).toBe(500000);
  });

  it("returns 0 when no costs and no totalEstimatedCost", () => {
    const q: Quotation = {
      id: "4",
      number: "Q-004",
      status: "CONFIRMED",
    };
    expect(getQuotationCostTotal(q)).toBe(0);
  });
});

describe("buildInvoiceItems", () => {
  it("keeps quotation invoice items independent from quotation charges", () => {
    const items = buildInvoiceItems([
      {
        serviceId: "svc_ocean",
        description: "Ocean Freight",
        quantity: 2,
        unitPrice: 1500000,
        currency: "IDR",
      },
    ]);

    expect(items).toEqual([
      {
        chargeId: null,
        serviceId: "svc_ocean",
        description: "Ocean Freight",
        quantity: 2,
        unitPrice: 1500000,
        currency: "IDR",
        amount: 3000000,
      },
    ]);
  });
});

describe("findServiceIdForInvoiceDescription", () => {
  it("selects the matching master service from a saved quotation item description", () => {
    const serviceId = findServiceIdForInvoiceDescription("AIR FREIGHT", [
      { id: "svc-fsc", name: "FSC" },
      { id: "svc-air", name: "AIR FREIGHT" },
    ]);

    expect(serviceId).toBe("svc-air");
  });

  it("selects the base service when the saved description has extra detail", () => {
    const serviceId = findServiceIdForInvoiceDescription("AIR FREIGHT +1000", [
      { id: "svc-air", name: "AIR FREIGHT" },
    ]);

    expect(serviceId).toBe("svc-air");
  });
});

describe("hasCostData", () => {
  it("returns true when costs[] has entries", () => {
    const q: Quotation = {
      id: "1",
      number: "Q-001",
      status: "CONFIRMED",
      costs: [{ amount: 50000, items: [] }],
    };
    expect(hasCostData(q)).toBe(true);
  });

  it("returns true when totalEstimatedCost > 0", () => {
    const q: Quotation = {
      id: "2",
      number: "Q-002",
      status: "CONFIRMED",
      totalEstimatedCost: 100000,
    };
    expect(hasCostData(q)).toBe(true);
  });

  it("returns false when no cost data at all", () => {
    const q: Quotation = { id: "3", number: "Q-003", status: "CONFIRMED" };
    expect(hasCostData(q)).toBe(false);
  });
});

describe("canUseQuotationForInvoice", () => {
  it("allows CONFIRMED quotations", () => {
    expect(canUseQuotationForInvoice({ id: "1", number: "Q-001", status: "CONFIRMED" })).toBe(true);
  });

  it("allows CONVERTED + allowMultipleInvoices", () => {
    expect(
      canUseQuotationForInvoice({
        id: "2",
        number: "Q-002",
        status: "CONVERTED",
        allowMultipleInvoices: true,
      }),
    ).toBe(true);
  });

  it("denies CONVERTED without allowMultipleInvoices", () => {
    expect(
      canUseQuotationForInvoice({
        id: "3",
        number: "Q-003",
        status: "CONVERTED",
        allowMultipleInvoices: false,
      }),
    ).toBe(false);
  });

  it("allows a converted quotation when it belongs to the current job", () => {
    expect(
      canUseQuotationForInvoice(
        {
          id: "3",
          number: "Q-003",
          status: "CONVERTED",
          allowMultipleInvoices: false,
        },
        "3",
      ),
    ).toBe(true);
  });

  it("denies DRAFT", () => {
    expect(canUseQuotationForInvoice({ id: "4", number: "Q-004", status: "DRAFT" })).toBe(false);
  });

  it("denies SENT", () => {
    expect(canUseQuotationForInvoice({ id: "5", number: "Q-005", status: "SENT" })).toBe(false);
  });
});

describe("getQuotationTotals", () => {
  it("groups charges by currency when exchange rate is 1", () => {
    const q: Quotation = {
      id: "1",
      number: "Q-001",
      status: "CONFIRMED",
      exchangeRate: 1,
      charges: [
        { currency: "IDR", quantity: 2, unitPrice: 50000, taxRate: 10 },
        { currency: "IDR", quantity: 1, unitPrice: 100000, taxRate: 0 },
        { currency: "USD", quantity: 1, unitPrice: 100, taxRate: 5 },
      ],
    };
    const totals = getQuotationTotals(q);
    expect(totals.IDR).toBe(210000); // (2*50000*1.1) + (1*100000*1.0) = 110000 + 100000
    expect(totals.USD).toBe(105); // 1*100*1.05
  });

  it("converts USD to IDR when exchange rate > 1", () => {
    const q: Quotation = {
      id: "2",
      number: "Q-002",
      status: "CONFIRMED",
      exchangeRate: 16000,
      charges: [
        { currency: "IDR", quantity: 2, unitPrice: 50000, taxRate: 10 },
        { currency: "USD", quantity: 1, unitPrice: 100, taxRate: 5 },
      ],
    };
    const totals = getQuotationTotals(q);
    // USD: 1*100*1.05 = 105 * 16000 = 1,680,000
    // IDR: 2*50000*1.1 = 110,000
    expect(totals.IDR).toBe(110000 + 1680000);
    expect(totals.USD || 0).toBe(0);
  });

  it("falls back to quotation total when no charges", () => {
    const q: Quotation = {
      id: "3",
      number: "Q-003",
      status: "CONFIRMED",
      currency: "USD",
      exchangeRate: 1,
      total: 500,
    };
    const totals = getQuotationTotals(q);
    expect(totals.USD).toBe(500);
  });

  it("converts fallback total when USD and rate > 1", () => {
    const q: Quotation = {
      id: "4",
      number: "Q-004",
      status: "CONFIRMED",
      currency: "USD",
      exchangeRate: 16000,
      total: 500,
    };
    const totals = getQuotationTotals(q);
    expect(totals.IDR).toBe(8000000); // 500 * 16000
  });

  it("includes additional service items in quotation picker totals", () => {
    const q: Quotation = {
      id: "5",
      number: "Q-005",
      status: "CONFIRMED",
      exchangeRate: 1,
      charges: [{ currency: "IDR", quantity: 1, unitPrice: 1_000_000, taxRate: 0 }],
      quotationInvoices: [
        {
          items: [
            {
              description: "ADDITIONAL HANDLING",
              quantity: 2,
              unitPrice: 500_000,
              currency: "IDR",
              amount: 1_000_000,
            },
          ],
          total: 1_000_000,
          subTotal: 1_000_000,
          taxAmount: 0,
        },
      ],
    };

    expect(getQuotationTotals(q).IDR).toBe(2_000_000);
  });

  it("does not double count legacy additional items linked to saved charges", () => {
    const q: Quotation = {
      id: "legacy-linked",
      number: "Q-LEGACY",
      status: "CONFIRMED",
      exchangeRate: 1,
      charges: [{ currency: "IDR", quantity: 1, unitPrice: 1_000_000, taxRate: 0 }],
      quotationInvoices: [
        {
          items: [
            {
              chargeId: "quotation-charge-1",
              description: "MAIN FREIGHT COPY",
              quantity: 1,
              unitPrice: 1_000_000,
              currency: "IDR",
              amount: 1_000_000,
            },
          ],
          total: 1_000_000,
          subTotal: 1_000_000,
          taxAmount: 0,
        },
      ],
    };

    expect(getQuotationTotals(q).IDR).toBe(1_000_000);
  });
});

describe("getQuotationRevenue", () => {
  it("sums non-atCost charges", () => {
    const q: Quotation = {
      id: "1",
      number: "Q-001",
      status: "CONFIRMED",
      exchangeRate: 1,
      charges: [
        { currency: "IDR", quantity: 2, unitPrice: 50000 },
        { currency: "IDR", quantity: 1, unitPrice: 100000, atCost: true },
      ],
    };
    expect(getQuotationRevenue(q)).toBe(100000); // only the first, non-atCost
  });

  it("converts USD with valid exchange rate", () => {
    const q: Quotation = {
      id: "2",
      number: "Q-002",
      status: "CONFIRMED",
      exchangeRate: 16000,
      charges: [
        { currency: "USD", quantity: 1, unitPrice: 100 },
        { currency: "IDR", quantity: 1, unitPrice: 500000 },
      ],
    };
    expect(getQuotationRevenue(q)).toBe(1600000 + 500000); // USD converted
  });

  it("ignores exchange rate <= 1 for USD", () => {
    const q: Quotation = {
      id: "3",
      number: "Q-003",
      status: "CONFIRMED",
      exchangeRate: 1,
      charges: [{ currency: "USD", quantity: 1, unitPrice: 100 }],
    };
    // rate=1 is not > 1, so USD is not converted — just added raw
    expect(getQuotationRevenue(q)).toBe(100);
  });

  it("includes additional service items in quotation picker revenue", () => {
    const q: Quotation = {
      id: "4",
      number: "Q-004",
      status: "CONFIRMED",
      exchangeRate: 1,
      charges: [{ currency: "IDR", quantity: 1, unitPrice: 1_000_000 }],
      quotationInvoices: [
        {
          items: [
            {
              description: "ADDITIONAL HANDLING",
              quantity: 2,
              unitPrice: 500_000,
              currency: "IDR",
              amount: 1_000_000,
            },
          ],
          total: 1_000_000,
          subTotal: 1_000_000,
          taxAmount: 0,
        },
      ],
    };

    expect(getQuotationRevenue(q)).toBe(2_000_000);
  });

  it("does not count legacy additional items linked to saved charges as new revenue", () => {
    const q: Quotation = {
      id: "legacy-linked-revenue",
      number: "Q-LEGACY-REV",
      status: "CONFIRMED",
      exchangeRate: 1,
      charges: [{ currency: "IDR", quantity: 1, unitPrice: 1_000_000 }],
      quotationInvoices: [
        {
          items: [
            {
              chargeId: "quotation-charge-1",
              description: "MAIN FREIGHT COPY",
              quantity: 1,
              unitPrice: 1_000_000,
              currency: "IDR",
              amount: 1_000_000,
            },
          ],
          total: 1_000_000,
          subTotal: 1_000_000,
          taxAmount: 0,
        },
      ],
    };

    expect(getQuotationRevenue(q)).toBe(1_000_000);
  });
});

describe("shouldShowSourcePicker", () => {
  it("shows picker when quotation has invoices", () => {
    const q: Quotation = {
      id: "1",
      number: "Q-001",
      status: "CONFIRMED",
      quotationInvoices: [
        {
          items: [{ description: "Freight", quantity: 1, unitPrice: 100, amount: 100 }],
          total: 100,
          subTotal: 100,
          taxAmount: 0,
        },
      ],
    };
    expect(shouldShowSourcePicker(q)).toBe(true);
  });

  it("skips picker when no invoices", () => {
    const q: Quotation = {
      id: "2",
      number: "Q-002",
      status: "CONFIRMED",
      quotationInvoices: [],
    };
    expect(shouldShowSourcePicker(q)).toBe(false);
  });

  it("skips picker when quotationInvoices is undefined", () => {
    const q: Quotation = {
      id: "3",
      number: "Q-003",
      status: "CONFIRMED",
    };
    expect(shouldShowSourcePicker(q)).toBe(false);
  });
});
