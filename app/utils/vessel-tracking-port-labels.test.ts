// @ts-ignore
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

describe("vessel tracking port labels", () => {
  it("renders ETD and ETA with their route port names", () => {
    const page = readFileSync(
      join(root, "app/pages/operational/vessel-tracking/index.vue"),
      "utf8",
    );

    expect(page).toContain("getLegPortName");
    expect(page).toContain("etdPortName");
    expect(page).toContain("etaPortName");
    expect(page).toContain("`ETD${etdPort} ${display.etd}`");
    expect(page).toContain("`ETA${etaPort} ${display.eta}`");
    expect(page).toContain("schedule-line");
    expect(page).toContain("schedule-icon");
    expect(page).toContain("list-schedule");
    expect(page).toContain("schedule-port");
    expect(page).toContain("schedule-date");
    expect(page).toContain("delay-badge");
    expect(page).toContain("delay-icon");
    expect(page).toContain('{{ getLegDisplay(tracking, leg, "initial").etdPortName || "-" }}');
    expect(page).toContain('{{ getLegDisplay(tracking, leg, "updated").etaPortName || "-" }}');
  });
});
