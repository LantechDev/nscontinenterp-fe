// @ts-ignore
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

describe("jobs index loading skeleton", () => {
  it("uses skeleton layouts for list and grid loading states", () => {
    const page = readFileSync(join(root, "app/pages/operational/jobs/index.vue"), "utf8");
    const skeleton = readFileSync(join(root, "app/components/ui/LoadingSkeleton.vue"), "utf8");

    expect(page).toContain("v-if=\"isLoading && viewMode === 'list'\"");
    expect(page).toContain('<UiLoadingSkeleton variant="table-rows" :columns="7" />');
    expect(page).toContain('<UiLoadingSkeleton v-else-if="isLoading" variant="cards" />');
    expect(page).toContain('v-else-if="isLoading"');
    expect(skeleton).toContain(
      'variant?: "table" | "table-rows" | "cards" | "stats" | "form" | "job-form" | "inline"',
    );
    expect(skeleton).toContain("animate-pulse");
    expect(page).not.toContain("Loading jobs...");
  });
});
