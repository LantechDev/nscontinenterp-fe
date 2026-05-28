import type { Role } from "./useRoles";
import { type AccessLevel, hasAccessLevel, normalizeAccessLevel } from "~/lib/permission-registry";

type PermissionAction = "create" | "read" | "update" | "delete";

function normalizeRoleCode(role?: string | null) {
  return role?.trim().toLowerCase() || "";
}

function hasResourcePermission(
  role: Role | null | undefined,
  resource: string,
  action?: PermissionAction,
) {
  const value = role?.permissions?.[resource];
  const actions = Array.isArray(value) ? value : [];
  if (!action) {
    return actions.length > 0;
  }

  return actions.includes(action);
}

const legacyFeatureMap: Record<string, string> = {
  company: "master.company",
  job: "operational.job",
  ebl: "operational.ebl",
  invoice: "finance.invoice",
  payment: "finance.payment",
  report: "finance.report",
  organization: "settings.tenant",
  member: "settings.user",
  invitation: "settings.user",
};

function legacyActionLevel(actions: string[]): AccessLevel {
  if (actions.some((action) => ["approve", "post", "void"].includes(action))) return "approve";
  if (actions.some((action) => ["create", "update", "delete", "remove"].includes(action))) {
    return "manage";
  }
  if (actions.includes("read")) return "view";
  return "none";
}

function getFeatureAccess(role: Role | null | undefined, feature: string): AccessLevel {
  const permissions = role?.permissions || {};
  const direct = (permissions as Record<string, unknown>)[feature];
  if (typeof direct === "string") {
    return normalizeAccessLevel(direct);
  }

  let resolved: AccessLevel = "none";
  for (const [key, value] of Object.entries(permissions as Record<string, unknown>)) {
    if (legacyFeatureMap[key] !== feature || !Array.isArray(value)) continue;
    const level = legacyActionLevel(
      value.filter((item): item is string => typeof item === "string"),
    );
    if (hasAccessLevel(level, resolved)) {
      resolved = level;
    }
  }
  return resolved;
}

export function useRoleAccess() {
  const { user } = useAuth();
  const { roles, fetchRoles } = useRoles();

  const isFetchingRoles = useState("role-access-loading", () => false);

  const normalizedUserRole = computed(() => normalizeRoleCode(user.value?.role));
  const normalizedOrganizationRole = computed(() =>
    normalizeRoleCode(user.value?.organizationRole),
  );

  const isAdminRole = computed(() => {
    if (user.value?.customRole) {
      return false;
    }

    const elevatedRoles = [
      "admin",
      "administrator",
      "superadmin",
      "super_admin",
      "owner",
      "director",
    ];
    const role = normalizedUserRole.value;
    const organizationRole = normalizedOrganizationRole.value;
    if (!role && !organizationRole) {
      return false;
    }

    return elevatedRoles.includes(role) || elevatedRoles.includes(organizationRole);
  });

  const currentRole = computed(() => {
    if (user.value?.customRole) {
      return {
        id: user.value.customRole.id,
        code: user.value.customRole.code,
        name: user.value.customRole.name,
        description: null,
        permissions: user.value.customRole.permissions,
        isActive: true,
        createdAt: "",
        updatedAt: "",
      } satisfies Role;
    }

    if (!user.value?.role) {
      return null;
    }

    return (
      roles.value.find((role) => normalizeRoleCode(role.code) === normalizedUserRole.value) || null
    );
  });

  const ensureRolesLoaded = async () => {
    if (
      process.server ||
      !user.value?.role ||
      user.value?.customRole ||
      !isAdminRole.value ||
      roles.value.length > 0
    ) {
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

  const hasAccess = (feature: string, requiredLevel: AccessLevel = "view") => {
    if (isAdminRole.value) {
      return true;
    }

    return hasAccessLevel(getFeatureAccess(currentRole.value, feature), requiredLevel);
  };

  const canAccessFinance = () =>
    hasAccess("finance.invoice") ||
    hasAccess("finance.payment") ||
    hasAccess("finance.accounting") ||
    hasAccess("finance.report");

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

    if (path === "/master/tax/create") return hasAccess("master.finance", "manage");
    if (path === "/master/services/create") return hasAccess("master.service", "manage");
    if (path === "/operational/jobs/create") return hasAccess("operational.job", "manage");
    if (path.match(/^\/operational\/jobs\/[^/]+\/edit$/)) {
      return hasAccess("operational.job", "manage");
    }
    if (path === "/operational/quotations/create") {
      return hasAccess("operational.quotation", "manage");
    }
    if (path.match(/^\/operational\/quotations\/[^/]+\/edit$/)) {
      return hasAccess("operational.quotation", "manage");
    }
    if (path === "/finance/invoice/create") return hasAccess("finance.invoice", "manage");
    if (path === "/finance/transactions/create") {
      return hasAccess("finance.payment", "manage") || hasAccess("finance.accounting", "manage");
    }
    if (path === "/finance/journal/create") return hasAccess("finance.accounting", "manage");
    if (path === "/settings/users/create" || path.match(/^\/settings\/users\/[^/]+\/edit$/)) {
      return hasAccess("settings.user", "manage");
    }
    if (path === "/settings/roles/create" || path.match(/^\/settings\/roles\/[^/]+\/edit$/)) {
      return hasAccess("settings.role", "manage");
    }

    if (
      path.startsWith("/master/company") ||
      path.startsWith("/master/services") ||
      path.startsWith("/master/vessel") ||
      path.startsWith("/master/plane") ||
      path.startsWith("/master/bank-account") ||
      path.startsWith("/master/tax") ||
      path.startsWith("/master/bl-conditions") ||
      path.startsWith("/master/service-categories") ||
      path.startsWith("/master/service-units") ||
      path.startsWith("/master/package-types") ||
      path.startsWith("/master/cargo-movements") ||
      path.startsWith("/master/delivery-movements")
    ) {
      if (path.startsWith("/master/company")) return hasAccess("master.company");
      if (path.startsWith("/master/services") || path.startsWith("/master/service-")) {
        return hasAccess("master.service");
      }
      if (path.startsWith("/master/bank-account") || path.startsWith("/master/tax")) {
        return hasAccess("master.finance");
      }
      return hasAccess("master.logistics");
    }

    if (path.startsWith("/operational/quotations")) {
      return hasAccess("operational.quotation");
    }

    if (path.startsWith("/operational/ebl")) {
      return hasAccess("operational.ebl");
    }

    if (path.startsWith("/operational/")) {
      return hasAccess("operational.job");
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
      return hasAccess("finance.invoice");
    }

    if (
      path.startsWith("/finance/chart-of-accounts") ||
      path.startsWith("/finance/coa-mapping") ||
      path.startsWith("/finance/expenses") ||
      path.startsWith("/finance/transactions") ||
      path.startsWith("/finance/journal")
    ) {
      return hasAccess("finance.payment") || hasAccess("finance.accounting");
    }

    if (path.startsWith("/settings/users")) {
      return hasAccess("settings.user");
    }

    if (path.startsWith("/settings/roles")) {
      return hasAccess("settings.role");
    }

    if (path.startsWith("/settings/activity-logs")) {
      return hasAccess("settings.activityLog") || hasAccess("settings.tenant");
    }

    if (path.startsWith("/settings/tenant")) {
      return hasAccess("settings.tenant");
    }

    return true;
  };

  return {
    currentRole,
    ensureRolesLoaded,
    hasPermission,
    hasAnyPermission,
    hasAccess,
    canAccessPath,
    canAccessFinance,
    isAdminRole,
  };
}
