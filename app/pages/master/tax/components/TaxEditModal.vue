<script setup lang="ts">
import Checkbox from "~/components/ui/Checkbox.vue";
import Combobox from "~/components/ui/Combobox.vue";
const props = defineProps<{
  isOpen: boolean;
  isSubmitting: boolean;
  editError: string | null;
  editingTaxId: string;
  formData: {
    name: string;
    rate: number;
    type: string;
    description: string;
    isActive: boolean;
    isDefault: boolean;
    dppBasePercent: number;
    isDeduction: boolean;
  };
  taxTypeOptions: Array<{ value: string; label: string }>;
}>();

const emit = defineEmits<{
  close: [];
  submit: [];
}>();

const treatmentOptions = [
  { id: "addition", name: "Penambah (ditambahkan ke total)" },
  { id: "deduction", name: "Pengurang (dipotong dari total)" },
];
const treatmentValue = computed({
  get: () => (props.formData.isDeduction ? "deduction" : "addition"),
  set: (value: string | null | undefined) => {
    props.formData.isDeduction = value === "deduction";
  },
});
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[1100] flex items-center justify-center">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50" @click="emit('close')"></div>

      <!-- Modal Content -->
      <div
        class="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
      >
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-border">
          <h2 class="text-xl font-bold">Edit Pajak</h2>
          <button @click="emit('close')" class="p-1 hover:bg-muted rounded-lg transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Body -->
        <form @submit.prevent="emit('submit')" class="p-6 space-y-4">
          <div v-if="editError" class="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
            {{ editError }}
          </div>

          <div v-if="!formData.name && !editError" class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#012D5A]"></div>
          </div>

          <div v-else class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Nama Pajak</label>
              <input
                v-model="formData.name"
                v-uppercase
                type="text"
                required
                class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1">Tipe</label>
                <Combobox
                  v-model="formData.type"
                  :options="taxTypeOptions.map((opt) => ({ id: opt.value, name: opt.label }))"
                  placeholder="Pilih Tipe"
                />
              </div>

              <div>
                <label class="block text-sm font-medium mb-1">Rate (%)</label>
                <input
                  v-model.number="formData.rate"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  required
                  class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                  v-uppercase
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Dikali (%) / DPP Base</label>
              <input
                v-model.number="formData.dppBasePercent"
                type="number"
                step="0.01"
                min="0"
                max="100"
                class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <p class="text-xs text-muted-foreground mt-1">
                Default 100. Untuk PPh tertentu (dikali ½) isi 50.
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Perlakuan terhadap Total</label>
              <Combobox
                v-model="treatmentValue"
                :options="treatmentOptions"
                placeholder="Pilih perlakuan"
              />
              <p class="text-xs text-muted-foreground mt-1">
                Pengurang = dipotong (PPh). Penambah = ditambahkan (PPN).
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Deskripsi</label>
              <textarea
                v-model="formData.description"
                v-uppercase
                rows="2"
                class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              ></textarea>
            </div>

            <div
              class="flex items-center gap-2 cursor-pointer w-fit group"
              @click="formData.isActive = !formData.isActive"
            >
              <Checkbox v-model="formData.isActive" class="pointer-events-none" />
              <span
                class="text-sm font-medium select-none group-hover:text-blue-900 transition-colors"
                >Pajak Aktif</span
              >
            </div>

            <div
              class="flex items-center gap-2 cursor-pointer w-fit group"
              @click="formData.isDefault = !formData.isDefault"
            >
              <Checkbox v-model="formData.isDefault" class="pointer-events-none" />
              <span
                class="text-sm font-medium select-none group-hover:text-blue-900 transition-colors"
                >Jadikan default (otomatis terpilih di invoice baru)</span
              >
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              @click="emit('close')"
              class="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-4 py-2 text-sm font-medium bg-[#012D5A] text-white rounded-lg hover:bg-[#012D5A]/90 transition-colors disabled:opacity-50"
            >
              {{ isSubmitting ? "Menyimpan..." : "Simpan" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
