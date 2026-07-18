<script setup lang="ts">
import { Plus, Trash2, X, Loader2, RefreshCw, Receipt } from "lucide-vue-next";
import { useServices } from "~/composables/useServices";
import { useFinanceTax, type Tax } from "~/composables/useFinanceTax";
import Combobox from "~/components/ui/Combobox.vue";
import SearchSelect from "~/components/ui/SearchSelect.vue";
import ServiceCreateModal from "~/pages/master/services/components/ServiceCreateModal.vue";
import DatePicker from "~/components/ui/DatePicker.vue";
import { toast } from "vue-sonner";
import type { QuotationInvoice } from "~/composables/useQuotations";
import { buildInvoiceItems } from "~/utils/quotationInvoice";

const props = defineProps<{
  invoice?: QuotationInvoice | null;
  isSaving?: boolean;
  nextNumber?: string;
  quotationCurrency?: string;
  quotationExchangeRate?: number;
}>();

const emit = defineEmits<{
  (e: "submit", payload: QuotationInvoice): void;
  (e: "cancel"): void;
}>();

const { services, fetchServices, createService } = useServices();
const { fetchTaxes } = useFinanceTax();

const taxList = ref<Tax[]>([]);
const taxOptions = ref<Array<{ id: string; name: string }>>([]);

interface FormItem {
  serviceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  currency: string;
}

const invoiceItemCurrency = props.invoice?.items?.length
  ? [...new Set(props.invoice.items.map((item) => item.currency || "IDR"))]
  : [];
const derivedInvoiceCurrency =
  props.invoice?.currency || (invoiceItemCurrency.length === 1 ? invoiceItemCurrency[0] : null);

const form = ref({
  number: props.invoice?.number || props.nextNumber || "",
  date: props.invoice?.date || new Date().toISOString().split("T")[0],
  currency: derivedInvoiceCurrency || props.quotationCurrency || "IDR",
  exchangeRate: Number(props.quotationExchangeRate || 1),
  taxId: "",
  notes: props.invoice?.notes || "",
  discountType: null as "PERCENTAGE" | "FIXED" | null,
  discountValue: 0,
  items: (props.invoice?.items?.map((item) => ({
    serviceId: "",
    description: item.description,
    quantity: Number(item.quantity || 1),
    unitPrice: Number(item.unitPrice || 0),
    currency: item.currency || "IDR",
  })) || [
    {
      serviceId: "",
      description: "",
      quantity: 1,
      unitPrice: 0,
      currency: props.quotationCurrency || "IDR",
    },
  ]) as FormItem[],
});

const hasUSDItems = computed(() => form.value.items.some((item) => item.currency === "USD"));
const isExchangeRateConfigured = computed(() => Number(form.value.exchangeRate || 1) > 1);
const useGroupedTotals = computed(() => !isExchangeRateConfigured.value);

watch(
  () => form.value.items,
  (newItems) => {
    if (newItems.length > 0 && newItems.every((item) => item.currency === "USD")) {
      form.value.currency = "USD";
    } else {
      form.value.currency = "IDR";
    }
  },
  { deep: true, immediate: true },
);

watch(
  () => form.value.currency,
  (newCurrency) => {
    if (newCurrency === "IDR" && !hasUSDItems.value) form.value.exchangeRate = 1;
  },
);

// Service Modal State
const isServiceModalOpen = ref(false);
const isSubmittingService = ref(false);
const serviceFormError = ref<string | null>(null);
const activeItemIndex = ref<number | null>(null);
const serviceForm = ref({ name: "", code: "", isActive: true, unitId: null, categoryId: null });

