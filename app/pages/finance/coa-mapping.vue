<script setup lang="ts">
import { Check, Loader2, Search, WalletCards } from "lucide-vue-next";
import { toast } from "vue-sonner";
import Combobox from "~/components/ui/Combobox.vue";
import { useChartOfAccounts, type ChartOfAccount } from "~/composables/useChartOfAccounts";
import type { ServiceCategory } from "~/types/master";

definePageMeta({
  layout: "dashboard",
});

interface ExpenseCategoryAccount {
  id: string;
  code: string;
  name: string;
  defaultDebitAccountId: string | null;
  defaultDebitAccount: {
    id: string;
    code: string;
    name: string;
    type: string;
    isPosting: boolean;
    isActive: boolean;
  } | null;
}

type MappingMode = "expense" | "service";

const { fetchAccounts } = useChartOfAccounts();
const { canManage, requireManage } = useFeatureAccess("finance.accounting");

const isLoading = ref(false);
const savingId = ref<string | null>(null);
const searchQuery = ref("");
const mappingMode = ref<MappingMode>("expense");
const expenseCategories = ref<ExpenseCategoryAccount[]>([]);
const serviceCategories = ref<ServiceCategory[]>([]);
const accounts = ref<ChartOfAccount[]>([]);
const expenseMappingDraft = reactive<Record<string, string>>({});
const serviceRevenueDraft = reactive<Record<string, string>>({});
const serviceCostDraft = reactive<Record<string, string>>({});

const expenseAccountOptions = computed(() =>
  accounts.value
    .filter(
      (account) =>
        account.isActive &&
        account.isPosting &&
        ["COGS", "EXPENSE", "OTHER_EXPENSE"].includes(account.accountType),
    )
    .map((account) => ({
      id: account.id,
      name: `${account.accountCode} - ${account.accountName}`,
      type: account.accountType,
    })),
);

const revenueAccountOptions = computed(() =>
  accounts.value
    .filter(
      (account) =>
        account.isActive &&
        account.isPosting &&
        ["REVENUE", "OTHER_INCOME"].includes(account.accountType),
    )
    .map((account) => ({
      id: account.id,
      name: `${account.accountCode} - ${account.accountName}`,
      type: account.accountType,
    })),
);

const costAccountOptions = computed(() =>
  accounts.value
    .filter((account) => account.isActive && account.isPosting && account.accountType === "COGS")
    .map((account) => ({
      id: account.id,
      name: `${account.accountCode} - ${account.accountName}`,
      type: account.accountType,
    })),
);

const filteredExpenseCategories = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return expenseCategories.value;

  return expenseCategories.value.filter((category) => {
    const account = category.defaultDebitAccount;
    return (
      category.code.toLowerCase().includes(query) ||
      category.name.toLowerCase().includes(query) ||
      account?.code.toLowerCase().includes(query) ||
      account?.name.toLowerCase().includes(query)
    );
  });
});

const filteredServiceCategories = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return serviceCategories.value;

  return serviceCategories.value.filter((category) => {
    const revenueAccount = category.defaultRevenueAccount;
    const costAccount = category.defaultCostAccount;
    return (
      category.code.toLowerCase().includes(query) ||
      category.name.toLowerCase().includes(query) ||
      revenueAccount?.code.toLowerCase().includes(query) ||
      revenueAccount?.name.toLowerCase().includes(query) ||
      costAccount?.code.toLowerCase().includes(query) ||
      costAccount?.name.toLowerCase().includes(query)
    );
  });
});

const expenseUnmappedCount = computed(
  () => expenseCategories.value.filter((category) => !category.defaultDebitAccountId).length,
);

const serviceUnmappedCount = computed(
  () =>
    serviceCategories.value.filter(
      (category) => !category.defaultRevenueAccountId || !category.defaultCostAccountId,
    ).length,
);

const activeUnmappedCount = computed(() =>
  mappingMode.value === "expense" ? expenseUnmappedCount.value : serviceUnmappedCount.value,
);

const activeTotal = computed(() =>
  mappingMode.value === "expense" ? expenseCategories.value.length : serviceCategories.value.length,
);

const activeAccountCount = computed(() =>
  mappingMode.value === "expense"
    ? expenseAccountOptions.value.length
    : revenueAccountOptions.value.length + costAccountOptions.value.length,
);

