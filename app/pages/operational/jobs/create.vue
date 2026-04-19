<script setup lang="ts">
import {
  ArrowLeft,
  Save,
  Briefcase,
  MapPin,
  Box,
  Clock,
  Scale,
  FileText,
  Users,
  Trash2,
  Plus,
  Building2,
} from "lucide-vue-next";
import Combobox from "~/components/ui/Combobox.vue";
import DatePicker from "~/components/ui/DatePicker.vue";
import Modal from "~/components/ui/Modal.vue";
import type {
  Company,
  ContainerType,
  Vessel,
  Port,
  PackageType,
} from "~/composables/useMasterData";
import SectionCard from "./components/SectionCard.vue";
import JobPartyRow from "./components/JobPartyRow.vue";

definePageMeta({
  layout: "dashboard",
  title: "Create Job",
});

const { createJob, isLoading } = useJobs();
const { confirm } = useConfirm();
const { createCompany, createVessel } = useMasterData();
const router = useRouter();
import { toast } from "vue-sonner";

const { user } = useAuth();

// Fetch master data with SSR
const {
  data: masterData,
  pending: isLoadingMasterData,
  refresh,
} = await useAsyncData<{
  companies: Company[];
  containerTypes: ContainerType[];
  vessels: Vessel[];
  ports: Port[];
  packageTypes: PackageType[];
}>("job-create-master-data", async () => {
  const [comps, types, packs, vess, initialPorts] = await Promise.all([
    $fetch<Company[]>("/api/master/companies"),
    $fetch<ContainerType[]>("/api/master/container-types"),
    $fetch<PackageType[]>("/api/master/package-types"),
    $fetch<Vessel[]>("/api/master/vessels"),
    $fetch<Port[]>("/api/master/ports"),
  ]);
  return {
    companies: comps,
    containerTypes: types,
    vessels: vess,
    ports: initialPorts,
    packageTypes: packs,
  };
});

const companies = computed(() => masterData.value?.companies || []);
const containerTypes = computed(() => masterData.value?.containerTypes || []);
const vessels = computed(() => masterData.value?.vessels || []);
const portsPol = computed(() => masterData.value?.ports || []);
const portsPod = computed(() => masterData.value?.ports || []);
const packageTypes = computed(() => masterData.value?.packageTypes || []);

// Company Modal State
const isCompanyModalOpen = ref(false);
const isSubmittingCompany = ref(false);
const activeCompanyField = ref<
  "shipperId" | "consigneeId" | "notifyPartyId" | "forwarderId" | "customerId" | null
>(null);
const companyForm = reactive({
  name: "",
  fullAddress: "",
  street: "",
  city: "",
  state: "",
  postalCode: "",
  country: "Indonesia",
  eori: "",
  taxId: "",
});

// Search handlers for ports (client-side only)
async function handleSearchPol(query: string) {
  if (!query) {
    return masterData.value?.ports || [];
  }
  return await $fetch<Port[]>(`/api/master/ports?q=${encodeURIComponent(query)}`);
}

const handleSearchPod = handleSearchPol;

// Refresh master data (for after creating new entities)
const refreshMasterData = async () => {
  await refresh();
};

const formData = reactive({
  // Job Info
  tradeTypeId: "EXPORT",
  customerId: "",

  // Route Details
  pol: "",
  pod: "",
  voyageNumber: "",
  preCarriageBy: "",
  placeOfReceipt: "",
  placeOfDelivery: "",
  finalDestination: "",

  // Cargo & Customs
  hsCode: "",
  commodity: "", // mapped to Description of Goods
  shippingMark: "",
  mainDescription: "",

  // Containers (BL Ready)
  containers: [
    {
      id: Date.now(),
      containerNumber: "",
      sealNumber: "",
      containerTypeId: "",
      isHazardous: false,
      items: [
        {
          id: Date.now() + 1,
          sequenceNo: 1,
          qty: 1,
          packageTypeCode: "",
          grossWeight: null as number | null,
          netWeight: null as number | null,
          measurementCbm: null as number | null,
          description: "",
          hsCode: "",
        },
      ],
    },
  ] as Array<{
    id: number;
    containerNumber: string;
    sealNumber: string;
    containerTypeId: string;
    isHazardous: boolean;
    items: Array<{
      id: number;
      sequenceNo: number;
      qty: number;
      packageTypeCode: string;
      grossWeight: number | null;
      netWeight: number | null;
      measurementCbm: number | null;
      description: string;
      hsCode: string;
    }>;
  }>,

  // Movement & Schedule
  cargoMovementId: "FCL_FCL",
  deliveryMovementId: "CY_DOOR",
  vessels: [
    {
      id: Date.now(),
      vesselId: "",
      vesselName: "",
      voyageNumber: "",
      etd: "",
      sequence: 0,
    },
  ],
  etd: "",
  eta: "",

  // Weight & Measurement
  grossWeight: null as number | null,
  netWeight: null as number | null,
  measurement: null as number | null,

  // BL Setup
  totalBlCount: 1,
  freightTerm: "PREPAID",
  blType: "ORIGINAL",
  isNegotiable: false,
  placeOfIssue: "",
  dateOfIssue: "",

  // Involved Parties
  shipperId: "",
  shipperAddressId: "",
  consigneeId: "",
  consigneeAddressId: "",
  isNotifySameAsConsignee: false,
  notifyPartyId: "",
  notifyPartyAddressId: "",
  forwarderId: "",
  forwarderAddressId: "",
});

// Sync Notify Party if checkbox is checked
watch(
  () => formData.isNotifySameAsConsignee,
  (val) => {
    if (val) {
      formData.notifyPartyId = formData.consigneeId;
      formData.notifyPartyAddressId = formData.consigneeAddressId;
    } else {
      formData.notifyPartyId = "";
      formData.notifyPartyAddressId = "";
    }
  },
);

watch(
  () => formData.consigneeId,
  (val) => {
    if (formData.isNotifySameAsConsignee) {
      formData.notifyPartyId = val;
    }
  },
);

watch(
  () => formData.consigneeAddressId,
  (val) => {
    if (formData.isNotifySameAsConsignee) {
      formData.notifyPartyAddressId = val;
    }
  },
);

// Auto-select Default Address when a Company is chosen
const assignDefaultAddress = (
  companyId: string,
  addressKey:
    | "shipperAddressId"
    | "consigneeAddressId"
    | "notifyPartyAddressId"
    | "forwarderAddressId",
) => {
  if (!companyId) {
    formData[addressKey] = "";
    return;
  }
  const company = companies.value.find((c) => c.id === companyId);
  if (company && company.addresses && company.addresses.length > 0) {
    const defaultAddr = company.addresses.find((a) => a.isDefault);
    formData[addressKey] = defaultAddr ? defaultAddr.id : company.addresses[0]!.id;
  } else {
    formData[addressKey] = "";
  }
};

watch(
  () => formData.shipperId,
  (val) => assignDefaultAddress(val, "shipperAddressId"),
);
watch(
  () => formData.consigneeId,
  (val) => assignDefaultAddress(val, "consigneeAddressId"),
);
watch(
  () => formData.notifyPartyId,
  (val) => {
    if (!formData.isNotifySameAsConsignee) {
      assignDefaultAddress(val, "notifyPartyAddressId");
    }
  },
);
watch(
  () => formData.forwarderId,
  (val) => assignDefaultAddress(val, "forwarderAddressId"),
);

