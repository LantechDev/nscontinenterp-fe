<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { Trash2, Box, Plus, FileText, Users, Clock, MapPin } from "lucide-vue-next";
import { toast } from "vue-sonner";

import Combobox from "~/components/ui/Combobox.vue";
import JobPartyRow from "~/pages/operational/jobs/components/JobPartyRow.vue";
import SectionCard from "~/pages/operational/jobs/components/SectionCard.vue";
import DatePicker from "~/components/ui/DatePicker.vue";
import Checkbox from "~/components/ui/Checkbox.vue";
import VesselQuickAddModal from "~/components/operational/VesselQuickAddModal.vue";

import type {
  ActiveJobData,
  EditFormType,
  EblContainerItem,
  EblContainer,
  EblVessel,
} from "./types";

// Depending on your project auto-imports, you might already have useMasterData
// If not explicitly declared, Nuxt 3 auto-imports it.
// Assuming useMasterData is auto-imported globally.

import type {
  Company,
  ContainerType,
  PackageType,
  Vessel,
  Port,
} from "~/composables/useMasterData";

const props = defineProps<{
  jobData: ActiveJobData;
}>();

const editForm = defineModel<EditFormType>({ required: true });

const {
  fetchCompanies,
  fetchContainerTypes,
  fetchPackageTypes,
  fetchVessels,
  fetchPorts,
  createVessel,
} = useMasterData();

const { confirm } = useConfirm();

const companies = ref<Company[]>([]);
const containerTypes = ref<ContainerType[]>([]);
const packageTypes = ref<PackageType[]>([]);
const vessels = ref<Vessel[]>([]);
const portsPol = ref<Port[]>([]);
const portsPod = ref<Port[]>([]);

onMounted(async () => {
  const [c, ct, pt, v] = await Promise.all([
    fetchCompanies(),
    fetchContainerTypes(),
    fetchPackageTypes(),
    fetchVessels(),
  ]);
  companies.value = c;
  containerTypes.value = ct;
  packageTypes.value = pt;
  vessels.value = v;

  if (editForm.value.pol) portsPol.value = await fetchPorts(editForm.value.pol);
  if (editForm.value.pod) portsPod.value = await fetchPorts(editForm.value.pod);

  // Sync Shipper References from Job if empty in eBL
  if (
    props.jobData?.shipperReferences &&
    (!editForm.value.shipperReferences || editForm.value.shipperReferences.length === 0)
  ) {
    editForm.value.shipperReferences = [...props.jobData.shipperReferences];
  }
});

// Vessel Modal State
const isVesselModalOpen = ref(false);
const presetVesselName = ref("");
const activeVesselObj = ref<EblVessel | null>(null);

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
    if (editForm.value.isNotifySameAsConsignee) {
      editForm.value.notifyPartyId = val;
    }
  },
);

watch(
  () => editForm.value.consigneeAddressId,
  (val) => {
    if (editForm.value.isNotifySameAsConsignee) {
      editForm.value.notifyPartyAddressId = val;
    }
  },
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
    editForm.value[addressKey] = "";
    return;
  }
  const company = companies.value.find((c) => c.id === companyId);
  if (company && company.addresses && company.addresses.length > 0) {
    const defaultAddr = company.addresses.find((a: Record<string, unknown>) => a.isDefault);
    editForm.value[addressKey] = defaultAddr ? defaultAddr.id : company.addresses[0]!.id;
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
    if (!editForm.value.isNotifySameAsConsignee) {
      assignDefaultAddress(val || "", "notifyPartyAddressId");
    }
  },
);
watch(
  () => editForm.value.forwarderId,
  (val) => assignDefaultAddress(val || "", "forwarderAddressId"),
);
watch(
  () => editForm.value.customerId,
  (val) => assignDefaultAddress(val || "", "customerAddressId"),
);

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

    if (f.freightPayment === "PREPAID_POL") {
      f.prepaidValue = `PREPAID AT ${polCity.toUpperCase()}`;
    } else if (f.freightPayment === "PREPAID_POD") {
      f.prepaidValue = `PREPAID AT ${podCity.toUpperCase()}`;
    } else if (f.freightPayment === "COLLECT_POL") {
      f.collectValue = `COLLECT AT ${polCity.toUpperCase()}`;
    } else if (f.freightPayment === "COLLECT_POD") {
      f.collectValue = `COLLECT AT ${podCity.toUpperCase()}`;
    }
  },
  { deep: true },
);

const handleSearchPol = async (q: string) => {
  portsPol.value = await fetchPorts(q);
};
const handleSearchPod = async (q: string) => {
  portsPod.value = await fetchPorts(q);
};

const handleCreateVessel = async (name: string, vessel?: EblVessel) => {
  presetVesselName.value = name;
  activeVesselObj.value = vessel || null;
  isVesselModalOpen.value = true;
};