async function loadData() {
  isLoading.value = true;
  try {
    const [expenseCategoryData, serviceCategoryData, accountResult] = await Promise.all([
      $fetch<ExpenseCategoryAccount[]>("/api/master/expense-categories"),
      $fetch<ServiceCategory[]>("/api/master/service-categories"),
      fetchAccounts(),
    ]);

    expenseCategories.value = expenseCategoryData || [];
    serviceCategories.value = serviceCategoryData || [];
    accounts.value = accountResult.data || [];

    for (const category of expenseCategories.value) {
      expenseMappingDraft[category.id] = category.defaultDebitAccountId || "";
    }

    for (const category of serviceCategories.value) {
      serviceRevenueDraft[category.id] = category.defaultRevenueAccountId || "";
      serviceCostDraft[category.id] = category.defaultCostAccountId || "";
    }
  } catch (error) {
    console.error("Failed to load COA mapping data:", error);
    toast.error("Gagal memuat mapping COA.");
  } finally {
    isLoading.value = false;
  }
}

function toDefaultAccount(account: ChartOfAccount | undefined) {
  if (!account) return null;

  return {
    id: account.id,
    code: account.accountCode,
    name: account.accountName,
    type: account.accountType,
    isPosting: account.isPosting ?? false,
    isActive: account.isActive,
  };
}

async function saveExpenseMapping(category: ExpenseCategoryAccount) {
  if (!requireManage("You only have view access for accounting.")) return;

  savingId.value = category.id;
  try {
    const updated = await $fetch<ExpenseCategoryAccount>(
      `/api/master/expense-categories/${category.id}`,
      {
        method: "PATCH",
        body: {
          defaultDebitAccountId: expenseMappingDraft[category.id] || null,
        },
      },
    );

    const account = accounts.value.find((item) => item.id === updated.defaultDebitAccountId);
    expenseCategories.value = expenseCategories.value.map((item) =>
      item.id === category.id
        ? {
            ...item,
            defaultDebitAccountId: updated.defaultDebitAccountId,
            defaultDebitAccount: toDefaultAccount(account),
          }
        : item,
    );

    toast.success("Mapping operational expense berhasil disimpan.");
  } catch (error) {
    console.error("Failed to save expense COA mapping:", error);
    toast.error("Gagal menyimpan mapping COA.");
  } finally {
    savingId.value = null;
  }
}

async function saveServiceMapping(category: ServiceCategory) {
  if (!requireManage("You only have view access for accounting.")) return;

  savingId.value = category.id;
  try {
    const updated = await $fetch<ServiceCategory>(`/api/master/service-categories/${category.id}`, {
      method: "PUT",
      body: {
        name: category.name,
        defaultRevenueAccountId: serviceRevenueDraft[category.id] || null,
        defaultCostAccountId: serviceCostDraft[category.id] || null,
      },
    });

    serviceCategories.value = serviceCategories.value.map((item) =>
      item.id === category.id ? updated : item,
    );
    serviceRevenueDraft[category.id] = updated.defaultRevenueAccountId || "";
    serviceCostDraft[category.id] = updated.defaultCostAccountId || "";

    toast.success("Mapping service category berhasil disimpan.");
  } catch (error) {
    console.error("Failed to save service COA mapping:", error);
    toast.error("Gagal menyimpan mapping service category.");
  } finally {
    savingId.value = null;
  }
}

