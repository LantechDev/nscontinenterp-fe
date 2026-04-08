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
import type { Company, ContainerType, Vessel, Port } from "~/composables/useMasterData";
import SectionCard from "../components/SectionCard.vue";
import JobPartyRow from "../components/JobPartyRow.vue";

definePageMeta({
  layout: "dashboard",
  title: "Edit Job",
});

const { updateJob, getJob, isLoading: isJobLoading } = useJobs();
const { confirm } = useConfirm();
const {
  fetchCompanies,
  fetchContainerTypes,
  fetchVessels,
  fetchPorts,
  createCompany,
  createVessel,
  fetchPackageTypes,
} = useMasterData();
const router = useRouter();
const route = useRoute();
const jobId = route.params.id as string;
import { toast } from "vue-sonner";

const { user } = useAuth();

const companies = ref<Company[]>([]);
const containerTypes = ref<ContainerType[]>([]);
const packageTypes = ref<PackageType[]>([]);
const vessels = ref<Vessel[]>([]);

const portsPol = ref<Port[]>([]);
const portsPod = ref<Port[]>([]);

const isSubmitting = ref(false);

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

const formData = reactive({
  // Job Info
  tradeTypeId: "EXPORT",

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
  customerReference: "",

  // Containers (BL Ready)
  containers: [
    {
      id: Date.now(),
      containerNumber: "",
      sealNumber: "",
      containerTypeId: "",
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
      isHazardous: false,
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
  vessels: [] as Array<{
    vesselId: string;
    vesselName: string;
    voyageNumber: string;
    etd: string;
    sequence: number;
  }>,
  vesselId: "", // Legacy support
  etd: "", // Legacy support
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
  vendorId: "",
  customerId: "",
});

const jobDetails = ref<JobWithBls | null>(null);

onMounted(async () => {
  await fetchJobData();
  await refreshMasterData(formData.pol, formData.pod);
});

async function fetchJobData() {
  const res = await getJob(jobId);
  if (res.success && res.data) {
    const job = res.data;
    jobDetails.value = job;

    // Map job data to formData
    formData.tradeTypeId =
      job.tradeType?.code || (typeof job.tradeTypeId === "string" ? job.tradeTypeId : "EXPORT");
    formData.pol = job.pol || "";
    formData.pod = job.pod || "";
    formData.voyageNumber = job.voyageNumber || "";
    formData.preCarriageBy = job.preCarriageBy || "";
    formData.placeOfReceipt = job.placeOfReceipt || "";
    formData.placeOfDelivery = job.placeOfDelivery || "";
    formData.finalDestination = job.finalDestination || "";

    // Also try to get route data from BL if not available at job level
    if (!formData.pol && job.billsOfLading && job.billsOfLading.length > 0) {
      formData.pol = job.billsOfLading[0]?.pol || "";
    }
    if (!formData.pod && job.billsOfLading && job.billsOfLading.length > 0) {
      formData.pod = job.billsOfLading[0]?.pod || "";
    }

    formData.commodity = job.commodity || "";
    formData.shippingMark = job.shippingMark || "";
    formData.grossWeight = job.grossWeight != null ? parseFloat(job.grossWeight) : null;
    formData.netWeight = job.netWeight != null ? parseFloat(job.netWeight) : null;
    formData.measurement = job.measurement != null ? parseFloat(job.measurement) : null;
    formData.customerReference = job.customerReference || "";
    formData.cargoMovementId =
      job.cargoMovement?.code ||
      (typeof job.cargoMovementId === "string" ? job.cargoMovementId : "FCL_FCL");
    formData.deliveryMovementId =
      job.deliveryMovement?.code ||
      (typeof job.deliveryMovementId === "string" ? job.deliveryMovementId : "CY_DOOR");
    formData.vesselId = job.vesselId || "";
    formData.vendorId = job.vendorId || "";
    formData.customerId = job.customerId || "";
    formData.etd = job.etd && typeof job.etd === "string" ? (job.etd.split("T")[0] as string) : "";
    formData.eta = job.eta && typeof job.eta === "string" ? (job.eta.split("T")[0] as string) : "";

    // Map Multi-Vessels
    if (job.vessels && job.vessels.length > 0) {
      formData.vessels = job.vessels.map((v) => ({
        vesselId: v.vesselId || "",
        vesselName: v.vesselName || "",
        voyageNumber: v.voyageNumber || "",
        etd: v.etd && typeof v.etd === "string" ? v.etd.split("T")[0] || "" : "",
        sequence: v.sequence || 0,
      }));
    } else {
      // Fallback to legacy single vessel if no JobVessels exist
      formData.vessels = [
        {
          vesselId: job.vesselId || "",
          vesselName: job.vessel?.name || "",
          voyageNumber: job.voyageNumber || "",
          etd: job.etd && typeof job.etd === "string" ? job.etd.split("T")[0] || "" : "",
          sequence: 0,
        },
      ];
    }

    // Also try to get route data from BL if not available at job level
    if (!formData.vesselId && job.billsOfLading && job.billsOfLading.length > 0) {
      formData.vesselId = job.billsOfLading[0]?.vesselId || "";
    }
    if (!formData.etd && job.billsOfLading && job.billsOfLading.length > 0) {
      const blEtd = job.billsOfLading[0]?.etd;
      formData.etd = blEtd && typeof blEtd === "string" ? (blEtd.split("T")[0] as string) : "";
    }
    if (!formData.eta && job.billsOfLading && job.billsOfLading.length > 0) {
      const blEta = job.billsOfLading[0]?.eta;
      formData.eta = blEta && typeof blEta === "string" ? (blEta.split("T")[0] as string) : "";
    }

    formData.totalBlCount = job.totalBlCount || 1;
    formData.hsCode = job.hsCode || "";
    formData.mainDescription = job.mainDescription || "";

    // Also try to get cargo data from BL if not available at job level
    if (!formData.commodity && job.billsOfLading && job.billsOfLading.length > 0) {
      formData.commodity =
        job.billsOfLading[0]?.commodity || job.billsOfLading[0]?.mainDescription || "";
    }
    if (!formData.shippingMark && job.billsOfLading && job.billsOfLading.length > 0) {
      formData.shippingMark = job.billsOfLading[0]?.shippingMark || "";
    }
    if (!formData.hsCode && job.billsOfLading && job.billsOfLading.length > 0) {
      formData.hsCode = job.billsOfLading[0]?.hsCode || "";
    }
    if (!formData.mainDescription && job.billsOfLading && job.billsOfLading.length > 0) {
      formData.mainDescription = (job.billsOfLading[0]?.cargoDescription ||
        job.billsOfLading[0]?.mainDescription ||
        "") as string;
    }

    // Map BL Setup from first BL if available
    if (job.billsOfLading && job.billsOfLading.length > 0) {
      const firstBl = job.billsOfLading[0];
      if (firstBl) {
        formData.freightTerm = firstBl.freightTerm || "PREPAID";
        formData.blType = firstBl.blType || "ORIGINAL";
        formData.placeOfIssue = firstBl.placeOfIssue || "";
        formData.dateOfIssue =
          firstBl.dateOfIssue && typeof firstBl.dateOfIssue === "string"
            ? (firstBl.dateOfIssue.split("T")[0] as string)
            : "";
        formData.isNegotiable = firstBl.isNegotiable || false;
      }
    }

    // Map Parties
    if (job.jobParties) {
      const shipper = job.jobParties.find((p) => p.partyRole?.code === "SHIPPER");
      if (shipper) {
        formData.shipperId = shipper.companyId || "";
        formData.shipperAddressId = (shipper.addressBookId as string) || "";
      }
      const consignee = job.jobParties.find((p) => p.partyRole?.code === "CONSIGNEE");
      if (consignee) {
        formData.consigneeId = consignee.companyId || "";
        formData.consigneeAddressId = (consignee.addressBookId as string) || "";
      }
      const notify = job.jobParties.find((p) => p.partyRole?.code === "NOTIFY_PARTY");
      if (notify) {
        formData.notifyPartyId = notify.companyId || "";
        formData.notifyPartyAddressId = (notify.addressBookId as string) || "";
        formData.isNotifySameAsConsignee = !!(
          notify.companyId &&
          notify.companyId === formData.consigneeId &&
          notify.addressBookId === formData.consigneeAddressId
        );
      }
      const forwarder = job.jobParties.find((p) => p.partyRole?.code === "FORWARDER");
      if (forwarder) {
        formData.forwarderId = forwarder.companyId || "";
        formData.forwarderAddressId = (forwarder.addressBookId as string) || "";
      }
    }

    // Map Containers
    if (job.jobContainers && job.jobContainers.length > 0) {
      formData.containers = job.jobContainers.map((c) => ({
        id: Math.random(),
        containerNumber: c.containerNumber || "",
        sealNumber: c.sealNumber || "",
        containerTypeId: c.containerTypeId || "",
        isHazardous: c.isHazardous || false,
        items:
          c.items && c.items.length > 0
            ? c.items.map((item) => ({
                id: Math.random(),
                sequenceNo: item.sequenceNo || 1,
                qty: item.qty || 1,
                packageTypeCode: item.packageTypeCode || "",
                grossWeight: item.grossWeight ? parseFloat(item.grossWeight) : null,
                netWeight: item.netWeight ? parseFloat(item.netWeight) : null,
                measurementCbm: item.measurementCbm ? parseFloat(item.measurementCbm) : null,
                description: item.description || "",
                hsCode: item.hsCode || "",
              }))
            : [
                {
                  id: Math.random(),
                  sequenceNo: 1,
                  qty: 1,
                  packageTypeCode: "",
                  grossWeight: null,
                  netWeight: null,
                  measurementCbm: null,
                  description: "",
                  hsCode: "",
                },
              ],
      }));
    } else if (job.billsOfLading && job.billsOfLading.length > 0) {
      formData.containers = job.billsOfLading.map((bl) => ({
        id: Math.random(),
        containerNumber: bl.containerNumber || "",
        sealNumber: bl.sealNumber || "",
        containerTypeId: "",
        isHazardous: false,
        items:
          bl.items && bl.items.length > 0
            ? bl.items.map((item) => ({
                id: Math.random(),
                sequenceNo: item.sequenceNo || 1,
                qty: item.qty || 1,
                packageTypeCode: item.packageTypeCode || "",
                grossWeight: item.grossWeight ? parseFloat(item.grossWeight) : null,
                netWeight: item.netWeight ? parseFloat(item.netWeight) : null,
                measurementCbm: item.measurementCbm ? parseFloat(item.measurementCbm) : null,
                description: item.description || "",
                hsCode: item.hsCode || "",
              }))
            : [
                {
                  id: Math.random(),
                  sequenceNo: 1,
                  qty: 1,
                  packageTypeCode: "",
                  grossWeight: null,
                  netWeight: null,
                  measurementCbm: null,
                  description: "",
                  hsCode: "",
                },
              ],
      }));
    }
  } else {
    toast.error("Failed to fetch job data: " + res.error);
    router.push("/operational/jobs");
  }
}

async function refreshMasterData(polCode?: string, podCode?: string) {
  const [comps, types, packs, vess, initialPorts] = await Promise.all([
    fetchCompanies(),
    fetchContainerTypes(),
    fetchPackageTypes(),
    fetchVessels(),
    fetchPorts(),
  ]);
  companies.value = comps;
  containerTypes.value = types;
  packageTypes.value = packs;
  vessels.value = vess;

  // Ensure selected ports are included in the list
  const selectedPol = polCode || formData.pol;
  const selectedPod = podCode || formData.pod;

  portsPol.value = initialPorts;
  portsPod.value = initialPorts;

  // Add selected ports if not already in the list
  if (selectedPol) {
    if (!portsPol.value.find((p) => p.code === selectedPol)) {
      const polPort = await fetchPorts(selectedPol);
      if (polPort.length > 0) {
        portsPol.value = [...portsPol.value, ...polPort];
      }
    }
  }
  if (selectedPod) {
    if (!portsPod.value.find((p) => p.code === selectedPod)) {
      const podPort = await fetchPorts(selectedPod);
      if (podPort.length > 0) {
        portsPod.value = [...portsPod.value, ...podPort];
      }
    }
  }
}

async function handleSearchPol(query: string) {
  portsPol.value = await fetchPorts(query);
}

async function handleSearchPod(query: string) {
  portsPod.value = await fetchPorts(query);
}

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
    // If we already have an address assigned (from fetching data), don't overwrite it unless needed
    if (formData[addressKey] && company.addresses.some((a) => a.id === formData[addressKey])) {
      return;
    }
    const defaultAddr = company.addresses.find((a) => a.isDefault);
    formData[addressKey] = defaultAddr ? defaultAddr.id : company.addresses[0]!.id;
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
    let hasItems = false;

    containers.forEach((container) => {
      if (container.items && Array.isArray(container.items)) {
        container.items.forEach((item) => {
          hasItems = true;
          totalGw += Number(item.grossWeight) || 0;
          totalNw += Number(item.netWeight) || 0;
          totalCbm += Number(item.measurementCbm) || 0;
        });
      }
    });

    // Only update if there are items, to avoid resetting manual input when adding a new empty container
    if (hasItems) {
      // Only overwrite if the calculated sum is greater than 0
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

function handleCreateCompany(
  name: string,
  field: "shipperId" | "consigneeId" | "notifyPartyId" | "forwarderId" | "customerId",
) {
  companyForm.name = name;
  activeCompanyField.value = field;
  isCompanyModalOpen.value = true;
}

async function submitCompanyForm() {
  if (!companyForm.name) return;
  try {
    isSubmittingCompany.value = true;
    const addressPayload =
      companyForm.fullAddress || companyForm.city
        ? {
            fullAddress: companyForm.fullAddress || companyForm.city || "-",
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
    if (result.success && result.data) {
      await refreshMasterData();
      if (activeCompanyField.value) {
        formData[activeCompanyField.value] = result.data.id;
      }
      isCompanyModalOpen.value = false;
    }
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
      vessel.vesselName = result.data.name;
    } else {
      formData.vesselId = result.data.id;
      if (formData.vessels.length > 0 && formData.vessels[0]) {
        formData.vessels[0].vesselId = result.data.id;
        formData.vessels[0].vesselName = result.data.name;
      }
    }
    toast.success(`Vessel "${name}" created successfully.`);
  } else {
    toast.error("Failed to create vessel: " + (result.error || "Unknown error"));
  }
}

async function handleSubmit() {
  if (!formData.shipperId || !formData.consigneeId) {
    toast.error("Please fill in Shipper and Consignee.");
    return;
  }

  try {
    isSubmitting.value = true;
    const payload = {
      ...formData,
      customerId: formData.customerId,
      vendorId: formData.vendorId || null,
      vesselId: formData.vessels[0]?.vesselId || formData.vesselId || null,
      voyageNumber: formData.vessels[0]?.voyageNumber || formData.voyageNumber || null,
      etd: formData.vessels[0]?.etd || formData.etd || null,
      containers: formData.containers.filter((c) => c.containerNumber),
      vessels: formData.vessels.map((v) => ({
        vesselId: v.vesselId || null,
        vesselName: v.vesselName || null,
        voyageNumber: v.voyageNumber || null,
        etd: v.etd || null,
        sequence: v.sequence,
      })),
    };

    const { success, error } = await updateJob(jobId, payload as Parameters<typeof updateJob>[1]);

    if (success) {
      toast.success("Job updated successfully.");
      router.push({ path: "/operational/jobs" });
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
      toast.error("Failed to update job:\n" + errorMsg);
    }
  } finally {
    isSubmitting.value = false;
  }
}

function scrollTo(id: string) {
  activeSection.value = id;
  const el = document.getElementById(id);
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 160;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}

// Intersection Observer for Scroll Spy
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id;
        }
      });
    },
    {
      // Trigger when section is in the top 20% of the viewport (after the sticky header)
      rootMargin: "-165px 0px -80% 0px",
      threshold: 0,
    },
  );

  setTimeout(() => {
    SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });
  }, 100);

  onUnmounted(() => observer.disconnect());
});
</script>

