export interface ActivityLog {
  id: string;
  userId: string | null;
  organizationId: string | null;
  action: ActivityAction;
  targetModel: string;
  targetId: string;
  targetName: string | null;
  description: string | null;
  oldData: Record<string, unknown> | null;
  newData: Record<string, unknown> | null;
  method: string | null;
  path: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  statusCode: number | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export type ActivityAction =
  | "LOGIN"
  | "LOGOUT"
  | "LOGIN_FAILED"
  | "CREATE"
  | "READ"
  | "UPDATE"
  | "DELETE"
  | "EXPORT"
  | "IMPORT"
  | "APPROVE"
  | "REJECT"
  | "SUBMIT"
  | "CANCEL"
  | "CLOSE"
  | "OPEN"
  | "ARCHIVE"
  | "RESTORE";

export const ACTIVITY_ACTIONS: ActivityAction[] = [
  "LOGIN",
  "LOGOUT",
  "LOGIN_FAILED",
  "CREATE",
  "READ",
  "UPDATE",
  "DELETE",
  "EXPORT",
  "IMPORT",
  "APPROVE",
  "REJECT",
  "SUBMIT",
  "CANCEL",
  "CLOSE",
  "OPEN",
  "ARCHIVE",
  "RESTORE",
];

export interface ActivityLogFilters {
  userId?: string;
  organizationId?: string;
  action?: ActivityAction;
  targetModel?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  logs: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function getApiBase() {
  const config = useRuntimeConfig();
  return config.public.apiBase as string;
}

export async function getActivityLogs(filters: ActivityLogFilters = {}) {
  const params = new URLSearchParams();

  if (filters.userId) params.append("userId", filters.userId);
  if (filters.organizationId) params.append("organizationId", filters.organizationId);
  if (filters.action) params.append("action", filters.action);
  if (filters.targetModel) params.append("targetModel", filters.targetModel);
  if (filters.startDate) params.append("startDate", filters.startDate);
  if (filters.endDate) params.append("endDate", filters.endDate);
  if (filters.page) params.append("page", String(filters.page));
  if (filters.limit) params.append("limit", String(filters.limit));

  const response = await $fetch<PaginatedResponse<ActivityLog>>(
    `${getApiBase()}/admin/activity-logs?${params.toString()}`,
    {
      credentials: "include",
    },
  );

  return response;
}

export async function getRecentActivityLogs(organizationId?: string, limit = 10) {
  const params = new URLSearchParams();

  if (organizationId) params.append("organizationId", organizationId);
  params.append("limit", String(limit));

  const response = await $fetch<{ logs: ActivityLog[] }>(
    `${getApiBase()}/admin/activity-logs/recent?${params.toString()}`,
    {
      credentials: "include",
    },
  );

  return response.logs;
}

export function getActionLabel(action: ActivityAction): string {
  const labels: Record<ActivityAction, string> = {
    LOGIN: "Login",
    LOGOUT: "Logout",
    LOGIN_FAILED: "Login Failed",
    CREATE: "Created",
    READ: "Viewed",
    UPDATE: "Updated",
    DELETE: "Deleted",
    EXPORT: "Exported",
    IMPORT: "Imported",
    APPROVE: "Approved",
    REJECT: "Rejected",
    SUBMIT: "Submitted",
    CANCEL: "Cancelled",
    CLOSE: "Closed",
    OPEN: "Opened",
    ARCHIVE: "Archived",
    RESTORE: "Restored",
  };
  return labels[action] || action;
}

export function getActionColor(action: ActivityAction): string {
  const colors: Record<ActivityAction, string> = {
    LOGIN: "text-green-600 bg-green-50",
    LOGOUT: "text-gray-600 bg-gray-50",
    LOGIN_FAILED: "text-red-600 bg-red-50",
    CREATE: "text-blue-600 bg-blue-50",
    READ: "text-gray-600 bg-gray-50",
    UPDATE: "text-yellow-600 bg-yellow-50",
    DELETE: "text-red-600 bg-red-50",
    EXPORT: "text-purple-600 bg-purple-50",
    IMPORT: "text-indigo-600 bg-indigo-50",
    APPROVE: "text-green-600 bg-green-50",
    REJECT: "text-red-600 bg-red-50",
    SUBMIT: "text-blue-600 bg-blue-50",
    CANCEL: "text-gray-600 bg-gray-50",
    CLOSE: "text-orange-600 bg-orange-50",
    OPEN: "text-green-600 bg-green-50",
    ARCHIVE: "text-gray-600 bg-gray-50",
    RESTORE: "text-blue-600 bg-blue-50",
  };
  return colors[action] || "text-gray-600 bg-gray-50";
}
