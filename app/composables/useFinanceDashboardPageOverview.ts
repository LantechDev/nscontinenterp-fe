import type { StatCardData } from "~/types/finance";

/**
 * Finance Dashboard Page Overview Composable
 * Provides computed stats and handlers for the Overview tab
 */
export function useFinanceDashboardPageOverview() {
  const { overviewStats, fetchOverviewStats } = useFinanceDashboard();
  const charts = useFinanceCharts();

  // Overview Stats computed from API
  const overviewStatsCards = computed<StatCardData[]>(() => {
    if (!overviewStats.value) {
      return [
        {
          title: "Total Income",
          value: "Rp0",
          change: 0,
          changeLabel: "vs Last Period",
          isPrimary: true,
        },
        { title: "Total Outcome", value: "Rp0", change: 0, changeLabel: "vs Last Period" },
        { title: "Net Profit", value: "Rp0", change: 0, changeLabel: "vs Last Period" },
        {
          title: "Piutang Tagihan",
          value: "Rp0",
          change: 0,
          changeLabel: "vs Last Period",
          variant: "warning",
        },
        {
          title: "Hutang Vendor",
          value: "Rp0",
          change: 0,
          changeLabel: "vs Last Period",
          variant: "success",
        },
        { title: "Margins", value: "0%", changeLabel: "From income", suffix: "%" },
      ];
    }
    const o = overviewStats.value;
    return [
      {
        title: "Total Income",
        value: o.totalIncomeFormatted || "Rp0",
        change: o.incomeGrowth,
        changeLabel: "vs Last Period",
        isPrimary: true,
      },
      {
        title: "Total Outcome",
        value: o.totalOutcomeFormatted || "Rp0",
        change: o.outcomeGrowth,
        changeLabel: "vs Last Period",
      },
      {
        title: "Net Profit",
        value: o.netProfitFormatted || "Rp0",
        change: o.incomeGrowth,
        changeLabel: "vs Last Period",
      },
      {
        title: "Piutang Tagihan",
        value: o.totalReceivablesFormatted || "Rp0",
        change: o.receivablesGrowth,
        changeLabel: "vs Last Period",
        variant: "warning",
      },
      {
        title: "Hutang Vendor",
        value: o.totalPayablesFormatted || "Rp0",
        change: o.payablesGrowth,
        changeLabel: "vs Last Period",
        variant: "success",
      },
      {
        title: "Margins",
        value: `${o.margins || 0}%`,
        changeLabel: "From income",
        suffix: "%",
      },
    ];
  });

  // Fetch overview data
  async function fetchOverview(period: "day" | "week" | "month" | "year", year?: number) {
    await Promise.all([fetchOverviewStats(period, year), charts.fetchChartData(period, year)]);
  }

  return {
    overviewStats,
    overviewStatsCards,
    chartData: charts.chartData,
    financialChartOptions: charts.financialChartOptions,
    financialChartSeries: charts.financialChartSeries,
    marginTrendChartOptions: charts.marginTrendChartOptions,
    marginTrendChartSeries: charts.marginTrendChartSeries,
    top5ChartOptions: charts.top5ChartOptions,
    top5ChartSeries: charts.top5ChartSeries,
    fetchOverview,
  };
}
