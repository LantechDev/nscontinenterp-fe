import { ref } from "vue";

export interface DashboardStats {
  jobs: {
    total: number;
    confirmed: number;
  };
  bls: {
    total: number;
    pendingApproval: number;
  };
}

export interface PendingApprovalBl {
  id: string;
  blNumber: string | null;
  jobId: string | null;
  updatedAt: string;
  status: {
    id: string;
    code: string;
    name: string;
  } | null;
  job: {
    id: string;
    jobNumber: string;
  } | null;
}

export interface DashboardActivity {
  id: string;
  title: string;
  description: string;
  time: string;
}

export interface DashboardNotification {
  id: string;
  action: string;
  targetModel: string;
  targetId: string;
  targetName: string | null;
  title: string;
  description: string;
  actorName: string;
  createdAt: string;
}

export interface DashboardJob {
  id: string;
  jobNumber: string;
  customer: string;
  type: "Export" | "Import";
  status: "Active" | "Pending" | "Canceled" | "Done";
  origin: string;
  destination: string;
  date: string;
}

export interface DashboardData {
  stats: {
    totalIncome: string;
    totalIncomeRaw: number;
    totalIncomeChange: number;
    activeJobs: number;
    activeJobsChange: number;
    pendingInvoices: number;
    pendingInvoicesChange: number;
    activeOffers: number;
    activeOffersChange: number;
  };
  recentJobs: DashboardJob[];
  upcomingEvents: DashboardActivity[];
  financialOverview: {
    categories: string[];
    income: number[];
    outcome: number[];
  };
}

export const useDashboard = () => {
  const stats = ref<DashboardStats | null>(null);
  const pendingApprovals = ref<PendingApprovalBl[]>([]);
  const notifications = ref<DashboardNotification[]>([]);
  const isLoading = ref(false);

  /**
   * Original Dashboard fetch (for dashboard.vue)
   */
  const fetchDashboard = async (params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<DashboardData | null> => {
    isLoading.value = true;
    try {
      const query = params ? `?${new URLSearchParams(params).toString()}` : "";
      const data = await $fetch<DashboardData>(`/api/admin/dashboard${query}`);
      return data;
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * New Owner Dashboard - Stats
   */
  const fetchStats = async () => {
    isLoading.value = true;
    try {
      const data = await $fetch<DashboardStats>(`/api/dashboard/stats`);
      stats.value = data;
    } catch (error) {
      console.error("Failed to fetch owner stats:", error);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * New Owner Dashboard - Pending Approvals
   */
  const fetchPendingApprovals = async () => {
    isLoading.value = true;
    try {
      const data = await $fetch<PendingApprovalBl[]>(`/api/dashboard/pending-approvals`);
      pendingApprovals.value = data;
    } catch (error) {
      console.error("Failed to fetch pending approvals:", error);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchNotifications = async (limit = 8) => {
    try {
      const data = await $fetch<DashboardNotification[]>(`/api/dashboard/notifications`, {
        query: { limit },
      });
      notifications.value = data;
      return data;
    } catch (error) {
      console.error("Failed to fetch dashboard notifications:", error);
      notifications.value = [];
      return [];
    }
  };

  const approveBl = async (id: string) => {
    try {
      const resp = await $fetch<{ success: boolean; error?: string }>(
        `/api/operational/jobs/bl/${id}/finalize`,
        {
          method: "POST",
        },
      );
      if (resp.success) {
        // Refresh pending approvals
        await fetchPendingApprovals();
        return { success: true };
      }
      return { success: false, error: resp.error || "Failed to approve BL" };
    } catch (error: unknown) {
      return {
        success: false,
        error: (error as { data?: { message?: string } })?.data?.message || "An error occurred",
      };
    }
  };

  return {
    // State
    stats,
    pendingApprovals,
    notifications,
    isLoading,

    // Methods
    fetchDashboard,
    fetchStats,
    fetchPendingApprovals,
    fetchNotifications,
    approveBl,
  };
};
