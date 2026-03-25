import { formatRupiah } from "~/lib/utils";

export function useFinanceCharts() {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBase || "";

  // Request tracking
  const requestIdRef = ref(0);

  // Reactive state
  const isLoading = ref(false);
  const chartData = ref<{
    incomeData: number[];
    expenseData: number[];
    marginData: number[];
    months: string[];
    top5: { name: string; value: number }[];
  } | null>(null);

  // Month categories
  const monthCategories = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  /**
   * Fetch chart data from API
   */
  async function fetchChartData(
    period: "day" | "week" | "month" | "year" = "month",
    year?: number,
  ) {
    const requestId = ++requestIdRef.value;

    isLoading.value = true;

    try {
      const queryParams: Record<string, string | number> = { period };
      if (year) {
        queryParams.year = year;
      }

      const data = await $fetch<{
        incomeData: number[];
        expenseData: number[];
        marginData: number[];
        months: string[];
        top5: { name: string; value: number }[];
      }>(`${baseUrl}/finance/dashboard/charts`, {
        method: "GET",
        query: queryParams,
        credentials: "include",
      });

      if (requestId === requestIdRef.value) {
        chartData.value = data;
      }
      return data;
    } catch (error) {
      console.error("Failed to fetch chart data:", error);
      return null;
    } finally {
      if (requestId === requestIdRef.value) {
        isLoading.value = false;
      }
    }
  }

  // Financial Overview Chart (Area)
  const financialChartOptions = computed(() => ({
    chart: {
      type: "area",
      height: 300,
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    colors: ["#012D5A", "#EF4444"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    markers: {
      size: 4,
      colors: ["#fff"],
      strokeColors: ["#012D5A", "#EF4444"],
      strokeWidth: 2,
      hover: { size: 6 },
    },
    xaxis: {
      categories: chartData.value?.months || monthCategories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#64748b", fontSize: "12px" } },
    },
    yaxis: {
      max: (maxValue: number) => Math.ceil(maxValue * 1.2),
      tickAmount: 5,
      labels: {
        style: { colors: "#64748b", fontSize: "12px" },
        formatter: (val: number) => `Rp${val}jt`,
      },
    },
    grid: {
      borderColor: "#e2e8f0",
      strokeDashArray: 4,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
      padding: { top: 0, right: 0, bottom: 0, left: 10 },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      offsetY: -20,
      markers: { radius: 12 },
      itemMargin: { horizontal: 10 },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `Rp ${val}jt`,
      },
    },
  }));

  // Financial Overview Series - uses real data or fallback
  const financialChartSeries = computed(() => [
    {
      name: "Income",
      data: chartData.value?.incomeData || [25, 28, 35, 40, 42, 45, 48, 52, 55, 58, 62, 65],
    },
    {
      name: "Outcome",
      data: chartData.value?.expenseData || [20, 25, 30, 35, 38, 42, 45, 48, 50, 52, 55, 58],
    },
  ]);

  // Margin Trend Chart (Area)
  const marginTrendChartOptions = computed(() => ({
    chart: {
      type: "area",
      height: 280,
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    colors: ["#012D5A"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    markers: {
      size: 4,
      colors: ["#fff"],
      strokeColors: ["#012D5A"],
      strokeWidth: 2,
      hover: { size: 6 },
    },
    xaxis: {
      categories: chartData.value?.months || monthCategories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#64748b", fontSize: "12px" } },
    },
    yaxis: {
      max: 100,
      tickAmount: 5,
      labels: { style: { colors: "#64748b", fontSize: "12px" } },
    },
    grid: {
      borderColor: "#e2e8f0",
      strokeDashArray: 4,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
      padding: { top: 0, right: 0, bottom: 0, left: 10 },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      offsetY: -20,
    },
    tooltip: {
      y: { formatter: (val: number) => `${val}%` },
    },
  }));

  // Margin Trend Series - uses real data or fallback
  const marginTrendChartSeries = computed(() => [
    {
      name: "Margin",
      data: chartData.value?.marginData || [25, 28, 32, 35, 38, 40, 42, 45, 48, 50, 52, 55],
    },
  ]);

  // Top 5 Chart (Donut)
  const top5ChartOptions = computed(() => ({
    chart: {
      type: "donut",
      height: 220,
      fontFamily: "inherit",
    },
    colors: ["#1e3a8a", "#38bdf8", "#3b82f6", "#60a5fa", "#2563eb"],
    labels:
      chartData.value?.top5 && chartData.value.top5.length > 0
        ? chartData.value.top5.map((t) => t.name)
        : ["Lorem Ipsum", "Dolor Sit", "Amet Consect", "Elit Sed", "Tempor Inc"],
    dataLabels: { enabled: false },
    legend: { show: false },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            value: {
              show: true,
              fontSize: "11px",
              fontWeight: 500,
              color: "#1e293b",
              formatter: (val: number) => formatRupiah(val),
            },
            total: {
              show: true,
              label: "Total",
              fontSize: "12px",
              color: "#64748b",
              formatter: (w: { globals: { series: number[] } }) => {
                const total = w.globals.series.reduce((a: number, b: number) => a + b, 0);
                return formatRupiah(total);
              },
            },
          },
        },
      },
    },
    stroke: { width: 0 },
    tooltip: {
      y: { formatter: (val: number) => formatRupiah(val) },
    },
  }));

  // Top 5 Series - uses real data or fallback
  const top5ChartSeries = computed(() => {
    const data = chartData.value?.top5;
    return data && data.length > 0 ? data.map((t) => t.value) : [40, 30, 22, 10, 8];
  });

  return {
    // State
    isLoading,
    chartData,

    // Methods
    fetchChartData,

    // Chart config
    financialChartOptions,
    financialChartSeries,
    marginTrendChartOptions,
    marginTrendChartSeries,
    top5ChartOptions,
    top5ChartSeries,
  };
}
