// @ts-ignore
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const modalPath = resolve(root, "app/pages/finance/expenses/components/ExpenseEditModal.vue");

describe("expense edit modal", () => {
  it("shows the expense category field for cash-in/out forms without jobs", () => {
    const contents = readFileSync(modalPath, "utf8");

    expect(contents).toContain(
      `v-if="(hideJob || formData.direction === 'IN') && !useManualAccount"`,
    );
    expect(contents).not.toContain(
      `v-if="!hideJob && formData.direction !== 'IN' && !useManualAccount"`,
    );
  });
});
