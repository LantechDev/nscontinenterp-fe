<script setup lang="ts">
import {
  Plus,
  Search,
  Loader2,
  Trash2,
  Pencil,
  Landmark,
  MoreVertical,
  LayoutList,
  LayoutGrid,
} from "lucide-vue-next";
import { cn } from "~/lib/utils";
import { useBankAccounts, type BankAccount } from "~/composables/useBankAccounts";
import Checkbox from "~/components/ui/Checkbox.vue";
import Combobox from "~/components/ui/Combobox.vue";

definePageMeta({
  layout: "dashboard",
});

const { isLoading, fetchBankAccounts, createBankAccount, updateBankAccount, deleteBankAccount } =
  useBankAccounts();

const bankAccountsList = ref<BankAccount[]>([]);
const viewMode = ref<"list" | "grid">("list");
const { canManage, requireManage } = useFeatureAccess("master.finance");

const refreshData = async () => {
  const res = await fetchBankAccounts();
  if (res.success) {
    bankAccountsList.value = res.data || [];
  }
};

onMounted(refreshData);

const route = useRoute();
watch(
  () => route.fullPath,
  () => refreshData(),
);

// Search state
const searchQuery = ref("");
const selectedCurrency = ref("all");
const selectedStatus = ref("all");
const currencyOptions = [
  { id: "IDR", name: "IDR" },
  { id: "USD", name: "USD" },
  { id: "EUR", name: "EUR" },
  { id: "SGD", name: "SGD" },
];
const currencyFilterOptions = [{ id: "all", name: "All Currencies" }, ...currencyOptions];
const statusOptions = [
  { id: "all", name: "All Status" },
  { id: "active", name: "Active" },
  { id: "inactive", name: "Inactive" },
];

const filteredBankAccounts = computed(() => {
  let filtered = [...bankAccountsList.value];
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (b) =>
        b.bankName.toLowerCase().includes(q) ||
        b.accountNumber.toLowerCase().includes(q) ||
        b.accountHolder.toLowerCase().includes(q),
    );
  }

  if (selectedCurrency.value !== "all") {
    filtered = filtered.filter((account) => account.currency === selectedCurrency.value);
  }

  if (selectedStatus.value !== "all") {
    const isActive = selectedStatus.value === "active";
    filtered = filtered.filter((account) => account.isActive === isActive);
  }

  return filtered;
});

const bankStats = computed(() => {
  const total = bankAccountsList.value.length;
  const active = bankAccountsList.value.filter((account) => account.isActive).length;
  const currencies = new Set(bankAccountsList.value.map((account) => account.currency)).size;

  return {
    total,
    active,
    currencies,
  };
});

// Modal state
const isModalOpen = ref(false);
const isSubmitting = ref(false);
const editingAccount = ref<BankAccount | null>(null);

const formData = reactive({
  bankName: "",
  accountNumber: "",
  accountHolder: "",
  currency: "IDR",
  swiftCode: "",
  isActive: true,
  isDefault: false,
});

const uppercase = (value: string) => value.toUpperCase();

const openCreateModal = () => {
  if (!requireManage("You only have view access for finance master data.")) return;
  editingAccount.value = null;
  formData.bankName = "";
  formData.accountNumber = "";
  formData.accountHolder = "PT Nova Sync Continent";
  formData.currency = "IDR";
  formData.swiftCode = "";
  formData.isActive = true;
  formData.isDefault = false;
  isModalOpen.value = true;
};

const openEditModal = (account: BankAccount) => {
  if (!requireManage("You only have view access for finance master data.")) return;
  editingAccount.value = account;
  formData.bankName = account.bankName;
  formData.accountNumber = account.accountNumber;
  formData.accountHolder = account.accountHolder;
  formData.currency = account.currency;
  formData.swiftCode = account.swiftCode || "";
  formData.isActive = account.isActive;
  formData.isDefault = account.isDefault ?? false;
  isModalOpen.value = true;
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  let res;
  const payload = {
    ...formData,
    bankName: uppercase(formData.bankName),
    accountNumber: uppercase(formData.accountNumber),
    accountHolder: uppercase(formData.accountHolder),
    swiftCode: uppercase(formData.swiftCode),
  };
  if (editingAccount.value) {
    res = await updateBankAccount(editingAccount.value.id, payload);
  } else {
    res = await createBankAccount(payload);
  }

  if (res.success) {
    isModalOpen.value = false;
    await refreshData();
  }
  isSubmitting.value = false;
};

