<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Save, Loader2, Trash2, Plus, Receipt, RefreshCw } from "lucide-vue-next";
import { useFinanceTax, type Tax } from "~/composables/useFinanceTax";
import { useCompanies } from "~/composables/useCompanies";
import { useServices } from "~/composables/useServices";
import SearchSelect from "~/components/ui/SearchSelect.vue";
import Combobox from "~/components/ui/Combobox.vue";
import CompanyCreateModal from "~/pages/master/company/components/CompanyCreateModal.vue";
import ServiceCreateModal from "~/pages/master/services/components/ServiceCreateModal.vue";
import DatePicker from "~/components/ui/DatePicker.vue";
import { toast } from "vue-sonner";
import type { Company } from "~/composables/useMasterData";
import type { QuotationCost } from "~/composables/useQuotations";

const props = defineProps<{
  cost?: QuotationCost | null;
  isSaving?: boolean;
}>();

const emit = defineEmits<{
  (e: "submit", payload: QuotationCost): void;
  (e: "cancel"): void;
}>();

const { fetchTaxes } = useFinanceTax();
const { fetchCompanies, companies, createCompany } = useCompanies();
const { services, fetchServices, createService, fetchCategories } = useServices();

const taxList = ref<Tax[]>([]);
const taxOptions = ref<Array<{ id: string; name: string }>>([]);
const categoryOptions = ref<Array<{ id: string; name: string }>>([]);
const vendorOptions = ref<Array<{ id: string; name: string }>>([]);

const isCompanyModalOpen = ref(false);
const presetCompanyName = ref("");

const CURRENCY_OPTIONS = [
  { id: "IDR", name: "IDR" },
  { id: "USD", name: "USD" },
];

const form = ref({
  number: "",
  date: new Date().toISOString().split("T")[0],
  categoryId: "",
  vendorId: "",
  taxId: "",
  notes: "",
  exchangeRate: 1,
  items: [] as Array<{
    serviceId: string;
    description: string;
    quantity: number;
    unitPrice: number;
    currency: "IDR" | "USD";
    amount: number;
  }>,
});

const selectedTax = computed(() => taxList.value.find((t) => t.id === form.value.taxId));
const taxRate = computed(() => (selectedTax.value ? Number(selectedTax.value.rate) : 0));

const hasUSD = computed(() => form.value.items.some((it) => it.currency === "USD"));

const isFetchingRate = ref(false);
async function loadExchangeRate() {
  isFetchingRate.value = true;
  try {
    const res = await $fetch<{ success: boolean; rate?: number }>(
      "/api/finance/invoice/exchange-rate",
    );
    if (res?.success && res.rate) {
      form.value.exchangeRate = res.rate;
      toast.success("Kurs diperbarui dari API.");
    }
  } catch {
    toast.error("Gagal mengambil kurs.");
  } finally {
    isFetchingRate.value = false;
  }
}

// Totals (per-currency display + combined IDR header) come from the shared pure helper
// in app/utils/quotationCost so the saved header matches the persisted (valid) items.
const groupedTotals = computed(() => groupCostTotals(form.value.items, taxRate.value));

const combinedIDR = computed(() =>
  combineCostToIDR(form.value.items, taxRate.value, Number(form.value.exchangeRate || 1)),
);

// ---- service item modal ----
const isServiceModalOpen = ref(false);
const isSubmittingService = ref(false);
const serviceFormError = ref<string | null>(null);
const activeItemIndex = ref<number | null>(null);
const serviceForm = ref({ name: "", code: "", isActive: true, unitId: null, categoryId: null });

const addItem = () => {
  form.value.items.push({
    serviceId: "",
    description: "",
    quantity: 1,
    unitPrice: 0,
    currency: "IDR",
    amount: 0,
  });
};
const removeItem = (index: number) => form.value.items.splice(index, 1);

