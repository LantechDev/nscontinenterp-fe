<script setup lang="ts">
import { Wallet, Ship, Receipt, FileText, Calendar, Download, Plus } from "lucide-vue-next";

definePageMeta({
    layout: "dashboard",
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
                <button
                    class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors"
                >
                    <Plus class="w-4 h-4" />
                    <span>Quick Add</span>
                </button>
            </div>
        </div>

        <!-- Stats grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardStatCard
                title="Total Income"
                value="Rp800.023.000"
                :change="18.7"
                icon-name="Wallet"
                :icon="Wallet"
                variant="primary"
            />
            <DashboardStatCard
                title="Active Job"
                value="25"
                :change="8.2"
                change-label="vs Last Year"
                :icon="Ship"
            />
            <DashboardStatCard
                title="Invoice Pending"
                value="12"
                :change="-3.4"
                change-label="vs Last Year"
                :icon="Receipt"
            />
            <DashboardStatCard
                title="Active Offer"
                value="23"
                :change="18.7"
                change-label="vs Last Year"
                :icon="FileText"
            />
        </div>

        <!-- Charts and tables row -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2">
                <DashboardRevenueChart />
            </div>
            <div>
                <DashboardUpcomingActivities />
            </div>
        </div>

        <!-- Recent jobs -->
        <DashboardRecentJobs />
    </div>
</template>