onMounted(async () => {
  const [taxesRes] = await Promise.all([
    fetchTaxes({ isActive: true, limit: 100 }),
    fetchServices(),
  ]);
  if (taxesRes?.items) {
    taxList.value = taxesRes.items;
    const hasNonPpnRow = taxList.value.some((t) => Number(t.rate) === 0);
    taxOptions.value = [
      ...(hasNonPpnRow ? [] : [{ id: "", name: "NON PPN" }]),
      ...taxList.value.map((t: Tax) => ({ id: t.id, name: `${t.name} (${Number(t.rate)}%)` })),
    ];
    if (!props.invoice?.id) {
      const defaultTax = taxList.value.find((t) => t.isDefault);
      if (defaultTax) form.value.taxId = defaultTax.id;
    }
  }
});

const addItem = () => {
  form.value.items.push({
    serviceId: "",
    description: "",
    quantity: 1,
    unitPrice: 0,
    currency: "IDR",
  });
};

const removeItem = (index: number) => {
  if (form.value.items.length > 1) form.value.items.splice(index, 1);
};

const onServiceChange = (index: number) => {
  const item = form.value.items[index];
  if (!item) return;
  const service = services.value.find((s) => s.id === item.serviceId);
  if (service) {
    item.description = service.name;
    item.unitPrice = 0;
  }
};

const handleCreateService = (name: string, index: number) => {
  serviceForm.value = {
    name,
    code: name.toUpperCase().replace(/\s+/g, "_").substring(0, 10),
    isActive: true,
    unitId: null,
    categoryId: null,
  };
  serviceFormError.value = null;
  activeItemIndex.value = index;
  isServiceModalOpen.value = true;
};

async function submitServiceForm(formData: {
  name: string;
  code: string;
  status: string;
  unitId: string;
  categoryId: string;
}) {
  if (!formData.name || !formData.code) {
    serviceFormError.value = "Name and Code are required.";
    return;
  }
  try {
    isSubmittingService.value = true;
    serviceFormError.value = null;
    const result = await createService({
      name: formData.name,
      code: formData.code,
      unitId: formData.unitId || undefined,
      categoryId: formData.categoryId || undefined,
      isActive: formData.status === "Active",
    });
    if (result.success && result.data) {
      await fetchServices();
      if (activeItemIndex.value !== null) {
        const item = form.value.items[activeItemIndex.value];
        if (item) {
          item.serviceId = result.data.id;
          item.description = result.data.name;
          item.unitPrice = 0;
        }
      }
      isServiceModalOpen.value = false;
    } else {
      serviceFormError.value = result.error || "Failed to create service";
    }
  } catch (error: unknown) {
    serviceFormError.value = "Failed to create service: " + (error as Error)?.message;
  } finally {
    isSubmittingService.value = false;
  }
}

const subTotal = computed(() => {
  const sum = form.value.items.reduce((acc, item) => {
    const itemAmount = Number(item.quantity || 0) * Number(item.unitPrice || 0);
    const itemCurrency = item.currency || "IDR";
    const invoiceCurrency = form.value.currency;
    const rate = Number(form.value.exchangeRate || 1);
    if (itemCurrency === "USD" && invoiceCurrency === "IDR") return acc + itemAmount * rate;
    else if (itemCurrency === "IDR" && invoiceCurrency === "USD")
      return acc + (rate > 0 ? itemAmount / rate : 0);
    return acc + itemAmount;
  }, 0);
  return form.value.currency === "IDR" ? Math.round(sum) : sum;
});

const selectedTax = computed(() => taxList.value.find((t) => t.id === form.value.taxId));

const showDiscount = ref(false);
const discountTypeOptions = computed(() => [
  { id: "PERCENTAGE", name: "Discount (%)" },
  { id: "FIXED", name: `Discount (${form.value.currency})` },
]);

const removeDiscount = () => {
  form.value.discountType = null;
  form.value.discountValue = 0;
  showDiscount.value = false;
};

const discountAmount = computed(() => {
  const val = Number(form.value.discountValue) || 0;
  if (!form.value.discountType || val <= 0) return 0;
  let raw = form.value.discountType === "PERCENTAGE" ? (subTotal.value * val) / 100 : val;
  raw = Math.max(0, Math.min(raw, subTotal.value));
  return form.value.currency === "IDR" ? Math.round(raw) : raw;
});

