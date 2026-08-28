// @ts-ignore
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("TaxReportTab", () => {
  it("uses the shared DatePicker for tax payment date input", () => {
    const component = readFileSync(
      join(process.cwd(), "app/components/finance/dashboard/TaxReportTab.vue"),
      "utf8",
    );

    expect(component).toContain('import DatePicker from "~/components/ui/DatePicker.vue"');
    expect(component).toContain("<DatePicker");
    expect(component).toContain('v-model="paymentForm.paymentDate"');
    expect(component).toContain("overflow-visible");
    expect(component).not.toContain('width="max-w-md h-[min(680px,90vh)]"');
    expect(component).not.toContain('type="date"');
  });
});
