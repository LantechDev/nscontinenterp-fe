<script setup lang="ts">
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  DollarSign,
  TrendingUp,
  Percent,
  Calculator,
  Lock,
  ExternalLink,
  CheckCircle,
  FileText,
  Building2,
} from "lucide-vue-next";
import Combobox from "~/components/ui/Combobox.vue";
import DatePicker from "~/components/ui/DatePicker.vue";
import SectionCard from "~/pages/operational/jobs/components/SectionCard.vue";
import { useQuotations, type QuotationCharge } from "~/composables/useQuotations";
import { useFinanceTax, type Tax } from "~/composables/useFinanceTax";
import { useServices } from "~/composables/useServices";
import ServiceCreateModal from "~/pages/master/services/components/ServiceCreateModal.vue";
import CompanyCreateModal from "~/pages/master/company/components/CompanyCreateModal.vue";
import type { Port, ContainerType } from "~/composables/useMasterData";
import { toast } from "vue-sonner";

definePageMeta({
  layout: "dashboard",
  title: "Edit Quotation",
});

const route = useRoute();
const router = useRouter();
const { getQuotation, updateQuotation, currentQuotation, isLoading } = useQuotations();
const { confirm } = useConfirm();
const { fetchTaxes } = useFinanceTax();
const { createService } = useServices();

const isServiceModalOpen = ref(false);
const isSubmittingService = ref(false);
const activeItemIndex = ref<number | null>(null);
const serviceError = ref<string | null>(null);
const initialServiceData = ref<{ name: string; code: string } | null>(null);

const quotationId = route.params.id as string;

// Fetch Selector Option Lists
interface ServiceItem {
  id: string;
  name: string;
  code: string;
}

interface CompanyItem {
  id: string;
  name: string;
}

const {
  data: masterData,
  pending: isLoadingMaster,
  refresh,
} = await useAsyncData(
  "quotation-edit-master",
  async () => {
    const [comps, servs, taxesRes, initialPorts, cTypes] = await Promise.all([
      $fetch<CompanyItem[]>("/api/master/companies"),
      $fetch<ServiceItem[]>("/api/master/services"),
      fetchTaxes({ isActive: true }),
      $fetch<Port[]>("/api/master/ports"),
      $fetch<ContainerType[]>("/api/master/container-types"),
    ]);

    const dynamicTaxes = (taxesRes?.items || []).map((t) => ({
      name: `${t.name} (${Number(t.rate)}%)`,
      id: t.id,
      rate: Number(t.rate),
    }));

    return {
      companies: comps || [],
      services: servs || [],
      taxes: [{ name: "0%", id: "", rate: 0 }, ...dynamicTaxes],
      ports: initialPorts || [],
      containerTypes: cTypes || [],
    };
  },
  { server: false },
);

const customers = computed(() => {
  return (masterData.value?.companies || []).map((c) => ({
    id: c.id,
    name: c.name,
  }));
});

const services = computed(() => {
  return (masterData.value?.services || []).map((s) => ({
    id: s.id,
    name: s.name,
  }));
});

const containerTypes = computed(() => {
  return (masterData.value?.containerTypes || []).map((ct) => ({
    id: ct.id,
    name: ct.name,
  }));
});

const FREIGHT_TERMS = [
  { id: "PREPAID", name: "PREPAID" },
  { id: "COLLECT", name: "COLLECT" },
];

const searchedPorts = ref<Port[]>([]);
watch(
  () => masterData.value?.ports,
  (val) => {
    if (val && searchedPorts.value.length === 0) {
      searchedPorts.value = val;
    }
  },
  { immediate: true },
);

const portsPol = computed(() => searchedPorts.value);
const portsPod = computed(() => searchedPorts.value);

async function handleSearchPol(query: string) {
  if (!query) {
    searchedPorts.value = masterData.value?.ports || [];
    return;
  }
  const results = await $fetch<Port[]>(
    `/api/master/ports?q=${encodeURIComponent(query)}&type=ocean`,
  );
  searchedPorts.value = results;
}
const handleSearchPod = handleSearchPol;

