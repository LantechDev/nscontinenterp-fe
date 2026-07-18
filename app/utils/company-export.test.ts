// @ts-ignore
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

describe("company export", () => {
  it("wires PDF and Excel export actions on the company page", () => {
    const page = readFileSync(join(root, "app/pages/master/company/index.vue"), "utf8");

    expect(page).toContain("exportStyledPdf");
    expect(page).toContain("buildStyledWorkbook");
    expect(page).toContain('orientation: "landscape"');
    expect(page).toContain("useExportPopup");
    expect(page).toContain("handleExportPdf");
    expect(page).toContain("handleExportExcel");
    expect(page).toContain("UiExportOptionsModal");
    expect(page).toContain('@export-pdf="handleExportPdf"');
    expect(page).toContain('@export-excel="handleExportExcel"');
  });
});
