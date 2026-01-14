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
                <NuxtLink to="/operational/jobs" class="p-2 rounded-lg hover:bg-muted transition-colors">
                    <ArrowLeft class="w-5 h-5" />
                </NuxtLink>
                <div>
                    <h1 class="page-title">Open Job Baru</h1>
                    <p class="text-muted-foreground mt-1">Buat job/shipment baru</p>
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
                    <label class="text-sm font-medium">Tipe</label>
                    <select class="input-field">
                        <option value="export">Export</option>
                        <option value="import">Import</option>
                    </select>
                </div>
                <div class="space-y-2">
                    <label class="text-sm font-medium">Pelabuhan Muat</label>
                    <input type="text" placeholder="Jakarta" class="input-field" />
                </div>
                <div class="space-y-2">
                    <label class="text-sm font-medium">Pelabuhan Bongkar</label>
                    <input type="text" placeholder="Singapore" class="input-field" />
                </div>
                <div class="space-y-2">
                    <label class="text-sm font-medium">Nama Kapal</label>
                    <input type="text" placeholder="MV Example" class="input-field" />
                </div>
                <div class="space-y-2">
                    <label class="text-sm font-medium">ETA</label>
                    <input type="date" class="input-field" />
                </div>
                <div class="space-y-2">
                    <label class="text-sm font-medium">Jenis Container</label>
                    <select class="input-field">
                        <option value="20ft">20FT</option>
                        <option value="40ft">40FT</option>
                        <option value="40hc">40HC</option>
                        <option value="lcl">LCL</option>
                    </select>
                </div>
                <div class="space-y-2">
                    <label class="text-sm font-medium">Jumlah</label>
                    <input type="number" placeholder="1" class="input-field" />
                </div>
            </div>
            <div class="flex justify-end gap-3 pt-4 border-t border-border">
                <NuxtLink to="/operational/jobs" class="btn-secondary">Batal</NuxtLink>
                <button type="submit" class="btn-primary">
                    <Save class="w-4 h-4 mr-2" />
                    Simpan
                </button>
            </div>
        </form>
    </div>
</template>
