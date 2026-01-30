<script setup lang="ts">
import { ArrowLeft, Edit, Package } from "lucide-vue-next";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const serviceId = route.params.id;

const service = {
  id: serviceId,
  name: "Ocean Freight - FCL",
  code: "SVC-001",
  price: "Rp 15.000.000",
  unit: "Per Container",
  createdAt: "1 Des 2024",
};
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <div class="page-header">
      <div class="flex items-center gap-4">
        <NuxtLink to="/master/services" class="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft class="w-5 h-5" />
        </NuxtLink>
        <div>
          <h1 class="page-title">{{ service.name }}</h1>
          <p class="text-muted-foreground mt-1">Detail jasa</p>
        </div>
      </div>
      <button class="btn-secondary">
        <Edit class="w-4 h-4 mr-2" />
        Edit
      </button>
    </div>

    <div class="card-elevated p-6">
      <div class="flex items-center gap-4 mb-6 pb-6 border-b border-border">
        <div class="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
          <Package class="w-7 h-7 text-primary" />
        </div>
        <div>
          <h2 class="text-xl font-semibold">{{ service.name }}</h2>
          <p class="text-muted-foreground">{{ service.code }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-1">
          <p class="text-sm text-muted-foreground">Harga</p>
          <p class="font-medium text-lg">{{ service.price }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-sm text-muted-foreground">Satuan</p>
          <p class="font-medium">{{ service.unit }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-sm text-muted-foreground">Tanggal Dibuat</p>
          <p class="font-medium">{{ service.createdAt }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