// Delete logic
const isDeleteModalOpen = ref(false);
const accountToDelete = ref<BankAccount | null>(null);

const openDeleteModal = (account: BankAccount) => {
  if (!requireManage("You only have view access for finance master data.")) return;
  accountToDelete.value = account;
  isDeleteModalOpen.value = true;
};

const handleDelete = async () => {
  if (!accountToDelete.value) return;
  isSubmitting.value = true;
  const res = await deleteBankAccount(accountToDelete.value.id);
  if (res.success) {
    isDeleteModalOpen.value = false;
    await refreshData();
  }
  isSubmitting.value = false;
};

const handleRowClick = (account: BankAccount) => {
  if (!canManage.value) return;
  openEditModal(account);
};

const openMenuId = ref<string | null>(null);
const toggleMenu = (id: string) => {
  openMenuId.value = openMenuId.value === id ? null : id;
};
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Bank Accounts</h1>
        <p class="text-muted-foreground mt-1">Kelola rekening bank perusahaan</p>
      </div>

      <div class="flex items-center gap-2">
        <div class="flex items-center bg-white border border-border rounded-lg p-1 mr-2">
          <button
            @click="viewMode = 'list'"
            :class="
              cn(
                'p-1.5 rounded transition-colors',
                viewMode === 'list'
                  ? 'bg-[#012D5A] text-white'
                  : 'text-muted-foreground hover:bg-muted',
              )
            "
          >
            <LayoutList class="w-4 h-4" />
          </button>
          <button
            @click="viewMode = 'grid'"
            :class="
              cn(
                'p-1.5 rounded transition-colors',
                viewMode === 'grid'
                  ? 'bg-[#012D5A] text-white'
                  : 'text-muted-foreground hover:bg-muted',
              )
            "
          >
            <LayoutGrid class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white border border-border rounded-xl p-4 shadow-sm">
        <p class="text-sm text-muted-foreground">Total Accounts</p>
        <p class="text-2xl font-bold text-foreground mt-1">{{ bankStats.total }}</p>
      </div>
      <div class="bg-white border border-border rounded-xl p-4 shadow-sm">
        <p class="text-sm text-muted-foreground">Active Accounts</p>
        <p class="text-2xl font-bold text-green-600 mt-1">{{ bankStats.active }}</p>
      </div>
      <div class="bg-white border border-border rounded-xl p-4 shadow-sm">
        <p class="text-sm text-muted-foreground">Currencies</p>
        <p class="text-2xl font-bold text-[#012D5A] mt-1">{{ bankStats.currencies }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex items-center justify-between gap-4">
      <div class="relative w-full max-w-sm">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search Bank, Account Number..."
          class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
        />
      </div>

      <div class="flex items-center gap-3">
        <Combobox
          v-model="selectedCurrency"
          :options="currencyFilterOptions"
          placeholder="All Currencies"
          class="min-w-[160px]"
        />
        <Combobox
          v-model="selectedStatus"
          :options="statusOptions"
          placeholder="All Status"
          class="min-w-[150px]"
        />
        <button
          v-if="canManage"
          @click="openCreateModal"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap"
        >
          <Plus class="w-4 h-4" />
          <span>New Bank Account</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="isLoading && bankAccountsList.length === 0"
      class="flex items-center justify-center py-12"
    >
      <Loader2 class="w-8 h-8 animate-spin text-[#012D5A]" />
    </div>

    <template v-else>
      <!-- List View -->
      <div
        v-if="viewMode === 'list'"
        class="border border-border rounded-xl bg-white overflow-hidden shadow-sm"
      >
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-border bg-white text-left">
                <th class="py-3 px-4 text-sm font-medium text-foreground">Bank Name</th>
                <th class="py-3 px-4 text-sm font-medium text-foreground">Account Number</th>
                <th class="py-3 px-4 text-sm font-medium text-foreground">Account Holder</th>
                <th class="py-3 px-4 text-sm font-medium text-foreground">SWIFT Code</th>
                <th class="py-3 px-4 text-sm font-medium text-foreground">Currency</th>
                <th class="py-3 px-4 text-sm font-medium text-foreground">Status</th>
                <th v-if="canManage" class="py-3 px-4 w-10"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="account in filteredBankAccounts"
                :key="account.id"
                class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                @click="handleRowClick(account)"
              >
                <td class="py-3 px-4">
                  <div class="flex items-center gap-2">
                    <div class="p-1.5 rounded bg-blue-50 text-[#012D5A]">
                      <Landmark class="w-4 h-4" />
                    </div>
                    <span class="text-sm font-medium">{{ account.bankName }}</span>
                    <span
                      v-if="account.isDefault"
                      class="text-[10px] font-bold uppercase tracking-wide bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded"
                      >Default</span
                    >
                  </div>
                </td>
                <td class="py-3 px-4 text-sm text-muted-foreground font-mono">
                  {{ account.accountNumber }}
                </td>
                <td class="py-3 px-4 text-sm">{{ account.accountHolder }}</td>
                <td class="py-3 px-4 text-sm font-mono text-muted-foreground">
                  {{ account.swiftCode || "-" }}
                </td>
                <td class="py-3 px-4">
                  <span
                    class="text-xs font-medium uppercase bg-muted px-2 py-0.5 rounded-full text-muted-foreground border"
                  >
                    {{ account.currency }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <span
                    :class="
                      cn(
                        'px-2 py-0.5 rounded border text-xs font-medium',
                        account.isActive
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-gray-100 text-gray-500 border-gray-200',
                      )
                    "
                  >
                    {{ account.isActive ? "Active" : "Inactive" }}
                  </span>
                </td>
                <td v-if="canManage" class="py-3 px-4 text-right">
                  <div class="flex gap-1 justify-end">
                    <button
                      class="p-1.5 rounded hover:bg-muted transition-colors"
                      @click.stop="openEditModal(account)"
                    >
                      <Pencil class="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      class="p-1.5 rounded hover:bg-muted transition-colors"
                      @click.stop="openDeleteModal(account)"
                    >
                      <Trash2 class="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredBankAccounts.length === 0">
                <td :colspan="canManage ? 7 : 6" class="py-12 text-center text-muted-foreground">
                  No bank accounts found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Grid View -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="account in filteredBankAccounts"
          :key="account.id"
          class="border border-border rounded-xl bg-white p-5 hover:shadow-sm transition-shadow cursor-pointer"
          @click="handleRowClick(account)"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-start gap-4">
              <div
                class="w-12 h-12 rounded-lg bg-blue-50 text-[#012D5A] flex items-center justify-center shrink-0"
              >
                <Landmark class="w-6 h-6" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="font-bold text-base text-foreground">{{ account.bankName }}</h3>
                  <span
                    v-if="account.isDefault"
                    class="text-[10px] font-bold uppercase tracking-wide bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded"
                    >Default</span
                  >
                </div>
                <p class="text-xs text-muted-foreground font-mono">{{ account.accountNumber }}</p>
                <p
                  v-if="account.swiftCode"
                  class="text-[10px] text-muted-foreground font-mono mt-1"
                >
                  SWIFT: {{ account.swiftCode }}
                </p>
              </div>
            </div>
            <button
              v-if="canManage"
              class="text-muted-foreground hover:text-foreground"
              @click.stop
            >
              <MoreVertical class="w-4 h-4" />
            </button>
          </div>

          <div class="space-y-4 mb-4">
            <div>
              <p class="text-xs text-muted-foreground mb-1">Account Holder</p>
              <p class="text-sm font-medium">{{ account.accountHolder }}</p>
            </div>
            <div class="flex justify-between items-end">
              <div>
                <p class="text-xs text-muted-foreground mb-1">Currency</p>
                <span
                  class="text-xs font-bold uppercase bg-muted px-2 py-0.5 rounded text-muted-foreground"
                >
                  {{ account.currency }}
                </span>
              </div>
              <div>
                <p class="text-xs text-muted-foreground mb-1 text-right">Status</p>
                <span
                  :class="
                    cn(
                      'px-2 py-0.5 rounded border text-xs font-medium',
                      account.isActive
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-gray-100 text-gray-500 border-gray-200',
                    )
                  "
                >
                  {{ account.isActive ? "Active" : "Inactive" }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="filteredBankAccounts.length === 0"
          class="col-span-full py-12 text-center text-muted-foreground"
        >
          No bank accounts found.
        </div>
      </div>
    </template>

    <!-- Form Modal -->
    <UiModal
      v-model="isModalOpen"
      :title="editingAccount ? 'Edit Bank Account' : 'New Bank Account'"
      width="max-w-lg"
    >
      <form @submit.prevent="handleSubmit" class="space-y-4 py-4">
        <div class="space-y-2">
          <label class="text-xs font-bold uppercase tracking-widest text-muted-foreground"
            >Bank Name</label
          >
          <input
            v-model="formData.bankName"
            v-uppercase
            type="text"
            required
            placeholder="e.g. BANK MANDIRI"
            class="input-field"
          />
        </div>
        <div class="space-y-2">
          <label class="text-xs font-bold uppercase tracking-widest text-muted-foreground"
            >Account Number</label
          >
          <input
            v-model="formData.accountNumber"
            v-uppercase
            type="text"
            required
            placeholder="e.g. 121-00-XXXX-X"
            class="input-field"
          />
        </div>
        <div class="space-y-2">
          <label class="text-xs font-bold uppercase tracking-widest text-muted-foreground"
            >Account Holder</label
          >
          <input
            v-model="formData.accountHolder"
            v-uppercase
            type="text"
            required
            placeholder="Account holder name"
            class="input-field"
          />
        </div>
        <div class="space-y-2">
          <label class="text-xs font-bold uppercase tracking-widest text-muted-foreground"
            >SWIFT Code</label
          >
          <input
            v-model="formData.swiftCode"
            v-uppercase
            type="text"
            placeholder="e.g. BMRIIDJA"
            class="input-field"
          />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-xs font-bold uppercase tracking-widest text-muted-foreground"
              >Currency</label
            >
            <Combobox
              v-model="formData.currency"
              :options="currencyOptions"
              placeholder="Select currency"
            />
          </div>
          <div class="space-y-2">
            <label class="text-xs font-bold uppercase tracking-widest text-muted-foreground"
              >Status</label
            >
            <div
              class="flex items-center h-10 px-4 border rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
              @click="formData.isActive = !formData.isActive"
            >
              <Checkbox v-model="formData.isActive" class="pointer-events-none" />
              <span class="ml-3 text-sm select-none cursor-pointer">Active</span>
            </div>
          </div>
        </div>
        <div
          class="flex items-center gap-2 cursor-pointer w-fit group"
          @click="formData.isDefault = !formData.isDefault"
        >
          <Checkbox v-model="formData.isDefault" class="pointer-events-none" />
          <span class="text-sm font-medium select-none group-hover:text-blue-900 transition-colors"
            >Jadikan default (otomatis terpilih di transaksi baru)</span
          >
        </div>
      </form>
      <template #footer>
        <button
          type="button"
          @click="isModalOpen = false"
          class="btn-outline"
          :disabled="isSubmitting"
        >
          Cancel
        </button>
        <button
          @click="handleSubmit"
          class="btn-primary flex items-center gap-2"
          :disabled="isSubmitting"
        >
          <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
          {{ isSubmitting ? "Saving..." : "Save Account" }}
        </button>
      </template>
    </UiModal>

    <!-- Delete Modal -->
    <UiModal v-model="isDeleteModalOpen" title="Delete Account" width="max-w-md">
      <div class="py-4">
        <p class="text-sm text-muted-foreground">
          Are you sure you want to delete
          <span class="font-bold text-foreground"
            >{{ accountToDelete?.bankName }} - {{ accountToDelete?.accountNumber }}</span
          >? This action cannot be undone.
        </p>
      </div>
      <template #footer>
        <button type="button" @click="isDeleteModalOpen = false" class="btn-outline">Cancel</button>
        <button
          @click="handleDelete"
          class="btn-danger flex items-center gap-2"
          :disabled="isSubmitting"
        >
          <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
          {{ isSubmitting ? "Deleting..." : "Delete" }}
        </button>
      </template>
    </UiModal>
  </div>
</template>
