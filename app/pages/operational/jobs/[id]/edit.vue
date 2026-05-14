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
import TimePicker from "~/components/ui/TimePicker.vue";
import Checkbox from "~/components/ui/Checkbox.vue";
import Modal from "~/components/ui/Modal.vue";
import type { Company, ContainerType, Vessel, Port } from "~/composables/useMasterData";
import SectionCard from "../components/SectionCard.vue";
import JobPartyRow from "../components/JobPartyRow.vue";
import CompanyCreateModal from "~/pages/master/company/components/CompanyCreateModal.vue";
import VesselQuickAddModal from "~/components/operational/VesselQuickAddModal.vue";

definePageMeta({
  layout: "dashboard",
  title: "Edit Job",
});

const router = useRouter();
const route = useRoute();
const jobId = route.params.id as string;

const { updateJob, getJob } = useJobs();
const jobDetails = ref<JobWithBls | null>(null);

// SSR-first: fetch job data
const {
  data: jobData,
  pending: loading,
  error,
} = await useAsyncData<JobWithBls>(
  `job-${jobId}`,
  async () => {
    const res = await getJob(jobId);
    if (res.success && res.data) {
      jobDetails.value = res.data;
      return res.data;
    }
    throw new Error(res.error || "Failed to load job");
  },
  { server: false },
);

const isJobLoading = computed(() => loading.value);

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
const activeCompanyField = ref<
  | "shipperId"
  | "consigneeId"
  | "notifyPartyId"
  | "forwarderId"
  | "customerId"
  | "customerAddressId"
  | "vendorId"
  | null
>(null);
const companyPresetRole = ref<"customer" | "vendor" | "both">("customer");

// Vessel Modal State
const isVesselModalOpen = ref(false);
const presetVesselName = ref("");
const companyPresetName = ref("");
const activeVesselObj = ref<{
  vesselId: string;
  vesselName: string;
  voyageNumber: string;
  tsPortId: string;
  etd: string;
  eta: string;
  sequence: number;
  vesselType: string;
} | null>(null);

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
  serviceType: "OCEAN",
  cargoMovementId: "FCL_FCL",
  deliveryMovementId: "CY_DOOR",
  vessels: [] as Array<{
    id: number;
    vesselId: string;
    vesselName: string;
    voyageNumber: string;
    tsPortId: string;
    etd: string;
    eta: string;
    sequence: number;
    vesselType: string;
  }>,
  vesselId: "", // Legacy support
  etd: "", // Legacy support
  eta: "",
  pickupDate: "",
  pickupTime: "",
  deliveryDate: "",
  deliveryTime: "",
  pickupAddress: "",
  deliveryAddress: "",
  truckType: "",

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
  customerAddressId: "",
  shipperReferences: [] as string[],
  showShipperReferencesOnBl: true,
  isDirectMaster: false,
  shipmentType: "OCEAN",
});

onMounted(async () => {
  if (jobData.value) {
    populateFormData(jobData.value);
  } else {
    await fetchJobData();
  }
  await refreshMasterData(formData.pol, formData.pod);
});

// Watch for data changes to ensure form is populated
watch(
  jobData,
  (newVal) => {
    if (newVal) {
      populateFormData(newVal);
    }
  },
  { immediate: true },
);

async function fetchJobData() {
  const res = await getJob(jobId);
  if (res.success && res.data) {
    populateFormData(res.data);
  } else {
    toast.error("Failed to fetch job data: " + res.error);
    router.push("/operational/jobs");
  }
}

