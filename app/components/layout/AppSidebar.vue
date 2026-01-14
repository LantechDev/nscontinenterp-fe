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
    LogOut,
} from "lucide-vue-next";
import { cn } from "~/lib/utils";

interface NavChild {
    title: string;
    href: string;
}

interface NavItem {
    title: string;
    href?: string;
    icon: typeof LayoutDashboard;
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
            { title: "Jasa", href: "/master/services" },
        ],
    },
    {
        title: "Sales",
        icon: FileText,
        children: [{ title: "Penawaran", href: "/sales/quotation" }],
    },
    {
        title: "Operational",
        icon: Ship,
        children: [
            { title: "Job / Shipment", href: "/operational/jobs" },
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
        icon: BarChart3,
        children: [
            { title: "Laba Rugi", href: "/reports/profit-loss" },
            { title: "Arus Kas", href: "/reports/cashflow" },
        ],
    },
    {
        title: "Settings",
        icon: Settings,
        children: [{ title: "User & Role", href: "/settings/users" }],
    },
];

const route = useRoute();
const expandedItems = ref<string[]>([
    "Master Data",
    "Sales",
    "Operational",
    "Finance",
    "Reports",
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
</script>

<template>
    <aside class="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <!-- Logo -->
        <div class="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
            <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-sidebar-primary/10">
                <img src="/favicon.png" alt="Logo" class="w-7 h-7" />
            </div>
            <div>
                <h1 class="text-lg font-bold text-sidebar-foreground">Lantech</h1>
                <p class="text-xs text-sidebar-muted">E-Report Finance</p>
            </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 space-y-1">
            <template v-for="item in navItems" :key="item.title">
                <!-- Item with children -->
                <div v-if="item.children && item.children.length > 0">
                    <button :class="cn(
                        'w-full sidebar-link',
                        isChildActive(item.children) && 'text-sidebar-primary',
                    )
                        " @click="toggleExpand(item.title)">
                        <component :is="item.icon" class="w-5 h-5" />
                        <span class="flex-1 text-left text-sm">{{ item.title }}</span>
                        <ChevronDown v-if="expandedItems.includes(item.title)" class="w-4 h-4" />
                        <ChevronRight v-else class="w-4 h-4" />
                    </button>
                    <div v-if="expandedItems.includes(item.title)" class="ml-8 mt-1 space-y-1 animate-fade-in">
                        <NuxtLink v-for="child in item.children" :key="child.href" :to="child.href" :class="cn(
                            'block px-3 py-2 rounded-lg text-sm transition-all duration-200',
                            isActive(child.href)
                                ? 'text-sidebar-primary bg-sidebar-accent font-medium'
                                : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50',
                        )
                            ">
                            {{ child.title }}
                        </NuxtLink>
                    </div>
                </div>

                <!-- Direct link item -->
                <NuxtLink v-else :to="item.href!" :class="cn('sidebar-link', isActive(item.href!) && 'sidebar-link-active')
                    ">
                    <component :is="item.icon" class="w-5 h-5" />
                    <span class="text-sm">{{ item.title }}</span>
                </NuxtLink>
            </template>
        </nav>

        <!-- User section -->
        <div class="p-4 border-t border-sidebar-border">
            <div class="flex items-center gap-3 px-3 py-2">
                <div class="w-9 h-9 rounded-full bg-sidebar-accent flex items-center justify-center">
                    <span class="text-sm font-medium text-sidebar-primary">D</span>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-sidebar-foreground truncate">
                        Direktur
                    </p>
                    <p class="text-xs text-sidebar-muted truncate">Superuser</p>
                </div>
                <button class="p-2 rounded-lg hover:bg-sidebar-accent transition-colors">
                    <LogOut class="w-4 h-4 text-sidebar-muted" />
                </button>
            </div>
        </div>
    </aside>
</template>
