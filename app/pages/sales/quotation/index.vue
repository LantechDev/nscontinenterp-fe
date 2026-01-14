<script setup lang="ts">
import { Plus, Search, FileText, Eye, Send } from "lucide-vue-next";

definePageMeta({
    layout: "dashboard",
});

interface Quotation {
    id: string;
    number: string;
    customer: string;
    date: string;
    amount: string;
    status: "sent" | "draft" | "accepted" | "rejected";
}

const quotations: Quotation[] = [
    { id: "1", number: "QUO-2024-001", customer: "PT Maju Bersama", date: "7 Jan 2025", amount: "Rp 25.500.000", status: "sent" },
    { id: "2", number: "QUO-2024-002", customer: "CV Sukses Makmur", date: "6 Jan 2025", amount: "Rp 18.250.000", status: "draft" },
    { id: "3", number: "QUO-2024-003", customer: "PT Logistik Nusantara", date: "5 Jan 2025", amount: "Rp 32.000.000", status: "accepted" },
    { id: "4", number: "QUO-2024-004", customer: "PT Indo Shipping", date: "4 Jan 2025", amount: "Rp 15.750.000", status: "rejected" },
];

const statusConfig: Record<Quotation["status"], { label: string; class: string }> = {
    draft: { label: "Draft", class: "bg-muted text-muted-foreground" },
    sent: { label: "Terkirim", class: "badge-warning" },
    accepted: { label: "Diterima", class: "badge-success" },
    rejected: { label: "Ditolak", class: "badge-destructive" },
};
</script>

<template>
    <div class="space-y-6 animate-fade-in">
        <div class="page-header">
            <div>
                <h1 class="page-title">Penawaran</h1>
                <p class="text-muted-foreground mt-1">Kelola quotation dan penawaran harga</p>
            </div>
            <NuxtLink to="/sales/quotation/create" class="btn-primary">
                <Plus class="w-4 h-4 mr-2" />
                Buat Penawaran
            </NuxtLink>
        </div>

        <div class="card-elevated p-4">
            <div class="flex flex-col sm:flex-row gap-4">
                <div class="relative flex-1">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="text" placeholder="Cari penawaran..." class="input-field pl-10" />
                </div>
                <select class="input-field w-40">
                    <option value="">Semua Status</option>
                    <option value="draft">Draft</option>
                    <option value="sent">Terkirim</option>
                    <option value="accepted">Diterima</option>
                    <option value="rejected">Ditolak</option>
                </select>
            </div>
        </div>

        <div class="card-elevated overflow-hidden">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>No. Penawaran</th>
                        <th>Customer</th>
                        <th>Tanggal</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th class="w-28">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="quotation in quotations" :key="quotation.id" class="cursor-pointer hover:bg-muted/50"
                        @click="navigateTo(`/sales/quotation/${quotation.id}`)">
                        <td>
                            <div class="flex items-center gap-2">
                                <FileText class="w-4 h-4 text-primary" />
                                <span class="font-medium">{{ quotation.number }}</span>
                            </div>
                        </td>
                        <td>{{ quotation.customer }}</td>
                        <td class="text-muted-foreground">{{ quotation.date }}</td>
                        <td class="font-medium">{{ quotation.amount }}</td>
                        <td>
                            <span
                                :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', statusConfig[quotation.status]?.class]">
                                {{ statusConfig[quotation.status]?.label }}
                            </span>
                        </td>
                        <td>
                            <div class="flex gap-1">
                                <NuxtLink :to="`/sales/quotation/${quotation.id}`"
                                    class="p-1.5 rounded hover:bg-muted transition-colors" title="Lihat" @click.stop>
                                    <Eye class="w-4 h-4 text-muted-foreground" />
                                </NuxtLink>
                                <button class="p-1.5 rounded hover:bg-muted transition-colors" title="Kirim"
                                    @click.stop>
                                    <Send class="w-4 h-4 text-accent" />
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
