// @ts-ignore
import { describe, expect, it } from "bun:test";
import { buildInvoiceAnalysisCards, isInvoiceAnalysisReady } from "./invoiceAnalysis";

describe("invoice analysis cards", () => {
  it("builds A/R, A/P, and profit analysis cards from summaries", () => {
    const cards = buildInvoiceAnalysisCards({
      receivable: {
        totalAmount: 10_000_000,
        totalPaid: 7_000_000,
        totalOutstanding: 3_000_000,
        count: 4,
      },
      payable: {
        totalAmount: 4_000_000,
        totalPaid: 1_500_000,
        totalOutstanding: 2_500_000,
        count: 3,
      },
    });

    expect(cards.map((card) => ({ label: card.label, value: card.value }))).toEqual([
      { label: "Total A/R", value: 10_000_000 },
      { label: "A/R Unpaid", value: 3_000_000 },
      { label: "A/R Paid", value: 7_000_000 },
      { label: "Total A/P", value: 4_000_000 },
      { label: "A/P Unpaid", value: 2_500_000 },
      { label: "A/P Paid", value: 1_500_000 },
      { label: "Total Profit", value: 6_000_000 },
    ]);
  });

  it("calculates invoice page profit from net amounts before tax", () => {
    const cards = buildInvoiceAnalysisCards({
      receivable: {
        totalAmount: 11_100_000,
        netAmount: 10_000_000,
        totalPaid: 11_100_000,
        totalOutstanding: 0,
        count: 1,
      },
      payable: {
        totalAmount: 5_550_000,
        netAmount: 5_000_000,
        totalPaid: 5_550_000,
        totalOutstanding: 0,
        count: 1,
      },
    });

    expect(cards.find((card) => card.label === "Total Profit")?.value).toBe(5_000_000);
    expect(cards.find((card) => card.label === "Total Profit")?.caption).toBe(
      "Net before tax: A/R dikurangi A/P",
    );
  });

  it("treats missing summaries as loading so zero is not shown before API data arrives", () => {
    expect(isInvoiceAnalysisReady({ receivable: null, payable: null })).toBe(false);
    expect(
      isInvoiceAnalysisReady({
        receivable: { totalAmount: 0, totalPaid: 0, totalOutstanding: 0, count: 0 },
        payable: { totalAmount: 0, totalPaid: 0, totalOutstanding: 0, count: 0 },
      }),
    ).toBe(true);
  });
});
