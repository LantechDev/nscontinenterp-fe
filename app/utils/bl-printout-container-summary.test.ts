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

  it("keeps booking confirmation air shipping marks aligned with cargo item details", () => {
    const bcFrontPage = readFileSync(
      join(root, "app/components/operational/booking-confirmation/JobBcFrontPage.vue"),
      "utf8",
    );

    expect(bcFrontPage).not.toContain(
      '{{ page.pageIndex === 0 && cIdx === 0 ? shippingMarkDisplay : "" }}',
    );
    expect(bcFrontPage).toContain(
      '{{ page.pageIndex === 0 && cIdx === 0 && iIdx === 0 ? shippingMarkDisplay : "" }}',
    );
  });

  it("uses IATA codes for booking confirmation air receipt and delivery places", () => {
    const bcFrontPage = readFileSync(
      join(root, "app/components/operational/booking-confirmation/JobBcFrontPage.vue"),
      "utf8",
    );

    expect(bcFrontPage).toContain("props.isAir");
    expect(bcFrontPage).toContain("? polDisplay.value");
    expect(bcFrontPage).toContain("? podDisplay.value");
  });

  it("uses IATA codes for eBL air receipt and delivery places", () => {
    const eblFrontPage = readFileSync(
      join(root, "app/components/operational/ebl/JobEblFrontPage.vue"),
      "utf8",
    );

    expect(eblFrontPage).toContain("props.isAir");
    expect(eblFrontPage).toContain("? polDisplay.value");
    expect(eblFrontPage).toContain("? podDisplay.value");
  });
});
