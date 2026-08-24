// @ts-ignore
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

describe("BL printout container summaries", () => {
  it("keeps quantity, gross weight, and measurement totals at container level", () => {
    const eblFrontPage = readFileSync(
      join(root, "app/components/operational/ebl/JobEblFrontPage.vue"),
      "utf8",
    );
    const bcFrontPage = readFileSync(
      join(root, "app/components/operational/booking-confirmation/JobBcFrontPage.vue"),
      "utf8",
    );

    expect(eblFrontPage).toContain("pluralPackageUnit");
    expect(eblFrontPage).toContain("containerQtyNumberText(cnt)");
    expect(eblFrontPage).toContain("containerQtyUnitText(cnt)");
    expect(eblFrontPage).not.toContain("figureText(item.grossWeight");
    expect(eblFrontPage).not.toContain("figureText(item.measurementCbm");

    expect(bcFrontPage).toContain("pluralPackageUnit");
    expect(bcFrontPage).toContain("containerQtyNumberText(cnt)");
    expect(bcFrontPage).toContain("containerQtyUnitText(cnt)");
    expect(bcFrontPage).not.toContain("formatNumber(item.grossWeight");
    expect(bcFrontPage).not.toContain("formatNumber(item.measurementCbm");
  });
});