onMounted(loadData);
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <div>
      <h1 class="text-2xl font-bold">COA Mapping</h1>
      <p class="text-muted-foreground mt-1">
        Mapping akun default untuk operational expense dan service category logistics.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="border border-border rounded-xl bg-white p-4">
        <p class="text-sm text-muted-foreground">
          {{ mappingMode === "expense" ? "Kategori Biaya" : "Service Category" }}
        </p>
        <p class="text-2xl font-bold mt-1">{{ activeTotal }}</p>
      </div>
      <div class="border border-border rounded-xl bg-white p-4">
        <p class="text-sm text-muted-foreground">Posting COA Tersedia</p>
        <p class="text-2xl font-bold mt-1">{{ activeAccountCount }}</p>
      </div>
      <div class="border border-border rounded-xl bg-white p-4">
        <p class="text-sm text-muted-foreground">Belum Termapping</p>
        <p class="text-2xl font-bold mt-1" :class="activeUnmappedCount ? 'text-amber-600' : ''">
          {{ activeUnmappedCount }}
        </p>
      </div>
    </div>

    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div class="inline-flex w-fit rounded-lg border border-border bg-white p-1">
        <button
          type="button"
          class="px-3 py-2 text-sm font-medium rounded-md transition-colors"
          :class="mappingMode === 'expense' ? 'bg-[#012D5A] text-white' : 'text-muted-foreground'"
          @click="mappingMode = 'expense'"
        >
          Operational Expense
        </button>
        <button
          type="button"
          class="px-3 py-2 text-sm font-medium rounded-md transition-colors"
          :class="mappingMode === 'service' ? 'bg-[#012D5A] text-white' : 'text-muted-foreground'"
          @click="mappingMode = 'service'"
        >
          Service Category
        </button>
      </div>

      <div class="relative w-full max-w-sm">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          v-model="searchQuery"
          v-uppercase
          type="text"
          placeholder="Cari kategori atau COA..."
          class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
        />
      </div>
    </div>

    <div class="border border-border rounded-xl bg-white overflow-hidden shadow-sm">
      <div v-if="isLoading" class="flex items-center justify-center py-16">
        <Loader2 class="w-8 h-8 animate-spin text-[#012D5A]" />
      </div>

      <div v-else-if="mappingMode === 'expense'" class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border bg-muted/30 text-left">
              <th class="py-3 px-4 text-sm font-medium text-foreground">Kategori</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">COA Debit</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">Status</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="category in filteredExpenseCategories"
              :key="category.id"
              class="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
            >
              <td class="py-3 px-4">
                <div class="font-medium text-sm">{{ category.name }}</div>
                <div class="text-xs text-muted-foreground">{{ category.code }}</div>
              </td>
              <td class="py-3 px-4 min-w-[360px]">
                <Combobox
                  v-model="expenseMappingDraft[category.id]"
                  :options="expenseAccountOptions"
                  placeholder="Pilih akun COA"
                />
              </td>
              <td class="py-3 px-4">
                <span
                  v-if="category.defaultDebitAccountId"
                  class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"
                >
                  <Check class="w-3 h-3" />
                  Mapped
                </span>
                <span
                  v-else
                  class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200"
                >
                  <WalletCards class="w-3 h-3" />
                  Belum
                </span>
              </td>
              <td class="py-3 px-4 text-right">
                <button
                  v-if="canManage"
                  type="button"
                  class="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors disabled:opacity-50 min-w-[96px]"
                  :disabled="savingId === category.id"
                  @click="saveExpenseMapping(category)"
                >
                  <Loader2 v-if="savingId === category.id" class="w-4 h-4 animate-spin" />
                  <Check v-else class="w-4 h-4" />
                  Simpan
                </button>
              </td>
            </tr>
            <tr v-if="filteredExpenseCategories.length === 0">
              <td colspan="4" class="py-12 text-center text-muted-foreground">
                Tidak ada kategori ditemukan.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border bg-muted/30 text-left">
              <th class="py-3 px-4 text-sm font-medium text-foreground">Service Category</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">Revenue COA</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">Cost COA</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">Status</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="category in filteredServiceCategories"
              :key="category.id"
              class="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
            >
              <td class="py-3 px-4">
                <div class="font-medium text-sm">{{ category.name }}</div>
                <div class="text-xs text-muted-foreground">{{ category.code }}</div>
              </td>
              <td class="py-3 px-4 min-w-[320px]">
                <Combobox
                  v-model="serviceRevenueDraft[category.id]"
                  :options="revenueAccountOptions"
                  placeholder="Pilih revenue COA"
                />
              </td>
              <td class="py-3 px-4 min-w-[320px]">
                <Combobox
                  v-model="serviceCostDraft[category.id]"
                  :options="costAccountOptions"
                  placeholder="Pilih cost COA"
                />
              </td>
              <td class="py-3 px-4">
                <span
                  v-if="category.defaultRevenueAccountId && category.defaultCostAccountId"
                  class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"
                >
                  <Check class="w-3 h-3" />
                  Mapped
                </span>
                <span
                  v-else
                  class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200"
                >
                  <WalletCards class="w-3 h-3" />
                  Belum
                </span>
              </td>
              <td class="py-3 px-4 text-right">
                <button
                  v-if="canManage"
                  type="button"
                  class="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors disabled:opacity-50 min-w-[96px]"
                  :disabled="savingId === category.id"
                  @click="saveServiceMapping(category)"
                >
                  <Loader2 v-if="savingId === category.id" class="w-4 h-4 animate-spin" />
                  <Check v-else class="w-4 h-4" />
                  Simpan
                </button>
              </td>
            </tr>
            <tr v-if="filteredServiceCategories.length === 0">
              <td colspan="5" class="py-12 text-center text-muted-foreground">
                Tidak ada service category ditemukan.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
