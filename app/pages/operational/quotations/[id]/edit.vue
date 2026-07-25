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
  Loader2,
  RefreshCw,
  AlertTriangle,
  Receipt,
  Wallet,
  Eye,
} from "lucide-vue-next";
import Combobox from "~/components/ui/Combobox.vue";
import DatePicker from "~/components/ui/DatePicker.vue";
import SectionCard from "~/pages/operational/jobs/components/SectionCard.vue";
import {
  useQuotations,
  type QuotationCharge,
  type QuotationInvoice,
  type QuotationCost,
} from "~/composables/useQuotations";
import { useFinanceTax, type Tax } from "~/composables/useFinanceTax";
import { useServices } from "~/composables/useServices";
import ServiceCreateModal from "~/pages/master/services/components/ServiceCreateModal.vue";
import CompanyCreateModal from "~/pages/master/company/components/CompanyCreateModal.vue";
import QuotationInvoiceForm from "~/components/operational/QuotationInvoiceForm.vue";
import QuotationCostForm from "~/components/operational/QuotationCostForm.vue";
import Modal from "~/components/ui/Modal.vue";
import type { Port, ContainerType } from "~/composables/useMasterData";
import { toast } from "vue-sonner";

definePageMeta({
  layout: "dashboard",
  title: "Edit Quotation",
});

const route = useRoute();
const router = useRouter();
const {
  getQuotation,
  updateQuotation,
  updateQuotationInvoices,
  updateQuotationCosts,
  currentQuotation,
  isLoading,
} = useQuotations();
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

const truckContainerTypeCodes = new Set(["CDE", "CDD", "CDD_LONG", "WING_BOX"]);

const containerTypes = computed(() => {
  return (masterData.value?.containerTypes || [])
    .filter((ct) => !truckContainerTypeCodes.has(ct.code))
    .map((ct) => ({
      id: ct.id,
      name: ct.name,
    }));
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
  { id: "TRUCKING", name: "TRUCKING" },
  { id: "CUSTOM_CLEARANCE", name: "CUSTOM CLEARANCE" },
];

const SHIPMENT_TYPES = [
  { id: "OCEAN", name: "Ocean Freight" },
  { id: "AIR", name: "Air Freight" },
];

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
    if (val) {
      const ports = val.map(uppercasePort);
      const existingCodes = new Set(searchedPorts.value.map((p) => p.code));
      ports.forEach((port) => {
        if (!existingCodes.has(port.code)) {
          searchedPorts.value.push(port);
        }
      });
    }
  },
  { immediate: true },
);

const portsPol = computed(() => searchedPorts.value);
const portsPod = computed(() => searchedPorts.value);
const isOceanService = computed(() => formData.serviceType === "OCEAN");
const isOcean = computed(
  () => formData.serviceType === "OCEAN" && formData.shipmentType === "OCEAN",
);
const isAir = computed(() => formData.serviceType === "OCEAN" && formData.shipmentType === "AIR");
const isTrucking = computed(() => formData.serviceType === "TRUCKING");
const isCustomClearance = computed(() => formData.serviceType === "CUSTOM_CLEARANCE");
const usesPortRoute = computed(() => isOceanService.value || isCustomClearance.value);
const portSearchType = computed(() => (isAir.value ? "air" : "ocean"));

