<script setup lang="ts">
import { ArrowLeft, Edit, Calculator } from "lucide-vue-next";

definePageMeta({
    layout: "dashboard",
});

const route = useRoute();
const taxId = route.params.id;

// Placeholder data - in real app would fetch from API
const tax = {
    id: taxId,
    number: `TAX-2024-00${taxId}`,
    type: "ppn",
    typeName: "PPN (1.1%)",
    period: "Januari 2025",
    amount: "Rp 5.500.000",
    status: "pending",
    notes: "Pajak PPN untuk invoice freight",
    createdAt: "7 Jan 2025",
};
</script>

<template>
    <div class="space-y-6 animate-fade-in">
        <div class="page-header">
            <div class="flex items-center gap-4">
                <NuxtLink to="/finance/tax" class="p-2 rounded-lg hover:bg-muted transition-colors">
                    <ArrowLeft class="w-5 h-5" />
                </NuxtLink>
                <div>
                    <h1 class="page-title">{{ tax.number }}</h1>
                    <p class="text-muted-foreground mt-1">Detail catatan pajak</p>
                </div>
            </div>
            <button class="btn-secondary">
                <Edit class="w-4 h-4 mr-2" />
                Edit
            </button>
        </div>

        <div class="card-elevated p-6">
            <div class="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <div class="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Calculator class="w-7 h-7 text-primary" />
                </div>
                <div>
                    <h2 class="text-xl font-semibold">{{ tax.number }}</h2>
                    <p class="text-muted-foreground">{{ tax.typeName }}</p>
                </div>
                <span class="ml-auto badge-warning">Pending</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-1">
                    <p class="text-sm text-muted-foreground">Tipe Pajak</p>
                    <p class="font-medium">{{ tax.typeName }}</p>
                </div>
                <div class="space-y-1">
                    <p class="text-sm text-muted-foreground">Periode</p>
                    <p class="font-medium">{{ tax.period }}</p>
                </div>
                <div class="space-y-1">
                    <p class="text-sm text-muted-foreground">Jumlah</p>
                    <p class="font-medium text-lg">{{ tax.amount }}</p>
                </div>
                <div class="space-y-1">
                    <p class="text-sm text-muted-foreground">Tanggal Dibuat</p>
                    <p class="font-medium">{{ tax.createdAt }}</p>
                </div>
                <div class="space-y-1 md:col-span-2">
                    <p class="text-sm text-muted-foreground">Keterangan</p>
                    <p class="font-medium">{{ tax.notes }}</p>
                </div>
            </div>
        </div>
    </div>
</template>
