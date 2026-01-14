<script setup lang="ts">
import { ArrowLeft, Edit, Ship, FileText, Receipt, Plus } from "lucide-vue-next";

definePageMeta({
    layout: "dashboard",
});

const route = useRoute();
const jobId = route.params.id;

const job = {
    id: jobId,
    number: "JOB-2024-001234",
    customer: "PT Maju Bersama",
    type: "export",
    origin: "Jakarta",
    destination: "Singapore",
    vessel: "MV Pacific Star",
    eta: "12 Jan 2025",
    etd: "10 Jan 2025",
    container: "40FT x 2",
    status: "active",
    quotation: "QUO-2024-001",
    invoices: [
        { number: "INV-2024-0892", amount: "Rp 25.500.000", status: "pending" },
    ],
    vendorBills: [
        { vendor: "PT Pelayaran Nusantara", amount: "Rp 18.000.000", status: "paid" },
    ],
};
</script>

<template>
    <div class="space-y-6 animate-fade-in">
        <div class="page-header">
            <div class="flex items-center gap-4">
                <NuxtLink to="/operational/jobs" class="p-2 rounded-lg hover:bg-muted transition-colors">
                    <ArrowLeft class="w-5 h-5" />
                </NuxtLink>
                <div>
                    <h1 class="page-title">{{ job.number }}</h1>
                    <p class="text-muted-foreground mt-1">Detail job/shipment</p>
                </div>
            </div>
            <button class="btn-secondary">
                <Edit class="w-4 h-4 mr-2" />
                Edit
            </button>
        </div>

        <!-- Job Info -->
        <div class="card-elevated p-6">
            <div class="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <div class="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Ship class="w-7 h-7 text-primary" />
                </div>
                <div>
                    <h2 class="text-xl font-semibold">{{ job.number }}</h2>
                    <p class="text-muted-foreground">{{ job.customer }}</p>
                </div>
                <div class="ml-auto flex items-center gap-2">
                    <span class="badge-success">Aktif</span>
                    <span class="text-xs font-medium uppercase text-chart-1">{{ job.type }}</span>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="space-y-1">
                    <p class="text-sm text-muted-foreground">Rute</p>
                    <p class="font-medium">{{ job.origin }} → {{ job.destination }}</p>
                </div>
                <div class="space-y-1">
                    <p class="text-sm text-muted-foreground">Kapal</p>
                    <p class="font-medium">{{ job.vessel }}</p>
                </div>
                <div class="space-y-1">
                    <p class="text-sm text-muted-foreground">Container</p>
                    <p class="font-medium">{{ job.container }}</p>
                </div>
                <div class="space-y-1">
                    <p class="text-sm text-muted-foreground">ETD</p>
                    <p class="font-medium">{{ job.etd }}</p>
                </div>
                <div class="space-y-1">
                    <p class="text-sm text-muted-foreground">ETA</p>
                    <p class="font-medium">{{ job.eta }}</p>
                </div>
                <div class="space-y-1">
                    <p class="text-sm text-muted-foreground">Penawaran</p>
                    <p class="font-medium text-primary">{{ job.quotation }}</p>
                </div>
            </div>
        </div>

        <!-- Invoices & Bills -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="card-elevated p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="font-semibold flex items-center gap-2">
                        <Receipt class="w-5 h-5 text-primary" />
                        Invoice ke Customer
                    </h3>
                    <NuxtLink to="/finance/invoice/create" class="btn-secondary text-sm py-1.5 px-3">
                        <Plus class="w-3 h-3 mr-1" />
                        Tambah
                    </NuxtLink>
                </div>
                <div v-for="invoice in job.invoices" :key="invoice.number"
                    class="flex justify-between items-center py-3 border-b border-border last:border-0">
                    <div>
                        <p class="font-medium">{{ invoice.number }}</p>
                        <p class="text-sm text-muted-foreground">{{ invoice.amount }}</p>
                    </div>
                    <span class="badge-warning">Pending</span>
                </div>
            </div>

            <div class="card-elevated p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="font-semibold flex items-center gap-2">
                        <FileText class="w-5 h-5 text-destructive" />
                        Tagihan dari Vendor
                    </h3>
                    <NuxtLink to="/finance/expenses/create" class="btn-secondary text-sm py-1.5 px-3">
                        <Plus class="w-3 h-3 mr-1" />
                        Tambah
                    </NuxtLink>
                </div>
                <div v-for="bill in job.vendorBills" :key="bill.vendor"
                    class="flex justify-between items-center py-3 border-b border-border last:border-0">
                    <div>
                        <p class="font-medium">{{ bill.vendor }}</p>
                        <p class="text-sm text-muted-foreground">{{ bill.amount }}</p>
                    </div>
                    <span
                        class="bg-muted text-muted-foreground px-2.5 py-0.5 rounded-full text-xs font-medium">Lunas</span>
                </div>
            </div>
        </div>
    </div>
</template>
