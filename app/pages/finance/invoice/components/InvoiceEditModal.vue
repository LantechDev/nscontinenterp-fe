<script setup lang="ts">
import { Plus, Save, Trash2 } from "lucide-vue-next";
import { formatRupiah } from "~/lib/utils";
import type { InvoiceFormData } from "~/composables/useInvoicePage";

interface Props {
  isOpen: boolean;
  isSubmitting: boolean;
  editError: string | null;
  formData: InvoiceFormData;
  selectedTaxRate: number;
  statusOptions: Array<{ id: string; name: string }>;
  taxOptions: Array<{ value: number; label: string }>;
  companies: Array<{ id: string; name: string }>;
  jobs: Array<{ id: string; jobNumber: string }>;
  services: Array<{ id: string; name: string }>;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  submit: [];
  addLineItem: [];
  removeLineItem: [index: number];
  updateItemAmount: [index: number];
  updateTaxRate: [value: number];
}>();

const formatCurrency = formatRupiah;
</script>

<template>
  <UiModal
    :model-value="isOpen"
    title="Edit Invoice"
    description="Ubah semua detail invoice"
    width="max-w-4xl"
    @update:model-value="(val) => !val && emit('close')"
    @close="emit('close')"
  >
    <form class="space-y-6" @submit.prevent="emit('submit')">
      <!-- Error Message -->
      <div v-if="editError" class="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-sm text-red-600">{{ editError }}</p>
      </div>

      <!-- Basic Info Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label class="text-sm font-medium text-foreground">
            Nomor Invoice <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.invoiceNumber"
            type="text"
            class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white"
            required
          />
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium text-foreground">
            Status Invoice <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formData.statusId"
            class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white"
            required
          >
            <option value="" disabled>Pilih status</option>
            <option v-for="status in statusOptions" :key="status.id" :value="status.id">
              {{ status.name }}
            </option>
          </select>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium text-foreground">
            Tanggal Invoice <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.issuedDate"
            type="date"
            class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white"
            required
          />
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium text-foreground">
            Jatuh Tempo <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.dueDate"
            type="date"
            class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white"
            required
          />
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium text-foreground">
            Customer <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formData.companyId"
            class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white"
            required
          >
            <option value="" disabled>Pilih customer</option>
            <option v-for="company in companies" :key="company.id" :value="company.id">
              {{ company.name }}
            </option>
          </select>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium text-foreground"> Job Reference </label>
          <select
            v-model="formData.jobId"
            class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white"
          >
            <option value="">Pilih job (opsional)</option>
            <option v-for="job in jobs" :key="job.id" :value="job.id">
              {{ job.jobNumber }}
            </option>
          </select>
        </div>
      </div>

      <!-- Line Items Section -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-foreground">
            Item Invoice <span class="text-red-500">*</span>
          </label>
          <button
            type="button"
            @click="emit('addLineItem')"
            class="text-sm text-[#012D5A] hover:text-[#012D5A]/80 font-medium flex items-center gap-1"
          >
            <Plus class="w-4 h-4" />
            Tambah Item
          </button>
        </div>

        <!-- Line Items Table -->
        <div class="border border-border rounded-lg overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-muted">
              <tr>
                <th class="px-3 py-2 text-left font-medium text-foreground w-1/3">Deskripsi</th>
                <th class="px-3 py-2 text-left font-medium text-foreground">Service</th>
                <th class="px-3 py-2 text-center font-medium text-foreground w-20">Qty</th>
                <th class="px-3 py-2 text-right font-medium text-foreground">Harga Satuan</th>
                <th class="px-3 py-2 text-right font-medium text-foreground">Jumlah</th>
                <th class="px-3 py-2 w-10"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr v-for="(item, index) in formData.items" :key="index" class="hover:bg-muted/50">
                <td class="p-2">
                  <input
                    v-model="item.description"
                    type="text"
                    placeholder="Deskripsi"
                    class="w-full px-2 py-1.5 rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white text-sm"
                    required
                  />
                </td>
                <td class="p-2">
                  <select
                    v-model="item.serviceId"
                    class="w-full px-2 py-1.5 rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white text-sm"
                  >
                    <option value="">Pilih service</option>
                    <option v-for="service in services" :key="service.id" :value="service.id">
                      {{ service.name }}
                    </option>
                  </select>
                </td>
                <td class="p-2">
                  <input
                    v-model.number="item.quantity"
                    type="number"
                    min="1"
                    class="w-full px-2 py-1.5 rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white text-sm text-center"
                    @input="emit('updateItemAmount', index)"
                    required
                  />
                </td>
                <td class="p-2">
                  <input
                    v-model.number="item.unitPrice"
                    type="number"
                    min="0"
                    class="w-full px-2 py-1.5 rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white text-sm text-right"
                    @input="emit('updateItemAmount', index)"
                    required
                  />
                </td>
                <td class="p-2 text-right font-medium">
                  {{ formatCurrency(item.amount) }}
                </td>
                <td class="p-2">
                  <button
                    type="button"
                    @click="emit('removeLineItem', index)"
                    class="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tax and Notes Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label class="text-sm font-medium text-foreground">PPN</label>
          <select
            :model-value="selectedTaxRate"
            class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white"
            @update:model-value="emit('updateTaxRate', Number($event))"
          >
            <option v-for="tax in taxOptions" :key="tax.value" :value="tax.value">
              {{ tax.label }}
            </option>
          </select>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium text-foreground">Catatan</label>
          <textarea
            v-model="formData.notes"
            rows="2"
            placeholder="Catatan invoice (opsional)"
            class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white text-sm"
          ></textarea>
        </div>
      </div>

      <!-- Totals -->
      <div class="border-t border-border pt-4">
        <div class="flex justify-end">
          <div class="w-64 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-muted-foreground">Subtotal:</span>
              <span class="font-medium">{{ formatCurrency(formData.subTotal) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-muted-foreground">Pajak (PPN):</span>
              <span class="font-medium">{{ formatCurrency(formData.taxAmount) }}</span>
            </div>
            <div class="flex justify-between pt-2 border-t border-border">
              <span class="font-semibold">Total:</span>
              <span class="font-semibold text-lg">{{ formatCurrency(formData.total) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 pt-4 border-t border-border">
        <button type="button" @click="emit('close')" class="btn-secondary">Batal</button>
        <button type="submit" :disabled="isSubmitting" class="btn-primary flex items-center gap-2">
          <Save class="w-4 h-4" />
          {{ isSubmitting ? "Menyimpan..." : "Simpan" }}
        </button>
      </div>
    </form>
  </UiModal>
</template>