// Reactive Form State matching standalone Invoice structure
const formData = reactive({
  customerId: "",
  picName: "",
  pol: "",
  pod: "",
  containerTypeId: "",
  term: "PREPAID",
  date: "",
  validUntil: "",
  freeTime: "",
  salesName: "",
  status: "DRAFT",
  currency: "IDR",
  exchangeRate: 1,
  allowMultipleInvoices: false,
  notes: "",
  charges: [] as Array<QuotationCharge & { tempId: number }>,
});

// Status Options
const STATUS_OPTIONS = [
  { id: "DRAFT", name: "DRAFT" },
  { id: "SENT", name: "SENT (Sent to Client)" },
  { id: "CONFIRMED", name: "CONFIRMED (Approved by Client)" },
  { id: "CANCELLED", name: "CANCELLED" },
  { id: "EXPIRED", name: "EXPIRED" },
];

const isDataLoaded = ref(false);

// Load the quotation data
async function loadQuotation() {
  const res = await getQuotation(quotationId);
  if (res.success && res.data) {
    const q = res.data;
    formData.customerId = q.customerId;
    formData.picName = q.picName || "";
    formData.pol = q.pol || "";
    formData.pod = q.pod || "";
    formData.containerTypeId = q.containerTypeId || "";
    formData.term = q.term || "PREPAID";
    formData.date = q.date ? q.date.split("T")[0] || "" : "";
    formData.validUntil = q.validUntil ? q.validUntil.split("T")[0] || "" : "";
    formData.freeTime = q.freeTime || "";
    formData.salesName = q.salesName || "";
    formData.status = q.status;
    formData.currency = q.currency || "IDR";
    formData.exchangeRate = Number(q.exchangeRate || 1);
    formData.allowMultipleInvoices = Boolean(q.allowMultipleInvoices);
    formData.notes = q.notes || "";

    formData.charges = (q.charges || []).map((ch) => ({
      id: ch.id,
      tempId: Math.random(),
      serviceId: ch.serviceId,
      serviceName: ch.serviceName,
      taxId: ch.taxId || "",
      description: ch.description,
      quantity: Number(ch.quantity || 1),
      unitPrice: Number(ch.unitPrice || 0),
      amount: Number(ch.quantity || 1) * Number(ch.unitPrice || 0),
    }));

    isDataLoaded.value = true;
  } else {
    toast.error("Gagal memuat detail quotation: " + res.error);
    router.push("/operational/quotations");
  }
}

// Is Locked (Converted)
const isLocked = computed(() => formData.status === "CONVERTED");

// Helper to add charge line
function addChargeLine() {
  if (isLocked.value) return;
  formData.charges.push({
    tempId: Date.now() + Math.random(),
    serviceId: "",
    description: "",
    quantity: 1,
    unitPrice: 0,
    taxId: "",
    amount: 0,
  });
}

// Helper to remove charge line
function removeChargeLine(index: number) {
  if (isLocked.value) return;
  if (formData.charges.length > 1) {
    formData.charges.splice(index, 1);
  } else {
    toast.error("Quotation harus memiliki minimal 1 item service.");
  }
}

// Helper to auto-fill description when service changes
function handleServiceChange(index: number, serviceId: string) {
  const selected = masterData.value?.services.find((s) => s.id === serviceId);
  const row = formData.charges[index];
  if (selected && row && !row.description) {
    row.description = selected.name;
  }
}

const isCompanyModalOpen = ref(false);
const presetCompanyName = ref("");

function handleCreateCompany(name: string) {
  presetCompanyName.value = name;
  isCompanyModalOpen.value = true;
}

const onCompanyCreateSuccess = async (company: CompanyItem) => {
  await refresh();
  formData.customerId = company.id;
  isCompanyModalOpen.value = false;
};

// Inline creation of a new service from the Combobox using standard ServiceCreateModal
function handleCreateService(name: string, index: number) {
  initialServiceData.value = {
    name: name,
    code: name.toUpperCase().replace(/\s+/g, "_").substring(0, 10),
  };
  activeItemIndex.value = index;
  isServiceModalOpen.value = true;
}

