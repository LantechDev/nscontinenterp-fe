<script setup lang="ts">
import { Ship, Eye } from "lucide-vue-next";
import { cn } from "~/lib/utils";

interface Job {
    id: string;
    jobNumber: string;
    customer: string;
    type: "Export" | "Import";
    status: "Active" | "Pending" | "Canceled" | "Done";
    origin: string;
    destination: string;
    date: string;
}

// Default fallback jobs
const defaultJobs: Job[] = [
    {
        id: "1",
        jobNumber: "JOB-2024-001234",
        customer: "PT Maju Mundur",
        type: "Export",
        status: "Active",
        origin: "Jakarta",
        destination: "Singapore",
        date: "12 Jan 2026",
    },
    {
        id: "2",
        jobNumber: "JOB-2024-001234",
        customer: "PT Maju Mundur",
        type: "Import",
        status: "Pending",
        origin: "Jakarta",
        destination: "Singapore",
        date: "12 Jan 2026",
    },
    {
        id: "3",
        jobNumber: "JOB-2024-001234",
        customer: "PT Maju Mundur",
        type: "Import",
        status: "Canceled",
        origin: "Jakarta",
        destination: "Singapore",
        date: "12 Jan 2026",
    },
    {
        id: "4",
        jobNumber: "JOB-2024-001234",
        customer: "PT Maju Mundur",
        type: "Import",
        status: "Active",
        origin: "Jakarta",
        destination: "Singapore",
        date: "12 Jan 2026",
    },
    {
        id: "5",
        jobNumber: "JOB-2024-001234",
        customer: "PT Maju Mundur",
        type: "Import",
        status: "Done",
        origin: "Jakarta",
        destination: "Singapore",
        date: "12 Jan 2026",
    },
];

const props = defineProps<{
    jobs?: Job[];
}>();

const jobs = computed(() => props.jobs || defaultJobs);

const statusConfig: Record<Job["status"], { label: string; className: string }> = {
    Active: { label: "Active", className: "text-blue-600 border-blue-200 bg-blue-50 border" },
    Pending: {
        label: "Pending",
        className: "text-yellow-600 border-yellow-200 bg-yellow-50 border",
    },
    Canceled: { label: "Canceled", className: "text-red-600 border-red-200 bg-red-50 border" },
    Done: { label: "Done", className: "text-emerald-600 border-emerald-200 bg-emerald-50 border" },
};
</script>

<template>
    <div class="card-elevated p-6 overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="border-b border-border text-left">
                        <th class="pb-3 pt-1 text-sm font-medium text-muted-foreground w-[200px]">
                            No. Job
                        </th>
                        <th class="pb-3 pt-1 text-sm font-medium text-muted-foreground">
                            Customer
                        </th>
                        <th class="pb-3 pt-1 text-sm font-medium text-muted-foreground">Route</th>
                        <th class="pb-3 pt-1 text-sm font-medium text-muted-foreground">ETA</th>
                        <th class="pb-3 pt-1 text-sm font-medium text-muted-foreground">Type</th>
                        <th class="pb-3 pt-1 text-sm font-medium text-muted-foreground">Status</th>
                        <th class="pb-3 pt-1 text-sm font-medium text-muted-foreground w-10"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="job in jobs"
                        :key="job.id"
                        class="group border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                    >
                        <td class="py-4 text-sm font-semibold">{{ job.jobNumber }}</td>
                        <td class="py-4 text-sm">{{ job.customer }}</td>
                        <td class="py-4 text-sm">{{ job.origin }} → {{ job.destination }}</td>
                        <td class="py-4 text-sm">{{ job.date }}</td>
                        <td class="py-4">
                            <span
                                :class="
                                    cn(
                                        'text-xs px-2 py-1 rounded font-medium',
                                        job.type === 'Export'
                                            ? 'bg-blue-100 text-blue-600'
                                            : 'bg-green-100 text-green-600'
                                    )
                                "
                            >
                                {{ job.type }}
                            </span>
                        </td>
                        <td class="py-4">
                            <span
                                :class="
                                    cn(
                                        'text-xs px-3 py-1 rounded-full border font-medium',
                                        statusConfig[job.status]?.className
                                    )
                                "
                            >
                                {{ statusConfig[job.status]?.label }}
                            </span>
                        </td>
                        <td class="py-4 text-right">
                            <NuxtLink
                                :to="`/operational/jobs/${job.id}`"
                                class="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Eye class="w-4 h-4" />
                            </NuxtLink>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
