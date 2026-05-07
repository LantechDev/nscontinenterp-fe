<script setup lang="ts">
import { Save, Loader2, X, Plus, Calendar, Receipt } from "lucide-vue-next";
import { useFinanceExpense, type Expense, type ExpenseItem } from "~/composables/useFinanceExpense";
import { useFinanceTax, type Tax } from "~/composables/useFinanceTax";
import { useCompanies } from "~/composables/useCompanies";
import { useServices } from "~/composables/useServices";
import { useJobs } from "~/composables/useJobs";
import SearchSelect from "~/components/ui/SearchSelect.vue";
import DatePicker from "~/components/ui/DatePicker.vue";
import { toast } from "vue-sonner";
import { z } from "zod";

const vendorInvoiceSchema = z.object({
  vendorId: z.string().min(1, "Please select a vendor"),
  description: z.string().min(1, "Description is required"),
  amount: z.number().gt(0, "Total amount must be greater than 0"),
  currency: z.enum(["IDR", "USD"]),
  exchangeRate: z.number().gt(0, "Exchange rate must be greater than 0"),
  items: z.array(
    z.object({
      description: z.string().min(1, "Item description is required"),
      quantity: z.number().gt(0, "Quantity must be greater than 0"),
      unitPrice: z.number().gt(0, "Unit price must be greater than 0"),
    }),
  ),
});

const props = defineProps<{
  jobId: string;
  expense?: Expense | null;
}>();

const emit = defineEmits(["success", "cancel"]);

const { createExpense, updateExpense, isLoading } = useFinanceExpense();
const { fetchTaxes } = useFinanceTax();
const { fetchCompanies } = useCompanies();
const { fetchServices, fetchCategories } = useServices();
const { getJob } = useJobs();

const form = ref({
  number: "",
  description: "",
  amount: 0,
  date: new Date().toISOString().split("T")[0],
  categoryId: "",
  vendorId: "",
  jobId: props.jobId,
  taxId: "",
  notes: "",
  currency: "IDR",
  exchangeRate: 1,
  items: [] as Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>,
});

const isBreakdownMode = computed(() => form.value.items.length > 0);

const subtotal = computed(() => {
  return form.value.items.reduce((sum, item) => sum + item.amount, 0);
});

// Watch subtotal to update main amount
watch(subtotal, (newSubtotal) => {
  if (isBreakdownMode.value) {
    form.value.amount = newSubtotal;
  }
});

const addItem = () => {
  form.value.items.push({
    description: "",
    quantity: 1,
    unitPrice: 0,
    amount: 0,
  });
};

const removeItem = (index: number) => {
  form.value.items.splice(index, 1);
};

const updateItemAmount = (index: number) => {
  const item = form.value.items[index];
  if (item) {
    item.amount = (item.quantity || 0) * (item.unitPrice || 0);
  }
};

const taxOptions = ref<Array<{ id: string; name: string }>>([]);
const categoryOptions = ref<Array<{ id: string; name: string }>>([]);
const vendorOptions = ref<Array<{ id: string; name: string }>>([]);

onMounted(async () => {
  // Load initial data
  const [taxesResp, servicesResp, categoriesResp] = await Promise.all([
    fetchTaxes({ isActive: true, limit: 100 }),
    fetchServices(),
    fetchCategories(),
  ]);

  taxOptions.value = (taxesResp?.items || []).map((t: Tax) => ({
    id: t.id,
    name: `${t.name} (${t.rate}%)`,
  }));

  categoryOptions.value = (categoriesResp?.data || []).map((c) => ({
    id: c.id,
    name: c.name,
  }));

  // If editing, fill the form
  if (props.expense) {
    form.value = {
      number: props.expense.number,
      description: props.expense.description,
      amount: Number(props.expense.amount),
      date: props.expense.date.split("T")[0],
      categoryId: props.expense.categoryId || "",
      vendorId: props.expense.vendorId || "",
      jobId: props.expense.jobId || props.jobId,
      taxId: props.expense.taxId || "",
      notes: props.expense.notes || "",
      currency: props.expense.currency || "IDR",
      exchangeRate: Number(props.expense.exchangeRate || 1),
      items: (props.expense.items || []).map((item: ExpenseItem) => ({
        description: item.description,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        amount: Number(item.amount),
      })),
    };

    if (props.expense.vendor && props.expense.vendorId) {
      vendorOptions.value = [
        {
          id: props.expense.vendorId,
          name: props.expense.vendor.name,
        },
      ];
    }
  } else {
    // Generate expense number
    form.value.number = `EXP-${Date.now().toString().slice(-6)}`;

    // Auto-select vendor from Job if available
    const jobRes = await getJob(props.jobId);
    if (jobRes.success && jobRes.data?.vendorId) {
      form.value.vendorId = jobRes.data.vendorId;
      // Add to initial options so SearchSelect can show the name
      if (jobRes.data.vendor) {
        vendorOptions.value = [
          {
            id: jobRes.data.vendorId,
            name: jobRes.data.vendor.name,
          },
        ];
      }
    }
  }
});