async function submitServiceForm(modalData: {
  name: string;
  code: string;
  status: string;
  unitId: string;
  categoryId: string;
}) {
  if (!modalData.name || !modalData.code) {
    serviceError.value = "Please fill in all required fields (Name, Code)";
    return;
  }

  isSubmittingService.value = true;
  serviceError.value = null;

  try {
    const payload = {
      name: modalData.name,
      code: modalData.code,
      unitId: modalData.unitId || undefined,
      categoryId: modalData.categoryId || undefined,
      isActive: modalData.status === "Active",
    };

    const res = await createService(payload);

    if (res.success && res.data) {
      // Add the new service to the local services list in masterData
      if (masterData.value) {
        masterData.value.services = [...masterData.value.services, res.data];
      }
      if (activeItemIndex.value !== null) {
        const row = formData.charges[activeItemIndex.value];
        if (row) {
          row.serviceId = res.data.id;
          row.description = res.data.name;
        }
      }
      isServiceModalOpen.value = false;
      toast.success(`Service "${res.data.name}" successfully created!`);
    } else {
      serviceError.value = res.error || "Failed to create service";
    }
  } catch (error: unknown) {
    serviceError.value = (error as Error)?.message || "Failed to create service";
  } finally {
    isSubmittingService.value = false;
  }
}

// Watchers for Currency resetting exchange rate to 1 if IDR
watch(
  () => formData.currency,
  (newCurrency) => {
    if (newCurrency === "IDR") {
      formData.exchangeRate = 1;
    }
  },
);

// Mathematical Calculations
const subTotal = computed(() => {
  const sum = formData.charges.reduce(
    (acc, ch) => acc + Number(ch.quantity || 0) * Number(ch.unitPrice || 0),
    0,
  );
  return formData.currency === "IDR" ? Math.round(sum) : sum;
});

const taxAmount = computed(() => {
  const sum = formData.charges.reduce((acc, ch) => {
    const tax = masterData.value?.taxes.find((t) => t.id === ch.taxId);
    const rate = tax ? tax.rate : 0;
    return acc + Number(ch.quantity || 0) * Number(ch.unitPrice || 0) * (rate / 100);
  }, 0);
  return formData.currency === "IDR" ? Math.round(sum) : sum;
});

