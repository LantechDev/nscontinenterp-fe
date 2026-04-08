<script setup lang="ts">
defineProps<{
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
  };
  taxTypeOptions: Array<{ value: string; label: string }>;
}>();

const emit = defineEmits<{
  close: [];
  submit: [];
}>();
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

          <div>
            <label class="block text-sm font-medium mb-1">Nama Pajak</label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Tipe</label>
              <select
                v-model="formData.type"
                required
                class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="" disabled>Pilih Tipe</option>
                <option v-for="opt in taxTypeOptions" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
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
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Deskripsi</label>
            <textarea
              v-model="formData.description"
              rows="2"
              class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
            ></textarea>
          </div>

          <div class="flex items-center gap-2">
            <input
              v-model="formData.isActive"
              type="checkbox"
              id="isActive"
              class="w-4 h-4 rounded border-border text-[#012D5A] focus:ring-[#012D5A]"
            />
            <label for="isActive" class="text-sm font-medium">Pajak Aktif</label>
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