const onServiceChange = (index: number) => {
  const item = form.value.items[index];
  if (!item) return;
  const service = services.value.find((s) => s.id === item.serviceId);
  if (service) {
    item.description = service.name;
    if (!form.value.categoryId && service.categoryId) form.value.categoryId = service.categoryId;
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
          if (!form.value.categoryId && result.data.categoryId)
            form.value.categoryId = result.data.categoryId;
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

onMounted(async () => {
  const [taxesResp, servicesResp, categoriesResp, vendorsResp] = await Promise.all([
    fetchTaxes({ isActive: true, limit: 100 }),
    fetchServices(),
    fetchCategories(),
    fetchCompanies({ type: "VENDOR", limit: 500 }),
  ]);

  vendorOptions.value = (vendorsResp?.data || []).map((v) => ({ id: v.id, name: v.name }));
  taxList.value = taxesResp?.items || [];
  const hasNonPpnRow = taxList.value.some((t) => Number(t.rate) === 0);
  taxOptions.value = [
    ...(hasNonPpnRow ? [] : [{ id: "", name: "NON PPN" }]),
    ...taxList.value.map((t: Tax) => ({ id: t.id, name: `${t.name} (${Number(t.rate)}%)` })),
  ];
  categoryOptions.value = (categoriesResp?.data || [])
    .filter((c) => !c.code || !c.code.startsWith("GEN_"))
    .map((c) => ({ id: c.id, name: c.name }));

  if (props.cost) {
    form.value = {
      number: props.cost.number || "",
      date: (props.cost.date || new Date().toISOString().split("T")[0]) as string,
      categoryId: props.cost.categoryId || "",
      vendorId: props.cost.vendorId || "",
      taxId: props.cost.taxId || "",
      notes: props.cost.notes || "",
      exchangeRate: Number(props.cost.exchangeRate || 1),
      items: (props.cost.items || []).map((it) => ({
        serviceId: it.serviceId || "",
        description: it.description,
        quantity: Number(it.quantity),
        unitPrice: Number(it.unitPrice),
        currency: (it.currency || "IDR") as "IDR" | "USD",
        amount: Number(it.amount),
      })),
    };
    if (props.cost.vendorId && props.cost.vendorName) {
      if (!vendorOptions.value.some((v) => v.id === props.cost?.vendorId)) {
        vendorOptions.value = [
          { id: props.cost.vendorId, name: props.cost.vendorName },
          ...vendorOptions.value,
        ];
      }
    }
    if (form.value.items.length === 0) addItem();
  } else {
    form.value.number = `VCOST-${Date.now().toString().slice(-6)}`;
    const defaultTax = taxList.value.find((t) => t.isDefault);
    form.value.taxId = defaultTax?.id ?? "";
    addItem();
  }
});

const formatCurrency = (amount: number, currency = "IDR") =>
  new Intl.NumberFormat(currency === "IDR" ? "id-ID" : "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "IDR" ? 0 : 2,
    maximumFractionDigits: currency === "IDR" ? 0 : 2,
  }).format(amount);

const updateItemAmount = (index: number) => {
  const item = form.value.items[index];
  if (item) {
    const raw = (item.quantity || 0) * (item.unitPrice || 0);
    item.amount = item.currency === "IDR" ? Math.round(raw) : raw;
  }
};

const parseInputCurrency = (val: string, currency = "IDR") => {
  if (!val) return 0;
  if (currency === "IDR") {
    const numeric = Number(val.replace(/[^0-9-]/g, ""));
    return isNaN(numeric) ? 0 : numeric;
  }
  let normalized = val;
  const hasComma = val.includes(",");
  const hasDot = val.includes(".");
  if (hasComma && !hasDot) normalized = val.replace(",", ".");
  else if (hasComma && hasDot)
    normalized =
      val.lastIndexOf(",") > val.lastIndexOf(".")
        ? val.replace(/\./g, "").replace(",", ".")
        : val.replace(/,/g, "");
  const numeric = Number(normalized.replace(/[^0-9.-]+/g, ""));
  return isNaN(numeric) ? 0 : numeric;
};

const formatInputCurrency = (val: number | string, currency = "IDR") => {
  if (val === undefined || val === null || val === "") return "";
  const numericVal = typeof val === "string" ? parseInputCurrency(val, currency) : val;
  if (isNaN(numericVal)) return "";
  return new Intl.NumberFormat(currency === "IDR" ? "id-ID" : "en-US", {
    maximumFractionDigits: currency === "IDR" ? 0 : 2,
    minimumFractionDigits: 0,
  }).format(numericVal);
};

const resolveVendorName = () => {
  const found =
    companies.value.find((c) => c.id === form.value.vendorId) ||
    vendorOptions.value.find((v) => v.id === form.value.vendorId);
  return found?.name || props.cost?.vendorName || null;
};

function handleSubmit() {
  const validItems = filterValidCostItems(form.value.items);
  if (validItems.length === 0) {
    toast.error("Tambahkan minimal 1 item biaya dengan deskripsi & harga.");
    return;
  }

  // Compute the header from the items we actually persist (validItems), not from all
  // form items — a priced line with a blank description is dropped from `items` and
  // must not inflate subTotal/tax/amount.
  const c = combineCostToIDR(validItems, taxRate.value, Number(form.value.exchangeRate || 1));
  emit("submit", {
    id: props.cost?.id,
    number: form.value.number || null,
    vendorId: form.value.vendorId || null,
    vendorName: resolveVendorName(),
    categoryId: form.value.categoryId || null,
    date: form.value.date || null,
    exchangeRate: Number(form.value.exchangeRate || 1),
    taxId: form.value.taxId || null,
    taxRate: taxRate.value,
    subTotal: c.subTotal,
    taxTotal: c.tax,
    amount: c.total,
    notes: form.value.notes || null,
    items: validItems.map((it) => ({
      serviceId: it.serviceId || null,
      description: it.description.trim(),
      quantity: Number(it.quantity || 1),
      unitPrice: Number(it.unitPrice || 0),
      currency: it.currency,
      amount: Number(it.quantity || 0) * Number(it.unitPrice || 0),
    })),
  });
}

function handleCreateVendor(name: string) {
  presetCompanyName.value = name;
  isCompanyModalOpen.value = true;
}

async function onCompanyCreated(company: Company) {
  const result = await fetchCompanies({ type: "VENDOR", limit: 500 });
  vendorOptions.value = (result.data || []).map((v) => ({ id: v.id, name: v.name }));
  form.value.vendorId = company.id;
  isCompanyModalOpen.value = false;
}
</script>

<template>
  <div class="p-1">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Section: Basic Info -->
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label class="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            Cost / Ref No.
          </label>
          <div class="relative group">
            <div
              class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-[#012D5A] transition-colors"
            >
              <Receipt class="w-4 h-4" />
            </div>
            <input
              v-model="form.number"
              type="text"
              class="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-xl focus:ring-2 focus:ring-[#012D5A]/10 focus:border-[#012D5A] outline-none transition-all bg-gray-50/30"
              placeholder="VCOST-XXXX"
              v-uppercase
            />
          </div>
        </div>
        <div class="space-y-1.5">
          <label class="text-[10px] font-black text-muted-foreground uppercase tracking-widest"
            >Date</label
          >
          <DatePicker v-model="form.date" placeholder="Select date..." />
        </div>
      </div>

      <!-- Section: Entity & Category -->
      <div class="grid grid-cols-2 gap-4 pt-2">
        <div class="space-y-1.5">
          <label class="text-[10px] font-black text-muted-foreground uppercase tracking-widest"
            >Vendor</label
          >
          <Combobox
            v-model="form.vendorId"
            :options="vendorOptions"
            label-key="name"
            value-key="id"
            placeholder="Select Vendor"
            allow-create
            @create="handleCreateVendor"
            class="w-full"
          />
        </div>
        <div class="space-y-1.5">
          <label class="text-[10px] font-black text-muted-foreground uppercase tracking-widest"
            >Category</label
          >
          <SearchSelect
            v-model="form.categoryId"
            :initial-options="categoryOptions"
            placeholder="Select Category"
            class="w-full"
          />
        </div>
      </div>

      <!-- Section: Service Items Breakdown (per-item currency, like quotation) -->
      <div class="space-y-4 pt-2">
        <label class="text-xs font-bold text-muted-foreground uppercase tracking-wider"
          >Service Items Breakdown</label
        >

        <div class="border rounded-xl border-border bg-muted/5 shadow-sm">
          <div
            class="grid grid-cols-12 gap-3 px-4 py-2.5 border-b border-border bg-gray-50/80 text-[10px] font-black text-muted-foreground uppercase tracking-widest"
          >
            <div class="col-span-5">Description</div>
            <div class="col-span-2 text-center">Qty / Currency</div>
            <div class="col-span-3 text-right">Unit Price</div>
            <div class="col-span-2 text-right pr-2">Total</div>
          </div>

          <div class="divide-y divide-border/50 bg-white/50">
            <div
              v-for="(item, index) in form.items"
              :key="index"
              class="grid grid-cols-12 gap-3 px-4 py-3 items-start group hover:bg-white transition-colors relative"
              :style="{ zIndex: form.items.length + 10 - index }"
            >
              <!-- Description -->
              <div class="col-span-5 space-y-2">
                <Combobox
                  v-model="item.serviceId"
                  :options="services"
                  label-key="name"
                  value-key="id"
                  placeholder="Choose service..."
                  allow-create
                  @update:model-value="onServiceChange(index)"
                  @create="(name) => handleCreateService(name, index)"
                  class="w-full h-9 [&_button]:h-9 [&_button]:text-xs [&_button]:font-medium"
                />
                <textarea
                  v-model="item.description"
                  placeholder="Item description..."
                  rows="1"
                  class="w-full px-3 py-1.5 bg-white border border-border rounded-md text-xs focus:ring-2 focus:ring-[#012D5A]/10 focus:border-[#012D5A] outline-none transition-all resize-none shadow-sm"
                  v-uppercase
                ></textarea>
              </div>

              <!-- Qty / Currency -->
              <div class="col-span-2 space-y-1.5">
                <input
                  type="number"
                  v-model.number="item.quantity"
                  min="1"
                  @input="updateItemAmount(index)"
                  class="w-full h-9 px-2 py-2 bg-white border border-border rounded-md text-sm text-right focus:ring-2 focus:ring-[#012D5A]/10 focus:border-[#012D5A] outline-none transition-all shadow-sm"
                />
                <Combobox
                  v-model="item.currency"
                  :options="CURRENCY_OPTIONS"
                  label-key="name"
                  value-key="id"
                  placeholder="IDR"
                  @update:model-value="
                    (val) => {
                      if (!val) item.currency = 'IDR';
                      updateItemAmount(index);
                    }
                  "
                  class="w-full"
                />
              </div>

              <!-- Unit Price -->
              <div class="col-span-3 space-y-1">
                <input
                  type="text"
                  :value="formatInputCurrency(item.unitPrice, item.currency)"
                  v-uppercase
                  @input="
                    (e) => (
                      (item.unitPrice = parseInputCurrency(
                        (e.target as HTMLInputElement).value,
                        item.currency,
                      )),
                      updateItemAmount(index)
                    )
                  "
                  class="w-full h-9 px-3 py-2 bg-white border border-border rounded-md text-sm text-right font-medium focus:ring-2 focus:ring-[#012D5A]/10 focus:border-[#012D5A] outline-none transition-all shadow-sm"
                />
                <p class="text-[9px] text-right font-bold text-muted-foreground whitespace-nowrap">
                  {{ item.currency }}
                </p>
              </div>

              <!-- Total + delete -->
              <div class="col-span-2 flex items-center justify-between gap-2">
                <div class="flex-1 text-right">
                  <p class="text-sm font-bold text-[#012D5A] tabular-nums">
                    {{ new Intl.NumberFormat("id-ID").format(item.amount) }}
                  </p>
                </div>
                <button
                  type="button"
                  @click="removeItem(index)"
                  class="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="min-w-[240px] w-72 space-y-1.5">
            <label class="text-[10px] font-black text-muted-foreground uppercase tracking-widest"
              >PPN / Tax</label
            >
            <SearchSelect
              v-model="form.taxId"
              :initial-options="taxOptions"
              placeholder="Select Tax"
              class="w-full"
            />
          </div>
          <button
            type="button"
            @click="addItem"
            class="inline-flex items-center gap-1.5 text-xs font-bold text-[#012D5A] hover:bg-[#012D5A]/5 px-3 py-1.5 rounded-lg border border-[#012D5A]/10 transition-colors"
          >
            <Plus class="w-3.5 h-3.5" /> Add Item
          </button>
        </div>
      </div>

      <!-- Section: Kurs (only if any USD item) -->
      <div v-if="hasUSD" class="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-3">
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
              $1 = {{ formatCurrency(Number(form.exchangeRate) || 0) }}
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
          <span class="text-[11px] text-blue-800/70 font-medium"
            >Dipakai untuk konversi USD → IDR di profit analysis.</span
          >
        </div>
      </div>

      <!-- Section: Notes -->
      <div class="space-y-1.5">
        <label class="text-[10px] font-black text-muted-foreground uppercase tracking-widest"
          >Internal Notes</label
        >
        <textarea
          v-model="form.notes"
          rows="2"
          class="w-full px-4 py-3 text-sm border border-border rounded-xl focus:ring-2 focus:ring-[#012D5A]/10 focus:border-[#012D5A] outline-none transition-all bg-gray-50/30 resize-none shadow-sm"
          placeholder="Add internal remarks here..."
          v-uppercase
        ></textarea>
      </div>

      <!-- Section: Cost Summary (grouped per currency + combined IDR) -->
      <div class="flex justify-end">
        <div
          class="w-full md:w-[420px] space-y-4 bg-gray-50/50 p-5 rounded-xl border border-border shadow-sm"
        >
          <h4 class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Cost Summary
          </h4>
          <div class="divide-y divide-border/50">
            <div v-for="(t, curr) in groupedTotals" :key="curr" class="py-2.5 first:pt-0">
              <div v-if="t.total > 0" class="space-y-1.5">
                <span class="text-[10px] font-extrabold text-[#062c58] uppercase tracking-wider"
                  >{{ curr }} Cost</span
                >
                <div class="flex justify-between text-xs text-muted-foreground">
                  <span>Subtotal</span>
                  <span class="font-semibold text-foreground">{{
                    formatCurrency(t.subTotal, curr)
                  }}</span>
                </div>
                <div v-if="taxRate > 0" class="flex justify-between text-xs text-muted-foreground">
                  <span>PPN ({{ taxRate }}%)</span>
                  <span class="font-semibold text-foreground">{{
                    formatCurrency(t.tax, curr)
                  }}</span>
                </div>
                <div
                  class="flex justify-between text-sm font-bold text-[#062c58] pt-1 border-t border-dashed border-border/60"
                >
                  <span>Total</span>
                  <span class="font-black">{{ formatCurrency(t.total, curr) }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-between items-center pt-2 border-t border-border">
            <span class="text-[10px] font-extrabold text-red-600 uppercase tracking-wider"
              >Total Cost (IDR eq.)</span
            >
            <span class="text-base font-black text-red-600">{{
              formatCurrency(combinedIDR.total, "IDR")
            }}</span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 pt-6 border-t border-border/50">
        <button
          type="button"
          @click="$emit('cancel')"
          class="px-6 py-2.5 text-xs font-black text-muted-foreground hover:bg-muted rounded-xl transition-all uppercase tracking-widest"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="isSaving"
          class="px-8 py-2.5 bg-[#012D5A] text-white text-xs font-black rounded-xl hover:bg-[#012D5A]/90 active:scale-95 transition-all flex items-center gap-2 uppercase tracking-widest shadow-lg shadow-[#012D5A]/20"
        >
          <Loader2 v-if="isSaving" class="w-4 h-4 animate-spin" />
          <Save v-else class="w-4 h-4" />
          {{ isSaving ? "Saving..." : cost ? "Update Cost" : "Confirm Cost" }}
        </button>
      </div>
    </form>

    <CompanyCreateModal
      v-model="isCompanyModalOpen"
      :preset-name="presetCompanyName"
      preset-role="vendor"
      @success="onCompanyCreated"
    />
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
