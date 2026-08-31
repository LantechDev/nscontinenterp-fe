<script setup lang="ts">
import { ArrowLeft, Save, FileText, Building2, X, Loader2 } from "lucide-vue-next";
import Combobox from "~/components/ui/Combobox.vue";
import DatePicker from "~/components/ui/DatePicker.vue";
import SectionCard from "~/pages/operational/jobs/components/SectionCard.vue";
import { useQuotations } from "~/composables/useQuotations";
import CompanyCreateModal from "~/pages/master/company/components/CompanyCreateModal.vue";
import type { Port, ContainerType } from "~/composables/useMasterData";
import {
  getQuotationContainerTypeOptions,
  getQuotationPortSearchType,
  isQuotationAirFreight,
  normalizeQuotationServiceMode,
} from "~/utils/quotationRouteOptions";
import { toast } from "vue-sonner";

definePageMeta({
  layout: "dashboard",
  title: "Create Quotation",
});

const { createQuotation, getQuotation, isLoading } = useQuotations();
const router = useRouter();

// Fetch Selector Option Lists
interface CompanyItem {
  id: string;
  name: string;
}

const {
  data: masterData,
  pending: isLoadingMaster,
  refresh,
} = useAsyncData(
  "quotation-create-master",
  async () => {
    const [comps, initialPorts, cTypes] = await Promise.all([
      $fetch<CompanyItem[]>("/api/master/companies"),
      $fetch<Port[]>("/api/master/ports"),
      $fetch<ContainerType[]>("/api/master/container-types"),
    ]);

    return {
      companies: comps || [],
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

const containerTypes = computed(() => {
  return getQuotationContainerTypeOptions({
    serviceType: formData.serviceType,
    shipmentType: formData.shipmentType,
    containerTypes: masterData.value?.containerTypes || [],
  });
});

const truckContainerTypes = computed(() => {
  const list = masterData.value?.containerTypes || [];
  const targetCodes = ["CDE", "CDD", "CDD_LONG", "WING_BOX", "20FT", "40FT", "40HC"];
  const customNames: Record<string, string> = {
    CDE: "CDE",
    CDD: "CDD",
    CDD_LONG: "CDD Long",
    WING_BOX: "Wing Box",
    "20FT": "20 FT",
    "40FT": "40 FT",
    "40HC": "40 HC",
  };

  return targetCodes.map((code) => {
    const found = list.find((ct) => ct.code === code);
    return {
      id: found?.id || code,
      name: customNames[code] || found?.name || code,
    };
  });
});

const TRUCK_TYPES = [
  "BLIND VAN",
  "CDE",
  "CDD",
  "CDD LONG",
  "FUSO",
  "WING BOX",
  "20FT",
  "40FT/HC",
  "45HC",
];

const TRADE_TYPES = [
  { id: "EXPORT", name: "Export" },
  { id: "IMPORT", name: "Import" },
  { id: "DOMESTIC", name: "Domestic" },
];

const SERVICE_TYPES = [
  { id: "OCEAN", name: "FREIGHT" },
  { id: "AIR", name: "AIR FREIGHT" },
  { id: "TRUCKING", name: "TRUCKING" },
  { id: "CUSTOM_CLEARANCE", name: "CUSTOM CLEARANCE" },
];

const SHIPMENT_TYPES = [{ id: "OCEAN", name: "Ocean Freight" }];

const FREIGHT_TERMS = [
  { id: "PREPAID", name: "PREPAID" },
  { id: "COLLECT", name: "COLLECT" },
];

const searchedPorts = ref<Port[]>([]);
const uppercase = (value: string) => value.toUpperCase();
const uppercasePort = (port: Port): Port => ({
  ...port,
  code: uppercase(port.code || ""),
  name: uppercase(port.name || ""),
});

watch(
  () => masterData.value?.ports,
  (val) => {
    if (val && searchedPorts.value.length === 0) {
      searchedPorts.value = val.map(uppercasePort);
    }
  },
  { immediate: true },
);

const portsPol = computed(() => searchedPorts.value);
const portsPod = computed(() => searchedPorts.value);
const isOceanService = computed(() => formData.serviceType === "OCEAN");
const isAir = computed(() =>
  isQuotationAirFreight({ serviceType: formData.serviceType, shipmentType: formData.shipmentType }),
);
const isTrucking = computed(() => formData.serviceType === "TRUCKING");
const isCustomClearance = computed(() => formData.serviceType === "CUSTOM_CLEARANCE");
const usesPortRoute = computed(
  () => isOceanService.value || isAir.value || isCustomClearance.value,
);
const portSearchType = computed(() =>
  getQuotationPortSearchType({
    serviceType: formData.serviceType,
    shipmentType: formData.shipmentType,
  }),
);

async function handleSearchPol(query: string) {
  if (!query) {
    const results = await $fetch<Port[]>(`/api/master/ports?type=${portSearchType.value}`);
    searchedPorts.value = results.map(uppercasePort);
    return;
  }
  const results = await $fetch<Port[]>(
    `/api/master/ports?q=${encodeURIComponent(uppercase(query))}&type=${portSearchType.value}`,
  );
  searchedPorts.value = results.map(uppercasePort);
}
const handleSearchPod = handleSearchPol;

const today = new Date();
const nextMonth = new Date();
nextMonth.setDate(today.getDate() + 30);

const formatDateString = (d: Date) => d.toISOString().split("T")[0];

// Reactive Form State matching standalone Invoice structure
const formData = reactive({
  customerId: "",
  picName: "",
  tradeTypeId: "EXPORT",
  serviceType: "OCEAN",
  shipmentType: "OCEAN",
  pol: "",
  pod: "",
  containerTypeId: "",
  truckType: "",
  pickupAddress: "",
  deliveryAddress: "",
  pickupDate: "",
  deliveryDate: "",
  term: "PREPAID",
  date: formatDateString(today),
  validUntil: formatDateString(nextMonth),
  freeTime: "14 Days",
  salesName: "",
  currency: "IDR",
  exchangeRate: 1,
  allowMultipleInvoices: false,
  notes: "",
});

const route = useRoute();

// ============================================
// COPY QUOTATION FEATURE - Prefill form from existing quotation
// ============================================
watch(
  () => route.query.copyFrom,
  async (copyFrom) => {
    if (copyFrom && typeof copyFrom === "string") {
      const res = await getQuotation(copyFrom);
      if (res.success && res.data) {
        const q = res.data;
        const normalizedMode = normalizeQuotationServiceMode({
          serviceType: q.serviceType,
          shipmentType: q.shipmentType,
        });

        formData.customerId = q.customerId;
        formData.picName = q.picName || "";
        formData.tradeTypeId = q.tradeTypeId || "EXPORT";
        formData.serviceType = normalizedMode.serviceType;
        formData.shipmentType =
          normalizedMode.serviceType === "OCEAN" ? "OCEAN" : normalizedMode.shipmentType;
        formData.pol = q.pol || "";
        formData.pod = q.pod || "";
        formData.containerTypeId = q.containerTypeId || "";
        formData.truckType = q.truckType || "";
        formData.pickupAddress = q.pickupAddress || "";
        formData.deliveryAddress = q.deliveryAddress || "";
        formData.pickupDate = q.pickupDate ? q.pickupDate.split("T")[0] || "" : "";
        formData.deliveryDate = q.deliveryDate ? q.deliveryDate.split("T")[0] || "" : "";
        formData.term = q.term || "PREPAID";

        // Reset dates for a new proposal
        const copyDate = new Date();
        const copyValidUntil = new Date();
        copyValidUntil.setDate(copyDate.getDate() + 30);
        formData.date = formatDateString(copyDate);
        formData.validUntil = formatDateString(copyValidUntil);

        formData.freeTime = q.freeTime || "";
        formData.salesName = q.salesName || "";
        formData.currency = q.currency || "IDR";
        formData.exchangeRate = Number(q.exchangeRate || 1);
        formData.allowMultipleInvoices = Boolean(q.allowMultipleInvoices);
        formData.notes = q.notes || "";

        // Fetch and merge selected POL/POD to ensure they are available in dropdown options
        const portQueries = [];
        const portSearchTypeVal = getQuotationPortSearchType(normalizedMode);
        if (q.pol) {
          portQueries.push(
            $fetch<Port[]>(`/api/master/ports`, {
              params: { q: q.pol, type: portSearchTypeVal },
            }).catch(() => []),
          );
        }
        if (q.pod) {
          portQueries.push(
            $fetch<Port[]>(`/api/master/ports`, {
              params: { q: q.pod, type: portSearchTypeVal },
            }).catch(() => []),
          );
        }

        if (portQueries.length > 0) {
          const fetched = await Promise.all(portQueries);
          const flatPorts = fetched.flat().map(uppercasePort);
          const existingCodes = new Set(searchedPorts.value.map((p) => p.code));
          flatPorts.forEach((port) => {
            if (!existingCodes.has(port.code)) {
              searchedPorts.value.push(port);
            }
          });
        }

        toast.success("Quotation copied as template. Review all fields before creating.");
      }
    }
  },
  { immediate: true },
);

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

watch(
  () => formData.serviceType,
  (serviceType) => {
    if (serviceType === "OCEAN") {
      formData.shipmentType = "OCEAN";
      formData.truckType = "";
      formData.pickupAddress = "";
      formData.deliveryAddress = "";
      formData.pickupDate = "";
      formData.deliveryDate = "";
      return;
    }
    if (serviceType === "AIR") {
      formData.shipmentType = "AIR";
      formData.containerTypeId = "AIR_AIR";
      formData.truckType = "";
      formData.pickupAddress = "";
      formData.deliveryAddress = "";
      formData.pickupDate = "";
      formData.deliveryDate = "";
      return;
    }
    if (serviceType === "TRUCKING") {
      formData.shipmentType = "";
      formData.pol = "";
      formData.pod = "";
      return;
    }

    if (serviceType === "CUSTOM_CLEARANCE") {
      formData.shipmentType = "";
      formData.containerTypeId = "";
      formData.truckType = "";
      formData.pickupAddress = "";
      formData.deliveryAddress = "";
      formData.pickupDate = "";
      formData.deliveryDate = "";
    }
  },
);

watch(
  () => formData.shipmentType,
  async (shipmentType) => {
    if (usesPortRoute.value) {
      const results = await $fetch<Port[]>(`/api/master/ports?type=${portSearchType.value}`);
      searchedPorts.value = results.map(uppercasePort);
    }
  },
);

// Scroll Spy & Navigation for Quotation Creation
const SECTIONS = computed(() => [
  { id: "header-info", label: "Header Information", step: "1" },
  { id: "remarks-info", label: "Remarks & Terms", step: "2" },
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
  }, 100);

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

// Form Submission
async function handleSubmit() {
  if (!formData.customerId) {
    toast.error("Silakan pilih Customer/Billing Party terlebih dahulu.");
    return;
  }

  if (usesPortRoute.value && !formData.pol) {
    toast.error("Silakan isi origin/POL terlebih dahulu.");
    return;
  }

  if (usesPortRoute.value && !formData.pod) {
    toast.error("Silakan isi destination/POD terlebih dahulu.");
    return;
  }

  if (isTrucking.value && (!formData.pickupAddress || !formData.deliveryAddress)) {
    toast.error("Silakan isi pickup dan delivery address untuk trucking.");
    return;
  }

  const payload = {
    customerId: formData.customerId,
    picName: formData.picName ? uppercase(formData.picName) : null,
    tradeTypeId: formData.tradeTypeId,
    serviceType: formData.serviceType,
    shipmentType:
      (isOceanService.value || isAir.value) && formData.shipmentType ? formData.shipmentType : null,
    pol: usesPortRoute.value && formData.pol ? uppercase(formData.pol) : null,
    pod: usesPortRoute.value && formData.pod ? uppercase(formData.pod) : null,
    containerTypeId:
      (isOceanService.value || isAir.value || isTrucking.value) && formData.containerTypeId
        ? formData.containerTypeId
        : null,
    truckType: isTrucking.value && formData.truckType ? formData.truckType : null,
    pickupAddress:
      isTrucking.value && formData.pickupAddress ? uppercase(formData.pickupAddress) : null,
    deliveryAddress:
      isTrucking.value && formData.deliveryAddress ? uppercase(formData.deliveryAddress) : null,
    pickupDate: isTrucking.value && formData.pickupDate ? formData.pickupDate : null,
    deliveryDate: isTrucking.value && formData.deliveryDate ? formData.deliveryDate : null,
    term: formData.term || null,
    date: formData.date || "",
    validUntil: formData.validUntil || "",
    freeTime: formData.freeTime ? uppercase(formData.freeTime) : null,
    salesName: formData.salesName ? uppercase(formData.salesName) : null,
    notes: formData.notes ? uppercase(formData.notes) : null,
    currency: formData.currency,
    exchangeRate: Number(formData.exchangeRate || 1),
    allowMultipleInvoices: formData.allowMultipleInvoices,
    taxId: null,
    subTotal: 0,
    taxAmount: 0,
    taxTotal: 0,
    total: 0,
    charges: [],
  };

  const res = await createQuotation(payload);
  if (res.success && res.data) {
    toast.success("Quotation berhasil dibuat.");
    router.push("/operational/quotations");
  } else {
    toast.error(res.error || "Gagal membuat quotation.");
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
              Create Quotation
            </h1>
            <div class="h-4 w-[1px] bg-border mx-1"></div>

            <!-- Multi-use switch -->
            <div class="flex items-center gap-2 ml-2">
              <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
                >Multi-use</span
              >
              <button
                type="button"
                @click="formData.allowMultipleInvoices = !formData.allowMultipleInvoices"
                :class="[
                  'relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none border',
                  formData.allowMultipleInvoices
                    ? 'bg-[#062c58] border-[#062c58]'
                    : 'bg-gray-200 border-border',
                ]"
                role="switch"
                :aria-checked="formData.allowMultipleInvoices"
                title="Aktifkan agar quotation ini bisa dipakai berkali-kali"
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
          </div>
        </div>
        <div class="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            type="button"
            @click="router.back()"
            class="btn-outline flex-1 sm:flex-none justify-center sm:justify-start px-4 h-10 font-semibold"
            :disabled="isLoading"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="handleSubmit"
            class="bg-[#062c58] hover:bg-[#062c58]/90 text-white h-10 px-8 rounded-lg font-bold text-sm shadow-lg shadow-[#062c58]/10 transition-all active:scale-95 flex items-center gap-2"
            :disabled="isLoading"
          >
            <Save class="w-4 h-4 mr-1" />
            {{ isLoading ? "Saving..." : "Save" }}
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
          <UiLoadingSkeleton v-if="isLoadingMaster" variant="form" />
          <div v-else class="space-y-6">
            <!-- Billing Info section card -->
            <SectionCard id="header-info" title="Header & Customer Information" :icon="Building2">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- To Customer -->
                <div class="space-y-2">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                  >
                    To Customer <span class="text-rose-500">*</span>
                  </label>
                  <Combobox
                    v-model="formData.customerId"
                    :options="customers"
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
                    placeholder="e.g. John Doe"
                    class="w-full px-3 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#062c58] shadow-sm h-10"
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
                    placeholder="e.g. Jane Smith"
                    class="w-full px-3 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#062c58] shadow-sm h-10"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div class="space-y-2">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                  >
                    Trade Type
                  </label>
                  <Combobox
                    v-model="formData.tradeTypeId"
                    :options="TRADE_TYPES"
                    placeholder="Select trade type..."
                  />
                </div>

                <div class="space-y-2">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                  >
                    Service Type
                  </label>
                  <Combobox
                    v-model="formData.serviceType"
                    :options="SERVICE_TYPES"
                    placeholder="Select service type..."
                  />
                </div>

                <div v-if="isOceanService || isAir" class="space-y-2">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                  >
                    Shipment Type
                  </label>
                  <Combobox
                    v-model="formData.shipmentType"
                    :options="SHIPMENT_TYPES"
                    placeholder="Select shipment type..."
                  />
                </div>
              </div>

              <div v-if="usesPortRoute" class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
                <div class="space-y-2">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                  >
                    {{
                      isCustomClearance
                        ? "Clearance Origin / Port"
                        : isAir
                          ? "Origin Airport"
                          : "Port of Loading (POL)"
                    }}
                  </label>
                  <Combobox
                    v-model="formData.pol"
                    :options="portsPol"
                    label-key="name"
                    value-key="code"
                    :placeholder="
                      isAir ? 'Search or select origin airport...' : 'Search or select POL...'
                    "
                    :filter-local="false"
                    @search="handleSearchPol"
                  />
                </div>

                <div class="space-y-2">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                  >
                    {{
                      isCustomClearance
                        ? "Clearance Destination / Port"
                        : isAir
                          ? "Destination Airport"
                          : "Port of Discharge (POD)"
                    }}
                  </label>
                  <Combobox
                    v-model="formData.pod"
                    :options="portsPod"
                    label-key="name"
                    value-key="code"
                    :placeholder="
                      isAir ? 'Search or select destination airport...' : 'Search or select POD...'
                    "
                    :filter-local="false"
                    @search="handleSearchPod"
                  />
                </div>

                <div v-if="isOceanService" class="space-y-2">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                  >
                    Container Type
                  </label>
                  <Combobox
                    v-model="formData.containerTypeId"
                    :options="containerTypes"
                    placeholder="Search or select Container Type..."
                  />
                </div>

                <div class="space-y-2">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                  >
                    Term
                  </label>
                  <Combobox
                    v-model="formData.term"
                    :options="FREIGHT_TERMS"
                    placeholder="Select Term..."
                  />
                </div>
              </div>

              <div v-if="isTrucking" class="grid grid-cols-1 md:grid-cols-5 gap-6 mt-6">
                <div class="space-y-2">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                    >Truck Type</label
                  >
                  <Combobox
                    v-model="formData.truckType"
                    :options="TRUCK_TYPES.map((t) => ({ id: t, name: t }))"
                    placeholder="Search or select truck type..."
                  />
                </div>

                <div class="space-y-2">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                    >Container Type</label
                  >
                  <Combobox
                    v-model="formData.containerTypeId"
                    :options="truckContainerTypes"
                    placeholder="Select..."
                  />
                </div>

                <div class="space-y-2">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                    >Pickup Date</label
                  >
                  <DatePicker v-model="formData.pickupDate" />
                </div>

                <div class="space-y-2">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                    >Delivery Date</label
                  >
                  <DatePicker v-model="formData.deliveryDate" />
                </div>

                <div class="space-y-2">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                  >
                    Term
                  </label>
                  <Combobox
                    v-model="formData.term"
                    :options="FREIGHT_TERMS"
                    placeholder="Select Term..."
                  />
                </div>
              </div>

              <div v-if="isTrucking" class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div class="space-y-2">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                    >Pickup Address</label
                  >
                  <textarea
                    v-model="formData.pickupAddress"
                    v-uppercase
                    rows="1"
                    placeholder="Full pickup address..."
                    class="input-field py-3 min-h-[44px] h-11 resize-none"
                  ></textarea>
                </div>

                <div class="space-y-2">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                    >Delivery Address</label
                  >
                  <textarea
                    v-model="formData.deliveryAddress"
                    v-uppercase
                    rows="1"
                    placeholder="Full delivery destination..."
                    class="input-field py-3 min-h-[44px] h-11 resize-none"
                  ></textarea>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <!-- Quotation Date -->
                <div class="space-y-2">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                    >Quotation Date</label
                  >
                  <DatePicker v-model="formData.date" />
                </div>

                <!-- Validity Rate Date -->
                <div class="space-y-2">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                    >Validity Rate (Until)</label
                  >
                  <DatePicker v-model="formData.validUntil" />
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
                    placeholder="e.g. 14 Days"
                    class="w-full px-3 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#062c58] shadow-sm h-10"
                  />
                </div>
              </div>
            </SectionCard>

            <!-- Remarks Textarea paling bawah -->
            <SectionCard id="remarks-info" title="Remarks & Internal Terms" :icon="FileText">
              <textarea
                v-model="formData.notes"
                v-uppercase
                rows="3"
                placeholder="Tulis detail catatan, remarks, atau syarat & ketentuan penawaran harga di sini..."
                class="w-full p-4 text-sm border border-border rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-[#062c58] shadow-sm resize-none"
              ></textarea>
            </SectionCard>
          </div>
        </div>
      </main>
    </div>

    <!-- Company Creation Modal -->
    <CompanyCreateModal
      v-model="isCompanyModalOpen"
      :preset-name="presetCompanyName"
      @success="onCompanyCreateSuccess"
    />
  </div>
</template>