const total = computed(() => {
  const sum = subTotal.value + taxAmount.value;
  return formData.currency === "IDR" ? Math.round(sum) : sum;
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat(formData.currency === "IDR" ? "id-ID" : "en-US", {
    style: "currency",
    currency: formData.currency,
    minimumFractionDigits: formData.currency === "IDR" ? 0 : 2,
    maximumFractionDigits: formData.currency === "IDR" ? 0 : 2,
  }).format(amount);
};

const parseInputCurrency = (val: string, currency: string = formData.currency) => {
  if (!val) return 0;
  if (currency === "IDR") {
    const numeric = Number(val.replace(/[^0-9-]/g, ""));
    return isNaN(numeric) ? 0 : numeric;
  }
  let normalized = val;
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
  const numeric = Number(normalized.replace(/[^0-9.-]+/g, ""));
  return isNaN(numeric) ? 0 : numeric;
};

const formatInputCurrency = (val: number | string, currency: string = formData.currency) => {
  if (val === undefined || val === null || val === "") return "";
  const numericVal = typeof val === "string" ? parseInputCurrency(val, currency) : val;
  if (isNaN(numericVal)) return "";
  return new Intl.NumberFormat(currency === "IDR" ? "id-ID" : "en-US", {
    maximumFractionDigits: currency === "IDR" ? 0 : 2,
    minimumFractionDigits: 0,
  }).format(numericVal);
};

// Form Submission
async function handleSubmit() {
  if (isLocked.value) return;

  if (!formData.customerId) {
    toast.error("Silakan pilih Customer/Billing Party terlebih dahulu.");
    return;
  }

  const invalidCharges = formData.charges.some((ch) => !ch.serviceId);
  if (invalidCharges) {
    toast.error("Semua baris service harus memiliki jenis Service.");
    return;
  }

  const calculatedTaxRate = subTotal.value > 0 ? (taxAmount.value / subTotal.value) * 100 : 0;

  const payload = {
    customerId: formData.customerId,
    picName: formData.picName || null,
    pol: formData.pol || null,
    pod: formData.pod || null,
    containerTypeId: formData.containerTypeId || null,
    term: formData.term || null,
    date: formData.date,
    validUntil: formData.validUntil,
    freeTime: formData.freeTime || null,
    salesName: formData.salesName || null,
    status: formData.status,
    notes: formData.notes || null,
    currency: formData.currency,
    exchangeRate: Number(formData.exchangeRate || 1),
    allowMultipleInvoices: formData.allowMultipleInvoices,
    subTotal: subTotal.value,
    taxAmount: calculatedTaxRate,
    taxTotal: taxAmount.value,
    total: total.value,
    charges: formData.charges.map((ch) => ({
      id: ch.id,
      serviceId: ch.serviceId,
      taxId: ch.taxId || null,
      description: ch.description || "Service Item",
      quantity: Number(ch.quantity || 1),
      unitPrice: Number(ch.unitPrice || 0),
      amount: Number(ch.quantity || 1) * Number(ch.unitPrice || 0),
    })),
  };

  const res = await updateQuotation(quotationId, payload);
  if (res.success) {
    toast.success("Quotation berhasil diperbarui.");
    loadQuotation();
  } else {
    toast.error(res.error || "Gagal memperbarui quotation.");
  }
}

onMounted(() => {
  loadQuotation();
});

// Scroll Spy & Navigation for Quotation Edit
const SECTIONS = computed(() => [
  { id: "header-info", label: "Header Information", step: "1" },
  { id: "pricing-info", label: "Service Items & Pricing", step: "2" },
  { id: "remarks-info", label: "Remarks & Terms", step: "3" },
]);

const activeSection = ref("header-info");
const isManualScroll = ref(false);
let manualScrollTimeout: number | null = null;

onMounted(() => {
  const handleScroll = () => {
    if (isManualScroll.value) return;

    // Fallback for bottom of the page
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50) {
      const lastSection = SECTIONS.value[SECTIONS.value.length - 1];
      if (lastSection) activeSection.value = lastSection.id;
      return;
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      if (isManualScroll.value) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id;
        }
      });
    },
    {
      rootMargin: "-160px 0px -40% 0px",
      threshold: 0,
    },
  );

  window.addEventListener("scroll", handleScroll, { passive: true });

  setTimeout(() => {
    SECTIONS.value.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });
  }, 500);

  onUnmounted(() => {
    observer.disconnect();
    window.removeEventListener("scroll", handleScroll);
  });
});

