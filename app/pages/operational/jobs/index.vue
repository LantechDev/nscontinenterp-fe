<script setup lang="ts">
import { Plus, Search, Ship, Eye } from "lucide-vue-next";

definePageMeta({
    layout: "dashboard",
});

interface Job {
    id: string;
    number: string;
    customer: string;
    type: "export" | "import";
    origin: string;
    destination: string;
    status: "active" | "pending" | "completed";
    eta: string;
}

const jobs: Job[] = [
    { id: "1", number: "JOB-2024-001234", customer: "PT Maju Bersama", type: "export", origin: "Jakarta", destination: "Singapore", status: "active", eta: "12 Jan 2025" },
    { id: "2", number: "JOB-2024-001233", customer: "CV Sukses Makmur", type: "import", origin: "Shanghai", destination: "Surabaya", status: "pending", eta: "15 Jan 2025" },
    { id: "3", number: "JOB-2024-001232", customer: "PT Logistik Nusantara", type: "export", origin: "Semarang", destination: "Tokyo", status: "completed", eta: "5 Jan 2025" },
];

const statusConfig: Record<Job["status"], { label: string; class: string }> = {
    active: { label: "Aktif", class: "badge-success" },
    pending: { label: "Pending", class: "badge-warning" },
    completed: { label: "Selesai", class: "bg-muted text-muted-foreground" },
};
</script>

<template>
    <div class="space-y-6 animate-fade-in">
        <div class="page-header">
            <div>
                <h1 class="page-title">Job / Shipment</h1>
                <p class="text-muted-foreground mt-1">Kelola job dan shipment</p>
            </div>
            <NuxtLink to="/operational/jobs/create" class="btn-primary">
                <Plus class="w-4 h-4 mr-2" />
                Open Job Baru
            </NuxtLink>
        </div>

        <div class="card-elevated p-4">
            <div class="flex flex-col sm:flex-row gap-4">
                <div class="relative flex-1">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="text" placeholder="Cari job..." class="input-field pl-10" />
                </div>
                <select class="input-field w-32">
                    <option value="">Semua</option>
                    <option value="export">Export</option>
                    <option value="import">Import</option>
                </select>
            </div>
        </div>

        <div class="card-elevated overflow-hidden">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>No. Job</th>
                        <th>Customer</th>
                        <th>Rute</th>
                        <th>Tipe</th>
                        <th>ETA</th>
                        <th>Status</th>
                        <th class="w-20">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="job in jobs" :key="job.id" class="cursor-pointer hover:bg-muted/50"
                        @click="navigateTo(`/operational/jobs/${job.id}`)">
                        <td>
                            <div class="flex items-center gap-2">
                                <Ship class="w-4 h-4 text-primary" />
                                <span class="font-medium">{{ job.number }}</span>
                            </div>
                        </td>
                        <td>{{ job.customer }}</td>
                        <td class="text-muted-foreground">{{ job.origin }} → {{ job.destination }}</td>
                        <td>
                            <span
                                :class="['text-xs font-medium uppercase', job.type === 'export' ? 'text-chart-1' : 'text-chart-2']">
                                {{ job.type }}
                            </span>
                        </td>
                        <td class="text-muted-foreground">{{ job.eta }}</td>
                        <td>
                            <span
                                :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', statusConfig[job.status]?.class]">
                                {{ statusConfig[job.status]?.label }}
                            </span>
                        </td>
                        <td>
                            <NuxtLink :to="`/operational/jobs/${job.id}`"
                                class="p-1.5 rounded hover:bg-muted transition-colors inline-flex" @click.stop>
                                <Eye class="w-4 h-4 text-muted-foreground" />
                            </NuxtLink>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
