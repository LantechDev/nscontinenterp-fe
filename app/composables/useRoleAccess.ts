import type { Role } from "./useRoles";

type PermissionAction = "create" | "read" | "update" | "delete";

function normalizeRoleCode(role?: string | null) {
  return role?.trim().toLowerCase() || "";
}

function hasResourcePermission(
  role: Role | null | undefined,
  resource: string,
  action?: PermissionAction,
) {
  const actions = role?.permissions?.[resource] || [];
  if (!action) {
    return actions.length > 0;
  }

  return actions.includes(action);
}

export function useRoleAccess() {
  const { user } = useAuth();
  const { roles, fetchRoles } = useRoles();

  const isFetchingRoles = useState("role-access-loading", () => false);

  const normalizedUserRole = computed(() => normalizeRoleCode(user.value?.role));

  const isAdminRole = computed(() => {
    const role = normalizedUserRole.value;
    if (!role) {
      return false;
    }

    return ["admin", "administrator", "superadmin", "super_admin"].includes(role);
  });

  const currentRole = computed(() => {
    if (!user.value?.role) {
      return null;
    }

    return (
      roles.value.find((role) => normalizeRoleCode(role.code) === normalizedUserRole.value) || null
    );
  });

  const ensureRolesLoaded = async () => {
    if (process.server || !user.value?.role || isAdminRole.value || roles.value.length > 0) {
      return;
    }

    if (isFetchingRoles.value) {
      return;
    }

    isFetchingRoles.value = true;
    try {
      await fetchRoles();
    } finally {
      isFetchingRoles.value = false;
    }
  };

  const hasPermission = (resource: string, action: PermissionAction = "read") => {
    if (isAdminRole.value) {
      return true;
    }

    return hasResourcePermission(currentRole.value, resource, action);
  };

  const hasAnyPermission = (resource: string) => {
    if (isAdminRole.value) {
      return true;
    }

    return hasResourcePermission(currentRole.value, resource);
  };

  const canAccessFinance = () =>
    hasAnyPermission("invoice") || hasAnyPermission("payment") || hasAnyPermission("report");

  const isOwnProfileRoute = (path: string) => {
    const currentUserId = user.value?.id;
    if (!currentUserId) {
      return false;
    }

    return path === `/settings/users/${currentUserId}`;
  };

  const canAccessPath = (path: string) => {
    if (isAdminRole.value) {
      return true;
    }

    if (!path || path === "/" || path.startsWith("/dashboard")) {
      return true;
    }

    if (isOwnProfileRoute(path)) {
      return true;
    }

    if (
      path.startsWith("/master/company") ||
      path.startsWith("/master/services") ||
      path.startsWith("/master/vessel")
    ) {
      return hasAnyPermission("company");
    }

    if (path.startsWith("/operational/")) {
      return hasAnyPermission("job");
    }

    if (
      path.startsWith("/finance/dashboard") ||
      path.startsWith("/finance/finance-close") ||
      path.startsWith("/finance/tax") ||
      path.startsWith("/finance/trial-balance")
    ) {
      return canAccessFinance();
    }

    if (path.startsWith("/finance/invoice")) {
      return hasAnyPermission("invoice");
    }

    if (
      path.startsWith("/finance/expenses") ||
      path.startsWith("/finance/transactions") ||
      path.startsWith("/finance/journal")
    ) {
      return hasAnyPermission("payment");
    }

    if (path.startsWith("/settings/users")) {
      return hasAnyPermission("member");
    }

    if (path.startsWith("/settings/roles")) {
      return hasAnyPermission("member");
    }

    if (path.startsWith("/settings/activity-logs")) {
      return hasAnyPermission("report") || hasAnyPermission("organization");
    }

    if (path.startsWith("/settings/tenant")) {
      return hasAnyPermission("organization");
    }

    return true;
  };

  return {
    currentRole,
    ensureRolesLoaded,
    hasPermission,
    hasAnyPermission,
    canAccessPath,
    canAccessFinance,
    isAdminRole,
  };
}
