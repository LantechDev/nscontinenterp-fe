<script setup lang="ts">
import { Plus, Trash2, X, Building2 } from "lucide-vue-next";
import { useInvoices } from "~/composables/useInvoices";
import { useServices } from "~/composables/useServices";
import { useCompanies } from "~/composables/useCompanies";
import { useFinanceTax, type Tax } from "~/composables/useFinanceTax";
import { useJobs } from "~/composables/useJobs";
import Combobox from "~/components/ui/Combobox.vue";
import SearchSelect from "~/components/ui/SearchSelect.vue";
import ServiceCreateModal from "~/pages/master/services/components/ServiceCreateModal.vue";
import DatePicker from "~/components/ui/DatePicker.vue";
import { toast } from "vue-sonner";
import { z } from "zod";

const invoiceSchema = z.object({
  customerId: z.string().min(1, "Please select a Billing Party (Customer)"),
  currency: z.enum(["IDR", "USD"]),
  exchangeRate: z.number().gt(0, "Exchange rate must be greater than 0"),
  items: z
    .array(
      z.object({
        serviceId: z.string().min(1, "Service is required"),
        description: z.string().min(1, "Description is required"),
        quantity: z.number().gt(0, "Quantity must be greater than 0"),
        unitPrice: z.number().gt(0, "Unit Price must be greater than 0"),
      }),
    )
    .min(1, "At least one service item is required"),
});

const taxList = ref<Tax[]>([]);
const taxOptions = ref<Array<{ id: string; name: string }>>([]);

const jobBillsOfLading = ref<Array<{ blNumber: string }>>([]);

const props = defineProps<{
  jobId: string;
  jobNumber: string;
  customerId: string | null;
  invoice?: InvoiceDetail | null;
  prefillData?: {
    quotationId?: string | null;
    currency?: string;
    exchangeRate?: number;
    notes?: string | null;
    taxId?: string | null;
    items?: Array<{
      serviceId?: string | null;
      description: string;
      quantity: number;
      unitPrice: number;
      taxId?: string | null;
      atCost?: boolean;
    }>;
  } | null;
}>();

const emit = defineEmits(["success", "cancel"]);

const { createInvoice, updateInvoice, getNextInvoiceNumber, isLoading: isSaving } = useInvoices();
const { services, fetchServices, createService, isLoading: isFetchingServices } = useServices();
const { companies, fetchCompanies, isLoading: isFetchingCompanies } = useCompanies();
const { fetchTaxes } = useFinanceTax();
const { getJob } = useJobs();

interface FormItem {
  id?: string;
  serviceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxId?: string | null;
  atCost?: boolean;
}

const prefillTaxId =
  props.prefillData?.taxId ||
  props.prefillData?.items?.find((item) => item.taxId)?.taxId ||
  props.prefillData?.items?.[0]?.taxId ||
  "";

const form = ref({
  invoiceNumber: props.invoice?.invoiceNumber || "",
  issuedDate: props.invoice?.issuedDate
    ? new Date(props.invoice.issuedDate).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0],
  dueDate: props.invoice?.dueDate
    ? new Date(props.invoice.dueDate).toISOString().split("T")[0]
    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  currency: props.invoice?.currency || props.prefillData?.currency || "IDR",
  exchangeRate: Number(props.invoice?.exchangeRate || props.prefillData?.exchangeRate || 1),
  customerId: props.invoice?.company?.id || props.customerId || "",
  notes: props.invoice?.notes || props.prefillData?.notes || "",
  blNumber: props.invoice?.blNumber || props.invoice?.job?.billsOfLading?.[0]?.blNumber || "",
  quotationId: props.invoice?.quotationId || props.prefillData?.quotationId || null,
  taxId: props.invoice?.taxId || props.invoice?.invoiceTaxes?.[0]?.taxId || prefillTaxId || "",
  discountType: (props.invoice?.discountType as "PERCENTAGE" | "FIXED" | null) ?? null,
  discountValue: props.invoice?.discountValue != null ? Number(props.invoice.discountValue) : 0,
  items: (props.invoice?.items?.map((item) => ({
    id: item.id,
    serviceId: item.service?.id || "",
    description: item.description,
    quantity: Number(item.quantity),
    unitPrice: Number(item.unitPrice),
    taxId: item.taxId || null,
    atCost: false,
  })) ||
    props.prefillData?.items?.map((item) => ({
      serviceId: item.serviceId || "",
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      taxId: item.taxId || null,
      atCost: Boolean(item.atCost),
    })) || [
      { serviceId: "", description: "", quantity: 1, unitPrice: 0, atCost: false },
    ]) as FormItem[],
});

// Service Modal State
const isServiceModalOpen = ref(false);
const isSubmittingService = ref(false);
const serviceFormError = ref<string | null>(null);
const activeItemIndex = ref<number | null>(null);
const serviceForm = ref({
  name: "",
  code: "",
  isActive: true,
  unitId: null,
  categoryId: null,
});