<template>
  <div class="space-y-6 animate-fade-in pb-10">
    <!-- Sticky Header -->
    <div
      class="sticky top-16 z-[900] -mx-6 -mt-6 px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm transition-all duration-200"
    >
      <header class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <button
            type="button"
            @click="router.back()"
            class="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft class="w-5 h-5" />
          </button>
          <h1 class="text-xl font-bold flex items-center gap-2 text-foreground">
            <Briefcase class="w-5 h-5 text-[#062c58]" />
            Edit Job
          </h1>
        </div>
        <div class="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            type="button"
            @click="router.back()"
            class="btn-outline flex-1 sm:flex-none justify-center sm:justify-start px-4"
            :disabled="isJobLoading"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="handleSubmit()"
            class="btn-primary flex-1 sm:flex-none justify-center bg-[#062c58] hover:bg-[#062c58]/90 text-white shadow-sm"
            :disabled="isJobLoading"
          >
            <Save class="w-4 h-4 mr-2" />
            {{ isJobLoading ? "Saving..." : "Save Changes" }}
          </button>
        </div>
      </header>
    </div>

    <div v-if="isJobLoading" class="flex flex-col items-center justify-center py-20 gap-4">
      <div
        class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"
      ></div>
      <p class="text-muted-foreground animate-pulse">Loading job details...</p>
    </div>

    <div v-else class="flex gap-8 relative px-0">
      <!-- Sidebar Navigation -->
      <aside class="w-64 shrink-0 hidden lg:block">
        <div class="sticky top-36">
          <nav class="space-y-2">
            <button
              v-for="section in SECTIONS"
              :key="section.id"
              @click="scrollTo(section.id)"
              class="w-full flex items-center gap-4 px-4 py-3 text-sm font-medium rounded-xl transition-all text-left border"
              :class="[
                activeSection === section.id
                  ? 'bg-blue-50/50 border-[#062c58]/20 text-[#062c58] shadow-sm'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground border-transparent',
              ]"
            >
              <span
                class="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold border transition-colors"
                :class="
                  activeSection === section.id
                    ? 'bg-[#062c58] text-white border-[#062c58]'
                    : 'border-current opacity-70'
                "
              >
                {{ section.step }}
              </span>
              {{ section.label }}
            </button>
          </nav>
        </div>
      </aside>

      <!-- Main Form Content -->
      <main id="main-scroll-container" class="flex-1 w-full min-w-0">
        <div class="max-w-6xl mx-auto space-y-6 pb-20">
          <!-- Job Information -->
          <SectionCard id="job-info" title="Job Information" :icon="Briefcase">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div class="space-y-2">
                <div class="h-6 flex items-center">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                    >JOB NUMBER</label
                  >
                </div>
                <input
                  type="text"
                  :value="jobDetails?.jobNumber"
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
                  :options="companies as any"
                  label-key="name"
                  value-key="id"
                  placeholder="Select Main Customer..."
                  allow-create
                  @create="(name) => handleCreateCompany(name, 'customerId')"
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
                    {{ jobDetails?.status?.name || "Active" }}
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
                    {{
                      jobDetails?.createdBy
                        ? jobDetails.createdBy.substring(0, 2).toUpperCase()
                        : "AD"
                    }}
                  </div>
                  <span class="text-sm font-semibold text-foreground/80">{{
                    jobDetails?.createdBy || "Administrator"
                  }}</span>
                </div>
              </div>
            </div>
          </SectionCard>

          <!-- Involved Parties -->
          <SectionCard id="parties" title="Involved Parties" :icon="Users" no-padding>
            <div class="w-full">
              <div
                class="grid grid-cols-12 gap-6 px-6 py-3 border-b border-border bg-muted/5 text-[11px] font-semibold text-muted-foreground tracking-wider uppercase"
              >
                <div class="col-span-2">ROLE</div>
                <div class="col-span-4">COMPANY</div>
                <div class="col-span-4">ADDRESS</div>
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
                      class="flex items-center gap-2 text-[13px] text-muted-foreground cursor-pointer hover:text-foreground transition-colors group w-fit mb-1.5"
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
            <div
              class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 relative items-end border-b border-border/50 pb-6 mb-6"
            >
              <!-- Row 1: Pre-Carriage & Place of Receipt -->
              <div class="space-y-2">
                <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
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
                <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
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
              <div class="space-y-2">
                <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
                  >PORT OF LOADING (POL)</label
                >
                <div class="relative">
                  <MapPin
                    class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 z-10 pointer-events-none"
                  />
                  <Combobox
                    v-model="formData.pol"
                    :options="portsPol"
                    label-key="name"
                    value-key="code"
                    placeholder="Search port..."
                    class="[&_button]:pl-9"
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
              <div
                class="hidden md:flex absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2 text-muted-foreground/40"
              >
                <ArrowLeft class="w-5 h-5 rotate-180 opacity-0" />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
                  >PORT OF DISCHARGE (POD)</label
                >
                <div class="relative">
                  <MapPin
                    class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 z-10 pointer-events-none"
                  />
                  <Combobox
                    v-model="formData.pod"
                    :options="portsPod"
                    label-key="name"
                    value-key="code"
                    placeholder="Search port..."
                    class="[&_button]:pl-9"
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
                <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
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
                <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
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

              <!-- Containers -->
              <div class="border rounded-xl overflow-visible mt-6">
                <div
                  class="bg-muted/10 px-4 py-3 border-b flex justify-between items-center rounded-t-xl"
                >
                  <h3 class="font-medium text-[14px]">Containers & Seals</h3>
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
                    class="btn-outline h-8 px-3 text-xs gap-1.5 flex items-center"
                  >
                    <Plus class="w-3.5 h-3.5" /> Add Container
                  </button>
                </div>
                <div class="p-4 space-y-4 bg-muted/5 rounded-b-xl">
                  <div
                    v-for="(container, index) in formData.containers"
                    :key="container.id"
                    class="space-y-4 pb-4 border-b border-border/50 last:border-0 last:pb-0"
                  >
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end relative">
                      <div class="col-span-3 space-y-1.5 pt-px">
                        <label
                          class="text-[10px] font-bold text-muted-foreground uppercase opacity-70"
                          >Type</label
                        >
                        <Combobox
                          v-model="container.containerTypeId"
                          :options="containerTypes"
                          placeholder="Select Type..."
                        />
                      </div>
                      <div class="md:col-span-4 space-y-2">
                        <label
                          class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
                          >CONTAINER NO.</label
                        >
                        <input
                          v-model="container.containerNumber"
                          type="text"
                          placeholder="e.g. TEMU1234567"
                          class="input-field uppercase"
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
                          class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
                          >SEAL NO.</label
                        >
                        <input
                          v-model="container.sealNumber"
                          type="text"
                          placeholder="e.g. SN123456"
                          class="input-field uppercase"
                        />
                      </div>
                      <div class="md:col-span-1 flex flex-col items-center justify-center pb-2">
                        <label class="text-[10px] font-bold text-muted-foreground uppercase mb-1"
                          >HM</label
                        >
                        <input
                          type="checkbox"
                          v-model="container.isHazardous"
                          class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </div>
                      <div class="md:col-span-1 flex justify-end pb-1.5">
                        <button
                          type="button"
                          @click="formData.containers.splice(index, 1)"
                          :disabled="formData.containers.length === 1"
                          class="p-2 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                        >
                          <Trash2 class="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <!-- Nested Form Data for Items -->
                    <div class="ml-4 pl-4 border-l-2 border-border/50 space-y-3">
                      <div class="flex items-center justify-between">
                        <h4
                          class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
                        >
                          Container Breakdown Items
                        </h4>
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
                          class="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                        >
                          <Plus class="w-3.5 h-3.5" /> Add Item
                        </button>
                      </div>
                      <div
                        v-for="(item, itemIndex) in container.items"
                        :key="item.id"
                        class="p-3 bg-white border border-border/50 rounded-lg shadow-sm space-y-3 relative"
                      >
                        <button
                          type="button"
                          @click="container.items.splice(itemIndex, 1)"
                          class="absolute top-2 right-2 text-muted-foreground hover:text-destructive transition-colors"
                          :disabled="container.items.length === 1"
                        >
                          <Trash2 class="w-3.5 h-3.5" />
                        </button>
                        <div class="grid grid-cols-12 gap-3 pr-6">
                          <div class="col-span-2 space-y-1">
                            <label class="text-[10px] uppercase font-bold text-muted-foreground"
                              >Qty</label
                            >
                            <div class="relative">
                              <input
                                type="number"
                                v-model.number="item.qty"
                                class="input-field h-8 text-sm"
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
                          <div class="col-span-3 space-y-1">
                            <label class="text-[10px] uppercase font-bold text-muted-foreground"
                              >Unit</label
                            >
                            <Combobox
                              v-model="item.packageTypeCode"
                              :options="packageTypes"
                              value-key="code"
                              label-key="code"
                              placeholder="PKGS"
                              class="h-8"
                            />
                          </div>
                          <div class="col-span-2 space-y-1">
                            <label class="text-[10px] uppercase font-bold text-muted-foreground"
                              >GW (KG)</label
                            >
                            <div class="relative">
                              <input
                                type="number"
                                v-model.number="item.grossWeight"
                                step="0.01"
                                class="input-field h-8 text-sm"
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
                          <div class="col-span-2 space-y-1">
                            <label class="text-[10px] uppercase font-bold text-muted-foreground"
                              >NW (KG)</label
                            >
                            <div class="relative">
                              <input
                                type="number"
                                v-model.number="item.netWeight"
                                step="0.01"
                                class="input-field h-8 text-sm"
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
                          <div class="col-span-3 space-y-1">
                            <label class="text-[10px] uppercase font-bold text-muted-foreground"
                              >CBM</label
                            >
                            <div class="relative">
                              <input
                                type="number"
                                v-model.number="item.measurementCbm"
                                step="0.01"
                                class="input-field h-8 text-sm"
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
                        </div>
                        <div class="grid grid-cols-12 gap-3 pr-6 mt-1">
                          <div class="col-span-4 space-y-1">
                            <label class="text-[10px] uppercase font-bold text-muted-foreground"
                              >HS Code</label
                            >
                            <div class="relative">
                              <input
                                type="text"
                                v-model="item.hsCode"
                                class="input-field h-8 text-sm placeholder:opacity-50"
                                :class="{
                                  '!border-destructive focus:!ring-destructive/20':
                                    containerErrors[`${container.id}-${item.id}-hscode`],
                                }"
                                placeholder="e.g. 1902..."
                              />
                              <p
                                v-if="containerErrors[`${container.id}-${item.id}-hscode`]"
                                class="text-[8.5px] leading-tight text-destructive mt-0.5 font-medium absolute"
                              >
                                {{ containerErrors[`${container.id}-${item.id}-hscode`] }}
                              </p>
                            </div>
                          </div>
                          <div class="col-span-8 space-y-1">
                            <label class="text-[10px] uppercase font-bold text-muted-foreground"
                              >Description Breakdown</label
                            >
                            <textarea
                              v-model="item.description"
                              rows="4"
                              class="input-field min-h-[100px] py-2 text-sm placeholder:opacity-50 resize-y transition-all duration-200"
                              placeholder="Description of goods in this container..."
                            ></textarea>
                          </div>
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

              <!-- Main Description -->
              <div class="space-y-2 md:col-span-2">
                <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
                  >MAIN DESCRIPTION (GOODS DESCRIPTION)</label
                >
                <textarea
                  v-model="formData.mainDescription"
                  rows="8"
                  placeholder="Enter detailed goods description..."
                  class="input-field min-h-[150px] py-3 resize-y transition-all duration-200"
                ></textarea>
              </div>
            </div>
          </SectionCard>

          <!-- Movement & Schedule -->
          <SectionCard id="movement" title="Movement & Schedule" :icon="Clock">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Vessels Section -->
              <div class="md:col-span-2 space-y-4">
                <div class="flex items-center justify-between">
                  <label
                    class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
                    >VESSEL SCHEDULE (MULTI-VESSEL)</label
                  >
                  <button
                    type="button"
                    @click="
                      formData.vessels.push({
                        vesselId: '',
                        vesselName: '',
                        voyageNumber: '',
                        etd: '',
                        sequence: formData.vessels.length,
                      })
                    "
                    class="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    <Plus class="w-3.5 h-3.5" /> Add Vessel
                  </button>
                </div>

                <div class="space-y-4">
                  <div
                    v-for="(vessel, index) in formData.vessels"
                    :key="index"
                    class="p-4 bg-muted/5 border border-border/50 rounded-xl relative group animate-fade-in"
                  >
                    <button
                      v-if="formData.vessels.length > 1"
                      type="button"
                      @click="formData.vessels.splice(index, 1)"
                      class="absolute -top-2 -right-2 w-6 h-6 bg-white border border-border text-muted-foreground hover:text-destructive rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <Trash2 class="w-3.5 h-3.5" />
                    </button>

                    <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div class="md:col-span-1 flex items-center justify-center">
                        <div
                          class="w-8 h-8 rounded-full bg-blue-50 text-[#062c58] flex items-center justify-center text-xs font-bold border border-blue-100"
                        >
                          {{ index + 1 }}
                        </div>
                      </div>
                      <div class="md:col-span-4 self-end">
                        <label
                          class="text-[10px] font-bold text-muted-foreground uppercase mb-1 block"
                          >Vessel Name</label
                        >
                        <Combobox
                          v-model="vessel.vesselId"
                          :options="vessels"
                          label-key="name"
                          value-key="id"
                          placeholder="Select vessel..."
                          allow-create
                          @create="(name) => handleCreateVessel(name, vessel)"
                        />
                      </div>
                      <div class="md:col-span-3 self-end">
                        <label
                          class="text-[10px] font-bold text-muted-foreground uppercase mb-1 block"
                          >Voyage Number</label
                        >
                        <input
                          v-model="vessel.voyageNumber"
                          type="text"
                          class="input-field"
                          placeholder="Voyage..."
                        />
                      </div>
                      <div class="md:col-span-4 self-end">
                        <label
                          class="text-[10px] font-bold text-muted-foreground uppercase mb-1 block"
                          >ETD</label
                        >
                        <input v-model="vessel.etd" type="date" class="input-field" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="space-y-2 self-end">
                <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
                  >SHIPPING LINE</label
                >
                <Combobox
                  v-model="formData.vendorId"
                  :options="companies"
                  label-key="name"
                  value-key="id"
                  placeholder="Select Shipping Line..."
                />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
                  >ETD</label
                >
                <DatePicker v-model="formData.etd" />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
                  >ETA</label
                >
                <DatePicker
                  v-model="formData.eta"
                  :class="{
                    '[&_button]:border-destructive [&_button]:ring-destructive/20':
                      scheduleErrors.eta,
                  }"
                />
                <p v-if="scheduleErrors.eta" class="text-[10px] text-destructive mt-1 font-medium">
                  {{ scheduleErrors.eta }}
                </p>
              </div>
            </div>
          </SectionCard>

          <!-- Weight & Measurement -->
          <SectionCard id="weight" title="Weight & Measurement" :icon="Scale">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="relative space-y-2">
                <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
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
                    class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-muted-foreground text-xs font-medium"
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
                <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
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
                    class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-muted-foreground text-xs font-medium"
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
                <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
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
                    class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-muted-foreground text-xs font-medium"
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
            <div class="space-y-8">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="space-y-2">
                  <label
                    class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
                    >BL TYPE <span class="text-destructive">*</span></label
                  >
                  <Combobox v-model="formData.blType" :options="BL_TYPES" />
                </div>
                <div class="space-y-2">
                  <label
                    class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
                    >FREIGHT TERM <span class="text-destructive">*</span></label
                  >
                  <Combobox v-model="formData.freightTerm" :options="FREIGHT_TERMS" />
                </div>
                <div class="space-y-2">
                  <label
                    class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
                    >TOTAL BL COUNT</label
                  >
                  <input
                    v-model.number="formData.totalBlCount"
                    type="number"
                    min="1"
                    class="input-field"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div class="space-y-2">
                  <label
                    class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
                    >PLACE OF ISSUE</label
                  >
                  <input
                    v-model="formData.placeOfIssue"
                    type="text"
                    placeholder="e.g. Jakarta"
                    class="input-field"
                  />
                </div>
                <div class="space-y-2">
                  <label
                    class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
                    >DATE OF ISSUE</label
                  >
                  <DatePicker v-model="formData.dateOfIssue" placeholder="Select date..." />
                </div>
                <!-- Negotiable Toggle -->
                <div class="h-11 flex items-center pb-1">
                  <label class="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      v-model="formData.isNegotiable"
                      class="w-4 h-4 rounded border-input text-primary focus:ring-primary/20 transition-all"
                    />
                    <div class="flex flex-col">
                      <span class="text-sm font-medium group-hover:text-primary transition-colors"
                        >Negotiable BL</span
                      >
                      <span class="text-[10px] text-muted-foreground leading-none"
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

    <!-- Company Modal -->
    <Modal v-model="isCompanyModalOpen" title="Add New Company">
      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-xs font-semibold uppercase tracking-wider">Company Name</label>
          <input v-model="companyForm.name" type="text" class="input-field" />
        </div>
        <div class="space-y-2">
          <label class="text-xs font-semibold uppercase tracking-wider">Address</label>
          <textarea v-model="companyForm.fullAddress" class="input-field"></textarea>
        </div>
        <button
          @click="submitCompanyForm"
          :disabled="isSubmittingCompany"
          class="btn-primary w-full shadow-md"
        >
          {{ isSubmittingCompany ? "Creating..." : "Create Company" }}
        </button>
      </div>
    </Modal>
  </div>
</template>