const discountedBase = computed(() => subTotal.value - discountAmount.value);
const isWithholdingTax = computed(
  () => selectedTax.value?.isDeduction ?? (selectedTax.value?.type || "").toLowerCase() === "pph",
);
const taxAmount = computed(() => {
  const rate = selectedTax.value ? Number(selectedTax.value.rate) : 0;
  const dpp = selectedTax.value ? Number(selectedTax.value.dppBasePercent ?? 100) : 100;
  const sum = (discountedBase.value * (dpp / 100) * rate) / 100;
  return ceilTaxByCurrency(sum, form.value.currency);
});
const signedTax = computed(() => (isWithholdingTax.value ? -taxAmount.value : taxAmount.value));
const total = computed(() => {
  const sum = discountedBase.value + signedTax.value;
  return form.value.currency === "IDR" ? Math.round(sum) : sum;
});

// Per-currency grouped totals (used when exchange rate is not configured)
const groupedTotals = computed(() => {
  const gt: Record<string, { subTotal: number; taxAmount: number; total: number }> = {
    IDR: { subTotal: 0, taxAmount: 0, total: 0 },
    USD: { subTotal: 0, taxAmount: 0, total: 0 },
  };
  form.value.items.forEach((it) => {
    const curr = it.currency || "IDR";
    if (!gt[curr]) gt[curr] = { subTotal: 0, taxAmount: 0, total: 0 };
    const amt = (it.quantity || 0) * (it.unitPrice || 0);
    gt[curr].subTotal += amt;
  });

  Object.keys(gt).forEach((curr) => {
    const entry = gt[curr];
    if (!entry) return;
    const roundedSubTotal = curr === "IDR" ? Math.round(entry.subTotal) : entry.subTotal;
    const rawTax = (roundedSubTotal * taxRatePercent.value) / 100;
    const tax = ceilTaxByCurrency(rawTax, curr);
    entry.subTotal = roundedSubTotal;
    entry.taxAmount = tax;
    entry.total = roundedSubTotal + (isWithholdingTax.value ? -tax : tax);
  });

  return gt;
});

const taxRatePercent = computed(() => (selectedTax.value ? Number(selectedTax.value.rate) : 0));

const isFetchingRate = ref(false);
async function loadExchangeRate() {
  isFetchingRate.value = true;
  try {
    const res = await $fetch<{ success: boolean; rate?: number }>(
      "/api/finance/invoice/exchange-rate",
    );
    if (res?.success && res.rate) {
      form.value.exchangeRate = res.rate;
      toast.success("Exchange rate updated.");
    }
  } catch {
    toast.error("Failed to fetch exchange rate.");
  } finally {
    isFetchingRate.value = false;
  }
}

const formatCurrency = (amount: number, currency: string = form.value.currency) =>
  new Intl.NumberFormat(currency === "USD" ? "en-US" : "id-ID", {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "IDR" ? 0 : 2,
    maximumFractionDigits: currency === "IDR" ? 0 : 2,
  }).format(amount);

const parseInputCurrency = (val: string, currency: string = form.value.currency) => {
  if (!val) return 0;
  if (currency === "IDR") {
    const numeric = Number(val.replace(/[^0-9-]/g, ""));
    return isNaN(numeric) ? 0 : numeric;
  }
  let normalized = val;
  const hasComma = val.includes(",");
  const hasDot = val.includes(".");
  if (hasComma && !hasDot) normalized = val.replace(",", ".");
  else if (hasComma && hasDot) {
    if (val.lastIndexOf(",") > val.lastIndexOf("."))
      normalized = val.replace(/\./g, "").replace(",", ".");
    else normalized = val.replace(/,/g, "");
  }
  const numeric = Number(normalized.replace(/[^0-9.-]+/g, ""));
  return isNaN(numeric) ? 0 : numeric;
};

