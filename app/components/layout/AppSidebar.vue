<script setup lang="ts">
import {
    LayoutDashboard,
    Package,
    FileText,
    Ship,
    Wallet,
    BarChart3,
    Settings,
    ChevronDown,
    ChevronRight,
    User,
    Building2,
} from "lucide-vue-next"; // Added User, Building2 for icons
import { cn } from "~/lib/utils";
import type { Organization } from "~/types/auth";

const { user, session, logout, listOrganizations, setActiveOrganization } = useAuth();
const router = useRouter();

const organizations = ref<Organization[]>([]);
const isOrgDropdownOpen = ref(false);

const currentOrg = computed(() => {
    if (!session.value?.activeOrganizationId) return null;
    return organizations.value.find(o => o.id === session.value?.activeOrganizationId) || null;
});

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
    window.location.reload();
};

onMounted(async () => {
    if (user.value?.role === 'admin') {
        const { success, data } = await listOrganizations();
        if (success && data) {
            organizations.value = data;
        }
    }
});

interface NavChild {
    title: string;
    href: string;
}

interface NavItem {
    title: string;
    href?: string;
    icon: any;
    children?: NavChild[];
}

const navItems: NavItem[] = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    {
        title: "Master Data",
        icon: Package,
        children: [
            { title: "Customer", href: "/master/customer" },
            { title: "Vendor", href: "/master/vendor" },
            { title: "Service", href: "/master/services" }, // Changed Jasa to Service per image
        ],
    },
    {
        title: "Operational",
        icon: Ship,
        children: [
            { title: "Job", href: "/operational/jobs" }, // Simplified title
            { title: "eBL", href: "/operational/ebl" },
            { title: "Closing Job", href: "/operational/closing" },
        ],
    },
    {
        title: "Finance",
        icon: Wallet,
        children: [
            { title: "Invoice", href: "/finance/invoice" },
            { title: "Pembayaran", href: "/finance/payment" },
            { title: "Biaya Operasional", href: "/finance/expenses" },
            { title: "Pajak", href: "/finance/tax" },
        ],
    },
    {
        title: "Reports",
        icon: BarChart3, // Reports has > arrow in image, implies children or link. Assuming link for now or children. Image shows > on right? No, standard item.
        href: "/reports"
    },
    // Removed Settings/Sales to match image strictly or keep if needed? Image doesn't show Sales/Settings but lists are truncated. I'll keep Reports and remove others if not in image, but user said "samain layout". I will align strictly to image visible items: Dashboard, Master Data, Operational, Finance, Reports.
];

const route = useRoute();
const expandedItems = ref<string[]>([
    "Master Data",
    "Operational",
    "Finance",
]);

const toggleExpand = (title: string) => {
    if (expandedItems.value.includes(title)) {
        expandedItems.value = expandedItems.value.filter((item) => item !== title);
    } else {
        expandedItems.value = [...expandedItems.value, title];
    }
};

const isActive = (href: string) => route.path === href;
const isChildActive = (children?: NavChild[]) =>
    children?.some((child) => route.path === child.href);

// Image footer shows User Profile with arrow right. I'll make it a link to settings/profile.
</script>

<template>
    <aside
        class="fixed left-0 top-0 z-40 h-screen w-64 bg-[#012D5A] text-white flex flex-col font-sans transition-all duration-300">
        <!-- Logo / Organization Switcher -->
        <div class="px-4 py-4 mb-2">
            <button @click="toggleOrgDropdown"
                class="flex items-center justify-between w-full px-3 py-2.5 bg-[#1e4a7a]/50 rounded-lg hover:bg-[#1e4a7a]/70 transition-colors border border-white/10">
                <div class="flex items-center gap-3 min-w-0">
                    <div class="w-8 h-8 rounded-md bg-white flex items-center justify-center shrink-0">
                        <!-- Placeholder logo from image -->
                        <div class="text-[#012D5A] font-bold text-xs">NS</div>
                    </div>
                    <span class="font-medium text-sm truncate">{{ currentOrg?.name || 'NS Continent' }}</span>
                </div>
                <div class="flex flex-col gap-0.5">
                    <ChevronDown class="w-4 h-4 text-white/70" />
                </div>
            </button>

            <!-- Org Dropdown -->
            <div v-if="isOrgDropdownOpen"
                class="absolute top-16 left-4 w-56 bg-white text-slate-900 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div class="py-1">
                    <button v-for="org in organizations" :key="org.id" @click="handleOrgSwitch(org.id)"
                        class="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 transition-colors">
                        {{ org.name }}
                    </button>
                    <div v-if="organizations.length === 0" class="px-4 py-2 text-xs text-slate-500">No organizations
                    </div>
                </div>
            </div>
            <div v-if="isOrgDropdownOpen" @click="isOrgDropdownOpen = false" class="fixed inset-0 z-40 bg-transparent">
            </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto px-4 space-y-1">
            <NuxtLink to="/dashboard" :class="cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive('/dashboard') ? 'bg-[#1e4a7a]/50 text-white' : 'text-white/80 hover:bg-white/5 hover:text-white'
            )">
                <LayoutDashboard class="w-5 h-5" />
                <span>Dashboard</span>
            </NuxtLink>

            <template v-for="item in navItems.slice(1)" :key="item.title">
                <div v-if="item.children" class="space-y-1">
                    <button @click="toggleExpand(item.title)" :class="cn(
                        'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                        (isChildActive(item.children) || expandedItems.includes(item.title)) ? 'text-white' : 'text-white/80 hover:bg-white/5 hover:text-white'
                    )">
                        <div class="flex items-center gap-3">
                            <component :is="item.icon" class="w-5 h-5" />
                            <span>{{ item.title }}</span>
                        </div>
                        <ChevronDown class="w-4 h-4 transition-transform duration-200"
                            :class="expandedItems.includes(item.title) ? 'rotate-180' : ''" />
                    </button>

                    <div v-if="expandedItems.includes(item.title)" class="space-y-1 pl-3"> <!-- Changed indentation -->
                        <NuxtLink v-for="child in item.children" :key="child.href" :to="child.href" :class="cn(
                            'block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                            isActive(child.href)
                                ? 'bg-[#1e4a7a] text-white font-medium'
                                : 'text-white/70 hover:text-white hover:bg-white/5'
                        )">
                            {{ child.title }}
                        </NuxtLink>
                    </div>
                </div>

                <NuxtLink v-else :to="item.href!" :class="cn(
                    'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive(item.href!) ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/5 hover:text-white'
                )">
                    <div class="flex items-center gap-3">
                        <component :is="item.icon" class="w-5 h-5" />
                        <span>{{ item.title }}</span>
                    </div>
                    <ChevronRight class="w-4 h-4 text-white/50" />
                </NuxtLink>
            </template>
        </nav>

        <!-- Footer / User -->
        <div class="p-4 mt-auto">
            <NuxtLink v-if="user" :to="`/settings/users/${user.id}`"
                class="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer">
                <div class="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#012D5A] shrink-0">
                    <User class="w-6 h-6" />
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-white truncate">{{ user.name }}</p>
                    <p class="text-xs text-white/60 truncate">{{ user.email }}</p>
                </div>
                <ChevronRight class="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
            </NuxtLink>
        </div>
    </aside>
</template>
