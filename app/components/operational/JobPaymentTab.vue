<script setup lang="ts">
import {
  Receipt,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Calendar,
  CreditCard,
  ExternalLink,
  Ban,
} from "lucide-vue-next";
import { toast } from "vue-sonner";
import { useInvoices, type Invoice } from "~/composables/useInvoices";
import { usePayments } from "~/composables/usePayments";
import Modal from "~/components/ui/Modal.vue";

const props = defineProps<{
  jobId: string;
}>();

const emit = defineEmits<{
  (e: "reload"): void;
}>();

const { fetchInvoices, isLoading } = useInvoices();
const { voidPayment } = usePayments();
const invoices = ref<Invoice[]>([]);
const error = ref<string | null>(null);
const isVoiding = ref(false);
const showVoidConfirm = ref(false);
const paymentToVoid = ref<string | null>(null);
const paymentNumberToVoid = ref<string | null>(null);

const loadData = async () => {
  error.value = null;
  const result = await fetchInvoices(props.jobId);
  if (result.success) {
    invoices.value = result.data || [];
  } else {
    error.value = result.error || "Failed to load payment history";
  }
};

onMounted(() => {
  loadData();
});

const allPayments = computed(() => {
  const payments: ReturnType<typeof buildPaymentEntry>[] = [];
  invoices.value.forEach((invoice) => {
    if (invoice.paymentAllocations && invoice.paymentAllocations.length > 0) {
      invoice.paymentAllocations.forEach((alloc) => {
        if (alloc.payment) {
          payments.push({
            ...alloc.payment,
            amount: alloc.amount, // Use the allocated amount for this invoice
            invoiceNumber: invoice.invoiceNumber,
            invoiceId: invoice.id,
          });
        }
      });
    }
  });

  // Sort by date descending
  return payments.toSorted(
    (a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime(),
  );
});

function buildPaymentEntry(
  alloc: NonNullable<(typeof invoices.value)[0]["paymentAllocations"]>[0],
  invoice: (typeof invoices.value)[0],
) {
  return {
    ...alloc.payment!,
    amount: alloc.amount,
    invoiceNumber: invoice.invoiceNumber,
    invoiceId: invoice.id,
  };
}

const totalPaid = computed(() => {
  return allPayments.value.reduce((sum, p) => sum + Number(p.amount), 0);
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
};

const confirmVoid = (id: string, number: string) => {
  paymentToVoid.value = id;
  paymentNumberToVoid.value = number;
  showVoidConfirm.value = true;
};

const handleVoidPayment = async () => {
  if (!paymentToVoid.value) return;

  isVoiding.value = true;
  try {
    const result = await voidPayment(paymentToVoid.value);
    if (result.success) {
      showVoidConfirm.value = false;
      await loadData();
      emit("reload");
    } else {
      error.value = result.error || "Failed to void payment";
    }
  } catch (err: unknown) {
    error.value = (err as Error).message || "An unexpected error occurred";
  } finally {
    isVoiding.value = false;
  }
};
</script>

<template>
  <div class="space-y-6">
    <div
      v-if="isLoading && invoices.length === 0"
      class="py-12 flex flex-col items-center justify-center space-y-3"
    >
      <Loader2 class="w-8 h-8 animate-spin text-primary opacity-60" />
      <p class="text-sm text-muted-foreground">Loading payment history...</p>
    </div>

    <div v-else-if="error" class="p-6 text-center bg-red-50 rounded-xl border border-red-100">
      <AlertCircle class="w-8 h-8 text-red-400 mx-auto mb-3" />
      <p class="text-sm font-medium text-red-800">{{ error }}</p>
      <button @click="loadData" class="mt-4 text-xs font-bold text-red-700 hover:underline">
        Try Again
      </button>
    </div>

    <div
      v-else-if="allPayments.length === 0"
      class="border border-dashed border-border rounded-xl p-10 text-center bg-gray-50/50"
    >
      <div
        class="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4 border border-border"
      >
        <Receipt class="w-6 h-6 text-muted-foreground opacity-40" />
      </div>
      <p class="text-sm font-semibold text-foreground mb-1">No Payments Recorded</p>
      <p class="text-xs text-muted-foreground max-w-[240px] mx-auto leading-relaxed">
        There are no payments linked to any invoices for this job yet.
      </p>
    </div>

    <div v-else class="space-y-6">
      <!-- Summary Card -->
      <div class="bg-[#012D5A] rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
        <div class="relative z-10">
          <p class="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">
            Total Payments Received
          </p>
          <h3 class="text-3xl font-black">{{ formatCurrency(totalPaid) }}</h3>
          <div
            class="mt-4 flex items-center gap-2 text-xs font-medium bg-white/10 w-fit px-3 py-1.5 rounded-full border border-white/10"
          >
            <CheckCircle2 class="w-3.5 h-3.5 text-emerald-400" />
            Across {{ invoices.length }} Invoice{{ invoices.length > 1 ? "s" : "" }}
          </div>
        </div>
        <!-- Decorative Circle -->
        <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <!-- Payment List -->
      <div class="space-y-1">
        <h3 class="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 px-1">
          Recent Transactions
        </h3>
        <div class="space-y-3">
          <div
            v-for="payment in allPayments"
            :key="payment.id"
            class="group p-4 rounded-xl border border-border bg-white hover:border-emerald-500/30 hover:shadow-md transition-all"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex gap-4">
                <div
                  :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center shrink-0 border',
                    payment.status === 'VOIDED'
                      ? 'bg-gray-50 border-gray-200 text-gray-400'
                      : 'bg-emerald-50 border-emerald-100 text-emerald-600',
                  ]"
                >
                  <Ban v-if="payment.status === 'VOIDED'" class="w-5 h-5" />
                  <CreditCard v-else class="w-5 h-5" />
                </div>
                <div class="space-y-0.5">
                  <p
                    :class="[
                      'font-bold text-sm',
                      (payment.status || '').toUpperCase() === 'VOIDED'
                        ? 'text-gray-400 line-through'
                        : 'text-foreground',
                    ]"
                  >
                    {{ formatCurrency(payment.amount) }}
                  </p>
                  <div
                    class="flex items-center gap-2 text-[10px] text-muted-foreground font-medium"
                  >
                    <Calendar class="w-3 h-3" />
                    {{ formatDate(payment.paymentDate) }}
                    <span
                      v-if="(payment.status || '').toUpperCase() === 'VOIDED'"
                      class="ml-2 px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[8px] font-bold uppercase tracking-wider"
                      >Voided</span
                    >
                  </div>
                </div>
              </div>
              <div class="flex flex-col items-end gap-3 shrink-0">
                <div
                  class="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-blue-50 text-blue-800 border border-blue-100 text-[9px] font-black uppercase tracking-widest shadow-sm"
                >
                  {{ payment.invoiceNumber }}
                </div>
                <button
                  v-if="(payment.status || '').toUpperCase() === 'PAID' && payment.paymentNumber"
                  @click="confirmVoid(payment.id, payment.paymentNumber!)"
                  class="flex items-center gap-1.5 px-2 py-1 text-red-600 hover:bg-red-50 rounded-md transition-all border border-red-100/50 hover:border-red-200 shadow-sm"
                  title="Void Payment"
                >
                  <Ban class="w-3.5 h-3.5" />
                  <span class="text-[9px] font-bold uppercase tracking-wider">Void</span>
                </button>
              </div>
            </div>

            <div
              :class="[
                'grid grid-cols-2 gap-4 border-t border-border/50 pt-3 mt-3',
                payment.status === 'VOIDED' ? 'opacity-50' : '',
              ]"
            >
              <div>
                <p
                  class="text-[9px] text-muted-foreground uppercase tracking-widest font-bold mb-1"
                >
                  Method
                </p>
                <p class="text-xs font-bold text-foreground">
                  {{ payment.paymentMethod?.name || "Bank Transfer" }}
                </p>
              </div>
              <div class="text-right">
                <p
                  class="text-[9px] text-muted-foreground uppercase tracking-widest font-bold mb-1"
                >
                  Reference
                </p>
                <p class="text-xs font-bold text-foreground">{{ payment.reference || "-" }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Void Confirmation Modal -->
    <Modal
      v-model="showVoidConfirm"
      title="Void Payment"
      description="Are you sure you want to void this payment? This will restore the balance on the related invoice and cannot be undone."
      width="max-w-sm"
    >
      <div class="space-y-4 pt-2">
        <div class="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
          <AlertCircle class="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p class="text-xs text-red-800 leading-relaxed font-medium">
            Voiding payment {{ paymentNumberToVoid }} will mark it as inactive and restore the
            corresponding amount to the balance due of invoice(s) it was applied to.
          </p>
        </div>
        <div class="flex justify-end gap-3 pt-2">
          <button
            @click="showVoidConfirm = false"
            class="px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-muted rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleVoidPayment"
            :disabled="isVoiding"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-md shadow-sm transition-colors flex items-center gap-2"
          >
            <Loader2 v-if="isVoiding" class="w-3.5 h-3.5 animate-spin" />
            {{ isVoiding ? "Voiding..." : "Confirm Void" }}
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>
