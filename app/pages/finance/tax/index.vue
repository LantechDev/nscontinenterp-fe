<script setup lang="ts">
import { Plus, Search, Calculator, Eye } from "lucide-vue-next";

definePageMeta({
    layout: "dashboard",
});

interface TaxRecord {
    id: string;
    number: string;
    type: "ppn" | "pph";
    period: string;
    amount: string;
    status: "reported" | "pending" | "paid";
}

const taxRecords: TaxRecord[] = [
    { id: "1", number: "TAX-2024-001", type: "ppn", period: "Januari 2025", amount: "Rp 5.500.000", status: "pending" },
    { id: "2", number: "TAX-2024-002", type: "pph", period: "Januari 2025", amount: "Rp 2.250.000", status: "reported" },
    { id: "3", number: "TAX-2024-003", type: "ppn", period: "Desember 2024", amount: "Rp 4.800.000", status: "paid" },
];

const statusConfig: Record<TaxRecord["status"], { label: string; class: string }> = {
    pending: { label: "Pending", class: "badge-warning" },
    reported: { label: "Dilaporkan", class: "badge-success" },
    paid: { label: "Dibayar", class: "bg-muted text-muted-foreground" },
};

const typeConfig: Record<TaxRecord["type"], string> = {
    ppn: "PPN",
    pph: "PPh",
};
</script>

<template>
    <div class="space-y-6 animate-fade-in">
        <div class="page-header">
            <div>
                <h1 class="page-title">Pajak</h1>
                <p class="text-muted-foreground mt-1">Kelola catatan pajak PPN dan PPh</p>
            </div>
            <NuxtLink to="/finance/tax/create" class="btn-primary">
                <Plus class="w-4 h-4 mr-2" />
                Catat Pajak
            </NuxtLink>
        </div>

        <div class="card-elevated p-4">
            <div class="flex flex-col sm:flex-row gap-4">
                <div class="relative flex-1">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="text" placeholder="Cari pajak..." class="input-field pl-10" />
                </div>
                <select class="input-field w-40">
                    <option value="">Semua Tipe</option>
                    <option value="ppn">PPN</option>
                    <option value="pph">PPh</option>
                </select>
                <select class="input-field w-40">
                    <option value="">Semua Status</option>
                    <option value="pending">Pending</option>
                    <option value="reported">Dilaporkan</option>
                    <option value="paid">Dibayar</option>
                </select>
            </div>
        </div>

        <div class="card-elevated overflow-hidden">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>No. Pajak</th>
                        <th>Tipe</th>
                        <th>Periode</th>
                        <th>Jumlah</th>
                        <th>Status</th>
                        <th class="w-20">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="tax in taxRecords" :key="tax.id" class="cursor-pointer hover:bg-muted/50"
                        @click="navigateTo(`/finance/tax/${tax.id}`)">
                        <td>
                            <div class="flex items-center gap-2">
                                <Calculator class="w-4 h-4 text-primary" />
                                <span class="font-medium">{{ tax.number }}</span>
                            </div>
                        </td>
                        <td>
                            <span class="text-xs font-medium uppercase">{{ typeConfig[tax.type] }}</span>
                        </td>
                        <td class="text-muted-foreground">{{ tax.period }}</td>
                        <td class="font-medium">{{ tax.amount }}</td>
                        <td>
                            <span
                                :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', statusConfig[tax.status]?.class]">
                                {{ statusConfig[tax.status]?.label }}
                            </span>
                        </td>
                        <td>
                            <NuxtLink :to="`/finance/tax/${tax.id}`"
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
