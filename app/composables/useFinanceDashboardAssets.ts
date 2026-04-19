import type { PaginationInfo } from "~/types/finance-dashboard";
import { getErrorMessage } from "./useFinanceDashboardApi";

// Asset types
export interface AssetItem {
  id: string;
  name: string;
  date: string;
  description: string;
  price: number;
  service?: string;
  company?: string;
}

export interface AssetStats {
  totalAssets: number;
  totalValue: number;
}

export interface AssetsResponse {
  items: AssetItem[];
  pagination: PaginationInfo;
}

// Shared state singletons to ensure consistency across the dashboard
const assets = ref<AssetItem[]>([]);
const assetStats = ref<AssetStats | null>(null);
const pagination = ref<PaginationInfo>({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
});

/**
 * Finance Dashboard Assets Composable
 * Provides assets fetching and management
 */
export function useFinanceDashboardAssets() {
  const {
    baseUrl,
    isLoading: _isLoading,
    error: _error,
    getNextRequestId,
    isLatestRequest,
    setLoading,
    setError,
    clearError,
  } = useFinanceDashboardApi();

  /**
   * Fetch assets with filters
   */
  async function fetchAssets(
    page: number = 1,
    limit: number = 10,
    filters?: {
      search?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
      year?: string;
      serviceId?: string;
      companyId?: string;
    },
  ): Promise<AssetsResponse | null> {
    const requestId = getNextRequestId("assets");

    setLoading(true);
    clearError("assets", requestId);

    try {
      const queryParams: Record<string, string | number> = {
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

      const data = await $fetch<AssetsResponse>(`${baseUrl}/finance/dashboard/assets`, {
        method: "GET",
        query: queryParams,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
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

  /**
   * Fetch asset statistics
   */
  async function fetchAssetStats(year?: string): Promise<AssetStats | null> {
    const requestId = getNextRequestId("assetsStats");

    setLoading(true);
    clearError("assetsStats", requestId);

    try {
      const queryParams: Record<string, string> = {};
      if (year) queryParams.year = year;

      const data = await $fetch<AssetStats>(`${baseUrl}/finance/dashboard/assets/stats`, {
        method: "GET",
        query: queryParams,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
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

  /**
   * Create a new asset
   */
  async function createAsset(data: {
    name: string;
    description?: string;
    price: number;
    date: string;
    serviceId?: string;
    companyId?: string;
    taxId?: string;
  }): Promise<AssetItem | null> {
    try {
      const result = await $fetch<AssetItem>(`${baseUrl}/finance/dashboard/assets`, {
        method: "POST",
        body: data,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
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
