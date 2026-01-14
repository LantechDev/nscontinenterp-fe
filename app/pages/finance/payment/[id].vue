<script setup lang="ts">
import { ArrowLeft, CreditCard } from "lucide-vue-next";

definePageMeta({
    layout: "dashboard",
});

const route = useRoute();
const paymentId = route.params.id;

const payment = {
    id: paymentId,
    number: "PAY-2024-001",
    invoice: "INV-2024-0891",
    customer: "CV Sukses Makmur",
    date: "6 Jan 2025",
    amount: "Rp 18.250.000",
    method: "Bank Transfer",
    bank: "BCA",
    reference: "TRF-123456789",
    notes: "Pembayaran lunas invoice",
};
</script>

<template>
    <div class="space-y-6 animate-fade-in">
        <div class="page-header">
            <div class="flex items-center gap-4">
                <NuxtLink to="/finance/payment" class="p-2 rounded-lg hover:bg-muted transition-colors">
                    <ArrowLeft class="w-5 h-5" />
                </NuxtLink>
                <div>
                    <h1 class="page-title">{{ payment.number }}</h1>
                    <p class="text-muted-foreground mt-1">Detail pembayaran</p>
                </div>
            </div>
        </div>

        <div class="card-elevated p-6">
            <div class="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <div class="w-14 h-14 rounded-xl bg-success/10 flex items-center justify-center">
                    <CreditCard class="w-7 h-7 text-success" />
                </div>
                <div>
                    <h2 class="text-xl font-semibold">{{ payment.number }}</h2>
                    <p class="text-muted-foreground">{{ payment.customer }}</p>
                </div>
                <span class="ml-auto text-2xl font-bold text-success">{{ payment.amount }}</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-1">
                    <p class="text-sm text-muted-foreground">No. Invoice</p>
                    <p class="font-medium text-primary">{{ payment.invoice }}</p>
                </div>
                <div class="space-y-1">
                    <p class="text-sm text-muted-foreground">Tanggal</p>
                    <p class="font-medium">{{ payment.date }}</p>
                </div>
                <div class="space-y-1">
                    <p class="text-sm text-muted-foreground">Metode Pembayaran</p>
                    <p class="font-medium">{{ payment.method }}</p>
                </div>
                <div class="space-y-1">
                    <p class="text-sm text-muted-foreground">Bank</p>
                    <p class="font-medium">{{ payment.bank }}</p>
                </div>
                <div class="space-y-1">
                    <p class="text-sm text-muted-foreground">No. Referensi</p>
                    <p class="font-medium">{{ payment.reference }}</p>
                </div>
                <div class="space-y-1">
                    <p class="text-sm text-muted-foreground">Keterangan</p>
                    <p class="font-medium">{{ payment.notes }}</p>
                </div>
            </div>
        </div>
    </div>
</template>
