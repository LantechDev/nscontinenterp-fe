<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any -- loose job/BC snapshot data */
import { ref, computed, watch, onMounted } from "vue";
import { Trash2, Box, Plus, FileText, Users, Clock, Truck } from "lucide-vue-next";
import { toast } from "vue-sonner";

import Combobox from "~/components/ui/Combobox.vue";
import JobPartyRow from "~/pages/operational/jobs/components/JobPartyRow.vue";
import SectionCard from "~/pages/operational/jobs/components/SectionCard.vue";
import DatePicker from "~/components/ui/DatePicker.vue";
import TimePicker from "~/components/ui/TimePicker.vue";
import Checkbox from "~/components/ui/Checkbox.vue";
import VesselQuickAddModal from "~/components/operational/VesselQuickAddModal.vue";
import PlaneQuickAddModal from "~/components/operational/PlaneQuickAddModal.vue";
import type { Plane } from "~/composables/usePlanes";
import type {
  Company,
  ContainerType,
  PackageType,
  Vessel,
  Port,
  MovementType,
} from "~/composables/useMasterData";

// Standalone Booking Confirmation edit form. Adapted from operational/ebl/JobEblEditForm.vue.
// All edits persist to the BC's OWN snapshot (bc_parties / bc_containers / bc_vessels +
// booking_confirmations columns) — they do NOT mutate the Job or the eBL.

export interface BcVesselForm {
  id?: string | number;
  vesselId?: string | null;
  vesselName?: string | null;
  voyageNumber?: string | null;
  etd?: string | null;
  eta?: string | null;
  tsPortId?: string | null;
  sequence?: number;
  vesselType?: string | null;
}

export interface BcContainerItemForm {
  sequenceNo: number;
  qty: number;
  packageTypeCode?: string | null;
  grossWeight?: number | null;
  netWeight?: number | null;
  measurementCbm?: number | null;
  description?: string | null;
  hsCode?: string | null;
}

export interface BcContainerForm {
  containerNumber?: string | null;
  sealNumber?: string | null;
  containerTypeId?: string | null;
  vehicleNumber?: string | null;
  driverName?: string | null;
  driverContactNumber?: string | null;
  isHazardous?: boolean;
  items?: BcContainerItemForm[];
}

export interface BookingConfirmationForm {
  // BC general
  bookingNumber: string;
  bookingDate: string | null;
  serviceContractNo: string;
  warehouseDepotName: string;
  warehouseDepotAddress: string;
  pickupLocation: string;
  cutoffDate: string | null;
  cutoffTime: string;
  remarks: string;

  // Parties
  shipperId?: string;
  shipperAddressId?: string;
  consigneeId?: string;
  consigneeAddressId?: string;
  notifyPartyId?: string;
  notifyPartyAddressId?: string;
  isNotifySameAsConsignee?: boolean;

  // Cargo
  mainDescription?: string;
  shippingMark?: string;

  // Routing / movement
  pol?: string;
  pod?: string;
  cargoMovementId?: string;
  deliveryMovementId?: string;
  eta?: string;
  dateCargoReceived?: string;

  // Freight
  freightPayment?: string;
  prepaidValue?: string;
  collectValue?: string;

  // References
  shipperReferences: string[];
  showShipperReferencesOnBc: boolean;

  vessels: BcVesselForm[];
  containers: BcContainerForm[];
}

const props = defineProps<{
  jobData: any;
}>();

const editForm = defineModel<BookingConfirmationForm>({ required: true });

const {
  fetchCompanies,
  fetchContainerTypes,
  fetchPackageTypes,
  fetchVessels,
  fetchPlanes,
  fetchCargoMovements,
  fetchDeliveryMovements,
} = useMasterData();

const companies = ref<Company[]>([]);
const containerTypes = ref<ContainerType[]>([]);
const TRUCK_CONTAINER_TYPE_CODES = new Set(["CDE", "CDD", "CDD_LONG", "WING_BOX"]);
const oceanContainerTypes = computed(() =>
  containerTypes.value.filter((type) => !TRUCK_CONTAINER_TYPE_CODES.has(type.code)),
);
const truckTypes = computed(() =>
  containerTypes.value.filter((type) => TRUCK_CONTAINER_TYPE_CODES.has(type.code)),
);
const packageTypes = ref<PackageType[]>([]);
const cargoMovementOptions = ref<MovementType[]>([]);
const deliveryMovementOptions = ref<MovementType[]>([]);
const vessels = ref<Vessel[]>([]);
const planes = ref<Plane[]>([]);
const portsPol = ref<Port[]>([]);
const portsPod = ref<Port[]>([]);

