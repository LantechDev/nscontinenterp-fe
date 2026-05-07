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

definePageMeta({
  layout: "dashboard",
});

const { isLoading, fetchBankAccounts, createBankAccount, updateBankAccount, deleteBankAccount } =
  useBankAccounts();

const bankAccountsList = ref<BankAccount[]>([]);
const viewMode = ref<"list" | "grid">("list");

const refreshData = async () => {
  const res = await fetchBankAccounts();
  if (res.success) {
    bankAccountsList.value = res.data || [];
  }
};

onMounted(refreshData);

// Search state
const searchQuery = ref("");

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
  return filtered;
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
});

const openCreateModal = () => {
  editingAccount.value = null;
  formData.bankName = "";
  formData.accountNumber = "";
  formData.accountHolder = "PT NOVA SYNC CONTINENT";
  formData.currency = "IDR";
  formData.swiftCode = "";
  formData.isActive = true;
  isModalOpen.value = true;
};

const openEditModal = (account: BankAccount) => {
  editingAccount.value = account;
  formData.bankName = account.bankName;
  formData.accountNumber = account.accountNumber;
  formData.accountHolder = account.accountHolder;
  formData.currency = account.currency;
  formData.swiftCode = account.swiftCode || "";
  formData.isActive = account.isActive;
  isModalOpen.value = true;
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  let res;
  if (editingAccount.value) {
    res = await updateBankAccount(editingAccount.value.id, { ...formData });
  } else {
    res = await createBankAccount({ ...formData });
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
        <button
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
                <th class="py-3 px-4 w-10"></th>
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
                <td class="py-3 px-4 text-right">
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
                <td colspan="6" class="py-12 text-center text-muted-foreground">
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
                <h3 class="font-bold text-base text-foreground">{{ account.bankName }}</h3>
                <p class="text-xs text-muted-foreground font-mono">{{ account.accountNumber }}</p>
                <p
                  v-if="account.swiftCode"
                  class="text-[10px] text-muted-foreground font-mono mt-1"
                >
                  SWIFT: {{ account.swiftCode }}
                </p>
              </div>
            </div>
            <button class="text-muted-foreground hover:text-foreground" @click.stop>
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
            <select v-model="formData.currency" class="input-field">
              <option value="IDR">IDR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="SGD">SGD</option>
            </select>
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
