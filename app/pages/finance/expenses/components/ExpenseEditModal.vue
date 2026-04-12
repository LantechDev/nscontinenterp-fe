<script setup lang="ts">
import { useExpensePage } from "~/composables/useExpensePage";

const props = defineProps<{
  isOpen: boolean;
  isSubmitting: boolean;
  editError: string | null;
  editingExpenseId: string;
  formData: {
    number: string;
    description: string;
    amount: number;
    date: string;
    categoryId: string;
    vendorId: string;
    jobId: string;
    taxId: string;
    notes: string;
  };
  categoryOptions: Array<{ value: string; label: string }>;
  companies: Array<{ id: string; name: string }>;
  jobs: Array<{ id: string; jobNumber: string }>;
  taxOptions: Array<{ id: string; name: string; rate: number }>;
}>();

const emit = defineEmits<{
  close: [];
  submit: [];
}>();

const { formatDateForInput } = useExpensePage();
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[1100] flex items-center justify-center">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50" @click="emit('close')"></div>

      <!-- Modal Content -->
      <div
        class="relative bg-white rounded-xl shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto"
      >
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-border">
          <h2 class="text-xl font-bold">Edit Biaya</h2>
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
            <label class="block text-sm font-medium mb-1">Nomor Biaya</label>
            <input
              v-model="formData.number"
              type="text"
              required
              class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Deskripsi</label>
            <textarea
              v-model="formData.description"
              rows="2"
              required
              class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Jumlah</label>
              <input
                v-model.number="formData.amount"
                type="number"
                step="0.01"
                required
                class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Tanggal</label>
              <input
                v-model="formData.date"
                type="date"
                required
                class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Vendor</label>
              <select
                v-model="formData.vendorId"
                class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Pilih Vendor</option>
                <option v-for="company in companies" :key="company.id" :value="company.id">
                  {{ company.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Job</label>
              <select
                v-model="formData.jobId"
                class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Pilih Job</option>
                <option v-for="job in jobs" :key="job.id" :value="job.id">
                  {{ job.jobNumber }}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Kategori</label>
            <select
              v-model="formData.categoryId"
              class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option v-for="opt in categoryOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Pajak</label>
            <select
              v-model="formData.taxId"
              class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Tanpa Pajak</option>
              <option v-for="tax in taxOptions" :key="tax.id" :value="tax.id">
                {{ tax.name }} ({{ tax.rate }}%)
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Catatan</label>
            <textarea
              v-model="formData.notes"
              rows="2"
              class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
            ></textarea>
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
