// @ts-ignore
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();

const unitPriceNumberInputPattern =
  /v-model\.number="item\.unitPrice"[\s\S]{0,180}type="number"[\s\S]{0,180}step="0\.01"|type="number"[\s\S]{0,180}v-model\.number="item\.unitPrice"[\s\S]{0,180}step="0\.01"/;

describe("invoice USD decimal inputs", () => {
  it("allows decimal unit prices in the finance invoice detail editor", () => {
    const detailPage = readFileSync(resolve(root, "app/pages/finance/invoice/[id].vue"), "utf8");

    expect(detailPage).toMatch(unitPriceNumberInputPattern);
  });

  it("allows decimal unit prices in the finance invoice edit modal", () => {
    const editModal = readFileSync(
      resolve(root, "app/pages/finance/invoice/components/InvoiceEditModal.vue"),
      "utf8",
    );

    expect(editModal).toMatch(unitPriceNumberInputPattern);
  });
});
