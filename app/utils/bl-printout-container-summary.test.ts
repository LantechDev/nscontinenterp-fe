// @ts-ignore
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

describe("BL printout cargo details", () => {
  it("renders quantity, description, gross weight, and measurement on each cargo item row", () => {
    const eblFrontPage = readFileSync(
      join(root, "app/components/operational/ebl/JobEblFrontPage.vue"),
      "utf8",
    );
    const bcFrontPage = readFileSync(
      join(root, "app/components/operational/booking-confirmation/JobBcFrontPage.vue"),
      "utf8",
    );

    expect(eblFrontPage).toContain("cargoItemQtyText(item)");
    expect(eblFrontPage).toContain("cargoItemGrossWeightText(item)");
    expect(eblFrontPage).toContain("cargoItemMeasurementText(item)");
    expect(eblFrontPage).toContain('v-if="page.pageIndex === paginatedPagesLength - 1"');
    expect(eblFrontPage).not.toContain("containerQtyNumberText(cnt)");
    expect(eblFrontPage).not.toContain("containerQtyUnitText(cnt)");

    expect(bcFrontPage).toContain("cargoItemQtyText(item)");
    expect(bcFrontPage).toContain("cargoItemGrossWeightText(item)");
    expect(bcFrontPage).toContain("cargoItemMeasurementText(item)");
    expect(bcFrontPage).toContain("totalsValue.grossWeight");
    expect(bcFrontPage).toContain("totalsValue.measurement");
    expect(bcFrontPage).not.toContain("containerQtyNumberText(cnt)");
    expect(bcFrontPage).not.toContain("containerQtyUnitText(cnt)");
  });

  it("uses the cargo package unit in the total quantity strip", () => {
    const eblFrontPage = readFileSync(
      join(root, "app/components/operational/ebl/JobEblFrontPage.vue"),
      "utf8",
    );
    const bcFrontPage = readFileSync(
      join(root, "app/components/operational/booking-confirmation/JobBcFrontPage.vue"),
      "utf8",
    );

    expect(eblFrontPage).toContain("const totalPackageUnit = computed");
    expect(eblFrontPage).toContain(
      "{{ formatNumber(blGrandTotals.qty, 0) }} {{ totalPackageUnit }}",
    );
    expect(eblFrontPage).not.toContain("{{ formatNumber(blGrandTotals.qty, 0) }} PKGS");

    expect(bcFrontPage).toContain("const totalPackageUnit = computed");
    expect(bcFrontPage).toContain("{{ formatNumber(totalsValue.qty, 0) }} {{ totalPackageUnit }}");
    expect(bcFrontPage).not.toContain("{{ formatNumber(totalsValue.qty, 0) }} PKGS");
  });

  it("keeps quantity labels on one line in item rows and total strips", () => {
    const eblFrontPage = readFileSync(
      join(root, "app/components/operational/ebl/JobEblFrontPage.vue"),
      "utf8",
    );
    const bcFrontPage = readFileSync(
      join(root, "app/components/operational/booking-confirmation/JobBcFrontPage.vue"),
      "utf8",
    );

    expect(eblFrontPage).toContain(
      'class="w-[10%] px-1 text-right text-[9px] font-bold leading-tight whitespace-nowrap"',
    );
    expect(eblFrontPage).toContain(
      'class="w-[10%] px-1 py-1 text-right text-[8px] whitespace-nowrap"',
    );

    expect(bcFrontPage).toContain(
      'class="w-[10%] px-1 text-right text-[9px] font-bold leading-tight whitespace-nowrap"',
    );
    expect(bcFrontPage).toContain(
      'class="w-[10%] px-1 py-1 text-right text-[8px] whitespace-nowrap"',
    );
  });

  it("renders weight and measurement units with a space before the unit", () => {
    const eblFrontPage = readFileSync(
      join(root, "app/components/operational/ebl/JobEblFrontPage.vue"),
      "utf8",
    );
    const bcFrontPage = readFileSync(
      join(root, "app/components/operational/booking-confirmation/JobBcFrontPage.vue"),
      "utf8",
    );

    expect(eblFrontPage).not.toContain("}}KGS");
    expect(eblFrontPage).not.toContain("}}CBM");
    expect(bcFrontPage).not.toContain("}}KGS");
    expect(bcFrontPage).not.toContain("}}CBM");
    expect(bcFrontPage).toContain("`${formatNumber(grossWeight)} KGS`");
    expect(bcFrontPage).toContain("`${formatNumber(measurement, 2)} CBM`");
  });

  it("keeps a container header with its first cargo item when paginating", () => {
    const eblPreview = readFileSync(
      join(root, "app/components/operational/ebl/JobEblPreview.vue"),
      "utf8",
    );
    const bcPreview = readFileSync(
      join(root, "app/components/operational/booking-confirmation/JobBcPreview.vue"),
      "utf8",
    );

    expect(eblPreview).toContain("firstItemHeight");
    expect(eblPreview).toContain("currentHeight + headerHeight + firstItemHeight > getMaxHeight()");
    expect(bcPreview).toContain("firstItemHeight");
    expect(bcPreview).toContain("currentHeight + headerHeight + firstItemHeight > getMaxHeight()");
  });

  it("aligns container marks with the first cargo item row", () => {
    const eblFrontPage = readFileSync(
      join(root, "app/components/operational/ebl/JobEblFrontPage.vue"),
      "utf8",
    );
    const bcFrontPage = readFileSync(
      join(root, "app/components/operational/booking-confirmation/JobBcFrontPage.vue"),
      "utf8",
    );

    expect(eblFrontPage).toContain('v-if="cnt.isHeaderVisible && !cnt.isFallback && isAir"');
    expect(eblFrontPage).toContain(
      "iIdx === 0 && cnt.isHeaderVisible && !item.isContinuationSegment",
    );
    expect(bcFrontPage).toContain('v-if="cnt.isHeaderVisible && !cnt.isFallback && isAir"');
    expect(bcFrontPage).toContain(
      "iIdx === 0 && cnt.isHeaderVisible && !item.isContinuationSegment",
    );
  });

  it("renders said-to-contain as the single fallback header instead of S.T.C", () => {
    const eblFrontPage = readFileSync(
      join(root, "app/components/operational/ebl/JobEblFrontPage.vue"),
      "utf8",
    );
    const bcFrontPage = readFileSync(
      join(root, "app/components/operational/booking-confirmation/JobBcFrontPage.vue"),
      "utf8",
    );

    expect(eblFrontPage).not.toContain("S.T.C");
    expect(eblFrontPage).toContain("containerTypeSummary");
    expect(eblFrontPage).toContain("hasSaidToContainInCargo");
    expect(eblFrontPage).toContain("{{ containerTypeSummary }} SAID TO CONTAIN:");
    expect(eblFrontPage).not.toContain("<div>SAID TO CONTAIN:</div>");
    expect(eblFrontPage).not.toContain("SAID TO CONTAIN: {{ containerTypeSummary }}");

    expect(bcFrontPage).not.toContain("S.T.C");
    expect(bcFrontPage).toContain("hasSaidToContainInCargo");
    expect(bcFrontPage).toContain("SAID TO CONTAIN:");
  });

  it("falls back to the document cargo description when cargo item descriptions are blank", () => {
    const eblPreview = readFileSync(
      join(root, "app/components/operational/ebl/JobEblPreview.vue"),
      "utf8",
    );
    const bcPreview = readFileSync(
      join(root, "app/components/operational/booking-confirmation/JobBcPreview.vue"),
      "utf8",
    );

    expect(eblPreview).toContain("cargoDescriptionFallback");
    expect(eblPreview).toContain("props.activeBl?.mainDescription");
    expect(eblPreview).toContain("props.jobData?.commodity");
    expect(bcPreview).toContain("cargoDescriptionFallback");
    expect(bcPreview).toContain("props.bcData?.mainDescription");
    expect(bcPreview).toContain("props.jobData?.commodity");
  });

  it("keeps shipping marks at the top of the cargo block instead of repeating on item rows", () => {
    const eblFrontPage = readFileSync(
      join(root, "app/components/operational/ebl/JobEblFrontPage.vue"),
      "utf8",
    );
    const bcFrontPage = readFileSync(
      join(root, "app/components/operational/booking-confirmation/JobBcFrontPage.vue"),
      "utf8",
    );

    expect(eblFrontPage).toContain("air-shipping-mark");
    expect(eblFrontPage).toContain(
      '{{ page.pageIndex === 0 ? getVal(jobData?.shippingMark) : "" }}',
    );
    expect(eblFrontPage).toContain("air-shipping-mark absolute");
    expect(eblFrontPage).toContain("text-black uppercase");
    expect(eblFrontPage).not.toContain(
      "air-shipping-mark absolute left-0 top-2 z-[2] w-[22%] pl-3 pr-6 font-mono text-[9px] font-bold italic",
    );
    expect(eblFrontPage).not.toContain(
      '{{ page.pageIndex === 0 && cIdx === 0 ? getVal(jobData?.shippingMark) : "" }}',
    );
    expect(eblFrontPage).not.toContain(
      '{{ page.pageIndex === 0 && cIdx === 0 && iIdx === 0 ? jobData?.shippingMark : "" }}',
    );
    expect(bcFrontPage).toContain("air-shipping-mark");
    expect(bcFrontPage).toContain('{{ page.pageIndex === 0 ? shippingMarkDisplay : "" }}');
    expect(bcFrontPage).toContain("air-shipping-mark absolute");
    expect(bcFrontPage).toContain("text-black uppercase");
    expect(bcFrontPage).not.toContain(
      "air-shipping-mark absolute left-0 top-1 z-[2] w-[22%] pl-3 pr-6 font-mono text-[9px] font-bold italic",
    );
    expect(bcFrontPage).not.toContain(
      '{{ page.pageIndex === 0 && cIdx === 0 ? shippingMarkDisplay : "" }}',
    );
    expect(bcFrontPage).not.toContain(
      '{{ page.pageIndex === 0 && cIdx === 0 && iIdx === 0 ? shippingMarkDisplay : "" }}',
    );
    expect(eblFrontPage).not.toContain("'pt-[260px]'");
    expect(bcFrontPage).not.toContain("'pt-[260px]'");
    expect(eblFrontPage).toContain("isAir ? 'mb-0 border-b-0'");
    expect(bcFrontPage).toContain("isAir ? 'mb-0 border-b-0'");
  });

  it("keeps the lower said-to-contain cargo wording while removing package header text", () => {
    const eblPreview = readFileSync(
      join(root, "app/components/operational/ebl/JobEblPreview.vue"),
      "utf8",
    );
    const bcPreview = readFileSync(
      join(root, "app/components/operational/booking-confirmation/JobBcPreview.vue"),
      "utf8",
    );
    const eblFrontPage = readFileSync(
      join(root, "app/components/operational/ebl/JobEblFrontPage.vue"),
      "utf8",
    );
    const bcFrontPage = readFileSync(
      join(root, "app/components/operational/booking-confirmation/JobBcFrontPage.vue"),
      "utf8",
    );

    expect(eblPreview).not.toContain("cleanCargoDescriptionLines");
    expect(bcPreview).not.toContain("cleanCargoDescriptionLines");
    expect(eblFrontPage).not.toContain('{{ item.packageTypeCode || "PKGS" }} OF:');
    expect(bcFrontPage).not.toContain('{{ item.packageTypeCode || "PKGS" }} OF:');
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