const onVesselCreateSuccess = async (vessel: { id: string; name: string }) => {
  vessels.value = await fetchVessels();

  // Auto-assign the created vessel to the active field
  if (activeVesselObj.value) {
    activeVesselObj.value.vesselId = vessel.id;
  } else {
    if (!editForm.value.vessels) editForm.value.vessels = [];
    if (editForm.value.vessels && editForm.value.vessels.length > 0) {
      const firstVessel = editForm.value.vessels[0];
      if (firstVessel) {
        firstVessel.vesselId = vessel.id;
      }
    } else {
      editForm.value.vessels.push({
        vesselId: vessel.id,
        vesselName: vessel.name,
        voyageNumber: "",
        etd: "",
        sequence: 0,
      });
    }
  }

  isVesselModalOpen.value = false;
  toast.success(`Vessel "${vessel.name}" created successfully.`);
};

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

const FREIGHT_PAYMENT_OPTIONS = computed(() => {
  const f = editForm.value;
  const polCity =
    portsPol.value.find((p) => p.code === f.pol)?.name ||
    props.jobData?.polName ||
    f.pol ||
    "POLPort";
  const podCity =
    portsPod.value.find((p) => p.code === f.pod)?.name ||
    props.jobData?.podName ||
    f.pod ||
    "PODPort";

  return [
    { id: "PREPAID_POL", name: `Prepaid at POL (${polCity})` },
    { id: "PREPAID_POD", name: `Prepaid at POD (${podCity})` },
    { id: "COLLECT_POL", name: `Collect at POL (${polCity})` },
    { id: "COLLECT_POD", name: `Collect at POD (${podCity})` },
  ];
});

const addContainer = () => {
  if (!editForm.value.containers) editForm.value.containers = [];
  editForm.value.containers.push({
    containerNumber: "",
    sealNumber: "",
    containerTypeId: "",
    isHazardous: false,
    items: [{ sequenceNo: 1, qty: 1, packageTypeCode: "", description: "" }],
  });
};
const removeContainer = (idx: number) => editForm.value.containers.splice(idx, 1);

