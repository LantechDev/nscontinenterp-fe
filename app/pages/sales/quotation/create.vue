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
                <NuxtLink
                    to="/sales/quotation"
                    class="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                    <ArrowLeft class="w-5 h-5" />
                </NuxtLink>
                <div>
                    <h1 class="page-title">Buat Penawaran</h1>
                    <p class="text-muted-foreground mt-1">Buat penawaran harga baru</p>
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
                    <label class="text-sm font-medium">Tanggal</label>
                    <input type="date" class="input-field" />
                </div>
                <div class="space-y-2">
                    <label class="text-sm font-medium">Rute Asal</label>
                    <input type="text" placeholder="Jakarta" class="input-field" />
                </div>
                <div class="space-y-2">
                    <label class="text-sm font-medium">Rute Tujuan</label>
                    <input type="text" placeholder="Singapore" class="input-field" />
                </div>
                <div class="space-y-2 md:col-span-2">
                    <label class="text-sm font-medium">Jasa yang Ditawarkan</label>
                    <textarea
                        rows="4"
                        placeholder="Detail jasa dan harga..."
                        class="input-field"
                    ></textarea>
                </div>
                <div class="space-y-2">
                    <label class="text-sm font-medium">Total Penawaran</label>
                    <input type="text" placeholder="Rp 0" class="input-field" />
                </div>
            </div>
            <div class="flex justify-end gap-3 pt-4 border-t border-border">
                <NuxtLink to="/sales/quotation" class="btn-secondary">Batal</NuxtLink>
                <button type="submit" class="btn-primary">
                    <Save class="w-4 h-4 mr-2" />
                    Simpan
                </button>
            </div>
        </form>
    </div>
</template>
