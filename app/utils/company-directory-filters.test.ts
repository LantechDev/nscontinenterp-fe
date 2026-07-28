// @ts-ignore
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

describe("company directory filters", () => {
  it("uses company type, country, and city instead of customer/vendor role filters", () => {
    const page = readFileSync(join(root, "app/pages/master/company/index.vue"), "utf8");
    const list = readFileSync(
      join(root, "app/pages/master/company/components/CompanyList.vue"),
      "utf8",
    );

    expect(page).toContain("selectedCategory");
    expect(page).toContain("selectedCountry");
    expect(page).toContain("selectedCity");
    expect(page).toContain("allWhenEmpty");
    expect(page).toContain('source.value = value || "all"');
    expect(page).toContain('v-model="selectedCategoryModel"');
    expect(page).toContain('v-model="selectedCountryModel"');
    expect(page).toContain('v-model="selectedCityModel"');
    expect(page).toContain('placeholder="Type"');
    expect(page).toContain('placeholder="Country"');
    expect(page).toContain('placeholder="City"');
    expect(page).not.toContain("All Roles");
    expect(page).not.toContain("selectedType");

    expect(list).toContain("Type");
    expect(list).toContain("Country");
    expect(list).toContain("City");
    expect(list).not.toContain("Role");
    expect(list).not.toContain("company.type === 'Vendor'");
  });
});
