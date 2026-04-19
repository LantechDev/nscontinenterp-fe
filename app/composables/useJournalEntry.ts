import { getErrorMessage } from "~/lib/utils";
import { useChartOfAccounts } from "./useChartOfAccounts";
import type { SearchSelectFetchOptions } from "~/components/ui/SearchSelect.vue";
import { useFinanceTax } from "./useFinanceTax";

export interface JournalEntryLine {
  id: string;
  accountId: string;
  debit: number;
  credit: number;
}

// Pure helper functions outside composable
export const formatNumber = (value: number): string => {
  if (!value || value === 0) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export function generateReferenceNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `JV/${year}${month}/${random}`;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Functions at module level - don't capture parent scope variables
function handleDebitChange(entry: JournalEntryLine) {
  if (entry.debit > 0) {
    entry.credit = 0;
  }
}

function handleCreditChange(entry: JournalEntryLine) {
  if (entry.credit > 0) {
    entry.debit = 0;
  }
}

export function useJournalEntry() {
  const config = useRuntimeConfig();
  const router = useRouter();

  const {
    accounts,
    fetchAccounts,
    searchAccounts,
    formatAccountDisplay,
    isLoading: isAccountsLoading,
  } = useChartOfAccounts();
  const { fetchTaxes } = useFinanceTax();

  // State
  const isLoading = ref(false);
  const isSaving = ref(false);
  const error = ref<string | null>(null);
  const successMessage = ref<string | null>(null);

  // Form data
  const journalDate = ref(new Date().toISOString().split("T")[0]);
  const referenceNumber = ref("");
  const description = ref("");
  const taxId = ref("");
  const taxOptions = ref<Array<{ id: string; name: string; rate: number }>>([]);
  const entries = ref<JournalEntryLine[]>([
    { id: "1", accountId: "", debit: 0, credit: 0 },
    { id: "2", accountId: "", debit: 0, credit: 0 },
  ]);

  // Computed
  const totalDebit = computed(() => {
    return entries.value.reduce((sum, entry) => sum + (entry.debit || 0), 0);
  });

  const totalCredit = computed(() => {
    return entries.value.reduce((sum, entry) => sum + (entry.credit || 0), 0);
  });

  const isBalanced = computed(() => {
    return totalDebit.value > 0 && totalDebit.value === totalCredit.value;
  });

  const canSave = computed(() => {
    return isBalanced.value && entries.value.length > 0;
  });

  // Search accounts handler for SearchSelect
  async function handleAccountSearch(options: SearchSelectFetchOptions) {
    const result = await searchAccounts(options.query);
    if (result.success && result.data) {
      return {
        success: true,
        data: result.data.map((acc) => ({
          id: acc.id,
          name: formatAccountDisplay(acc),
        })),
      };
    }
    return { success: false, error: result.error };
  }

  // Entry manipulation functions
  function addRow() {
    entries.value.push({
      id: generateId(),
      accountId: "",
      debit: 0,
      credit: 0,
    });
  }

  function removeRow(id: string) {
    if (entries.value.length > 1) {
      entries.value = entries.value.filter((entry) => entry.id !== id);
    }
  }

  // Save journal entry
  async function saveJournalEntry() {
    if (!canSave.value) return;

    isSaving.value = true;
    error.value = null;
    successMessage.value = null;

    try {
      const payload = {
        journalDate: journalDate.value,
        referenceNumber: referenceNumber.value,
        description: description.value,
        taxId: taxId.value || undefined,
        entries: entries.value
          .filter((entry) => entry.accountId && (entry.debit > 0 || entry.credit > 0))
          .map((entry) => ({
            accountId: entry.accountId,
            debit: entry.debit,
            credit: entry.credit,
          })),
      };

      await $fetch(`${config.public.apiBase}/finance/journal`, {
        method: "POST",
        body: payload,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      successMessage.value = "Journal entry saved successfully!";

      // Reset form after successful save
      setTimeout(() => {
        router.push("/finance/dashboard");
      }, 1500);
    } catch (err) {
      error.value = getErrorMessage(err);
    } finally {
      isSaving.value = false;
    }
  }

  // Initialize
  const initialize = async () => {
    await fetchAccounts();
    try {
      const taxes = await fetchTaxes({ isActive: true, limit: 100 });
      taxOptions.value = taxes.items || [];
    } catch {
      taxOptions.value = [];
    }
    referenceNumber.value = generateReferenceNumber();
  };

  return {
    // State
    isLoading,
    isSaving,
    error,
    successMessage,
    journalDate,
    referenceNumber,
    description,
    taxId,
    taxOptions,
    entries,
    // From composable
    accounts,
    isAccountsLoading,
    // Computed
    totalDebit,
    totalCredit,
    isBalanced,
    canSave,
    // Methods
    handleAccountSearch,
    addRow,
    removeRow,
    handleDebitChange,
    handleCreditChange,
    saveJournalEntry,
    initialize,
  };
}
