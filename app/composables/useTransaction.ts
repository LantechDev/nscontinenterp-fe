import { getErrorMessage } from "~/lib/utils";
import { useChartOfAccounts, type ChartOfAccount } from "./useChartOfAccounts";
import type { SearchSelectFetchOptions } from "~/components/ui/SearchSelect.vue";
import { useFinanceTax } from "./useFinanceTax";

export function useTransaction() {
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
  const isSaving = ref(false);
  const error = ref<string | null>(null);
  const successMessage = ref<string | null>(null);

  // Form data - simpler than journal entry
  const transactionDate = ref(new Date().toISOString().split("T")[0]);
  const referenceNumber = ref("");
  const description = ref("");
  const amount = ref<number>(0);
  const debitAccountId = ref("");
  const creditAccountId = ref("");
  const attachmentUrl = ref("");
  const taxId = ref("");
  const taxOptions = ref<Array<{ id: string; name: string; rate: number }>>([]);

  // Computed
  const canSave = computed(() => {
    return (
      debitAccountId.value &&
      creditAccountId.value &&
      amount.value > 0 &&
      description.value.trim().length > 0
    );
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

  // Handle file upload for attachment
  async function handleFileUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      error.value = "Hanya file gambar atau PDF yang diperbolehkan";
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      error.value = "Ukuran file maksimal 5MB";
      return;
    }

    // Create a local URL for preview
    attachmentUrl.value = URL.createObjectURL(file);
  }

  // Remove attachment
  function removeAttachment() {
    if (attachmentUrl.value) {
      URL.revokeObjectURL(attachmentUrl.value);
      attachmentUrl.value = "";
    }
  }

  // Save transaction
  async function saveTransaction() {
    if (!canSave.value) return;

    isSaving.value = true;
    error.value = null;
    successMessage.value = null;

    try {
      const payload = {
        journalDate: transactionDate.value,
        referenceNumber: referenceNumber.value,
        description: description.value,
        attachmentUrl: attachmentUrl.value,
        taxId: taxId.value || undefined,
        entries: [
          {
            accountId: debitAccountId.value,
            debit: amount.value,
            credit: 0,
          },
          {
            accountId: creditAccountId.value,
            debit: 0,
            credit: amount.value,
          },
        ],
      };

      await $fetch("/api/finance/journal", {
        method: "POST",
        body: payload,
      });

      successMessage.value = "Transaksi berhasil disimpan!";

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
    // Generate reference number
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    referenceNumber.value = `TRX/${year}${month}/${random}`;
  };

  // SSR Data Injection
  const setData = (data: { accounts?: ChartOfAccount[] }) => {
    if (data?.accounts) {
      accounts.value = data.accounts;
    }
  };

  return {
    // State
    isSaving,
    error,
    successMessage,
    transactionDate,
    referenceNumber,
    description,
    amount,
    debitAccountId,
    creditAccountId,
    attachmentUrl,
    taxId,
    taxOptions,
    // From composable
    accounts,
    isAccountsLoading,
    // Computed
    canSave,
    // Methods
    handleAccountSearch,
    handleFileUpload,
    removeAttachment,
    saveTransaction,
    initialize,
    setData,
  };
}
