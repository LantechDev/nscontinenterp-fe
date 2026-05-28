<script setup lang="ts">
import { Check, Edit2, Loader2, Plus, Search, Trash2 } from "lucide-vue-next";
import { toast } from "vue-sonner";
import Checkbox from "~/components/ui/Checkbox.vue";
import Combobox from "~/components/ui/Combobox.vue";
import {
  useChartOfAccounts,
  type ChartOfAccount,
  type ChartOfAccountPayload,
} from "~/composables/useChartOfAccounts";

definePageMeta({
  layout: "dashboard",
});

const accountTypes = [
  "ASSET",
  "LIABILITY",
  "EQUITY",
  "REVENUE",
  "COGS",
  "EXPENSE",
  "OTHER_INCOME",
  "OTHER_EXPENSE",
];

const normalBalances = ["DEBIT", "CREDIT"];

const { isLoading, accounts, fetchAccounts, createAccount, updateAccount, deleteAccount } =
  useChartOfAccounts();
const { confirm } = useConfirm();
const { canManage, requireManage } = useFeatureAccess("finance.accounting");

const searchQuery = ref("");
const isModalOpen = ref(false);
const isSubmitting = ref(false);
const editingAccount = ref<ChartOfAccount | null>(null);

const form = reactive<ChartOfAccountPayload>({
  accountCode: "",
  accountName: "",
  accountType: "EXPENSE",
  normalBalance: "DEBIT",
  isPosting: true,
  parentId: "",
  isActive: true,
});

const parentOptions = computed(() =>
  accounts.value
    .filter(
      (account) =>
        account.isActive && !account.isPosting && account.id !== editingAccount.value?.id,
    )
    .map((account) => ({
      id: account.id,
      name: `${account.accountCode} - ${account.accountName}`,
    })),
);

const filteredAccounts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return accounts.value;

  return accounts.value.filter(
    (account) =>
      account.accountCode.toLowerCase().includes(query) ||
      account.accountName.toLowerCase().includes(query) ||
      account.accountType.toLowerCase().includes(query),
  );
});

const postingCount = computed(() => accounts.value.filter((account) => account.isPosting).length);
const parentCount = computed(() => accounts.value.filter((account) => !account.isPosting).length);

function resetForm() {
  form.accountCode = "";
  form.accountName = "";
  form.accountType = "EXPENSE";
  form.normalBalance = "DEBIT";
  form.isPosting = true;
  form.parentId = "";
  form.isActive = true;
}

function openCreateModal() {
  if (!requireManage("You only have view access for accounting setup.")) return;
  editingAccount.value = null;
  resetForm();
  isModalOpen.value = true;
}

function openEditModal(account: ChartOfAccount) {
  if (!requireManage("You only have view access for accounting setup.")) return;
  editingAccount.value = account;
  form.accountCode = account.accountCode;
  form.accountName = account.accountName;
  form.accountType = account.accountType;
  form.normalBalance = account.normalBalance || "DEBIT";
  form.isPosting = account.isPosting ?? true;
  form.parentId = account.parentId || "";
  form.isActive = account.isActive;
  isModalOpen.value = true;
}

async function handleSubmit() {
  isSubmitting.value = true;
  const payload = {
    ...form,
    accountCode: form.accountCode.trim().toUpperCase(),
    accountName: form.accountName.trim().toUpperCase(),
    parentId: form.parentId || null,
  };

  const result = editingAccount.value
    ? await updateAccount(editingAccount.value.id, payload)
    : await createAccount(payload);

  if (result.success) {
    toast.success(
      editingAccount.value ? "Akun COA berhasil diupdate." : "Akun COA berhasil dibuat.",
    );
    isModalOpen.value = false;
  } else {
    toast.error(result.error || "Gagal menyimpan akun COA.");
  }
  isSubmitting.value = false;
}

async function handleDeactivate(account: ChartOfAccount) {
  if (!requireManage("You only have view access for accounting setup.")) return;

  const isConfirmed = await confirm({
    title: "Nonaktifkan Akun?",
    message: `Apakah Anda yakin ingin menonaktifkan akun "${account.accountCode} - ${account.accountName}"?`,
    confirmText: "Nonaktifkan",
    cancelText: "Batal",
    type: "danger",
  });

  if (!isConfirmed) return;

  const result = await deleteAccount(account.id);
  if (result.success) {
    toast.success("Akun COA dinonaktifkan.");
  } else {
    toast.error(result.error || "Gagal menonaktifkan akun COA.");
  }
}

