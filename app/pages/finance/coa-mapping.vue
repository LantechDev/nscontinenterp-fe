<script setup lang="ts">
import { Check, Loader2, Search, WalletCards } from "lucide-vue-next";
import { toast } from "vue-sonner";
import Combobox from "~/components/ui/Combobox.vue";
import { useChartOfAccounts, type ChartOfAccount } from "~/composables/useChartOfAccounts";

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

const { fetchAccounts } = useChartOfAccounts();

const isLoading = ref(false);
const savingId = ref<string | null>(null);
const searchQuery = ref("");
const categories = ref<ExpenseCategoryAccount[]>([]);
const accounts = ref<ChartOfAccount[]>([]);
const mappingDraft = reactive<Record<string, string>>({});

const accountOptions = computed(() =>
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

const filteredCategories = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return categories.value;

  return categories.value.filter((category) => {
    const account = category.defaultDebitAccount;
    return (
      category.code.toLowerCase().includes(query) ||
      category.name.toLowerCase().includes(query) ||
      account?.code.toLowerCase().includes(query) ||
      account?.name.toLowerCase().includes(query)
    );
  });
});

const unmappedCount = computed(
  () => categories.value.filter((category) => !category.defaultDebitAccountId).length,
);

async function loadData() {
  isLoading.value = true;
  try {
    const [categoryData, accountResult] = await Promise.all([
      $fetch<ExpenseCategoryAccount[]>("/api/master/expense-categories"),
      fetchAccounts(),
    ]);

    categories.value = categoryData || [];
    accounts.value = accountResult.data || [];

    for (const category of categories.value) {
      mappingDraft[category.id] = category.defaultDebitAccountId || "";
    }
  } catch (error) {
    console.error("Failed to load COA mapping data:", error);
    toast.error("Gagal memuat mapping COA.");
  } finally {
    isLoading.value = false;
  }
}

async function saveMapping(category: ExpenseCategoryAccount) {
  savingId.value = category.id;
  try {
    const updated = await $fetch<ExpenseCategoryAccount>(
      `/api/master/expense-categories/${category.id}`,
      {
        method: "PATCH",
        body: {
          defaultDebitAccountId: mappingDraft[category.id] || null,
        },
      },
    );

    const account = accounts.value.find((item) => item.id === updated.defaultDebitAccountId);
    categories.value = categories.value.map((item) =>
      item.id === category.id
        ? {
            ...item,
            defaultDebitAccountId: updated.defaultDebitAccountId,
            defaultDebitAccount: account
              ? {
                  id: account.id,
                  code: account.accountCode,
                  name: account.accountName,
                  type: account.accountType,
                  isPosting: account.isPosting ?? false,
                  isActive: account.isActive,
                }
              : null,
          }
        : item,
    );

    toast.success("Mapping COA berhasil disimpan.");
  } catch (error) {
    console.error("Failed to save COA mapping:", error);
    toast.error("Gagal menyimpan mapping COA.");
  } finally {
    savingId.value = null;
  }
}

onMounted(loadData);
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <div>
      <div>
        <h1 class="text-2xl font-bold">COA Mapping</h1>
        <p class="text-muted-foreground mt-1">
          Mapping kategori biaya ke akun debit default untuk jurnal expense.
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="border border-border rounded-xl bg-white p-4">
        <p class="text-sm text-muted-foreground">Kategori Biaya</p>
        <p class="text-2xl font-bold mt-1">{{ categories.length }}</p>
      </div>
      <div class="border border-border rounded-xl bg-white p-4">
        <p class="text-sm text-muted-foreground">Posting COA Tersedia</p>
        <p class="text-2xl font-bold mt-1">{{ accountOptions.length }}</p>
      </div>
      <div class="border border-border rounded-xl bg-white p-4">
        <p class="text-sm text-muted-foreground">Belum Termapping</p>
        <p class="text-2xl font-bold mt-1" :class="unmappedCount ? 'text-amber-600' : ''">
          {{ unmappedCount }}
        </p>
      </div>
    </div>

    <div class="flex items-center justify-between gap-4">
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

      <div v-else class="overflow-x-auto">
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
              v-for="category in filteredCategories"
              :key="category.id"
              class="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
            >
              <td class="py-3 px-4">
                <div class="font-medium text-sm">{{ category.name }}</div>
                <div class="text-xs text-muted-foreground">{{ category.code }}</div>
              </td>
              <td class="py-3 px-4 min-w-[360px]">
                <Combobox
                  v-model="mappingDraft[category.id]"
                  :options="accountOptions"
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
                  type="button"
                  class="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors disabled:opacity-50 min-w-[96px]"
                  :disabled="savingId === category.id"
                  @click="saveMapping(category)"
                >
                  <Loader2 v-if="savingId === category.id" class="w-4 h-4 animate-spin" />
                  <Check v-else class="w-4 h-4" />
                  Simpan
                </button>
              </td>
            </tr>
            <tr v-if="filteredCategories.length === 0">
              <td colspan="4" class="py-12 text-center text-muted-foreground">
                Tidak ada kategori ditemukan.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
