<script setup lang="ts">
import { Download, TrendingUp, TrendingDown } from "lucide-vue-next";

definePageMeta({
    layout: "dashboard",
});

const summary = {
    totalRevenue: "Rp 805.000.000",
    totalCost: "Rp 542.000.000",
    grossProfit: "Rp 263.000.000",
    profitMargin: "32.7%",
};

const categories = [
    { name: "Pendapatan Jasa Pengiriman", amount: "Rp 650.000.000", type: "income" },
    { name: "Pendapatan Jasa Customs", amount: "Rp 120.000.000", type: "income" },
    { name: "Pendapatan Lainnya", amount: "Rp 35.000.000", type: "income" },
    { name: "Biaya Operasional", amount: "Rp 380.000.000", type: "expense" },
    { name: "Biaya Overhead", amount: "Rp 95.000.000", type: "expense" },
    { name: "Biaya Lainnya", amount: "Rp 67.000.000", type: "expense" },
];
</script>

<template>
    <div class="space-y-6 animate-fade-in">
        <div class="page-header">
            <div>
                <h1 class="page-title">Laporan Laba Rugi</h1>
                <p class="text-muted-foreground mt-1">Periode: Januari 2025</p>
            </div>
            <button class="btn-outline">
                <Download class="w-4 h-4 mr-2" />
                Export PDF
            </button>
        </div>

        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="stat-card">
                <p class="text-sm text-muted-foreground mb-1">Total Pendapatan</p>
                <p class="text-2xl font-bold text-success">{{ summary.totalRevenue }}</p>
            </div>
            <div class="stat-card">
                <p class="text-sm text-muted-foreground mb-1">Total Biaya</p>
                <p class="text-2xl font-bold text-destructive">{{ summary.totalCost }}</p>
            </div>
            <div class="stat-card">
                <p class="text-sm text-muted-foreground mb-1">Laba Kotor</p>
                <p class="text-2xl font-bold text-primary">{{ summary.grossProfit }}</p>
            </div>
            <div class="stat-card">
                <p class="text-sm text-muted-foreground mb-1">Margin Laba</p>
                <p class="text-2xl font-bold text-accent">{{ summary.profitMargin }}</p>
            </div>
        </div>

        <!-- Detail Table -->
        <div class="card-elevated overflow-hidden">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Kategori</th>
                        <th class="text-right">Jumlah</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="category in categories" :key="category.name">
                        <td>
                            <div class="flex items-center gap-2">
                                <TrendingUp v-if="category.type === 'income'" class="w-4 h-4 text-success" />
                                <TrendingDown v-else class="w-4 h-4 text-destructive" />
                                {{ category.name }}
                            </div>
                        </td>
                        <td
                            :class="['text-right font-medium', category.type === 'income' ? 'text-success' : 'text-destructive']">
                            {{ category.amount }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
