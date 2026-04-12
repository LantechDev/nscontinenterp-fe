/**
 * Finance Dashboard Composable
 *
 * This is the main entry point that re-exports all finance dashboard functionality
 * from modular sub-composables. This maintains backward compatibility while allowing
 * for better code organization.
 */

import { useFinanceDashboardApi } from "./useFinanceDashboardApi";
import { useFinanceDashboardOverview } from "./useFinanceDashboardOverview";
import { useFinanceDashboardCogs } from "./useFinanceDashboardCogs";
import { useFinanceDashboardTransactions } from "./useFinanceDashboardTransactions";
import { useFinanceDashboardFinanceClose } from "./useFinanceDashboardFinanceClose";
import { useFinanceDashboardArAp } from "./useFinanceDashboardArAp";

/**
 * Finance Dashboard Composable
 * Provides functions to fetch finance dashboard data from the API
 */
export function useFinanceDashboard() {
  // API utilities
  const api = useFinanceDashboardApi();

  // Sub-composables
  const overview = useFinanceDashboardOverview();
  const cogs = useFinanceDashboardCogs();
  const transactions = useFinanceDashboardTransactions();
  const financeClose = useFinanceDashboardFinanceClose();
  const arAp = useFinanceDashboardArAp();

  /**
   * Fetch all dashboard data
   */
  async function fetchAll(
    period: "day" | "week" | "month" | "year" = "month",
    filters?: Record<string, string | number>,
  ): Promise<void> {
    api.setLoading(true);
    api.clearError("stats", 0);

    const year = filters?.year as number | undefined;

    try {
      await Promise.all([
        overview.fetchStats(period, year),
        overview.fetchOverviewStats(period, year),
        cogs.fetchJobCosts(period, filters),
        transactions.fetchTransactions(period, 1, 10, filters),
      ]);
    } finally {
      api.setLoading(false);
    }
  }

  // Combine all state and methods
  return {
    // Shared state
    isLoading: api.isLoading,
    error: api.error,

    // Overview data
    stats: overview.stats,
    overviewStats: overview.overviewStats,
    chartData: overview.chartData,
    fetchStats: overview.fetchStats,
    fetchOverviewStats: overview.fetchOverviewStats,
    fetchChartData: overview.fetchChartData,

    // COGS data
    jobCosts: cogs.jobCosts,
    pagination: cogs.pagination, // Default/Legacy
    cogsPagination: cogs.pagination,
    fetchJobCosts: cogs.fetchJobCosts,

    // Transactions data
    transactions: transactions.transactions,
    transactionStats: transactions.transactionStats,
    transactionPagination: transactions.pagination,
    fetchTransactions: transactions.fetchTransactions,
    fetchTransactionStats: transactions.fetchTransactionStats,
    createManualTransaction: transactions.createManualTransaction,
    updateManualTransaction: transactions.updateManualTransaction,
    deleteManualTransaction: transactions.deleteManualTransaction,

    // Finance Close data
    financeCloseStats: financeClose.financeCloseStats,
    closedPeriods: financeClose.closedPeriods,
    fetchFinanceCloseStats: financeClose.fetchFinanceCloseStats,
    fetchClosedPeriods: financeClose.fetchClosedPeriods,
    closePeriod: financeClose.closePeriod,
    reopenPeriod: financeClose.reopenPeriod,

    // AR/AP data
    arApItems: arAp.arApItems,
    arApStats: arAp.arApStats,
    arApPagination: arAp.pagination,
    fetchArApItems: arAp.fetchArApItems,
    fetchArApStats: arAp.fetchArApStats,

    // Combined fetch
    fetchAll,
  };
}
