// @ts-ignore
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const componentPath = resolve(dirname(fileURLToPath(import.meta.url)), "JobEblEditForm.vue");

describe("JobEblEditForm air freight cargo UI", () => {
  it("uses a dedicated air cargo branch without container number, seal, or type inputs", () => {
    const component = readFileSync(componentPath, "utf8");
    const airBranchStart = component.indexOf('v-else-if="isAir"');
    const oceanBranchStart = component.indexOf("<!-- Container / Ocean UI -->");
    const airBranch = component.slice(airBranchStart, oceanBranchStart);

    expect(airBranchStart).toBeGreaterThan(0);
    expect(oceanBranchStart).toBeGreaterThan(airBranchStart);
    expect(airBranch).toContain("Cargo Details");
    expect(airBranch).toContain("container.isHazardous");
    expect(airBranch).not.toContain("container.containerTypeId");
    expect(airBranch).not.toContain("container.containerNumber");
    expect(airBranch).not.toContain("container.sealNumber");
  });
});
