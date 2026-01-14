<script setup lang="ts">
import { Wallet, Ship, Receipt, FileText, TrendingUp } from "lucide-vue-next";

definePageMeta({
    layout: "dashboard",
});
</script>

<template>
    <div class="space-y-6 animate-fade-in">
        <!-- Page header -->
        <div class="page-header">
            <div>
                <h1 class="page-title">Dashboard</h1>
                <p class="text-muted-foreground mt-1">
                    Selamat datang kembali! Ini ringkasan bisnis Anda.
                </p>
            </div>
            <button class="btn-primary">
                <TrendingUp class="w-4 h-4 mr-2" />
                Lihat Laporan
            </button>
        </div>

        <!-- Quick actions -->
        <DashboardQuickActions />

        <!-- Stats grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardStatCard title="Total Pendapatan" value="Rp 805.000.000" :change="12.5"
                change-label="vs bulan lalu" :icon="Wallet" variant="primary" />
            <DashboardStatCard title="Job Aktif" value="24" :change="8.2" change-label="vs minggu lalu" :icon="Ship" />
            <DashboardStatCard title="Invoice Pending" value="12" :change="-3.1" change-label="vs minggu lalu"
                :icon="Receipt" variant="warning" />
            <DashboardStatCard title="Penawaran Aktif" value="8" :change="15.3" change-label="vs minggu lalu"
                :icon="FileText" variant="success" />
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
