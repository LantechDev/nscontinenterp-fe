export interface DashboardStats {
  totalIncome: string;
  totalIncomeRaw: number;
  activeJobs: number;
  pendingInvoices: number;
  activeOffers: number;
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

export const useDashboard = () => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBase || "";

  const fetchDashboard = async (): Promise<DashboardData | null> => {
    try {
      const response = await $fetch<DashboardData>(`${baseUrl}/admin/dashboard`, {
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
