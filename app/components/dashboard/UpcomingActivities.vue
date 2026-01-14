<script setup lang="ts">
import { Calendar, Clock, FileText, Ship, CreditCard } from "lucide-vue-next";
import { cn } from "~/lib/utils";

interface Activity {
    id: string;
    title: string;
    description: string;
    time: string;
    type: "shipment" | "invoice" | "payment" | "document";
}

const activities: Activity[] = [
    {
        id: "1",
        title: "Kapal ETD - MV SINAR JAYA",
        description: "JOB-2024-001234 • Jakarta → Singapore",
        time: "09:00 WIB",
        type: "shipment",
    },
    {
        id: "2",
        title: "Jatuh Tempo Invoice",
        description: "INV-2024-0892 • PT Maju Bersama",
        time: "Hari ini",
        type: "invoice",
    },
    {
        id: "3",
        title: "Pembayaran Vendor",
        description: "PO-2024-0456 • PT Pelayaran Nusantara",
        time: "Besok",
        type: "payment",
    },
    {
        id: "4",
        title: "Submit Dokumen Bea Cukai",
        description: "JOB-2024-001233 • CV Sukses Makmur",
        time: "8 Jan 2025",
        type: "document",
    },
];

const typeConfig: Record<
    string,
    { icon: typeof Ship; color: string; bg: string }
> = {
    shipment: { icon: Ship, color: "text-chart-1", bg: "bg-chart-1/10" },
    invoice: { icon: FileText, color: "text-chart-3", bg: "bg-chart-3/10" },
    payment: { icon: CreditCard, color: "text-chart-2", bg: "bg-chart-2/10" },
    document: { icon: FileText, color: "text-chart-4", bg: "bg-chart-4/10" },
};
</script>

<template>
    <div class="card-elevated p-6">
        <div class="flex items-center justify-between mb-4">
            <h3 class="section-title mb-0">Kegiatan Mendatang</h3>
            <Calendar class="w-5 h-5 text-muted-foreground" />
        </div>
        <div class="space-y-3">
            <div v-for="activity in activities" :key="activity.id"
                class="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                <div :class="cn('p-2 rounded-lg', typeConfig[activity.type].bg)">
                    <component :is="typeConfig[activity.type].icon"
                        :class="cn('w-4 h-4', typeConfig[activity.type].color)" />
                </div>
                <div class="flex-1 min-w-0">
                    <p class="font-medium text-sm text-foreground truncate">
                        {{ activity.title }}
                    </p>
                    <p class="text-xs text-muted-foreground truncate mt-0.5">
                        {{ activity.description }}
                    </p>
                </div>
                <div class="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock class="w-3 h-3" />
                    <span>{{ activity.time }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
