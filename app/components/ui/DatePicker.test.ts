// @ts-ignore
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("DatePicker", () => {
  it("renders the calendar popup through a body teleport to avoid clipping in scroll containers", () => {
    const component = readFileSync(join(process.cwd(), "app/components/ui/DatePicker.vue"), "utf8");

    expect(component).toContain("useFloating");
    expect(component).toContain('<Teleport to="body">');
    expect(component).toContain("floatingStyles");
  });
});