const isAir = computed(
  () => props.jobData?.shipmentType === "AIR" || props.jobData?.serviceType === "AIR",
);
const isTrucking = computed(() => props.jobData?.serviceType === "TRUCKING");

onMounted(async () => {
  const [c, ct, pt, cargoMoves, deliveryMoves, v, p] = await Promise.all([
    fetchCompanies(),
    fetchContainerTypes(),
    fetchPackageTypes(),
    fetchCargoMovements(),
    fetchDeliveryMovements(),
    fetchVessels(),
    fetchPlanes(),
  ]);
  companies.value = c;
  containerTypes.value = ct;
  packageTypes.value = pt;
  cargoMovementOptions.value = cargoMoves;
  deliveryMovementOptions.value = deliveryMoves;
  vessels.value = v;
  planes.value = p;

  const portType = isAir.value ? "air" : "ocean";
  portsPol.value = editForm.value.pol
    ? await $fetch<Port[]>(`/api/master/ports?q=${editForm.value.pol}&type=${portType}`)
    : await $fetch<Port[]>(`/api/master/ports?type=${portType}`);
  portsPod.value = editForm.value.pod
    ? await $fetch<Port[]>(`/api/master/ports?q=${editForm.value.pod}&type=${portType}`)
    : await $fetch<Port[]>(`/api/master/ports?type=${portType}`);
});

// Vessel / Plane quick-add modals
const isVesselModalOpen = ref(false);
const presetVesselName = ref("");
const activeVesselObj = ref<BcVesselForm | null>(null);
const isPlaneModalOpen = ref(false);
const presetPlaneName = ref("");
const activePlaneObj = ref<BcVesselForm | null>(null);

const documentName = "Booking Confirmation";

// Notify mirrors consignee when "same as consignee" is on.
watch(
  () => editForm.value.isNotifySameAsConsignee,
  (val) => {
    if (val) {
      editForm.value.notifyPartyId = editForm.value.consigneeId;
      editForm.value.notifyPartyAddressId = editForm.value.consigneeAddressId;
    } else {
      editForm.value.notifyPartyId = "";
      editForm.value.notifyPartyAddressId = "";
    }
  },
);
watch(
  () => editForm.value.consigneeId,
  (val) => {
    if (editForm.value.isNotifySameAsConsignee) editForm.value.notifyPartyId = val;
  },
);
watch(
  () => editForm.value.consigneeAddressId,
  (val) => {
    if (editForm.value.isNotifySameAsConsignee) editForm.value.notifyPartyAddressId = val;
  },
);

const assignDefaultAddress = (
  companyId: string,
  addressKey: "shipperAddressId" | "consigneeAddressId" | "notifyPartyAddressId",
) => {
  if (!companyId) {
    editForm.value[addressKey] = "";
    return;
  }
  const company = companies.value.find((cc) => cc.id === companyId);
  if (company && company.addresses && company.addresses.length > 0) {
    const defaultAddr = company.addresses.find((a: Record<string, unknown>) => a.isDefault);
    editForm.value[addressKey] = defaultAddr
      ? (defaultAddr.id as string)
      : company.addresses[0]!.id;
  } else {
    editForm.value[addressKey] = "";
  }
};

watch(
  () => editForm.value.shipperId,
  (val) => assignDefaultAddress(val || "", "shipperAddressId"),
);
watch(
  () => editForm.value.consigneeId,
  (val) => assignDefaultAddress(val || "", "consigneeAddressId"),
);
watch(
  () => editForm.value.notifyPartyId,
  (val) => {
    if (!editForm.value.isNotifySameAsConsignee)
      assignDefaultAddress(val || "", "notifyPartyAddressId");
  },
);

