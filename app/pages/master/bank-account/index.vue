<script setup lang="ts">
import { Plus, Search, Loader2, Trash2, Pencil, Landmark, MoreVertical } from "lucide-vue-next";
import { useBankAccounts, type BankAccount } from "~/composables/useBankAccounts";
import Checkbox from "~/components/ui/Checkbox.vue";

definePageMeta({
  layout: "dashboard",
});

const { isLoading, fetchBankAccounts, createBankAccount, updateBankAccount, deleteBankAccount } =
  useBankAccounts();

const bankAccountsList = ref<BankAccount[]>([]);

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
  isActive: true,
});

const openCreateModal = () => {
  editingAccount.value = null;
  formData.bankName = "";
  formData.accountNumber = "";
  formData.accountHolder = "PT NOVA SYNC CONTINENT";
  formData.currency = "IDR";
  formData.isActive = true;
  isModalOpen.value = true;
};

const openEditModal = (account: BankAccount) => {
  editingAccount.value = account;
  formData.bankName = account.bankName;
  formData.accountNumber = account.accountNumber;
  formData.accountHolder = account.accountHolder;
  formData.currency = account.currency;
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

const openMenuId = ref<string | null>(null);
const toggleMenu = (id: string) => {
  openMenuId.value = openMenuId.value === id ? null : id;
};
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Bank Accounts</h1>
      <button
        @click="openCreateModal"
        class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors"
      >
        <Plus class="w-4 h-4" />
        <span>New Bank Account</span>
      </button>
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
    </div>

    <!-- Loading State -->
    <div
      v-if="isLoading && bankAccountsList.length === 0"
      class="flex items-center justify-center py-12"
    >
      <Loader2 class="w-8 h-8 animate-spin text-[#012D5A]" />
    </div>

    <!-- Table -->
    <div v-else class="border border-border rounded-xl bg-white overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="border-b border-border bg-gray-50/50">
              <th
                class="py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              >
                Bank Name
              </th>
              <th
                class="py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              >
                Account Number
              </th>
              <th
                class="py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              >
                Account Holder
              </th>
              <th
                class="py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              >
                Currency
              </th>
              <th
                class="py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr
              v-for="account in filteredBankAccounts"
              :key="account.id"
              class="hover:bg-gray-50/50 transition-colors"
            >
              <td class="py-4 px-6 text-sm font-medium flex items-center gap-3">
                <div
                  class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600"
                >
                  <Landmark class="w-4 h-4" />
                </div>
                {{ account.bankName }}
              </td>
              <td class="py-4 px-6 text-sm text-muted-foreground font-mono">
                {{ account.accountNumber }}
              </td>
              <td class="py-4 px-6 text-sm">{{ account.accountHolder }}</td>
              <td class="py-4 px-6">
                <span
                  class="px-2 py-1 rounded-md bg-gray-100 text-xs font-bold text-gray-600 uppercase"
                >
                  {{ account.currency }}
                </span>
              </td>
              <td class="py-4 px-6">
                <span
                  :class="[
                    'px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider',
                    account.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
                  ]"
                >
                  {{ account.isActive ? "Active" : "Inactive" }}
                </span>
              </td>
              <td class="py-4 px-6 text-right">
                <div class="flex justify-end gap-2">
                  <button
                    @click="openEditModal(account)"
                    class="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>
                  <button
                    @click="openDeleteModal(account)"
                    class="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 class="w-4 h-4" />
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
