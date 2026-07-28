// @ts-ignore
import { describe, expect, it } from "bun:test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function collectVueFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) return collectVueFiles(fullPath);
    return entry.endsWith(".vue") ? [fullPath] : [];
  });
}

describe("page loading skeletons", () => {
  it("uses the shared loading skeleton across major page loading states", () => {
    const files = [
      "app/pages/operational/vessel-tracking/index.vue",
      "app/pages/operational/ebl/index.vue",
      "app/pages/operational/jobs/[id]/edit.vue",
      "app/pages/operational/quotations/[id]/edit.vue",
      "app/pages/finance/report/outstanding.vue",
      "app/pages/finance/chart-of-accounts.vue",
      "app/pages/master/vessel/index.vue",
      "app/pages/master/plane/index.vue",
      "app/pages/settings/activity-logs/index.vue",
    ];

    for (const file of files) {
      const contents = readFileSync(join(root, file), "utf8");
      expect(contents).toContain("UiLoadingSkeleton");
    }
  });

  it("keeps finance dashboard table loading inside the real table shells", () => {
    const files = [
      "app/components/finance/dashboard/AccountsReceivableTab.vue",
      "app/components/finance/dashboard/AssetsTab.vue",
      "app/components/finance/dashboard/BalanceSheetTab.vue",
      "app/components/finance/dashboard/CashFlowTab.vue",
      "app/components/finance/dashboard/FinanceCloseTransactions.vue",
      "app/components/finance/dashboard/TaxReportTab.vue",
      "app/components/finance/dashboard/TransactionTab.vue",
      "app/components/finance/dashboard/TrialBalanceTab.vue",
      "app/pages/finance/chart-of-accounts.vue",
      "app/pages/finance/coa-mapping.vue",
      "app/pages/finance/expenses/index.vue",
      "app/pages/finance/invoice/components/VendorInvoiceSection.vue",
      "app/pages/finance/report/outstanding.vue",
      "app/pages/finance/trial-balance/[accountId].vue",
    ];

    for (const file of files) {
      const contents = readFileSync(join(root, file), "utf8");
      expect(contents).toContain('variant="table-rows"');
      expect(contents).not.toContain('variant="table"');
    }
  });

  it("does not use small absolute or inline loading shells on finance pages", () => {
    const dashboard = readFileSync(join(root, "app/pages/finance/dashboard.vue"), "utf8");
    expect(dashboard).not.toContain("absolute inset-0 bg-white/80");
    expect(dashboard).not.toContain('v-show="isLoading"');
    expect(dashboard).toContain(':is-loading="isLoading"');

    const financeFiles = [
      "app/pages/finance/dashboard.vue",
      "app/pages/finance/invoice/create.vue",
      "app/components/finance/dashboard/OverviewTab.vue",
    ];

    for (const file of financeFiles) {
      const contents = readFileSync(join(root, file), "utf8");
      expect(contents).not.toContain('variant="inline"');
    }
  });

  it("keeps finance table-row skeletons out of tbody and aligned to their headers", () => {
    const files = [
      "app/components/finance/dashboard/AccountsReceivableTab.vue",
      "app/components/finance/dashboard/AssetsTab.vue",
      "app/components/finance/dashboard/FinanceCloseTransactions.vue",
      "app/components/finance/dashboard/TaxReportTab.vue",
      "app/components/finance/dashboard/TransactionTab.vue",
      "app/pages/finance/coa-mapping.vue",
    ];

    for (const file of files) {
      const contents = readFileSync(join(root, file), "utf8");
      expect(contents).not.toMatch(
        /<tbody[^>]*>[\s\S]{0,500}<UiLoadingSkeleton[^>]*variant="table-rows"/,
      );
    }

    const coaMapping = readFileSync(join(root, "app/pages/finance/coa-mapping.vue"), "utf8");
    expect(coaMapping).toContain(
      '<UiLoadingSkeleton v-if="isLoading" variant="table-rows" :columns="4" />',
    );
    expect(coaMapping).toContain(
      '<UiLoadingSkeleton v-if="isLoading" variant="table-rows" :columns="5" />',
    );
  });

  it("keeps table-row skeletons valid across non-finance pages too", () => {
    const files = [
      "app/pages/master/ports/index.vue",
      "app/pages/operational/closing.vue",
      "app/pages/settings/roles/index.vue",
    ];

    for (const file of files) {
      const contents = readFileSync(join(root, file), "utf8");
      expect(contents).not.toMatch(
        /<tbody[^>]*>[\s\S]{0,500}<UiLoadingSkeleton[^>]*variant="table-rows"/,
      );
    }
  });

  it("uses shared skeletons for remaining page-level loading states", () => {
    const quotationIndex = readFileSync(
      join(root, "app/pages/operational/quotations/index.vue"),
      "utf8",
    );
    expect(quotationIndex).toContain(
      '<UiLoadingSkeleton v-if="isLoading" variant="table-rows" :columns="8" />',
    );
    expect(quotationIndex).not.toContain("quotationSkeletonRows");
    expect(quotationIndex).not.toContain("Loading Overlay");

    const closing = readFileSync(join(root, "app/pages/operational/closing.vue"), "utf8");
    expect(closing).toContain('<UiLoadingSkeleton v-if="isLoading" variant="table-rows"');
    expect(closing).toContain('<UiLoadingSkeleton v-if="isLoading" variant="cards" :cards="6" />');
    expect(closing).not.toContain("Memuat data...");

    const dashboard = readFileSync(join(root, "app/pages/dashboard.vue"), "utf8");
    expect(dashboard).toContain('<UiLoadingSkeleton v-if="loading" variant="stats" :cards="4" />');
    expect(dashboard).not.toContain("card-stat p-4 rounded-xl border border-border animate-pulse");

    const trialBalance = readFileSync(
      join(root, "app/pages/finance/trial-balance/[accountId].vue"),
      "utf8",
    );
    expect(trialBalance).toContain('<UiLoadingSkeleton variant="stats" :cards="4" />');
    expect(trialBalance).not.toContain("Loading account details...");
  });

  it("does not gate main non-finance loading skeletons on empty arrays", () => {
    const files = [
      "app/components/operational/JobInvoiceTab.vue",
      "app/components/operational/JobPaymentTab.vue",
      "app/components/operational/JobVendorInvoiceTab.vue",
      "app/pages/master/bank-account/index.vue",
      "app/pages/master/expense-categories/index.vue",
      "app/pages/operational/vessel-tracking/index.vue",
      "app/pages/settings/users/create.vue",
    ];

    for (const file of files) {
      const contents = readFileSync(join(root, file), "utf8");
      expect(contents).not.toMatch(/isLoading && [A-Za-z0-9_.]+\.length === 0/);
      expect(contents).not.toContain('variant="inline"');
    }
  });

  it("uses proper invoice list and grid skeletons on the invoice page", () => {
    const customer = readFileSync(
      join(root, "app/pages/finance/invoice/components/CustomerInvoiceSection.vue"),
      "utf8",
    );
    const vendor = readFileSync(
      join(root, "app/pages/finance/invoice/components/VendorInvoiceSection.vue"),
      "utf8",
    );
    const listView = readFileSync(
      join(root, "app/pages/finance/invoice/components/InvoiceListView.vue"),
      "utf8",
    );

    expect(customer).toContain("v-if=\"loading && viewMode === 'list'\"");
    expect(customer).toContain('variant="table-rows" :columns="9"');
    expect(customer).toContain('v-else-if="loading" variant="cards"');
    expect(customer).not.toContain('v-if="loading" variant="form"');
    expect(customer).toContain('v-if="!loading && !error"');

    expect(vendor).toContain("v-if=\"isPageLoading && viewMode === 'list'\"");
    expect(vendor).toContain('variant="table-rows" :columns="7"');
    expect(vendor).toContain('v-else-if="isPageLoading" variant="cards"');
    expect(customer).not.toContain("await useAsyncData");
    expect(vendor).not.toContain("await useAsyncData");

    expect(listView).toContain('colspan="9"');
  });

  it("does not suspend pages that need immediate loading skeletons", () => {
    const files = [
      "app/pages/finance/invoice/components/CustomerInvoiceSection.vue",
      "app/pages/finance/invoice/components/VendorInvoiceSection.vue",
      "app/pages/master/company/index.vue",
      "app/pages/master/tax/index.vue",
      "app/pages/operational/ebl/index.vue",
    ];

    for (const file of files) {
      const contents = readFileSync(join(root, file), "utf8");
      expect(contents).not.toContain("await useAsyncData");
    }
  });

  it("does not suspend create or edit pages that already have form skeletons", () => {
    const files = [
      "app/pages/finance/invoice/create.vue",
      "app/pages/operational/jobs/create.vue",
      "app/pages/operational/jobs/[id]/edit.vue",
      "app/pages/operational/quotations/create.vue",
      "app/pages/operational/quotations/[id]/edit.vue",
      "app/pages/settings/roles/[id]/edit.vue",
      "app/pages/settings/users/create.vue",
      "app/pages/settings/users/[id]/edit.vue",
    ];

    for (const file of files) {
      const contents = readFileSync(join(root, file), "utf8");
      expect(contents).not.toContain("await useAsyncData");
      expect(contents).toContain("UiLoadingSkeleton");
    }
  });

  it("uses the full job form skeleton on create and edit job pages", () => {
    const files = [
      "app/pages/operational/jobs/create.vue",
      "app/pages/operational/jobs/[id]/edit.vue",
    ];

    for (const file of files) {
      const contents = readFileSync(join(root, file), "utf8");
      expect(contents).toContain('variant="job-form"');
      expect(contents).not.toMatch(/UiLoadingSkeleton[^>]*variant="form"/);
    }
  });

  it("does not suspend page components before their skeletons can render", () => {
    const pageFiles = collectVueFiles(join(root, "app/pages"));

    for (const file of pageFiles) {
      const contents = readFileSync(file, "utf8");
      expect(contents).not.toContain("await useAsyncData");
    }
  });
});
