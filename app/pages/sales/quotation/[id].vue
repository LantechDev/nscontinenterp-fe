<script setup lang="ts">
import { ArrowLeft, Edit, FileText, Send } from "lucide-vue-next";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const quotationId = route.params.id;

const quotation = {
  id: quotationId,
  number: "QUO-2024-001",
  customer: "PT Maju Bersama",
  date: "7 Jan 2025",
  validUntil: "7 Feb 2025",
  origin: "Jakarta",
  destination: "Singapore",
  amount: "Rp 25.500.000",
  status: "sent",
  services: [
    { name: "Ocean Freight - FCL 20ft", price: "Rp 18.000.000" },
    { name: "Trucking Origin", price: "Rp 3.500.000" },
    { name: "Documentation", price: "Rp 2.500.000" },
    { name: "THC Origin", price: "Rp 1.500.000" },
  ],
};
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <div class="page-header">
      <div class="flex items-center gap-4">
        <NuxtLink to="/sales/quotation" class="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft class="w-5 h-5" />
        </NuxtLink>
        <div>
          <h1 class="page-title">{{ quotation.number }}</h1>
          <p class="text-muted-foreground mt-1">Detail penawaran</p>
        </div>
      </div>
      <div class="flex gap-2">
        <button class="btn-secondary">
          <Send class="w-4 h-4 mr-2" />
          Kirim
        </button>
        <button class="btn-secondary">
          <Edit class="w-4 h-4 mr-2" />
          Edit
        </button>
      </div>
    </div>

    <div class="card-elevated p-6">
      <div class="flex items-center gap-4 mb-6 pb-6 border-b border-border">
        <div class="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
          <FileText class="w-7 h-7 text-primary" />
        </div>
        <div>
          <h2 class="text-xl font-semibold">{{ quotation.number }}</h2>
          <p class="text-muted-foreground">{{ quotation.customer }}</p>
        </div>
        <span class="ml-auto badge-warning">Terkirim</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="space-y-1">
          <p class="text-sm text-muted-foreground">Tanggal</p>
          <p class="font-medium">{{ quotation.date }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-sm text-muted-foreground">Berlaku Hingga</p>
          <p class="font-medium">{{ quotation.validUntil }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-sm text-muted-foreground">Rute</p>
          <p class="font-medium">{{ quotation.origin }} → {{ quotation.destination }}</p>
        </div>
      </div>

      <div class="border-t border-border pt-6">
        <h3 class="font-semibold mb-4">Detail Jasa</h3>
        <div class="space-y-2">
          <div
            v-for="(service, index) in quotation.services"
            :key="index"
            class="flex justify-between py-2 border-b border-border last:border-0"
          >
            <span>{{ service.name }}</span>
            <span class="font-medium">{{ service.price }}</span>
          </div>
          <div class="flex justify-between py-3 font-semibold text-lg">
            <span>Total</span>
            <span class="text-primary">{{ quotation.amount }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
