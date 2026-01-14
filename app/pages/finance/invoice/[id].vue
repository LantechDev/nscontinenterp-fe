<script setup lang="ts">
import { ArrowLeft, Edit, Download, Receipt } from "lucide-vue-next";

definePageMeta({
    layout: "dashboard",
});

const route = useRoute();
const invoiceId = route.params.id;

const invoice = {
    id: invoiceId,
    number: "INV-2024-0892",
    customer: "PT Maju Bersama",
    job: "JOB-2024-001234",
    date: "7 Jan 2025",
    dueDate: "7 Feb 2025",
    status: "pending",
    items: [
        { description: "Ocean Freight - FCL 40ft x 2", amount: "Rp 18.000.000" },
        { description: "Trucking Fee", amount: "Rp 3.500.000" },
        { description: "Documentation", amount: "Rp 2.500.000" },
        { description: "THC", amount: "Rp 1.500.000" },
    ],
    subtotal: "Rp 25.500.000",
    ppn: "Rp 280.500",
    ppnRate: "1.1%",
    total: "Rp 25.780.500",
};
</script>

<template>
    <div class="space-y-6 animate-fade-in">
        <div class="page-header">
            <div class="flex items-center gap-4">
                <NuxtLink to="/finance/invoice" class="p-2 rounded-lg hover:bg-muted transition-colors">
                    <ArrowLeft class="w-5 h-5" />
                </NuxtLink>
                <div>
                    <h1 class="page-title">{{ invoice.number }}</h1>
                    <p class="text-muted-foreground mt-1">Detail invoice</p>
                </div>
            </div>
            <div class="flex gap-2">
                <button class="btn-secondary">
                    <Download class="w-4 h-4 mr-2" />
                    Download
                </button>
                <button class="btn-secondary">
                    <Edit class="w-4 h-4 mr-2" />
                    Edit
                </button>
            </div>
        </div>

        <div class="card-elevated p-6">
            <div class="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <div class="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Receipt class="w-7 h-7 text-primary" />
                </div>
                <div>
                    <h2 class="text-xl font-semibold">{{ invoice.number }}</h2>
                    <p class="text-muted-foreground">{{ invoice.customer }}</p>
                </div>
                <span class="ml-auto badge-warning">Pending</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div class="space-y-1">
                    <p class="text-sm text-muted-foreground">No. Job</p>
                    <p class="font-medium text-primary">{{ invoice.job }}</p>
                </div>
                <div class="space-y-1">
                    <p class="text-sm text-muted-foreground">Tanggal</p>
                    <p class="font-medium">{{ invoice.date }}</p>
                </div>
                <div class="space-y-1">
                    <p class="text-sm text-muted-foreground">Jatuh Tempo</p>
                    <p class="font-medium">{{ invoice.dueDate }}</p>
                </div>
            </div>

            <div class="border-t border-border pt-6">
                <h3 class="font-semibold mb-4">Detail Item</h3>
                <div class="space-y-2">
                    <div v-for="(item, index) in invoice.items" :key="index"
                        class="flex justify-between py-2 border-b border-border last:border-0">
                        <span>{{ item.description }}</span>
                        <span class="font-medium">{{ item.amount }}</span>
                    </div>
                </div>
                <div class="mt-4 pt-4 border-t border-border space-y-2">
                    <div class="flex justify-between">
                        <span class="text-muted-foreground">Subtotal</span>
                        <span class="font-medium">{{ invoice.subtotal }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-muted-foreground">PPN ({{ invoice.ppnRate }})</span>
                        <span class="font-medium">{{ invoice.ppn }}</span>
                    </div>
                    <div class="flex justify-between text-lg font-semibold pt-2 border-t border-border">
                        <span>Total</span>
                        <span class="text-primary">{{ invoice.total }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
