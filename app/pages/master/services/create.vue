<script setup lang="ts">
import { ArrowLeft, Save } from "lucide-vue-next";
import Combobox from "~/components/ui/Combobox.vue";

definePageMeta({
  layout: "dashboard",
});

const unitValue = ref("");
const unitOptions = [
  { id: "CONTAINER", name: "Per Container" },
  { id: "KG", name: "Per Kilogram" },
  { id: "CBM", name: "Per CBM" },
  { id: "DOCUMENT", name: "Per Document" },
  { id: "SHIPMENT", name: "Per Shipment" },
];
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <div class="page-header">
      <div class="flex items-center gap-4">
        <NuxtLink to="/master/services" class="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft class="w-5 h-5" />
        </NuxtLink>
        <div>
          <h1 class="page-title">Tambah Jasa</h1>
          <p class="text-muted-foreground mt-1">Tambah jasa baru</p>
        </div>
      </div>
    </div>

    <form class="card-elevated p-6 space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="text-sm font-medium">Nama Jasa <span class="text-red-500">*</span></label>
          <input v-uppercase type="text" placeholder="Ocean Freight - FCL" class="input-field" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Satuan <span class="text-red-500">*</span></label>
          <Combobox v-model="unitValue" :options="unitOptions" placeholder="Pilih Satuan" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Harga <span class="text-red-500">*</span></label>
          <input type="number" placeholder="0" class="input-field" v-uppercase />
        </div>
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium">Deskripsi</label>
        <textarea
          v-uppercase
          rows="3"
          placeholder="Deskripsi jasa (opsional)"
          class="input-field resize-none"
        ></textarea>
      </div>
      <div class="flex justify-end gap-3 pt-4 border-t border-border">
        <NuxtLink to="/master/services" class="btn-secondary">Batal</NuxtLink>
        <button type="submit" class="btn-primary">
          <Save class="w-4 h-4 mr-2" />
          Simpan
        </button>
      </div>
    </form>
  </div>
</template>
