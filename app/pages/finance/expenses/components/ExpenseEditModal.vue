<script setup lang="ts">
import { computed } from "vue";
import { type ExpenseFormData } from "~/composables/useExpensePage";
import Combobox from "~/components/ui/Combobox.vue";
import SearchSelect from "~/components/ui/SearchSelect.vue";
import type { SearchSelectFetchFn } from "~/components/ui/SearchSelect.vue";

const props = defineProps<{
  isOpen: boolean;
  isSubmitting: boolean;
  editError: string | null;
  editingExpenseId: string;
  formData: ExpenseFormData;
  categoryOptions: Array<{ value: string; label: string }>;
  companies: Array<{ id: string; name: string }>;
  jobs: Array<{ id: string; jobNumber: string }>;
  taxOptions: Array<{ id: string; name: string; rate: number }>;
  hideJob?: boolean;
  useManualAccount?: boolean;
  handleAccountSearch?: SearchSelectFetchFn;
}>();

const emit = defineEmits<{
  close: [];
  submit: [];
  createVendor: [name: string];
  createCategory: [name: string];
  toggleManualAccount: [checked: boolean];
}>();

const parseInputCurrency = (val: string, currency: string = props.formData.currency) => {
  if (!val) return 0;

  if (currency === "IDR") {
    // For IDR, dots are thousands separators. Strip all non-numeric except minus.
    const numeric = Number(val.replace(/[^0-9-]/g, ""));
    return isNaN(numeric) ? 0 : numeric;
  }

  let normalized = val;
  if (currency === "USD") {
    // For USD, handle comma/dot as decimal separators
    const hasComma = val.includes(",");
    const hasDot = val.includes(".");

    if (hasComma && !hasDot) {
      normalized = val.replace(",", ".");
    } else if (hasComma && hasDot) {
      if (val.lastIndexOf(",") > val.lastIndexOf(".")) {
        normalized = val.replace(/\./g, "").replace(",", ".");
      } else {
        normalized = val.replace(/,/g, "");
      }
    }
  }

  const numeric = Number(normalized.replace(/[^0-9.-]+/g, ""));
  return isNaN(numeric) ? 0 : numeric;
};

const formatInputCurrency = (val: number | string, currency: string = props.formData.currency) => {
  if (val === undefined || val === null || val === "") return "";
  const numericVal = typeof val === "string" ? parseInputCurrency(val, currency) : val;
  if (isNaN(numericVal)) return "";

  return new Intl.NumberFormat(currency === "IDR" ? "id-ID" : "en-US", {
    maximumFractionDigits: currency === "IDR" ? 0 : 2,
    minimumFractionDigits: 0,
  }).format(numericVal);
};

const computedCategory = computed({
  get: () =>
    props.hideJob || props.formData.direction === "IN"
      ? props.formData.expenseCategoryId
      : props.formData.categoryId,
  set: (val) => {
    if (props.hideJob || props.formData.direction === "IN") {
      props.formData.expenseCategoryId = val;
    } else {
      props.formData.categoryId = val;
    }
  },
});
</script>

