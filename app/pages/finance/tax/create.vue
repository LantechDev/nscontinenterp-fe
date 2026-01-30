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
        <NuxtLink to="/finance/tax" class="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft class="w-5 h-5" />
        </NuxtLink>
        <div>
          <h1 class="page-title">Catat Pajak</h1>
          <p class="text-muted-foreground mt-1">Tambah catatan pajak baru</p>
        </div>
      </div>
    </div>

    <form class="card-elevated p-6 space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="text-sm font-medium">Tipe Pajak</label>
          <select class="input-field">
            <option value="">Pilih tipe pajak</option>
            <option value="ppn">PPN (1.1%)</option>
            <option value="ppn-11">PPN (11%)</option>
            <option value="pph">PPh</option>
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Periode</label>
          <input type="month" class="input-field" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Jumlah</label>
          <input type="text" placeholder="Rp 0" class="input-field" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Status</label>
          <select class="input-field">
            <option value="pending">Pending</option>
            <option value="reported">Dilaporkan</option>
            <option value="paid">Dibayar</option>
          </select>
        </div>
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium">Keterangan</label>
        <textarea rows="3" placeholder="Catatan tambahan..." class="input-field"></textarea>
      </div>
      <div class="flex justify-end gap-3 pt-4 border-t border-border">
        <NuxtLink to="/finance/tax" class="btn-secondary"> Batal </NuxtLink>
        <button type="submit" class="btn-primary">
          <Save class="w-4 h-4 mr-2" />
          Simpan
        </button>
      </div>
    </form>
  </div>
</template>
