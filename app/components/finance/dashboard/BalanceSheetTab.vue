<script setup lang="ts">
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  Plus,
  Minus,
  Loader2,
  Wallet,
} from "lucide-vue-next";
import FinanceStatCard from "~/components/finance/StatCard.vue";
import { onClickOutside } from "@vueuse/core";
import { cn, formatFullRupiah } from "~/lib/utils";
import type { BalanceSheetGroup, BalanceSheetReport } from "~/types/finance-dashboard";
import Combobox from "~/components/ui/Combobox.vue";
import DatePicker from "~/components/ui/DatePicker.vue";
import type { ChartOfAccount } from "~/composables/useChartOfAccounts";

const props = defineProps<{
  selectedYear: string;
  availableYears: string[];
}>();

const emit = defineEmits<{
  (e: "update:reportData", value: BalanceSheetReport | null): void;
  (e: "export", event: MouseEvent): void;
}>();

const baseUrl = "/api";
const isLoading = ref(false);
const error = ref<string | null>(null);
const report = ref<BalanceSheetReport | null>(null);
const asOfDate = ref(new Date().toISOString().split("T")[0]);
const localYear = ref(props.selectedYear || new Date().getFullYear().toString());
const yearOptions = computed(() => props.availableYears.map((year) => ({ id: year, name: year })));
const expandedGroups = ref<string[]>(["ASSET", "LIABILITY", "EQUITY"]);

const statCards = computed(() => [
  {
    title: "Total Assets",
    value: formatFullRupiah(report.value?.totals.totalAssets || 0),
    isPrimary: true,
  },
  {
    title: "Total Liabilities",
    value: formatFullRupiah(report.value?.totals.totalLiabilities || 0),
    color: "blue" as const,
  },
  {
    title: "Total Equity",
    value: formatFullRupiah(report.value?.totals.totalEquity || 0),
    color: "green" as const,
  },
  {
    title: "Balance Difference",
    value: formatFullRupiah(report.value?.balanceDifference || 0),
    color: report.value?.isBalanced ? ("neutral" as const) : ("red" as const),
    changeLabel: report.value?.isBalanced ? "Balanced" : "Needs review",
  },
]);

async function fetchBalanceSheet() {
  if (!asOfDate.value) return;

  isLoading.value = true;
  error.value = null;

  try {
    const queryParams = new URLSearchParams({ asOfDate: asOfDate.value });
    if (localYear.value) queryParams.append("year", localYear.value);

    const data = await $fetch<BalanceSheetReport>(
      `${baseUrl}/finance/report/balance-sheet?${queryParams.toString()}`,
    );
    report.value = data;
    emit("update:reportData", data);
  } catch (err) {
    console.error("Failed to fetch balance sheet:", err);
    error.value = "Failed to load balance sheet data";
    report.value = null;
    emit("update:reportData", null);
  } finally {
    isLoading.value = false;
  }
}

function toggleGroup(groupType: string) {
  const index = expandedGroups.value.indexOf(groupType);
  if (index > -1) expandedGroups.value.splice(index, 1);
  else expandedGroups.value.push(groupType);
}

function isGroupExpanded(groupType: string) {
  return expandedGroups.value.includes(groupType);
}

watch(localYear, (newYear) => {
  if (newYear) {
    asOfDate.value = `${newYear}-12-31`;
  }
});

const groups = computed<BalanceSheetGroup[]>(() =>
  report.value ? [report.value.assets, report.value.liabilities, report.value.equity] : [],
);

watch([asOfDate, localYear], () => fetchBalanceSheet());

onMounted(() => {
  fetchBalanceSheet();
});

// ---- Capital Injection Modal ----
const isCapitalModalOpen = ref(false);
const isCapitalSubmitting = ref(false);
const capitalError = ref<string | null>(null);
const capitalType = ref<"inject" | "withdraw">("inject");
const isCapitalDropdownOpen = ref(false);
const capitalDropdownRef = ref<HTMLElement | null>(null);

onClickOutside(capitalDropdownRef, () => {
  isCapitalDropdownOpen.value = false;
});
const capitalForm = ref({
  amount: 0,
  date: new Date().toISOString().split("T")[0],
  bankAccountId: "",
  description: "",
});

const bankAccounts = ref<ChartOfAccount[]>([]);

async function loadBankAccounts() {
  try {
    const data = await $fetch<ChartOfAccount[]>("/api/finance/chart-of-accounts", {
      params: { search: "" },
    });
    bankAccounts.value = (data || [])
      .filter(
        (a) =>
          a.isActive &&
          a.isPosting &&
          a.accountType === "ASSET" &&
          (a.accountCode.startsWith("11") || a.accountCode.startsWith("10")),
      )
      .toSorted((a, b) => a.accountCode.localeCompare(b.accountCode));
  } catch {
    bankAccounts.value = [];
  }
}

