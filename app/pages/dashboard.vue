<script setup lang="ts">
import { Wallet, Ship, Receipt, FileText, Calendar, Download, Plus } from "lucide-vue-next";

definePageMeta({
    layout: "dashboard",
});

const { fetchDashboard } = useDashboard();

// State
const loading = ref(true);
const dashboardData = ref<DashboardData | null>(null);

// Fetch dashboard data
onMounted(async () => {
    loading.value = true;
    dashboardData.value = await fetchDashboard();
    loading.value = false;
});
</script>

<template>
    <div class="space-y-6 animate-fade-in pb-10">
        <!-- Page header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 class="page-title text-2xl font-bold">Dashboard</h1>

            <div class="flex items-center gap-2">
                <button
                    class="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                >
                    <Calendar class="w-4 h-4 text-muted-foreground" />
                    <span
                        >Time Period:
                        <span class="text-foreground font-semibold">Jan - Dec, 2025</span></span
                    >
                </button>
                <button
                    class="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                >
                    <Download class="w-4 h-4 text-muted-foreground" />
                    <span>Export</span>
                </button>
                <NuxtLink
                    to="/operational/jobs/create"
                    class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors"
                >
                    <Plus class="w-4 h-4" />
                    <span>Quick Add</span>
                </NuxtLink>
            </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
                v-for="i in 4"
                :key="i"
                class="card-stat p-4 rounded-xl border border-border animate-pulse"
            >
                <div class="h-4 bg-muted rounded w-1/2 mb-3"></div>
                <div class="h-8 bg-muted rounded w-3/4"></div>
            </div>
        </div>

        <!-- Stats grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardStatCard
                title="Total Income"
                :value="dashboardData?.stats?.totalIncome || 'Rp0'"
                :change="18.7"
                icon-name="Wallet"
                :icon="Wallet"
                variant="primary"
            />
            <DashboardStatCard
                title="Active Job"
                :value="String(dashboardData?.stats?.activeJobs || 0)"
                :change="8.2"
                change-label="vs Last Year"
                :icon="Ship"
            />
            <DashboardStatCard
                title="Invoice Pending"
                :value="String(dashboardData?.stats?.pendingInvoices || 0)"
                :change="-3.4"
                change-label="vs Last Year"
                :icon="Receipt"
            />
            <DashboardStatCard
                title="Active Offer"
                :value="String(dashboardData?.stats?.activeOffers || 0)"
                :change="18.7"
                change-label="vs Last Year"
                :icon="FileText"
            />
        </div>

        <!-- Charts and tables row -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2">
                <DashboardRevenueChart :data="dashboardData?.financialOverview" />
            </div>
            <div>
                <DashboardUpcomingActivities :events="dashboardData?.upcomingEvents" />
            </div>
        </div>

        <!-- Recent jobs -->
        <DashboardRecentJobs :jobs="dashboardData?.recentJobs" />
    </div>
</template>
