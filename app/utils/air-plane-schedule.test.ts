// @ts-ignore
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const formFiles = [
  "app/pages/operational/jobs/create.vue",
  "app/pages/operational/jobs/[id]/edit.vue",
  "app/components/operational/booking-confirmation/JobBcEditForm.vue",
  "app/components/operational/ebl/JobEblEditForm.vue",
];

const masterPlaneFiles = [
  "app/pages/master/plane/components/PlaneFormModal.vue",
  "app/pages/master/plane/components/PlaneTable.vue",
  "app/components/operational/PlaneQuickAddModal.vue",
];

describe("air shipment plane schedule rows", () => {
  it("keeps AIR plane codes in the plane column without a separate Plane No input", () => {
    for (const file of formFiles) {
      const source = readFileSync(resolve(process.cwd(), file), "utf8");
      const planeNoIndex = source.indexOf("Plane No");

      expect(planeNoIndex, `${file} should not render a Plane No label`).toBe(-1);
      expect(source, `${file} should still keep ocean voyage number support`).toContain(
        "Voyage No",
      );
    }
  });

  it("keeps plane master entry focused on the plane name without a separate code field", () => {
    for (const file of masterPlaneFiles) {
      const source = readFileSync(resolve(process.cwd(), file), "utf8");

      expect(source, `${file} should not render a separate Plane Code field`).not.toContain(
        "Plane Code",
      );
    }
  });
});