function populateFormData(job: JobWithBls) {
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

  // Trucking fields
  formData.serviceType = job.serviceType || "OCEAN";
  formData.shipmentType = job.shipmentType || "OCEAN";
  formData.pickupAddress = job.pickupAddress || "";
  formData.deliveryAddress = job.deliveryAddress || "";
  formData.pickupDate =
    job.pickupDate && typeof job.pickupDate === "string"
      ? (job.pickupDate.split("T")[0] as string)
      : "";
  formData.pickupTime = job.pickupTime || "";
  formData.deliveryDate =
    job.deliveryDate && typeof job.deliveryDate === "string"
      ? (job.deliveryDate.split("T")[0] as string)
      : "";
  formData.deliveryTime = job.deliveryTime || "";
  formData.truckType = job.truckType || "";

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
  formData.customerAddressId = job.customerAddressId || "";
  formData.shipperReferences = Array.isArray(job.shipperReferences) ? job.shipperReferences : [];
  formData.showShipperReferencesOnBl = job.showShipperReferencesOnBl !== false;
  formData.etd = job.etd && typeof job.etd === "string" ? (job.etd.split("T")[0] as string) : "";
  formData.eta = job.eta && typeof job.eta === "string" ? (job.eta.split("T")[0] as string) : "";

  // Map Multi-Vessels
  if (job.vessels && job.vessels.length > 0) {
    formData.vessels = job.vessels.map((v, idx) => ({
      id: Date.now() + idx,
      vesselId: v.vesselId || "",
      vesselName: v.vesselName || "",
      voyageNumber: v.voyageNumber || "",
      tsPortId: v.tsPortId || "",
      etd: v.etd && typeof v.etd === "string" ? v.etd.split("T")[0] || "" : "",
      eta: v.eta && typeof v.eta === "string" ? v.eta.split("T")[0] || "" : "",
      sequence: v.sequence || 0,
      vesselType: v.vesselType || (idx === 0 ? "feeder" : "mother"),
    }));
  } else {
    // Fallback to legacy single vessel if no JobVessels exist
    formData.vessels = [
      {
        id: Date.now(),
        vesselId: job.vesselId || "",
        vesselName: job.vessel?.name || "",
        voyageNumber: job.voyageNumber || "",
        tsPortId: job.tsPortId || "",
        etd: job.etd && typeof job.etd === "string" ? job.etd.split("T")[0] || "" : "",
        eta: job.eta && typeof job.eta === "string" ? job.eta.split("T")[0] || "" : "",
        sequence: 0,
        vesselType: "feeder",
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
  formData.isDirectMaster = Boolean(job.isDirectMaster);

  // Sync BL Setup from job level or first BL
  formData.freightTerm = job.freightTerm || "PREPAID";
  formData.blType = job.blType || "ORIGINAL";
  formData.placeOfIssue = job.placeOfIssue || "";
  formData.dateOfIssue =
    job.dateOfIssue && typeof job.dateOfIssue === "string"
      ? (job.dateOfIssue.split("T")[0] as string)
      : "";
  formData.isNegotiable = Boolean(job.isNegotiable);

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

  // Map BL Setup from first BL if available and NOT already set at job level
  if (job.billsOfLading && job.billsOfLading.length > 0) {
    const firstBl = job.billsOfLading[0];
    if (firstBl) {
      if (!formData.freightTerm) formData.freightTerm = firstBl.freightTerm || "PREPAID";
      if (!formData.blType) formData.blType = firstBl.blType || "ORIGINAL";
      if (!formData.placeOfIssue) formData.placeOfIssue = firstBl.placeOfIssue || "";
      if (!formData.dateOfIssue)
        formData.dateOfIssue =
          firstBl.dateOfIssue && typeof firstBl.dateOfIssue === "string"
            ? (firstBl.dateOfIssue.split("T")[0] as string)
            : "";
      if (!formData.isNegotiable) formData.isNegotiable = firstBl.isNegotiable || false;
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
}

async function refreshMasterData(polCode?: string, podCode?: string) {
  const type = formData.shipmentType === "AIR" ? "air" : "ocean";
  const [comps, types, packs, vess, initialPorts] = await Promise.all([
    fetchCompanies(),
    fetchContainerTypes(),
    fetchPackageTypes(),
    fetchVessels(),
    $fetch<Port[]>(`/api/master/ports?type=${type}`),
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
      const polPort = await $fetch<Port[]>(`/api/master/ports?q=${selectedPol}&type=${type}`);
      if (polPort.length > 0) {
        portsPol.value = [...portsPol.value, ...polPort];
      }
    }
  }
  if (selectedPod) {
    if (!portsPod.value.find((p) => p.code === selectedPod)) {
      const podPort = await $fetch<Port[]>(`/api/master/ports?q=${selectedPod}&type=${type}`);
      if (podPort.length > 0) {
        portsPod.value = [...portsPod.value, ...podPort];
      }
    }
  }
}

// Reset ports when shipment type changes
watch(
  () => formData.shipmentType,
  async (newVal) => {
    const type = newVal === "AIR" ? "air" : "ocean";
    const results = await $fetch<Port[]>(`/api/master/ports?type=${type}`);
    portsPol.value = results;
    portsPod.value = results;
  },
);

async function handleSearchPol(query: string) {
  const type = formData.shipmentType === "AIR" ? "air" : "ocean";
  portsPol.value = await $fetch<Port[]>(
    `/api/master/ports?q=${encodeURIComponent(query)}&type=${type}`,
  );
}

async function handleSearchPod(query: string) {
  const type = formData.shipmentType === "AIR" ? "air" : "ocean";
  portsPod.value = await $fetch<Port[]>(
    `/api/master/ports?q=${encodeURIComponent(query)}&type=${type}`,
  );
}

const newShipperRef = ref("");
const addShipperRef = () => {
  if (newShipperRef.value.trim()) {
    if (!formData.shipperReferences) formData.shipperReferences = [];
    formData.shipperReferences.push(newShipperRef.value.trim());
    newShipperRef.value = "";
  }
};
const removeShipperRef = (index: number) => {
  formData.shipperReferences.splice(index, 1);
};

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

// Sync commodity from mainDescription (Industrial Standard)
watch(
  () => formData.mainDescription,
  (val) => {
    formData.commodity = val?.split("\n")[0]?.substring(0, 100) || "";
  },
);

// Auto-select Default Address when a Company is chosen
watch(
  () => formData.customerId,
  (val) => assignDefaultAddress(val || "", "customerAddressId"),
);

const assignDefaultAddress = (
  companyId: string,
  addressKey:
    | "shipperAddressId"
    | "consigneeAddressId"
    | "notifyPartyAddressId"
    | "forwarderAddressId"
    | "customerAddressId",
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

    // Always update to reflect the current sum of items (resets to 0 if items are deleted)
    formData.grossWeight = totalGw > 0 ? totalGw : null;
    formData.netWeight = totalNw > 0 ? totalNw : null;
    formData.measurement = totalCbm > 0 ? totalCbm : null;
  },
  { deep: true },
);

// Sync Direct Master with Total BL Count
watch(
  () => formData.isDirectMaster,
  (val) => {
    if (val) {
      formData.totalBlCount = 0;
    } else if (formData.totalBlCount === 0) {
      formData.totalBlCount = 1;
    }
  },
);

// Maintain Vessel Roles and Sequence
watch(
  () => formData.vessels,
  (newVessels) => {
    newVessels.forEach((v, idx) => {
      v.sequence = idx;
      v.vesselType = idx === 0 ? "feeder" : "mother";
    });
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
  { id: "DOMESTIC", name: "Domestic" },
];

const SERVICE_TYPES = [
  { id: "OCEAN", name: "OCEAN (FREIGHT)" },
  { id: "TRUCKING", name: "TRUCKING" },
  { id: "CUSTOM_CLEARANCE", name: "CUSTOM CLEARANCE" },
];

const SHIPMENT_TYPES = [
  { id: "OCEAN", name: "Ocean Freight" },
  { id: "AIR", name: "Air Freight" },
];

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
  { id: "CFS_CY", name: "CFS-CY" },
  { id: "CFS_CFS", name: "CFS-CFS" },
  { id: "CY_CFS", name: "CY-CFS" },
];

const BL_TYPES = [
  { id: "DRAFT", name: "DRAFT" },
  { id: "ORIGINAL", name: "ORIGINAL" },
  { id: "SEAWAYBILL", name: "SEAWAYBILL" },
  { id: "TELEX_RELEASE", name: "TELEX RELEASE/EXPRESS RELEASE" },
];

const FREIGHT_TERMS = [
  { id: "PREPAID", name: "PREPAID" },
  { id: "COLLECT", name: "COLLECT" },
];

const SECTIONS = computed(() => {
  const baseSections = [
    { id: "job-info", label: "Job Information", step: 1 },
    { id: "parties", label: "Involved Parties", step: 2 },
    { id: "route", label: "Route Details", step: 3 },
    { id: "cargo", label: "Cargo Information", step: 4 },
    { id: "movement", label: "Movement & Schedule", step: 5 },
  ];

  if (formData.serviceType === "OCEAN") {
    baseSections.push({ id: "bl", label: "BL Setup", step: 6 });
  }

  return baseSections;
});

const activeSection = ref("job-info");

function handleCreateCompany(
  name: string,
  field: "shipperId" | "consigneeId" | "notifyPartyId" | "forwarderId" | "customerId" | "vendorId",
) {
  companyPresetName.value = name;
  activeCompanyField.value = field;

  // Set default role based on field
  if (field === "forwarderId") {
    companyPresetRole.value = "vendor";
  } else if (field === "customerId") {
    companyPresetRole.value = "customer";
  } else {
    // For parties, default to both or customer
    companyPresetRole.value = "both";
  }

  isCompanyModalOpen.value = true;
}

async function handleCompanySuccess(newCompany: Company) {
  await refreshMasterData();

  // Auto-assign the created company to the active field
  if (activeCompanyField.value) {
    formData[activeCompanyField.value] = newCompany.id;
  }
}

async function handleCreateVessel(
  name: string,
  vessel?: {
    vesselId: string;
    vesselName: string;
    voyageNumber: string;
    tsPortId: string;
    etd: string;
    eta: string;
    sequence: number;
    vesselType: string;
  },
) {
  presetVesselName.value = name;
  activeVesselObj.value = vessel || null;
  isVesselModalOpen.value = true;
}

const onVesselCreateSuccess = async (vessel: { id: string; name: string }) => {
  await refreshMasterData();

  // Auto-assign the created vessel to the active field
  if (activeVesselObj.value) {
    activeVesselObj.value.vesselId = vessel.id;
    activeVesselObj.value.vesselName = vessel.name;
  } else {
    formData.vesselId = vessel.id;
    if (formData.vessels.length > 0 && formData.vessels[0]) {
      formData.vessels[0].vesselId = vessel.id;
      formData.vessels[0].vesselName = vessel.name;
    }
  }

  isVesselModalOpen.value = false;
  toast.success(`Vessel "${vessel.name}" created successfully.`);
};

async function handleSubmit() {
  if (
    !formData.shipperId ||
    !formData.consigneeId ||
    (formData.serviceType === "OCEAN" &&
      (!formData.blType || !formData.freightTerm || !formData.pol || !formData.pod)) ||
    (formData.serviceType === "TRUCKING" && (!formData.pickupAddress || !formData.deliveryAddress))
  ) {
    let errorMsg = "Please fill in Shipper and Consignee.";
    if (formData.serviceType === "OCEAN") {
      errorMsg = "Please fill in Shipper, Consignee, POL, POD, Freight Term, and BL Type.";
    } else if (formData.serviceType === "TRUCKING") {
      errorMsg = "Please fill in Shipper, Consignee, Pickup Address, and Delivery Address.";
    }
    toast.error(errorMsg);
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
        tsPortId: v.tsPortId || null,
        etd: v.etd || null,
        eta: v.eta || null,
        sequence: v.sequence,
        vesselType: v.vesselType,
      })),
    };

    const { success, error: updateError } = await updateJob(
      jobId,
      payload as Parameters<typeof updateJob>[1],
    );

    if (success) {
      toast.success("Job updated successfully.");
      router.push({ path: "/operational/jobs" });
    } else {
      let errorMsg =
        typeof updateError === "string"
          ? updateError
          : ((updateError as unknown as Record<string, unknown>)?.message as string) ||
            "Unknown error";
      try {
        let jsonStr = "";
        if (typeof updateError === "string" && updateError.startsWith("[")) {
          jsonStr = updateError;
        } else if (
          updateError &&
          typeof updateError === "object" &&
          typeof (updateError as unknown as Record<string, unknown>).message === "string" &&
          ((updateError as unknown as Record<string, unknown>).message as string).startsWith("[")
        ) {
          jsonStr = (updateError as unknown as Record<string, unknown>).message as string;
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
    SECTIONS.value.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });
  }, 100);

  onUnmounted(() => observer.disconnect());
});
function getVesselLabels(index: number) {
  const isFirst = index === 0;
  const isLast = index === formData.vessels.length - 1;
  const isAir = formData.shipmentType === "AIR";

  return {
    header: isAir
      ? isFirst
        ? "Feeder Plane"
        : isLast
          ? `Mother Plane ${index} (Last)`
          : `Mother Plane ${index}`
      : isFirst
        ? "Feeder Vessel"
        : isLast
          ? `Mother Vessel ${index} (Last)`
          : `Mother Vessel ${index}`,
    etd: isFirst ? "ETD POL" : "ETD T/S PORT",
    eta: isLast ? "ETA POD" : "ETA NEXT PORT",
    leftPortLabel: isFirst
      ? isAir
        ? "Airport POL"
        : "POL Name"
      : isAir
        ? "T/S Airport Name"
        : "T/S Port Name",
    rightPortLabel: isLast
      ? isAir
        ? "Airport POD"
        : "POD Name"
      : isAir
        ? "Next Airport Name"
        : "Next Port Name",
    isFirst,
    isLast,
  };
}