// Auto-calculate Weight & Measurement based on Container items
watch(
  () => formData.containers,
  (containers) => {
    let totalGw = 0;
    let totalNw = 0;
    let totalCbm = 0;

    containers.forEach((container) => {
      if (container.items && Array.isArray(container.items)) {
        container.items.forEach((item) => {
          totalGw += Number(item.grossWeight) || 0;
          totalNw += Number(item.netWeight) || 0;
          totalCbm += Number(item.measurementCbm) || 0;
        });
      }
    });

    // Only update if there are items, to avoid resetting manual input when adding a new empty container
    const hasItems = containers.some((c) => c.items && c.items.length > 0);
    if (hasItems) {
      if (totalGw > 0) formData.grossWeight = totalGw;
      if (totalNw > 0) formData.netWeight = totalNw;
      if (totalCbm > 0) formData.measurement = totalCbm;
    }
  },
  { deep: true },
);

// --- LIVE VALIDATION COMPUTEDS ---
const containerErrors = computed(() => {
  const errors: Record<string, string> = {};
  formData.containers.forEach((c) => {
    if (c.containerNumber) {
      const regex = /^[A-Z]{4}\d{7}$/;
      if (!regex.test(c.containerNumber.toUpperCase())) {
        errors[c.id] = "Must be 4 letters + 7 digits (e.g. TEMU1234567)";
      }
    }
    if (c.items && Array.isArray(c.items)) {
      c.items.forEach((item) => {
        // qty
        if (item.qty !== null && item.qty !== undefined) {
          if (!Number.isInteger(item.qty) || item.qty <= 0) {
            errors[`${c.id}-${item.id}-qty`] = "Must be > 0";
          }
        }
        // GW
        if (item.grossWeight !== null && item.grossWeight < 0) {
          errors[`${c.id}-${item.id}-gw`] = "Cannot be < 0";
        }
        // NW
        if (item.netWeight !== null) {
          if (item.netWeight < 0) {
            errors[`${c.id}-${item.id}-nw`] = "Cannot be < 0";
          } else if (item.grossWeight !== null && item.netWeight > item.grossWeight) {
            errors[`${c.id}-${item.id}-nw`] = "Cannot exceed GW";
          }
        }
        // CBM
        if (item.measurementCbm !== null && item.measurementCbm < 0) {
          errors[`${c.id}-${item.id}-cbm`] = "Cannot be < 0";
        }
        // HS Code
        if (item.hsCode) {
          const digits = item.hsCode.replace(/\D/g, "");
          if (digits.length > 0 && digits.length < 6) {
            errors[`${c.id}-${item.id}-hscode`] = "Min. 6 digits";
          }
        }
      });
    }
  });
  return errors;
});

const routeErrors = computed(() => {
  const errors: Record<string, string> = {};
  if (formData.pol && formData.pod && formData.pol === formData.pod) {
    errors.polPod = "POL and POD cannot be the same";
  }
  return errors;
});

const scheduleErrors = computed(() => {
  const errors: Record<string, string> = {};
  if (formData.eta && formData.vessels.length > 0) {
    const lastVesselEtd = formData.vessels[formData.vessels.length - 1]?.etd;
    if (lastVesselEtd) {
      if (new Date(formData.eta) < new Date(lastVesselEtd)) {
        errors.eta = "Final ETA cannot be earlier than last ETD";
      }
    }
  }
  return errors;
});

const totalErrorsConfigs = computed(() => {
  let totalGw = 0;
  let totalNw = 0;
  let totalCbm = 0;

  formData.containers.forEach((c) => {
    if (c.items && Array.isArray(c.items)) {
      c.items.forEach((item) => {
        totalGw += Number(item.grossWeight) || 0;
        totalNw += Number(item.netWeight) || 0;
        totalCbm += Number(item.measurementCbm) || 0;
      });
    }
  });

  const errors: Record<string, string> = {};
  const warnings: Record<string, string> = {};

  if (formData.grossWeight !== null && formData.grossWeight < 0) {
    errors.gw = "Cannot be negative";
  } else if (
    formData.grossWeight !== null &&
    Math.abs(formData.grossWeight - totalGw) > 0.01 &&
    totalGw > 0
  ) {
    warnings.gw = `Sum of container items is ${totalGw.toFixed(2)} KG`;
  }

  if (formData.netWeight !== null && formData.netWeight < 0) {
    errors.nw = "Cannot be negative";
  } else if (
    formData.netWeight !== null &&
    Math.abs(formData.netWeight - totalNw) > 0.01 &&
    totalNw > 0
  ) {
    warnings.nw = `Sum of container items is ${totalNw.toFixed(2)} KG`;
  }

  if (formData.measurement !== null && formData.measurement < 0) {
    errors.cbm = "Cannot be negative";
  } else if (
    formData.measurement !== null &&
    Math.abs(formData.measurement - totalCbm) > 0.01 &&
    totalCbm > 0
  ) {
    warnings.cbm = `Sum of container items is ${totalCbm.toFixed(2)} CBM`;
  }

  return { errors, warnings };
});

const jobErrors = computed(() => {
  const errors: Record<string, string> = {};
  if (formData.hsCode) {
    const digits = formData.hsCode.replace(/\D/g, "");
    if (digits.length > 0 && digits.length < 6) {
      errors.hsCode = "Min. 6 digits";
    }
  }
  return errors;
});
// -----------------------------------

// Constants for dropdowns (using generic IDs/Names, adjust based on backend reference data if needed)
const TRADE_TYPES = [
  { id: "EXPORT", name: "Export" },
  { id: "IMPORT", name: "Import" },
];

const CARGO_MOVEMENTS = [
  { id: "FCL_FCL", name: "FCL/FCL" },
  { id: "LCL_LCL", name: "LCL/LCL" },
  { id: "FCL_LCL", name: "FCL/LCL" },
  { id: "LCL_FCL", name: "LCL/FCL" },
];

const DELIVERY_MOVEMENTS = [
  { id: "CY_CY", name: "CY-CY" },
  { id: "CY_DOOR", name: "CY-DOOR" },
  { id: "DOOR_CY", name: "DOOR-CY" },
  { id: "DOOR_DOOR", name: "DOOR-DOOR" },
];

const BL_TYPES = [
  { id: "DRAFT", name: "DRAFT" },
  { id: "ORIGINAL", name: "ORIGINAL" },
  { id: "SEAWAYBILL", name: "SEAWAYBILL" },
];

const FREIGHT_TERMS = [
  { id: "PREPAID", name: "PREPAID" },
  { id: "COLLECT", name: "COLLECT" },
];

const SECTIONS = [
  { id: "job-info", label: "Job Information", step: 1 },
  { id: "parties", label: "Involved Parties", step: 2 },
  { id: "route", label: "Route Details", step: 3 },
  { id: "cargo", label: "Cargo Information", step: 4 },
  { id: "movement", label: "Movement & Schedule", step: 5 },
  { id: "weight", label: "Weight & Measurement", step: 6 },
  { id: "bl", label: "BL Setup", step: 7 },
];

const activeSection = ref("job-info");
const isManualScroll = ref(false);
let manualScrollTimeout: number | undefined;

