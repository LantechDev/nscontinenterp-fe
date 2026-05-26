// Finance Dashboard Types

import { getErrorMessage as getError } from "../lib/utils";
export const getErrorMessage = getError;

export interface FinanceDashboardStats {
  totalIncome: number;
  totalOutcome: number;
  netProfit: number;
  transactionCount: number;
  totalCogsFormatted?: string;
  costGrowth?: number;
  averageCostPerJobFormatted?: string;
  highestJob?: {
    jobNumber: string;
    cogsFormatted: string;
  };
}

export interface OverviewStats {
  totalIncome: number;
  totalOutcome: number;
  netProfit: number;
  profitMargin: number;
  totalIncomeFormatted?: string;
  totalOutcomeFormatted?: string;
  netProfitFormatted?: string;
  incomeGrowth?: number;
  outcomeGrowth?: number;
  margins?: number;
  totalReceivables?: number;
  totalReceivablesFormatted?: string;
  receivablesGrowth?: number;
  totalPayables?: number;
  totalPayablesFormatted?: string;
  payablesGrowth?: number;
}

export interface ChartData {
  labels: string[];
  income: number[];
  outcome: number[];
}

export interface JobCostItem {
  id: string;
  jobNumber: string;
  polPod: string;
  customer: string;
  revenue: number;
  cogs: number;
  profit: number;
  margin: number;
  status: "active" | "closed" | "pending";
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface JobCostBreakdownResponse {
  items: JobCostItem[];
  pagination: PaginationInfo;
}

export interface TransactionItem {
  id: string;
  jobNumber: string;
  date: string;
  customer: string;
  type: string;
  total: number;
  isIncome: boolean;
  paymentMethod?: string;
  // Reference info for identifying auto-created transactions
  referenceType?: string | null;
  referenceId?: string | null;
  currency?: string;
  exchangeRate?: number;
  originalTotal?: number;
}

export interface TransactionStats {
  totalIncome: number;
  totalOutcome: number;
  transactionCount: number;
  totalJournal?: number;
  todayTransactions?: number;
}

export interface TransactionsResponse {
  items: TransactionItem[];
  pagination: PaginationInfo;
  stats: TransactionStats;
}

export interface FinanceCloseStats {
  id?: string;
  period: string;
  status: "Open" | "Closed";
  description: string;
  revenue: string;
  cogs: string;
  nettPL: string;
  readinessScore: number;
  periodStart?: string;
  periodEnd?: string;
}

export interface FinanceClosePeriod {
  id: string;
  period: string;
  status: "Open" | "Closed";
  description: string;
  revenue: string;
  cogs: string;
  nettPL: string;
  readinessScore: number;
  periodStart?: string;
  periodEnd?: string;
  closedAt?: string;
}

// Trial Balance Types
export interface TrialBalanceItem {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: string;
  openingBalance: number;
  debitTotal: number;
  creditTotal: number;
  closingBalance: number;
}

export interface TrialBalanceGroup {
  type: string;
  items: TrialBalanceItem[];
  totalDebit: number;
  totalCredit: number;
}

export interface TrialBalanceAccountDetail {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: string;
  openingBalance: number;
  debitTotal: number;
  creditTotal: number;
  closingBalance: number;
  journalEntries: JournalEntryDetail[];
}

export interface JournalEntryDetail {
  id: string;
  journalId: string;
  journalDate: string;
  description: string;
  referenceType: string | null;
  referenceId: string | null;
  debit: number;
  credit: number;
  runningBalance: number;
}

export interface BalanceSheetAccount {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: string;
  balance: number;
}

export interface BalanceSheetGroup {
  type: "ASSET" | "LIABILITY" | "EQUITY";
  label: string;
  items: BalanceSheetAccount[];
  total: number;
}

export interface BalanceSheetReport {
  asOfDate: string;
  assets: BalanceSheetGroup;
  liabilities: BalanceSheetGroup;
  equity: BalanceSheetGroup;
  totals: {
    totalAssets: number;
    totalLiabilities: number;
    totalEquity: number;
    totalLiabilitiesAndEquity: number;
  };
  balanceDifference: number;
  isBalanced: boolean;
}

export type CashFlowActivity = "OPERATING" | "INVESTING" | "FINANCING";

export interface CashFlowBreakdownItem {
  accountId: string;
  accountCode: string;
  accountName: string;
  activity: CashFlowActivity;
  cashIn: number;
  cashOut: number;
  netCashFlow: number;
}

export interface CashFlowActivityGroup {
  activity: CashFlowActivity;
  label: string;
  cashIn: number;
  cashOut: number;
  netCashFlow: number;
  items: CashFlowBreakdownItem[];
}

export interface CashFlowUnclassifiedItem {
  accountId: string;
  accountCode: string;
  accountName: string;
  amount: number;
}

export interface CashFlowReport {
  startDate: string;
  endDate: string;
  method: "direct";
  openingCashBalance: number;
  cashIn: number;
  cashOut: number;
  operatingCashFlow: number;
  investingCashFlow: number;
  financingCashFlow: number;
  netCashFlow: number;
  closingCashBalance: number;
  groups: {
    operating: CashFlowActivityGroup;
    investing: CashFlowActivityGroup;
    financing: CashFlowActivityGroup;
  };
  unclassified: {
    count: number;
    items: CashFlowUnclassifiedItem[];
  };
}
