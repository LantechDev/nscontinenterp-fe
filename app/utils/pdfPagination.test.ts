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

  it("respects page-specific row limits before a row can be clipped by the preview frame", () => {
    const pages = paginatePdfRows({
      items: ["a", "b", "c", "d", "e"],
      mainHeightPx: 500,
      firstHeaderPx: 20,
      continuationHeaderPx: 10,
      tableHeaderPx: 10,
      lastPageReservePx: 0,
      getRowHeightPx: () => 10,
      maxRowsPerPage: ({ isFirstPage }) => (isFirstPage ? 2 : 3),
    });

    expect(pages.map((page) => page.items)).toEqual([
      ["a", "b"],
      ["c", "d", "e"],
    ]);
  });

  it("keeps PDF preview components focused on row measurements", () => {
    const invoicePreview = readFileSync(
      join(root, "app/components/operational/QuotationInvoicePreview.vue"),
      "utf8",
    );
    const jobInvoicePreview = readFileSync(
      join(root, "app/components/operational/JobInvoicePreview.vue"),
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
    expect(jobInvoicePreview).toContain("paginatePdfRows({");
    expect(costDetailPreview).toContain("paginatePdfRows({");
    expect(quotationPreview).toContain("paginatePdfRows({");
    expect(invoicePreview).not.toContain("while (i < items.length)");
    expect(jobInvoicePreview).not.toContain("while (i < items.length)");
    expect(costDetailPreview).not.toContain("while (i < items.length)");
    expect(quotationPreview).not.toContain("while (i < items.length)");
  });

  it("measures job invoice USD rows as two lines only when conversion is shown", () => {
    const jobInvoicePreview = readFileSync(
      join(root, "app/components/operational/JobInvoicePreview.vue"),
      "utf8",
    );

    expect(jobInvoicePreview).toContain(
      'itemCurrency === "USD" && invoiceExchangeRate.value > 1 ? 2 : 1',
    );
  });

  it("lets the job invoice main content use flex height instead of overflowing the A4 page", () => {
    const jobInvoicePreview = readFileSync(
      join(root, "app/components/operational/JobInvoicePreview.vue"),
      "utf8",
    );

    expect(jobInvoicePreview).toContain(
      'class="main-border-container border border-[#062c58] flex-1 min-h-0 flex flex-col text-[0.7rem] relative overflow-hidden"',
    );
  });

  it("uses conservative visual row caps for long job invoices", () => {
    const jobInvoicePreview = readFileSync(
      join(root, "app/components/operational/JobInvoicePreview.vue"),
      "utf8",
    );

    expect(jobInvoicePreview).toContain("JOB_INVOICE_SINGLE_PAGE_MAX_ROWS = 12");
    expect(jobInvoicePreview).toContain("JOB_INVOICE_FIRST_PAGE_MAX_ROWS = 10");
    expect(jobInvoicePreview).toContain("JOB_INVOICE_CONT_PAGE_MAX_ROWS = 21");
    expect(jobInvoicePreview).toContain("maxRowsPerPage:");
  });
});
