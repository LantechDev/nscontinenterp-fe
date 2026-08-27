// @ts-ignore
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const pagePath = resolve(dirname(fileURLToPath(import.meta.url)), "create.vue");

describe("create job air freight cargo UI", () => {
  it("uses a dedicated air cargo branch without container number, seal, or type inputs", () => {
    const page = readFileSync(pagePath, "utf8");
    const airBranchStart = page.indexOf('v-else-if="isAirFreightMode(formData)"');
    const oceanBranchStart = page.indexOf("<!-- Sea/Standard Freight Specific UI -->");
    const airBranch = page.slice(airBranchStart, oceanBranchStart);

    expect(airBranchStart).toBeGreaterThan(0);
    expect(oceanBranchStart).toBeGreaterThan(airBranchStart);
    expect(airBranch).toContain("Cargo Details");
    expect(airBranch).toContain("container.isHazardous");
    expect(airBranch).not.toContain("container.containerTypeId");
    expect(airBranch).not.toContain("container.containerNumber");
    expect(airBranch).not.toContain("container.sealNumber");
  });
});