onMounted(async () => {
  if (props.invoice?.job?.billsOfLading) {
    jobBillsOfLading.value = props.invoice.job.billsOfLading;
  } else if (props.jobId) {
    const jobRes = await getJob(props.jobId);
    if (jobRes.success && jobRes.data?.billsOfLading) {
      jobBillsOfLading.value = jobRes.data.billsOfLading;
      if (!form.value.blNumber && jobBillsOfLading.value.length > 0) {
        form.value.blNumber = jobBillsOfLading.value[0]?.blNumber || "";
      }
    }
  }

  if (!props.invoice?.id && props.jobId) {
    const nextNumber = await getNextInvoiceNumber(props.jobId);
    form.value.invoiceNumber = nextNumber;
  }

  const [taxesRes] = await Promise.all([
    fetchTaxes({ isActive: true, limit: 100 }),
    fetchServices(),
    fetchCompanies({ type: "CUSTOMER" }),
  ]);

  if (taxesRes?.items) {
    taxList.value = taxesRes.items;
    // The master now has a real "NON PPN" (rate 0) row. Only fall back to a synthetic
    // empty option when that row is missing, so there's never two non-PPN entries.
    const hasNonPpnRow = taxList.value.some((t) => Number(t.rate) === 0);
    taxOptions.value = [
      ...(hasNonPpnRow ? [] : [{ id: "", name: "NON PPN" }]),
      ...taxList.value.map((t: Tax) => ({
        id: t.id,
        name: `${t.name} (${Number(t.rate)}%)`,
      })),
    ];

    // New invoice with no explicit prefill tax -> pre-select the org default (NON PPN
    // unless changed in master). An explicit prefill tax (from a quotation) still wins.
    if (!props.invoice?.id && !prefillTaxId) {
      const defaultTax = taxList.value.find((t) => t.isDefault);
      if (defaultTax) form.value.taxId = defaultTax.id;
    }
  }
});

watch(
  () => form.value.currency,
  (newCurrency) => {
    if (newCurrency === "IDR") {
      form.value.exchangeRate = 1;
    }
  },
);

const addItem = () => {
  form.value.items.push({ serviceId: "", description: "", quantity: 1, unitPrice: 0 });
};

const removeItem = (index: number) => {
  if (form.value.items.length > 1) {
    form.value.items.splice(index, 1);
  }
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
  const sum = form.value.items.reduce(
    (acc, item) => acc + Number(item.quantity) * Number(item.unitPrice),
    0,
  );
  return form.value.currency === "IDR" ? Math.round(sum) : sum;
});

const selectedTax = computed(() => {
  return taxList.value.find((t) => t.id === form.value.taxId);
});

// Optional discount, applied before tax (reduces the taxable base / DPP).
// Hidden behind an "Add Discount" toggle so it doesn't clutter the totals by default.
const showDiscount = ref(!!props.invoice?.discountType);
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

// PPh is a withholding tax (deducted); PPN is added. Some taxes only apply to a
// portion of the base (dppBasePercent, e.g. 50 for certain PPh).
const isWithholdingTax = computed(() => (selectedTax.value?.type || "").toLowerCase() === "pph");

const taxAmount = computed(() => {
  // Magnitude of the tax (always positive).
  const rate = selectedTax.value ? Number(selectedTax.value.rate) : 0;
  const dpp = selectedTax.value ? Number(selectedTax.value.dppBasePercent ?? 100) : 100;
  const sum = (discountedBase.value * (dpp / 100) * rate) / 100;
  return form.value.currency === "IDR" ? Math.round(sum) : sum;
});

const signedTax = computed(() => (isWithholdingTax.value ? -taxAmount.value : taxAmount.value));

const total = computed(() => {
  const sum = discountedBase.value + signedTax.value;
  return form.value.currency === "IDR" ? Math.round(sum) : sum;
});