<template>
  <Teleport v-if="isOpen" to="body">
    <div class="fixed inset-0 z-[1100] flex items-center justify-center">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50" @click="emit('close')"></div>

      <!-- Modal Content -->
      <div
        class="relative bg-white rounded-xl shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto"
      >
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-border">
          <h2 class="text-xl font-bold">
            {{
              editingExpenseId
                ? formData.direction === "IN"
                  ? "Edit Penerimaan Kas"
                  : "Edit Pengeluaran Kas"
                : formData.direction === "IN"
                  ? "Catat Penerimaan Kas"
                  : "Catat Pengeluaran Kas"
            }}
          </h2>
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

          <!-- Transaction Direction Toggle -->
          <div>
            <label class="block text-sm font-semibold mb-1.5">Tipe Transaksi</label>
            <div
              class="flex border border-border rounded-lg overflow-hidden bg-white h-10 w-full max-w-[320px]"
            >
              <button
                type="button"
                :disabled="!!editingExpenseId"
                @click="
                  formData.direction = 'OUT';
                  formData.categoryId = '';
                "
                class="flex-1 text-xs font-bold transition-colors disabled:opacity-75"
                :class="
                  formData.direction === 'OUT'
                    ? 'bg-red-600 text-white font-semibold'
                    : 'hover:bg-gray-50 text-muted-foreground bg-white'
                "
              >
                Cash Out (Pengeluaran)
              </button>
              <button
                type="button"
                :disabled="!!editingExpenseId"
                @click="
                  formData.direction = 'IN';
                  formData.categoryId = '';
                  formData.jobId = '';
                "
                class="flex-1 text-xs font-bold border-l border-border transition-colors disabled:opacity-75"
                :class="
                  formData.direction === 'IN'
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'hover:bg-gray-50 text-muted-foreground bg-white'
                "
              >
                Cash In (Penerimaan)
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">
              {{ formData.direction === "IN" ? "Nomor Transaksi" : "Nomor Biaya" }}
            </label>
            <input
              v-model="formData.number"
              type="text"
              required
              class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              v-uppercase
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Deskripsi</label>
            <textarea
              v-model="formData.description"
              rows="2"
              required
              class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              v-uppercase
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label class="block text-sm font-medium mb-1.5">Mata Uang</label>
              <div
                class="flex border border-border rounded-lg overflow-hidden bg-white h-10 w-full max-w-[200px]"
              >
                <button
                  type="button"
                  @click="
                    formData.currency = 'IDR';
                    formData.exchangeRate = 1;
                  "
                  class="flex-1 text-xs font-bold transition-colors"
                  :class="
                    formData.currency === 'IDR'
                      ? 'bg-[#012D5A] text-white'
                      : 'hover:bg-gray-50 text-muted-foreground bg-white'
                  "
                >
                  IDR
                </button>
                <button
                  type="button"
                  @click="formData.currency = 'USD'"
                  class="flex-1 text-xs font-bold border-l border-border transition-colors"
                  :class="
                    formData.currency === 'USD'
                      ? 'bg-[#012D5A] text-white'
                      : 'hover:bg-gray-50 text-muted-foreground bg-white'
                  "
                >
                  USD
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1.5">Jumlah</label>
              <div class="relative">
                <span
                  class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-bold"
                >
                  {{ formData.currency === "IDR" ? "Rp" : "$" }}
                </span>
                <input
                  type="text"
                  :value="formatInputCurrency(formData.amount)"
                  v-uppercase
                  @input="
                    (e) =>
                      (formData.amount = parseInputCurrency((e.target as HTMLInputElement).value))
                  "
                  @blur="formData.amount = formData.amount || 0"
                  class="w-full pl-9 pr-3 py-2 h-10 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1.5">Tanggal</label>
              <input
                v-model="formData.date"
                type="date"
                required
                class="w-full px-3 py-2 h-10 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                v-uppercase
              />
            </div>
          </div>

          <div
            v-if="formData.currency !== 'IDR'"
            class="p-4 bg-blue-50/50 border border-blue-100 rounded-xl space-y-2"
          >
            <label class="block text-sm font-semibold text-blue-900">
              Kurs Exchange (USD to IDR) <span class="text-destructive">*</span>
            </label>
            <div class="relative">
              <span
                class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-blue-700 font-bold"
              >
                Rp
              </span>
              <input
                type="text"
                :value="formatInputCurrency(formData.exchangeRate, 'IDR')"
                v-uppercase
                @input="
                  (e) =>
                    (formData.exchangeRate = parseInputCurrency(
                      (e.target as HTMLInputElement).value,
                      'IDR',
                    ))
                "
                placeholder="Masukkan kurs Dollar saat ini (misal: 16.000)"
                class="w-full pl-9 pr-3 py-2 h-10 border border-blue-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-sm"
              />
            </div>
            <p class="text-[11px] text-blue-800 font-medium">
              Setara dengan:
              <span class="font-bold text-blue-950">{{
                new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format((formData.amount || 0) * (formData.exchangeRate || 0))
              }}</span>
            </p>
          </div>

          <div :class="hideJob || formData.direction === 'IN' ? 'block' : 'grid grid-cols-2 gap-4'">
            <div>
              <label class="block text-sm font-medium mb-1">
                {{ formData.direction === "IN" ? "Kontak / Sumber" : "Vendor" }}
              </label>
              <Combobox
                v-model="formData.vendorId"
                :options="companies"
                :placeholder="formData.direction === 'IN' ? 'Pilih Kontak' : 'Pilih Vendor'"
                allow-create
                @create="(name) => emit('createVendor', name)"
              />
            </div>

            <div v-if="!hideJob && formData.direction !== 'IN'">
              <label class="block text-sm font-medium mb-1">Job</label>
              <Combobox
                v-model="formData.jobId"
                :options="jobs"
                label-key="jobNumber"
                placeholder="Pilih Job"
              />
            </div>
          </div>

          <div v-if="(hideJob || formData.direction === 'IN') && !useManualAccount">
            <label class="block text-sm font-medium mb-1">Kategori Biaya</label>
            <Combobox
              v-model="computedCategory"
              :options="categoryOptions"
              value-key="value"
              label-key="label"
              placeholder="Pilih Kategori"
              allow-create
              @create="(name) => emit('createCategory', name)"
            />
          </div>

          <div v-if="!hideJob && formData.direction !== 'IN'">
            <div class="flex items-center gap-2 mb-3">
              <label class="text-sm font-medium">Kategori</label>
              <label class="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  :checked="useManualAccount"
                  :disabled="!!editingExpenseId"
                  @change="
                    (e) => {
                      const checked = (e.target as HTMLInputElement).checked;
                      emit('toggleManualAccount', checked);
                    }
                  "
                  class="w-4 h-4 rounded border-border accent-[#012D5A]"
                />
                Akun Manual (COA)
              </label>
            </div>
            <Combobox
              v-if="!useManualAccount"
              v-model="computedCategory"
              :options="categoryOptions"
              value-key="value"
              label-key="label"
              placeholder="Pilih Kategori"
              allow-create
              @create="(name) => emit('createCategory', name)"
            />
            <SearchSelect
              v-else
              v-model="formData.overrideAccountId"
              :fetch-options="handleAccountSearch ?? (async () => ({ success: true, data: [] }))"
              placeholder="Cari akun COA..."
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Pajak</label>
            <Combobox
              v-model="formData.taxId"
              :options="taxOptions.map((t) => ({ id: t.id, name: `${t.name} (${t.rate}%)` }))"
              placeholder="Tanpa Pajak"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Catatan</label>
            <textarea
              v-model="formData.notes"
              rows="2"
              class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              v-uppercase
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
