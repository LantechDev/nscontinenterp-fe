<script setup lang="ts">
import { ArrowLeft, Save } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { useFinanceTax } from "~/composables/useFinanceTax";
import Combobox from "~/components/ui/Combobox.vue";
import Checkbox from "~/components/ui/Checkbox.vue";

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
  isDefault: false,
  dppBasePercent: 100,
});
const taxTypeOptions = [
  { id: "ppn", name: "PPN" },
  { id: "pph", name: "PPh" },
];
const statusOptions = [
  { id: "true", name: "Aktif" },
  { id: "false", name: "Nonaktif" },
];
const isActiveValue = computed({
  get: () => String(form.value.isActive),
  set: (value: string | null | undefined) => {
    form.value.isActive = value !== "false";
  },
});

async function handleSubmit() {
  try {
    await createTax({
      ...form.value,
      name: form.value.name.toUpperCase(),
      description: form.value.description.toUpperCase(),
    });
    navigateTo("/master/tax");
  } catch (error) {
    toast.error("Gagal menyimpan pajak: " + (error as Error).message);
  }
}
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <div class="page-header">
      <div class="flex items-center gap-4">
        <NuxtLink to="/master/tax" class="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft class="w-5 h-5" />
        </NuxtLink>
        <div>
          <h1 class="text-2xl font-bold">Catat Pajak</h1>
          <p class="text-muted-foreground mt-1">Tambah catatan pajak baru</p>
        </div>
      </div>
    </div>

    <div class="max-w-8xl">
      <form
        @submit.prevent="handleSubmit"
        class="space-y-6 bg-white p-8 rounded-xl border border-border"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-sm font-medium">Nama Pajak</label>
            <input
              v-model="form.name"
              v-uppercase
              type="text"
              required
              class="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none"
              placeholder="Contoh: PPN 11%"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Tipe Pajak</label>
            <Combobox
              v-model="form.type"
              :options="taxTypeOptions"
              placeholder="Pilih tipe pajak"
            />
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
              v-uppercase
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Status</label>
            <Combobox v-model="isActiveValue" :options="statusOptions" placeholder="Pilih status" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Dikali (%) / DPP Base</label>
            <input
              v-model.number="form.dppBasePercent"
              type="number"
              step="0.01"
              min="0"
              max="100"
              class="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none"
              placeholder="100"
            />
            <p class="text-xs text-muted-foreground">
              Default 100. Untuk PPh yang dikali ½ isi 50.
            </p>
          </div>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Deskripsi</label>
          <textarea
            v-model="form.description"
            v-uppercase
            rows="3"
            class="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none resize-none"
            placeholder="Catatan tambahan..."
          ></textarea>
        </div>

        <div
          class="flex items-center gap-2 cursor-pointer w-fit group"
          @click="form.isDefault = !form.isDefault"
        >
          <Checkbox v-model="form.isDefault" class="pointer-events-none" />
          <span class="text-sm font-medium select-none group-hover:text-blue-900 transition-colors"
            >Jadikan default (otomatis terpilih di invoice baru)</span
          >
        </div>
        <div class="flex justify-end gap-3 pt-4 border-t border-border">
          <button
            type="button"
            @click="navigateTo('/master/tax')"
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