const parseInputCurrency = (val: string) => {
  if (!val) return 0;
  // Remove all non-numeric characters except for the first minus sign if present
  const cleaned = val.replace(/\./g, "").replace(/[^0-9-]/g, "");
  const numeric = parseInt(cleaned, 10);
  return isNaN(numeric) ? 0 : numeric;
};

const formatInputCurrency = (val: number | string) => {
  if (val === undefined || val === null || val === "") return "";
  const numericVal = typeof val === "string" ? parseInputCurrency(val) : val;
  if (numericVal === 0) return "0";
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(numericVal);
};

async function handleSubmit() {
  const result = vendorInvoiceSchema.safeParse(form.value);

  if (!result.success) {
    const firstError = result.error.issues[0];
    toast.error(firstError?.message || "Invalid form data");
    return;
  }

  try {
    const payload = {
      ...form.value,
      amount: Number(form.value.amount),
      categoryId: form.value.categoryId || undefined,
      vendorId: form.value.vendorId || undefined,
      taxId: form.value.taxId || undefined,
    };

    if (props.expense?.id) {
      await updateExpense(props.expense.id, payload);
      toast.success("Vendor invoice updated successfully");
    } else {
      await createExpense(payload);
      toast.success("Vendor invoice recorded successfully");
    }
    emit("success");
  } catch (error: unknown) {
    toast.error("Failed to save: " + (error as Error).message);
  }
}
import type { SearchSelectOption } from "~/components/ui/SearchSelect.vue";
async function fetchVendorOptions({ query }: { query: string }) {
  const result = await fetchCompanies({ type: "VENDOR", search: query, limit: 50 });
  const data: SearchSelectOption[] = (result.data || []).map((c) => ({
    id: c.id,
    name: c.name,
  }));
  return { success: true, data };
}
</script>

