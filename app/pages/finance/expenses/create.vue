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
        <NuxtLink to="/finance/expenses" class="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft class="w-5 h-5" />
        </NuxtLink>
        <div>
          <h1 class="page-title">Catat Biaya</h1>
          <p class="text-muted-foreground mt-1">Catat biaya operasional</p>
        </div>
      </div>
    </div>

    <form class="card-elevated p-6 space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="text-sm font-medium">Vendor</label>
          <select class="input-field">
            <option value="">Pilih vendor</option>
            <option value="1">PT Pelayaran Nusantara</option>
            <option value="2">CV Trucking Mandiri</option>
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">No. Job (Opsional)</label>
          <select class="input-field">
            <option value="">Tidak terkait job</option>
            <option value="1">JOB-2024-001234</option>
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Tanggal</label>
          <input type="date" class="input-field" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Kategori</label>
          <select class="input-field">
            <option value="trucking">Trucking</option>
            <option value="port">Port Charges</option>
            <option value="customs">Customs</option>
            <option value="operational">Operasional</option>
            <option value="salary">Gaji</option>
            <option value="other">Lainnya</option>
          </select>
        </div>
        <div class="space-y-2 md:col-span-2">
          <label class="text-sm font-medium">Deskripsi</label>
          <textarea rows="2" placeholder="Keterangan biaya..." class="input-field"></textarea>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Jumlah</label>
          <input type="text" placeholder="Rp 0" class="input-field" />
        </div>
      </div>
      <div class="flex justify-end gap-3 pt-4 border-t border-border">
        <NuxtLink to="/finance/expenses" class="btn-secondary">Batal</NuxtLink>
        <button type="submit" class="btn-primary">
          <Save class="w-4 h-4 mr-2" />
          Simpan
        </button>
      </div>
    </form>
  </div>
</template>