function handleCreateCompany(
  name: string,
  field: "shipperId" | "consigneeId" | "notifyPartyId" | "forwarderId" | "customerId",
) {
  // Open the Modal and preset the name
  companyForm.name = name;
  companyForm.fullAddress = "";
  companyForm.street = "";
  companyForm.city = "";
  companyForm.state = "";
  companyForm.postalCode = "";
  companyForm.country = "Indonesia";
  companyForm.eori = "";
  companyForm.taxId = "";

  activeCompanyField.value = field;
  isCompanyModalOpen.value = true;
}

async function submitCompanyForm() {
  if (!companyForm.name) {
    toast.error("Company Name is required.");
    return;
  }

  try {
    isSubmittingCompany.value = true;

    const addressPayload =
      companyForm.fullAddress || companyForm.city || companyForm.taxId
        ? {
            fullAddress: companyForm.fullAddress || companyForm.city || "-", // fallback if only city is provided
            street: companyForm.street,
            city: companyForm.city,
            state: companyForm.state,
            postalCode: companyForm.postalCode,
            country: companyForm.country,
            eori: companyForm.eori,
            taxId: companyForm.taxId,
          }
        : undefined;

    const result = await createCompany(companyForm.name, addressPayload);

    if (result.success && result.data && result.data.id) {
      await refreshMasterData();

      // Auto-assign the created company to the active field
      if (activeCompanyField.value) {
        formData[activeCompanyField.value] = result.data.id;
      }

      // Close Modal
      isCompanyModalOpen.value = false;
    } else {
      toast.error("Failed to create company: " + (result.error || "Unknown error"));
    }
  } catch (error: unknown) {
    toast.error("Failed to create company: " + (error as Error)?.message);
  } finally {
    isSubmittingCompany.value = false;
  }
}

async function handleCreateVessel(
  name: string,
  vessel?: {
    vesselId: string;
    vesselName: string;
    voyageNumber: string;
    etd: string;
    sequence: number;
  },
) {
  const isConfirmed = await confirm({
    title: "Create New Vessel",
    message: `Are you sure you want to create a new vessel named "${name}"?`,
    confirmText: "Create Vessel",
    type: "info",
  });
  if (!isConfirmed) return;

  const result = await createVessel(name);
  if (result.success && result.data) {
    await refreshMasterData();
    if (vessel) {
      vessel.vesselId = result.data.id;
    } else {
      if (formData.vessels[0]) {
        formData.vessels[0].vesselId = result.data.id;
      }
    }
    toast.success(`Vessel "${name}" created successfully.`);
  } else {
    toast.error("Failed to create vessel: " + (result.error || "Unknown error"));
  }
}

async function handleSubmit(isDraft: boolean = false) {
  if (
    !formData.shipperId ||
    !formData.consigneeId ||
    !formData.customerId ||
    !formData.blType ||
    !formData.freightTerm
  ) {
    toast.error("Please fill in Shipper, Consignee, Job Customer, Freight Term, and BL Type.");
    return;
  }

  // Pre-submit Validations
  if (!isDraft) {
    if (!formData.grossWeight || formData.grossWeight <= 0) {
      toast.error("Gross Weight must be greater than 0 before finalizing the job.");
      return;
    }
    if (!formData.measurement || formData.measurement <= 0) {
      toast.error("Measurement (CBM) must be greater than 0 before finalizing the job.");
      return;
    }
    const validContainers = formData.containers.filter((c) => c.containerNumber && c.sealNumber);
    if (validContainers.length === 0) {
      toast.error(
        "At least one fully detailed Container (with Container No and Seal No) is required.",
      );
      return;
    }
  }

  // CreateJob payload
  const payload: CreateJob = {
    shipperId: formData.shipperId,
    customerId: formData.customerId,
    shipperAddressId: formData.shipperAddressId || undefined,
    consigneeId: formData.consigneeId,
    consigneeAddressId: formData.consigneeAddressId || undefined,
    notifyPartyId: formData.notifyPartyId || undefined,
    notifyPartyAddressId: formData.notifyPartyAddressId || undefined,
    forwarderId: formData.forwarderId || undefined,
    forwarderAddressId: formData.forwarderAddressId || undefined,
    commodity: formData.commodity,
    hsCode: formData.hsCode || undefined,
    freightTerm: (formData.freightTerm as "PREPAID" | "COLLECT") || undefined,
    containers: formData.containers.filter((c) => c.containerNumber),
    pol: formData.pol,
    pod: formData.pod,
    vessels: formData.vessels.map((v) => ({
      vesselId: v.vesselId || null,
      vesselName: v.vesselName || null,
      voyageNumber: v.voyageNumber || null,
      etd: v.etd || null,
      sequence: v.sequence,
    })),
    preCarriageBy: formData.preCarriageBy || undefined,
    placeOfReceipt: formData.placeOfReceipt || undefined,
    placeOfDelivery: formData.placeOfDelivery || undefined,
    finalDestination: formData.finalDestination || undefined,
    etd: formData.vessels[0]?.etd || undefined, // Fallback for main ETD
    eta: formData.eta || undefined,
    totalBlCount: formData.totalBlCount || 1,
    blType: (formData.blType as "ORIGINAL" | "DRAFT" | "SEAWAYBILL") || undefined,
    isNegotiable: formData.isNegotiable,
    placeOfIssue: formData.placeOfIssue || undefined,
    dateOfIssue: formData.dateOfIssue || undefined,

    tradeTypeId: formData.tradeTypeId || undefined,
    cargoMovementId: formData.cargoMovementId || undefined,
    deliveryMovementId: formData.deliveryMovementId || undefined,
    grossWeight: formData.grossWeight ?? null,
    netWeight: formData.netWeight ?? null,
    measurement: formData.measurement ?? null,
    shippingMark: formData.shippingMark || undefined,
  };

  const { success, error } = await createJob(payload);

  if (success) {
    toast.success("Job created successfully.");
    router.push("/operational/jobs");
  } else {
    let errorMsg =
      typeof error === "string"
        ? error
        : ((error as unknown as Record<string, unknown>)?.message as string) || "Unknown error";
    try {
      let jsonStr = "";
      if (typeof error === "string" && error.startsWith("[")) {
        jsonStr = error;
      } else if (
        error &&
        typeof error === "object" &&
        typeof (error as unknown as Record<string, unknown>).message === "string" &&
        ((error as unknown as Record<string, unknown>).message as string).startsWith("[")
      ) {
        jsonStr = (error as unknown as Record<string, unknown>).message as string;
      }

      if (jsonStr) {
        const parsed = JSON.parse(jsonStr);
        if (Array.isArray(parsed) && parsed.length > 0) {
          errorMsg = parsed.map((e: Record<string, unknown>) => e.message as string).join("\n");
        }
      }
    } catch (e) {
      /* ignore parse error, use original string */
    }
    toast.error("Failed to create job:\n" + errorMsg);
  }
}

function getCompany(id: string) {
  return companies.value.find((c) => c.id === id);
}

