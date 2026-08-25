// @ts-ignore
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

describe("dashboard recent jobs route display", () => {
  it("uses the jobs-list route style instead of inline arrow text", () => {
    const recentJobs = readFileSync(join(root, "app/components/dashboard/RecentJobs.vue"), "utf8");

    expect(recentJobs).toContain("ArrowRight");
    expect(recentJobs).toContain('<ArrowRight class="w-3 h-3 shrink-0" />');
    expect(recentJobs).toContain("dashboard-route-cell");
    expect(recentJobs).not.toContain("{{ job.origin }} → {{ job.destination }}");
  });
});
