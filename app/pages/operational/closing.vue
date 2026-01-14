<script setup lang="ts">
import { Search, CheckCircle, Clock } from "lucide-vue-next";

definePageMeta({
    layout: "dashboard",
});

const closingJobs = [
    { id: "1", number: "JOB-2024-001232", customer: "PT Logistik Nusantara", totalRevenue: "Rp 32.500.000", totalCost: "Rp 24.200.000", profit: "Rp 8.300.000", status: "closed" },
    { id: "2", number: "JOB-2024-001230", customer: "PT Maju Bersama", totalRevenue: "Rp 28.000.000", totalCost: "Rp 21.500.000", profit: "Rp 6.500.000", status: "pending" },
];
</script>

<template>
    <div class="space-y-6 animate-fade-in">
        <div class="page-header">
            <div>
                <h1 class="page-title">Closing Job</h1>
                <p class="text-muted-foreground mt-1">Tutup job dan hitung profit</p>
            </div>
        </div>

        <div class="card-elevated p-4">
            <div class="relative">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" placeholder="Cari job untuk closing..." class="input-field pl-10" />
            </div>
        </div>

        <div class="card-elevated overflow-hidden">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>No. Job</th>
                        <th>Customer</th>
                        <th>Total Revenue</th>
                        <th>Total Cost</th>
                        <th>Profit</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="job in closingJobs" :key="job.id">
                        <td class="font-medium">{{ job.number }}</td>
                        <td>{{ job.customer }}</td>
                        <td class="text-success">{{ job.totalRevenue }}</td>
                        <td class="text-destructive">{{ job.totalCost }}</td>
                        <td class="font-bold text-primary">{{ job.profit }}</td>
                        <td>
                            <span v-if="job.status === 'closed'" class="badge-success flex items-center gap-1 w-fit">
                                <CheckCircle class="w-3 h-3" /> Closed
                            </span>
                            <span v-else class="badge-warning flex items-center gap-1 w-fit">
                                <Clock class="w-3 h-3" /> Pending
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
