<script setup lang="ts">
import { ArrowLeft, Save } from "lucide-vue-next";
import SearchSelect from "~/components/ui/SearchSelect.vue";
import { useFinanceExpense } from "~/composables/useFinanceExpense";
import { useFinanceTax, type Tax } from "~/composables/useFinanceTax";
import { type Tax as TaxType } from "~/composables/useFinanceTax";
import { toast } from "vue-sonner";

definePageMeta({
  layout: "dashboard",
});

const { createExpense, isLoading } = useFinanceExpense();

// SSR-first: fetch initial dropdown data
const { data: dropdownData } = await useAsyncData<{
  vendors: Array<{ id: string; name: string }>;
  jobs: Array<{ id: string; jobNumber: string }>;
  categories: Array<{ id: string; name: string }>;
  taxes: TaxType[];
}>("expense-create-data", async () => {
  const [vendorRes, jobRes, serviceRes, taxRes] = await Promise.all([
    $fetch("/api/master/companies?type=VENDOR&limit=50"),
    $fetch("/api/operational/jobs"),
    $fetch("/api/master/services"),
    $fetch<{ items: TaxType[] }>("/api/finance/taxes?isActive=true&limit=100"),
  ]);

  const vendors =
    (vendorRes as { success: boolean; data?: Array<{ id: string; name: string }> })?.data || [];
  const jobs =
    (jobRes as { success: boolean; data?: Array<{ id: string; jobNumber: string }> })?.data || [];
  const services =
    (serviceRes as { success: boolean; data?: Array<{ category?: { id: string; name: string } }> })
      ?.data || [];

  const catMap = new Map<string, { id: string; name: string }>();
  for (const svc of services) {
    if (svc.category) {
      catMap.set(svc.category.id, { id: svc.category.id, name: svc.category.name });
    }
  }
  const categories = Array.from(catMap.values());
  const taxes = taxRes?.items || [];

  return { vendors, jobs, categories, taxes };
});

const vendors = computed(() => dropdownData.value?.vendors || []);
const jobs = computed(() => dropdownData.value?.jobs || []);
const categories = computed(() => dropdownData.value?.categories || []);
const taxes = computed(() => dropdownData.value?.taxes || []);

// Computed options for template
const categoryOptions = computed(() =>
  categories.value.map((cat) => ({ id: cat.id, name: cat.name })),
);
const jobOptions = computed(() => jobs.value.map((job) => ({ id: job.id, name: job.jobNumber })));
const taxOptions = computed(() =>
  taxes.value.map((tax) => ({ id: tax.id, name: `${tax.name} (${tax.rate}%)` })),
);

async function fetchVendorOptions({ query }: { query: string }) {
  try {
    const result = await $fetch("/api/master/companies", {
      params: { type: "VENDOR", search: query, limit: 50 },
    });
    const vendorsList =
      (result as { success: boolean; data?: Array<{ id: string; name: string }> })?.data || [];
    return { success: true, data: vendorsList };
  } catch {
    return { success: false, error: "Failed to fetch vendors" };
  }
}

const form = ref({
  number: "",
  description: "",
  amount: 0,
  date: new Date().toISOString().split("T")[0],
  categoryId: "",
  vendorId: "",
  jobId: "",
  taxId: "",
  notes: "",
});

async function handleSubmit() {
  try {
    const payload: Record<string, unknown> = {
      number: form.value.number,
      description: form.value.description,
      amount: Number(form.value.amount),
      date: form.value.date,
    };
    if (form.value.categoryId) payload.categoryId = form.value.categoryId;
    if (form.value.vendorId) payload.vendorId = form.value.vendorId;
    if (form.value.jobId) payload.jobId = form.value.jobId;
    if (form.value.taxId) payload.taxId = form.value.taxId;

    await createExpense(payload);
    navigateTo("/finance/expense");
  } catch (error) {
    toast.error("Gagal mencatat biaya: " + (error as Error).message);
  }
}

// Generate expense number on client-side
if (import.meta.client) {
  form.value.number = `EXP-${Date.now().toString().slice(-6)}`;
}
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <div class="page-header">
      <div class="flex items-center gap-4">
        <NuxtLink to="/finance/expense" class="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft class="w-5 h-5" />
        </NuxtLink>
        <div>
          <h1 class="text-2xl font-bold">Catat Biaya Baru</h1>
          <p class="text-muted-foreground mt-1">Masukkan detail pengeluaran operasional</p>
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
            <label class="text-sm font-medium">No. Biaya</label>
            <input
              v-model="form.number"
              type="text"
              required
              class="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none"
              placeholder="EXP-2024-XXXX"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Tanggal</label>
            <input
              v-model="form.date"
              type="date"
              required
              class="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
          <div class="space-y-2 md:col-span-2">
            <label class="text-sm font-medium">Deskripsi</label>
            <input
              v-model="form.description"
              type="text"
              required
              class="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none"
              placeholder="Contoh: Biaya Trucking JOB..."
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Vendor</label>
            <SearchSelect
              v-model="form.vendorId"
              :fetch-options="fetchVendorOptions"
              placeholder="Pilih Vendor (Opsional)"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Kategori</label>
            <SearchSelect
              v-model="form.categoryId"
              :initial-options="categoryOptions"
              placeholder="Pilih Kategori (Opsional)"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Jumlah (IDR)</label>
            <input
              v-model="form.amount"
              type="number"
              required
              class="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none"
              placeholder="0"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">No. Job (Opsional)</label>
            <SearchSelect
              v-model="form.jobId"
              :initial-options="jobOptions"
              placeholder="Pilih Job"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Pajak</label>
            <SearchSelect
              v-model="form.taxId"
              :initial-options="taxOptions"
              placeholder="Pilih Pajak (Opsional)"
            />
          </div>
          <div class="space-y-2 md:col-span-2">
            <label class="text-sm font-medium">Keterangan Tambahan</label>
            <textarea
              v-model="form.notes"
              rows="3"
              class="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none resize-none"
              placeholder="Tambahkan catatan jika perlu..."
            ></textarea>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            @click="navigateTo('/finance/expense')"
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
            <span v-else>Simpan Biaya</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
