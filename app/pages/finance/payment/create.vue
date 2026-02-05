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
        <NuxtLink to="/finance/payment" class="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft class="w-5 h-5" />
        </NuxtLink>
        <div>
          <h1 class="page-title">Catat Pembayaran</h1>
          <p class="text-muted-foreground mt-1">Catat pembayaran dari customer</p>
        </div>
      </div>
    </div>

    <form class="card-elevated p-6 space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="text-sm font-medium">Invoice</label>
          <select class="input-field">
            <option value="">Pilih invoice</option>
            <option value="1">INV-2024-0892 - PT Maju Bersama</option>
            <option value="2">INV-2024-0891 - CV Sukses Makmur</option>
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Tanggal Pembayaran</label>
          <input type="date" class="input-field" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Jumlah</label>
          <input type="text" placeholder="Rp 0" class="input-field" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Metode Pembayaran</label>
          <select class="input-field">
            <option value="transfer">Bank Transfer</option>
            <option value="cash">Cash</option>
            <option value="check">Giro/Cek</option>
          </select>
        </div>
        <div class="space-y-2 md:col-span-2">
          <label class="text-sm font-medium">Keterangan</label>
          <textarea rows="2" placeholder="Catatan pembayaran..." class="input-field"></textarea>
        </div>
      </div>
      <div class="flex justify-end gap-3 pt-4 border-t border-border">
        <NuxtLink to="/finance/payment" class="btn-secondary">Batal</NuxtLink>
        <button type="submit" class="btn-primary">
          <Save class="w-4 h-4 mr-2" />
          Simpan
        </button>
      </div>
    </form>
  </div>
</template>
