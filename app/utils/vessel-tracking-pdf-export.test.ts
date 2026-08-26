// @ts-ignore
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

describe("vessel tracking PDF export", () => {
  it("prints only customer-requested columns without the filter summary", () => {
    const page = readFileSync(
      join(root, "app/pages/operational/vessel-tracking/index.vue"),
      "utf8",
    );

    expect(page).toContain('{ key: "hbl", label: "HBL", width: 25 }');
    expect(page).toContain('{ key: "mbl", label: "MBL", width: 30 }');
    expect(page).toContain('{ key: "container", label: "Container", width: 30 }');
    expect(page).toContain('{ key: "exportReference", label: "Export Ref", width: 32 }');
    expect(page).toContain('{ key: "initialVessel", label: "Initial Vessel", width: 43 }');
    expect(page).toContain('{ key: "currentVessel", label: "Current Vessel", width: 43 }');
    expect(page).toContain('{ key: "status", label: "Status", width: 32 }');
    expect(page).toContain('{ key: "reason", label: "Reason", width: 51 }');
    expect(page).toContain("tracking.exportReference");
    expect(page).not.toContain("doc.text(getFilterSummary().toUpperCase()");
    expect(page).not.toContain('{ key: "shipper", label: "Shipper"');
    expect(page).not.toContain('{ key: "consignee", label: "Consignee"');
    expect(page).not.toContain('{ key: "agent", label: "Agent"');
  });
});
