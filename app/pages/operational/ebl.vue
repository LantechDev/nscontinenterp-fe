<script setup lang="ts">
import { Plus, Search, FileText, Download } from "lucide-vue-next";

definePageMeta({
    layout: "dashboard",
});

interface Ebl {
    id: string;
    number: string;
    job: string;
    shipper: string;
    consignee: string;
    status: "issued" | "draft" | "surrendered";
}

const ebls: Ebl[] = [
    { id: "1", number: "EBL-2024-001", job: "JOB-2024-001234", shipper: "PT Maju Bersama", consignee: "Singapore Trading Co", status: "issued" },
    { id: "2", number: "EBL-2024-002", job: "JOB-2024-001231", shipper: "PT Indo Shipping", consignee: "Korea Import Ltd", status: "draft" },
];

const statusConfig: Record<Ebl["status"], { label: string; class: string }> = {
    draft: { label: "Draft", class: "bg-muted text-muted-foreground" },
    issued: { label: "Terbit", class: "badge-success" },
    surrendered: { label: "Surrendered", class: "badge-warning" },
};
</script>

<template>
    <div class="space-y-6 animate-fade-in">
        <div class="page-header">
            <div>
                <h1 class="page-title">eBL (Electronic Bill of Lading)</h1>
                <p class="text-muted-foreground mt-1">Kelola dokumen eBL</p>
            </div>
            <button class="btn-primary">
                <Plus class="w-4 h-4 mr-2" />
                Buat eBL
            </button>
        </div>

        <div class="card-elevated p-4">
            <div class="relative">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" placeholder="Cari eBL..." class="input-field pl-10" />
            </div>
        </div>

        <div class="card-elevated overflow-hidden">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>No. eBL</th>
                        <th>No. Job</th>
                        <th>Shipper</th>
                        <th>Consignee</th>
                        <th>Status</th>
                        <th class="w-20">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="ebl in ebls" :key="ebl.id">
                        <td>
                            <div class="flex items-center gap-2">
                                <FileText class="w-4 h-4 text-primary" />
                                <span class="font-medium">{{ ebl.number }}</span>
                            </div>
                        </td>
                        <td class="text-muted-foreground">{{ ebl.job }}</td>
                        <td>{{ ebl.shipper }}</td>
                        <td>{{ ebl.consignee }}</td>
                        <td>
                            <span
                                :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', statusConfig[ebl.status]?.class]">
                                {{ statusConfig[ebl.status]?.label }}
                            </span>
                        </td>
                        <td>
                            <button class="p-1.5 rounded hover:bg-muted transition-colors">
                                <Download class="w-4 h-4 text-muted-foreground" />
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
