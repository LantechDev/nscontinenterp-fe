import { ref } from "vue";
import { formatFullRupiah } from "~/lib/utils";

export interface DetailedTaxReportItem {
  invoiceId: string;
  jobId: string | null;
  invoiceNumber: string;
  issuedDate: string;
  companyName: string;
  taxName: string;
  rate: number;
  baseAmount: number;
  taxAmount: number;
  type: "SALES" | "PURCHASE";
  currency?: string;
  exchangeRate?: number;
}

export function useFinanceDashboardPageTaxReport() {
  const isLoading = ref(false);
  const taxReportData = ref<DetailedTaxReportItem[]>([]);
  const error = ref<string | null>(null);

  async function fetchTaxReport(startDate: string, endDate: string) {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await $fetch<DetailedTaxReportItem[]>("/api/finance/tax-report/detailed", {
        query: { startDate, endDate },
      });
      taxReportData.value = data;
    } catch (e) {
      error.value = "Failed to fetch tax report";
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  }

  const taxStatsCards = computed(() => {
    const totalTax = taxReportData.value.reduce(
      (sum, item) => sum + Number(item.taxAmount) * Number(item.exchangeRate || 1),
      0,
    );
    const totalBase = taxReportData.value.reduce(
      (sum, item) => sum + Number(item.baseAmount) * Number(item.exchangeRate || 1),
      0,
    );
    const uniqueInvoices = new Set(taxReportData.value.map((item) => item.invoiceId));

    return [
      {
        title: "Total Pajak",
        value: formatFullRupiah(totalTax),
        isPrimary: true,
      },
      {
        title: "Total Dasar Pengenaan",
        value: formatFullRupiah(totalBase),
      },
      {
        title: "Jumlah Transaksi",
        value: uniqueInvoices.size.toString(),
      },
    ];
  });

  return {
    isLoading,
    taxReportData,
    taxStatsCards,
    fetchTaxReport,
  };
}
