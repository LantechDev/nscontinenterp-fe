<script setup lang="ts">
import { ArrowLeft, Save } from "lucide-vue-next";
import SearchSelect from "~/components/ui/SearchSelect.vue";
import { useFinanceTax } from "~/composables/useFinanceTax";
import { useMasterData } from "~/composables/useMasterData";

definePageMeta({
  layout: "dashboard",
});

const { fetchTaxes } = useFinanceTax();
const { fetchCompaniesWithParams } = useMasterData();

const taxOptions = ref<Array<{ id: string; name: string; rate: number }>>([]);
const customerId = ref("");
const jobId = ref("");
const taxId = ref("");

const formattedTaxOptions = computed(() =>
  taxOptions.value.map((tax) => ({ id: tax.id, name: `${tax.name} (${tax.rate}%)` })),
);

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
    const config = useRuntimeConfig();
    const jobs = await $fetch<Array<{ id: string; jobNumber: string }>>(
      `${config.public.apiBase}/operational/jobs`,
      {
        params: { search: options.query, limit: options.limit || 50 },
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return {
      success: true,
      data: jobs.map((j) => ({ id: j.id, name: j.jobNumber })),
    };
  } catch {
    return { success: false, error: "Failed to fetch jobs" };
  }
};

onMounted(async () => {
  try {
    const taxes = await fetchTaxes({ isActive: true, limit: 100 });
    taxOptions.value = taxes.items || [];
  } catch {
    taxOptions.value = [];
  }
});
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
