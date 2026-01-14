<script setup lang="ts">
import { ArrowLeft, Download, FileText } from "lucide-vue-next";

definePageMeta({
    layout: "dashboard",
});

const route = useRoute();
const eblId = route.params.id;

const ebl = {
    id: eblId,
    number: "EBL-2024-001",
    job: "JOB-2024-001234",
    shipper: "PT Maju Bersama",
    consignee: "Singapore Trading Co",
    notifyParty: "Same as consignee",
    vessel: "MV Pacific Star",
    voyage: "PS-2024-01",
    portOfLoading: "Jakarta",
    portOfDischarge: "Singapore",
    description: "Electronic goods - 20 cartons",
    grossWeight: "2,500 KGS",
    measurement: "15 CBM",
    status: "issued",
    issuedDate: "8 Jan 2025",
};
</script>

<template>
    <div class="space-y-6 animate-fade-in">
        <div class="page-header">
            <div class="flex items-center gap-4">
                <NuxtLink to="/operational/ebl" class="p-2 rounded-lg hover:bg-muted transition-colors">
                    <ArrowLeft class="w-5 h-5" />
                </NuxtLink>
                <div>
                    <h1 class="page-title">{{ ebl.number }}</h1>
                    <p class="text-muted-foreground mt-1">Detail eBL</p>
                </div>
            </div>
            <button class="btn-primary">
                <Download class="w-4 h-4 mr-2" />
                Download PDF
            </button>
        </div>

        <div class="card-elevated p-6">
            <div class="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <div class="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText class="w-7 h-7 text-primary" />
                </div>
                <div>
                    <h2 class="text-xl font-semibold">{{ ebl.number }}</h2>
                    <p class="text-muted-foreground">{{ ebl.job }}</p>
                </div>
                <span class="ml-auto badge-success">Terbit</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-1">
                    <p class="text-sm text-muted-foreground">Shipper</p>
                    <p class="font-medium">{{ ebl.shipper }}</p>
                </div>
                <div class="space-y-1">
                    <p class="text-sm text-muted-foreground">Consignee</p>
                    <p class="font-medium">{{ ebl.consignee }}</p>
                </div>
                <div class="space-y-1">
                    <p class="text-sm text-muted-foreground">Notify Party</p>
                    <p class="font-medium">{{ ebl.notifyParty }}</p>
                </div>
                <div class="space-y-1">
                    <p class="text-sm text-muted-foreground">Vessel/Voyage</p>
                    <p class="font-medium">{{ ebl.vessel }} / {{ ebl.voyage }}</p>
                </div>
                <div class="space-y-1">
                    <p class="text-sm text-muted-foreground">Port of Loading</p>
                    <p class="font-medium">{{ ebl.portOfLoading }}</p>
                </div>
                <div class="space-y-1">
                    <p class="text-sm text-muted-foreground">Port of Discharge</p>
                    <p class="font-medium">{{ ebl.portOfDischarge }}</p>
                </div>
                <div class="space-y-1 md:col-span-2">
                    <p class="text-sm text-muted-foreground">Description of Goods</p>
                    <p class="font-medium">{{ ebl.description }}</p>
                </div>
                <div class="space-y-1">
                    <p class="text-sm text-muted-foreground">Gross Weight</p>
                    <p class="font-medium">{{ ebl.grossWeight }}</p>
                </div>
                <div class="space-y-1">
                    <p class="text-sm text-muted-foreground">Measurement</p>
                    <p class="font-medium">{{ ebl.measurement }}</p>
                </div>
                <div class="space-y-1">
                    <p class="text-sm text-muted-foreground">Tanggal Terbit</p>
                    <p class="font-medium">{{ ebl.issuedDate }}</p>
                </div>
            </div>
        </div>
    </div>
</template>
