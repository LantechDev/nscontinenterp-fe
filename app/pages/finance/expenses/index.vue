<script setup lang="ts">
import { Plus, Search, Wallet } from "lucide-vue-next";

definePageMeta({
    layout: "dashboard",
});

const expenses = [
    { id: "1", number: "EXP-2024-001", description: "Trucking Fee - JOB-2024-001234", vendor: "CV Trucking Mandiri", date: "6 Jan 2025", amount: "Rp 3.500.000", category: "Trucking" },
    { id: "2", number: "EXP-2024-002", description: "Port Charges - JOB-2024-001234", vendor: "PT Pelayaran Nusantara", date: "5 Jan 2025", amount: "Rp 2.200.000", category: "Port" },
    { id: "3", number: "EXP-2024-003", description: "Customs Clearance - JOB-2024-001233", vendor: "PT Bea Cukai Partner", date: "4 Jan 2025", amount: "Rp 1.200.000", category: "Customs" },
];
</script>

<template>
    <div class="space-y-6 animate-fade-in">
        <div class="page-header">
            <div>
                <h1 class="page-title">Biaya Operasional</h1>
                <p class="text-muted-foreground mt-1">Catat pengeluaran operasional</p>
            </div>
            <NuxtLink to="/finance/expenses/create" class="btn-primary">
                <Plus class="w-4 h-4 mr-2" />
                Catat Biaya
            </NuxtLink>
        </div>

        <div class="card-elevated p-4">
            <div class="flex flex-col sm:flex-row gap-4">
                <div class="relative flex-1">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="text" placeholder="Cari biaya..." class="input-field pl-10" />
                </div>
                <select class="input-field w-40">
                    <option value="">Semua Kategori</option>
                    <option value="trucking">Trucking</option>
                    <option value="port">Port</option>
                    <option value="customs">Customs</option>
                </select>
            </div>
        </div>

        <div class="card-elevated overflow-hidden">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>No. Biaya</th>
                        <th>Deskripsi</th>
                        <th>Vendor</th>
                        <th>Tanggal</th>
                        <th>Jumlah</th>
                        <th>Kategori</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="expense in expenses" :key="expense.id" class="cursor-pointer hover:bg-muted/50"
                        @click="navigateTo(`/finance/expenses/${expense.id}`)">
                        <td>
                            <div class="flex items-center gap-2">
                                <Wallet class="w-4 h-4 text-destructive" />
                                <span class="font-medium">{{ expense.number }}</span>
                            </div>
                        </td>
                        <td>{{ expense.description }}</td>
                        <td class="text-muted-foreground">{{ expense.vendor }}</td>
                        <td class="text-muted-foreground">{{ expense.date }}</td>
                        <td class="font-medium text-destructive">{{ expense.amount }}</td>
                        <td>
                            <span class="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                                {{ expense.category }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
