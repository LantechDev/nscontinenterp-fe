<script setup lang="ts">
import {
  Check,
  Loader2,
  Building2,
  Calendar,
  CreditCard,
  Hash,
  FileText,
  Search,
  Clock,
  ArrowRightLeft,
  Zap,
  MousePointer2,
  DollarSign,
  Wallet,
  Info,
} from "lucide-vue-next";
import { usePayments } from "~/composables/usePayments";
import { useInvoices, type Invoice } from "~/composables/useInvoices";
import { useCompanies } from "~/composables/useCompanies";
import { useMasterData } from "~/composables/useMasterData";
import { useFinanceExpense, type Expense } from "~/composables/useFinanceExpense";
import Combobox from "~/components/ui/Combobox.vue";
import DatePicker from "~/components/ui/DatePicker.vue";

const props = defineProps<{
  jobId?: string;
  invoiceId?: string;
  expenseId?: string;
  companyId?: string;
  mode?: "in" | "out"; // 'in' = Receiving (from Customer), 'out' = Paying (to Vendor)
}>();

const emit = defineEmits(["success", "cancel"]);

const { createPayment, isSaving } = usePayments();
const { fetchInvoices } = useInvoices();
const { fetchExpenses } = useFinanceExpense();
const { companies, fetchCompanies, isLoading: isFetchingCompanies } = useCompanies();
const { fetchPaymentMethods } = useMasterData();

const isOut = computed(() => props.mode === "out");
const paymentMethods = ref<{ id: string; name: string; code: string }[]>([]);
const form = ref({
  companyId: props.companyId || "",
  amount: 0,
  paymentDate: new Date().toISOString().split("T")[0],
  paymentMethodId: "",
  reference: "",
  notes: "",
  useFifo: false,
  allocations: [] as Array<{
    invoiceId?: string;
    expenseId?: string;
    number: string;
    balanceDue: number;
    amount: number;
  }>,
});

const outstandingItems = ref<Array<Invoice | Expense>>([]);
const isFetchingItems = ref(false);

const loadOutstandingItems = async (companyId: string) => {
  if (!companyId) return;
  isFetchingItems.value = true;

  if (isOut.value) {
    const result = await fetchExpenses({ vendorId: companyId });
    // Assuming balanceDue > 0 filter on expenses
    outstandingItems.value = (result.items || []).filter((exp) => Number(exp.balanceDue) > 0);

    if (props.expenseId) {
      const target = outstandingItems.value.find((exp) => exp.id === props.expenseId);
      if (target && !form.value.allocations.some((a) => a.expenseId === target.id)) {
        form.value.allocations.push({
          expenseId: target.id,
          number: (target as Expense).number,
          balanceDue: Number(target.balanceDue),
          amount: Number(target.balanceDue),
        });
        updateTotalFromAllocations();
      }
    }
  } else {
    const result = await fetchInvoices(undefined, { companyId });
    if (result.success && result.data) {
      outstandingItems.value = result.data.filter((inv) => Number(inv.balanceDue) > 0);

      if (props.invoiceId) {
        const target = outstandingItems.value.find((inv) => inv.id === props.invoiceId);
        if (target && !form.value.allocations.some((a) => a.invoiceId === target.id)) {
          form.value.allocations.push({
            invoiceId: target.id,
            number: (target as Invoice).invoiceNumber,
            balanceDue: Number(target.balanceDue),
            amount: Number(target.balanceDue),
          });
          updateTotalFromAllocations();
        }
      }
    }
  }
  isFetchingItems.value = false;
};

// Currency detection logic
const paymentCurrency = computed(() => {
  if (form.value.allocations.length > 0) {
    const firstAlloc = form.value.allocations[0];
    if (firstAlloc) {
      const itemId = firstAlloc.invoiceId || firstAlloc.expenseId;
      const item = outstandingItems.value.find((i) => i.id === itemId);
      if (item && item.currency) return item.currency;
    }
  }
  const targetId = props.invoiceId || props.expenseId;
  if (targetId) {
    const target = outstandingItems.value.find((i) => i.id === targetId);
    if (target && target.currency) return target.currency;
  }
  if (outstandingItems.value.length > 0) {
    const firstItem = outstandingItems.value[0];
    if (firstItem && firstItem.currency) {
      return firstItem.currency;
    }
  }
  return "IDR";
});