onMounted(() => fetchAccounts());
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold">Chart of Accounts</h1>
        <p class="text-muted-foreground mt-1">Kelola akun COA untuk jurnal dan mapping finance.</p>
      </div>

      <button
        v-if="canManage"
        type="button"
        class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors"
        @click="openCreateModal"
      >
        <Plus class="w-4 h-4" />
        Akun Baru
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="border border-border rounded-xl bg-white p-4">
        <p class="text-sm text-muted-foreground">Total Aktif</p>
        <p class="text-2xl font-bold mt-1">{{ accounts.length }}</p>
      </div>
      <div class="border border-border rounded-xl bg-white p-4">
        <p class="text-sm text-muted-foreground">Posting Account</p>
        <p class="text-2xl font-bold mt-1">{{ postingCount }}</p>
      </div>
      <div class="border border-border rounded-xl bg-white p-4">
        <p class="text-sm text-muted-foreground">Parent Account</p>
        <p class="text-2xl font-bold mt-1">{{ parentCount }}</p>
      </div>
    </div>

    <div class="relative w-full max-w-sm">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        v-model="searchQuery"
        v-uppercase
        type="text"
        placeholder="Cari kode, nama, atau tipe akun..."
        class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
      />
    </div>

    <div class="border border-border rounded-xl bg-white overflow-hidden shadow-sm">
      <div v-if="isLoading && accounts.length === 0" class="flex items-center justify-center py-16">
        <Loader2 class="w-8 h-8 animate-spin text-[#012D5A]" />
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border bg-muted/30 text-left">
              <th class="py-3 px-4 text-sm font-medium text-foreground">Kode</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">Nama Akun</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">Tipe</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">Normal</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">Mode</th>
              <th v-if="canManage" class="py-3 px-4 text-sm font-medium text-foreground text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="account in filteredAccounts"
              :key="account.id"
              class="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
            >
              <td class="py-3 px-4 text-sm font-bold">{{ account.accountCode }}</td>
              <td class="py-3 px-4 text-sm">{{ account.accountName }}</td>
              <td class="py-3 px-4 text-sm">
                <span class="px-2 py-1 rounded-full bg-muted text-muted-foreground border text-xs">
                  {{ account.accountType }}
                </span>
              </td>
              <td class="py-3 px-4 text-sm">{{ account.normalBalance || "-" }}</td>
              <td v-if="canManage" class="py-3 px-4">
                <span
                  class="px-2 py-1 rounded-full border text-xs"
                  :class="
                    account.isPosting
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  "
                >
                  {{ account.isPosting ? "Posting" : "Parent" }}
                </span>
              </td>
              <td class="py-3 px-4">
                <div class="flex justify-end gap-2">
                  <button
                    type="button"
                    class="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
                    @click="openEditModal(account)"
                  >
                    <Edit2 class="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    class="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                    @click="handleDeactivate(account)"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredAccounts.length === 0">
              <td :colspan="canManage ? 6 : 5" class="py-12 text-center text-muted-foreground">
                Tidak ada akun ditemukan.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <UiModal
      v-model="isModalOpen"
      :title="editingAccount ? 'Edit Akun COA' : 'Akun COA Baru'"
      description="Atur struktur akun untuk transaksi finance."
      width="max-w-2xl"
    >
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Kode Akun</label>
            <input
              v-model="form.accountCode"
              v-uppercase
              required
              class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="6205"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Nama Akun</label>
            <input
              v-model="form.accountName"
              v-uppercase
              required
              class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="BIAYA ADMINISTRASI & UMUM"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Tipe Akun</label>
            <select
              v-model="form.accountType"
              class="w-full px-3 py-2 border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option v-for="type in accountTypes" :key="type" :value="type">{{ type }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Normal Balance</label>
            <select
              v-model="form.normalBalance"
              class="w-full px-3 py-2 border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option v-for="balance in normalBalances" :key="balance" :value="balance">
                {{ balance }}
              </option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Parent Account</label>
          <Combobox v-model="form.parentId" :options="parentOptions" placeholder="Tanpa parent" />
        </div>

        <div class="flex flex-wrap gap-6 pt-2">
          <label class="flex items-center gap-2 text-sm font-medium">
            <Checkbox v-model="form.isPosting" />
            Posting account
          </label>
          <label class="flex items-center gap-2 text-sm font-medium">
            <Checkbox v-model="form.isActive" />
            Active
          </label>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-border">
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors"
            @click="isModalOpen = false"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors disabled:opacity-50"
          >
            <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
            <Check v-else class="w-4 h-4" />
            Simpan
          </button>
        </div>
      </form>
    </UiModal>
  </div>
</template>
