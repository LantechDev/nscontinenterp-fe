// @ts-ignore
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  getQuotationPortSearchType,
  getQuotationContainerTypeOptions,
  normalizeQuotationServiceMode,
} from "./quotationRouteOptions";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const quotationFormFiles = [
  "app/pages/operational/quotations/create.vue",
  "app/pages/operational/quotations/[id]/edit.vue",
];

describe("quotation route options", () => {
  it("uses airport/IATA search and an AIR/AIR type for air freight quotations", () => {
    expect(getQuotationPortSearchType({ serviceType: "AIR", shipmentType: "" })).toBe("air");
    expect(getQuotationPortSearchType({ serviceType: "OCEAN", shipmentType: "AIR" })).toBe("air");

    expect(
      getQuotationContainerTypeOptions({
        serviceType: "AIR",
        shipmentType: "",
        containerTypes: [{ id: "LCL", code: "LCL", name: "Less than Container Load" }],
      }),
    ).toEqual([{ id: "AIR_AIR", name: "AIR/AIR" }]);
  });

  it("keeps legacy copied air quotations in the visible Air Freight mode", () => {
    expect(normalizeQuotationServiceMode({ serviceType: "AIR", shipmentType: null })).toEqual({
      serviceType: "AIR",
      shipmentType: "AIR",
    });
  });

  it("wires air freight route and type options into quotation forms", () => {
    for (const file of quotationFormFiles) {
      const contents = readFileSync(resolve(root, file), "utf8");

      expect(contents).toContain('{ id: "AIR", name: "AIR FREIGHT" }');
      expect(contents).toContain('v-if="isOceanService || isAir"');
      expect(contents).toContain("`/api/master/ports?type=${portSearchType.value}`");
    }
  });
});