<template>
  <div class="p-1">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Section: Basic Info -->
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Invoice / Expense No.
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
                required
                class="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-xl focus:ring-2 focus:ring-[#012D5A]/10 focus:border-[#012D5A] outline-none transition-all bg-gray-50/30"
                placeholder="EXP-XXXX"
              />
            </div>
          </div>
          <div class="space-y-1.5">
            <label class="text-[10px] font-black text-muted-foreground uppercase tracking-widest"
              >Date</label
            >
            <DatePicker v-model="form.date" required placeholder="Select date..." />
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="text-[10px] font-black text-muted-foreground uppercase tracking-widest"
            >Description</label
          >
          <input
            v-model="form.description"
            type="text"
            required
            class="w-full px-4 py-2.5 text-sm border border-border rounded-xl focus:ring-2 focus:ring-[#012D5A]/10 focus:border-[#012D5A] outline-none transition-all bg-gray-50/30"
            placeholder="e.g. Trucking Charges, THC, etc."
          />
        </div>
      </div>

      <!-- Section: Entity & Category -->
      <div class="grid grid-cols-2 gap-4 pt-2">
        <div class="space-y-1.5">
          <label class="text-[10px] font-black text-muted-foreground uppercase tracking-widest"
            >Vendor</label
          >
          <SearchSelect
            v-model="form.vendorId"
            :fetch-options="fetchVendorOptions"
            :initial-options="vendorOptions"
            placeholder="Select Vendor"
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

      <!-- Section: Currency & Exchange Rate -->
      <div
        class="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 flex items-center justify-between gap-6"
      >
        <div class="flex items-center gap-4">
          <div class="flex flex-col gap-1">
            <span class="text-[10px] font-black text-muted-foreground uppercase tracking-widest"
              >Currency</span
            >
            <div class="flex border border-border rounded-lg overflow-hidden bg-white shadow-sm">
              <button
                type="button"
                @click="
                  form.currency = 'IDR';
                  form.exchangeRate = 1;
                "
                class="px-4 py-1.5 text-[10px] font-black transition-all uppercase tracking-tighter"
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
                class="px-4 py-1.5 text-[10px] font-black border-l border-border transition-all uppercase tracking-tighter"
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
            class="flex flex-col gap-1 animate-in slide-in-from-left-2 duration-300"
          >
            <label
              class="text-[10px] font-black text-[#012D5A] uppercase tracking-widest flex items-center gap-1.5"
            >
              Exchange Rate
              <span class="text-[8px] text-[#012D5A]/50 lowercase font-medium">(to IDR)</span>
            </label>
            <div class="relative group/rate">
              <input
                type="text"
                :value="formatInputCurrency(form.exchangeRate)"
                @input="
                  (e) =>
                    (form.exchangeRate = parseInputCurrency((e.target as HTMLInputElement).value))
                "
                class="w-32 px-3 py-1.5 text-xs font-black text-[#012D5A] border border-[#012D5A]/15 rounded-lg focus:ring-4 focus:ring-[#012D5A]/5 focus:border-[#012D5A] outline-none transition-all bg-white"
                placeholder="16,000"
              />
            </div>
          </div>
        </div>

        <div v-if="form.currency === 'USD'" class="text-right flex flex-col gap-0.5">
          <span class="text-[8px] font-black text-muted-foreground uppercase tracking-[0.15em]"
            >Live Preview</span
          >
          <p class="text-xs font-black text-[#012D5A]">
            $1 =
            {{
              new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(form.exchangeRate)
            }}
          </p>
        </div>
      </div>

      <!-- Section: Financials -->
      <div class="space-y-4 pt-4">
        <div class="flex items-center justify-between">
          <label class="text-xs font-bold text-muted-foreground uppercase tracking-wider"
            >Service Items Breakdown</label
          >
          <button
            type="button"
            @click="addItem"
            class="inline-flex items-center gap-1.5 text-xs font-bold text-[#012D5A] hover:bg-[#012D5A]/5 px-2 py-1 rounded transition-colors"
          >
            <Plus class="w-3.5 h-3.5" /> Add Breakdown Item
          </button>
        </div>

        <div class="border rounded-xl border-border bg-muted/5 overflow-hidden shadow-sm">
          <div
            class="grid grid-cols-12 gap-3 px-4 py-2.5 border-b border-border bg-gray-50/80 text-[10px] font-black text-muted-foreground uppercase tracking-widest"
          >
            <div class="col-span-5">Description</div>
            <div class="col-span-1 text-center">Qty</div>
            <div class="col-span-3 text-right">Unit Price ({{ form.currency }})</div>
            <div class="col-span-3 text-right pr-6">Total</div>
          </div>

          <div class="divide-y divide-border/50 bg-white/50">
            <!-- Breakdown Mode: Items Table -->
            <template v-if="isBreakdownMode">
              <div
                v-for="(item, index) in form.items"
                :key="index"
                class="grid grid-cols-12 gap-3 px-4 py-3 items-center group hover:bg-white transition-colors relative"
              >
                <div class="col-span-5">
                  <input
                    v-model="item.description"
                    type="text"
                    placeholder="Item description..."
                    class="w-full h-9 px-3 py-2 bg-white border border-border rounded-md text-sm focus:ring-2 focus:ring-[#012D5A]/10 focus:border-[#012D5A] outline-none transition-all shadow-sm"
                  />
                </div>
                <div class="col-span-1">
                  <input
                    type="number"
                    v-model.number="item.quantity"
                    min="1"
                    @input="updateItemAmount(index)"
                    class="w-full h-9 px-2 py-2 bg-white border border-border rounded-md text-sm focus:ring-2 focus:ring-[#012D5A]/10 focus:border-[#012D5A] outline-none transition-all text-center shadow-sm"
                  />
                </div>
                <div class="col-span-3">
                  <div class="relative group/input">
                    <input
                      type="text"
                      :value="formatInputCurrency(item.unitPrice)"
                      @input="
                        (e) => (
                          (item.unitPrice = parseInputCurrency(
                            (e.target as HTMLInputElement).value,
                          )),
                          updateItemAmount(index)
                        )
                      "
                      class="w-full h-9 px-3 py-2 bg-white border border-border rounded-md text-sm text-right font-medium focus:ring-2 focus:ring-[#012D5A]/10 focus:border-[#012D5A] outline-none transition-all shadow-sm"
                    />
                  </div>
                </div>
                <div class="col-span-3 flex items-center justify-between gap-4">
                  <div class="flex-1 text-right">
                    <p class="text-sm font-bold text-[#012D5A] tabular-nums">
                      {{ new Intl.NumberFormat("id-ID").format(item.amount) }}
                    </p>
                  </div>
                  <button
                    type="button"
                    @click="removeItem(index)"
                    class="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <X class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </template>

            <!-- Manual Mode: Single Row -->
            <div v-else class="px-4 py-10 text-center bg-gray-50/20">
              <div class="max-w-sm mx-auto space-y-3">
                <div
                  class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Plus class="w-6 h-6 text-gray-400" />
                </div>
                <p class="text-xs text-muted-foreground font-medium">
                  No itemized breakdown added yet.
                </p>
                <p class="text-[10px] text-muted-foreground/60 italic leading-relaxed">
                  Adding items will automatically disable manual total entry and calculate the
                  invoice sum.
                </p>
                <button
                  @click="addItem"
                  type="button"
                  class="mt-4 px-4 py-2 bg-white border border-border rounded-lg text-[10px] font-bold text-[#012D5A] hover:bg-[#012D5A] hover:text-white transition-all uppercase tracking-widest shadow-sm"
                >
                  + Add First Item
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section: Additional Details (Tax & Notes Side-by-Side) -->
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
            Tax will be applied to the total amount of the invoice.
          </p>
        </div>
        <div class="space-y-2">
          <label class="text-[10px] font-black text-muted-foreground uppercase tracking-widest"
            >Internal Notes</label
          >
          <textarea
            v-model="form.notes"
            rows="2"
            class="w-full px-4 py-3 text-sm border border-border rounded-xl focus:ring-2 focus:ring-[#012D5A]/10 focus:border-[#012D5A] outline-none transition-all bg-gray-50/30 resize-none shadow-sm"
            placeholder="Add internal remarks here..."
          ></textarea>
        </div>
      </div>

      <!-- Section: Final Totals Card (Premium Redesign) -->
      <div class="flex justify-end pt-8">
        <div class="w-full md:w-[600px] group">
          <div
            class="relative overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-all hover:shadow-md hover:shadow-gray-200/50"
          >
            <!-- Decorative Gradient Header -->
            <div
              class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#012D5A]/20 to-transparent"
            ></div>

            <div class="p-8 space-y-5">
              <!-- Subtotal Line (Only in Breakdown Mode) -->
              <div v-if="isBreakdownMode" class="flex justify-between items-center px-1">
                <div class="flex flex-col">
                  <span
                    class="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em]"
                    >Subtotal</span
                  >
                  <span class="text-[9px] text-muted-foreground/60 italic font-medium"
                    >Before Tax & Adj.</span
                  >
                </div>
                <span class="font-bold text-foreground text-base tabular-nums">
                  {{
                    new Intl.NumberFormat(form.currency === "IDR" ? "id-ID" : "en-US", {
                      style: "currency",
                      currency: form.currency,
                      minimumFractionDigits: form.currency === "IDR" ? 0 : 2,
                    }).format(subtotal)
                  }}
                </span>
              </div>

              <!-- Main Total Box -->
              <div
                class="relative p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 shadow-inner overflow-hidden"
              >
                <!-- Background Pattern -->
                <div class="absolute right-0 top-0 opacity-[0.03] pointer-events-none">
                  <Receipt class="w-32 h-32 -mr-8 -mt-8 rotate-12" />
                </div>

                <div class="flex justify-between items-center relative z-10">
                  <div class="flex flex-col gap-1">
                    <span class="text-[11px] font-black text-[#012D5A] uppercase tracking-[0.2em]"
                      >Total Amount</span
                    >
                    <div class="flex items-center gap-2">
                      <span
                        class="inline-flex items-center px-1.5 py-0.5 rounded bg-[#012D5A]/5 text-[8px] font-black text-[#012D5A]/60 uppercase tracking-tighter border border-[#012D5A]/10"
                      >
                        {{ form.currency }}
                      </span>
                      <span
                        v-if="isBreakdownMode"
                        class="inline-flex items-center px-1.5 py-0.5 rounded bg-green-50 text-[8px] font-black text-green-600 uppercase tracking-tighter border border-green-100"
                        >Verified</span
                      >
                      <span
                        v-else
                        class="inline-flex items-center px-1.5 py-0.5 rounded bg-[#012D5A]/5 text-[8px] font-black text-[#012D5A]/60 uppercase tracking-tighter border border-[#012D5A]/10"
                        >Manual</span
                      >
                    </div>
                  </div>

                  <div class="flex-1 ml-8">
                    <template v-if="isBreakdownMode">
                      <div class="flex flex-col items-end">
                        <div class="flex items-baseline justify-end gap-1.5">
                          <span class="text-xs font-black text-[#012D5A]/40">{{
                            form.currency
                          }}</span>
                          <span
                            class="text-3xl font-black text-[#012D5A] tabular-nums tracking-tighter"
                          >
                            {{
                              new Intl.NumberFormat(form.currency === "IDR" ? "id-ID" : "en-US", {
                                minimumFractionDigits: form.currency === "IDR" ? 0 : 2,
                              }).format(form.amount)
                            }}
                          </span>
                        </div>
                        <p
                          v-if="form.currency === 'USD'"
                          class="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-1"
                        >
                          Equivalent to IDR
                          {{
                            new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              minimumFractionDigits: 0,
                            }).format(form.amount * form.exchangeRate)
                          }}
                        </p>
                      </div>
                    </template>
                    <template v-else>
                      <div class="flex flex-col items-end gap-2 w-full">
                        <div class="relative group/input w-full">
                          <span
                            class="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#012D5A]/30 border-r border-[#012D5A]/10 pr-3 h-4 flex items-center"
                            >{{ form.currency }}</span
                          >
                          <input
                            type="text"
                            :value="
                              form.currency === 'IDR'
                                ? formatInputCurrency(form.amount)
                                : form.amount
                            "
                            @input="
                              (e) =>
                                (form.amount =
                                  form.currency === 'IDR'
                                    ? parseInputCurrency((e.target as HTMLInputElement).value)
                                    : Number((e.target as HTMLInputElement).value))
                            "
                            class="w-full pl-14 pr-4 py-3 bg-white border border-[#012D5A]/15 rounded-xl text-xl text-right font-black text-[#012D5A] focus:ring-4 focus:ring-[#012D5A]/5 focus:border-[#012D5A] outline-none transition-all shadow-sm"
                            placeholder="0"
                          />
                        </div>
                        <p
                          v-if="form.currency === 'USD'"
                          class="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest"
                        >
                          Approx. IDR
                          {{
                            new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              minimumFractionDigits: 0,
                            }).format(form.amount * form.exchangeRate)
                          }}
                        </p>
                      </div>
                    </template>
                  </div>
                </div>
              </div>

              <!-- Footer Note (Breakdown Mode Only) -->
              <div v-if="isBreakdownMode" class="flex items-center justify-center gap-2 py-1">
                <div class="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
                <span
                  class="text-[9px] font-bold text-muted-foreground/70 uppercase tracking-[0.1em]"
                  >Sum linked to breakdown items</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>

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
          :disabled="isLoading"
          class="px-8 py-2.5 bg-[#012D5A] text-white text-xs font-black rounded-xl hover:bg-[#012D5A]/90 active:scale-95 transition-all flex items-center gap-2 uppercase tracking-widest shadow-lg shadow-[#012D5A]/20"
        >
          <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
          <Save v-else class="w-4 h-4" />
          {{ isLoading ? "Saving..." : expense ? "Update Invoice" : "Confirm Invoice" }}
        </button>
      </div>
    </form>
  </div>
</template>
