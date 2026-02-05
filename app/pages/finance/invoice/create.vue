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
        <NuxtLink to="/finance/invoice" class="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft class="w-5 h-5" />
        </NuxtLink>
        <div>
          <h1 class="page-title">Buat Invoice</h1>
          <p class="text-muted-foreground mt-1">Buat tagihan ke customer</p>
        </div>
      </div>
    </div>

    <form class="card-elevated p-6 space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="text-sm font-medium">Customer</label>
          <select class="input-field">
            <option value="">Pilih customer</option>
            <option value="1">PT Maju Bersama</option>
            <option value="2">CV Sukses Makmur</option>
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">No. Job (Opsional)</label>
          <select class="input-field">
            <option value="">Pilih job</option>
            <option value="1">JOB-2024-001234</option>
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Tanggal Invoice</label>
          <input type="date" class="input-field" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Jatuh Tempo</label>
          <input type="date" class="input-field" />
        </div>
        <div class="space-y-2 md:col-span-2">
          <label class="text-sm font-medium">Deskripsi</label>
          <textarea rows="3" placeholder="Detail tagihan..." class="input-field"></textarea>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Jumlah</label>
          <input type="text" placeholder="Rp 0" class="input-field" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">PPN</label>
          <select class="input-field">
            <option value="0">Tanpa PPN</option>
            <option value="1.1">PPN 1.1% (Freight)</option>
            <option value="11">PPN 11%</option>
          </select>
        </div>
      </div>
      <div class="flex justify-end gap-3 pt-4 border-t border-border">
        <NuxtLink to="/finance/invoice" class="btn-secondary">Batal</NuxtLink>
        <button type="submit" class="btn-primary">
          <Save class="w-4 h-4 mr-2" />
          Simpan
        </button>
      </div>
    </form>
  </div>
</template>