function addVessel() {
  formData.vessels.push({
    id: Date.now() + Math.random(),
    vesselId: "",
    vesselName: "",
    voyageNumber: "",
    tsPortId: "",
    etd: "",
    eta: "",
    sequence: formData.vessels.length,
    vesselType: "mother",
  });
}
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6 pb-10">
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

              <!-- Trade Type -->
              <div class="space-y-2">
                <div class="h-6 flex items-center">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                    >TRADE TYPE <span class="text-destructive">*</span></label
                  >
                </div>
                <Combobox v-model="formData.tradeTypeId" :options="TRADE_TYPES" />
              </div>

              <!-- Type of Shipment -->
              <div v-if="formData.serviceType === 'OCEAN'" class="space-y-2">
                <div class="h-6 flex items-center">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                    >TYPE OF SHIPMENT <span class="text-destructive">*</span></label
                  >
                </div>
                <Combobox v-model="formData.shipmentType" :options="SHIPMENT_TYPES" />
              </div>

              <!-- Service Type -->
              <div class="space-y-2">
                <div class="h-6 flex items-center">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                    >SERVICE TYPE <span class="text-destructive">*</span></label
                  >
                </div>
                <Combobox v-model="formData.serviceType" :options="SERVICE_TYPES" />
              </div>

              <!-- Truck Type (Conditional) -->
              <div v-if="formData.serviceType === 'TRUCKING'" class="space-y-2">
                <div class="h-6 flex items-center">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                    >TRUCK TYPE <span class="text-destructive">*</span></label
                  >
                </div>
                <!-- Convert array of strings to array of objects for combobox -->
                <Combobox
                  v-model="formData.truckType"
                  :options="TRUCK_TYPES.map((t) => ({ id: t, name: t }))"
                />
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
                      jobDetails?.creatorName
                        ? jobDetails.creatorName.substring(0, 2).toUpperCase()
                        : "AD"
                    }}
                  </div>
                  <span class="text-sm font-semibold text-foreground/80">{{
                    jobDetails?.creatorName || "Administrator"
                  }}</span>
                </div>
              </div>

              <!-- Shipper References (PO Numbers) -->
              <div class="md:col-span-4 mt-2 p-5 bg-muted/20 border border-border/40 rounded-2xl">
                <div class="flex items-center justify-between mb-4">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2"
                  >
                    <FileText class="w-3.5 h-3.5 text-primary" />
                    Shipper References (PO Numbers)
                  </label>
                </div>
                <div class="space-y-4">
                  <div class="flex gap-2">
                    <input
                      v-model="newShipperRef"
                      v-uppercase
                      @keyup.enter="addShipperRef"
                      type="text"
                      placeholder="Enter PO Number..."
                      class="input-field flex-1 h-10 text-sm"
                    />
                    <button
                      type="button"
                      @click="addShipperRef"
                      class="bg-primary/10 text-primary hover:bg-primary/20 h-10 px-4 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 border border-primary/10"
                    >
                      <Plus class="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                  <div
                    v-if="formData.shipperReferences && formData.shipperReferences.length > 0"
                    class="flex flex-wrap gap-2 pt-2"
                  >
                    <span
                      v-for="(ref, idx) in formData.shipperReferences"
                      :key="idx"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-border shadow-sm text-foreground text-xs font-bold transition-all hover:border-primary/30"
                    >
                      {{ ref }}
                      <button
                        type="button"
                        @click="removeShipperRef(idx)"
                        class="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 class="w-3.5 h-3.5" />
                      </button>
                    </span>
                  </div>
                  <p v-else class="text-[11px] text-muted-foreground italic pl-1">
                    No references added yet.
                  </p>
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
                  label="Job Customer"
                  required
                  :companies="companies"
                  v-model:companyId="formData.customerId"
                  v-model:addressId="formData.customerAddressId"
                  z-index="50"
                  has-extra-controls
                  @create="(name) => handleCreateCompany(name, 'customerId')"
                >
                  <template #extra-controls>
                    <div class="flex gap-2 mb-1.5">
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
                  </template>
                </JobPartyRow>

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
                  v-if="formData.serviceType !== 'TRUCKING'"
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
                      @click="formData.isNotifySameAsConsignee = !formData.isNotifySameAsConsignee"
                    >
                      <Checkbox
                        v-model="formData.isNotifySameAsConsignee"
                        class="pointer-events-none"
                      />
                      <span class="group-hover:underline select-none">Same as Consignee</span>
                    </label>
                  </template>
                </JobPartyRow>

                <JobPartyRow
                  v-if="formData.serviceType === 'OCEAN'"
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

          <!-- Cargo Information -->
          <SectionCard id="cargo" title="Cargo Information" :icon="Box">
            <div class="space-y-6">
              <!-- Main Description -->
              <div class="space-y-2 md:col-span-2">
                <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
                  >MAIN DESCRIPTION (GOODS DESCRIPTION)</label
                >
                <textarea
                  v-model="formData.mainDescription"
                  rows="10"
                  placeholder="Enter detailed goods description to appear on BL..."
                  class="input-field min-h-[200px] py-3 resize-y transition-all duration-200"
                ></textarea>
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
                        <Checkbox v-model="container.isHazardous" />
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
            </div>
          </SectionCard>

          <!-- Movement & Schedule -->
          <!-- Route & Movement Schedule (Centralized Route) -->
          <SectionCard id="movement" title="Route & Movement Schedule" :icon="Clock">
            <div class="space-y-8">
              <!-- Integrated Route Details -->
              <div
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12 pb-8 border-b border-border/40"
              >
                <!-- Carrier / Shipping Line -->
                <div class="space-y-2 lg:col-span-1">
                  <label
                    class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest pl-1"
                  >
                    {{
                      formData.serviceType === "TRUCKING"
                        ? "TRUCKING COMPANY (CARRIER)"
                        : "SHIPPING LINE (CARRIER)"
                    }}
                  </label>
                  <Combobox
                    v-model="formData.vendorId"
                    :options="companies"
                    label-key="name"
                    value-key="id"
                    placeholder="Select Carrier..."
                    allow-create
                    @create="(name) => handleCreateCompany(name, 'vendorId')"
                    class="h-11"
                  />
                </div>

                <template v-if="formData.serviceType === 'TRUCKING'">
                  <!-- Trucking specific address fields -->
                  <div class="space-y-2 md:col-span-2 lg:col-span-2">
                    <label
                      class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest pl-1"
                      >PICKUP ADDRESS <span class="text-destructive">*</span></label
                    >
                    <textarea
                      v-model="formData.pickupAddress"
                      v-uppercase
                      rows="1"
                      placeholder="Full pickup address..."
                      class="input-field py-3 min-h-[44px] h-11 resize-none"
                    ></textarea>
                  </div>
                  <div class="space-y-2 md:col-span-3">
                    <label
                      class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest pl-1"
                      >DELIVERY ADDRESS <span class="text-destructive">*</span></label
                    >
                    <textarea
                      v-model="formData.deliveryAddress"
                      v-uppercase
                      rows="1"
                      placeholder="Full delivery destination..."
                      class="input-field py-3 min-h-[44px] h-11 resize-none"
                    ></textarea>
                  </div>
                </template>
              </div>

              <!-- Vessel Schedule (For Ocean/Air) -->
              <div v-if="formData.serviceType !== 'TRUCKING'" class="space-y-6">
                <div class="flex items-center justify-between border-b border-border/50 pb-3">
                  <h4
                    class="text-sm font-bold text-foreground/80 uppercase tracking-widest flex items-center gap-2"
                  >
                    <div class="w-1.5 h-4 bg-primary rounded-full"></div>
                    {{ formData.shipmentType === "AIR" ? "Plane Schedule" : "Vessel Schedule" }}
                  </h4>
                  <button
                    type="button"
                    @click="addVessel()"
                    class="text-[11px] bg-primary/10 text-primary px-4 py-1.5 rounded-full hover:bg-primary/20 font-bold flex items-center gap-2 transition-all"
                  >
                    <Plus class="w-3.5 h-3.5" /> ADD
                    {{ formData.shipmentType === "AIR" ? "PLANE" : "VESSEL" }}
                  </button>
                </div>

                <div class="grid grid-cols-1 gap-5">
                  <div
                    v-for="(vessel, vIndex) in formData.vessels"
                    :key="vessel.id"
                    class="p-6 bg-muted/20 border border-border/40 rounded-2xl relative group/vessel transition-all hover:bg-white hover:shadow-lg hover:border-primary/20"
                  >
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                      <div class="md:col-span-1 flex items-center justify-center">
                        <div
                          class="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center text-sm font-black shadow-lg shadow-primary/10"
                        >
                          {{ vIndex + 1 }}
                        </div>
                      </div>
                      <div class="md:col-span-4 space-y-2">
                        <label
                          class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1 opacity-70"
                          >{{ getVesselLabels(vIndex).header }}</label
                        >
                        <Combobox
                          v-model="vessel.vesselId"
                          :options="vessels"
                          label-key="name"
                          value-key="id"
                          placeholder="Vessel..."
                          allow-create
                          @create="(name) => handleCreateVessel(name, vessel)"
                          class="h-10"
                        />
                      </div>
                      <div class="md:col-span-2 space-y-2">
                        <label
                          class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1 opacity-70"
                          >{{ formData.shipmentType === "AIR" ? "Plane No" : "Voyage No" }}</label
                        >
                        <input
                          v-model="vessel.voyageNumber"
                          v-uppercase
                          type="text"
                          class="input-field h-10"
                          :placeholder="
                            formData.shipmentType === 'AIR' ? 'Plane No...' : 'Voyage...'
                          "
                        />
                      </div>
                      <div class="md:col-span-2 space-y-2">
                        <label
                          class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1 opacity-70"
                          >{{ getVesselLabels(vIndex).etd }}</label
                        >
                        <DatePicker v-model="vessel.etd" placeholder="ETD" class="h-10" />
                      </div>
                      <div class="md:col-span-2 space-y-2 relative">
                        <label
                          class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1 opacity-70"
                          >{{ getVesselLabels(vIndex).eta }}</label
                        >
                        <DatePicker v-model="vessel.eta" placeholder="ETA" class="h-10" />
                      </div>
                      <div class="md:col-span-1" v-if="formData.vessels.length > 1">
                        <button
                          type="button"
                          @click="formData.vessels.splice(vIndex, 1)"
                          class="w-10 h-10 rounded-xl bg-white border border-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive hover:text-white transition-all shadow-md"
                        >
                          <Trash2 class="w-4 h-4" />
                        </button>
                      </div>
                      <div
                        class="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 pt-4 border-t border-border/40"
                      >
                        <!-- Left Port Picker -->
                        <div class="space-y-2">
                          <label
                            class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1 opacity-70"
                          >
                            {{ getVesselLabels(vIndex).leftPortLabel }}
                          </label>
                          <Combobox
                            v-if="vIndex === 0"
                            v-model="formData.pol"
                            :options="portsPol"
                            label-key="name"
                            value-key="code"
                            placeholder="Select POL..."
                            class="h-10"
                            :filter-local="false"
                            @search="handleSearchPol"
                          />
                          <Combobox
                            v-else
                            v-model="formData.vessels[vIndex - 1]!.tsPortId"
                            :options="portsPod"
                            label-key="name"
                            value-key="code"
                            placeholder="Select T/S Port..."
                            class="h-10"
                            :filter-local="false"
                            @search="handleSearchPod"
                          />
                        </div>

                        <!-- Right Port Picker -->
                        <div class="space-y-2">
                          <label
                            class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1 opacity-70"
                          >
                            {{ getVesselLabels(vIndex).rightPortLabel }}
                          </label>
                          <Combobox
                            v-if="vIndex === formData.vessels.length - 1"
                            v-model="formData.pod"
                            :options="portsPod"
                            label-key="name"
                            value-key="code"
                            placeholder="Select POD..."
                            class="h-10"
                            :filter-local="false"
                            @search="handleSearchPod"
                          />
                          <Combobox
                            v-else
                            v-model="vessel.tsPortId"
                            :options="portsPod"
                            label-key="name"
                            value-key="code"
                            placeholder="Select Next Port..."
                            class="h-10"
                            :filter-local="false"
                            @search="handleSearchPod"
                          />
                        </div>
                        <div
                          class="col-span-1 md:col-span-2"
                          v-if="
                            (vIndex === 0
                              ? formData.pol
                              : formData.vessels[vIndex - 1]!.tsPortId) ===
                              (vIndex === formData.vessels.length - 1
                                ? formData.pod
                                : vessel.tsPortId) &&
                            (vIndex === 0 ? formData.pol : formData.vessels[vIndex - 1]!.tsPortId)
                          "
                        >
                          <p
                            class="text-[10px] text-destructive font-bold animate-pulse flex items-center gap-1 bg-destructive/5 p-2 rounded-lg border border-destructive/10"
                          >
                            ⚠️ Left and Right port cannot be the same
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Trucking Timeline -->
              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-4">
                  <h4
                    class="text-sm font-bold text-foreground/80 uppercase tracking-widest flex items-center gap-2"
                  >
                    <div class="w-1.5 h-4 bg-primary rounded-full"></div>
                    Pickup Timeline
                  </h4>
                  <div
                    class="grid grid-cols-1 gap-4 p-5 bg-muted/20 border border-border/40 rounded-xl"
                  >
                    <div class="space-y-2">
                      <label
                        class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest pl-1"
                        >Target Pickup Date</label
                      >
                      <DatePicker
                        v-model="formData.pickupDate"
                        placeholder="Select Date..."
                        class="h-10 w-full"
                      />
                    </div>
                    <div class="space-y-2">
                      <label
                        class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest pl-1"
                        >Target Pickup Time</label
                      >
                      <TimePicker v-model="formData.pickupTime" />
                    </div>
                  </div>
                </div>
                <div class="space-y-4">
                  <h4
                    class="text-sm font-bold text-foreground/80 uppercase tracking-widest flex items-center gap-2"
                  >
                    <div class="w-1.5 h-4 bg-primary rounded-full"></div>
                    Delivery Timeline
                  </h4>
                  <div
                    class="grid grid-cols-1 gap-4 p-5 bg-muted/20 border border-border/40 rounded-xl"
                  >
                    <div class="space-y-2">
                      <label
                        class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest pl-1"
                        >Target Delivery Date</label
                      >
                      <DatePicker
                        v-model="formData.deliveryDate"
                        placeholder="Select Date..."
                        class="h-10 w-full"
                      />
                    </div>
                    <div class="space-y-2">
                      <label
                        class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest pl-1"
                        >Target Delivery Time</label
                      >
                      <TimePicker v-model="formData.deliveryTime" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          <!-- BL Setup -->
          <SectionCard
            v-if="formData.serviceType === 'OCEAN'"
            id="bl"
            title="BL Setup"
            :icon="FileText"
          >
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
                    >Direct Master</label
                  >
                  <div
                    class="flex items-center h-11 px-4 border rounded-md bg-muted/10 hover:bg-muted/30 cursor-pointer transition-colors"
                    @click="formData.isDirectMaster = !formData.isDirectMaster"
                  >
                    <Checkbox v-model="formData.isDirectMaster" class="pointer-events-none" />
                    <span class="ml-3 text-sm font-medium text-foreground select-none"
                      >Yes, Direct Master</span
                    >
                  </div>
                </div>
                <div class="space-y-2">
                  <label
                    class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
                    >TOTAL BL COUNT</label
                  >
                  <input
                    v-model.number="formData.totalBlCount"
                    type="number"
                    min="0"
                    class="input-field"
                    :disabled="formData.isDirectMaster"
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
                  <label
                    class="flex items-center gap-3 cursor-pointer group"
                    @click="formData.isNegotiable = !formData.isNegotiable"
                  >
                    <Checkbox v-model="formData.isNegotiable" class="pointer-events-none" />
                    <div class="flex flex-col">
                      <span
                        class="text-sm font-medium group-hover:text-primary transition-colors select-none"
                        >Negotiable BL</span
                      >
                      <span class="text-[10px] text-muted-foreground leading-none select-none"
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

    <!-- Standardized Company Creation Modal -->
    <CompanyCreateModal
      v-model="isCompanyModalOpen"
      mode="create"
      :preset-name="companyPresetName"
      :preset-role="companyPresetRole"
      @success="handleCompanySuccess"
    />

    <!-- Quick Add Vessel Modal -->
    <VesselQuickAddModal
      v-model:is-open="isVesselModalOpen"
      :initial-name="presetVesselName"
      @success="onVesselCreateSuccess"
    />
  </div>
</template>
