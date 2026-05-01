<script setup lang="ts">
import { ArrowLeft, Save } from "lucide-vue-next";
import SearchSelect from "~/components/ui/SearchSelect.vue";
import { useMasterData } from "~/composables/useMasterData";
import { type Tax } from "~/composables/useFinanceTax";

definePageMeta({
  layout: "dashboard",
});

const { fetchCompaniesWithParams } = useMasterData();

// Client-side: fetch initial dropdown data (avoid slow cross-region SSR)
const {
  data: taxData,
  pending: isTaxesLoading,
  error: taxesError,
  refresh: refreshTaxes,
} = await useAsyncData<{ items: Tax[] }>(
  "invoice-create-taxes",
  async () => await $fetch<{ items: Tax[] }>("/api/finance/taxes?isActive=true&limit=100"),
  { server: false },
);

const taxOptions = computed(() => taxData.value?.items || []);
const formattedTaxOptions = computed(() =>
  taxOptions.value.map((tax) => ({ id: tax.id, name: `${tax.name} (${tax.rate}%)` })),
);

const customerId = ref("");
const jobId = ref("");
const taxId = ref("");

const handleCustomerSearch = async (options: { query: string; page?: number; limit?: number }) => {
  try {
    const customers = await fetchCompaniesWithParams({
      search: options.query,
      type: "CUSTOMER",
      status: "ACTIVE",
      limit: options.limit || 50,
    });
    return {
      success: true,
      data: customers.map((c) => ({ id: c.id, name: c.name })),
    };
  } catch {
    return { success: false, error: "Failed to fetch customers" };
  }
};

const handleJobSearch = async (options: { query: string; page?: number; limit?: number }) => {
  try {
    const jobs = await $fetch<Array<{ id: string; jobNumber: string }>>(`/api/operational/jobs`, {
      params: { search: options.query, limit: options.limit || 50 },
    });
    return {
      success: true,
      data: jobs.map((j) => ({ id: j.id, name: j.jobNumber })),
    };
  } catch {
    return { success: false, error: "Failed to fetch jobs" };
  }
};
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <div class="page-header">
      <div class="flex items-center gap-4">
        <NuxtLink to="/finance/invoice" class="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft class="w-5 h-5" />
        </NuxtLink>
        <div>
          <h1 class="page-title">Buat Invoice</h1>
          <p class="text-muted-foreground mt-1">Buat tagihan ke customer</p>
        </div>
      </div>
    </div>

    <div
      v-if="taxesError"
      class="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm animate-fade-in"
    >
      <div class="flex items-center justify-between gap-4">
        <span>Gagal memuat data pajak. Silakan coba lagi.</span>
        <button class="btn-secondary" type="button" @click="refreshTaxes()">Coba lagi</button>
      </div>
    </div>

    <div v-if="isTaxesLoading" class="flex justify-center py-6">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
    </div>

    <form class="card-elevated p-6 space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="text-sm font-medium">Customer</label>
          <SearchSelect
            v-model="customerId"
            :fetch-options="handleCustomerSearch"
            placeholder="Pilih customer..."
          />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">No. Job (Opsional)</label>
          <SearchSelect
            v-model="jobId"
            :fetch-options="handleJobSearch"
            placeholder="Pilih job..."
          />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Tanggal Invoice</label>
          <input type="date" class="input-field" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Jatuh Tempo</label>
          <input type="date" class="input-field" />
        </div>
        <div class="space-y-2 md:col-span-2">
          <label class="text-sm font-medium">Deskripsi</label>
          <textarea rows="3" placeholder="Detail tagihan..." class="input-field"></textarea>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Jumlah</label>
          <input type="text" placeholder="Rp 0" class="input-field" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">PPN</label>
          <SearchSelect
            v-model="taxId"
            :initial-options="formattedTaxOptions"
            placeholder="Tanpa Pajak"
          />
        </div>
      </div>
      <div class="flex justify-end gap-3 pt-4 border-t border-border">
        <NuxtLink to="/finance/invoice" class="btn-secondary">Batal</NuxtLink>
        <button type="submit" class="btn-primary">
          <Save class="w-4 h-4 mr-2" />
          Simpan
        </button>
      </div>
    </form>
  </div>
</template>
