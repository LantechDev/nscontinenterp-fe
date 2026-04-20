import {
  _ as __nuxt_component_1$1,
  a as useRouter,
  e as useRoute,
  u as useRuntimeConfig,
} from "./server.mjs";
import { defineComponent, ref, computed, watch, mergeProps, unref, useSSRContext } from "vue";
import {
  ssrRenderAttrs,
  ssrRenderList,
  ssrRenderClass,
  ssrInterpolate,
  ssrRenderComponent,
} from "vue/server-renderer";
import { jsPDF } from "jspdf";
import { f as formatRupiah, c as cn, g as getErrorMessage$1 } from "./utils-C_kyg7_s.mjs";
import { t as toast } from "./index-DJGQOf1Z.mjs";
import { u as useConfirm } from "./useConfirm-iFV_8p0v.mjs";
import { u as useCompanies } from "./useCompanies-D5TCq9CR.mjs";
import { u as useServices } from "./useServices-DFtvjO_i.mjs";
import "../nitro/nitro.mjs";
import "node:http";
import "node:https";
import "node:events";
import "node:buffer";
import "node:fs";
import "node:path";
import "node:crypto";
import "node:url";
import "ipx";
import "vue-router";
import "clsx";
import "tailwind-merge";

const activeTab = ref("Overview");
const selectedPeriod = ref("month");
const currentPage = ref(1);
const isInitialized = ref(false);
function useFinanceDashboardPageState() {
  const route = useRoute();
  const router = useRouter();
  if (!isInitialized.value) {
    if (route.query.tab) {
      activeTab.value = route.query.tab;
    }
    isInitialized.value = true;
  }
  watch(activeTab, (newTab) => {
    router.replace({
      query: { ...route.query, tab: newTab },
    });
  });
  function resetPage() {
    currentPage.value = 1;
  }
  return {
    activeTab,
    selectedPeriod,
    currentPage,
    resetPage,
  };
}
const selectedYear = ref(/* @__PURE__ */ new Date().getFullYear().toString());
const searchQuery = ref("");
const cogsCustomerId = ref("");
const cogsServiceId = ref("");
const sortBy = ref("createdAt");
const sortOrder = ref("desc");
const showSortDropdown = ref(false);
const transactionYear = ref("");
const transactionType = ref("all");
const transactionCustomerId = ref("");
const transactionSearch = ref("");
const transactionSortBy = ref("date");
const transactionSortOrder = ref("desc");
const showTransactionSortDropdown = ref(false);
const financeCloseYear = ref("");
const financeCloseType = ref("all");
const financeCloseCustomerId = ref("");
const financeCloseSearch = ref("");
const financeCloseSortBy = ref("date");
const financeCloseSortOrder = ref("desc");
const showFinanceCloseSortDropdown = ref(false);
const arApToggle = ref("ar");
const arApSearch = ref("");
const arApSortBy = ref("dueDate");
const arApSortOrder = ref("asc");
const showArApSortDropdown = ref(false);
const arApStatusFilter = ref("all");
function useAvailableYears() {
  return computed(() => {
    const currentYear = /* @__PURE__ */ new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 5; i--) {
      years.push(i.toString());
    }
    return years;
  });
}
function useFinanceDashboardFilters() {
  const {
    activeTab: activeTab2,
    selectedPeriod: selectedPeriod2,
    currentPage: currentPage2,
    resetPage: resetPageInStore,
  } = useFinanceDashboardPageState();
  const getCogsFilters = () => {
    const filters = {
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
      page: currentPage2.value,
      limit: 10,
    };
    if (searchQuery.value) filters.search = searchQuery.value;
    if (cogsCustomerId.value) filters.companyId = cogsCustomerId.value;
    if (cogsServiceId.value) filters.serviceId = cogsServiceId.value;
    if (selectedYear.value) filters.year = parseInt(selectedYear.value);
    return filters;
  };
  const getTransactionFilters = () => {
    const filters = {
      sortBy: transactionSortBy.value,
      sortOrder: transactionSortOrder.value,
      type: transactionType.value,
      page: currentPage2.value,
      limit: 10,
    };
    if (transactionSearch.value && transactionSearch.value.trim()) {
      filters.search = transactionSearch.value.trim();
    }
    if (transactionCustomerId.value) {
      filters.companyId = transactionCustomerId.value;
    }
    if (transactionYear.value) {
      filters.year = parseInt(transactionYear.value);
    }
    return filters;
  };
  const getFinanceCloseFilters = () => {
    const filters = {
      sortBy: financeCloseSortBy.value,
      sortOrder: financeCloseSortBy.value === "date" ? "desc" : "asc",
      type: financeCloseType.value,
      page: currentPage2.value,
      limit: 10,
    };
    if (financeCloseSearch.value && financeCloseSearch.value.trim()) {
      filters.search = financeCloseSearch.value.trim();
    }
    if (financeCloseCustomerId.value) {
      filters.companyId = financeCloseCustomerId.value;
    }
    if (financeCloseYear.value) {
      filters.year = parseInt(financeCloseYear.value);
    }
    return filters;
  };
  const getArApFilters = () => {
    const filters = {
      type: arApToggle.value,
      sortBy: arApSortBy.value,
      sortOrder: arApSortOrder.value,
      status: arApStatusFilter.value,
      page: currentPage2.value,
      limit: 10,
    };
    if (arApSearch.value) filters.search = arApSearch.value;
    return filters;
  };
  const resetPage = () => {
    resetPageInStore();
  };
  const toggleSortDropdown = () => {
    showSortDropdown.value = !showSortDropdown.value;
  };
  const toggleTransactionSortDropdown = () => {
    showTransactionSortDropdown.value = !showTransactionSortDropdown.value;
  };
  const toggleFinanceCloseSortDropdown = () => {
    showFinanceCloseSortDropdown.value = !showFinanceCloseSortDropdown.value;
  };
  const toggleArApSortDropdown = () => {
    showArApSortDropdown.value = !showArApSortDropdown.value;
  };
  const closeAllDropdowns = () => {
    showSortDropdown.value = false;
    showTransactionSortDropdown.value = false;
    showFinanceCloseSortDropdown.value = false;
    showArApSortDropdown.value = false;
  };
  return {
    // Tab state (proxied from singleton)
    activeTab: activeTab2,
    selectedPeriod: selectedPeriod2,
    currentPage: currentPage2,
    // COGS state
    selectedYear,
    searchQuery,
    cogsCustomerId,
    cogsServiceId,
    sortBy,
    sortOrder,
    showSortDropdown,
    // Transaction state
    transactionYear,
    transactionType,
    transactionCustomerId,
    transactionSearch,
    transactionSortBy,
    transactionSortOrder,
    showTransactionSortDropdown,
    // Finance Close state
    financeCloseYear,
    financeCloseType,
    financeCloseCustomerId,
    financeCloseSearch,
    financeCloseSortBy,
    financeCloseSortOrder,
    showFinanceCloseSortDropdown,
    // AR/AP state
    arApToggle,
    arApSearch,
    arApSortBy,
    arApSortOrder,
    showArApSortDropdown,
    arApStatusFilter,
    // Filter getters
    getCogsFilters,
    getTransactionFilters,
    getFinanceCloseFilters,
    getArApFilters,
    // Actions
    resetPage,
    toggleSortDropdown,
    toggleTransactionSortDropdown,
    toggleFinanceCloseSortDropdown,
    toggleArApSortDropdown,
    closeAllDropdowns,
  };
}
const getErrorMessage = getErrorMessage$1;
function buildQueryParams(period, year, additionalParams) {
  const params = { period };
  if (year) params.year = year;
  if (additionalParams) {
    Object.assign(params, additionalParams);
  }
  return params;
}
const requestIds = {
  stats: ref(0),
  overview: ref(0),
  charts: ref(0),
  jobCosts: ref(0),
  transactions: ref(0),
  transactionStats: ref(0),
  financeClose: ref(0),
  closedPeriods: ref(0),
  arAp: ref(0),
  arApStats: ref(0),
  assets: ref(0),
  assetsStats: ref(0),
};
const isLoading = ref(false);
const error = ref(null);
function useFinanceDashboardApi() {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBase || "";
  function getNextRequestId(key) {
    return ++requestIds[key].value;
  }
  function isLatestRequest(key, requestId) {
    return requestId === requestIds[key].value;
  }
  function setLoading(loading) {
    isLoading.value = loading;
  }
  function setError(key, requestId, message) {
    if (isLatestRequest(key, requestId)) {
      error.value = message;
    }
  }
  function clearError(key, requestId) {
    if (isLatestRequest(key, requestId)) {
      error.value = null;
    }
  }
  return {
    baseUrl,
    requestIds,
    isLoading,
    error,
    getNextRequestId,
    isLatestRequest,
    setLoading,
    setError,
    clearError,
    buildQueryParams,
    getErrorMessage,
  };
}
const stats = ref(null);
const overviewStats = ref(null);
const chartData = ref(null);
function useFinanceDashboardOverview() {
  const {
    baseUrl,
    getNextRequestId,
    isLatestRequest,
    setLoading,
    setError,
    clearError,
    buildQueryParams: buildQueryParams2,
  } = useFinanceDashboardApi();
  async function fetchStats(period = "month", year) {
    const requestId = getNextRequestId("stats");
    setLoading(true);
    clearError("stats", requestId);
    try {
      const queryParams = buildQueryParams2(period, year);
      const data = await $fetch(`${baseUrl}/finance/dashboard`, {
        method: "GET",
        query: queryParams,
        credentials: "include",
      });
      console.log("[FE_TRACE] Stats response:", data);
      if (isLatestRequest("stats", requestId)) stats.value = data;
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to fetch stats:", message);
      setError("stats", requestId, message);
      return null;
    } finally {
      if (isLatestRequest("stats", requestId)) setLoading(false);
    }
  }
  async function fetchOverviewStats(period = "month", year) {
    const requestId = getNextRequestId("overview");
    setLoading(true);
    clearError("overview", requestId);
    try {
      const queryParams = buildQueryParams2(period, year);
      const data = await $fetch(`${baseUrl}/finance/dashboard/overview`, {
        method: "GET",
        query: queryParams,
        credentials: "include",
      });
      if (isLatestRequest("overview", requestId)) overviewStats.value = data;
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to fetch overview stats:", message);
      setError("overview", requestId, message);
      return null;
    } finally {
      if (isLatestRequest("overview", requestId)) setLoading(false);
    }
  }
  async function fetchChartData(period = "month", year) {
    const requestId = getNextRequestId("charts");
    setLoading(true);
    clearError("charts", requestId);
    try {
      const queryParams = buildQueryParams2(period, year);
      const data = await $fetch(`${baseUrl}/finance/dashboard/charts`, {
        method: "GET",
        query: queryParams,
        credentials: "include",
      });
      if (isLatestRequest("charts", requestId)) chartData.value = data;
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to fetch chart data:", message);
      setError("charts", requestId, message);
      return null;
    } finally {
      if (isLatestRequest("charts", requestId)) setLoading(false);
    }
  }
  return {
    stats,
    overviewStats,
    chartData,
    fetchStats,
    fetchOverviewStats,
    fetchChartData,
  };
}
const jobCosts = ref([]);
const pagination$3 = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
});
function useFinanceDashboardCogs() {
  const { baseUrl, getNextRequestId, isLatestRequest, setLoading, setError, clearError } =
    useFinanceDashboardApi();
  async function fetchJobCosts(period = "month", filters) {
    const requestId = getNextRequestId("jobCosts");
    setLoading(true);
    clearError("jobCosts", requestId);
    try {
      const queryParams = {
        period,
        page: filters?.page || 1,
        limit: filters?.limit || 10,
        ...filters,
      };
      delete queryParams.page;
      delete queryParams.limit;
      queryParams.page = filters?.page || 1;
      queryParams.limit = filters?.limit || 10;
      const data = await $fetch(`${baseUrl}/finance/dashboard/job-costs`, {
        method: "GET",
        query: queryParams,
        credentials: "include",
      });
      console.log("[FE_TRACE] Job costs response:", {
        itemCount: data.items?.length,
        total: data.pagination?.total,
      });
      if (isLatestRequest("jobCosts", requestId)) {
        jobCosts.value = data.items || [];
        if (data.pagination) {
          pagination$3.value = {
            page: data.pagination.page,
            limit: data.pagination.limit,
            total: data.pagination.total,
            totalPages: data.pagination.totalPages,
          };
        }
      }
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to fetch job costs:", message);
      setError("jobCosts", requestId, message);
      return null;
    } finally {
      if (isLatestRequest("jobCosts", requestId)) setLoading(false);
    }
  }
  return {
    jobCosts,
    pagination: pagination$3,
    fetchJobCosts,
  };
}
const transactions = ref([]);
const transactionStats = ref(null);
const pagination$2 = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
});
function useFinanceDashboardTransactions() {
  const { baseUrl, getNextRequestId, isLatestRequest, setLoading, setError, clearError } =
    useFinanceDashboardApi();
  async function createManualTransaction(data) {
    const requestId = getNextRequestId("transactions");
    setLoading(true);
    clearError("transactions", requestId);
    try {
      const result = await $fetch(`${baseUrl}/finance/dashboard/transactions`, {
        method: "POST",
        body: data,
        credentials: "include",
      });
      await fetchTransactions("month", 1, pagination$2.value.limit);
      return result;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to create manual transaction:", message);
      setError("transactions", requestId, message);
      return null;
    } finally {
      if (isLatestRequest("transactions", requestId)) setLoading(false);
    }
  }
  async function updateManualTransaction(id, data) {
    const requestId = getNextRequestId("transactions");
    setLoading(true);
    clearError("transactions", requestId);
    try {
      const result = await $fetch(`${baseUrl}/finance/dashboard/transactions/${id}`, {
        method: "PUT",
        body: data,
        credentials: "include",
      });
      await fetchTransactions("month", pagination$2.value.page, pagination$2.value.limit);
      return result;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to update manual transaction:", message);
      setError("transactions", requestId, message);
      return null;
    } finally {
      if (isLatestRequest("transactions", requestId)) setLoading(false);
    }
  }
  async function deleteManualTransaction(id) {
    const requestId = getNextRequestId("transactions");
    setLoading(true);
    clearError("transactions", requestId);
    try {
      await $fetch(`${baseUrl}/finance/dashboard/transactions/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      await fetchTransactions("month", pagination$2.value.page, pagination$2.value.limit);
      return true;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to delete manual transaction:", message);
      setError("transactions", requestId, message);
      return false;
    } finally {
      if (isLatestRequest("transactions", requestId)) setLoading(false);
    }
  }
  async function fetchTransactions(period = "month", page = 1, limit = 10, filters) {
    const requestId = getNextRequestId("transactions");
    setLoading(true);
    clearError("transactions", requestId);
    try {
      const { page: _p, limit: _l, ...safeFilters } = filters || {};
      const queryParams = {
        period,
        page,
        limit,
        ...safeFilters,
      };
      const data = await $fetch(`${baseUrl}/finance/dashboard/transactions`, {
        method: "GET",
        query: queryParams,
        credentials: "include",
      });
      if (isLatestRequest("transactions", requestId)) {
        transactions.value = data.items;
        if (data.pagination) {
          pagination$2.value = {
            page: data.pagination.page,
            limit: data.pagination.limit,
            total: data.pagination.total,
            totalPages: data.pagination.totalPages,
          };
        }
        if (data.stats) {
          transactionStats.value = data.stats;
        }
      }
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to fetch transactions:", message);
      setError("transactions", requestId, message);
      return null;
    } finally {
      if (isLatestRequest("transactions", requestId)) setLoading(false);
    }
  }
  async function fetchTransactionStats(period = "month", filters) {
    const requestId = getNextRequestId("transactionStats");
    setLoading(true);
    clearError("transactionStats", requestId);
    try {
      const queryParams = { period };
      if (filters) {
        Object.assign(queryParams, filters);
      }
      const data = await $fetch(`${baseUrl}/finance/dashboard/transactions/stats`, {
        method: "GET",
        query: queryParams,
        credentials: "include",
      });
      if (isLatestRequest("transactionStats", requestId)) transactionStats.value = data;
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to fetch transaction stats:", message);
      setError("transactionStats", requestId, message);
      return null;
    } finally {
      if (isLatestRequest("transactionStats", requestId)) setLoading(false);
    }
  }
  return {
    transactions,
    transactionStats,
    pagination: pagination$2,
    fetchTransactions,
    fetchTransactionStats,
    createManualTransaction,
    updateManualTransaction,
    deleteManualTransaction,
  };
}
const financeCloseStats = ref(null);
const closedPeriods = ref([]);
function useFinanceDashboardFinanceClose() {
  const {
    baseUrl,
    error: error2,
    getNextRequestId,
    isLatestRequest,
    setLoading,
    setError,
    clearError,
    buildQueryParams: buildQueryParams2,
  } = useFinanceDashboardApi();
  async function fetchFinanceCloseStats(period = "month", year) {
    const requestId = getNextRequestId("financeClose");
    setLoading(true);
    clearError("financeClose", requestId);
    try {
      const queryParams = buildQueryParams2(period, year);
      const data = await $fetch(`${baseUrl}/finance/dashboard/finance-close`, {
        method: "GET",
        query: queryParams,
        credentials: "include",
      });
      if (isLatestRequest("financeClose", requestId)) financeCloseStats.value = data;
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to fetch finance close stats:", message);
      setError("financeClose", requestId, message);
      return null;
    } finally {
      if (isLatestRequest("financeClose", requestId)) setLoading(false);
    }
  }
  async function fetchClosedPeriods() {
    const requestId = getNextRequestId("closedPeriods");
    setLoading(true);
    clearError("closedPeriods", requestId);
    try {
      const data = await $fetch(`${baseUrl}/finance/dashboard/finance-close/periods`, {
        method: "GET",
        credentials: "include",
      });
      if (isLatestRequest("closedPeriods", requestId)) closedPeriods.value = data;
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to fetch closed periods:", message);
      setError("closedPeriods", requestId, message);
      return null;
    } finally {
      if (isLatestRequest("closedPeriods", requestId)) setLoading(false);
    }
  }
  async function closePeriod(periodId, notes) {
    setLoading(true);
    clearError("financeClose", 0);
    try {
      await $fetch(`${baseUrl}/finance/dashboard/finance-close/periods/${periodId}/close`, {
        method: "POST",
        body: { notes },
        credentials: "include",
      });
      await fetchClosedPeriods();
      return { success: true, message: "Period closed successfully" };
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to close period:", message);
      error2.value = message;
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }
  async function reopenPeriod(periodId) {
    setLoading(true);
    clearError("financeClose", 0);
    try {
      await $fetch(`${baseUrl}/finance/dashboard/finance-close/periods/${periodId}/reopen`, {
        method: "POST",
        credentials: "include",
      });
      await fetchClosedPeriods();
      return { success: true, message: "Period reopened successfully" };
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to reopen period:", message);
      error2.value = message;
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }
  return {
    financeCloseStats,
    closedPeriods,
    fetchFinanceCloseStats,
    fetchClosedPeriods,
    closePeriod,
    reopenPeriod,
  };
}
const arApItems = ref([]);
const arApStats = ref(null);
const pagination$1 = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
});
function useFinanceDashboardArAp() {
  const { baseUrl, getNextRequestId, isLatestRequest, setLoading, setError, clearError } =
    useFinanceDashboardApi();
  async function fetchArApItems(period = "month", page = 1, limit = 10, filters) {
    const requestId = getNextRequestId("arAp");
    setLoading(true);
    clearError("arAp", requestId);
    try {
      const queryParams = {
        period,
        page,
        limit,
        ...filters,
      };
      const data = await $fetch(`${baseUrl}/finance/dashboard/ar-ap`, {
        method: "GET",
        query: queryParams,
        credentials: "include",
      });
      if (isLatestRequest("arAp", requestId)) {
        arApItems.value = data.items;
        if (data.pagination) {
          pagination$1.value = {
            page: data.pagination.page,
            limit: data.pagination.limit,
            total: data.pagination.total,
            totalPages: data.pagination.totalPages,
          };
        }
      }
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to fetch AR/AP items:", message);
      toast.error(message || "Gagal memuat data AR/AP.");
      setError("arAp", requestId, message);
      return null;
    } finally {
      if (isLatestRequest("arAp", requestId)) setLoading(false);
    }
  }
  async function fetchArApStats(period = "month") {
    const requestId = getNextRequestId("arApStats");
    setLoading(true);
    clearError("arApStats", requestId);
    try {
      const data = await $fetch(`${baseUrl}/finance/dashboard/ar-ap/stats`, {
        method: "GET",
        query: { period },
        credentials: "include",
      });
      if (isLatestRequest("arApStats", requestId)) arApStats.value = data;
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to fetch AR/AP stats:", message);
      toast.error(message || "Gagal memuat statistik AR/AP.");
      setError("arApStats", requestId, message);
      return null;
    } finally {
      if (isLatestRequest("arApStats", requestId)) setLoading(false);
    }
  }
  return {
    arApItems,
    arApStats,
    pagination: pagination$1,
    fetchArApItems,
    fetchArApStats,
  };
}
function useFinanceDashboard() {
  const api = useFinanceDashboardApi();
  const overview = useFinanceDashboardOverview();
  const cogs = useFinanceDashboardCogs();
  const transactions2 = useFinanceDashboardTransactions();
  const financeClose = useFinanceDashboardFinanceClose();
  const arAp = useFinanceDashboardArAp();
  async function fetchAll(period = "month", filters) {
    api.setLoading(true);
    api.clearError("stats", 0);
    const year = filters?.year;
    try {
      await Promise.all([
        overview.fetchStats(period, year),
        overview.fetchOverviewStats(period, year),
        cogs.fetchJobCosts(period, filters),
        transactions2.fetchTransactions(period, 1, 10, filters),
      ]);
    } finally {
      api.setLoading(false);
    }
  }
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
    pagination: cogs.pagination,
    // Default/Legacy
    cogsPagination: cogs.pagination,
    fetchJobCosts: cogs.fetchJobCosts,
    // Transactions data
    transactions: transactions2.transactions,
    transactionStats: transactions2.transactionStats,
    transactionPagination: transactions2.pagination,
    fetchTransactions: transactions2.fetchTransactions,
    fetchTransactionStats: transactions2.fetchTransactionStats,
    createManualTransaction: transactions2.createManualTransaction,
    updateManualTransaction: transactions2.updateManualTransaction,
    deleteManualTransaction: transactions2.deleteManualTransaction,
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
function useFinanceCharts() {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBase || "";
  const requestIdRef = ref(0);
  const isLoading2 = ref(false);
  const chartData2 = ref(null);
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
  async function fetchChartData(period = "month", year) {
    const requestId = ++requestIdRef.value;
    isLoading2.value = true;
    try {
      const queryParams = { period };
      if (year) {
        queryParams.year = year;
      }
      const data = await $fetch(`${baseUrl}/finance/dashboard/charts`, {
        method: "GET",
        query: queryParams,
        credentials: "include",
      });
      if (requestId === requestIdRef.value) {
        chartData2.value = data;
      }
      return data;
    } catch (error2) {
      console.error("Failed to fetch chart data:", error2);
      return null;
    } finally {
      if (requestId === requestIdRef.value) {
        isLoading2.value = false;
      }
    }
  }
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
      categories: chartData2.value?.months || monthCategories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#64748b", fontSize: "12px" } },
    },
    yaxis: {
      max: (maxValue) => Math.ceil(maxValue * 1.2),
      tickAmount: 5,
      labels: {
        style: { colors: "#64748b", fontSize: "12px" },
        formatter: (val) => `Rp${val}jt`,
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
        formatter: (val) => `Rp ${val}jt`,
      },
    },
  }));
  const financialChartSeries = computed(() => [
    {
      name: "Income",
      data: chartData2.value?.incomeData || [25, 28, 35, 40, 42, 45, 48, 52, 55, 58, 62, 65],
    },
    {
      name: "Outcome",
      data: chartData2.value?.expenseData || [20, 25, 30, 35, 38, 42, 45, 48, 50, 52, 55, 58],
    },
  ]);
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
      categories: chartData2.value?.months || monthCategories,
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
      y: { formatter: (val) => `${val}%` },
    },
  }));
  const marginTrendChartSeries = computed(() => [
    {
      name: "Margin",
      data: chartData2.value?.marginData || [25, 28, 32, 35, 38, 40, 42, 45, 48, 50, 52, 55],
    },
  ]);
  const top5ChartOptions = computed(() => ({
    chart: {
      type: "donut",
      height: 220,
      fontFamily: "inherit",
    },
    colors: ["#1e3a8a", "#38bdf8", "#3b82f6", "#60a5fa", "#2563eb"],
    labels:
      chartData2.value?.top5 && chartData2.value.top5.length > 0
        ? chartData2.value.top5.map((t) => t.name)
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
              formatter: (val) => formatRupiah(val),
            },
            total: {
              show: true,
              label: "Total",
              fontSize: "12px",
              color: "#64748b",
              formatter: (w) => {
                const total = w.globals.series.reduce((a, b) => a + b, 0);
                return formatRupiah(total);
              },
            },
          },
        },
      },
    },
    stroke: { width: 0 },
    tooltip: {
      y: { formatter: (val) => formatRupiah(val) },
    },
  }));
  const top5ChartSeries = computed(() => {
    const data = chartData2.value?.top5;
    return data && data.length > 0 ? data.map((t) => t.value) : [40, 30, 22, 10, 8];
  });
  return {
    // State
    isLoading: isLoading2,
    chartData: chartData2,
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
function useFinanceDashboardPageOverview() {
  const { overviewStats: overviewStats2, fetchOverviewStats } = useFinanceDashboard();
  const charts = useFinanceCharts();
  const overviewStatsCards = computed(() => {
    if (!overviewStats2.value) {
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
        { title: "Margins", value: "0%", changeLabel: "From income", suffix: "%" },
      ];
    }
    const o = overviewStats2.value;
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
        title: "Margins",
        value: `${o.margins || 0}%`,
        changeLabel: "From income",
        suffix: "%",
      },
    ];
  });
  async function fetchOverview(period, year) {
    await fetchOverviewStats(period, year);
    await charts.fetchChartData(period, year);
  }
  return {
    overviewStats: overviewStats2,
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
function useFinanceDashboardPageCogs() {
  const { stats: stats2, fetchAll, pagination: pagination2 } = useFinanceDashboard();
  const {
    selectedPeriod: selectedPeriod2,
    selectedYear: selectedYear2,
    searchQuery: searchQuery2,
    cogsCustomerId: cogsCustomerId2,
    cogsServiceId: cogsServiceId2,
    sortBy: sortBy2,
    sortOrder: sortOrder2,
    showSortDropdown: showSortDropdown2,
    getCogsFilters,
  } = useFinanceDashboardFilters();
  const cogsStats = computed(() => {
    if (!stats2.value) {
      return [
        {
          title: "Total COGS",
          value: "Rp0",
          changeLabel: "vs Last Period",
          isPrimary: true,
        },
        { title: "Average Cost/Job", value: "Rp0", changeLabel: "vs Last Period" },
        { title: "Highest Job", value: "Rp0", changeLabel: "vs Last Period" },
        { title: "Cost Growth", value: "0%", changeLabel: "From income", suffix: "%" },
      ];
    }
    const s = stats2.value;
    return [
      {
        title: "Total COGS",
        value: s.totalCogsFormatted || "Rp0",
        change: s.costGrowth,
        changeLabel: "vs Last Period",
        isPrimary: true,
      },
      {
        title: "Average Cost/Job",
        value: s.averageCostPerJobFormatted || "Rp0",
        change: s.costGrowth,
        changeLabel: "vs Last Period",
      },
      {
        title: "Highest Job",
        value: s.highestJob?.cogsFormatted || "Rp0",
        change: s.costGrowth,
        changeLabel: s.highestJob?.jobNumber || "N/A",
      },
      {
        title: "Cost Growth",
        value: `${s.costGrowth || 0}%`,
        changeLabel: "From previous period",
        suffix: "%",
      },
    ];
  });
  let searchTimer = null;
  function handleSearchInput(event) {
    const target = event.target;
    searchQuery2.value = target.value;
    if (searchTimer) {
      clearTimeout(searchTimer);
    }
    searchTimer = setTimeout(() => {
      handleSearch();
    }, 300);
  }
  async function handleSearchKeydown(event) {
    if (event.key === "Enter") {
      if (searchTimer) {
        clearTimeout(searchTimer);
      }
      await handleSearch();
    }
  }
  async function handleSearch() {
    await fetchAll(selectedPeriod2.value, getCogsFilters());
  }
  async function handleYearChange(year) {
    selectedYear2.value = year;
    await fetchAll(selectedPeriod2.value, getCogsFilters());
  }
  async function handleCustomerChange(customerId) {
    cogsCustomerId2.value = customerId;
    await fetchAll(selectedPeriod2.value, getCogsFilters());
  }
  async function handleServiceChange(serviceId) {
    cogsServiceId2.value = serviceId;
    await fetchAll(selectedPeriod2.value, getCogsFilters());
  }
  async function handleSort(field) {
    if (sortBy2.value === field) {
      sortOrder2.value = sortOrder2.value === "asc" ? "desc" : "asc";
    } else {
      sortBy2.value = field;
      sortOrder2.value = "desc";
    }
    await fetchAll(selectedPeriod2.value, getCogsFilters());
  }
  function handleSortDropdownToggle() {
    showSortDropdown2.value = !showSortDropdown2.value;
  }
  async function fetchCogs(period) {
    await fetchAll(period, getCogsFilters());
  }
  return {
    stats: stats2,
    cogsStats,
    pagination: pagination2,
    selectedYear: selectedYear2,
    searchQuery: searchQuery2,
    cogsCustomerId: cogsCustomerId2,
    cogsServiceId: cogsServiceId2,
    sortBy: sortBy2,
    sortOrder: sortOrder2,
    showSortDropdown: showSortDropdown2,
    getCogsFilters,
    handleSearchInput,
    handleSearchKeydown,
    handleSearch,
    handleYearChange,
    handleCustomerChange,
    handleServiceChange,
    handleSort,
    handleSortDropdownToggle,
    fetchCogs,
  };
}
function useFinanceDashboardPageTransactions() {
  const {
    transactions: transactions2,
    transactionStats: transactionStats2,
    fetchTransactions,
    pagination: pagination2,
  } = useFinanceDashboard();
  const {
    selectedPeriod: selectedPeriod2,
    currentPage: currentPage2,
    transactionYear: transactionYear2,
    transactionType: transactionType2,
    transactionCustomerId: transactionCustomerId2,
    transactionSearch: transactionSearch2,
    transactionSortBy: transactionSortBy2,
    transactionSortOrder: transactionSortOrder2,
    showTransactionSortDropdown: showTransactionSortDropdown2,
    getTransactionFilters,
  } = useFinanceDashboardFilters();
  const transactionStatsCards = computed(() => {
    const t = transactionStats2.value;
    if (!t) {
      return [
        { title: "Journal", value: "Rp0", isPrimary: true },
        { title: "Total Income", value: "Rp0", change: 0, changeLabel: "vs Last Period" },
        { title: "Total Outcome", value: "Rp0", change: 0, changeLabel: "vs Last Period" },
        { title: "Today Transaction", value: "0", changeLabel: "", suffix: "" },
      ];
    }
    return [
      {
        title: "Journal Volume",
        value: formatRupiah(t.totalJournal),
        isPrimary: true,
        changeLabel: "vs Last Period",
      },
      {
        title: "Total Transaction",
        value: formatRupiah(t.totalIncome),
        change: 0,
        changeLabel: "vs Last Period",
      },
      {
        title: "Today Transaction",
        value: `${t.todayTransactions}`,
        changeLabel: "Items today",
        suffix: " items",
      },
      {
        title: "All Transactions",
        value: `${pagination2.value.total}`,
        changeLabel: "Total count",
        suffix: " items",
      },
    ];
  });
  let searchTimer = null;
  function handleSearchInput(event) {
    const target = event.target;
    transactionSearch2.value = target.value;
    if (searchTimer) {
      clearTimeout(searchTimer);
    }
    searchTimer = setTimeout(() => {
      handleSearch();
    }, 300);
  }
  async function handleSearchKeydown(event) {
    if (event.key === "Enter") {
      if (searchTimer) {
        clearTimeout(searchTimer);
      }
      await handleSearch();
    }
  }
  async function handleSearch() {
    await fetchTransactions(
      selectedPeriod2.value,
      currentPage2.value,
      pagination2.value.limit,
      getTransactionFilters(),
    );
  }
  async function handleYearChange(year) {
    transactionYear2.value = year;
    await fetchTransactions(
      selectedPeriod2.value,
      currentPage2.value,
      pagination2.value.limit,
      getTransactionFilters(),
    );
  }
  async function handleTypeChange(type) {
    transactionType2.value = type;
    await fetchTransactions(
      selectedPeriod2.value,
      currentPage2.value,
      pagination2.value.limit,
      getTransactionFilters(),
    );
  }
  async function handleCustomerChange(customerId) {
    transactionCustomerId2.value = customerId;
    await fetchTransactions(
      selectedPeriod2.value,
      currentPage2.value,
      pagination2.value.limit,
      getTransactionFilters(),
    );
  }
  async function handleSort(field) {
    if (transactionSortBy2.value === field) {
      transactionSortOrder2.value = transactionSortOrder2.value === "asc" ? "desc" : "asc";
    } else {
      transactionSortBy2.value = field;
      transactionSortOrder2.value = "desc";
    }
    showTransactionSortDropdown2.value = false;
    await fetchTransactions(
      selectedPeriod2.value,
      currentPage2.value,
      pagination2.value.limit,
      getTransactionFilters(),
    );
  }
  function handleSortDropdownToggle() {
    showTransactionSortDropdown2.value = !showTransactionSortDropdown2.value;
  }
  async function fetchTxData(period) {
    await fetchTransactions(
      period,
      currentPage2.value,
      pagination2.value.limit,
      getTransactionFilters(),
    );
  }
  return {
    transactions: transactions2,
    transactionStats: transactionStats2,
    transactionStatsCards,
    pagination: pagination2,
    transactionYear: transactionYear2,
    transactionType: transactionType2,
    transactionCustomerId: transactionCustomerId2,
    transactionSearch: transactionSearch2,
    transactionSortBy: transactionSortBy2,
    transactionSortOrder: transactionSortOrder2,
    showTransactionSortDropdown: showTransactionSortDropdown2,
    getTransactionFilters,
    handleSearchInput,
    handleSearchKeydown,
    handleSearch,
    handleYearChange,
    handleTypeChange,
    handleCustomerChange,
    handleSort,
    handleSortDropdownToggle,
    fetchTxData,
  };
}
function useFinanceDashboardPageFinanceClose() {
  const {
    financeCloseStats: financeCloseStats2,
    closedPeriods: closedPeriods2,
    fetchFinanceCloseStats,
    fetchClosedPeriods,
    closePeriod,
    reopenPeriod,
  } = useFinanceDashboard();
  const { confirm } = useConfirm();
  const {
    selectedPeriod: selectedPeriod2,
    currentPage: currentPage2,
    financeCloseYear: financeCloseYear2,
    financeCloseType: financeCloseType2,
    financeCloseCustomerId: financeCloseCustomerId2,
    financeCloseSearch: financeCloseSearch2,
    financeCloseSortBy: financeCloseSortBy2,
    financeCloseSortOrder: financeCloseSortOrder2,
    showFinanceCloseSortDropdown: showFinanceCloseSortDropdown2,
    getFinanceCloseFilters,
  } = useFinanceDashboardFilters();
  const {
    transactions: transactions2,
    fetchTransactions,
    pagination: pagination2,
  } = useFinanceDashboard();
  const financeCloseData = computed(() => {
    return (
      financeCloseStats2.value || {
        period: "Loading...",
        status: "Open",
        description: "Loading...",
        revenue: "Rp0",
        cogs: "Rp0",
        nettPL: "Rp0",
        readinessScore: 0,
      }
    );
  });
  let searchTimer = null;
  function handleSearchInput(event) {
    const target = event.target;
    financeCloseSearch2.value = target.value;
    if (searchTimer) {
      clearTimeout(searchTimer);
    }
    searchTimer = setTimeout(() => {
      handleSearch();
    }, 300);
  }
  async function handleSearchKeydown(event) {
    if (event.key === "Enter") {
      if (searchTimer) {
        clearTimeout(searchTimer);
      }
      await handleSearch();
    }
  }
  async function handleSearch() {
    await fetchTransactions(
      selectedPeriod2.value,
      currentPage2.value,
      pagination2.value.limit,
      getFinanceCloseFilters(),
    );
  }
  async function handleYearChange(year) {
    financeCloseYear2.value = year;
    const yearValue = year ? parseInt(year) : void 0;
    await fetchFinanceCloseStats(selectedPeriod2.value, yearValue);
    await fetchTransactions(
      selectedPeriod2.value,
      currentPage2.value,
      pagination2.value.limit,
      getFinanceCloseFilters(),
    );
  }
  async function handleTypeChange(type) {
    financeCloseType2.value = type;
    await fetchTransactions(
      selectedPeriod2.value,
      currentPage2.value,
      pagination2.value.limit,
      getFinanceCloseFilters(),
    );
  }
  async function handleCustomerChange(customerId) {
    financeCloseCustomerId2.value = customerId;
    await fetchTransactions(
      selectedPeriod2.value,
      currentPage2.value,
      pagination2.value.limit,
      getFinanceCloseFilters(),
    );
  }
  async function handleSort(field) {
    if (financeCloseSortBy2.value === field) {
      financeCloseSortOrder2.value = financeCloseSortOrder2.value === "asc" ? "desc" : "asc";
    } else {
      financeCloseSortBy2.value = field;
      financeCloseSortOrder2.value = "desc";
    }
    await fetchTransactions(
      selectedPeriod2.value,
      currentPage2.value,
      pagination2.value.limit,
      getFinanceCloseFilters(),
    );
  }
  function handleSortDropdownToggle() {
    showFinanceCloseSortDropdown2.value = !showFinanceCloseSortDropdown2.value;
  }
  async function handleClosePeriod() {
    const confirmed = await confirm({
      title: "Close Period",
      message: "Are you sure you want to close this period? This action cannot be undone.",
      type: "danger",
    });
    if (!confirmed) return;
    const result = await closePeriod(selectedPeriod2.value);
    if (result) {
      await confirm({
        title: result.success ? "Success" : "Error",
        message: result.message,
        type: result.success ? void 0 : "danger",
      });
    }
  }
  async function handleReopenPeriod(periodCloseId) {
    const confirmed = await confirm({
      title: "Reopen Period",
      message:
        "Are you sure you want to reopen this period? This will allow modifications to transactions in this period.",
    });
    if (!confirmed) return;
    const result = await reopenPeriod(periodCloseId);
    if (result) {
      await confirm({
        title: result.success ? "Success" : "Error",
        message: result.message,
        type: result.success ? void 0 : "danger",
      });
    }
  }
  async function fetchFinanceClose(period) {
    const yearValue = financeCloseYear2.value ? parseInt(financeCloseYear2.value) : void 0;
    await fetchFinanceCloseStats(period, yearValue);
    await fetchClosedPeriods();
    await fetchTransactions(
      period,
      currentPage2.value,
      pagination2.value.limit,
      getFinanceCloseFilters(),
    );
  }
  return {
    financeCloseStats: financeCloseStats2,
    closedPeriods: closedPeriods2,
    financeCloseData,
    transactions: transactions2,
    pagination: pagination2,
    financeCloseYear: financeCloseYear2,
    financeCloseType: financeCloseType2,
    financeCloseCustomerId: financeCloseCustomerId2,
    financeCloseSearch: financeCloseSearch2,
    financeCloseSortBy: financeCloseSortBy2,
    financeCloseSortOrder: financeCloseSortOrder2,
    showFinanceCloseSortDropdown: showFinanceCloseSortDropdown2,
    getFinanceCloseFilters,
    handleSearchInput,
    handleSearchKeydown,
    handleSearch,
    handleYearChange,
    handleTypeChange,
    handleCustomerChange,
    handleSort,
    handleSortDropdownToggle,
    handleClosePeriod,
    handleReopenPeriod,
    fetchFinanceClose,
  };
}
function useFinanceDashboardPageArAp() {
  const {
    arApItems: arApItems2,
    arApStats: arApStats2,
    fetchArApItems,
    fetchArApStats,
    pagination: pagination2,
  } = useFinanceDashboard();
  useConfirm();
  const {
    selectedPeriod: selectedPeriod2,
    currentPage: currentPage2,
    arApToggle: arApToggle2,
    arApSearch: arApSearch2,
    arApSortBy: arApSortBy2,
    arApSortOrder: arApSortOrder2,
    showArApSortDropdown: showArApSortDropdown2,
    arApStatusFilter: arApStatusFilter2,
    getArApFilters,
  } = useFinanceDashboardFilters();
  let searchTimer = null;
  function handleSearchInput(event) {
    const target = event.target;
    arApSearch2.value = target.value;
    if (searchTimer) {
      clearTimeout(searchTimer);
    }
    searchTimer = setTimeout(() => {
      handleSearch();
    }, 300);
  }
  async function handleSearchKeydown(event) {
    if (event.key === "Enter") {
      if (searchTimer) {
        clearTimeout(searchTimer);
      }
      await handleSearch();
    }
  }
  async function handleSearch() {
    await Promise.all([
      fetchArApItems(
        selectedPeriod2.value,
        currentPage2.value,
        pagination2.value.limit,
        getArApFilters(),
      ),
      fetchArApStats(selectedPeriod2.value),
    ]);
  }
  async function handleToggleChange(toggle) {
    arApToggle2.value = toggle;
    await Promise.all([
      fetchArApItems(
        selectedPeriod2.value,
        currentPage2.value,
        pagination2.value.limit,
        getArApFilters(),
      ),
      fetchArApStats(selectedPeriod2.value),
    ]);
  }
  async function handleSort(field) {
    if (arApSortBy2.value === field) {
      arApSortOrder2.value = arApSortOrder2.value === "asc" ? "desc" : "asc";
    } else {
      arApSortBy2.value = field;
      arApSortOrder2.value = "desc";
    }
    showArApSortDropdown2.value = false;
    await Promise.all([
      fetchArApItems(
        selectedPeriod2.value,
        currentPage2.value,
        pagination2.value.limit,
        getArApFilters(),
      ),
      fetchArApStats(selectedPeriod2.value),
    ]);
  }
  function handleSortDropdownToggle() {
    showArApSortDropdown2.value = !showArApSortDropdown2.value;
  }
  async function handleStatusFilterChange(status) {
    arApStatusFilter2.value = status;
    await Promise.all([
      fetchArApItems(
        selectedPeriod2.value,
        currentPage2.value,
        pagination2.value.limit,
        getArApFilters(),
      ),
      fetchArApStats(selectedPeriod2.value),
    ]);
  }
  async function fetchArAp(period) {
    await Promise.all([
      fetchArApItems(period, currentPage2.value, pagination2.value.limit, getArApFilters()),
      fetchArApStats(period),
    ]);
  }
  async function handleRefresh() {
    await Promise.all([
      fetchArApItems(
        selectedPeriod2.value,
        currentPage2.value,
        pagination2.value.limit,
        getArApFilters(),
      ),
      fetchArApStats(selectedPeriod2.value),
    ]);
  }
  return {
    arApItems: arApItems2,
    arApStats: arApStats2,
    pagination: pagination2,
    arApToggle: arApToggle2,
    arApSearch: arApSearch2,
    arApSortBy: arApSortBy2,
    arApSortOrder: arApSortOrder2,
    showArApSortDropdown: showArApSortDropdown2,
    arApStatusFilter: arApStatusFilter2,
    getArApFilters,
    handleSearchInput,
    handleSearchKeydown,
    handleSearch,
    handleToggleChange,
    handleSort,
    handleSortDropdownToggle,
    handleStatusFilterChange,
    fetchArAp,
    handleRefresh,
  };
}
function useFinanceDashboardPage() {
  const router = useRouter();
  const pageState = useFinanceDashboardPageState();
  const {
    activeTab: activeTab2,
    selectedPeriod: selectedPeriod2,
    currentPage: currentPage2,
    resetPage,
  } = pageState;
  const filters = useFinanceDashboardFilters();
  const {
    selectedYear: selectedYear2,
    searchQuery: searchQuery2,
    cogsCustomerId: cogsCustomerId2,
    cogsServiceId: cogsServiceId2,
    sortBy: sortBy2,
    sortOrder: sortOrder2,
    showSortDropdown: showSortDropdown2,
    transactionYear: transactionYear2,
    transactionType: transactionType2,
    transactionCustomerId: transactionCustomerId2,
    transactionSearch: transactionSearch2,
    transactionSortBy: transactionSortBy2,
    transactionSortOrder: transactionSortOrder2,
    showTransactionSortDropdown: showTransactionSortDropdown2,
    financeCloseYear: financeCloseYear2,
    financeCloseType: financeCloseType2,
    financeCloseCustomerId: financeCloseCustomerId2,
    financeCloseSearch: financeCloseSearch2,
    financeCloseSortBy: financeCloseSortBy2,
    financeCloseSortOrder: financeCloseSortOrder2,
    showFinanceCloseSortDropdown: showFinanceCloseSortDropdown2,
    arApToggle: arApToggle2,
    arApSearch: arApSearch2,
    arApSortBy: arApSortBy2,
    arApSortOrder: arApSortOrder2,
    showArApSortDropdown: showArApSortDropdown2,
    arApStatusFilter: arApStatusFilter2,
  } = filters;
  const overview = useFinanceDashboardPageOverview();
  const cogs = useFinanceDashboardPageCogs();
  const transactions2 = useFinanceDashboardPageTransactions();
  const financeClose = useFinanceDashboardPageFinanceClose();
  const arAp = useFinanceDashboardPageArAp();
  const dashboard = useFinanceDashboard();
  const {
    isLoading: isLoading2,
    error: error2,
    jobCosts: jobCosts2,
    cogsPagination,
    transactionPagination,
    arApPagination,
  } = dashboard;
  useFinanceDashboardApi();
  const pagination2 = computed(() => {
    switch (activeTab2.value) {
      case "COGS":
        return cogsPagination.value;
      case "Transaction":
        return transactionPagination.value;
      case "Accounts Receivable":
        return arApPagination.value;
      default:
        return cogsPagination.value;
    }
  });
  const { companies, fetchCompanies } = useCompanies();
  const { services, fetchServices } = useServices();
  const isLoadingCustomers = ref(false);
  const isLoadingServices = ref(false);
  async function fetchDataForTab(tab, period) {
    switch (tab) {
      case "Overview": {
        const year = selectedYear2.value ? parseInt(selectedYear2.value) : void 0;
        await overview.fetchOverview(period, year);
        break;
      }
      case "COGS":
        await dashboard.fetchAll(period, filters.getCogsFilters());
        break;
      case "Transaction":
        await transactions2.fetchTxData(period);
        break;
      case "Finance Close":
        await financeClose.fetchFinanceClose(period);
        break;
      case "Accounts Receivable":
        await arAp.fetchArAp(period);
        break;
    }
  }
  async function loadCustomers() {
    if (companies.value.length) return;
    isLoadingCustomers.value = true;
    try {
      await fetchCompanies({ type: "CUSTOMER" });
    } finally {
      isLoadingCustomers.value = false;
    }
  }
  async function loadServices() {
    if (services.value.length) return;
    isLoadingServices.value = true;
    try {
      await fetchServices();
    } finally {
      isLoadingServices.value = false;
    }
  }
  async function handlePeriodChange(period) {
    selectedPeriod2.value = period;
    resetPage();
    await fetchDataForTab(activeTab2.value, period);
  }
  async function handleTabChange(tab) {
    activeTab2.value = tab;
    resetPage();
    if (["COGS", "Transaction", "Finance Close"].includes(tab)) await loadCustomers();
    if (tab === "COGS") await loadServices();
    await fetchDataForTab(tab, selectedPeriod2.value);
  }
  async function handlePageChange(newPage) {
    currentPage2.value = newPage;
    const active = activeTab2.value;
    if (active === "COGS") {
      await dashboard.fetchJobCosts(selectedPeriod2.value, {
        ...filters.getCogsFilters(),
        page: newPage,
      });
    } else if (active === "Transaction") {
      await dashboard.fetchTransactions(
        selectedPeriod2.value,
        newPage,
        transactionPagination.value.limit,
        filters.getTransactionFilters(),
      );
    } else if (active === "Finance Close") {
      await financeClose.fetchFinanceClose(selectedPeriod2.value);
    } else if (active === "Accounts Receivable") {
      await dashboard.fetchArApItems(
        selectedPeriod2.value,
        newPage,
        arApPagination.value.limit,
        filters.getArApFilters(),
      );
    }
  }
  watch(arApToggle2, async () => {
    if (activeTab2.value === "Accounts Receivable") {
      resetPage();
      await fetchDataForTab("Accounts Receivable", selectedPeriod2.value);
    }
  });
  return {
    // State
    isLoading: isLoading2,
    error: error2,
    selectedPeriod: selectedPeriod2,
    activeTab: activeTab2,
    currentPage: currentPage2,
    selectedYear: selectedYear2,
    searchQuery: searchQuery2,
    cogsCustomerId: cogsCustomerId2,
    cogsServiceId: cogsServiceId2,
    sortBy: sortBy2,
    sortOrder: sortOrder2,
    showSortDropdown: showSortDropdown2,
    transactionYear: transactionYear2,
    transactionType: transactionType2,
    transactionCustomerId: transactionCustomerId2,
    transactionSearch: transactionSearch2,
    transactionSortBy: transactionSortBy2,
    transactionSortOrder: transactionSortOrder2,
    showTransactionSortDropdown: showTransactionSortDropdown2,
    financeCloseYear: financeCloseYear2,
    financeCloseType: financeCloseType2,
    financeCloseCustomerId: financeCloseCustomerId2,
    financeCloseSearch: financeCloseSearch2,
    financeCloseSortBy: financeCloseSortBy2,
    financeCloseSortOrder: financeCloseSortOrder2,
    showFinanceCloseSortDropdown: showFinanceCloseSortDropdown2,
    arApToggle: arApToggle2,
    arApSearch: arApSearch2,
    arApSortBy: arApSortBy2,
    arApSortOrder: arApSortOrder2,
    showArApSortDropdown: showArApSortDropdown2,
    arApStatusFilter: arApStatusFilter2,
    isLoadingCustomers,
    isLoadingServices,
    // Data
    stats: overview.overviewStats,
    overviewStats: overview.overviewStats,
    jobCosts: jobCosts2,
    transactions: dashboard.transactions,
    transactionStats: dashboard.transactionStats,
    financeCloseStats: financeClose.financeCloseStats,
    closedPeriods: financeClose.closedPeriods,
    arApItems: arAp.arApItems,
    arApStats: arAp.arApStats,
    pagination: pagination2,
    companies,
    services,
    // Chart data
    chartData: overview.chartData,
    financialChartOptions: overview.financialChartOptions,
    financialChartSeries: overview.financialChartSeries,
    marginTrendChartOptions: overview.marginTrendChartOptions,
    marginTrendChartSeries: overview.marginTrendChartSeries,
    top5ChartOptions: overview.top5ChartOptions,
    top5ChartSeries: overview.top5ChartSeries,
    // Computed stats
    overviewStatsCards: overview.overviewStatsCards,
    cogsStats: cogs.cogsStats,
    transactionStatsCards: transactions2.transactionStatsCards,
    financeCloseData: financeClose.financeCloseData,
    // Handlers
    handlePeriodChange,
    handleTabChange,
    handlePageChange,
    handleClosePeriod: financeClose.handleClosePeriod,
    handleReopenPeriod: financeClose.handleReopenPeriod,
    handleYearChange: cogs.handleYearChange,
    handleCogsCustomerChange: cogs.handleCustomerChange,
    handleCogsServiceChange: cogs.handleServiceChange,
    handleCogsSearch: cogs.handleSearch,
    handleCogsSearchInput: cogs.handleSearchInput,
    handleCogsSearchKeydown: cogs.handleSearchKeydown,
    handleCogsSort: cogs.handleSort,
    handleCogsSortDropdownToggle: cogs.handleSortDropdownToggle,
    handleTransactionYearChange: transactions2.handleYearChange,
    handleTransactionTypeChange: transactions2.handleTypeChange,
    handleTransactionCustomerChange: transactions2.handleCustomerChange,
    handleTransactionSearch: transactions2.handleSearch,
    handleTransactionSearchInput: transactions2.handleSearchInput,
    handleTransactionSearchKeydown: transactions2.handleSearchKeydown,
    handleTransactionSort: transactions2.handleSort,
    handleTransactionSortDropdownToggle: transactions2.handleSortDropdownToggle,
    handleTransactionExport: () => {
      try {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        const contentWidth = pageWidth - margin * 2;
        let yPos = margin;
        const primaryColor = [1, 45, 90];
        const textColor = [31, 41, 55];
        const grayColor = [107, 114, 128];
        const lightGrayColor = [229, 231, 235];
        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, pageWidth, 40, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("TRANSACTIONS REPORT", margin, 25);
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        const yearLabel = transactionYear2.value ? `Year: ${transactionYear2.value}` : "All Years";
        doc.text(yearLabel, pageWidth - margin, 20, { align: "right" });
        const dateLabel = /* @__PURE__ */ new Date().toLocaleDateString("id-ID");
        doc.text(`Generated: ${dateLabel}`, pageWidth - margin, 30, { align: "right" });
        yPos = 55;
        doc.setTextColor(...textColor);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Filters:", margin, yPos);
        doc.setFont("helvetica", "normal");
        yPos += 7;
        const filters2 = [];
        if (transactionYear2.value) filters2.push(`Year: ${transactionYear2.value}`);
        if (transactionType2.value) filters2.push(`Type: ${transactionType2.value}`);
        if (transactionCustomerId2.value)
          filters2.push(`Customer ID: ${transactionCustomerId2.value}`);
        if (transactionSearch2.value) filters2.push(`Search: ${transactionSearch2.value}`);
        if (filters2.length === 0) filters2.push("None (All Data)");
        doc.setTextColor(...grayColor);
        filters2.forEach((filter) => {
          doc.text(filter, margin, yPos);
          yPos += 6;
        });
        yPos += 10;
        doc.setFillColor(...primaryColor);
        doc.rect(margin, yPos, contentWidth, 10, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text("No.", margin + 2, yPos + 7);
        doc.text("Date", margin + 20, yPos + 7);
        doc.text("Job Number", margin + 45, yPos + 7);
        doc.text("Customer", margin + 85, yPos + 7);
        doc.text("Type", margin + 130, yPos + 7);
        doc.text("Amount", margin + 160, yPos + 7);
        yPos += 10;
        doc.setTextColor(...textColor);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        const transactionsList = transactions2.transactions.value || [];
        let totalAmount = 0;
        transactionsList.forEach((tx, index) => {
          if (yPos > pageHeight - 30) {
            doc.addPage();
            yPos = margin;
          }
          if (index % 2 === 0) {
            doc.setFillColor(249, 250, 251);
            doc.rect(margin, yPos, contentWidth, 10, "F");
          }
          doc.setTextColor(...textColor);
          doc.text((index + 1).toString(), margin + 2, yPos + 7);
          doc.text(
            tx.date ? new Date(tx.date).toLocaleDateString("id-ID") : "-",
            margin + 20,
            yPos + 7,
          );
          doc.text(tx.jobNumber?.substring(0, 15) || "-", margin + 45, yPos + 7);
          doc.text(tx.customer?.substring(0, 18) || "-", margin + 85, yPos + 7);
          doc.text(tx.type?.substring(0, 10) || "-", margin + 130, yPos + 7);
          doc.text(formatRupiah(tx.total || 0), margin + 160, yPos + 7);
          totalAmount += tx.total || 0;
          yPos += 10;
        });
        yPos += 5;
        doc.setFillColor(...lightGrayColor);
        doc.rect(margin, yPos, contentWidth, 12, "F");
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...textColor);
        doc.text("TOTAL", margin + 2, yPos + 8);
        doc.text(formatRupiah(totalAmount), margin + 160, yPos + 8);
        const footerY = pageHeight - 15;
        doc.setFillColor(...primaryColor);
        doc.rect(0, footerY - 5, pageWidth, 20, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text("PT. Nusantara Continent - Transactions Report", pageWidth / 2, footerY + 5, {
          align: "center",
        });
        const filename = `Transactions_Report${transactionYear2.value ? `_${transactionYear2.value}` : ""}.pdf`;
        doc.save(filename);
      } catch (error22) {
        console.error("Failed to export transactions PDF:", error22);
        alert("Failed to export PDF. Please try again.");
      }
    },
    handleTransactionCreate: () => {
      router.push("/finance/transactions/create");
    },
    handleTransactionEdit: (transaction) => {
      router.push(`/finance/transaction/${transaction.id}/edit`);
    },
    handleTransactionDelete: async (transaction) => {
      const { confirm } = useConfirm();
      const confirmed = await confirm({
        title: "Delete Transaction",
        message: `Are you sure you want to delete this transaction?`,
        type: "danger",
        confirmText: "Delete",
        cancelText: "Cancel",
      });
      if (confirmed) {
        await dashboard.deleteManualTransaction(transaction.id);
      }
    },
    handleFinanceCloseYearChange: financeClose.handleYearChange,
    handleFinanceCloseTypeChange: financeClose.handleTypeChange,
    handleFinanceCloseCustomerChange: financeClose.handleCustomerChange,
    handleFinanceCloseSearch: financeClose.handleSearch,
    handleFinanceCloseSearchInput: financeClose.handleSearchInput,
    handleFinanceCloseSearchKeydown: financeClose.handleSearchKeydown,
    handleFinanceCloseSort: financeClose.handleSort,
    handleFinanceCloseSortDropdownToggle: financeClose.handleSortDropdownToggle,
    handleArApToggleChange: arAp.handleToggleChange,
    handleArApSearch: arAp.handleSearch,
    handleArApSearchInput: arAp.handleSearchInput,
    handleArApSearchKeydown: arAp.handleSearchKeydown,
    handleArApSort: arAp.handleSort,
    handleArApSortDropdownToggle: arAp.handleSortDropdownToggle,
    handleArApStatusFilterChange: arAp.handleStatusFilterChange,
    handleArApRefresh: arAp.handleRefresh,
  };
}
const assets = ref([]);
const assetStats = ref(null);
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
});
function useFinanceDashboardAssets() {
  const { baseUrl, getNextRequestId, isLatestRequest, setLoading, setError, clearError } =
    useFinanceDashboardApi();
  async function fetchAssets(page = 1, limit = 10, filters) {
    const requestId = getNextRequestId("assets");
    setLoading(true);
    clearError("assets", requestId);
    try {
      const queryParams = {
        page,
        limit,
      };
      if (filters) {
        if (filters.search) queryParams.search = filters.search;
        if (filters.sortBy) queryParams.sortBy = filters.sortBy;
        if (filters.sortOrder) queryParams.sortOrder = filters.sortOrder;
        if (filters.year) queryParams.year = filters.year;
        if (filters.serviceId) queryParams.serviceId = filters.serviceId;
        if (filters.companyId) queryParams.companyId = filters.companyId;
      }
      const data = await $fetch(`${baseUrl}/finance/dashboard/assets`, {
        method: "GET",
        query: queryParams,
        credentials: "include",
      });
      if (isLatestRequest("assets", requestId)) {
        assets.value = data.items;
        if (data.pagination) {
          pagination.value = {
            page: data.pagination.page,
            limit: data.pagination.limit,
            total: data.pagination.total,
            totalPages: data.pagination.totalPages,
          };
        }
      }
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to fetch assets:", message);
      setError("assets", requestId, message);
      return null;
    } finally {
      if (isLatestRequest("assets", requestId)) setLoading(false);
    }
  }
  async function fetchAssetStats(year) {
    const requestId = getNextRequestId("assetsStats");
    setLoading(true);
    clearError("assetsStats", requestId);
    try {
      const queryParams = {};
      if (year) queryParams.year = year;
      const data = await $fetch(`${baseUrl}/finance/dashboard/assets/stats`, {
        method: "GET",
        query: queryParams,
        credentials: "include",
      });
      if (isLatestRequest("assetsStats", requestId)) assetStats.value = data;
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to fetch asset stats:", message);
      setError("assetsStats", requestId, message);
      return null;
    } finally {
      if (isLatestRequest("assetsStats", requestId)) setLoading(false);
    }
  }
  async function createAsset(data) {
    try {
      const result = await $fetch(`${baseUrl}/finance/dashboard/assets`, {
        method: "POST",
        body: data,
        credentials: "include",
      });
      return result;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to create asset:", message);
      return null;
    }
  }
  return {
    // State
    assets,
    assetStats,
    pagination,
    // Methods
    fetchAssets,
    fetchAssetStats,
    createAsset,
  };
}
const TABS = [
  "Overview",
  "COGS",
  "Transaction",
  "Assets",
  "Accounts Receivable",
  "Trial Balance",
  "Finance Close",
];
const TIME_PERIODS = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
];
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    const { selectedPeriod: selectedPeriod2, activeTab: activeTab2 } = useFinanceDashboardPage();
    useAvailableYears();
    const {
      assets: assets2,
      assetStats: assetStats2,
      pagination: assetsPagination,
      fetchAssets,
      fetchAssetStats,
    } = useFinanceDashboardAssets();
    const assetsSearch = ref("");
    const assetsYear = ref("");
    const assetsServiceId = ref("");
    const assetsCompanyId = ref("");
    const assetsSortBy = ref("date");
    const assetsSortOrder = ref("desc");
    ref(false);
    const isLoadingAssets = ref(false);
    computed(() => assets2.value);
    computed(() => {
      const totalValue = assetStats2.value?.totalValue || 0;
      const totalCount = assetStats2.value?.totalAssets || 0;
      return [
        { title: "Total Assets", value: formatRupiah(totalValue), isPrimary: true },
        { title: "Assets Count", value: totalCount.toString(), changeLabel: "", suffix: "" },
      ];
    });
    async function loadAssets() {
      isLoadingAssets.value = true;
      try {
        await fetchAssets(assetsPagination.value.page, assetsPagination.value.limit, {
          search: assetsSearch.value || void 0,
          sortBy: assetsSortBy.value,
          sortOrder: assetsSortOrder.value,
          year: assetsYear.value || void 0,
          serviceId: assetsServiceId.value || void 0,
          companyId: assetsCompanyId.value || void 0,
        });
        await fetchAssetStats(assetsYear.value || void 0);
      } finally {
        isLoadingAssets.value = false;
      }
    }
    watch(
      [assetsSearch, assetsYear, assetsServiceId, assetsCompanyId, assetsSortBy, assetsSortOrder],
      () => {
        if (activeTab2.value === "Assets") {
          loadAssets();
        }
      },
      { deep: true },
    );
    watch(
      activeTab2,
      (newTab) => {
        if (newTab === "Assets") {
          loadAssets();
        }
      },
      { immediate: true },
    );
    watch(selectedPeriod2, () => {
      if (activeTab2.value === "Assets") {
        loadAssets();
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_1$1;
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col h-screen overflow-hidden" }, _attrs))}><div class="shrink-0 bg-white border-b border-border"><div class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6"><div><h1 class="text-2xl font-bold">Finance</h1><p class="text-muted-foreground text-base"> Manage cash flow, COGS, receivables/payables, and financial reports </p></div><div class="flex items-center gap-1 bg-gray-100 border border-transparent rounded-lg p-1"><!--[-->`,
      );
      ssrRenderList(unref(TIME_PERIODS), (period) => {
        _push(
          `<button class="${ssrRenderClass(
            unref(cn)(
              "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
              unref(selectedPeriod2) === period.value
                ? "bg-[#012D5A] text-white"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            ),
          )}">${ssrInterpolate(period.label)}</button>`,
        );
      });
      _push(
        `<!--]--></div></div><div class=""><nav class="flex gap-1 overflow-x-auto -mb-px"><!--[-->`,
      );
      ssrRenderList(unref(TABS), (tab) => {
        _push(
          `<button class="${ssrRenderClass(
            unref(cn)(
              "px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
              unref(activeTab2) === tab
                ? "border-[#012D5A] text-[#012D5A]"
                : "text-muted-foreground border-transparent hover:text-foreground hover:border-gray-300",
            ),
          )}">${ssrInterpolate(tab)}</button>`,
        );
      });
      _push(`<!--]--></nav></div></div><div class="flex-1 overflow-y-auto relative pt-6 pb-10">`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</div></div>`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/finance/dashboard.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=dashboard-3d5fi9bZ.mjs.map
