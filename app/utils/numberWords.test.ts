// @ts-ignore
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { formatAmountInWords, numberToEnglishWords, numberToIndonesianWords } from "./numberWords";

const root = process.cwd();

describe("number words", () => {
  it("formats Indonesian and English amount words used by quotation invoice PDFs", () => {
    expect(numberToIndonesianWords(1234567)).toBe(
      "Satu Juta Dua Ratus Tiga Puluh Empat Ribu Lima Ratus Enam Puluh Tujuh",
    );
    expect(numberToEnglishWords(1234567)).toBe(
      "One Million Two Hundred Thirty Four Thousand Five Hundred Sixty Seven",
    );
    expect(formatAmountInWords(1200, "IDR")).toBe(
      "Seribu Dua Ratus Rupiah / One Thousand Two Hundred Rupiahs",
    );
    expect(formatAmountInWords(2500, "USD")).toBe("Two Thousand Five Hundred Dollars");
    expect(formatAmountInWords(0, "IDR")).toBe("");
  });

  it("keeps quotation invoice preview focused on rendering instead of spelling numbers", () => {
    const preview = readFileSync(
      join(root, "app/components/operational/QuotationInvoicePreview.vue"),
      "utf8",
    );
    const quotationPreview = readFileSync(
      join(root, "app/components/operational/QuotationPreview.vue"),
      "utf8",
    );

    expect(preview).toContain("formatAmountInWords(");
    expect(preview).not.toContain("const terbilang =");
    expect(preview).not.toContain("const numberToEnglish =");
    expect(quotationPreview).toContain("numberToIndonesianWords(");
    expect(quotationPreview).toContain("numberToEnglishWords(");
    expect(quotationPreview).not.toContain("const terbilang =");
    expect(quotationPreview).not.toContain("const numberToEnglish =");
  });
});