// Freight payment → prepaid/collect display strings
watch(
  () => [editForm.value.freightPayment, editForm.value.pol, editForm.value.pod],
  () => {
    const f = editForm.value;
    const polCity =
      portsPol.value.find((p) => p.code === f.pol)?.name || props.jobData?.polName || f.pol || "";
    const podCity =
      portsPod.value.find((p) => p.code === f.pod)?.name || props.jobData?.podName || f.pod || "";
    f.prepaidValue = "";
    f.collectValue = "";
    if (f.freightPayment === "PREPAID_POL") f.prepaidValue = `PREPAID AT ${polCity.toUpperCase()}`;
    else if (f.freightPayment === "PREPAID_POD")
      f.prepaidValue = `PREPAID AT ${podCity.toUpperCase()}`;
    else if (f.freightPayment === "COLLECT_POL")
      f.collectValue = `COLLECT AT ${polCity.toUpperCase()}`;
    else if (f.freightPayment === "COLLECT_POD")
      f.collectValue = `COLLECT AT ${podCity.toUpperCase()}`;
  },
  { deep: true },
);

const FREIGHT_PAYMENT_OPTIONS = computed(() => {
  const f = editForm.value;
  const polCity =
    portsPol.value.find((p) => p.code === f.pol)?.name || props.jobData?.polName || f.pol || "POL";
  const podCity =
    portsPod.value.find((p) => p.code === f.pod)?.name || props.jobData?.podName || f.pod || "POD";
  return [
    { id: "PREPAID_POL", name: `Prepaid at POL (${polCity})` },
    { id: "PREPAID_POD", name: `Prepaid at POD (${podCity})` },
    { id: "COLLECT_POL", name: `Collect at POL (${polCity})` },
    { id: "COLLECT_POD", name: `Collect at POD (${podCity})` },
  ];
});

const handleSearchPol = async (q: string) => {
  const type = isAir.value ? "air" : "ocean";
  portsPol.value = await $fetch<Port[]>(
    `/api/master/ports?q=${encodeURIComponent(q)}&type=${type}`,
  );
};
const handleSearchPod = async (q: string) => {
  const type = isAir.value ? "air" : "ocean";
  portsPod.value = await $fetch<Port[]>(
    `/api/master/ports?q=${encodeURIComponent(q)}&type=${type}`,
  );
};

const handleCreateTransport = (name: string, item?: BcVesselForm) => {
  if (isAir.value) {
    presetPlaneName.value = name;
    activePlaneObj.value = item || null;
    isPlaneModalOpen.value = true;
  } else {
    presetVesselName.value = name;
    activeVesselObj.value = item || null;
    isVesselModalOpen.value = true;
  }
};

const onVesselCreateSuccess = async (vessel: { id: string; name: string }) => {
  vessels.value = await fetchVessels();
  if (activeVesselObj.value) activeVesselObj.value.vesselId = vessel.id;
  isVesselModalOpen.value = false;
  toast.success(`Vessel "${vessel.name}" created successfully.`);
};
const onPlaneCreateSuccess = async (plane: { id: string; name: string }) => {
  planes.value = await fetchPlanes();
  if (activePlaneObj.value) {
    activePlaneObj.value.vesselId = plane.id;
    activePlaneObj.value.vesselName = plane.name;
  }
  isPlaneModalOpen.value = false;
  toast.success(`Plane "${plane.name}" created successfully.`);
};

function getVesselLabels(index: number) {
  const vesselsCount = editForm.value.vessels?.length || 0;
  const isFirst = index === 0;
  const isLast = index === vesselsCount - 1;
  const air = isAir.value;
  return {
    header: air
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
      ? air
        ? "Airport POL"
        : "POL Name"
      : air
        ? "T/S Airport Name"
        : "T/S Port Name",
    rightPortLabel: isLast
      ? air
        ? "Airport POD"
        : "POD Name"
      : air
        ? "Next Airport Name"
        : "Next Port Name",
    isFirst,
    isLast,
    hasTransit: vesselsCount > 1,
  };
}

function addVessel() {
  if (!editForm.value.vessels) editForm.value.vessels = [];
  editForm.value.vessels.push({
    id: Date.now(),
    vesselId: "",
    vesselName: "",
    voyageNumber: "",
    etd: "",
    eta: "",
    sequence: editForm.value.vessels.length,
    vesselType: editForm.value.vessels.length === 0 ? "feeder" : "mother",
  });
}

