<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { Trash2, Box, Plus, FileText, Users, Clock, MapPin } from "lucide-vue-next";
import { toast } from "vue-sonner";

import Combobox from "~/components/ui/Combobox.vue";
import JobPartyRow from "~/pages/operational/jobs/components/JobPartyRow.vue";
import SectionCard from "~/pages/operational/jobs/components/SectionCard.vue";
import DatePicker from "~/components/ui/DatePicker.vue";

import type { ActiveJobData, EditFormType, EblContainerItem, EblContainer } from "./types";

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
});

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
    | "forwarderAddressId",
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
      f.prepaidValue = `Prepaid at ${polCity}`;
    } else if (f.freightPayment === "PREPAID_POD") {
      f.prepaidValue = `Prepaid at ${podCity}`;
    } else if (f.freightPayment === "COLLECT_POL") {
      f.collectValue = `Collect at ${polCity}`;
    } else if (f.freightPayment === "COLLECT_POD") {
      f.collectValue = `Collect at ${podCity}`;
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

const handleCreateVessel = async (name: string) => {
  if (!confirm(`Create new vessel "${name}"?`)) return;
  const result = await createVessel(name);
  if (result.success && result.data) {
    vessels.value = await fetchVessels();
    editForm.value.vesselId = result.data.id;
    toast.success(`Vessel "${name}" created successfully.`);
  } else {
    toast.error("Failed to create vessel: " + (result.error || "Unknown error"));
  }
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
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <SectionCard id="parties" title="Involved Parties" :icon="Users" no-padding>
      <div class="w-full">
        <JobPartyRow
          label="Shipper"
          required
          :companies="companies"
          v-model:companyId="editForm.shipperId"
          v-model:addressId="editForm.shipperAddressId"
        />

        <!-- Shipper References -->
        <div class="mt-4 mb-2 p-4 bg-muted/5 rounded-xl border border-border/50">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <label class="text-xs font-bold text-muted-foreground tracking-wider uppercase"
              >Shipper References (PO Numbers)</label
            >
            <label
              class="flex items-center gap-2 text-xs font-medium cursor-pointer hover:text-foreground transition-colors group"
            >
              <input
                type="checkbox"
                v-model="editForm.showShipperReferencesOnBl"
                class="rounded border-input text-primary focus:ring-primary h-4 w-4 bg-background transition-all"
              />
              <span class="group-hover:underline">Show on printed BL</span>
            </label>
          </div>
          <div class="space-y-3">
            <div class="flex gap-2">
              <input
                v-model="newShipperRef"
                @keyup.enter="addShipperRef"
                type="text"
                placeholder="Enter PO Number..."
                class="input-field flex-1 max-w-sm h-9 text-sm"
              />
              <button
                type="button"
                @click="addShipperRef"
                class="btn-outline h-9 px-4 text-xs font-semibold gap-1.5 flex items-center shadow-sm"
              >
                <Plus class="w-4 h-4" /> Add Reference
              </button>
            </div>
            <div
              v-if="editForm.shipperReferences && editForm.shipperReferences.length > 0"
              class="flex flex-wrap gap-2 mt-3 p-3 bg-white border border-border/40 rounded-lg shadow-sm"
            >
              <span
                v-for="(ref, idx) in editForm.shipperReferences"
                :key="idx"
                class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-blue-50/50 border border-blue-100 text-blue-900 text-xs font-semibold"
              >
                {{ ref }}
                <button
                  type="button"
                  @click="removeShipperRef(idx)"
                  class="hover:text-red-500 text-blue-400 hover:bg-red-50 rounded-sm p-0.5 transition-colors"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </span>
            </div>
            <p v-else class="text-xs text-muted-foreground italic mt-2">
              No shipper references added yet.
            </p>
          </div>
        </div>

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
              class="flex items-center gap-2 text-[13px] text-muted-foreground cursor-pointer hover:text-foreground transition-colors group w-fit mb-1.5"
            >
              <input
                type="checkbox"
                v-model="editForm.isNotifySameAsConsignee"
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
          v-model:companyId="editForm.forwarderId"
          v-model:addressId="editForm.forwarderAddressId"
        />
      </div>
    </SectionCard>

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
            v-model="editForm.preCarriageBy"
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
            v-model="editForm.placeOfReceipt"
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
              v-model="editForm.pol"
              :options="portsPol"
              label-key="name"
              value-key="code"
              placeholder="Search port..."
              class="[&_button]:pl-9"
              :filter-local="false"
              @search="handleSearchPol"
            />
          </div>
        </div>
        <div
          class="hidden md:flex absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 text-muted-foreground/40"
        >
          <MapPin class="w-5 h-5 opacity-0" />
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
              v-model="editForm.pod"
              :options="portsPod"
              label-key="name"
              value-key="code"
              placeholder="Search port..."
              class="[&_button]:pl-9"
              :filter-local="false"
              @search="handleSearchPod"
            />
          </div>
        </div>

        <!-- Row 3: Place of Delivery & Final Destination -->
        <div class="space-y-2">
          <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
            >PLACE OF DELIVERY</label
          >
          <input
            v-model="editForm.placeOfDelivery"
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
            v-model="editForm.finalDestination"
            type="text"
            placeholder="Defaults to POD if empty"
            class="input-field"
          />
        </div>
      </div>
    </SectionCard>

    <SectionCard id="cargo" title="Cargo Information" :icon="Box">
      <div class="space-y-6">
        <div class="space-y-2">
          <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
            >HS CODE / COMMODITY</label
          >
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div class="md:col-span-1">
              <input
                v-model="editForm.hsCode"
                type="text"
                placeholder="e.g. 19023040"
                class="input-field"
                required
              />
            </div>
            <div class="md:col-span-3">
              <textarea
                v-model="editForm.commodity"
                rows="3"
                placeholder="e.g. 3317 CARTONS OF INSTANT NOODLES"
                class="input-field resize-none focus:h-24 transition-all duration-200"
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
            v-model="editForm.mainDescription"
            rows="4"
            placeholder="Description of goods to appear on BL..."
            class="input-field resize-y focus:h-32 transition-all duration-200"
          ></textarea>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
            >SHIPPING MARKS</label
          >
          <textarea
            v-model="editForm.shippingMark"
            rows="3"
            placeholder="Enter marks and numbers..."
            class="input-field resize-none focus:h-24 transition-all duration-200"
          ></textarea>
        </div>
      </div>
    </SectionCard>

    <SectionCard id="movement" title="Movement & Schedule" :icon="Clock">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <div class="space-y-2">
          <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
            >VESSEL</label
          >
          <Combobox
            v-model="editForm.vesselId"
            :options="vessels"
            label-key="name"
            value-key="id"
            placeholder="Search Vessel..."
            allow-create
            @create="handleCreateVessel"
          />
        </div>
        <div class="space-y-2">
          <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
            >VOYAGE NUMBER</label
          >
          <input
            v-model="editForm.voyageNumber"
            type="text"
            placeholder="e.g. 053W"
            class="input-field"
          />
        </div>
        <div class="space-y-2 md:col-start-1 md:col-span-1">
          <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
            >ETD</label
          >
          <DatePicker v-model="editForm.etd" placeholder="Select ETD..." />
        </div>
        <div class="space-y-2 md:col-start-2 md:col-span-1">
          <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
            >ETA</label
          >
          <DatePicker v-model="editForm.eta" placeholder="Select ETA..." />
        </div>
        <div class="space-y-2 md:col-span-1">
          <label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"
            >Date Cargo Received</label
          >
          <DatePicker v-model="editForm.dateCargoReceived" placeholder="Select Date..." />
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
                    type="text"
                    placeholder="e.g. TEMU1234567"
                    class="input-field uppercase"
                  />
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
                        rows="2"
                        class="input-field text-sm placeholder:opacity-50 resize-y focus:h-24 transition-all duration-200"
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
  </div>
</template>