interface CoaAccount {
  id: string;
  code: string;
}

async function getEquityAccount(): Promise<CoaAccount | null> {
  try {
    const data = await $fetch<ChartOfAccount[]>("/api/finance/chart-of-accounts", {
      params: { search: "3100" },
    });
    const account = (data || []).find((a) => a.accountCode === "3100");
    if (account) return { id: account.id, code: account.accountCode };
    return null;
  } catch {
    return null;
  }
}

function openCapitalModal(type: "inject" | "withdraw") {
  capitalType.value = type;
  capitalForm.value = {
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    bankAccountId: bankAccounts.value[0]?.id || "",
    description: type === "inject" ? "Setoran Modal" : "Penarikan Modal",
  };
  capitalError.value = null;
  isCapitalModalOpen.value = true;
  loadBankAccounts();
}

async function handleCapitalSubmit() {
  if (!capitalForm.value.amount || capitalForm.value.amount <= 0) {
    capitalError.value = "Jumlah harus lebih dari 0";
    return;
  }
  if (!capitalForm.value.bankAccountId) {
    capitalError.value = "Pilih rekening bank";
    return;
  }

  isCapitalSubmitting.value = true;
  capitalError.value = null;

  try {
    const equityAccount = await getEquityAccount();
    if (!equityAccount) {
      capitalError.value = "Akun Modal Disetor (3100) tidak ditemukan";
      isCapitalSubmitting.value = false;
      return;
    }

    const isInject = capitalType.value === "inject";
    const debitAccountId = isInject ? capitalForm.value.bankAccountId : equityAccount.id;
    const creditAccountId = isInject ? equityAccount.id : capitalForm.value.bankAccountId;

    await $fetch("/api/finance/journal", {
      method: "POST",
      body: {
        journalDate: capitalForm.value.date,
        referenceNumber: `${isInject ? "MODAL" : "TARIK"}/${new Date(capitalForm.value.date!).toISOString().slice(2, 10).replace(/-/g, "")}/0001`,
        description: capitalForm.value.description,
        entries: [
          { accountId: debitAccountId, debit: capitalForm.value.amount, credit: 0 },
          { accountId: creditAccountId, debit: 0, credit: capitalForm.value.amount },
        ],
      },
    });

    isCapitalModalOpen.value = false;
    fetchBalanceSheet();
  } catch (err) {
    const msg =
      err && typeof err === "object" && "data" in err
        ? (err as { data?: { message?: string } }).data?.message
        : "Gagal menyimpan jurnal modal";
    capitalError.value = msg || "Gagal menyimpan jurnal modal";
  } finally {
    isCapitalSubmitting.value = false;
  }
}
</script>