async function handleSearchPol(query: string) {
  if (!query) {
    searchedPorts.value = (masterData.value?.ports || []).map(uppercasePort);
    return;
  }
  const results = await $fetch<Port[]>(
    `/api/master/ports?q=${encodeURIComponent(uppercase(query))}&type=${portSearchType.value}`,
  );
  searchedPorts.value = results.map(uppercasePort);
}
const handleSearchPod = handleSearchPol;

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
  date: "",
  validUntil: "",
  freeTime: "",
  salesName: "",
  status: "DRAFT",
  currency: "IDR",
  exchangeRate: 1,
  allowMultipleInvoices: false,
  notes: "",
  taxId: "",
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
    const normalizedServiceType = q.serviceType === "AIR" ? "OCEAN" : q.serviceType || "OCEAN";
    const normalizedShipmentType =
      q.serviceType === "AIR"
        ? "AIR"
        : ["OCEAN", "AIR"].includes(q.shipmentType || "")
          ? q.shipmentType || "OCEAN"
          : "OCEAN";
    formData.customerId = q.customerId;
    formData.picName = q.picName || "";
    formData.tradeTypeId = q.tradeTypeId || "EXPORT";
    formData.serviceType = normalizedServiceType;
    formData.shipmentType = normalizedServiceType === "OCEAN" ? normalizedShipmentType : "";
    formData.pol = q.pol || "";
    formData.pod = q.pod || "";
    formData.containerTypeId = q.containerTypeId || "";
    formData.truckType = q.truckType || "";
    formData.pickupAddress = q.pickupAddress || "";
    formData.deliveryAddress = q.deliveryAddress || "";
    formData.pickupDate = q.pickupDate ? q.pickupDate.split("T")[0] || "" : "";
    formData.deliveryDate = q.deliveryDate ? q.deliveryDate.split("T")[0] || "" : "";
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
    formData.taxId = q.taxId || "";

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
      atCost: Boolean(ch.atCost),
      currency: (ch.currency || "IDR") as "IDR" | "USD",
    }));

    // Fetch and merge selected POL/POD to ensure they are available in dropdown options on page load
    const portQueries = [];
    const portSearchTypeVal = normalizedShipmentType === "AIR" ? "air" : "ocean";
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

    quotationInvoices.value = q.quotationInvoices || [];
    quotationCosts.value = q.costs || [];

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
    atCost: false,
    amount: 0,
    currency: "IDR",
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

const quotationInvoices = ref<QuotationInvoice[]>([]);
const quotationCosts = ref<QuotationCost[]>([]);
const showInvoiceForm = ref(false);
const showCostForm = ref(false);
const editingInvoice = ref<QuotationInvoice | null>(null);
const editingCost = ref<QuotationCost | null>(null);
const invoiceFormSaving = ref(false);
const costFormSaving = ref(false);

const nextInvNumber = computed(() => {
  const count = quotationInvoices.value.length + 1;
  return `QINV-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-${String(count).padStart(3, "0")}`;
});

const getQuotationInvoiceCurrency = (inv: QuotationInvoice) => {
  if (inv.currency) return inv.currency;
  const currencies = [...new Set((inv.items || []).map((item) => item.currency || "IDR"))];
  return currencies.length === 1 ? currencies[0]! : "IDR";
};

const handleInvoiceSubmit = async (payload: QuotationInvoice) => {
  invoiceFormSaving.value = true;
  const updated = editingInvoice.value
    ? quotationInvoices.value.map((inv) =>
        inv === editingInvoice.value ? { ...payload, id: editingInvoice.value?.id } : inv,
      )
    : [...quotationInvoices.value, payload];

  try {
    const res = await updateQuotationInvoices(quotationId, updated);
    if (!res.success) {
      toast.error(res.error || "Gagal menyimpan invoice.");
      return;
    }

    quotationInvoices.value = res.data?.quotationInvoices || updated;
    showInvoiceForm.value = false;
    editingInvoice.value = null;
    toast.success("Quotation saved.");
  } finally {
    invoiceFormSaving.value = false;
  }
};

const handleCostSubmit = async (payload: QuotationCost) => {
  costFormSaving.value = true;
  const updated = editingCost.value
    ? quotationCosts.value.map((c) =>
        c === editingCost.value ? { ...payload, id: editingCost.value?.id } : c,
      )
    : [...quotationCosts.value, payload];

  try {
    const res = await updateQuotationCosts(quotationId, updated);
    if (!res.success) {
      toast.error(res.error || "Gagal menyimpan cost.");
      return;
    }

    quotationCosts.value = res.data?.costs || updated;
    showCostForm.value = false;
    editingCost.value = null;
    toast.success("Cost saved.");
  } finally {
    costFormSaving.value = false;
  }
};

const removeInvoice = async (idx: number) => {
  const updated = quotationInvoices.value.filter((_, index) => index !== idx);
  const res = await updateQuotationInvoices(quotationId, updated);
  if (res.success) {
    quotationInvoices.value = res.data?.quotationInvoices || updated;
    toast.success("Quotation removed.");
  } else {
    toast.error(res.error || "Gagal menghapus invoice.");
  }
};

