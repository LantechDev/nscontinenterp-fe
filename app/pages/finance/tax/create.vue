<script setup lang="ts">
import { ArrowLeft, Save } from "lucide-vue-next";
import { useFinanceTax } from "~/composables/useFinanceTax";

definePageMeta({
  layout: "dashboard",
});

const { createTax, isLoading } = useFinanceTax();

const form = ref({
  name: "",
  rate: 0,
  type: "",
  description: "",
  isActive: true,
});

async function handleSubmit() {
  try {
    await createTax(form.value);
    navigateTo("/finance/tax");
  } catch (error) {
    alert("Gagal menyimpan pajak: " + (error as Error).message);
  }
}
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <div class="page-header">
      <div class="flex items-center gap-4">
        <NuxtLink to="/finance/tax" class="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft class="w-5 h-5" />
        </NuxtLink>
        <div>
          <h1 class="text-2xl font-bold">Catat Pajak</h1>
          <p class="text-muted-foreground mt-1">Tambah catatan pajak baru</p>
        </div>
      </div>
    </div>

    <div class="max-w-3xl">
      <form
        @submit.prevent="handleSubmit"
        class="space-y-6 bg-white p-8 rounded-xl border border-border"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-sm font-medium">Nama Pajak</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none"
              placeholder="Contoh: PPN 11%"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Tipe Pajak</label>
            <select
              v-model="form.type"
              required
              class="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none bg-white"
            >
              <option value="">Pilih tipe pajak</option>
              <option value="ppn">PPN</option>
              <option value="pph">PPh</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Rate (%)</label>
            <input
              v-model="form.rate"
              type="number"
              step="0.01"
              required
              class="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none"
              placeholder="0"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Status</label>
            <select
              v-model="form.isActive"
              class="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none bg-white"
            >
              <option :value="true">Aktif</option>
              <option :value="false">Nonaktif</option>
            </select>
          </div>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Deskripsi</label>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none resize-none"
            placeholder="Catatan tambahan..."
          ></textarea>
        </div>
        <div class="flex justify-end gap-3 pt-4 border-t border-border">
          <button
            type="button"
            @click="navigateTo('/finance/tax')"
            class="px-6 py-2 border rounded-lg hover:bg-muted transition-colors font-medium"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="isLoading"
            class="px-6 py-2 bg-[#012D5A] text-white rounded-lg hover:bg-[#012D5A]/90 transition-colors font-medium flex items-center gap-2"
          >
            <Save v-if="!isLoading" class="w-4 h-4" />
            <span v-if="isLoading">Menyimpan...</span>
            <span v-else>Simpan</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
