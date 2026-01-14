<script setup lang="ts">
import { Ship } from "lucide-vue-next";
import { cn } from "~/lib/utils";

interface Job {
    id: string;
    jobNumber: string;
    customer: string;
    type: "export" | "import";
    status: "active" | "pending" | "completed";
    origin: string;
    destination: string;
    date: string;
}

const jobs: Job[] = [
    {
        id: "1",
        jobNumber: "JOB-2024-001234",
        customer: "PT Maju Bersama",
        type: "export",
        status: "active",
        origin: "Jakarta",
        destination: "Singapore",
        date: "7 Jan 2025",
    },
    {
        id: "2",
        jobNumber: "JOB-2024-001233",
        customer: "CV Sukses Makmur",
        type: "import",
        status: "pending",
        origin: "Shanghai",
        destination: "Surabaya",
        date: "6 Jan 2025",
    },
    {
        id: "3",
        jobNumber: "JOB-2024-001232",
        customer: "PT Logistik Nusantara",
        type: "export",
        status: "completed",
        origin: "Semarang",
        destination: "Tokyo",
        date: "5 Jan 2025",
    },
    {
        id: "4",
        jobNumber: "JOB-2024-001231",
        customer: "PT Indo Shipping",
        type: "import",
        status: "active",
        origin: "Busan",
        destination: "Jakarta",
        date: "4 Jan 2025",
    },
];

const statusConfig: Record<string, { label: string; class: string }> = {
    active: { label: "Aktif", class: "badge-success" },
    pending: { label: "Pending", class: "badge-warning" },
    completed: { label: "Selesai", class: "text-muted-foreground bg-muted" },
};
</script>

<template>
    <div class="card-elevated p-6">
        <div class="flex items-center justify-between mb-4">
            <h3 class="section-title mb-0">Job Terbaru</h3>
            <button class="text-sm text-accent hover:text-accent/80 font-medium transition-colors">
                Lihat Semua
            </button>
        </div>
        <div class="space-y-3">
            <div v-for="job in jobs" :key="job.id"
                class="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group">
                <div :class="cn(
                    'p-2.5 rounded-lg',
                    job.type === 'export' ? 'bg-chart-1/10' : 'bg-chart-2/10',
                )
                    ">
                    <Ship :class="cn(
                        'w-5 h-5',
                        job.type === 'export' ? 'text-chart-1' : 'text-chart-2',
                    )
                        " />
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                        <p class="font-medium text-foreground truncate">
                            {{ job.jobNumber }}
                        </p>
                        <span :class="cn(
                            'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                            statusConfig[job.status].class,
                        )
                            ">
                            {{ statusConfig[job.status].label }}
                        </span>
                    </div>
                    <p class="text-sm text-muted-foreground truncate">
                        {{ job.customer }}
                    </p>
                    <p class="text-xs text-muted-foreground mt-1">
                        {{ job.origin }} → {{ job.destination }}
                    </p>
                </div>
                <div class="text-right">
                    <p class="text-xs text-muted-foreground">{{ job.date }}</p>
                    <span :class="cn(
                        'text-xs font-medium uppercase',
                        job.type === 'export' ? 'text-chart-1' : 'text-chart-2',
                    )
                        ">
                        {{ job.type }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