const removeCost = async (idx: number) => {
  const updated = quotationCosts.value.filter((_, index) => index !== idx);
  const res = await updateQuotationCosts(quotationId, updated);
  if (res.success) {
    quotationCosts.value = res.data?.costs || updated;
    toast.success("Cost removed.");
  } else {
    toast.error(res.error || "Gagal menghapus cost.");
  }
};

const editInvoice = (idx: number) => {
  editingInvoice.value = quotationInvoices.value[idx] ?? null;
  showInvoiceForm.value = true;
};

const editCost = (idx: number) => {
  editingCost.value = quotationCosts.value[idx] ?? null;
  showCostForm.value = true;
};

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
        masterData.value = {
          ...masterData.value,
          services: [...masterData.value.services, res.data],
        };
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

watch(
  () => formData.serviceType,
  (serviceType) => {
    if (!isDataLoaded.value) return;
    if (isLocked.value) return;

    if (serviceType === "OCEAN") {
      formData.shipmentType =
        formData.shipmentType && ["OCEAN", "AIR"].includes(formData.shipmentType)
          ? formData.shipmentType
          : "OCEAN";
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
    if (!isDataLoaded.value) return;
    if (isLocked.value) return;

    if (formData.serviceType === "OCEAN") {
      const results = await $fetch<Port[]>(`/api/master/ports?type=${portSearchType.value}`);
      searchedPorts.value = results.map(uppercasePort);
    }
  },
);

// Mathematical Calculations
const groupedTotals = computed(() => {
  const totals: {
    IDR: { subTotal: number; taxAmount: number; total: number };
    USD: { subTotal: number; taxAmount: number; total: number };
    [key: string]: { subTotal: number; taxAmount: number; total: number };
  } = {
    IDR: { subTotal: 0, taxAmount: 0, total: 0 },
    USD: { subTotal: 0, taxAmount: 0, total: 0 },
  };

  const rate = Number(formData.exchangeRate || 1);
  const shouldConvert = rate > 1;

  formData.charges.forEach((ch) => {
    if (ch.atCost) return;
    const currency = ch.currency || "IDR";
    const qty = Number(ch.quantity || 0);
    const price = Number(ch.unitPrice || 0);
    const amount = qty * price;

    if (shouldConvert && currency === "USD") {
      totals.IDR.subTotal += amount * rate;
    } else {
      if (!totals[currency]) {
        totals[currency] = { subTotal: 0, taxAmount: 0, total: 0 };
      }
      totals[currency].subTotal += amount;
    }
  });

  // Single PPN rate from quotation-level tax
  const selectedTax = masterData.value?.taxes.find((t) => t.id === formData.taxId);
  const taxRate = selectedTax && selectedTax.id ? selectedTax.rate : 0;

  Object.keys(totals).forEach((curr) => {
    const entry = totals[curr];
    if (!entry) return;
    entry.subTotal = Math.round(entry.subTotal);
    entry.taxAmount = Math.round(entry.subTotal * (taxRate / 100));
    entry.total = entry.subTotal + entry.taxAmount;
  });

  // USD will show zero when all converted — template hides it via v-if t.total > 0

  return totals;
});

const hasUSDCharges = computed(() => formData.charges.some((ch) => ch.currency === "USD"));

const quotationCurrency = computed(() => {
  const currencies = [...new Set(formData.charges.map((ch) => ch.currency || "IDR"))];
  return currencies.length === 1 ? currencies[0]! : "MIXED";
});

const isFetchingRate = ref(false);
async function loadExchangeRate() {
  isFetchingRate.value = true;
  try {
    const res = await $fetch<{ success: boolean; rate?: number }>(
      "/api/finance/invoice/exchange-rate",
    );
    if (res?.success && res.rate) {
      formData.exchangeRate = res.rate;
      toast.success("Exchange rate updated from Frankfurter API.");
    }
  } catch {
    toast.error("Failed to fetch exchange rate.");
  } finally {
    isFetchingRate.value = false;
  }
}

const formatCurrency = (amount: number, currency: string = "IDR") => {
  return new Intl.NumberFormat(currency === "IDR" ? "id-ID" : "en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: currency === "IDR" ? 0 : 2,
    maximumFractionDigits: currency === "IDR" ? 0 : 2,
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

  const invalidCharges = formData.charges.some((ch) => !ch.serviceId);
  if (invalidCharges) {
    toast.error("Semua baris service harus memiliki jenis Service.");
    return;
  }

  const legacySubTotal =
    (groupedTotals.value.IDR?.subTotal || 0) + (groupedTotals.value.USD?.subTotal || 0);
  const legacyTaxTotal =
    (groupedTotals.value.IDR?.taxAmount || 0) + (groupedTotals.value.USD?.taxAmount || 0);
  const legacyTotal = (groupedTotals.value.IDR?.total || 0) + (groupedTotals.value.USD?.total || 0);

  const payload = {
    customerId: formData.customerId,
    picName: formData.picName ? uppercase(formData.picName) : null,
    tradeTypeId: formData.tradeTypeId,
    serviceType: formData.serviceType,
    shipmentType: isOceanService.value && formData.shipmentType ? formData.shipmentType : null,
    pol: usesPortRoute.value && formData.pol ? uppercase(formData.pol) : null,
    pod: usesPortRoute.value && formData.pod ? uppercase(formData.pod) : null,
    containerTypeId:
      (isOceanService.value || isTrucking.value) && formData.containerTypeId
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
    date: formData.date,
    validUntil: formData.validUntil,
    freeTime: formData.freeTime ? uppercase(formData.freeTime) : null,
    salesName: formData.salesName ? uppercase(formData.salesName) : null,
    status: formData.status,
    notes: formData.notes ? uppercase(formData.notes) : null,
    currency: quotationCurrency.value === "MIXED" ? "IDR" : quotationCurrency.value,
    exchangeRate: Number(formData.exchangeRate || 1),
    allowMultipleInvoices: formData.allowMultipleInvoices,
    taxId: formData.taxId || null,
    subTotal: legacySubTotal,
    taxAmount: legacySubTotal > 0 ? (legacyTaxTotal / legacySubTotal) * 100 : 0,
    taxTotal: legacyTaxTotal,
    total: legacyTotal,
    charges: formData.charges.map((ch) => ({
      id: ch.id,
      serviceId: ch.serviceId,
      description: ch.description || "Service Item",
      quantity: Number(ch.quantity || 1),
      unitPrice: ch.atCost ? 0 : Number(ch.unitPrice || 0),
      amount: ch.atCost ? 0 : Number(ch.quantity || 1) * Number(ch.unitPrice || 0),
      currency: ch.currency || "IDR",
      atCost: Boolean(ch.atCost),
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

            <!-- Multi-use switch -->
            <div class="flex items-center gap-2 ml-2">
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
                    :disabled="isLocked"
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
                    :disabled="isLocked"
                    placeholder="Select service type..."
                  />
                </div>

                <div v-if="isOceanService" class="space-y-2">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                  >
                    Shipment Type
                  </label>
                  <Combobox
                    v-model="formData.shipmentType"
                    :options="SHIPMENT_TYPES"
                    :disabled="isLocked"
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
                    :disabled="isLocked"
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
                    :disabled="isLocked"
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
                    :disabled="isLocked"
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
                    :disabled="isLocked"
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
                    :disabled="isLocked"
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
                    :disabled="isLocked"
                    placeholder="Select..."
                  />
                </div>

                <div class="space-y-2">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                    >Pickup Date</label
                  >
                  <DatePicker v-model="formData.pickupDate" :disabled="isLocked" />
                </div>

                <div class="space-y-2">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                    >Delivery Date</label
                  >
                  <DatePicker v-model="formData.deliveryDate" :disabled="isLocked" />
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
                    :disabled="isLocked"
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
                    :disabled="isLocked"
                    rows="1"
                    placeholder="Full pickup address..."
                    class="input-field py-3 min-h-[44px] h-11 resize-none disabled:bg-gray-50 disabled:opacity-75"
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
                    :disabled="isLocked"
                    rows="1"
                    placeholder="Full delivery destination..."
                    class="input-field py-3 min-h-[44px] h-11 resize-none disabled:bg-gray-50 disabled:opacity-75"
                  ></textarea>
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

              <!-- Currency & Exchange Rate -->
              <div
                class="mt-6 p-4 bg-blue-50/30 rounded-xl border border-blue-100 space-y-3"
                v-if="!isLocked"
              >
                <div class="flex items-center justify-between">
                  <h4 class="text-[10px] font-black text-[#062c58] uppercase tracking-widest">
                    Currency Configuration
                  </h4>
                  <span class="text-[9px] text-muted-foreground">
                    Digunakan untuk profit analysis &amp; preview PDF
                  </span>
                </div>
                <div
                  v-if="hasUSDCharges && Number(formData.exchangeRate) <= 1"
                  class="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg"
                >
                  <AlertTriangle class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p class="text-[11px] font-bold text-amber-800">
                      Isi exchange rate agar profit tidak negatif
                    </p>
                    <p class="text-[10px] text-amber-700 mt-0.5">
                      Ada item USD di quotation. Kalau rate tetap 1, revenue USD akan dihitung
                      sebagai IDR dan Net Profit jadi minus.
                    </p>
                  </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-1.5">
                    <label
                      class="text-[10px] font-black text-muted-foreground uppercase tracking-widest"
                    >
                      Quotation Currency
                    </label>
                    <div
                      class="flex items-center gap-2 h-10 px-3 rounded-lg border"
                      :class="isLocked ? 'bg-gray-100 border-border' : 'bg-gray-50 border-border'"
                    >
                      <span
                        v-for="curr in [
                          ...new Set(formData.charges.map((ch) => ch.currency || 'IDR')),
                        ]"
                        :key="curr"
                        class="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border"
                        :class="
                          curr === 'IDR'
                            ? 'bg-white text-[#062c58] border-[#062c58]/20'
                            : 'bg-white text-emerald-700 border-emerald-200'
                        "
                      >
                        {{ curr }}
                      </span>
                      <span class="text-[10px] text-muted-foreground ml-auto">auto</span>
                    </div>
                  </div>
                  <div class="space-y-1.5">
                    <label
                      class="text-[10px] font-black text-muted-foreground uppercase tracking-widest"
                    >
                      Exchange Rate (USD → IDR)
                    </label>
                    <div class="flex gap-2 items-start">
                      <div class="flex-1 space-y-1">
                        <input
                          type="text"
                          :value="formatInputCurrency(formData.exchangeRate, 'IDR')"
                          :disabled="isLocked"
                          @input="
                            (e) =>
                              (formData.exchangeRate = parseInputCurrency(
                                (e.target as HTMLInputElement).value,
                                'IDR',
                              ))
                          "
                          class="w-full px-3 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#062c58] shadow-sm h-10 font-semibold disabled:bg-gray-50 disabled:opacity-75"
                          placeholder="16,000"
                        />
                        <p class="text-[9px] font-bold text-muted-foreground">
                          $1 = {{ formatCurrency(Number(formData.exchangeRate) || 0, "IDR") }}
                        </p>
                      </div>
                      <div class="relative group/tip shrink-0">
                        <button
                          type="button"
                          @click="loadExchangeRate"
                          :disabled="isFetchingRate || isLocked"
                          class="h-10 px-3 inline-flex items-center gap-1.5 bg-white border border-blue-200 text-[#062c58] text-[11px] font-bold rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all disabled:opacity-50"
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
                    </div>
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
              <div class="p-6 pb-0">
                <span class="text-xs font-semibold text-muted-foreground"
                  >List of quotation services & charges</span
                >
              </div>

              <div class="border-t border-b border-border bg-muted/5 mt-4">
                <!-- Header -->
                <div
                  class="grid grid-cols-12 gap-3 px-6 py-2 bg-gray-50/50 text-[10px] font-bold text-muted-foreground uppercase tracking-wider"
                >
                  <div class="col-span-5">Service / Description</div>
                  <div class="col-span-2 text-center">Qty / Currency</div>
                  <div class="col-span-2 text-right">Unit Price</div>
                  <div class="col-span-2 text-center pr-4">At Cost</div>
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

                    <!-- Qty / Currency -->
                    <div class="col-span-2 space-y-1.5">
                      <input
                        type="number"
                        v-model.number="ch.quantity"
                        min="1"
                        :disabled="isLocked"
                        class="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm focus:ring-1 focus:ring-[#062c58] outline-none transition-all shadow-sm h-10 text-right disabled:bg-gray-50 disabled:opacity-75"
                        v-uppercase
                      />
                      <Combobox
                        v-model="ch.currency"
                        :options="[
                          { id: 'IDR', name: 'IDR' },
                          { id: 'USD', name: 'USD' },
                        ]"
                        :disabled="isLocked"
                        @update:model-value="
                          (val) => {
                            if (!val) ch.currency = 'IDR';
                          }
                        "
                        class="w-full"
                        placeholder="Select..."
                      />
                    </div>

                    <!-- Unit Price -->
                    <div class="col-span-2 space-y-1.5">
                      <template v-if="ch.atCost">
                        <div
                          class="h-10 flex items-center justify-end text-[11px] font-extrabold text-muted-foreground uppercase tracking-widest"
                        >
                          AT COST
                        </div>
                      </template>
                      <template v-else>
                        <input
                          type="text"
                          :disabled="isLocked"
                          :value="formatInputCurrency(ch.unitPrice, ch.currency)"
                          v-uppercase
                          @input="
                            (e) =>
                              (ch.unitPrice = parseInputCurrency(
                                (e.target as HTMLInputElement).value,
                                ch.currency,
                              ))
                          "
                          class="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm text-right font-semibold focus:ring-1 focus:ring-[#062c58] outline-none transition-all shadow-sm h-10 disabled:bg-gray-50 disabled:opacity-75"
                        />
                      </template>
                      <p
                        class="text-[9px] text-right font-bold text-muted-foreground whitespace-nowrap pt-2"
                      >
                        Sub:
                        {{
                          formatCurrency(
                            Number(ch.quantity || 1) * Number(ch.atCost ? 0 : ch.unitPrice || 0),
                            ch.currency,
                          )
                        }}
                      </p>
                    </div>

                    <!-- At Cost checkbox -->
                    <div class="col-span-2 flex flex-col items-center justify-center pr-4">
                      <label
                        class="relative inline-flex items-center cursor-pointer"
                        :class="{ 'opacity-50': isLocked }"
                      >
                        <input
                          type="checkbox"
                          v-model="ch.atCost"
                          :disabled="isLocked"
                          class="sr-only peer"
                        />
                        <div
                          class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#062c58]"
                        ></div>
                      </label>
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

              <div class="px-6 py-3 flex items-end justify-between">
                <div class="min-w-[240px] w-72 space-y-1.5">
                  <label
                    class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
                    >PPN / Tax</label
                  >
                  <Combobox
                    v-model="formData.taxId"
                    :options="masterData?.taxes || []"
                    :disabled="isLocked"
                    placeholder="Select PPN..."
                  />
                </div>
                <div v-if="!isLocked" class="flex items-center gap-1.5">
                  <button
                    type="button"
                    @click="addChargeLine"
                    class="inline-flex items-center gap-1.5 text-xs font-bold text-[#062c58] hover:bg-blue-50/50 px-3 py-1.5 rounded-lg border border-blue-100 transition-colors"
                  >
                    <Plus class="w-3.5 h-3.5" /> Add Service Line
                  </button>
                </div>
              </div>

              <!-- Quotation documents and costs summary -->
              <div
                v-if="quotationInvoices.length > 0 || quotationCosts.length > 0"
                class="px-6 pb-6 pt-6 border-t border-border/40 space-y-4"
              >
                <div v-if="quotationInvoices.length > 0">
                  <div class="flex items-center gap-2 mb-3">
                    <div class="p-1 rounded-md bg-green-100 text-green-700">
                      <Receipt class="w-3.5 h-3.5" />
                    </div>
                    <h4 class="text-xs font-bold text-foreground uppercase tracking-wide">
                      Quotations ({{ quotationInvoices.length }})
                    </h4>
                  </div>
                  <div class="space-y-2">
                    <div
                      v-for="(inv, idx) in quotationInvoices"
                      :key="idx"
                      class="group p-3.5 rounded-xl border border-green-200 bg-green-50/30 hover:border-green-300 hover:shadow-sm transition-all"
                    >
                      <div class="flex items-start justify-between gap-3">
                        <div class="flex items-start gap-3 min-w-0">
                          <div
                            class="w-9 h-9 rounded-lg bg-green-100 text-green-600 flex items-center justify-center shrink-0 border border-green-200"
                          >
                            <Receipt class="w-4 h-4" />
                          </div>
                          <div class="min-w-0">
                            <div class="flex items-center gap-2">
                              <span class="font-bold text-sm text-foreground">{{
                                inv.number || "QINV-" + (idx + 1)
                              }}</span>
                              <span
                                class="text-[9px] px-1.5 py-0.5 rounded font-black border uppercase tracking-wider bg-green-100 text-green-700 border-green-200"
                                >Quotation</span
                              >
                            </div>
                            <p class="text-xs text-muted-foreground mt-1">
                              {{ inv.items?.length || 0 }} charge(s)
                            </p>
                          </div>
                        </div>
                        <div class="flex items-center gap-3">
                          <div class="text-right">
                            <p
                              class="text-[9px] text-muted-foreground mb-0.5 uppercase tracking-widest font-bold opacity-70"
                            >
                              Total
                            </p>
                            <p class="font-black text-sm text-[#062c58]">
                              {{ formatCurrency(inv.total || 0, getQuotationInvoiceCurrency(inv)) }}
                            </p>
                          </div>
                          <div
                            v-if="!isLocked"
                            class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <button
                              @click="editInvoice(idx)"
                              class="p-1.5 rounded-lg text-muted-foreground hover:text-[#062c58] hover:bg-blue-50 transition-colors"
                              title="View / Edit"
                            >
                              <Eye class="w-4 h-4" />
                            </button>
                            <button
                              @click="removeInvoice(idx)"
                              class="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 class="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div
                        v-if="inv.items?.length"
                        class="mt-3 ml-12 border-t border-green-200/70 pt-2 space-y-1.5"
                      >
                        <div
                          v-for="(item, itemIdx) in inv.items.slice(0, 3)"
                          :key="`${idx}-${itemIdx}-${item.description}`"
                          class="grid grid-cols-[1fr_auto_auto] gap-3 text-[11px] items-center"
                        >
                          <span class="font-semibold text-foreground truncate">
                            {{ item.description || "Untitled charge" }}
                          </span>
                          <span class="text-muted-foreground">x{{ item.quantity || 1 }}</span>
                          <span class="font-bold text-[#062c58]">
                            {{
                              formatCurrency(
                                item.amount || 0,
                                item.currency || getQuotationInvoiceCurrency(inv),
                              )
                            }}
                          </span>
                        </div>
                        <p
                          v-if="inv.items.length > 3"
                          class="text-[10px] font-semibold text-muted-foreground"
                        >
                          +{{ inv.items.length - 3 }} more charge(s)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="quotationCosts.length > 0">
                  <div class="flex items-center gap-2 mb-3">
                    <div class="p-1 rounded-md bg-red-100 text-red-700">
                      <Wallet class="w-3.5 h-3.5" />
                    </div>
                    <h4 class="text-xs font-bold text-foreground uppercase tracking-wide">
                      Costs ({{ quotationCosts.length }})
                    </h4>
                  </div>
                  <div class="space-y-2">
                    <div
                      v-for="(cost, idx) in quotationCosts"
                      :key="idx"
                      class="group p-3.5 rounded-xl border border-red-200 bg-red-50/30 hover:border-red-300 hover:shadow-sm transition-all flex items-center justify-between"
                    >
                      <div class="flex items-start gap-3">
                        <div
                          class="w-9 h-9 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0 border border-red-200"
                        >
                          <Wallet class="w-4 h-4" />
                        </div>
                        <div>
                          <div class="flex items-center gap-2">
                            <span class="font-bold text-sm text-foreground">{{
                              cost.number || "VCOST-" + (idx + 1)
                            }}</span>
                            <span
                              class="text-[9px] px-1.5 py-0.5 rounded font-black border uppercase tracking-wider bg-red-100 text-red-700 border-red-200"
                              >Cost</span
                            >
                          </div>
                          <p class="text-xs text-muted-foreground mt-1">
                            {{ cost.items?.length || 0 }} item(s)
                          </p>
                        </div>
                      </div>
                      <div class="flex items-center gap-3">
                        <div class="text-right">
                          <p
                            class="text-[9px] text-muted-foreground mb-0.5 uppercase tracking-widest font-bold opacity-70"
                          >
                            Total
                          </p>
                          <p class="font-black text-sm text-red-600">
                            {{ formatCurrency(cost.amount || 0) }}
                          </p>
                        </div>
                        <div
                          v-if="!isLocked"
                          class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <button
                            @click="editCost(idx)"
                            class="p-1.5 rounded-lg text-muted-foreground hover:text-[#062c58] hover:bg-blue-50 transition-colors"
                            title="View / Edit"
                          >
                            <Eye class="w-4 h-4" />
                          </button>
                          <button
                            @click="removeCost(idx)"
                            class="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 class="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Total summary block -->
              <div class="flex justify-end p-6">
                <div
                  class="w-[380px] space-y-4 bg-gray-50/50 p-5 rounded-xl border border-border shadow-sm"
                >
                  <h4 class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Quotation Summary
                  </h4>
                  <div class="divide-y divide-border/50">
                    <div
                      v-for="(t, curr) in groupedTotals"
                      :key="curr"
                      class="py-2.5 first:pt-0 last:pb-0"
                    >
                      <div
                        v-if="
                          t.total > 0 ||
                          (curr === 'IDR' &&
                            Object.values(groupedTotals).every((x) => x.total === 0))
                        "
                        class="space-y-1.5"
                      >
                        <span
                          class="text-[10px] font-extrabold text-[#062c58] uppercase tracking-wider"
                          >{{ curr }} Charges</span
                        >
                        <div class="flex justify-between text-xs text-muted-foreground">
                          <span>Subtotal</span>
                          <span class="font-semibold text-foreground">{{
                            formatCurrency(t.subTotal, curr)
                          }}</span>
                        </div>
                        <div class="flex justify-between text-xs text-muted-foreground">
                          <span>VAT / Tax</span>
                          <span class="font-semibold text-foreground">{{
                            formatCurrency(t.taxAmount, curr)
                          }}</span>
                        </div>
                        <div
                          class="flex justify-between text-sm font-bold text-[#062c58] pt-1 border-t border-dashed border-border/60"
                        >
                          <span>Total Amount</span>
                          <span class="text-base font-black">{{
                            formatCurrency(t.total, curr)
                          }}</span>
                        </div>
                      </div>
                    </div>
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

    <!-- Quotation Form Modal -->
    <Modal
      v-model="showInvoiceForm"
      :title="editingInvoice ? 'Edit Quotation' : 'Create Quotation'"
      :description="
        editingInvoice
          ? 'Modify this quotation document.'
          : 'Create a new quotation document from selected charges.'
      "
      width="2xl"
    >
      <QuotationInvoiceForm
        v-if="showInvoiceForm"
        :invoice="editingInvoice"
        :is-saving="invoiceFormSaving"
        :next-number="nextInvNumber"
        :quotation-currency="quotationCurrency === 'MIXED' ? 'IDR' : quotationCurrency"
        :quotation-exchange-rate="Number(formData.exchangeRate || 1)"
        @submit="handleInvoiceSubmit"
        @cancel="
          showInvoiceForm = false;
          editingInvoice = null;
        "
      />
    </Modal>

    <!-- Quotation Cost Form Modal -->
    <Modal
      v-model="showCostForm"
      :title="editingCost ? 'Edit Cost' : 'Record Cost'"
      :description="editingCost ? 'Edit cost details.' : 'Record a cost for this quotation.'"
      width="2xl"
    >
      <QuotationCostForm
        :cost="editingCost"
        :is-saving="costFormSaving"
        @submit="handleCostSubmit"
        @cancel="
          showCostForm = false;
          editingCost = null;
        "
      />
    </Modal>
  </div>
</template>