const handleSubmit = async () => {
  const result = invoiceSchema.safeParse(form.value);

  if (!result.success) {
    const firstError = result.error.issues[0];
    toast.error(firstError?.message || "Invalid form data");
    return;
  }

  // Send whichever tax is selected (incl. the rate-0 "NON PPN" row) so the choice is
  // persisted and reloads correctly on edit. A rate-0 tax simply yields 0 PPN.
  const taxesPayload = form.value.taxId
    ? [{ taxId: form.value.taxId, baseAmount: discountedBase.value }]
    : [];

  const payload = {
    jobId: props.jobId,
    invoiceNumber: form.value.invoiceNumber,
    companyId: form.value.customerId,
    currency: form.value.currency,
    exchangeRate: form.value.currency === "IDR" ? 1 : form.value.exchangeRate,
    issuedDate: (form.value.issuedDate || new Date().toISOString().split("T")[0]) as string,
    dueDate: (form.value.dueDate || new Date().toISOString().split("T")[0]) as string,
    subTotal: subTotal.value,
    taxAmount: taxAmount.value,
    taxes: taxesPayload,
    discountType: form.value.discountType || null,
    discountValue: form.value.discountType ? Number(form.value.discountValue) || 0 : null,
    total: total.value,
    balanceDue: total.value,
    notes: form.value.notes,
    blNumber: form.value.blNumber,
    quotationId: form.value.quotationId,
    items: form.value.items.map((item) => ({
      id: item.id, // Include id for updates
      serviceId: item.serviceId || undefined,
      taxId: item.taxId || form.value.taxId || undefined,
      description: item.description,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
      amount: Number(item.quantity) * Number(item.unitPrice),
    })),
  };

  const saveResult = props.invoice?.id
    ? await updateInvoice(props.invoice.id, payload)
    : await createInvoice(payload);

  if (saveResult.success) {
    emit("success");
  } else {
    toast.error(saveResult.error || `Failed to ${props.invoice?.id ? "update" : "create"} invoice`);
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat(form.value.currency === "IDR" ? "id-ID" : "en-US", {
    style: "currency",
    currency: form.value.currency,
    minimumFractionDigits: form.value.currency === "IDR" ? 0 : 2,
    maximumFractionDigits: form.value.currency === "IDR" ? 0 : 2,
  }).format(amount);
};

const parseInputCurrency = (val: string, currency: string = form.value.currency) => {
  if (!val) return 0;

  if (currency === "IDR") {
    // For IDR, dots are thousands separators. Strip all non-numeric except minus.
    const numeric = Number(val.replace(/[^0-9-]/g, ""));
    return isNaN(numeric) ? 0 : numeric;
  }

  let normalized = val;
  if (currency === "USD") {
    // For USD, handle comma/dot as decimal separators
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

const formatInputCurrency = (val: number | string, currency: string = form.value.currency) => {
  if (val === undefined || val === null || val === "") return "";
  const numericVal = typeof val === "string" ? parseInputCurrency(val, currency) : val;
  if (isNaN(numericVal)) return "";

  return new Intl.NumberFormat(currency === "IDR" ? "id-ID" : "en-US", {
    maximumFractionDigits: currency === "IDR" ? 0 : 2,
    minimumFractionDigits: 0,
  }).format(numericVal);
};
</script>

<template>
  <div class="bg-white rounded-xl border border-border shadow-sm overflow-hidden animate-fade-in">
    <div class="px-6 py-4 border-b border-border bg-gray-50 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <Receipt class="w-5 h-5 text-[#012D5A]" />
          <h3 class="font-bold text-foreground">
            {{ props.invoice?.id ? "Edit" : "Create New" }} Invoice
          </h3>
        </div>
        <div class="h-4 w-[1px] bg-border mx-1"></div>
        <div class="flex items-center gap-2">
          <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
            >Currency</span
          >
          <div class="flex border border-border rounded-lg overflow-hidden bg-white">
            <button
              type="button"
              @click="form.currency = 'IDR'"
              class="px-3 py-1 text-[10px] font-bold transition-colors"
              :class="
                form.currency === 'IDR'
                  ? 'bg-[#012D5A] text-white'
                  : 'hover:bg-gray-50 text-muted-foreground'
              "
            >
              IDR
            </button>
            <button
              type="button"
              @click="form.currency = 'USD'"
              class="px-3 py-1 text-[10px] font-bold border-l border-border transition-colors"
              :class="
                form.currency === 'USD'
                  ? 'bg-[#012D5A] text-white'
                  : 'hover:bg-gray-50 text-muted-foreground'
              "
            >
              USD
            </button>
          </div>
        </div>

        <div
          v-if="form.currency === 'USD'"
          class="flex items-center gap-2 animate-in slide-in-from-left-2 duration-300"
        >
          <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
            >Ex. Rate</span
          >
          <div class="relative group/rate">
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
              class="w-28 px-3 py-1 text-xs font-bold text-[#012D5A] border border-border rounded-lg focus:ring-2 focus:ring-[#012D5A]/10 focus:border-[#012D5A] outline-none transition-all bg-white"
              placeholder="16,000"
            />
          </div>
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
      <!-- Billing Info -->
      <div class="p-4 bg-blue-50/30 rounded-xl border border-blue-100/50 space-y-3">
        <div class="flex items-center gap-2 mb-1">
          <Building2 class="w-4 h-4 text-[#012D5A]" />
          <span class="text-xs font-bold text-[#012D5A] uppercase tracking-wider"
            >Billing Information</span
          >
        </div>
        <div class="grid grid-cols-1 gap-4">
          <div class="space-y-1.5">
            <label class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
              >Billing Party (Customer) <span class="text-red-500">*</span></label
            >
            <Combobox
              v-model="form.customerId"
              :options="companies"
              label-key="name"
              value-key="id"
              placeholder="Search or select customer..."
              class="bg-white"
            />
            <p v-if="!props.customerId" class="text-[9px] text-amber-600 font-medium italic">
              Note: This job does not have a linked customer. Please select one manually.
            </p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-muted-foreground uppercase tracking-wider"
            >Issued Date</label
          >
          <DatePicker v-model="form.issuedDate" placeholder="Select issued date..." />
        </div>
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-muted-foreground uppercase tracking-wider"
            >Due Date</label
          >
          <DatePicker v-model="form.dueDate" placeholder="Select due date..." />
        </div>
      </div>

      <!-- Shipment Details -->
      <div class="grid grid-cols-1 gap-4">
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-muted-foreground uppercase tracking-wider"
            >B/L Number</label
          >
          <div class="flex gap-2">
            <input
              type="text"
              v-model="form.blNumber"
              placeholder="Enter B/L number..."
              class="flex-1 px-3 py-2 bg-white border border-border rounded-md text-sm focus:ring-2 focus:ring-[#012D5A]/20 focus:border-[#012D5A] outline-none transition-all font-mono"
              v-uppercase
            />
            <div v-if="jobBillsOfLading.length > 0" class="flex items-center gap-2">
              <span class="text-[10px] text-muted-foreground font-bold uppercase italic"
                >From B/L:</span
              >
              <Combobox
                :model-value="null"
                :options="jobBillsOfLading"
                label-key="blNumber"
                value-key="blNumber"
                placeholder="Select B/L..."
                class="min-w-[180px]"
                @update:model-value="(val) => (form.blNumber = val as string)"
              />
            </div>
          </div>
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
            <div class="col-span-5">Service / Description</div>
            <div class="col-span-1">Qty</div>
            <div class="col-span-4 text-right">Unit Price</div>
            <div class="col-span-2 text-right pr-4">Amount</div>
          </div>

          <div class="divide-y divide-border/50">
            <div
              v-for="(item, index) in form.items"
              :key="index"
              class="grid grid-cols-12 gap-3 px-4 py-3 items-start group hover:bg-white transition-colors relative"
              :style="{ zIndex: form.items.length + 10 - index }"
            >
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
                  class="w-full px-3 py-2 bg-white border border-border rounded-md text-sm focus:ring-2 focus:ring-[#012D5A]/20 focus:border-[#012D5A] outline-none transition-all"
                  v-uppercase
                />
              </div>
              <div class="col-span-4">
                <div class="relative">
                  <span
                    class="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-[10px] font-bold pr-1 border-r border-border mr-1"
                    >{{ form.currency }}</span
                  >
                  <input
                    type="text"
                    :value="formatInputCurrency(item.unitPrice)"
                    v-uppercase
                    @input="
                      (e) =>
                        (item.unitPrice = parseInputCurrency((e.target as HTMLInputElement).value))
                    "
                    class="w-full pl-10 pr-3 py-2 bg-white border border-border rounded-md text-sm text-right font-medium focus:ring-2 focus:ring-[#012D5A]/20 focus:border-[#012D5A] outline-none transition-all"
                  />
                </div>
                <span
                  v-if="item.atCost"
                  class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wider mt-1"
                  >AT COST</span
                >
              </div>
              <div class="col-span-2 flex items-center justify-between gap-2 pr-2">
                <p class="text-sm font-bold text-[#012D5A] tabular-nums text-right flex-1">
                  {{ formatCurrency(Number(item.quantity) * Number(item.unitPrice)) }}
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

      <!-- Section: Tax & Notes Side-by-Side -->
      <div class="grid grid-cols-2 gap-8 pt-4">
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
      </div>

      <!-- Totals Section -->
      <div class="flex justify-end pt-4">
        <div class="w-72 space-y-3 bg-gray-50/50 p-4 rounded-xl border border-border">
          <div class="flex justify-between text-sm">
            <span class="text-muted-foreground font-inter">Subtotal</span>
            <span class="font-medium text-foreground font-inter">{{
              formatCurrency(subTotal)
            }}</span>
          </div>

          <!-- Discount (optional) — hidden until the user adds one; applied before tax -->
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
            <span class="text-[10px] font-bold text-[#012D5A]">
              {{
                new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(total * form.exchangeRate)
              }}
            </span>
          </div>
        </div>
      </div>
    </form>

    <!-- Footer -->
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
        <span v-if="isSaving">{{ props.invoice?.id ? "Updating..." : "Saving..." }}</span>
        <span v-else>{{ props.invoice?.id ? "Update" : "Create" }} Invoice</span>
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
