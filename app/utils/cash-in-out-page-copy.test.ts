// @ts-ignore
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

describe("cash in/out page summary copy", () => {
  it("labels net movement as cash flow, not an ending balance", () => {
    const contents = readFileSync(join(root, "app/pages/finance/expenses/index.vue"), "utf8");

    expect(contents).toContain('title: "Arus Kas Bersih"');
    expect(contents).toContain('changeLabel: netFlow >= 0 ? "Surplus periode" : "Defisit periode"');
    expect(contents).not.toContain('title: "Saldo Bersih"');
  });

  it("keeps read-only source badges in the type column without wrapping transaction numbers", () => {
    const contents = readFileSync(join(root, "app/pages/finance/expenses/index.vue"), "utf8");
    const numberColumn = contents.slice(
      contents.indexOf('<td class="py-3 px-4 min-w-[180px]">'),
      contents.indexOf('<td class="py-3 px-4 text-sm min-w-[150px]">'),
    );
    const typeColumn = contents.slice(
      contents.indexOf('<td class="py-3 px-4 text-sm min-w-[150px]">'),
      contents.indexOf('<td class="py-3 px-4 text-sm min-w-[360px] max-w-[560px]">'),
    );

    expect(numberColumn).not.toContain("getSourceLabel(expense)");
    expect(typeColumn).toContain("getSourceLabel(expense)");
    expect(typeColumn).toContain("whitespace-nowrap");
  });

  it("uses the read-only payment source label as the category fallback", () => {
    const contents = readFileSync(join(root, "app/pages/finance/expenses/index.vue"), "utf8");

    expect(contents).toContain(
      "return expense.expenseCategory?.name || expense.category?.name || getSourceLabel(expense);",
    );
  });

  it("keeps category badges on one line in the cash in/out table", () => {
    const contents = readFileSync(join(root, "app/pages/finance/expenses/index.vue"), "utf8");

    expect(contents).toContain(
      '<th class="py-3 px-4 text-sm font-medium text-foreground min-w-[140px]">',
    );
    expect(contents).toContain(
      'class="inline-flex whitespace-nowrap px-2 py-0.5 rounded bg-muted text-muted-foreground border text-xs"',
    );
  });
});
