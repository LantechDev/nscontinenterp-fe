// @ts-ignore
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { buildTaxSelectOptions } from "./taxOptions";

const root = process.cwd();

describe("tax select options", () => {
  it("adds a synthetic NON PPN option only when no zero-rate tax exists", () => {
    expect(buildTaxSelectOptions([{ id: "ppn", name: "PPN", rate: 11 }])).toEqual([
      { id: "", name: "NON PPN" },
      { id: "ppn", name: "PPN (11%)" },
    ]);

    expect(
      buildTaxSelectOptions([
        { id: "non-ppn", name: "NON PPN", rate: 0 },
        { id: "ppn", name: "PPN", rate: 11 },
      ]),
    ).toEqual([
      { id: "non-ppn", name: "NON PPN (0%)" },
      { id: "ppn", name: "PPN (11%)" },
    ]);
  });

  it("keeps quotation tax selects on the shared option builder", () => {
    [
      "app/components/operational/QuotationInvoiceForm.vue",
      "app/components/operational/QuotationCostForm.vue",
    ].forEach((file) => {
      const contents = readFileSync(join(root, file), "utf8");

      expect(contents).toContain("buildTaxSelectOptions(");
      expect(contents).not.toContain("hasNonPpnRow");
    });
  });
});
