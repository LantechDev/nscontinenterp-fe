export interface InvoiceAnalysisSummary {
  totalAmount: number;
  netAmount?: number;
  totalPaid: number;
  totalOutstanding: number;
  count: number;
}

export type InvoiceAnalysisTone = "receivable" | "payable" | "paid" | "profit" | "warning";

export interface InvoiceAnalysisCard {
  label: string;
  value: number;
  caption: string;
  tone: InvoiceAnalysisTone;
}

const emptySummary: InvoiceAnalysisSummary = {
  totalAmount: 0,
  totalPaid: 0,
  totalOutstanding: 0,
  count: 0,
};

export function normalizeInvoiceAnalysisSummary(
  summary?: Partial<InvoiceAnalysisSummary> | null,
): InvoiceAnalysisSummary {
  return {
    totalAmount: Number(summary?.totalAmount || 0),
    netAmount: Number(summary?.netAmount ?? summary?.totalAmount ?? 0),
    totalPaid: Number(summary?.totalPaid || 0),
    totalOutstanding: Number(summary?.totalOutstanding || 0),
    count: Number(summary?.count || 0),
  };
}

export function isInvoiceAnalysisReady(params: {
  receivable?: Partial<InvoiceAnalysisSummary> | null;
  payable?: Partial<InvoiceAnalysisSummary> | null;
}) {
  return (
    params.receivable !== null &&
    params.receivable !== undefined &&
    params.payable !== null &&
    params.payable !== undefined
  );
}

export function calculateInvoiceProfit(
  receivable?: Partial<InvoiceAnalysisSummary> | null,
  payable?: Partial<InvoiceAnalysisSummary> | null,
) {
  const ar = normalizeInvoiceAnalysisSummary(receivable || emptySummary);
  const ap = normalizeInvoiceAnalysisSummary(payable || emptySummary);
  return ar.netAmount! - ap.netAmount!;
}

export function buildInvoiceAnalysisCards(params: {
  receivable?: Partial<InvoiceAnalysisSummary> | null;
  payable?: Partial<InvoiceAnalysisSummary> | null;
}): InvoiceAnalysisCard[] {
  const receivable = normalizeInvoiceAnalysisSummary(params.receivable || emptySummary);
  const payable = normalizeInvoiceAnalysisSummary(params.payable || emptySummary);
  const profit = calculateInvoiceProfit(receivable, payable);

  return [
    {
      label: "Total A/R",
      value: receivable.totalAmount,
      caption: `${receivable.count} invoice customer`,
      tone: "receivable",
    },
    {
      label: "A/R Unpaid",
      value: receivable.totalOutstanding,
      caption: "Belum dibayar customer",
      tone: "warning",
    },
    {
      label: "A/R Paid",
      value: receivable.totalPaid,
      caption: "Sudah dibayar customer",
      tone: "paid",
    },
    {
      label: "Total A/P",
      value: payable.totalAmount,
      caption: `${payable.count} invoice vendor`,
      tone: "payable",
    },
    {
      label: "A/P Unpaid",
      value: payable.totalOutstanding,
      caption: "Belum dibayar ke vendor",
      tone: "warning",
    },
    {
      label: "A/P Paid",
      value: payable.totalPaid,
      caption: "Sudah dibayar ke vendor",
      tone: "paid",
    },
    {
      label: "Total Profit",
      value: profit,
      caption: "Net before tax: A/R dikurangi A/P",
      tone: "profit",
    },
  ];
}
