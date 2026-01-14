<script setup lang="ts">
import { Plus, Search, Receipt, Eye, Download } from "lucide-vue-next";

definePageMeta({
    layout: "dashboard",
});

interface Invoice {
    id: string;
    number: string;
    customer: string;
    date: string;
    dueDate: string;
    amount: string;
    status: "pending" | "paid" | "overdue";
}

const invoices: Invoice[] = [
    { id: "1", number: "INV-2024-0892", customer: "PT Maju Bersama", date: "7 Jan 2025", dueDate: "7 Feb 2025", amount: "Rp 25.500.000", status: "pending" },
    { id: "2", number: "INV-2024-0891", customer: "CV Sukses Makmur", date: "5 Jan 2025", dueDate: "5 Feb 2025", amount: "Rp 18.250.000", status: "paid" },
    { id: "3", number: "INV-2024-0890", customer: "PT Logistik Nusantara", date: "3 Jan 2025", dueDate: "3 Feb 2025", amount: "Rp 32.000.000", status: "overdue" },
];

const statusConfig: Record<Invoice["status"], { label: string; class: string }> = {
    pending: { label: "Pending", class: "badge-warning" },
    paid: { label: "Lunas", class: "badge-success" },
    overdue: { label: "Jatuh Tempo", class: "badge-destructive" },
};
</script>

<template>
    <div class="space-y-6 animate-fade-in">
        <div class="page-header">
            <div>
                <h1 class="page-title">Invoice</h1>
                <p class="text-muted-foreground mt-1">Kelola tagihan customer</p>
            </div>
            <button class="btn-primary">
                <Plus class="w-4 h-4 mr-2" />
                Buat Invoice
            </button>
        </div>

        <div class="card-elevated p-4">
            <div class="flex flex-col sm:flex-row gap-4">
                <div class="relative flex-1">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="text" placeholder="Cari invoice..." class="input-field pl-10" />
                </div>
                <select class="input-field w-40">
                    <option value="">Semua Status</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Lunas</option>
                    <option value="overdue">Jatuh Tempo</option>
                </select>
            </div>
        </div>

        <div class="card-elevated overflow-hidden">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>No. Invoice</th>
                        <th>Customer</th>
                        <th>Tanggal</th>
                        <th>Jatuh Tempo</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th class="w-20">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="invoice in invoices" :key="invoice.id">
                        <td>
                            <div class="flex items-center gap-2">
                                <Receipt class="w-4 h-4 text-primary" />
                                <span class="font-medium">{{ invoice.number }}</span>
                            </div>
                        </td>
                        <td>{{ invoice.customer }}</td>
                        <td class="text-muted-foreground">{{ invoice.date }}</td>
                        <td class="text-muted-foreground">{{ invoice.dueDate }}</td>
                        <td class="font-medium">{{ invoice.amount }}</td>
                        <td>
                            <span
                                :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', statusConfig[invoice.status]?.class]">
                                {{ statusConfig[invoice.status]?.label }}
                            </span>
                        </td>
                        <td>
                            <div class="flex gap-1">
                                <button class="p-1.5 rounded hover:bg-muted transition-colors">
                                    <Eye class="w-4 h-4 text-muted-foreground" />
                                </button>
                                <button class="p-1.5 rounded hover:bg-muted transition-colors">
                                    <Download class="w-4 h-4 text-muted-foreground" />
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
