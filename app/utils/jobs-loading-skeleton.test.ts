// @ts-ignore
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

describe("jobs index loading skeleton", () => {
  it("uses skeleton layouts for list and grid loading states", () => {
    const page = readFileSync(join(root, "app/pages/operational/jobs/index.vue"), "utf8");

    expect(page).toContain("const jobSkeletonRows = Array.from({ length: 6 }");
    expect(page).toContain("const jobSkeletonCards = Array.from({ length: 6 }");
    expect(page).toContain("v-if=\"isLoading && viewMode === 'list'\"");
    expect(page).toContain('v-else-if="isLoading"');
    expect(page).toContain("animate-pulse");
    expect(page).not.toContain("Loading jobs...");
  });
});
