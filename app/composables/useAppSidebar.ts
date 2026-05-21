import type { Component } from "vue";
import {
  LayoutDashboard,
  Package,
  Ship,
  Wallet,
  Settings,
  Building2,
  Wrench,
  Anchor,
  Plane,
  Landmark,
  Percent,
  FileText,
  Calculator,
  ClipboardList,
  FileCheck,
  FolderClosed,
  BarChart3,
  BookOpen,
  Receipt,
  TrendingDown,
  Coins,
  WalletCards,
  Users,
  Shield,
  History,
  Globe,
} from "lucide-vue-next";
import type { Organization } from "~/types/auth";

export interface NavChild {
  title: string;
  href: string;
  icon?: Component;
}

export interface NavItem {
  title: string;
  href?: string;
  icon: Component;
  children?: NavChild[];
}

export const NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    title: "Master Data",
    icon: Package,
    children: [
      { title: "Company", href: "/master/company", icon: Building2 },
      { title: "Service", href: "/master/services", icon: Wrench },
      { title: "Vessel", href: "/master/vessel", icon: Anchor },
      { title: "Plane", href: "/master/plane", icon: Plane },
      { title: "Bank Account", href: "/master/bank-account", icon: Landmark },
      { title: "Pajak", href: "/master/tax", icon: Percent },
      { title: "B/L Conditions", href: "/master/bl-conditions", icon: FileText },
    ],
  },

  {
    title: "Operational",
    icon: Ship,
    children: [
      { title: "Quotation & Pricing", href: "/operational/quotations", icon: Calculator },
      { title: "Job", href: "/operational/jobs", icon: ClipboardList },
      { title: "eBL", href: "/operational/ebl", icon: FileCheck },
      { title: "Closing Job", href: "/operational/closing", icon: FolderClosed },
    ],
  },
  {
    title: "Finance",
    icon: Wallet,
    children: [
      { title: "Dashboard", href: "/finance/dashboard", icon: BarChart3 },
      { title: "Invoice", href: "/finance/invoice", icon: Receipt },
      { title: "Outstanding Report", href: "/finance/report/outstanding", icon: TrendingDown },
      { title: "Biaya Operasional", href: "/finance/expenses", icon: Coins },
      { title: "Chart of Accounts", href: "/finance/chart-of-accounts", icon: BookOpen },
      { title: "COA Mapping", href: "/finance/coa-mapping", icon: WalletCards },
    ],
  },
  // Backlog for now - Rafael, 25/03/2026
  // {
  //   title: "Reports",
  //   icon: BarChart3,
  //   href: "/reports",
  // },
  {
    title: "Settings",
    icon: Settings,
    children: [
      { title: "Users", href: "/settings/users", icon: Users },
      { title: "Roles", href: "/settings/roles", icon: Shield },
      { title: "Activity Logs", href: "/settings/activity-logs", icon: History },
      { title: "Tenant", href: "/settings/tenant", icon: Globe },
    ],
  },
];

export function useAppSidebar() {
  const { user, session, logout, listOrganizations, setActiveOrganization } = useAuth();
  const { canAccessPath, ensureRolesLoaded, isAdminRole } = useRoleAccess();
  const router = useRouter();

  const organizations = ref<Organization[]>([]);
  const isOrgDropdownOpen = ref(false);
  const isUserDropdownOpen = ref(false);
  const expandedItems = ref<string[]>(["Master Data", "Operational", "Finance"]);
  const route = useRoute();

  // Computed
  const currentOrg = computed(() => {
    if (!session.value?.activeOrganizationId) return null;
    return organizations.value.find((o) => o.id === session.value?.activeOrganizationId) || null;
  });

  const navItems = computed(() =>
    NAV_ITEMS.map((item) => {
      if (!item.children) {
        return canAccessPath(item.href || "") ? item : null;
      }

      const visibleChildren = item.children.filter((child) => canAccessPath(child.href));
      if (visibleChildren.length === 0) {
        return null;
      }

      return {
        ...item,
        children: visibleChildren,
      };
    }).filter((item): item is NavItem => item !== null),
  );

  // Methods
  const handleLogout = async () => {
    const res = await logout();
    if (res.success) {
      await router.push("/login");
    }
  };

  const toggleOrgDropdown = async () => {
    if (!isOrgDropdownOpen.value) {
      if (organizations.value.length === 0) {
        const { success, data } = await listOrganizations();
        if (success && data) {
          organizations.value = data;
        }
      }
    }
    isOrgDropdownOpen.value = !isOrgDropdownOpen.value;
  };

  const handleOrgSwitch = async (orgId: string) => {
    isOrgDropdownOpen.value = false;
    await setActiveOrganization(orgId);
    await router.push("/dashboard");
  };

  const toggleExpand = (title: string) => {
    if (expandedItems.value.includes(title)) {
      expandedItems.value = expandedItems.value.filter((item) => item !== title);
    } else {
      expandedItems.value = [...expandedItems.value, title];
    }
  };

  const isActive = (href: string): boolean => {
    if (route.path === href) return true;
    return route.path.startsWith(href + "/");
  };

  const isChildActive = (children?: NavChild[]): boolean =>
    children?.some((child) => isActive(child.href)) ?? false;

  // Lifecycle
  onMounted(async () => {
    await ensureRolesLoaded();

    if (isAdminRole.value) {
      const { success, data } = await listOrganizations();
      if (success && data) {
        organizations.value = data;
      }
    }
  });

  return {
    // State
    user,
    organizations,
    isOrgDropdownOpen,
    isUserDropdownOpen,
    expandedItems,

    // Computed
    currentOrg,
    navItems,

    // Methods
    handleLogout,
    toggleOrgDropdown,
    handleOrgSwitch,
    toggleExpand,
    isActive,
    isChildActive,
  };
}
