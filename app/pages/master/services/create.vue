<script setup lang="ts">
import { ArrowLeft, Save } from "lucide-vue-next";

definePageMeta({
  layout: "dashboard",
});
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
          <input type="text" placeholder="Ocean Freight - FCL" class="input-field" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Satuan <span class="text-red-500">*</span></label>
          <select class="input-field">
            <option value="">Pilih Satuan</option>
            <option value="CONTAINER">Per Container</option>
            <option value="KG">Per Kilogram</option>
            <option value="CBM">Per CBM</option>
            <option value="DOCUMENT">Per Document</option>
            <option value="SHIPMENT">Per Shipment</option>
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Harga <span class="text-red-500">*</span></label>
          <input type="number" placeholder="0" class="input-field" />
        </div>
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium">Deskripsi</label>
        <textarea
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
