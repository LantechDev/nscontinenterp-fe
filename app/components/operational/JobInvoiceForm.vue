<script setup lang="ts">
import { Plus, Trash2, X, Building2 } from "lucide-vue-next";
import { useInvoices } from "~/composables/useInvoices";
import { useServices } from "~/composables/useServices";
import { useCompanies } from "~/composables/useCompanies";
import { useFinanceTax } from "~/composables/useFinanceTax";
import { useJobs } from "~/composables/useJobs";
import Combobox from "~/components/ui/Combobox.vue";
import Modal from "~/components/ui/Modal.vue";
import { toast } from "vue-sonner";

const TAX_OPTIONS = ref([{ name: "0%", value: "0" }]);

const jobBillsOfLading = ref<Array<{ blNumber: string }>>([]);

const props = defineProps<{
  jobId: string;
  jobNumber: string;
  customerId: string | null;
  invoice?: InvoiceDetail | null;
}>();

const emit = defineEmits(["success", "cancel"]);

const { createInvoice, updateInvoice, isLoading: isSaving } = useInvoices();
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
  taxRate: number;
}

const form = ref({
  invoiceNumber:
    props.invoice?.invoiceNumber ||
    `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
  issuedDate: props.invoice?.issuedDate
    ? new Date(props.invoice.issuedDate).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0],
  dueDate: props.invoice?.dueDate
    ? new Date(props.invoice.dueDate).toISOString().split("T")[0]
    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  currency: props.invoice?.currency || "IDR",
  customerId: props.invoice?.company?.id || props.customerId || "",
  notes: props.invoice?.notes || "",
  blNumber: props.invoice?.blNumber || props.invoice?.job?.billsOfLading?.[0]?.blNumber || "",
  items: (props.invoice?.items?.map((item) => ({
    id: item.id,
    serviceId: item.service?.id || "",
    description: item.description,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    taxRate: 0,
  })) || [{ serviceId: "", description: "", quantity: 1, unitPrice: 0, taxRate: 0 }]) as FormItem[],
});

// Service Modal State
const isServiceModalOpen = ref(false);
const isSubmittingService = ref(false);
const activeItemIndex = ref<number | null>(null);
const serviceForm = reactive({
  name: "",
  code: "",
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

  const [taxesRes] = await Promise.all([
    fetchTaxes({ isActive: true }),
    fetchServices(),
    fetchCompanies({ type: "CUSTOMER" }),
  ]);

  if (taxesRes?.items) {
    const uniqueRates = new Set<number>();
    const dynamicTaxes = taxesRes.items
      .filter((t) => {
        const rate = Number(t.rate);
        if ((rate === 1.1 || rate === 11) && !uniqueRates.has(rate)) {
          uniqueRates.add(rate);
          return true;
        }
        return false;
      })
      .map((t) => ({
        name: `${t.name} (${Number(t.rate)}%)`,
        value: String(Number(t.rate)),
      }));
    TAX_OPTIONS.value = [{ name: "0%", value: "0" }, ...dynamicTaxes];
  }
});

const addItem = () => {
  form.value.items.push({ serviceId: "", description: "", quantity: 1, unitPrice: 0, taxRate: 0 });
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
    item.taxRate = 0;
  }
};

const handleCreateService = (name: string, index: number) => {
  serviceForm.name = name;
  serviceForm.code = name.toUpperCase().replace(/\s+/g, "_").substring(0, 10);
  activeItemIndex.value = index;
  isServiceModalOpen.value = true;
};

async function submitServiceForm() {
  if (!serviceForm.name || !serviceForm.code) {
    toast.error("Name and Code are required.");
    return;
  }

  try {
    isSubmittingService.value = true;
    const result = await createService({
      name: serviceForm.name,
      code: serviceForm.code,
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
      toast.error("Failed to create service: " + (result.error || "Unknown error"));
    }
  } catch (error: unknown) {
    toast.error("Failed to create service: " + (error as Error)?.message);
  } finally {
    isSubmittingService.value = false;
  }
}

const subTotal = computed(() => {
  return form.value.items.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.unitPrice),
    0,
  );
});

const taxAmount = computed(() => {
  return form.value.items.reduce(
    (sum, item) =>
      sum + Number(item.quantity) * Number(item.unitPrice) * (Number(item.taxRate) / 100),
    0,
  );
});

const total = computed(() => {
  return subTotal.value + taxAmount.value;
});

const handleSubmit = async () => {
  if (!form.value.customerId) {
    toast.error("Please select a Billing Party (Customer) for this invoice.");
    return;
  }

  const payload = {
    jobId: props.jobId,
    invoiceNumber: form.value.invoiceNumber,
    companyId: form.value.customerId,
    currency: form.value.currency,
    issuedDate: (form.value.issuedDate || new Date().toISOString().split("T")[0]) as string,
    dueDate: (form.value.dueDate || new Date().toISOString().split("T")[0]) as string,
    subTotal: subTotal.value,
    taxAmount: taxAmount.value,
    total: total.value,
    balanceDue: total.value,
    notes: form.value.notes,
    blNumber: form.value.blNumber,
    items: form.value.items.map((item) => ({
      id: item.id, // Include id for updates
      serviceId: item.serviceId || undefined,
      description: item.description,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
      amount: Number(item.quantity) * Number(item.unitPrice),
    })),
  };

  const result = props.invoice?.id
    ? await updateInvoice(props.invoice.id, payload)
    : await createInvoice(payload);

  if (result.success) {
    emit("success");
  } else {
    toast.error(result.error || `Failed to ${props.invoice?.id ? "update" : "create"} invoice`);
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat(form.value.currency === "IDR" ? "id-ID" : "en-US", {
    style: "currency",
    currency: form.value.currency,
    minimumFractionDigits: form.value.currency === "IDR" ? 0 : 2,
  }).format(amount);
};

const parseInputCurrency = (val: string) => {
  const numeric = Number(val.replace(/[^0-9.-]+/g, ""));
  return isNaN(numeric) ? 0 : numeric;
};

const formatInputCurrency = (val: number | string) => {
  if (!val && val !== 0) return "";
  const numericVal = typeof val === "string" ? parseInputCurrency(val) : val;
  if (isNaN(numericVal)) return "";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
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
          <input
            type="date"
            v-model="form.issuedDate"
            class="w-full px-3 py-2 bg-white border border-border rounded-md text-sm focus:ring-2 focus:ring-[#012D5A]/20 focus:border-[#012D5A] outline-none transition-all"
          />
        </div>
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-muted-foreground uppercase tracking-wider"
            >Due Date</label
          >
          <input
            type="date"
            v-model="form.dueDate"
            class="w-full px-3 py-2 bg-white border border-border rounded-md text-sm focus:ring-2 focus:ring-[#012D5A]/20 focus:border-[#012D5A] outline-none transition-all"
          />
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
          <button
            type="button"
            @click="addItem"
            class="inline-flex items-center gap-1.5 text-xs font-bold text-[#012D5A] hover:bg-[#012D5A]/5 px-2 py-1 rounded transition-colors"
          >
            <Plus class="w-3.5 h-3.5" /> Add Service Item
          </button>
        </div>

        <div class="border rounded-xl border-border bg-muted/5">
          <div
            class="grid grid-cols-12 gap-3 px-4 py-2 border-b border-border bg-gray-50/50 text-[10px] font-bold text-muted-foreground uppercase tracking-wider"
          >
            <div class="col-span-4">Service / Description</div>
            <div class="col-span-1">Qty</div>
            <div class="col-span-3 text-right">Unit Price</div>
            <div class="col-span-3 px-2">Tax</div>
            <div class="col-span-1"></div>
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
                ></textarea>
              </div>
              <div class="col-span-1">
                <input
                  type="number"
                  v-model.number="item.quantity"
                  min="1"
                  class="w-full px-3 py-2 bg-white border border-border rounded-md text-sm focus:ring-2 focus:ring-[#012D5A]/20 focus:border-[#012D5A] outline-none transition-all"
                />
              </div>
              <div class="col-span-3">
                <div class="relative">
                  <span
                    class="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-[10px] font-bold pr-1 border-r border-border mr-1"
                    >{{ form.currency }}</span
                  >
                  <input
                    type="text"
                    :value="formatInputCurrency(item.unitPrice)"
                    @input="
                      (e) =>
                        (item.unitPrice = parseInputCurrency((e.target as HTMLInputElement).value))
                    "
                    class="w-full pl-10 pr-3 py-2 bg-white border border-border rounded-md text-sm text-right font-medium focus:ring-2 focus:ring-[#012D5A]/20 focus:border-[#012D5A] outline-none transition-all"
                  />
                </div>
                <p class="text-[9px] text-right mt-1.5 font-bold text-muted-foreground">
                  Sub: {{ formatCurrency(Number(item.quantity) * Number(item.unitPrice)) }}
                </p>
              </div>
              <div class="col-span-3 px-2 flex flex-col items-end mr-4">
                <Combobox
                  :model-value="String(item.taxRate)"
                  :options="TAX_OPTIONS"
                  label-key="name"
                  value-key="value"
                  placeholder="Tax..."
                  class="w-[180px] h-9 [&_button]:h-9 [&_button]:text-xs [&_button]:font-bold"
                  @update:model-value="(val) => (item.taxRate = Number(val))"
                />
                <p class="text-[9px] text-right mt-1.5 font-bold text-slate-400">
                  Tax:
                  {{
                    formatCurrency(
                      Number(item.quantity) * Number(item.unitPrice) * (Number(item.taxRate) / 100),
                    )
                  }}
                </p>
              </div>
              <div class="col-span-1 flex justify-end">
                <button
                  type="button"
                  @click="removeItem(index)"
                  class="p-2 text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-30"
                  :disabled="form.items.length === 1"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Notes Section -->
      <div class="space-y-2">
        <label class="text-xs font-bold text-muted-foreground uppercase tracking-wider"
          >Internal Notes</label
        >
        <textarea
          v-model="form.notes"
          rows="2"
          placeholder="Add any internal notes here..."
          class="w-full px-4 py-3 bg-white border border-border rounded-xl text-sm focus:ring-2 focus:ring-[#012D5A]/20 focus:border-[#012D5A] outline-none transition-all resize-none"
        ></textarea>
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
          <div class="flex items-center justify-between text-sm">
            <span class="text-muted-foreground font-inter">Total Tax</span>
            <span class="font-medium text-foreground font-inter">{{
              formatCurrency(taxAmount)
            }}</span>
          </div>
          <div class="flex justify-between border-t border-border pt-2 mt-2">
            <span class="font-bold text-foreground font-inter">Total Amount</span>
            <span class="font-bold text-[#0a0b0b] text-lg font-inter">{{
              formatCurrency(total)
            }}</span>
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

    <!-- Service Creation Modal -->
    <Modal
      v-model="isServiceModalOpen"
      title="Add New Service"
      description="Create a new service to master data."
      width="max-w-md"
    >
      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-xs font-bold text-muted-foreground uppercase">Service Name</label>
          <input
            v-model="serviceForm.name"
            type="text"
            class="input-field"
            placeholder="e.g. Ocean Freight"
          />
        </div>
        <div class="space-y-2">
          <label class="text-xs font-bold text-muted-foreground uppercase">Service Code</label>
          <input
            v-model="serviceForm.code"
            type="text"
            class="input-field"
            placeholder="e.g. OF_001"
          />
        </div>
        <div class="flex justify-end gap-3 pt-4">
          <button type="button" @click="isServiceModalOpen = false" class="btn-outline px-4 py-2">
            Cancel
          </button>
          <button
            type="button"
            @click="submitServiceForm"
            class="btn-primary px-6 py-2 bg-[#012D5A]"
            :disabled="isSubmittingService"
          >
            {{ isSubmittingService ? "Creating..." : "Create Service" }}
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>
