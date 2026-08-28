// @ts-ignore
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

describe("finance transaction cash-basis cards", () => {
  it("labels the transaction summary as cash flow instead of accrual profit and loss", () => {
    const contents = readFileSync(
      join(root, "app/composables/useFinanceDashboardPageTransactions.ts"),
      "utf8",
    );

    expect(contents).toContain('title: "Net Cash Flow"');
    expect(contents).toContain('subtitle: "Formula: Cash In - Cash Out"');
    expect(contents).toContain('title: "Cash Movement Volume"');
    expect(contents).toContain('subtitle: "Formula: Cash In + Cash Out"');
    expect(contents).not.toContain('title: "Gross Profit"');
    expect(contents).not.toContain('title: "P&L Volume"');
  });
});
