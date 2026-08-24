// @ts-ignore
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { paginatePdfRows } from "./pdfPagination";

const root = process.cwd();

describe("PDF row pagination", () => {
  it("paginates rows with first-page headers and last-page reserve", () => {
    const pages = paginatePdfRows({
      items: ["a", "b", "c", "d"],
      mainHeightPx: 100,
      firstHeaderPx: 20,
      continuationHeaderPx: 10,
      tableHeaderPx: 10,
      lastPageReservePx: 30,
      getRowHeightPx: () => 25,
    });

    expect(pages).toEqual([
      {
        items: ["a", "b"],
        startIndex: 0,
        pageNumber: 1,
        isFirstPage: true,
        isLastPage: false,
      },
      {
        items: ["c", "d"],
        startIndex: 2,
        pageNumber: 2,
        isFirstPage: false,
        isLastPage: true,
      },
    ]);
  });

  it("keeps one empty page for empty PDF previews", () => {
    expect(
      paginatePdfRows({
        items: [],
        mainHeightPx: 100,
        firstHeaderPx: 20,
        continuationHeaderPx: 10,
        tableHeaderPx: 10,
        lastPageReservePx: 30,
        getRowHeightPx: () => 25,
      }),
    ).toEqual([{ items: [], startIndex: 0, pageNumber: 1, isFirstPage: true, isLastPage: true }]);
  });

  it("keeps PDF preview components focused on row measurements", () => {
    const invoicePreview = readFileSync(
      join(root, "app/components/operational/QuotationInvoicePreview.vue"),
      "utf8",
    );
    const costDetailPreview = readFileSync(
      join(root, "app/components/operational/QuotationCostDetailPreview.vue"),
      "utf8",
    );
    const quotationPreview = readFileSync(
      join(root, "app/components/operational/QuotationPreview.vue"),
      "utf8",
    );

    expect(invoicePreview).toContain("paginatePdfRows({");
    expect(costDetailPreview).toContain("paginatePdfRows({");
    expect(quotationPreview).toContain("paginatePdfRows({");
    expect(invoicePreview).not.toContain("while (i < items.length)");
    expect(costDetailPreview).not.toContain("while (i < items.length)");
    expect(quotationPreview).not.toContain("while (i < items.length)");
  });
});