const getCurrencySymbol = (currency?: string) => {
  return currency === "USD" ? "$" : "Rp";
};

const formatCurrency = (amount: number, currency: string = paymentCurrency.value) => {
  return new Intl.NumberFormat(currency === "IDR" ? "id-ID" : "en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: currency === "IDR" ? 0 : 2,
    maximumFractionDigits: currency === "IDR" ? 0 : 2,
  }).format(amount);
};

const parseInputCurrency = (val: string, currency: string = paymentCurrency.value) => {
  if (!val) return 0;

  if (currency === "IDR") {
    const numeric = Number(val.replace(/[^0-9-]/g, ""));
    return isNaN(numeric) ? 0 : numeric;
  }

  let normalized = val;
  if (currency === "USD") {
    const hasComma = val.includes(",");
    const hasDot = val.includes(".");

    if (hasComma && !hasDot) {
      normalized = val.replace(",", ".");
    } else if (hasComma && hasDot) {
      if (val.lastIndexOf(",") > val.lastIndexOf(".")) {
        normalized = val.replace(/\./g, "").replace(",", ".");
      } else {
        normalized = val.replace(/,/g, "");
      }
    }
  }

  const numeric = Number(normalized.replace(/[^0-9.-]+/g, ""));
  return isNaN(numeric) ? 0 : numeric;
};

const formatInputCurrency = (val: number | string, currency: string = paymentCurrency.value) => {
  if (val === undefined || val === null || val === "") return "";
  const numericVal = typeof val === "string" ? parseInputCurrency(val, currency) : val;
  if (isNaN(numericVal)) return "";

  return new Intl.NumberFormat(currency === "IDR" ? "id-ID" : "en-US", {
    maximumFractionDigits: currency === "IDR" ? 0 : 2,
    minimumFractionDigits: 0,
  }).format(numericVal);
};

const handleInputFormatted = (e: Event, targetId: string) => {
  const rawValue = (e.target as HTMLInputElement).value;
  const curr = paymentCurrency.value;
  const numericValue = parseInputCurrency(rawValue, curr);

  if (targetId === "main") {
    form.value.amount = numericValue;
  } else {
    const alloc = form.value.allocations.find(
      (a) => (isOut.value ? a.expenseId : a.invoiceId) === targetId,
    );
    if (alloc) {
      alloc.amount = numericValue;
      updateTotalFromAllocations();
    }
  }

  if (
    curr === "USD" &&
    (rawValue.endsWith(".") || rawValue.endsWith(".0") || rawValue.endsWith(".00"))
  ) {
    return;
  }

  (e.target as HTMLInputElement).value = formatInputCurrency(numericValue, curr);
};

// Calculations for Summary
const totalOutstandingSelected = computed(() => {
  if (form.value.useFifo) {
    return outstandingItems.value.reduce((sum: number, item) => sum + Number(item.balanceDue), 0);
  }
  return form.value.allocations.reduce((sum, a) => sum + a.balanceDue, 0);
});

const remainingBalance = computed(() => {
  return Math.max(0, totalOutstandingSelected.value - form.value.amount);
});

// Watch for prop changes
watch(
  () => props.companyId,
  (newId) => {
    if (newId) form.value.companyId = newId;
  },
  { immediate: true },
);

watch(
  () => form.value.companyId,
  (newId) => {
    if (newId) loadOutstandingItems(newId);
    else outstandingItems.value = [];
  },
  { immediate: true },
);

const updateTotalFromAllocations = () => {
  if (!form.value.useFifo) {
    form.value.amount = form.value.allocations.reduce((sum, a) => sum + a.amount, 0);
  }
};

const toggleAllocation = (item: Invoice | Expense) => {
  const id = item.id;
  const number = isOut.value ? (item as Expense).number : (item as Invoice).invoiceNumber;
  const balanceDue = Number(item.balanceDue);

  const index = form.value.allocations.findIndex(
    (a) => (isOut.value ? a.expenseId : a.invoiceId) === id,
  );
  if (index > -1) {
    form.value.allocations.splice(index, 1);
  } else {
    const newAlloc = {
      invoiceId: isOut.value ? undefined : id,
      expenseId: isOut.value ? id : undefined,
      number,
      balanceDue,
      amount: balanceDue,
    };

    form.value.allocations.push(newAlloc);
  }
  updateTotalFromAllocations();
};