const formatInputCurrency = (val: number | string, currency: string = form.value.currency) => {
  if (val === undefined || val === null || val === "") return "";
  const numericVal = typeof val === "string" ? parseInputCurrency(val, currency) : val;
  if (isNaN(numericVal)) return "";
  return new Intl.NumberFormat(currency === "IDR" ? "id-ID" : "en-US", {
    maximumFractionDigits: currency === "IDR" ? 0 : 2,
    minimumFractionDigits: 0,
  }).format(numericVal);
};

const handleSubmit = () => {
  const validItems = form.value.items.filter(
    (it) => it.description.trim() && (it.quantity > 0 || it.unitPrice > 0),
  );
  if (validItems.length === 0) {
    toast.error("Tambahkan minimal 1 item dengan deskripsi & harga.");
    return;
  }
  if (
    hasUSDItems.value &&
    form.value.currency === "IDR" &&
    Number(form.value.exchangeRate || 0) <= 1
  ) {
    toast.error("Exchange rate must be > 1 when USD items present on IDR invoice");
    return;
  }

  emit("submit", {
    id: props.invoice?.id,
    number: form.value.number || null,
    date: form.value.date || null,
    currency: form.value.currency as "IDR" | "USD",
    notes: form.value.notes || null,
    subTotal: discountedBase.value,
    taxAmount: taxAmount.value,
    total: total.value,
    items: buildInvoiceItems(validItems),
  });
};
</script>

