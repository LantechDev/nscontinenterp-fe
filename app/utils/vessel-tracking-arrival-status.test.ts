// @ts-ignore
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

describe("vessel tracking arrival status", () => {
  it("separates arrived and not-arrived tracking from final ETA", () => {
    const page = readFileSync(
      join(root, "app/pages/operational/vessel-tracking/index.vue"),
      "utf8",
    );

    expect(page).toContain("arrivalFilter");
    expect(page).toContain("arrivalFilterOptions");
    expect(page).toContain("getTrackingArrivalDate");
    expect(page).toContain("getArrivalStatus");
    expect(page).toContain("Sudah sampai");
    expect(page).toContain("Belum sampai");
    expect(page).toContain('arrivalFilter.value === "arrived"');
    expect(page).toContain('arrivalFilter.value === "not_arrived"');
  });
});