function getCompanyDetails(id: string, addressId?: string) {
  const company = getCompany(id);
  if (!company) return null;
  const address = addressId
    ? company.addresses?.find((a) => a.id === addressId)
    : company.addresses?.find((a) => a.isDefault) || company.addresses?.[0];

  return {
    fullAddress: address?.fullAddress || "-",
    country: address?.country || "-",
    city: address?.city || "-",
    taxId: address?.taxId || "-",
  };
}

// Intersection Observer for Scroll Spy
onMounted(() => {
  const handleScroll = () => {
    if (isManualScroll.value) return;

    // Fallback for bottom of the page
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50) {
      const lastSection = SECTIONS[SECTIONS.length - 1];
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
      // More relaxed margins to capture sections in the upper half
      rootMargin: "-160px 0px -40% 0px",
      threshold: 0,
    },
  );

  window.addEventListener("scroll", handleScroll, { passive: true });

  // Observe all sections
  setTimeout(() => {
    SECTIONS.forEach((section) => {
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
    const y = el.getBoundingClientRect().top + window.scrollY - 160; // Offset for both main and sub headers
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
            to="/operational/jobs"
            class="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft class="w-5 h-5" />
          </NuxtLink>
          <h1 class="text-xl font-bold flex items-center gap-2 text-foreground">
            <Briefcase class="w-5 h-5 text-[#062c58]" />
            Create Job
          </h1>
        </div>
        <div class="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            type="button"
            @click="router.back()"
            class="btn-outline flex-1 sm:flex-none justify-center sm:justify-start px-4"
            :disabled="isLoading"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="handleSubmit(true)"
            class="inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 shadow-sm flex-1 sm:flex-none"
            :disabled="isLoading"
          >
            <Save class="w-4 h-4 mr-2 opacity-70" />
            Save Draft
          </button>
          <button
            type="button"
            @click="handleSubmit(false)"
            class="btn-primary flex-1 sm:flex-none justify-center bg-[#062c58] hover:bg-[#062c58]/90 text-white shadow-sm"
            :disabled="isLoading"
          >
            <Save class="w-4 h-4 mr-2" />
            {{ isLoading ? "Creating..." : "Create Job" }}
          </button>
        </div>
      </header>
    </div>

    <div class="flex gap-8 relative items-start">
      <!-- Sidebar Navigation -->
      <aside class="w-60 shrink-0 hidden lg:block sticky top-[165px] h-fit">
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
          <!-- Job Information -->
          <SectionCard id="job-info" title="Job Information" :icon="Briefcase">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-6">
              <div class="space-y-2">
                <div class="h-6 flex items-center">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                    >JOB NUMBER</label
                  >
                </div>
                <input
                  type="text"
                  placeholder="Auto-generated"
                  class="input-field bg-muted/30 cursor-not-allowed border-dashed"
                  disabled
                />
              </div>

              <!-- Job Customer / Billing Party -->
              <div class="space-y-2">
                <div class="h-6 flex items-center justify-between">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                  >
                    JOB CUSTOMER <span class="text-destructive">*</span>
                  </label>
                  <div class="flex gap-2">
                    <button
                      v-if="formData.shipperId"
                      type="button"
                      @click="formData.customerId = formData.shipperId"
                      class="text-[9px] font-bold text-blue-600 hover:underline uppercase"
                    >
                      Use Shipper
                    </button>
                    <button
                      v-if="formData.consigneeId"
                      type="button"
                      @click="formData.customerId = formData.consigneeId"
                      class="text-[9px] font-bold text-blue-600 hover:underline uppercase"
                    >
                      Use Consignee
                    </button>
                  </div>
                </div>
                <Combobox
                  v-model="formData.customerId"
                  :options="companies"
                  label-key="name"
                  value-key="id"
                  placeholder="Select Main Customer..."
                  allow-create
                  @create="(name) => handleCreateCompany(name, 'shipperId')"
                />
              </div>

              <!-- Trade Type / Service -->
              <div class="space-y-2">
                <div class="h-6 flex items-center">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                    >SERVICE TYPE <span class="text-destructive">*</span></label
                  >
                </div>
                <Combobox v-model="formData.tradeTypeId" :options="TRADE_TYPES" />
              </div>
              <div class="space-y-2">
                <div class="h-6 flex items-center">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                    >STATUS</label
                  >
                </div>
                <div class="h-11 flex items-center">
                  <span
                    class="inline-flex items-center px-3 py-1 rounded-lg text-[12px] font-bold uppercase tracking-wider bg-blue-50/50 text-blue-700 border border-blue-200/50"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
                    Draft
                  </span>
                </div>
              </div>
              <div class="space-y-2">
                <div class="h-6 flex items-center">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                    >CREATED BY</label
                  >
                </div>
                <div class="h-11 flex items-center gap-2.5">
                  <div
                    class="w-8 h-8 rounded-full bg-[#062c58]/10 text-[#062c58] flex items-center justify-center text-[12px] font-black border border-[#062c58]/10 shadow-sm"
                  >
                    {{ user?.name ? user.name.substring(0, 2).toUpperCase() : "AD" }}
                  </div>
                  <span class="text-sm font-semibold text-foreground/80">{{
                    user?.name || "Administrator"
                  }}</span>
                </div>
              </div>
            </div>
          </SectionCard>

          <!-- Involved Parties -->
          <SectionCard id="parties" title="Involved Parties" :icon="Users" no-padding>
            <div class="w-full">
              <div
                class="grid grid-cols-12 gap-6 px-6 py-4 border-b border-border/40 bg-muted/5 text-[11px] font-bold text-muted-foreground/70 tracking-widest uppercase"
              >
                <div class="col-span-2">ROLE</div>
                <div class="col-span-4 pl-1">COMPANY</div>
                <div class="col-span-4 pl-1">ADDRESS</div>
                <div class="col-span-2">DETAILS</div>
              </div>

              <div class="divide-y divide-border/50">
                <JobPartyRow
                  label="Shipper"
                  required
                  :companies="companies"
                  v-model:companyId="formData.shipperId"
                  v-model:addressId="formData.shipperAddressId"
                  z-index="40"
                  @create="(name) => handleCreateCompany(name, 'shipperId')"
                />

                <JobPartyRow
                  label="Consignee"
                  required
                  :companies="companies"
                  v-model:companyId="formData.consigneeId"
                  v-model:addressId="formData.consigneeAddressId"
                  z-index="30"
                  @create="(name) => handleCreateCompany(name, 'consigneeId')"
                />

                <JobPartyRow
                  label="Notify Party"
                  :companies="companies"
                  v-model:companyId="formData.notifyPartyId"
                  v-model:addressId="formData.notifyPartyAddressId"
                  z-index="20"
                  has-extra-controls
                  :disabled-company="formData.isNotifySameAsConsignee"
                  @create="(name) => handleCreateCompany(name, 'notifyPartyId')"
                >
                  <template #extra-controls>
                    <label
                      class="flex items-center gap-2 text-[14px] text-muted-foreground cursor-pointer hover:text-foreground transition-colors group w-fit mb-1.5"
                    >
                      <input
                        type="checkbox"
                        v-model="formData.isNotifySameAsConsignee"
                        class="rounded border-input text-primary focus:ring-primary h-4 w-4 bg-background transition-all"
                      />
                      <span class="group-hover:underline">Same as Consignee</span>
                    </label>
                  </template>
                </JobPartyRow>

                <JobPartyRow
                  label="Forwarder"
                  description="(Optional)"
                  :companies="companies"
                  v-model:companyId="formData.forwarderId"
                  v-model:addressId="formData.forwarderAddressId"
                  z-index="10"
                  @create="(name) => handleCreateCompany(name, 'forwarderId')"
                />
              </div>
            </div>
          </SectionCard>

          <!-- Route Details -->
          <SectionCard id="route" title="Route Details" :icon="MapPin">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 relative items-end pb-4">
              <!-- Row 1: Pre-Carriage & Place of Receipt -->
              <div class="space-y-2">
                <label class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                  >PRE-CARRIAGE BY</label
                >
                <input
                  v-model="formData.preCarriageBy"
                  type="text"
                  placeholder="e.g. TRUCK"
                  class="input-field"
                />
              </div>
              <div class="space-y-2">
                <label class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                  >PLACE OF RECEIPT</label
                >
                <input
                  v-model="formData.placeOfReceipt"
                  type="text"
                  placeholder="Defaults to POL if empty"
                  class="input-field"
                />
              </div>

              <!-- Row 2: POL & POD -->
              <div class="space-y-2 relative">
                <label class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                  >PORT OF LOADING (POL)</label
                >
                <div class="relative group">
                  <MapPin
                    class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors z-10 pointer-events-none"
                  />
                  <Combobox
                    v-model="formData.pol"
                    :options="portsPol"
                    label-key="name"
                    value-key="code"
                    placeholder="Search port..."
                    class="[&_button]:pl-10"
                    :class="{
                      '[&_button]:border-destructive [&_button]:ring-destructive/20':
                        routeErrors.polPod,
                    }"
                    :filter-local="false"
                    @search="handleSearchPol"
                  />
                </div>
                <p v-if="routeErrors.polPod" class="text-[10px] text-destructive font-medium mt-1">
                  {{ routeErrors.polPod }}
                </p>
              </div>

              <!-- Visual connector for POL -> POD -->
              <div
                class="hidden md:flex absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 z-20"
              >
                <div
                  class="w-8 h-8 rounded-full bg-white border border-border shadow-sm flex items-center justify-center text-muted-foreground/40"
                >
                  <ArrowLeft class="w-3.5 h-3.5 rotate-180" />
                </div>
              </div>

              <div class="space-y-2 relative">
                <label class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                  >PORT OF DISCHARGE (POD)</label
                >
                <div class="relative group">
                  <MapPin
                    class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors z-10 pointer-events-none"
                  />
                  <Combobox
                    v-model="formData.pod"
                    :options="portsPod"
                    label-key="name"
                    value-key="code"
                    placeholder="Search port..."
                    class="[&_button]:pl-10"
                    :class="{
                      '[&_button]:border-destructive [&_button]:ring-destructive/20':
                        routeErrors.polPod,
                    }"
                    :filter-local="false"
                    @search="handleSearchPod"
                  />
                </div>
                <p v-if="routeErrors.polPod" class="text-[10px] text-destructive font-medium mt-1">
                  {{ routeErrors.polPod }}
                </p>
              </div>

              <!-- Row 3: Place of Delivery & Final Destination -->
              <div class="space-y-2">
                <label class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                  >PLACE OF DELIVERY</label
                >
                <input
                  v-model="formData.placeOfDelivery"
                  type="text"
                  placeholder="Defaults to POD if empty"
                  class="input-field"
                />
              </div>
              <div class="space-y-2">
                <label class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                  >FINAL DESTINATION</label
                >
                <input
                  v-model="formData.finalDestination"
                  type="text"
                  placeholder="Defaults to POD if empty"
                  class="input-field"
                />
              </div>
            </div>
          </SectionCard>

          <!-- Cargo Information -->
          <SectionCard id="cargo" title="Cargo Information" :icon="Box">
            <div class="space-y-6">
              <div class="space-y-2">
                <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
                  >HS CODE / COMMODITY</label
                >
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div class="md:col-span-1">
                    <input
                      v-model="formData.hsCode"
                      type="text"
                      placeholder="e.g. 1902..."
                      class="input-field"
                      :class="{
                        '!border-destructive focus:!ring-destructive/20': jobErrors.hsCode,
                      }"
                      required
                    />
                    <p
                      v-if="jobErrors.hsCode"
                      class="text-[10px] text-destructive mt-1 font-medium"
                    >
                      {{ jobErrors.hsCode }}
                    </p>
                  </div>
                  <div class="md:col-span-3">
                    <textarea
                      v-model="formData.commodity"
                      rows="6"
                      placeholder="e.g. 3317 CARTONS OF INSTANT NOODLES"
                      class="input-field min-h-[120px] py-3 resize-y transition-all duration-200"
                      required
                    ></textarea>
                  </div>
                </div>
              </div>

              <div class="space-y-2 md:col-span-4">
                <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
                  >MAIN DESCRIPTION (OVERALL COMMODITY)</label
                >
                <textarea
                  v-model="formData.mainDescription"
                  rows="8"
                  placeholder="Description of goods to appear on BL..."
                  class="input-field min-h-[150px] py-3 resize-y transition-all duration-200"
                ></textarea>
              </div>

              <!-- Dynamic Containers List -->
              <div class="border border-border/60 rounded-xl mt-8 overflow-hidden bg-muted/5">
                <div
                  class="bg-muted/10 px-5 py-3.5 border-b border-border/50 flex justify-between items-center"
                >
                  <div class="flex items-center gap-2">
                    <Box class="w-4 h-4 text-primary/70" />
                    <h3
                      class="font-semibold text-[14px] uppercase tracking-wider text-foreground/80"
                    >
                      Containers & Seals
                    </h3>
                  </div>
                  <button
                    type="button"
                    @click="
                      formData.containers.push({
                        id: Date.now(),
                        containerNumber: '',
                        sealNumber: '',
                        containerTypeId: '',
                        isHazardous: false,
                        items: [
                          {
                            id: Date.now() + 1,
                            sequenceNo: 1,
                            qty: 1,
                            packageTypeCode: '',
                            grossWeight: null,
                            netWeight: null,
                            measurementCbm: null,
                            hsCode: '',
                            description: '',
                          },
                        ],
                      })
                    "
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/20 bg-primary/5 text-primary text-xs font-semibold hover:bg-primary/10 transition-colors"
                  >
                    <Plus class="w-3.5 h-3.5" />
                    Add Container
                  </button>
                </div>
                <div class="p-5 space-y-8">
                  <div
                    v-for="(container, index) in formData.containers"
                    :key="container.id"
                    class="space-y-5 pb-8 border-b border-border/40 last:border-0 last:pb-0 relative group"
                  >
                    <!-- Floating Index -->
                    <div
                      class="absolute -left-2 top-0 w-6 h-6 rounded-full bg-white border border-border shadow-sm flex items-center justify-center text-[11px] font-bold text-muted-foreground z-10 group-hover:border-primary/30 group-hover:text-primary transition-colors"
                    >
                      {{ index + 1 }}
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-12 gap-5 items-end pl-6">
                      <div class="col-span-3 space-y-2">
                        <label
                          class="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest pl-1"
                          >Type</label
                        >
                        <Combobox
                          v-model="container.containerTypeId"
                          :options="containerTypes"
                          placeholder="Select..."
                        />
                      </div>
                      <div class="md:col-span-4 space-y-2">
                        <label
                          class="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest pl-1"
                          >Container No.</label
                        >
                        <input
                          v-model="container.containerNumber"
                          type="text"
                          placeholder="TEMU1234567"
                          class="input-field uppercase tracking-wider font-mono text-xs"
                          :class="{
                            '!border-destructive focus:!ring-destructive/20':
                              containerErrors[container.id],
                          }"
                        />
                        <p
                          v-if="containerErrors[container.id]"
                          class="text-[10px] text-destructive mt-1 font-medium"
                        >
                          {{ containerErrors[container.id] }}
                        </p>
                      </div>
                      <div class="md:col-span-4 space-y-2">
                        <label
                          class="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest pl-1"
                          >Seal No.</label
                        >
                        <input
                          v-model="container.sealNumber"
                          type="text"
                          placeholder="SN123456"
                          class="input-field uppercase tracking-wider font-mono text-xs"
                        />
                      </div>
                      <div class="md:col-span-1 flex flex-col items-center justify-center pb-2">
                        <label
                          class="text-[11px] font-bold text-muted-foreground/70 uppercase mb-2 tracking-widest"
                          >HM</label
                        >
                        <input
                          type="checkbox"
                          v-model="container.isHazardous"
                          class="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer transition-all"
                        />
                      </div>
                    </div>

                    <!-- Delete Container Button (only visible on hover or if more than 1) -->
                    <div
                      v-if="formData.containers.length > 1"
                      class="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <button
                        type="button"
                        @click="formData.containers.splice(index, 1)"
                        class="w-8 h-8 rounded-full bg-white border border-destructive/20 text-destructive hover:bg-destructive hover:text-white flex items-center justify-center shadow-sm transition-all"
                      >
                        <Trash2 class="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <!-- Nested Items Breakdown -->
                    <div class="ml-6 pl-6 border-l-2 border-primary/10 space-y-4">
                      <div class="flex items-center justify-between pt-1">
                        <div class="flex items-center gap-2">
                          <span class="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                          <h4
                            class="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest"
                          >
                            Breakdown Items
                          </h4>
                        </div>
                        <button
                          type="button"
                          @click="
                            container.items.push({
                              id: Date.now(),
                              sequenceNo: container.items.length + 1,
                              qty: 1,
                              packageTypeCode: '',
                              grossWeight: null,
                              netWeight: null,
                              measurementCbm: null,
                              hsCode: '',
                              description: '',
                            })
                          "
                          class="text-[11px] text-primary hover:text-primary/80 font-bold uppercase tracking-widest flex items-center gap-1.5 transition-colors"
                        >
                          <Plus class="w-3 h-3" /> Add Item
                        </button>
                      </div>

                      <div class="grid grid-cols-1 gap-4">
                        <div
                          v-for="(item, itemIndex) in container.items"
                          :key="item.id"
                          class="p-4 bg-white/60 border border-border/40 rounded-xl shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 relative group/item"
                        >
                          <div class="grid grid-cols-12 gap-x-4 gap-y-3">
                            <div class="col-span-2 space-y-1.5 relative">
                              <label
                                class="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest pl-0.5"
                                >Qty</label
                              >
                              <div>
                                <input
                                  type="number"
                                  v-model.number="item.qty"
                                  class="input-field h-9 text-xs"
                                  :class="{
                                    '!border-destructive focus:!ring-destructive/20':
                                      containerErrors[`${container.id}-${item.id}-qty`],
                                  }"
                                />
                                <p
                                  v-if="containerErrors[`${container.id}-${item.id}-qty`]"
                                  class="text-[8.5px] leading-tight text-destructive mt-0.5 font-medium absolute"
                                >
                                  {{ containerErrors[`${container.id}-${item.id}-qty`] }}
                                </p>
                              </div>
                            </div>
                            <div class="col-span-3 space-y-1.5">
                              <label
                                class="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest pl-0.5"
                                >Unit</label
                              >
                              <Combobox
                                v-model="item.packageTypeCode"
                                :options="packageTypes"
                                value-key="code"
                                label-key="code"
                                placeholder="PKGS"
                                class="h-9"
                              />
                            </div>
                            <div class="col-span-2 space-y-1.5 relative">
                              <label
                                class="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest pl-0.5"
                                >GW (KG)</label
                              >
                              <div>
                                <input
                                  type="number"
                                  v-model.number="item.grossWeight"
                                  step="0.01"
                                  class="input-field h-9 text-xs"
                                  :class="{
                                    '!border-destructive focus:!ring-destructive/20':
                                      containerErrors[`${container.id}-${item.id}-gw`],
                                  }"
                                />
                                <p
                                  v-if="containerErrors[`${container.id}-${item.id}-gw`]"
                                  class="text-[8.5px] leading-tight text-destructive mt-0.5 font-medium absolute"
                                >
                                  {{ containerErrors[`${container.id}-${item.id}-gw`] }}
                                </p>
                              </div>
                            </div>
                            <div class="col-span-2 space-y-1.5 relative">
                              <label
                                class="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest pl-0.5"
                                >NW (KG)</label
                              >
                              <div>
                                <input
                                  type="number"
                                  v-model.number="item.netWeight"
                                  step="0.01"
                                  class="input-field h-9 text-xs"
                                  :class="{
                                    '!border-destructive focus:!ring-destructive/20':
                                      containerErrors[`${container.id}-${item.id}-nw`],
                                  }"
                                />
                                <p
                                  v-if="containerErrors[`${container.id}-${item.id}-nw`]"
                                  class="text-[8.5px] leading-tight text-destructive mt-0.5 font-medium absolute"
                                >
                                  {{ containerErrors[`${container.id}-${item.id}-nw`] }}
                                </p>
                              </div>
                            </div>
                            <div class="col-span-3 space-y-1.5 relative">
                              <label
                                class="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest pl-0.5"
                                >CBM</label
                              >
                              <div>
                                <input
                                  type="number"
                                  v-model.number="item.measurementCbm"
                                  step="0.01"
                                  class="input-field h-9 text-xs"
                                  :class="{
                                    '!border-destructive focus:!ring-destructive/20':
                                      containerErrors[`${container.id}-${item.id}-cbm`],
                                  }"
                                />
                                <p
                                  v-if="containerErrors[`${container.id}-${item.id}-cbm`]"
                                  class="text-[8.5px] leading-tight text-destructive mt-0.5 font-medium absolute"
                                >
                                  {{ containerErrors[`${container.id}-${item.id}-cbm`] }}
                                </p>
                              </div>
                            </div>

                            <div class="col-span-4 space-y-1.5 relative">
                              <label
                                class="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest pl-0.5"
                                >HS Code</label
                              >
                              <div>
                                <input
                                  type="text"
                                  v-model="item.hsCode"
                                  class="input-field h-9 text-xs placeholder:opacity-40"
                                  :class="{
                                    '!border-destructive focus:!ring-destructive/20':
                                      containerErrors[`${container.id}-${item.id}-hscode`],
                                  }"
                                  placeholder="1902..."
                                />
                                <p
                                  v-if="containerErrors[`${container.id}-${item.id}-hscode`]"
                                  class="text-[8.5px] leading-tight text-destructive mt-0.5 font-medium absolute"
                                >
                                  {{ containerErrors[`${container.id}-${item.id}-hscode`] }}
                                </p>
                              </div>
                            </div>
                            <div class="col-span-8 space-y-1.5">
                              <label
                                class="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest pl-0.5"
                                >Description Breakdown</label
                              >
                              <textarea
                                v-model="item.description"
                                rows="2"
                                class="input-field min-h-[44px] h-11 py-2 text-xs placeholder:opacity-40 resize-none"
                                placeholder="Breakdown description..."
                              ></textarea>
                            </div>
                          </div>

                          <!-- Delete Item Button -->
                          <button
                            v-if="container.items.length > 1"
                            type="button"
                            @click="container.items.splice(itemIndex, 1)"
                            class="absolute -right-1.5 -top-1.5 w-6 h-6 rounded-full bg-white border border-destructive/10 text-destructive opacity-0 group-item/hover:opacity-100 transition-all flex items-center justify-center hover:bg-destructive hover:text-white"
                          >
                            <Trash2 class="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
                  >SHIPPING MARKS</label
                >
                <textarea
                  v-model="formData.shippingMark"
                  rows="6"
                  placeholder="Enter marks and numbers..."
                  class="input-field min-h-[120px] py-3 resize-y transition-all duration-200"
                ></textarea>
              </div>
            </div>
          </SectionCard>

          <!-- Movement & Schedule -->
          <SectionCard id="movement" title="Movement & Schedule" :icon="Clock">
            <div class="space-y-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-border/40">
                <!-- Cargo Movement -->
                <div class="space-y-2">
                  <label
                    class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
                    >CARGO MOVEMENT <span class="text-destructive">*</span></label
                  >
                  <Combobox v-model="formData.cargoMovementId" :options="CARGO_MOVEMENTS" />
                </div>

                <!-- Delivery Movement -->
                <div class="space-y-2">
                  <label
                    class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
                    >DELIVERY MOVEMENT <span class="text-destructive">*</span></label
                  >
                  <Combobox v-model="formData.deliveryMovementId" :options="DELIVERY_MOVEMENTS" />
                </div>
              </div>

              <!-- Multi-Vessel List -->
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <h4
                    class="text-sm font-bold text-foreground/80 uppercase tracking-widest flex items-center gap-2"
                  >
                    <div class="w-1.5 h-4 bg-primary rounded-full"></div>
                    Vessel Schedule
                  </h4>
                  <button
                    type="button"
                    @click="
                      formData.vessels.push({
                        id: Date.now(),
                        vesselId: '',
                        vesselName: '',
                        voyageNumber: '',
                        etd: '',
                        sequence: formData.vessels.length,
                      })
                    "
                    class="btn-secondary py-1.5 px-3 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all hover:ring-2 hover:ring-primary/20"
                  >
                    <Plus class="w-3.5 h-3.5" /> Add Vessel
                  </button>
                </div>

                <div class="space-y-4">
                  <div
                    v-for="(vessel, vIndex) in formData.vessels"
                    :key="vessel.id"
                    class="p-5 bg-muted/30 border border-border/40 rounded-2xl relative group/vessel transition-all hover:bg-white hover:shadow-md hover:border-primary/20"
                  >
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
                      <!-- Vessel Selection -->
                      <div class="md:col-span-5 space-y-2">
                        <label
                          class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1"
                        >
                          {{ vIndex === 0 ? "Feeder / First Vessel" : "Vessel " + (vIndex + 1) }}
                        </label>
                        <Combobox
                          v-model="vessel.vesselId"
                          :options="vessels"
                          label-key="name"
                          value-key="id"
                          placeholder="Search Vessel..."
                          allow-create
                          @create="(name) => handleCreateVessel(name, vessel)"
                          class="h-10"
                        />
                      </div>

                      <!-- Voyage Number -->
                      <div class="md:col-span-3 space-y-2">
                        <label
                          class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1"
                          >Voyage No</label
                        >
                        <input
                          v-model="vessel.voyageNumber"
                          type="text"
                          class="input-field h-10"
                          placeholder="Voyage..."
                        />
                      </div>

                      <!-- ETD -->
                      <div class="md:col-span-3 space-y-2">
                        <label
                          class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1"
                          >ETD</label
                        >
                        <DatePicker v-model="vessel.etd" placeholder="Select ETD..." class="h-10" />
                      </div>

                      <!-- Remove Button -->
                      <div
                        class="md:col-span-1 flex justify-end pb-1"
                        v-if="formData.vessels.length > 1"
                      >
                        <button
                          type="button"
                          @click="formData.vessels.splice(vIndex, 1)"
                          class="w-10 h-10 rounded-xl bg-white border border-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive hover:text-white transition-all shadow-sm"
                        >
                          <Trash2 class="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- ETA (Usually for the last vessel, but keeping it at section level for now) -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                  <div class="space-y-2">
                    <label
                      class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
                      >Final ETA</label
                    >
                    <DatePicker
                      v-model="formData.eta"
                      placeholder="Select Final ETA..."
                      :class="{
                        '[&_button]:border-destructive [&_button]:ring-destructive/20':
                          scheduleErrors.eta,
                      }"
                    />
                    <p
                      v-if="scheduleErrors.eta"
                      class="text-[10px] text-destructive mt-1 font-medium"
                    >
                      {{ scheduleErrors.eta }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          <!-- Weight & Measurement -->
          <SectionCard id="weight" title="Weight & Measurement" :icon="Scale">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div class="relative space-y-2">
                <label class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                  >GROSS WT</label
                >
                <div class="relative group">
                  <input
                    v-model.number="formData.grossWeight"
                    type="number"
                    step="0.01"
                    class="input-field pr-12 group-hover:border-primary/50 transition-colors"
                    :class="{
                      '!border-destructive focus:!ring-destructive/20':
                        totalErrorsConfigs.errors.gw,
                      '!border-amber-500 focus:!ring-amber-500/20':
                        !totalErrorsConfigs.errors.gw && totalErrorsConfigs.warnings.gw,
                    }"
                    placeholder="0"
                  />
                  <div
                    class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-[11px] font-bold text-muted-foreground"
                    :class="{
                      'text-destructive': totalErrorsConfigs.errors.gw,
                      'text-amber-600':
                        !totalErrorsConfigs.errors.gw && totalErrorsConfigs.warnings.gw,
                    }"
                  >
                    KG
                  </div>
                </div>
                <p
                  v-if="totalErrorsConfigs.errors.gw"
                  class="text-[10px] text-destructive font-medium mt-1"
                >
                  {{ totalErrorsConfigs.errors.gw }}
                </p>
                <p
                  v-else-if="totalErrorsConfigs.warnings.gw"
                  class="text-[10px] text-amber-600 font-medium mt-1"
                >
                  {{ totalErrorsConfigs.warnings.gw }}
                </p>
              </div>
              <div class="relative space-y-2">
                <label class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                  >NET WT</label
                >
                <div class="relative group">
                  <input
                    v-model.number="formData.netWeight"
                    type="number"
                    step="0.01"
                    class="input-field pr-12 group-hover:border-primary/50 transition-colors"
                    :class="{
                      '!border-destructive focus:!ring-destructive/20':
                        totalErrorsConfigs.errors.nw,
                      '!border-amber-500 focus:!ring-amber-500/20':
                        !totalErrorsConfigs.errors.nw && totalErrorsConfigs.warnings.nw,
                    }"
                    placeholder="0"
                  />
                  <div
                    class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-[11px] font-bold text-muted-foreground"
                    :class="{
                      'text-destructive': totalErrorsConfigs.errors.nw,
                      'text-amber-600':
                        !totalErrorsConfigs.errors.nw && totalErrorsConfigs.warnings.nw,
                    }"
                  >
                    KG
                  </div>
                </div>
                <p
                  v-if="totalErrorsConfigs.errors.nw"
                  class="text-[10px] text-destructive font-medium mt-1"
                >
                  {{ totalErrorsConfigs.errors.nw }}
                </p>
                <p
                  v-else-if="totalErrorsConfigs.warnings.nw"
                  class="text-[10px] text-amber-600 font-medium mt-1"
                >
                  {{ totalErrorsConfigs.warnings.nw }}
                </p>
              </div>
              <div class="relative space-y-2">
                <label class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                  >MEAS.</label
                >
                <div class="relative group">
                  <input
                    v-model.number="formData.measurement"
                    type="number"
                    step="0.01"
                    class="input-field pr-14 group-hover:border-primary/50 transition-colors"
                    :class="{
                      '!border-destructive focus:!ring-destructive/20':
                        totalErrorsConfigs.errors.cbm,
                      '!border-amber-500 focus:!ring-amber-500/20':
                        !totalErrorsConfigs.errors.cbm && totalErrorsConfigs.warnings.cbm,
                    }"
                    placeholder="0"
                  />
                  <div
                    class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-[11px] font-bold text-muted-foreground"
                    :class="{
                      'text-destructive': totalErrorsConfigs.errors.cbm,
                      'text-amber-600':
                        !totalErrorsConfigs.errors.cbm && totalErrorsConfigs.warnings.cbm,
                    }"
                  >
                    CBM
                  </div>
                </div>
                <p
                  v-if="totalErrorsConfigs.errors.cbm"
                  class="text-[10px] text-destructive font-medium mt-1"
                >
                  {{ totalErrorsConfigs.errors.cbm }}
                </p>
                <p
                  v-else-if="totalErrorsConfigs.warnings.cbm"
                  class="text-[10px] text-amber-600 font-medium mt-1"
                >
                  {{ totalErrorsConfigs.warnings.cbm }}
                </p>
              </div>
            </div>
          </SectionCard>

          <!-- BL Setup -->
          <SectionCard id="bl" title="BL Setup" :icon="FileText">
            <div class="space-y-10">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- BL Type -->
                <div class="space-y-2">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                    >BL TYPE <span class="text-destructive">*</span></label
                  >
                  <Combobox v-model="formData.blType" :options="BL_TYPES" />
                </div>

                <!-- Freight Term -->
                <div class="space-y-2">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                    >FREIGHT TERM <span class="text-destructive">*</span></label
                  >
                  <Combobox v-model="formData.freightTerm" :options="FREIGHT_TERMS" />
                </div>

                <!-- Total BL Count -->
                <div class="space-y-2">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                    >TOTAL BL COUNT</label
                  >
                  <input
                    v-model.number="formData.totalBlCount"
                    type="number"
                    min="1"
                    class="input-field h-11"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                <!-- Place of Issue -->
                <div class="space-y-2">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                    >PLACE OF ISSUE</label
                  >
                  <input
                    v-model="formData.placeOfIssue"
                    type="text"
                    placeholder="e.g. Jakarta"
                    class="input-field"
                  />
                </div>

                <!-- Date of Issue -->
                <div class="space-y-2">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                    >DATE OF ISSUE</label
                  >
                  <DatePicker v-model="formData.dateOfIssue" placeholder="Select date..." />
                </div>

                <!-- Negotiable Toggle -->
                <div class="h-11 flex items-center">
                  <label class="flex items-center gap-3.5 cursor-pointer group select-none">
                    <div class="relative flex items-center">
                      <input
                        type="checkbox"
                        v-model="formData.isNegotiable"
                        class="w-5 h-5 rounded-md border-border/60 text-primary focus:ring-primary/20 transition-all cursor-pointer shadow-sm"
                      />
                    </div>
                    <div class="flex flex-col">
                      <span
                        class="text-[14px] font-bold text-foreground/80 group-hover:text-primary transition-colors leading-none"
                        >Negotiable BL</span
                      >
                      <span
                        class="text-[11px] font-medium text-muted-foreground/70 mt-1 leading-none tracking-tight"
                        >Requires Original BL</span
                      >
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </main>
    </div>

    <!-- Company Creation Modal -->
    <Modal
      v-model="isCompanyModalOpen"
      title="Add New Company"
      description="Create a new company to use in this job."
      width="max-w-2xl"
    >
      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2 md:col-span-2">
            <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
              >Company Name <span class="text-destructive">*</span></label
            >
            <input
              v-model="companyForm.name"
              type="text"
              placeholder="e.g. PT Maju Bersama"
              class="input-field"
              required
            />
          </div>

          <div class="space-y-2 md:col-span-2">
            <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
              >Full Address</label
            >
            <textarea
              v-model="companyForm.fullAddress"
              rows="2"
              placeholder="e.g. Jl. Raya Perjuangan No.1"
              class="input-field resize-none"
            ></textarea>
          </div>

          <div class="space-y-2">
            <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
              >City</label
            >
            <input
              v-model="companyForm.city"
              type="text"
              placeholder="e.g. Jakarta"
              class="input-field"
            />
          </div>

          <div class="space-y-2">
            <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
              >State / Province</label
            >
            <input
              v-model="companyForm.state"
              type="text"
              placeholder="e.g. DKI Jakarta"
              class="input-field"
            />
          </div>

          <div class="space-y-2">
            <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
              >Postal Code</label
            >
            <input
              v-model="companyForm.postalCode"
              type="text"
              placeholder="e.g. 12345"
              class="input-field"
            />
          </div>

          <div class="space-y-2">
            <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
              >Country</label
            >
            <input
              v-model="companyForm.country"
              type="text"
              placeholder="e.g. Indonesia"
              class="input-field"
            />
          </div>

          <div class="space-y-2">
            <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
              >Tax ID / NPWP</label
            >
            <input
              v-model="companyForm.taxId"
              type="text"
              placeholder="e.g. 01.234.567.8-901.000"
              class="input-field"
            />
          </div>

          <div class="space-y-2">
            <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
              >EORI (Optional)</label
            >
            <input v-model="companyForm.eori" type="text" placeholder="" class="input-field" />
          </div>
        </div>
      </div>
      <template #footer>
        <button
          type="button"
          @click="isCompanyModalOpen = false"
          class="btn-outline justify-center px-4"
          :disabled="isSubmittingCompany"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="submitCompanyForm"
          class="btn-primary justify-center bg-[#062c58] hover:bg-[#062c58]/90 text-white shadow-sm"
          :disabled="isSubmittingCompany || !companyForm.name"
        >
          <Building2 class="w-4 h-4 mr-2" />
          {{ isSubmittingCompany ? "Saving..." : "Save Company" }}
        </button>
      </template>
    </Modal>
  </div>
</template>
