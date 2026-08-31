// @ts-ignore
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

function readAppFile(path: string) {
  return readFileSync(resolve(root, path), "utf8");
}

describe("company address quick add", () => {
  it("exposes add address from shared job party rows", () => {
    const row = readAppFile("app/pages/operational/jobs/components/JobPartyRow.vue");

    expect(row).toContain('(e: "add-address", companyId: string): void');
    expect(row).toContain("Add Address");
    expect(row).toContain("emit('add-address', companyId)");
  });

  it("uses the address modal in master company with add and edit modes", () => {
    const source = readAppFile("app/pages/master/company/components/CompanyDetailModal.vue");

    expect(source).toContain("CompanyAddressModal");
    expect(source).toContain(':mode="addressMode"');
    expect(source).toContain("openAddAddressModeIfAllowed");
    expect(source).toContain("openEditAddressModeIfAllowed");
  });

  it("allows multiple addresses from the company create/edit modal", () => {
    const source = readAppFile("app/pages/master/company/components/CompanyCreateModal.vue");

    expect(source).toContain("CompanyAddressModal");
    expect(source).toContain("companyAddresses");
    expect(source).toContain("openAddAddress");
    expect(source).toContain("openEditAddress");
    expect(source).toContain("createAddress(props.company.id");
    expect(source).toContain("updateAddress(props.company.id");
  });

  it("stores and displays address country names instead of short codes", () => {
    const form = readAppFile("app/pages/master/company/components/CompanyAddressForm.vue");
    const row = readAppFile("app/pages/operational/jobs/components/JobPartyRow.vue");

    expect(form).toContain('{ id: "INDONESIA", name: "Indonesia" }');
    expect(form).toContain("normalizeCountryValue");
    expect(row).toContain("formatCountry(addressDetails.country)");
  });

  it("uses add address modal in job create, job edit, and eBL edit", () => {
    const files = [
      "app/pages/operational/jobs/create.vue",
      "app/pages/operational/jobs/[id]/edit.vue",
      "app/components/operational/ebl/JobEblEditForm.vue",
    ];

    for (const file of files) {
      const source = readAppFile(file);
      expect(source).toContain("CompanyAddressModal");
      expect(source).toContain('mode="add"');
    }
  });

  it("selects the newly created address after saving from operational forms", () => {
    for (const file of [
      "app/pages/operational/jobs/create.vue",
      "app/pages/operational/jobs/[id]/edit.vue",
      "app/components/operational/ebl/JobEblEditForm.vue",
    ]) {
      const source = readAppFile(file);
      expect(source).toContain("createAddress(activeAddressCompanyId.value");
      expect(source).toContain("activeAddressField");
      expect(source).toContain("result.data.id");
    }
  });
});