<template>
  <div class="bg-white rounded-xl border border-border shadow-sm overflow-hidden animate-fade-in">
    <div class="px-6 py-4 border-b border-border bg-gray-50 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <Receipt class="w-5 h-5 text-[#012D5A]" />
          <h3 class="font-bold text-foreground">
            {{ invoice?.id ? "Edit" : "Create New" }} Quotation
          </h3>
        </div>
        <div class="h-4 w-[1px] bg-border mx-1"></div>
        <div class="flex items-center gap-2">
          <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
            >Quotation Currency</span
          >
          <span
            class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-[#012D5A]/5 border border-[#012D5A]/10 text-[#012D5A] shadow-sm"
            >{{ form.currency }}</span
          >
        </div>
      </div>
      <button
        type="button"
        @click="$emit('cancel')"
        class="text-muted-foreground hover:text-foreground transition-colors"
      >
        <X class="w-5 h-5" />
      </button>
    </div>

    <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-muted-foreground uppercase tracking-wider"
            >Quotation No.</label
          >
          <input
            v-model="form.number"
            type="text"
            class="w-full px-3 py-2 bg-white border border-border rounded-md text-sm focus:ring-2 focus:ring-[#012D5A]/20 focus:border-[#012D5A] outline-none transition-all font-mono"
            v-uppercase
          />
        </div>
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-muted-foreground uppercase tracking-wider"
            >Date</label
          >
          <DatePicker v-model="form.date" placeholder="Select date..." />
        </div>
      </div>

      <!-- Items Section -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <label class="text-xs font-bold text-muted-foreground uppercase tracking-wider"
            >Service Items</label
          >
        </div>
        <div class="border rounded-xl border-border bg-muted/5">
          <div
            class="grid grid-cols-12 gap-3 px-4 py-2 border-b border-border bg-gray-50/50 text-[10px] font-bold text-muted-foreground uppercase tracking-wider"
          >
            <div class="col-span-4">Service / Description</div>
            <div class="col-span-1 text-center">Qty</div>
            <div class="col-span-2 text-center">Currency</div>
            <div class="col-span-3 text-right">Unit Price</div>
            <div class="col-span-2 text-right pr-4">Amount</div>
          </div>
          <div class="divide-y divide-border/50">
            <div
              v-for="(item, index) in form.items"
              :key="index"
              class="grid grid-cols-12 gap-3 px-4 py-3 items-start group hover:bg-white transition-colors relative"
              :style="{ zIndex: form.items.length + 10 - index }"
            >
              <div class="col-span-4 space-y-2">
                <Combobox
                  v-model="item.serviceId"
                  :options="services"
                  label-key="name"
                  value-key="id"
                  placeholder="Choose service..."
                  allow-create
                  @update:model-value="onServiceChange(index)"
                  @create="(name) => handleCreateService(name, index)"
                />
                <textarea
                  v-model="item.description"
                  placeholder="Item description..."
                  rows="1"
                  class="w-full px-3 py-1.5 bg-white border border-border rounded-md text-xs focus:ring-2 focus:ring-[#012D5A]/20 focus:border-[#012D5A] outline-none transition-all resize-none"
                  v-uppercase
                ></textarea>
              </div>
              <div class="col-span-1">
                <input
                  type="number"
                  v-model.number="item.quantity"
                  min="1"
                  class="w-full px-2 py-2 bg-white border border-border rounded-md text-sm text-center focus:ring-2 focus:ring-[#012D5A]/20 focus:border-[#012D5A] outline-none transition-all"
                  v-uppercase
                />
              </div>
              <div class="col-span-2">
                <Combobox
                  v-model="item.currency"
                  :options="[
                    { id: 'IDR', name: 'IDR' },
                    { id: 'USD', name: 'USD' },
                  ]"
                  placeholder="IDR"
                  @update:model-value="
                    (val) => {
                      if (!val) item.currency = 'IDR';
                    }
                  "
                />
              </div>
              <div class="col-span-3">
                <input
                  type="text"
                  :value="formatInputCurrency(item.unitPrice, item.currency)"
                  v-uppercase
                  @input="
                    (e) =>
                      (item.unitPrice = parseInputCurrency(
                        (e.target as HTMLInputElement).value,
                        item.currency,
                      ))
                  "
                  class="w-full px-3 py-2 bg-white border border-border rounded-md text-sm text-right font-medium focus:ring-2 focus:ring-[#012D5A]/20 focus:border-[#012D5A] outline-none transition-all"
                />
              </div>
              <div class="col-span-2 flex items-center justify-between gap-2 pr-2">
                <p class="text-sm font-bold text-[#012D5A] tabular-nums text-right flex-1">
                  {{
                    formatCurrency(Number(item.quantity) * Number(item.unitPrice), item.currency)
                  }}
                </p>
                <button
                  type="button"
                  @click="removeItem(index)"
                  class="p-1.5 text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-30"
                  :disabled="form.items.length === 1"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end">
          <button
            type="button"
            @click="addItem"
            class="inline-flex items-center gap-1.5 text-xs font-bold text-[#012D5A] hover:bg-[#012D5A]/5 px-2 py-1 rounded transition-colors"
          >
            <Plus class="w-3.5 h-3.5" /> Add Service Item
          </button>
        </div>
      </div>

      <!-- Tax -->
      <div class="pt-4">
        <div class="space-y-2">
          <label class="text-[10px] font-black text-muted-foreground uppercase tracking-widest"
            >Tax (PPN/PPH)</label
          >
          <SearchSelect
            v-model="form.taxId"
            :initial-options="taxOptions"
            placeholder="Select Tax"
            class="w-full"
          />
          <p class="text-[9px] text-muted-foreground/60 font-medium px-1 italic">
            Tax will be applied to the total subtotal amount.
          </p>
        </div>
      </div>

      <!-- Section: Kurs (only if any USD item) -->
      <div v-if="hasUSDItems" class="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-3">
        <label class="text-[10px] font-black text-[#012D5A] uppercase tracking-widest">
          Kurs (USD → IDR)
        </label>
        <div class="flex items-center gap-3">
          <div class="flex-1 space-y-1">
            <input
              type="text"
              :value="formatInputCurrency(form.exchangeRate, 'IDR')"
              v-uppercase
              @input="
                (e) =>
                  (form.exchangeRate = parseInputCurrency(
                    (e.target as HTMLInputElement).value,
                    'IDR',
                  ))
              "
              class="w-full max-w-[200px] px-3 py-1.5 text-xs font-black text-[#012D5A] border border-[#012D5A]/15 rounded-lg focus:ring-4 focus:ring-[#012D5A]/5 focus:border-[#012D5A] outline-none transition-all bg-white"
              placeholder="16,000"
            />
            <p class="text-[9px] font-bold text-blue-800/60">
              $1 = {{ formatCurrency(Number(form.exchangeRate) || 0, "IDR") }}
            </p>
          </div>
          <div class="relative group/tip">
            <button
              type="button"
              @click="loadExchangeRate"
              :disabled="isFetchingRate"
              class="shrink-0 h-9 px-2.5 inline-flex items-center gap-1 bg-white border border-blue-200 text-[#012D5A] rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all disabled:opacity-50"
            >
              <Loader2 v-if="isFetchingRate" class="w-3.5 h-3.5 animate-spin" />
              <RefreshCw v-else class="w-3.5 h-3.5" />
            </button>
            <div
              class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-[10px] font-medium rounded-lg opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-150 whitespace-nowrap z-50"
            >
              Ambil kurs terkini dari API
              <div
                class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"
              ></div>
            </div>
          </div>
          <span class="text-[11px] text-blue-800/70 font-medium">
            Dipakai untuk konversi USD → IDR di profit analysis.
          </span>
        </div>
      </div>

      <!-- Notes -->
      <div class="space-y-2">
        <label class="text-[10px] font-black text-muted-foreground uppercase tracking-widest"
          >Internal Notes</label
        >
        <textarea
          v-model="form.notes"
          rows="2"
          placeholder="Add internal remarks here..."
          class="w-full px-4 py-3 text-sm border border-border rounded-xl focus:ring-2 focus:ring-[#012D5A]/10 focus:border-[#012D5A] outline-none transition-all bg-gray-50/30 resize-none shadow-sm"
          v-uppercase
        ></textarea>
      </div>

      <!-- Totals / Summary -->
      <div class="flex justify-end pt-4">
        <!-- Grouped per-currency (exchange rate not configured) -->
        <div
          v-if="useGroupedTotals"
          class="w-full md:w-[380px] space-y-4 bg-gray-50/50 p-5 rounded-xl border border-border shadow-sm"
        >
          <h4 class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Quotation Summary
          </h4>
          <div class="divide-y divide-border/50">
            <div v-for="(t, curr) in groupedTotals" :key="curr" class="py-2.5 first:pt-0 last:pb-0">
              <div
                v-if="
                  t.total > 0 ||
                  (curr === 'IDR' && Object.values(groupedTotals).every((x) => x.total === 0))
                "
                class="space-y-1.5"
              >
                <span class="text-[10px] font-extrabold text-[#062c58] uppercase tracking-wider"
                  >{{ curr }} Charges</span
                >
                <div class="flex justify-between text-xs text-muted-foreground">
                  <span>Subtotal</span>
                  <span class="font-semibold text-foreground">{{
                    formatCurrency(t.subTotal, curr)
                  }}</span>
                </div>
                <div class="flex justify-between text-xs text-muted-foreground">
                  <span>{{ isWithholdingTax ? "PPh" : "VAT / Tax" }}</span>
                  <span
                    class="font-semibold"
                    :class="
                      isWithholdingTax && t.taxAmount > 0 ? 'text-red-600' : 'text-foreground'
                    "
                    >{{ isWithholdingTax && t.taxAmount > 0 ? "- " : ""
                    }}{{ formatCurrency(t.taxAmount, curr) }}</span
                  >
                </div>
                <div
                  class="flex justify-between text-sm font-bold text-[#062c58] pt-1 border-t border-dashed border-border/60"
                >
                  <span>Total Amount</span>
                  <span class="text-base font-black">{{ formatCurrency(t.total, curr) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Unified totals (single currency or rate configured) -->
        <div v-else class="w-72 space-y-3 bg-gray-50/50 p-4 rounded-xl border border-border">
          <div class="flex justify-between text-sm">
            <span class="text-muted-foreground font-inter">Subtotal</span>
            <span class="font-medium text-foreground font-inter">{{
              formatCurrency(subTotal)
            }}</span>
          </div>
          <button
            v-if="!showDiscount"
            type="button"
            @click="showDiscount = true"
            class="inline-flex items-center gap-1 text-xs font-bold text-[#012D5A] hover:bg-[#012D5A]/5 px-2 py-1 rounded transition-colors"
          >
            <Plus class="w-3 h-3" /> Add Discount
          </button>
          <template v-else>
            <div class="flex items-center gap-2">
              <Combobox
                v-model="form.discountType"
                :options="discountTypeOptions"
                placeholder="Select type"
                class="flex-1 min-w-0"
              />
              <input
                v-if="form.discountType"
                v-model.number="form.discountValue"
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                class="w-24 h-10 px-2 text-sm text-right border border-input rounded-md bg-background outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
              <button
                type="button"
                @click="removeDiscount"
                title="Remove discount"
                class="p-1.5 text-muted-foreground hover:text-red-500 transition-colors"
              >
                <X class="w-4 h-4" />
              </button>
            </div>
            <div v-if="discountAmount > 0" class="flex justify-between text-sm">
              <span class="text-muted-foreground font-inter"
                >Discount{{
                  form.discountType === "PERCENTAGE" ? ` (${form.discountValue}%)` : ""
                }}</span
              >
              <span class="font-medium text-red-600 font-inter"
                >- {{ formatCurrency(discountAmount) }}</span
              >
            </div>
          </template>
          <div v-if="taxAmount > 0" class="flex items-center justify-between text-sm">
            <span class="text-muted-foreground font-inter"
              >{{ isWithholdingTax ? "PPh" : "Tax" }} ({{ selectedTax?.name }})</span
            >
            <span
              class="font-medium font-inter"
              :class="isWithholdingTax ? 'text-red-600' : 'text-foreground'"
              >{{ isWithholdingTax ? "- " : "" }}{{ formatCurrency(taxAmount) }}</span
            >
          </div>
          <div class="flex justify-between border-t border-border pt-2 mt-2">
            <span class="font-bold text-[#0a0b0b] text-lg font-inter">{{
              formatCurrency(total)
            }}</span>
          </div>
          <div
            v-if="form.currency === 'USD'"
            class="flex justify-between border-t border-border/50 pt-2 mt-1 italic"
          >
            <span class="text-[10px] font-bold text-muted-foreground uppercase"
              >IDR Equivalent</span
            >
            <span class="text-[10px] font-bold text-[#012D5A]">{{
              new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(total * form.exchangeRate)
            }}</span>
          </div>
        </div>
      </div>
    </form>

    <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-gray-50/30">
      <button
        type="button"
        @click="emit('cancel')"
        class="btn-outline h-10 px-6 font-semibold"
        :disabled="isSaving"
      >
        Cancel
      </button>
      <button
        type="button"
        @click="handleSubmit"
        class="bg-[#012D5A] hover:bg-[#012D5A]/90 text-white h-10 px-8 rounded-lg font-bold text-sm shadow-lg shadow-[#012D5A]/10 transition-all active:scale-95 flex items-center gap-2"
        :disabled="isSaving"
      >
        <span v-if="isSaving">{{ invoice?.id ? "Updating..." : "Saving..." }}</span>
        <span v-else>{{ invoice?.id ? "Update" : "Create" }} Quotation</span>
      </button>
    </div>

    <ServiceCreateModal
      :is-open="isServiceModalOpen"
      :is-submitting="isSubmittingService"
      :error="serviceFormError"
      :initial-data="serviceForm"
      @update:is-open="(val) => (isServiceModalOpen = val)"
      @submit="submitServiceForm"
    />
  </div>
</template>
