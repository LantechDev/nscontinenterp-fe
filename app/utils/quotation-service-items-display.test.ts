// @ts-ignore
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

describe("quotation service items display", () => {
  it("does not show IDR zero as the primary amount for full USD service items", () => {
    const detail = readFileSync(
      join(root, "app/components/operational/QuotationDetailSlideOver.vue"),
      "utf8",
    );

    expect(detail).toContain("const itemsTotalDisplay = computed");
    expect(detail).toContain("totals.hasUsd && !hasIdr");
    expect(detail).toContain('primaryCurrency: "USD"');
    expect(detail).toContain("itemsTotalDisplay.primaryAmount");
    expect(detail).not.toContain('formatCurrency(itemsTotalRevenue.idrTotal, "IDR")');
  });

  it("keeps full USD quotations as USD in the quotation index table", () => {
    const page = readFileSync(join(root, "app/pages/operational/quotations/index.vue"), "utf8");

    expect(page).toContain("const isFullUsd = billableCharges.length > 0 && !hasIdrCharge");
    expect(page).toContain('currency === "USD" && !isFullUsd');
    expect(page).toContain("q.charges.filter((ch) => !ch.atCost)");
  });
});
