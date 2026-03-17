import type { Component } from "vue";
import { LayoutDashboard, Package, Ship, Wallet, BarChart3, Settings } from "lucide-vue-next";
import type { Organization } from "~/types/auth";

export interface NavChild {
  title: string;
  href: string;
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
      { title: "Company", href: "/master/company" },
      { title: "Service", href: "/master/services" },
      { title: "Vessel", href: "/master/vessel" },
    ],
  },
  {
    title: "Operational",
    icon: Ship,
    children: [
      { title: "Job", href: "/operational/jobs" },
      { title: "eBL", href: "/operational/ebl" },
      { title: "Closing Job", href: "/operational/closing" },
    ],
  },
  {
    title: "Finance",
    icon: Wallet,
    children: [
      { title: "Dashboard", href: "/finance/dashboard" },
      { title: "Invoice", href: "/finance/invoice" },
      { title: "Pembayaran", href: "/finance/payment" },
      { title: "Biaya Operasional", href: "/finance/expenses" },
      { title: "Pajak", href: "/finance/tax" },
    ],
  },
  {
    title: "Reports",
    icon: BarChart3,
    href: "/reports",
  },
  {
    title: "Settings",
    icon: Settings,
    children: [
      { title: "Users", href: "/settings/users" },
      { title: "Roles", href: "/settings/roles" },
      { title: "Tenant", href: "/settings/tenant" },
    ],
  },
];

export function useAppSidebar() {
  const { user, session, logout, listOrganizations, setActiveOrganization } = useAuth();
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

  const isActive = (href: string): boolean => route.path === href;

  const isChildActive = (children?: NavChild[]): boolean =>
    children?.some((child) => route.path === child.href) ?? false;

  // Lifecycle
  onMounted(async () => {
    if (user.value?.role === "admin") {
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

    // Methods
    handleLogout,
    toggleOrgDropdown,
    handleOrgSwitch,
    toggleExpand,
    isActive,
    isChildActive,
  };
}
