<script setup lang="ts">
import { ArrowLeft, Save } from "lucide-vue-next";

definePageMeta({
  layout: "dashboard",
});
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <div class="page-header">
      <div class="flex items-center gap-4">
        <NuxtLink to="/operational/ebl" class="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft class="w-5 h-5" />
        </NuxtLink>
        <div>
          <h1 class="page-title">Buat eBL</h1>
          <p class="text-muted-foreground mt-1">Buat Electronic Bill of Lading</p>
        </div>
      </div>
    </div>

    <form class="card-elevated p-6 space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="text-sm font-medium">No. Job</label>
          <select class="input-field">
            <option value="">Pilih job</option>
            <option value="1">JOB-2024-001234</option>
            <option value="2">JOB-2024-001233</option>
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Shipper</label>
          <input type="text" placeholder="Nama shipper" class="input-field" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Consignee</label>
          <input type="text" placeholder="Nama consignee" class="input-field" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Notify Party</label>
          <input type="text" placeholder="Notify party" class="input-field" />
        </div>
        <div class="space-y-2 md:col-span-2">
          <label class="text-sm font-medium">Deskripsi Barang</label>
          <textarea rows="3" placeholder="Description of goods..." class="input-field"></textarea>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Gross Weight (KGS)</label>
          <input type="number" placeholder="0" class="input-field" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Measurement (CBM)</label>
          <input type="number" placeholder="0" class="input-field" />
        </div>
      </div>
      <div class="flex justify-end gap-3 pt-4 border-t border-border">
        <NuxtLink to="/operational/ebl" class="btn-secondary">Batal</NuxtLink>
        <button type="submit" class="btn-primary">
          <Save class="w-4 h-4 mr-2" />
          Simpan
        </button>
      </div>
    </form>
  </div>
</template>
