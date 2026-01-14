<script setup lang="ts">
import { Plus, Search, CreditCard } from "lucide-vue-next";

definePageMeta({
    layout: "dashboard",
});

const payments = [
    { id: "1", number: "PAY-2024-001", invoice: "INV-2024-0891", customer: "CV Sukses Makmur", date: "6 Jan 2025", amount: "Rp 18.250.000", method: "Bank Transfer" },
    { id: "2", number: "PAY-2024-002", invoice: "INV-2024-0889", customer: "PT Indo Global", date: "5 Jan 2025", amount: "Rp 12.500.000", method: "Bank Transfer" },
];
</script>

<template>
    <div class="space-y-6 animate-fade-in">
        <div class="page-header">
            <div>
                <h1 class="page-title">Pembayaran</h1>
                <p class="text-muted-foreground mt-1">Catat pembayaran dari customer</p>
            </div>
            <button class="btn-primary">
                <Plus class="w-4 h-4 mr-2" />
                Catat Pembayaran
            </button>
        </div>

        <div class="card-elevated p-4">
            <div class="relative">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" placeholder="Cari pembayaran..." class="input-field pl-10" />
            </div>
        </div>

        <div class="card-elevated overflow-hidden">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>No. Pembayaran</th>
                        <th>No. Invoice</th>
                        <th>Customer</th>
                        <th>Tanggal</th>
                        <th>Jumlah</th>
                        <th>Metode</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="payment in payments" :key="payment.id">
                        <td>
                            <div class="flex items-center gap-2">
                                <CreditCard class="w-4 h-4 text-success" />
                                <span class="font-medium">{{ payment.number }}</span>
                            </div>
                        </td>
                        <td class="text-muted-foreground">{{ payment.invoice }}</td>
                        <td>{{ payment.customer }}</td>
                        <td class="text-muted-foreground">{{ payment.date }}</td>
                        <td class="font-medium text-success">{{ payment.amount }}</td>
                        <td class="text-muted-foreground">{{ payment.method }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