<template>
  <div class="space-y-6 px-6">
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <component
          :is="report?.isBalanced ? CheckCircle2 : AlertTriangle"
          :class="cn('w-5 h-5', report?.isBalanced ? 'text-emerald-600' : 'text-amber-600')"
        />
        <div>
          <h2 class="text-lg font-semibold text-[#012D5A]">Balance Sheet</h2>
          <p class="text-sm text-muted-foreground">As of {{ report?.asOfDate || asOfDate }}</p>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-center gap-3">
        <Combobox
          v-model="localYear"
          :options="yearOptions"
          placeholder="Year"
          class="min-w-[130px]"
        />
        <DatePicker v-model="asOfDate" placeholder="As of Date" class="min-w-[160px]" />
        <div ref="capitalDropdownRef" class="relative">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium border border-border bg-white text-foreground rounded-lg hover:bg-gray-50 h-10 transition-colors"
            @click="isCapitalDropdownOpen = !isCapitalDropdownOpen"
          >
            <Wallet class="w-4 h-4" />
            <span class="hidden sm:inline">Modal</span>
            <ChevronDown class="w-3 h-3" />
          </button>
          <Transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <div
              v-if="isCapitalDropdownOpen"
              class="absolute right-0 top-full mt-1 w-44 rounded-lg border border-border bg-white shadow-lg z-10 py-1"
            >
              <button
                type="button"
                class="w-full flex items-center gap-2 px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-50 transition-colors"
                @click="
                  isCapitalDropdownOpen = false;
                  openCapitalModal('inject');
                "
              >
                <Plus class="w-4 h-4" />
                Setor Modal
              </button>
              <button
                type="button"
                class="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-700 hover:bg-rose-50 transition-colors"
                @click="
                  isCapitalDropdownOpen = false;
                  openCapitalModal('withdraw');
                "
              >
                <Minus class="w-4 h-4" />
                Tarik Modal
              </button>
            </div>
          </Transition>
        </div>
        <button
          type="button"
          class="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white rounded-lg hover:bg-[#012D5A]/90 h-10"
          @click="emit('export', $event)"
        >
          <Download class="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <FinanceStatCard
        v-for="(card, index) in statCards"
        :key="card.title"
        :card="card"
        :index="index"
      />
    </div>

    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="flex items-center gap-2">
        <div
          class="w-6 h-6 border-2 border-[#012D5A] border-t-transparent rounded-full animate-spin"
        ></div>
        <span class="text-muted-foreground">Loading balance sheet...</span>
      </div>
    </div>

    <div
      v-else-if="error"
      class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl"
    >
      {{ error }}
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="group in groups"
        :key="group.type"
        class="border border-border rounded-xl bg-white overflow-hidden"
      >
        <button
          class="w-full flex items-center justify-between p-5 hover:bg-gray-50/50 transition-colors"
          @click="toggleGroup(group.type)"
        >
          <div class="flex items-center gap-3">
            <component
              :is="isGroupExpanded(group.type) ? ChevronUp : ChevronDown"
              class="w-4 h-4 text-muted-foreground"
            />
            <h3 class="text-base font-semibold text-[#012D5A]">{{ group.label }}</h3>
            <span class="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-muted-foreground">
              {{ group.items.length }} accounts
            </span>
          </div>
          <span class="text-sm font-semibold text-foreground">{{
            formatFullRupiah(group.total)
          }}</span>
        </button>

        <div v-if="isGroupExpanded(group.type)" class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-t border-border bg-gray-50/50">
                <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">Account Code</th>
                <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">Account Name</th>
                <th class="py-3 px-4 text-right text-sm font-medium text-gray-500">Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in group.items" :key="item.id" class="border-b border-gray-100">
                <td class="py-3 px-4 text-sm font-medium text-[#012D5A]">{{ item.accountCode }}</td>
                <td class="py-3 px-4 text-sm">{{ item.accountName }}</td>
                <td class="py-3 px-4 text-sm text-right font-semibold">
                  {{ formatFullRupiah(item.balance) }}
                </td>
              </tr>
              <tr class="bg-gray-50">
                <td class="py-3 px-4 text-sm font-bold" colspan="2">Total {{ group.label }}</td>
                <td class="py-3 px-4 text-sm text-right font-bold">
                  {{ formatFullRupiah(group.total) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Capital Modal -->
    <UiModal
      v-model="isCapitalModalOpen"
      :title="capitalType === 'inject' ? 'Setor Modal' : 'Tarik Modal'"
      :description="
        capitalType === 'inject'
          ? 'Catat setoran modal ke perusahaan'
          : 'Catat penarikan modal dari perusahaan'
      "
      width="max-w-md"
    >
      <form class="space-y-4" @submit.prevent="handleCapitalSubmit">
        <div v-if="capitalError" class="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ capitalError }}</p>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium text-foreground">Tanggal</label>
          <DatePicker v-model="capitalForm.date" placeholder="Pilih tanggal" />
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium text-foreground"
            >Jumlah <span class="text-red-500">*</span></label
          >
          <input
            v-model.number="capitalForm.amount"
            type="number"
            min="1"
            placeholder="Masukkan jumlah (Rp)"
            class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium text-foreground"
            >Rekening Bank <span class="text-red-500">*</span></label
          >
          <Combobox
            v-model="capitalForm.bankAccountId"
            :options="
              bankAccounts.map((a) => ({ id: a.id, name: `${a.accountCode} - ${a.accountName}` }))
            "
            placeholder="Pilih rekening bank"
          />
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium text-foreground">Keterangan</label>
          <input
            v-model="capitalForm.description"
            type="text"
            placeholder="Setoran Modal"
            class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div class="p-3 bg-gray-50 rounded-lg text-sm text-muted-foreground">
          <p v-if="capitalType === 'inject'">
            Jurnal: <strong>Debit</strong> Bank / <strong>Kredit</strong> Modal Disetor (3100)
          </p>
          <p v-else>
            Jurnal: <strong>Debit</strong> Modal Disetor (3100) / <strong>Kredit</strong> Bank
          </p>
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg text-foreground hover:bg-gray-50 transition-colors"
            :disabled="isCapitalSubmitting"
            @click="isCapitalModalOpen = false"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="isCapitalSubmitting"
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white rounded-lg hover:bg-[#012D5A]/90 transition-colors disabled:opacity-50"
          >
            <Loader2 v-if="isCapitalSubmitting" class="w-4 h-4 animate-spin" />
            <Plus v-else class="w-4 h-4" />
            {{
              isCapitalSubmitting
                ? "Menyimpan..."
                : capitalType === "inject"
                  ? "Setor Modal"
                  : "Tarik Modal"
            }}
          </button>
        </div>
      </form>
    </UiModal>
  </div>
</template>