function getVesselLabels(index: number) {
  const vesselsCount = editForm.value.vessels?.length || 0;
  const isFirst = index === 0;
  const isLast = index === vesselsCount - 1;

  return {
    header: isFirst
      ? "Feeder Vessel"
      : isLast
        ? `Mother Vessel ${index} (Last)`
        : `Mother Vessel ${index}`,
    etd: isFirst ? "ETD POL" : "ETD T/S PORT",
    eta: isLast ? "ETA POD" : "ETA NEXT PORT",
    leftPortLabel: isFirst ? "POL Name" : "T/S Port Name",
    rightPortLabel: isLast ? "POD Name" : "Next Port Name",
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

// Maintain Vessel Roles and Sequence
watch(
  () => editForm.value.vessels,
  (vesselList) => {
    if (!vesselList) return;
    vesselList.forEach((v, idx) => {
      v.sequence = idx;
      v.vesselType = idx === 0 ? "feeder" : "mother";
    });
  },
  { deep: true },
);

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
    <SectionCard id="parties" title="Involved Parties" :icon="Users" no-padding>
      <div class="w-full">
        <JobPartyRow
          label="Job Customer"
          required
          :companies="companies"
          v-model:companyId="editForm.customerId"
          v-model:addressId="editForm.customerAddressId"
        />

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

        <JobPartyRow
          label="Forwarder"
          description="(Optional)"
          :companies="companies"
          v-model:companyId="editForm.forwarderId"
          v-model:addressId="editForm.forwarderAddressId"
        />

        <!-- Shipper References (PO Numbers) -->
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
                References to be printed on the Bill of Lading
              </p>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox v-model="editForm.showShipperReferencesOnBl" />
              <span class="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider"
                >Show on BL</span
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

    <!-- Route Details Integrated into Movement -->

    <SectionCard id="cargo" title="Cargo Information" :icon="Box">
      <div class="space-y-6">
        <div class="space-y-2 md:col-span-4">
          <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
            >MAIN DESCRIPTION (OVERALL COMMODITY)</label
          >
          <textarea
            v-model.trim="editForm.mainDescription"
            v-uppercase
            rows="10"
            placeholder="Description of goods to appear on BL..."
            class="input-field min-h-[250px] py-3 resize-y transition-all duration-200"
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
            class="input-field min-h-[120px] py-3 resize-y transition-all duration-200"
          ></textarea>
        </div>
      </div>
    </SectionCard>

    <SectionCard id="movement" title="Route & Movement Schedule" :icon="Clock">
      <div class="space-y-8">
        <!-- Integrated Route Details -->

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-border/50">
          <div class="space-y-2">
            <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
              >CARGO MOVEMENT</label
            >
            <Combobox v-model="editForm.cargoMovementId" :options="CARGO_MOVEMENTS" />
          </div>
          <div class="space-y-2">
            <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
              >DELIVERY MOVEMENT</label
            >
            <Combobox v-model="editForm.deliveryMovementId" :options="DELIVERY_MOVEMENTS" />
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
              @click="addVessel"
              class="text-xs text-blue-600 hover:text-blue-700 font-bold uppercase tracking-widest flex items-center gap-1.5 transition-colors"
            >
              <Plus class="w-3.5 h-3.5" /> Add Vessel
            </button>
          </div>

          <div class="space-y-4">
            <div
              v-for="(vessel, vIndex) in editForm.vessels"
              :key="vessel.id || vIndex"
              class="p-5 bg-muted/5 border border-border/50 rounded-2xl relative group/vessel transition-all hover:bg-white hover:shadow-sm"
            >
              <div class="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
                <!-- Vessel Selection -->
                <div class="md:col-span-5 space-y-2">
                  <label
                    class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1"
                  >
                    {{ getVesselLabels(vIndex).header }}
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
                    v-uppercase
                    type="text"
                    class="input-field h-10"
                    placeholder="Voyage..."
                  />
                </div>

                <!-- ETD -->
                <div class="md:col-span-2 space-y-2">
                  <label
                    class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1"
                    >{{ getVesselLabels(vIndex).etd }}</label
                  >
                  <DatePicker v-model="vessel.etd" placeholder="Select ETD..." class="h-10" />
                </div>

                <!-- ETA -->
                <div class="md:col-span-2 space-y-2 relative">
                  <label
                    class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1"
                    >{{ getVesselLabels(vIndex).eta }}</label
                  >
                  <DatePicker v-model="vessel.eta" placeholder="Select ETA..." class="h-10" />
                  <!-- Micro hint for transit -->
                  <div
                    v-if="vIndex === 0 && getVesselLabels(vIndex).hasTransit"
                    class="absolute -bottom-4 left-1 text-[9px] text-primary font-bold animate-pulse"
                  >
                    Transit detected → T/S Port
                  </div>
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

                  <!-- Right Port Picker -->
                  <div class="space-y-2">
                    <label
                      class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1 opacity-70"
                    >
                      {{ getVesselLabels(vIndex).rightPortLabel }}
                    </label>
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

                  <!-- Port Collision Warning -->
                  <div
                    class="col-span-1 md:col-span-2"
                    v-if="
                      (vIndex === 0 ? editForm.pol : editForm.vessels[vIndex - 1]!.tsPortId) ===
                        (vIndex === editForm.vessels.length - 1 ? editForm.pod : vessel.tsPortId) &&
                      (vIndex === 0 ? editForm.pol : editForm.vessels[vIndex - 1]!.tsPortId)
                    "
                  >
                    <p
                      class="text-[10px] text-destructive font-bold animate-pulse flex items-center gap-1 bg-destructive/5 p-2 rounded-lg border border-destructive/10"
                    >
                      ⚠️ Left and Right port cannot be the same
                    </p>
                  </div>
                </div>

                <!-- Remove Button -->
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

          <!-- Final ETA -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div class="space-y-2">
              <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
                >Final ETA</label
              >
              <DatePicker v-model="editForm.eta" placeholder="Select Final ETA..." />
            </div>
            <div class="space-y-2 md:col-span-1">
              <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
                >Date Cargo Received</label
              >
              <DatePicker v-model="editForm.dateCargoReceived" placeholder="Select Date..." />
            </div>
          </div>
        </div>
      </div>
    </SectionCard>

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

    <SectionCard id="containers" title="Containers Breakdown" :icon="Box">
      <div class="space-y-6">
        <div class="border rounded-xl mt-6 overflow-visible">
          <div
            class="bg-muted/10 px-4 py-3 border-b flex justify-between items-center rounded-t-xl"
          >
            <h3 class="font-medium text-[14px]">Containers & Seals</h3>
            <button
              type="button"
              @click="addContainer"
              class="btn-outline h-8 px-3 text-xs gap-1.5 flex items-center"
            >
              <Plus class="w-3.5 h-3.5" />
              Add Container
            </button>
          </div>
          <div class="p-4 space-y-4 bg-muted/5 rounded-b-xl">
            <div
              v-for="(container, index) in editForm.containers"
              :key="index"
              class="space-y-4 pb-4 border-b border-border/50 last:border-0 last:pb-0"
            >
              <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end relative">
                <div class="col-span-3 space-y-1.5 pt-px">
                  <label class="text-[10px] font-bold text-muted-foreground uppercase opacity-70"
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
                    class="p-2 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div class="ml-4 pl-4 border-l-2 border-border/50 space-y-3">
                <div class="flex items-center justify-between">
                  <h4 class="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
                    Container Breakdown Items
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
                        class="input-field text-sm placeholder:opacity-50 resize-y min-h-[100px] py-2 transition-all duration-200"
                        placeholder="Description of goods in this container..."
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

    <!-- Quick Add Vessel Modal -->
    <VesselQuickAddModal
      v-model:is-open="isVesselModalOpen"
      :initial-name="presetVesselName"
      @success="onVesselCreateSuccess"
    />
  </div>
</template>
