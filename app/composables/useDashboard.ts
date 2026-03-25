export interface DashboardStats {
  totalIncome: string;
  totalIncomeRaw: number;
  totalIncomeChange: number;
  activeJobs: number;
  activeJobsChange: number;
  pendingInvoices: number;
  pendingInvoicesChange: number;
  activeOffers: number;
  activeOffersChange: number;
}

export interface RecentJob {
  id: string;
  jobNumber: string;
  customer: string;
  type: "Export" | "Import";
  status: "Active" | "Pending" | "Canceled" | "Done";
  origin: string;
  destination: string;
  date: string;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  description: string;
  time: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentJobs: RecentJob[];
  upcomingEvents: UpcomingEvent[];
  financialOverview: {
    income: number[];
    outcome: number[];
  };
}

export interface DashboardQueryParams {
  startDate?: string;
  endDate?: string;
}

export const useDashboard = () => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBase || "";

  const fetchDashboard = async (params?: DashboardQueryParams): Promise<DashboardData | null> => {
    try {
      // Build query string from params
      const queryParams = new URLSearchParams();
      if (params?.startDate) {
        queryParams.append("startDate", params.startDate);
      }
      if (params?.endDate) {
        queryParams.append("endDate", params.endDate);
      }

      const queryString = queryParams.toString();
      const url = queryString
        ? `${baseUrl}/admin/dashboard?${queryString}`
        : `${baseUrl}/admin/dashboard`;

      const response = await $fetch<DashboardData>(url, {
        method: "GET",
        credentials: "include",
      });
      return response;
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      return null;
    }
  };

  return {
    fetchDashboard,
  };
};