const handleSave = async () => {
  if (!form.value.companyId || form.value.amount <= 0) return;

  const payload = {
    companyId: form.value.companyId,
    amount: Number(form.value.amount),
    paymentDate: (form.value.paymentDate || new Date().toISOString().split("T")[0]) as string,
    paymentMethodId: form.value.paymentMethodId || undefined,
    reference: form.value.reference,
    notes: form.value.notes,
    useFifo: form.value.useFifo,
    allocations: form.value.useFifo
      ? []
      : form.value.allocations.map((a) => ({
          invoiceId: a.invoiceId,
          expenseId: a.expenseId,
          amount: a.amount,
        })),
  };

  const result = await createPayment(payload);
  if (result.success) {
    emit("success");
  }
};

onMounted(async () => {
  await Promise.all([
    fetchCompanies({ type: isOut.value ? "VENDOR" : "CUSTOMER" }),
    (async () => {
      paymentMethods.value = await fetchPaymentMethods();
    })(),
  ]);
});

const getItemNumber = (item: Invoice | Expense): string => {
  return isOut.value ? (item as Expense).number : (item as Invoice).invoiceNumber;
};
</script>

<template>
  <div class="space-y-8 font-sans p-1">
    <!-- Section 1: Basic Info -->
    <div class="space-y-5 bg-gray-50/50 p-6 rounded-xl border border-border/50 shadow-sm">
      <div class="space-y-2 flex-1">
        <label
          class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 ml-0.5"
        >
          <Building2 class="w-4 h-4" />
          {{ isOut ? "Vendor / Payee" : "Customer / Payer" }} <span class="text-red-500">*</span>
        </label>
        <Combobox
          v-model="form.companyId"
          :options="companies"
          label-key="name"
          value-key="id"
          :placeholder="isOut ? 'Search vendor...' : 'Search customer...'"
          :loading="isFetchingCompanies"
          class="bg-white"
        />
      </div>

      <div class="grid grid-cols-2 gap-5">
        <div class="space-y-2">
          <label
            class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 ml-0.5"
          >
            <Calendar class="w-4 h-4" />
            {{ isOut ? "Date Paid" : "Date Received" }} <span class="text-red-500">*</span>
          </label>
          <DatePicker v-model="form.paymentDate" placeholder="Select date" />
        </div>
        <div class="space-y-2">
          <label
            class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 ml-0.5"
          >
            <Wallet class="w-4 h-4" />
            Payment Method
          </label>
          <Combobox
            v-model="form.paymentMethodId"
            :options="paymentMethods"
            label-key="name"
            value-key="id"
            placeholder="Select method..."
            class="bg-white"
          />
        </div>
      </div>
    </div>

    <!-- Section 2: Strategy Select -->
    <div class="space-y-5 px-1">
      <div class="flex items-center justify-between">
        <label
          class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 ml-0.5"
        >
          <ArrowRightLeft class="w-4 h-4" />
          Allocation Logic
        </label>
        <div class="flex border border-border rounded-lg bg-gray-100 p-0.5 shadow-sm">
          <button
            type="button"
            @click="form.useFifo = false"
            class="px-5 py-1.5 text-xs font-bold transition-all rounded-md"
            :class="
              !form.useFifo
                ? 'bg-white text-[#012D5A] shadow-sm ring-1 ring-black/5'
                : 'text-muted-foreground hover:bg-white/50'
            "
          >
            Manual
          </button>
          <button
            type="button"
            @click="form.useFifo = true"
            class="px-5 py-1.5 text-xs font-bold transition-all rounded-md"
            :class="
              form.useFifo
                ? 'bg-white text-[#012D5A] shadow-sm ring-1 ring-black/5'
                : 'text-muted-foreground hover:bg-white/50'
            "
          >
            Auto FIFO
          </button>
        </div>
      </div>

      <!-- Strategy Content -->
      <div
        v-if="form.useFifo"
        class="border rounded-xl border-border bg-emerald-50/20 p-10 flex flex-col items-center animate-in zoom-in-95 duration-200"
      >
        <div
          class="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200 mb-4 shadow-sm"
        >
          <Zap class="w-7 h-7 text-emerald-600" />
        </div>
        <p class="text-sm font-bold text-foreground mb-6">FIFO Mode Active</p>

        <div class="w-full max-w-[360px] space-y-3">
          <label
            class="text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center block"
            >Total {{ isOut ? "Paid" : "Received" }} Amount</label
          >
          <div class="relative group">
            <div
              class="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pr-4 border-r border-border/50"
            >
              <span class="text-[10px] font-black text-muted-foreground">{{
                paymentCurrency
              }}</span>
            </div>
            <input
              :value="formatInputCurrency(form.amount, paymentCurrency)"
              @input="(e) => handleInputFormatted(e, 'main')"
              type="text"
              placeholder="Enter amount..."
              class="w-full pl-16 pr-5 h-14 bg-white border border-border rounded-xl text-xl font-black text-[#012D5A] outline-none shadow-sm transition-all focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      <!-- Manual Allocation Table -->
      <div v-else class="space-y-5 animate-in slide-in-from-top-1 duration-200">
        <div
          v-if="!form.companyId"
          class="py-20 text-center border-2 border-dashed border-border rounded-xl bg-gray-50/50"
        >
          <p
            class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-35"
          >
            Select {{ isOut ? "vendor" : "customer" }} to view items
          </p>
        </div>
        <div v-else class="border rounded-xl border-border overflow-hidden bg-white shadow-md">
          <div
            class="grid grid-cols-12 gap-3 px-6 py-3 border-b border-border bg-gray-50/80 text-[10px] font-black text-muted-foreground uppercase tracking-widest"
          >
            <div class="col-span-1"></div>
            <div class="col-span-6">
              {{ isOut ? "Vendor Invoice" : "Customer Invoice" }} details
            </div>
            <div class="col-span-5 text-right">Apply Amount</div>
          </div>

          <div class="divide-y divide-border/50 max-h-[380px] overflow-y-auto custom-scrollbar">
            <div
              v-for="item in outstandingItems"
              :key="item.id"
              @click="toggleAllocation(item)"
              :class="[
                'grid grid-cols-12 gap-3 px-6 py-4 items-center group cursor-pointer transition-all',
                form.allocations.some((a) => (isOut ? a.expenseId : a.invoiceId) === item.id)
                  ? 'bg-[#012D5A]/5'
                  : 'hover:bg-gray-50/80',
              ]"
            >
              <div class="col-span-1 flex justify-center">
                <div
                  :class="[
                    'w-4 h-4 rounded border flex items-center justify-center transition-all',
                    form.allocations.some((a) => (isOut ? a.expenseId : a.invoiceId) === item.id)
                      ? 'bg-[#012D5A] border-[#012D5A] text-white shadow-sm scale-110'
                      : 'bg-white border-border group-hover:border-[#012D5A]/30',
                  ]"
                >
                  <Check
                    v-if="
                      form.allocations.some((a) => (isOut ? a.expenseId : a.invoiceId) === item.id)
                    "
                    class="w-2.5 h-2.5"
                    stroke-width="6"
                  />
                </div>
              </div>
              <div class="col-span-6 space-y-1">
                <span class="text-xs font-black text-foreground block">{{
                  getItemNumber(item)
                }}</span>
                <div class="flex items-center gap-1.5 opacity-60">
                  <Clock class="w-3.5 h-3.5" />
                  <span class="text-[10px] font-bold"
                    >Balance: {{ formatCurrency(item.balanceDue, item.currency) }}</span
                  >
                </div>
              </div>
              <div class="col-span-5 flex justify-end" @click.stop>
                <div
                  v-if="
                    form.allocations.some((a) => (isOut ? a.expenseId : a.invoiceId) === item.id)
                  "
                  class="relative w-full max-w-[220px]"
                >
                  <span
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground opacity-50"
                    >{{ getCurrencySymbol(item.currency) }}</span
                  >
                  <input
                    :value="
                      formatInputCurrency(
                        form.allocations.find(
                          (a) => (isOut ? a.expenseId : a.invoiceId) === item.id,
                        )!.amount,
                        item.currency,
                      )
                    "
                    @input="(e) => handleInputFormatted(e, item.id)"
                    type="text"
                    class="w-full pl-8 pr-3 py-2 bg-white border border-[#012D5A]/20 rounded-lg text-right font-black text-[#012D5A] focus:ring-2 focus:ring-[#012D5A]/10 focus:border-[#012D5A] outline-none shadow-sm text-sm"
                  />
                </div>
                <span
                  v-else
                  class="text-[10px] font-black text-slate-300 uppercase tracking-tighter self-center italic"
                  >Select to apply</span
                >
              </div>
            </div>
            <div
              v-if="outstandingItems.length === 0"
              class="py-16 text-center text-[10px] font-bold text-muted-foreground uppercase opacity-25 italic"
            >
              No unpaid items found
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary Box -->
    <div
      v-if="form.companyId"
      class="bg-[#012D5A]/5 rounded-xl p-6 border border-[#012D5A]/10 space-y-3 animate-in fade-in slide-in-from-bottom-1 duration-300"
    >
      <div
        class="flex items-center justify-between text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
      >
        <div class="flex items-center gap-2">
          <Info class="w-3.5 h-3.5" />
          Selected Total
        </div>
        <span class="text-foreground -tracking-tight font-black">{{
          formatCurrency(totalOutstandingSelected, paymentCurrency)
        }}</span>
      </div>
      <div
        class="flex items-center justify-between text-[11px] font-bold text-muted-foreground uppercase tracking-widest pb-3 border-b border-[#012D5A]/10"
      >
        <div class="flex items-center gap-2">
          <Wallet class="w-3.5 h-3.5" />
          Payment {{ isOut ? "Paid" : "Received" }}
        </div>
        <span class="text-[#012D5A] font-black -tracking-tight">{{
          formatCurrency(form.amount, paymentCurrency)
        }}</span>
      </div>
      <div class="flex items-center justify-between pt-1">
        <span class="text-[11px] font-black text-muted-foreground uppercase tracking-widest"
          >Remaining Balance</span
        >
        <span
          :class="[
            'text-base font-black -tracking-tight',
            remainingBalance > 0 ? 'text-red-600' : 'text-emerald-600',
          ]"
        >
          {{ formatCurrency(remainingBalance, paymentCurrency) }}
        </span>
      </div>
    </div>

    <!-- Section 3: Reference & Notes -->
    <div class="grid grid-cols-2 gap-4 pt-1">
      <div class="space-y-1.5">
        <label class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-0.5"
          >Reference #</label
        >
        <div class="relative group">
          <Hash
            class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-40"
          />
          <input
            v-model="form.reference"
            type="text"
            placeholder="Bank Ref, Check #"
            class="w-full h-11 pl-10 pr-3 bg-white border border-border rounded-md text-sm outline-none shadow-sm focus:ring-2 focus:ring-[#012D5A]/10 focus:border-[#012D5A] transition-all"
          />
        </div>
      </div>
      <div class="space-y-1.5">
        <label class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-0.5"
          >Internal Notes</label
        >
        <div class="relative group">
          <FileText
            class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-40"
          />
          <input
            v-model="form.notes"
            type="text"
            placeholder="Optional notes..."
            class="w-full h-11 pl-10 pr-3 bg-white border border-border rounded-md text-sm outline-none shadow-sm focus:ring-2 focus:ring-[#012D5A]/10 focus:border-[#012D5A] transition-all"
          />
        </div>
      </div>
    </div>

    <!-- Footer Action Bar -->
    <div class="flex items-center justify-between border-t border-border pt-8 mt-4">
      <button
        type="button"
        @click="emit('cancel')"
        class="px-6 py-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-all"
      >
        Cancel
      </button>

      <button
        type="button"
        @click="handleSave"
        class="bg-[#012D5A] hover:bg-[#062c58] text-white h-11 px-10 rounded-lg font-black text-sm shadow-xl shadow-[#012D5A]/10 active:scale-[0.98] transition-all flex items-center gap-3 disabled:opacity-50 disabled:grayscale"
        :disabled="isSaving || form.amount <= 0 || !form.companyId"
      >
        <Loader2 v-if="isSaving" class="w-4 h-4 animate-spin" />
        <span>{{ isSaving ? "POSTING..." : "RECORD PAYMENT" }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}

input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}
</style>
