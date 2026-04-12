// Finance Dashboard Types

export type PeriodType = "day" | "week" | "month" | "year";

export interface StatCardData {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  suffix?: string;
  isPrimary?: boolean;
}

export interface TableColumn {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
}

export interface TableFilter {
  label: string;
  model: string;
  options: { value: string; label: string }[];
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

export interface JobItem {
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

export type JobStatus = "active" | "closed" | "pending";

export const STATUS_CONFIG: Record<JobStatus, { label: string; class: string }> = {
  active: { label: "Active", class: "bg-blue-50 text-blue-700 border-blue-200" },
  closed: { label: "Closed", class: "bg-green-50 text-green-700 border-green-200" },
  pending: { label: "Pending", class: "bg-yellow-50 text-yellow-700 border-yellow-200" },
};

export const TABS = [
  "Overview",
  "Transaction",
  "Assets",
  "Accounts Receivable",
  "Trial Balance",
  "Finance Close",
] as const;

export type TabName = (typeof TABS)[number];

export const TIME_PERIODS: { label: string; value: PeriodType }[] = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
];