function scrollTo(id: string) {
  isManualScroll.value = true;
  activeSection.value = id;

  if (manualScrollTimeout) clearTimeout(manualScrollTimeout);
  manualScrollTimeout = window.setTimeout(() => {
    isManualScroll.value = false;
  }, 1000);

  const el = document.getElementById(id);
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 160;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <!-- Sticky Header -->
    <div
      class="sticky top-16 z-[900] -mx-6 -mt-6 px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm transition-all duration-200"
    >
      <header class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <NuxtLink
            to="/operational/quotations"
            class="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft class="w-5 h-5" />
          </NuxtLink>
          <div class="flex items-center gap-3">
            <h1 class="text-xl font-bold flex items-center gap-2 text-foreground">
              <Calculator class="w-5 h-5 text-[#062c58]" />
              Quotation #{{ currentQuotation?.number || "Detail" }}
            </h1>
            <span
              v-if="isLocked"
              class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider"
            >
              <Lock class="w-3 h-3 mr-1" />
              Locked / Converted
            </span>

            <div class="h-4 w-[1px] bg-border mx-1"></div>
            <!-- Currency selector inside top bar -->
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
                >Currency</span
              >
              <div class="flex border border-border rounded-lg overflow-hidden bg-white">
                <button
                  type="button"
                  :disabled="isLocked"
                  @click="formData.currency = 'IDR'"
                  class="px-3 py-1 text-[10px] font-bold transition-colors disabled:opacity-50"
                  :class="
                    formData.currency === 'IDR'
                      ? 'bg-[#062c58] text-white'
                      : 'hover:bg-gray-50 text-muted-foreground'
                  "
                >
                  IDR
                </button>
                <button
                  type="button"
                  :disabled="isLocked"
                  @click="formData.currency = 'USD'"
                  class="px-3 py-1 text-[10px] font-bold border-l border-border transition-colors disabled:opacity-50"
                  :class="
                    formData.currency === 'USD'
                      ? 'bg-[#062c58] text-white'
                      : 'hover:bg-gray-50 text-muted-foreground'
                  "
                >
                  USD
                </button>
              </div>
            </div>

            <!-- Multi Invoice Switch -->
            <div class="flex items-center gap-2 ml-4">
              <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
                >Multi-use</span
              >
              <button
                type="button"
                :disabled="isLocked"
                @click="formData.allowMultipleInvoices = !formData.allowMultipleInvoices"
                :class="[
                  'relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none border disabled:cursor-not-allowed disabled:opacity-50',
                  formData.allowMultipleInvoices
                    ? 'bg-[#062c58] border-[#062c58]'
                    : 'bg-gray-200 border-border',
                ]"
                role="switch"
                :aria-checked="formData.allowMultipleInvoices"
                title="Aktifkan agar quotation ini bisa dijadikan invoice berkali-kali"
              >
                <span
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform',
                    formData.allowMultipleInvoices ? 'translate-x-4' : 'translate-x-0.5',
                  ]"
                />
              </button>
              <span
                class="text-[10px] font-bold"
                :class="formData.allowMultipleInvoices ? 'text-[#062c58]' : 'text-muted-foreground'"
              >
                {{ formData.allowMultipleInvoices ? "ON" : "OFF" }}
              </span>
            </div>

            <!-- Exchange Rate inside top bar -->
            <div
              v-if="formData.currency === 'USD'"
              class="flex items-center gap-2 animate-in slide-in-from-left-2 duration-300 ml-2"
            >
              <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
                >Ex. Rate</span
              >
              <input
                type="text"
                :disabled="isLocked"
                :value="formatInputCurrency(formData.exchangeRate, 'IDR')"
                v-uppercase
                @input="
                  (e) =>
                    (formData.exchangeRate = parseInputCurrency(
                      (e.target as HTMLInputElement).value,
                      'IDR',
                    ))
                "
                class="w-28 h-7 px-3 py-1 text-xs font-bold text-[#062c58] border border-border rounded-lg focus:ring-2 focus:ring-[#062c58]/10 focus:border-[#062c58] outline-none transition-all bg-white disabled:bg-gray-50 disabled:opacity-75"
                placeholder="16,000"
              />
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            type="button"
            @click="router.push('/operational/quotations')"
            class="btn-outline flex-1 sm:flex-none justify-center sm:justify-start px-4 h-10 font-semibold"
          >
            Back
          </button>

          <button
            v-if="!isLocked"
            type="button"
            @click="handleSubmit"
            class="bg-[#062c58] hover:bg-[#062c58]/90 text-white h-10 px-8 rounded-lg font-bold text-sm shadow-lg shadow-[#062c58]/10 transition-all active:scale-95 flex items-center gap-2"
            :disabled="isLoading"
          >
            <Save class="w-4 h-4 mr-1" />
            {{ isLoading ? "Saving..." : "Save Changes" }}
          </button>
        </div>
      </header>
    </div>

    <div class="flex gap-8 relative items-start">
      <!-- Sidebar Navigation -->
      <aside class="w-60 shrink-0 hidden lg:block sticky top-36 h-fit">
        <nav class="space-y-2">
          <button
            v-for="section in SECTIONS"
            :key="section.id"
            @click="scrollTo(section.id)"
            class="w-full flex items-center gap-3.5 px-4 py-3 text-[14px] font-semibold rounded-xl transition-all text-left border group"
            :class="[
              activeSection === section.id
                ? 'bg-blue-50/60 border-[#062c58]/20 text-[#062c58] shadow-sm'
                : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground border-transparent hover:border-border/50',
            ]"
          >
            <span
              class="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black border transition-all duration-300"
              :class="
                activeSection === section.id
                  ? 'bg-[#062c58] text-white border-[#062c58] scale-110 shadow-md'
                  : 'border-muted-foreground/30 group-hover:border-foreground/40'
              "
            >
              {{ section.step }}
            </span>
            <span class="truncate">{{ section.label }}</span>
          </button>
        </nav>
      </aside>

      <!-- Main Form Content -->
      <main id="main-scroll-container" class="flex-1 w-full min-w-0">
        <div class="max-w-6xl mx-auto space-y-6 pb-20">
          <div
            v-if="isLoadingMaster || !isDataLoaded"
            class="text-center text-muted-foreground py-12"
          >
            Loading quotation details...
          </div>
          <div v-else class="space-y-6">
            <!-- Billing Info section card -->
            <SectionCard id="header-info" title="Header & Customer Information" :icon="Building2">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <!-- To Customer -->
                <div class="space-y-2 col-span-1 md:col-span-2">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                  >
                    To Customer <span class="text-rose-500">*</span>
                  </label>
                  <Combobox
                    v-model="formData.customerId"
                    :options="customers"
                    :disabled="isLocked"
                    placeholder="Search or select Customer..."
                    allow-create
                    @create="handleCreateCompany"
                  />
                </div>

                <!-- PIC Customer -->
                <div class="space-y-2">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                    >PIC Customer</label
                  >
                  <input
                    v-model="formData.picName"
                    v-uppercase
                    type="text"
                    :disabled="isLocked"
                    placeholder="e.g. John Doe"
                    class="w-full px-3 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#062c58] shadow-sm h-10 disabled:bg-gray-50 disabled:opacity-75"
                  />
                </div>

                <!-- Sales Name -->
                <div class="space-y-2">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                    >Sales Representative</label
                  >
                  <input
                    v-model="formData.salesName"
                    v-uppercase
                    type="text"
                    :disabled="isLocked"
                    placeholder="e.g. Jane Smith"
                    class="w-full px-3 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#062c58] shadow-sm h-10 disabled:bg-gray-50 disabled:opacity-75"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
                <!-- Port of Loading (POL) -->
                <div class="space-y-2">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                  >
                    Port of Loading (POL)
                  </label>
                  <Combobox
                    v-model="formData.pol"
                    :options="portsPol"
                    label-key="name"
                    value-key="code"
                    :disabled="isLocked"
                    placeholder="Search or select POL..."
                    @search="handleSearchPol"
                  />
                </div>

                <!-- Port of Discharge (POD) -->
                <div class="space-y-2">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                  >
                    Port of Discharge (POD)
                  </label>
                  <Combobox
                    v-model="formData.pod"
                    :options="portsPod"
                    label-key="name"
                    value-key="code"
                    :disabled="isLocked"
                    placeholder="Search or select POD..."
                    @search="handleSearchPod"
                  />
                </div>

                <!-- Container Type -->
                <div class="space-y-2">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                  >
                    Container Type
                  </label>
                  <Combobox
                    v-model="formData.containerTypeId"
                    :options="containerTypes"
                    :disabled="isLocked"
                    placeholder="Search or select Container Type..."
                  />
                </div>

                <!-- Term -->
                <div class="space-y-2">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                  >
                    Term
                  </label>
                  <Combobox
                    v-model="formData.term"
                    :options="FREIGHT_TERMS"
                    :disabled="isLocked"
                    placeholder="Select Term..."
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
                <!-- Quotation Date -->
                <div class="space-y-2">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                    >Quotation Date</label
                  >
                  <DatePicker v-model="formData.date" :disabled="isLocked" />
                </div>

                <!-- Validity Rate Date -->
                <div class="space-y-2">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                    >Validity Rate (Until)</label
                  >
                  <DatePicker v-model="formData.validUntil" :disabled="isLocked" />
                </div>

                <!-- Free Time -->
                <div class="space-y-2">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                    >Free Time</label
                  >
                  <input
                    v-model="formData.freeTime"
                    v-uppercase
                    type="text"
                    :disabled="isLocked"
                    placeholder="e.g. 14 Days"
                    class="w-full px-3 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#062c58] shadow-sm h-10 disabled:bg-gray-50 disabled:opacity-75"
                  />
                </div>

                <!-- Status Select -->
                <div class="space-y-2">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                    >Status</label
                  >
                  <Combobox v-if="!isLocked" v-model="formData.status" :options="STATUS_OPTIONS" />
                  <div v-else class="h-10 flex items-center">
                    <span
                      class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200"
                    >
                      CONVERTED (Locked)
                    </span>
                  </div>
                </div>
              </div>
            </SectionCard>

            <!-- Items/Services Section -->
            <SectionCard
              id="pricing-info"
              title="Service Items & Pricing"
              :icon="Calculator"
              no-padding
            >
              <div class="p-6 pb-0 flex items-center justify-between">
                <span class="text-xs font-semibold text-muted-foreground"
                  >List of quotation services & charges</span
                >
                <button
                  v-if="!isLocked"
                  type="button"
                  @click="addChargeLine"
                  class="inline-flex items-center gap-1.5 text-xs font-bold text-[#062c58] hover:bg-blue-50/50 px-3 py-1.5 rounded-lg border border-blue-100 transition-colors"
                >
                  <Plus class="w-3.5 h-3.5" /> Add Service Line
                </button>
              </div>

              <div class="border-t border-b border-border bg-muted/5 mt-4">
                <!-- Header -->
                <div
                  class="grid grid-cols-12 gap-3 px-6 py-2 bg-gray-50/50 text-[10px] font-bold text-muted-foreground uppercase tracking-wider"
                >
                  <div class="col-span-5">Service / Description</div>
                  <div class="col-span-1 text-center">Quantity</div>
                  <div class="col-span-3 text-right">Unit Price</div>
                  <div class="col-span-2 text-right pr-4">Tax</div>
                  <div class="col-span-1"></div>
                </div>

                <!-- Body -->
                <div class="divide-y divide-border/50">
                  <div
                    v-for="(ch, idx) in formData.charges"
                    :key="ch.tempId"
                    class="grid grid-cols-12 gap-3 px-6 py-4 items-start group hover:bg-white transition-colors relative"
                    :style="{ zIndex: formData.charges.length + 10 - idx }"
                  >
                    <!-- Service dropdown and Description -->
                    <div class="col-span-5 space-y-2">
                      <Combobox
                        v-model="ch.serviceId"
                        :options="services"
                        :disabled="isLocked"
                        placeholder="Choose service..."
                        allow-create
                        @create="(name) => handleCreateService(name, idx)"
                        @update:model-value="(val) => handleServiceChange(idx, val as string)"
                      />
                      <textarea
                        v-model="ch.description"
                        v-uppercase
                        placeholder="Item description..."
                        :disabled="isLocked"
                        rows="1"
                        class="w-full px-3 py-2 bg-white border border-border rounded-lg text-xs focus:ring-1 focus:ring-[#062c58] outline-none transition-all resize-none shadow-sm min-h-9 disabled:bg-gray-50 disabled:opacity-75"
                      ></textarea>
                    </div>

                    <!-- Quantity -->
                    <div class="col-span-1">
                      <input
                        type="number"
                        v-model.number="ch.quantity"
                        min="1"
                        :disabled="isLocked"
                        class="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm focus:ring-1 focus:ring-[#062c58] outline-none transition-all shadow-sm h-10 text-center disabled:bg-gray-50 disabled:opacity-75"
                        v-uppercase
                      />
                    </div>

                    <!-- Unit Price -->
                    <div class="col-span-3">
                      <div class="relative">
                        <span
                          class="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-[10px] font-bold pr-1 border-r border-border mr-1 select-none"
                        >
                          {{ formData.currency }}
                        </span>
                        <input
                          type="text"
                          :disabled="isLocked"
                          :value="formatInputCurrency(ch.unitPrice)"
                          v-uppercase
                          @input="
                            (e) =>
                              (ch.unitPrice = parseInputCurrency(
                                (e.target as HTMLInputElement).value,
                              ))
                          "
                          class="w-full pl-12 pr-3 py-2 bg-white border border-border rounded-lg text-sm text-right font-semibold focus:ring-1 focus:ring-[#062c58] outline-none transition-all shadow-sm h-10 disabled:bg-gray-50 disabled:opacity-75"
                        />
                      </div>
                      <p class="text-[9px] text-right mt-1.5 font-bold text-muted-foreground">
                        Sub:
                        {{ formatCurrency(Number(ch.quantity || 1) * Number(ch.unitPrice || 0)) }}
                      </p>
                    </div>

                    <!-- Tax select -->
                    <div class="col-span-2 flex flex-col items-end pr-4">
                      <Combobox
                        v-model="ch.taxId"
                        :options="masterData?.taxes || []"
                        :disabled="isLocked"
                        placeholder="Tax..."
                        class="w-full h-10"
                      />
                      <p class="text-[9px] text-right mt-1.5 font-bold text-slate-400">
                        Tax:
                        {{
                          formatCurrency(
                            Number(ch.quantity || 1) *
                              Number(ch.unitPrice || 0) *
                              ((masterData?.taxes.find((t) => t.id === ch.taxId)?.rate || 0) / 100),
                          )
                        }}
                      </p>
                    </div>

                    <!-- Delete line -->
                    <div class="col-span-1 flex justify-end">
                      <button
                        v-if="!isLocked"
                        type="button"
                        @click="removeChargeLine(idx)"
                        class="p-2 text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-30"
                        :disabled="formData.charges.length === 1"
                      >
                        <Trash2 class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Total summary block -->
              <div class="flex justify-end p-6">
                <div class="w-80 space-y-3 bg-gray-50/50 p-5 rounded-xl border border-border">
                  <div class="flex justify-between text-sm">
                    <span class="text-muted-foreground font-medium">Subtotal</span>
                    <span class="font-bold text-foreground">{{ formatCurrency(subTotal) }}</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-muted-foreground font-medium">Total Tax</span>
                    <span class="font-bold text-foreground">{{ formatCurrency(taxAmount) }}</span>
                  </div>
                  <div class="flex justify-between border-t border-border pt-3 mt-3">
                    <span class="font-bold text-[#062c58] text-base">Grand Total</span>
                    <span class="font-extrabold text-[#062c58] text-xl">{{
                      formatCurrency(total)
                    }}</span>
                  </div>
                  <div
                    v-if="formData.currency === 'USD'"
                    class="flex justify-between border-t border-border/50 pt-2.5 mt-1.5 italic"
                  >
                    <span class="text-[10px] font-bold text-muted-foreground uppercase"
                      >IDR Equivalent</span
                    >
                    <span class="text-[10px] font-black text-[#062c58]">
                      {{
                        new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(total * formData.exchangeRate)
                      }}
                    </span>
                  </div>
                </div>
              </div>
            </SectionCard>

            <!-- Remarks Textarea paling bawah -->
            <SectionCard id="remarks-info" title="Remarks & Internal Terms" :icon="FileText">
              <textarea
                v-model="formData.notes"
                v-uppercase
                rows="3"
                :disabled="isLocked"
                placeholder="Tulis detail catatan, remarks, atau syarat & ketentuan penawaran harga di sini..."
                class="w-full p-4 text-sm border border-border rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-[#062c58] shadow-sm resize-none disabled:bg-gray-50 disabled:opacity-75"
              ></textarea>
            </SectionCard>
          </div>
        </div>
      </main>
    </div>

    <!-- Service Creation Modal -->
    <ServiceCreateModal
      :is-open="isServiceModalOpen"
      :is-submitting="isSubmittingService"
      :error="serviceError"
      :initial-data="initialServiceData"
      @update:is-open="(val) => (isServiceModalOpen = val)"
      @submit="submitServiceForm"
    />

    <!-- Company Creation Modal -->
    <CompanyCreateModal
      v-model="isCompanyModalOpen"
      :preset-name="presetCompanyName"
      @success="onCompanyCreateSuccess"
    />
  </div>
</template>