watch(
  () => editForm.value.vessels,
  (vesselList) => {
    if (!vesselList) return;
    const list = isAir.value ? planes.value : vessels.value;
    vesselList.forEach((v, idx) => {
      v.sequence = idx;
      v.vesselType = idx === 0 ? "feeder" : "mother";
      if (v.vesselId) {
        const found = list.find((item) => item.id === v.vesselId);
        if (found?.name) v.vesselName = found.name;
      }
    });
  },
  { deep: true },
);

const addContainer = () => {
  if (!editForm.value.containers) editForm.value.containers = [];
  editForm.value.containers.push({
    containerNumber: "",
    sealNumber: "",
    containerTypeId: "",
    vehicleNumber: "",
    driverName: "",
    driverContactNumber: "",
    isHazardous: false,
    items: [{ sequenceNo: 1, qty: 1, packageTypeCode: "", description: "" }],
  });
};
const removeContainer = (idx: number) => editForm.value.containers.splice(idx, 1);

const newShipperRef = ref("");
const addShipperRef = () => {
  if (newShipperRef.value.trim()) {
    if (!editForm.value.shipperReferences) editForm.value.shipperReferences = [];
    editForm.value.shipperReferences.push(newShipperRef.value.trim());
    newShipperRef.value = "";
  }
};
const removeShipperRef = (index: number) => {
  editForm.value.shipperReferences.splice(index, 1);
};
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <!-- BC General -->
    <SectionCard id="general" title="General Information" :icon="FileText">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
            >Booking Number <span class="text-red-500">*</span></label
          >
          <input
            v-model="editForm.bookingNumber"
            v-uppercase
            type="text"
            class="input-field h-10"
            placeholder="Enter Booking Number"
          />
        </div>
        <div class="space-y-2">
          <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
            >Booking Date</label
          >
          <DatePicker v-model="editForm.bookingDate" />
        </div>
        <div class="space-y-2 md:col-span-2">
          <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
            >Service Contract No.</label
          >
          <input
            v-model="editForm.serviceContractNo"
            v-uppercase
            type="text"
            class="input-field h-10"
            placeholder="Enter Service Contract No."
          />
        </div>
        <div class="space-y-2 md:col-span-2">
          <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
            >Warehouse/Depot Name <span class="text-red-500">*</span></label
          >
          <input
            v-model="editForm.warehouseDepotName"
            v-uppercase
            type="text"
            class="input-field h-10"
            placeholder="Warehouse/Depot Name"
          />
        </div>
        <div class="space-y-2 md:col-span-2">
          <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
            >Warehouse/Depot Address</label
          >
          <textarea
            v-model="editForm.warehouseDepotAddress"
            v-uppercase
            rows="3"
            class="input-field h-24 py-2 resize-y"
            placeholder="Warehouse/Depot Address"
          ></textarea>
        </div>
        <div class="space-y-2 md:col-span-2">
          <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
            >Pickup Location</label
          >
          <textarea
            v-model="editForm.pickupLocation"
            v-uppercase
            rows="2"
            class="input-field h-16 py-2 resize-y"
            placeholder="Pickup Location"
          ></textarea>
        </div>
        <div class="space-y-2">
          <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
            >Cutoff Date</label
          >
          <DatePicker v-model="editForm.cutoffDate" />
        </div>
        <div class="space-y-2">
          <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
            >Cutoff Time</label
          >
          <TimePicker v-model="editForm.cutoffTime" placeholder="Select cutoff time..." />
        </div>
        <div class="space-y-2 md:col-span-2">
          <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
            >Remarks</label
          >
          <textarea
            v-model="editForm.remarks"
            v-uppercase
            rows="4"
            class="input-field h-32 py-2 resize-y"
            placeholder="Additional Remarks..."
          ></textarea>
        </div>
      </div>
    </SectionCard>

    <!-- Involved Parties -->
    <SectionCard id="parties" title="Involved Parties" :icon="Users" no-padding>
      <div class="w-full">
        <JobPartyRow
          label="Shipper"
          required
          :companies="companies"
          v-model:companyId="editForm.shipperId"
          v-model:addressId="editForm.shipperAddressId"
        />
        <JobPartyRow
          label="Consignee"
          required
          :companies="companies"
          v-model:companyId="editForm.consigneeId"
          v-model:addressId="editForm.consigneeAddressId"
        />
        <JobPartyRow
          v-if="!isTrucking"
          label="Notify Party"
          :companies="companies"
          v-model:companyId="editForm.notifyPartyId"
          v-model:addressId="editForm.notifyPartyAddressId"
          has-extra-controls
          :disabled-company="editForm.isNotifySameAsConsignee"
        >
          <template #extra-controls>
            <label
              class="flex items-center gap-2 text-[13px] text-muted-foreground cursor-pointer hover:text-foreground transition-colors group w-fit mb-1.5 select-none"
              @click="editForm.isNotifySameAsConsignee = !editForm.isNotifySameAsConsignee"
            >
              <Checkbox v-model="editForm.isNotifySameAsConsignee" class="pointer-events-none" />
              <span class="group-hover:underline">Same as Consignee</span>
            </label>
          </template>
        </JobPartyRow>

        <!-- Shipper References -->
        <div class="px-6 py-5 bg-muted/10 border-t border-border/50">
          <div class="flex items-center justify-between mb-4">
            <div class="flex flex-col">
              <label
                class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2"
              >
                <FileText class="w-3.5 h-3.5 text-primary" />
                Shipper References (PO Numbers)
              </label>
              <p class="text-[10px] text-muted-foreground mt-0.5">
                References to be printed on the {{ documentName }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox v-model="editForm.showShipperReferencesOnBc" />
              <span class="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider"
                >Show on BC</span
              >
            </div>
          </div>
          <div class="space-y-3">
            <div class="flex gap-2">
              <input
                v-model="newShipperRef"
                v-uppercase
                type="text"
                placeholder="Enter reference number (e.g. PO-12345)..."
                class="input-field h-9 text-sm"
                @keyup.enter="addShipperRef"
              />
              <button
                type="button"
                @click="addShipperRef"
                class="btn-primary h-9 px-4 text-xs font-bold uppercase bg-[#062c58] hover:bg-[#062c58]/90"
              >
                Add
              </button>
            </div>
            <div v-if="editForm.shipperReferences?.length" class="flex flex-wrap gap-2 pt-1">
              <div
                v-for="(ref, index) in editForm.shipperReferences"
                :key="index"
                class="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-border/60 rounded-xl text-[12px] font-semibold text-foreground shadow-sm group hover:border-primary/30 transition-all"
              >
                <span>{{ ref }}</span>
                <button
                  type="button"
                  @click="removeShipperRef(index)"
                  class="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div
              v-else
              class="text-center py-4 px-4 bg-white/40 border border-dashed border-border/60 rounded-xl"
            >
              <p class="text-[11px] text-muted-foreground italic uppercase tracking-wider">
                No references added
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>

    <!-- Cargo Information -->
    <SectionCard id="cargo" title="Cargo Information" :icon="Box">
      <div class="space-y-6">
        <div class="space-y-2">
          <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
            >MAIN DESCRIPTION (OVERALL COMMODITY)</label
          >
          <textarea
            v-model.trim="editForm.mainDescription"
            v-uppercase
            rows="8"
            :placeholder="`Description of goods to appear on ${documentName}...`"
            class="input-field min-h-[200px] py-3 resize-y"
          ></textarea>
        </div>
        <div class="space-y-2">
          <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
            >SHIPPING MARKS</label
          >
          <textarea
            v-model.trim="editForm.shippingMark"
            v-uppercase
            rows="6"
            placeholder="Enter marks and numbers..."
            class="input-field min-h-[120px] py-3 resize-y"
          ></textarea>
        </div>
      </div>
    </SectionCard>

    <!-- Route & Movement (ocean / air) -->
    <SectionCard v-if="!isTrucking" id="movement" title="Route & Movement Schedule" :icon="Clock">
      <div class="space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-border/50">
          <div class="space-y-2">
            <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
              >CARGO MOVEMENT</label
            >
            <Combobox
              v-model="editForm.cargoMovementId"
              :options="cargoMovementOptions"
              value-key="code"
            />
          </div>
          <div class="space-y-2">
            <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
              >DELIVERY MOVEMENT</label
            >
            <Combobox
              v-model="editForm.deliveryMovementId"
              :options="deliveryMovementOptions"
              value-key="code"
            />
          </div>
        </div>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h4
              class="text-sm font-bold text-foreground/80 uppercase tracking-widest flex items-center gap-2"
            >
              <div class="w-1.5 h-4 bg-primary rounded-full"></div>
              {{ isAir ? "Plane Schedule" : "Vessel Schedule" }}
            </h4>
            <button
              type="button"
              @click="addVessel"
              class="text-xs text-blue-600 hover:text-blue-700 font-bold uppercase tracking-widest flex items-center gap-1.5 transition-colors"
            >
              <Plus class="w-3.5 h-3.5" /> {{ isAir ? "Add Plane" : "Add Vessel" }}
            </button>
          </div>

          <div class="space-y-4">
            <div
              v-for="(vessel, vIndex) in editForm.vessels"
              :key="vessel.id || vIndex"
              class="p-5 bg-muted/5 border border-border/50 rounded-2xl relative transition-all hover:bg-white hover:shadow-sm"
            >
              <div class="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
                <div class="md:col-span-5 space-y-2">
                  <label
                    class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1"
                    >{{ getVesselLabels(vIndex).header }}</label
                  >
                  <Combobox
                    v-model="vessel.vesselId"
                    :options="isAir ? planes : vessels"
                    label-key="name"
                    value-key="id"
                    :placeholder="isAir ? 'Search Plane...' : 'Search Vessel...'"
                    allow-create
                    @create="(name) => handleCreateTransport(name, vessel)"
                    class="h-10"
                  />
                </div>
                <div class="md:col-span-3 space-y-2">
                  <label
                    class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1"
                    >{{ isAir ? "Plane No" : "Voyage No" }}</label
                  >
                  <input
                    v-model="vessel.voyageNumber"
                    v-uppercase
                    type="text"
                    class="input-field h-10"
                    :placeholder="isAir ? 'Plane No...' : 'Voyage...'"
                  />
                </div>
                <div class="md:col-span-2 space-y-2">
                  <label
                    class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1"
                    >{{ getVesselLabels(vIndex).etd }}</label
                  >
                  <DatePicker v-model="vessel.etd" placeholder="Select ETD..." class="h-10" />
                </div>
                <div class="md:col-span-2 space-y-2 relative">
                  <label
                    class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1"
                    >{{ getVesselLabels(vIndex).eta }}</label
                  >
                  <DatePicker v-model="vessel.eta" placeholder="Select ETA..." class="h-10" />
                </div>

                <div
                  class="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 pt-4 border-t border-border/40"
                >
                  <div class="space-y-2">
                    <label
                      class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1 opacity-70"
                      >{{ getVesselLabels(vIndex).leftPortLabel }}</label
                    >
                    <Combobox
                      v-if="vIndex === 0"
                      v-model="editForm.pol"
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
                      v-model="editForm.vessels[vIndex - 1]!.tsPortId"
                      :options="portsPod"
                      label-key="name"
                      value-key="code"
                      placeholder="Select T/S Port..."
                      class="h-10"
                      :filter-local="false"
                      @search="handleSearchPod"
                    />
                  </div>
                  <div class="space-y-2">
                    <label
                      class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1 opacity-70"
                      >{{ getVesselLabels(vIndex).rightPortLabel }}</label
                    >
                    <Combobox
                      v-if="vIndex === editForm.vessels.length - 1"
                      v-model="editForm.pod"
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
                </div>

                <div class="md:col-span-1 flex justify-end pb-1" v-if="editForm.vessels.length > 1">
                  <button
                    type="button"
                    @click="editForm.vessels.splice(vIndex, 1)"
                    class="w-10 h-10 rounded-xl bg-white border border-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive hover:text-white transition-all shadow-sm"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div class="space-y-2">
              <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
                >Final ETA</label
              >
              <DatePicker v-model="editForm.eta" placeholder="Select Final ETA..." />
            </div>
            <div class="space-y-2">
              <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
                >Date Cargo Received</label
              >
              <DatePicker v-model="editForm.dateCargoReceived" placeholder="Select Date..." />
            </div>
          </div>
        </div>
      </div>
    </SectionCard>

    <!-- Trucking dates -->
    <SectionCard v-else id="movement" title="Dates" :icon="Clock">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="space-y-2">
          <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
            >Date Cargo Received</label
          >
          <DatePicker v-model="editForm.dateCargoReceived" placeholder="Select Date..." />
        </div>
      </div>
    </SectionCard>

    <!-- Freight & Charges -->
    <SectionCard id="freight" title="Freight & Charges" :icon="FileText">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
            >Freight Payment</label
          >
          <Combobox
            v-model="editForm.freightPayment"
            :options="FREIGHT_PAYMENT_OPTIONS"
            placeholder="Select Payment..."
          />
        </div>
        <div class="space-y-2">
          <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
            >Selected Summary</label
          >
          <div class="p-3 bg-muted/20 rounded-lg text-sm font-mono min-h-[40px] flex items-center">
            <span v-if="editForm.prepaidValue" class="text-blue-600 font-bold">{{
              editForm.prepaidValue
            }}</span>
            <span v-else-if="editForm.collectValue" class="text-orange-600 font-bold">{{
              editForm.collectValue
            }}</span>
            <span v-else class="text-muted-foreground italic">No payment selected</span>
          </div>
        </div>
      </div>
    </SectionCard>

    <!-- Containers Breakdown -->
    <SectionCard
      id="containers"
      :title="isTrucking ? 'Truck Breakdown' : 'Containers Breakdown'"
      :icon="isTrucking ? Truck : Box"
    >
      <div class="space-y-6">
        <div class="border rounded-xl mt-6 overflow-visible">
          <div
            class="bg-muted/10 px-4 py-3 border-b flex justify-between items-center rounded-t-xl"
          >
            <h3 class="font-medium text-[14px]">
              {{ isTrucking ? "Truck Information" : "Containers & Seals" }}
            </h3>
            <button
              type="button"
              @click="addContainer"
              class="btn-outline h-8 px-3 text-xs gap-1.5 flex items-center"
            >
              <Plus class="w-3.5 h-3.5" />
              {{ isTrucking ? "Add Truck" : "Add Container" }}
            </button>
          </div>
          <div class="p-4 space-y-4 bg-muted/5 rounded-b-xl">
            <div
              v-for="(container, index) in editForm.containers"
              :key="index"
              class="space-y-4 pb-4 border-b border-border/50 last:border-0 last:pb-0"
            >
              <!-- Trucking -->
              <div
                v-if="isTrucking"
                class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end relative"
              >
                <div class="col-span-3 space-y-1.5 pt-px">
                  <label class="text-[10px] font-bold text-muted-foreground uppercase opacity-70"
                    >Truck Type</label
                  >
                  <Combobox
                    v-model="container.containerTypeId"
                    :options="truckTypes"
                    placeholder="Select Type..."
                  />
                </div>
                <div class="md:col-span-3 space-y-2">
                  <label class="text-[10px] font-bold text-muted-foreground uppercase opacity-70"
                    >Vehicle Number (Nomor Polisi)</label
                  >
                  <input
                    v-model="container.vehicleNumber"
                    v-uppercase
                    type="text"
                    placeholder="B 9123 XYZ"
                    class="input-field uppercase"
                  />
                </div>
                <div class="md:col-span-3 space-y-2">
                  <label class="text-[10px] font-bold text-muted-foreground uppercase opacity-70"
                    >Driver Name</label
                  >
                  <input
                    v-model="container.driverName"
                    v-uppercase
                    type="text"
                    placeholder="Budi Santoso"
                    class="input-field uppercase"
                  />
                </div>
                <div class="md:col-span-2 space-y-2">
                  <label class="text-[10px] font-bold text-muted-foreground uppercase opacity-70"
                    >Driver Contact Number</label
                  >
                  <input
                    v-model="container.driverContactNumber"
                    v-uppercase
                    type="text"
                    placeholder="0812xxxxxxx"
                    class="input-field uppercase"
                  />
                </div>
                <div class="md:col-span-1 flex items-end justify-end gap-2 pb-1.5">
                  <label class="flex flex-col items-center gap-1">
                    <span class="text-[10px] font-bold text-muted-foreground uppercase">DG</span>
                    <Checkbox v-model="container.isHazardous" />
                  </label>
                  <button
                    type="button"
                    @click="removeContainer(Number(index))"
                    class="p-2 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <!-- Ocean / Air -->
              <div v-else class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end relative">
                <div class="col-span-3 space-y-1.5 pt-px">
                  <label class="text-[10px] font-bold text-muted-foreground uppercase opacity-70"
                    >Type</label
                  >
                  <Combobox
                    v-model="container.containerTypeId"
                    :options="oceanContainerTypes"
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
                    v-uppercase
                    type="text"
                    placeholder="e.g. TEMU1234567"
                    class="input-field"
                  />
                </div>
                <div class="md:col-span-4 space-y-2">
                  <label
                    class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
                    >SEAL NO.</label
                  >
                  <input
                    v-model="container.sealNumber"
                    v-uppercase
                    type="text"
                    placeholder="e.g. SN123456"
                    class="input-field"
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
                    @click="removeContainer(Number(index))"
                    class="p-2 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div class="ml-4 pl-4 border-l-2 border-border/50 space-y-3">
                <div class="flex items-center justify-between">
                  <h4 class="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
                    {{ isTrucking ? "Truck Cargo Items" : "Container Breakdown Items" }}
                  </h4>
                  <button
                    type="button"
                    @click="
                      !container.items
                        ? (container.items = [
                            {
                              sequenceNo: 1,
                              qty: 1,
                              packageTypeCode: '',
                              grossWeight: null,
                              netWeight: null,
                              measurementCbm: null,
                              hsCode: '',
                              description: '',
                            },
                          ])
                        : container.items.push({
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
                  :key="itemIndex"
                  class="p-3 bg-white border border-border/50 rounded-lg shadow-sm space-y-3 relative"
                >
                  <button
                    type="button"
                    @click="container.items?.splice(itemIndex, 1)"
                    class="absolute top-2 right-2 text-muted-foreground hover:text-destructive transition-colors"
                    :disabled="!container.items || container.items.length === 1"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                  <div class="grid grid-cols-12 gap-3 pr-6">
                    <div class="col-span-2 space-y-1">
                      <label class="text-[10px] uppercase font-bold text-muted-foreground"
                        >Qty</label
                      >
                      <input
                        type="number"
                        v-model.number="item.qty"
                        class="input-field h-8 text-sm"
                        v-uppercase
                      />
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
                      <input
                        type="number"
                        v-model.number="item.grossWeight"
                        step="0.01"
                        class="input-field h-8 text-sm"
                        v-uppercase
                      />
                    </div>
                    <div class="col-span-2 space-y-1">
                      <label class="text-[10px] uppercase font-bold text-muted-foreground"
                        >NW (KG)</label
                      >
                      <input
                        type="number"
                        v-model.number="item.netWeight"
                        step="0.01"
                        class="input-field h-8 text-sm"
                        v-uppercase
                      />
                    </div>
                    <div class="col-span-3 space-y-1">
                      <label class="text-[10px] uppercase font-bold text-muted-foreground"
                        >CBM</label
                      >
                      <input
                        type="number"
                        v-model.number="item.measurementCbm"
                        step="0.01"
                        class="input-field h-8 text-sm"
                        v-uppercase
                      />
                    </div>
                  </div>
                  <div class="grid grid-cols-12 gap-3 pr-6 mt-1">
                    <div class="col-span-4 space-y-1">
                      <label class="text-[10px] uppercase font-bold text-muted-foreground"
                        >HS Code</label
                      >
                      <input
                        type="text"
                        v-model="item.hsCode"
                        v-uppercase
                        class="input-field h-8 text-sm placeholder:opacity-50"
                        placeholder="e.g. 1902..."
                      />
                    </div>
                    <div class="col-span-8 space-y-1">
                      <label class="text-[10px] uppercase font-bold text-muted-foreground"
                        >Description Breakdown</label
                      >
                      <textarea
                        v-model="item.description"
                        v-uppercase
                        rows="6"
                        class="input-field text-sm placeholder:opacity-50 resize-y min-h-[100px] py-2"
                        :placeholder="
                          isTrucking
                            ? 'Description of goods loaded on this truck...'
                            : 'Description of goods in this container...'
                        "
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>

    <VesselQuickAddModal
      v-model:is-open="isVesselModalOpen"
      :initial-name="presetVesselName"
      @success="onVesselCreateSuccess"
    />
    <PlaneQuickAddModal
      v-model:is-open="isPlaneModalOpen"
      :initial-name="presetPlaneName"
      @success="onPlaneCreateSuccess"
    />
  </div>
</template>
