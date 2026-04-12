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
