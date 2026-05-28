import { getErrorMessage } from "~/lib/utils";
import { useChartOfAccounts } from "./useChartOfAccounts";
import type { SearchSelectFetchOptions } from "~/components/ui/SearchSelect.vue";

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
  const router = useRouter();

  const {
    accounts,
    fetchAccounts,
    formatAccountDisplay,
    isLoading: isAccountsLoading,
  } = useChartOfAccounts();

  // State
  const isLoading = ref(false);
  const isSaving = ref(false);
  const error = ref<string | null>(null);
  const successMessage = ref<string | null>(null);

  // Form data
  const journalDate = ref(new Date().toISOString().split("T")[0]);
  const referenceNumber = ref("");
  const description = ref("");
  const entries = ref<JournalEntryLine[]>([
    { id: "1", accountId: "", debit: 0, credit: 0 },
    { id: "2", accountId: "", debit: 0, credit: 0 },
  ]);

  const validEntries = computed(() =>
    entries.value.filter(
      (entry) => entry.accountId && ((entry.debit || 0) > 0 || (entry.credit || 0) > 0),
    ),
  );

  // Computed
  const totalDebit = computed(() => {
    return entries.value.reduce((sum, entry) => sum + (entry.debit || 0), 0);
  });

  const totalCredit = computed(() => {
    return entries.value.reduce((sum, entry) => sum + (entry.credit || 0), 0);
  });

  const isBalanced = computed(() => {
    return totalDebit.value > 0 && Math.abs(totalDebit.value - totalCredit.value) <= 0.01;
  });

  const formValidationMessage = computed(() => {
    if (!journalDate.value) return "Tanggal jurnal wajib diisi.";
    if (Number.isNaN(new Date(journalDate.value).getTime())) return "Tanggal jurnal tidak valid.";
    if (!description.value.trim()) return "Deskripsi jurnal wajib diisi.";
    if (
      entries.value.some(
        (entry) => !entry.accountId && ((entry.debit || 0) > 0 || (entry.credit || 0) > 0),
      )
    ) {
      return "Baris dengan nilai debit atau kredit wajib memilih akun.";
    }
    if (validEntries.value.length < 2) return "Minimal 2 baris jurnal valid diperlukan.";
    if (entries.value.some((entry) => entry.accountId && entry.debit > 0 && entry.credit > 0)) {
      return "Satu baris jurnal hanya boleh berisi debit atau kredit.";
    }
    if (
      entries.value.some(
        (entry) => entry.accountId && (entry.debit || 0) === 0 && (entry.credit || 0) === 0,
      )
    ) {
      return "Baris yang memiliki akun wajib memiliki nilai debit atau kredit.";
    }
    if (!isBalanced.value) return "Total debit dan kredit harus seimbang.";
    return "";
  });

  const canSave = computed(() => {
    return !formValidationMessage.value;
  });

  // Search accounts handler for SearchSelect
  async function handleAccountSearch(options: SearchSelectFetchOptions) {
    if (accounts.value.length === 0) {
      const result = await fetchAccounts();
      if (!result.success) return { success: false, error: result.error };
    }

    const query = options.query.toLowerCase().trim();
    const filtered = accounts.value.filter((account) => {
      if (!account.isActive || !account.isPosting) return false;
      if (!query) return true;
      return (
        account.accountCode.toLowerCase().includes(query) ||
        account.accountName.toLowerCase().includes(query) ||
        account.accountType.toLowerCase().includes(query)
      );
    });

    if (filtered) {
      return {
        success: true,
        data: filtered.map((acc) => ({
          id: acc.id,
          name: formatAccountDisplay(acc),
        })),
      };
    }
    return { success: false, error: "Failed to load accounts" };
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
        description: description.value.trim(),
        entries: validEntries.value.map((entry) => ({
          accountId: entry.accountId,
          debit: entry.debit,
          credit: entry.credit,
        })),
      };

      await $fetch(`/api/finance/journal`, {
        method: "POST",
        body: payload,
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
    entries,
    // From composable
    accounts,
    isAccountsLoading,
    // Computed
    totalDebit,
    totalCredit,
    isBalanced,
    canSave,
    formValidationMessage,
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
