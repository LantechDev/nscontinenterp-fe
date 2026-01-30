<script setup lang="ts">
import { X, Save, Copy, Loader2 } from "lucide-vue-next";
import Combobox from "~/components/ui/Combobox.vue";
import type { Company, ContainerType, PackageType } from "~/composables/useMasterData";

interface BlParty {
  id: string;
  companyId?: string | null;
  partyRole?: {
    code: string;
    name: string;
  };
  partyRoleCode?: string;
}

interface BlData {
  id: string;
  blNumber: string;
  containerNumber?: string | null;
  sealNumber?: string | null;
  containerTypeId?: string | null;
  grossWeight?: string | null;
  netWeight?: string | null;
  measurement?: string | null;
  packagesCount?: number | null;
  packageTypeId?: string | null;
  cargoDescription?: string | null;
  statusId?: string | null;
  blParties?: BlParty[];
}

interface Props {
  modelValue: boolean;
  blId: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "saved"): void;
  (e: "update:modelValue", value: boolean): void;
  (e: "saved"): void;
}>();

const { fetchCompanies, fetchContainerTypes, fetchPackageTypes } = useMasterData();

const companies = ref<Company[]>([]);
const containerTypes = ref<ContainerType[]>([]);
const packageTypes = ref<PackageType[]>([]);

const isLoading = ref(false);
const isSaving = ref(false);

interface FormData {
  blNumber: string;
  containerNumber: string;
  sealNumber: string;
  containerTypeId: string;
  grossWeight: number;
  netWeight: number;
  measurement: number;
  packagesCount: number;
  packageTypeId: string;
  cargoDescription: string;
  statusId: string;
  shipperId: string;
  consigneeId: string;
  notifyPartyId: string;
}

const formData = reactive<FormData>({
  blNumber: "",
  containerNumber: "",
  sealNumber: "",
  containerTypeId: "",
  grossWeight: 0,
  netWeight: 0,
  measurement: 0,
  packagesCount: 0,
  packageTypeId: "",
  cargoDescription: "",
  statusId: "",
  shipperId: "",
  consigneeId: "",
  notifyPartyId: "",
});

function findParty(parties: BlParty[] | undefined, roleCode: string): BlParty | undefined {
  if (!parties) return undefined;
  return parties.find((p) => p.partyRole?.code === roleCode || p.partyRoleCode === roleCode);
}

async function loadBlData() {
  if (!props.blId) return;
  isLoading.value = true;
  try {
    const response = await $fetch<{ data: BlData }>(
      `/api/operational/bill-of-lading/${props.blId}`,
    );
    const data = response.data;

    formData.blNumber = data.blNumber || "";
    formData.containerNumber = data.containerNumber || "";
    formData.sealNumber = data.sealNumber || "";
    formData.containerTypeId = data.containerTypeId || "";
    formData.grossWeight = Number(data.grossWeight) || 0;
    formData.netWeight = Number(data.netWeight) || 0;
    formData.measurement = Number(data.measurement) || 0;
    formData.packagesCount = data.packagesCount || 0;
    formData.packageTypeId = data.packageTypeId || "";
    formData.cargoDescription = data.cargoDescription || "";
    formData.statusId = data.statusId || "";

    const shipper = findParty(data.blParties, "SHIPPER");
    const consignee = findParty(data.blParties, "CONSIGNEE");
    const notify = findParty(data.blParties, "NOTIFY_PARTY");

    formData.shipperId = shipper?.companyId || "";
    formData.consigneeId = consignee?.companyId || "";
    formData.notifyPartyId = notify?.companyId || "";
  } catch (error) {
    console.error("Failed to load BL", error);
    alert("Failed to load BL details");
  } finally {
    isLoading.value = false;
  }
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      Promise.all([
        fetchCompanies().then((res) => {
          companies.value = res || [];
        }),
        fetchContainerTypes().then((res) => {
          containerTypes.value = res || [];
        }),
        fetchPackageTypes().then((res) => {
          packageTypes.value = res || [];
        }),
        loadBlData(),
      ]);
    }
  },
);

async function handleCopyFromJob() {
  if (!confirm("This will overwrite existing parties with data from the Job. Continue?")) return;

  isLoading.value = true;
  try {
    await $fetch(`/api/operational/bill-of-lading/${props.blId}/copy-from-job`, {
      method: "POST",
    });
    await loadBlData();
    alert("Data copied from Job. You can now edit it for this BL.");
  } catch (error) {
    console.error("Copy failed", error);
    alert("Failed to copy data");
  } finally {
    isLoading.value = false;
  }
}

async function handleSave() {
  isSaving.value = true;
  try {
    const payload = {
      ...formData,
      parties: [
        { roleCode: "SHIPPER", companyId: formData.shipperId },
        { roleCode: "CONSIGNEE", companyId: formData.consigneeId },
        { roleCode: "NOTIFY_PARTY", companyId: formData.notifyPartyId },
      ].filter((p) => p.companyId),
    };

    await $fetch(`/api/operational/bill-of-lading/${props.blId}`, {
      method: "PATCH",
      body: payload,
    });

    emit("saved");
    emit("update:modelValue", false);
  } catch (error) {
    console.error("Save failed", error);
    alert("Failed to save BL");
  } finally {
    isSaving.value = false;
  }
}
</script>

<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 flex justify-end">
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-black/50 transition-opacity"
      @click="$emit('update:modelValue', false)"
    ></div>

    <!-- Drawer Panel -->
    <div
      class="relative w-full max-w-2xl bg-background h-full shadow-xl flex flex-col animate-slide-in-right"
    >
      <!-- Header -->
      <div
        class="px-6 py-4 border-b border-border flex items-center justify-between bg-card/50 backdrop-blur"
      >
        <div>
          <h2 class="text-lg font-semibold">Edit Bill of Lading</h2>
          <p class="text-sm text-muted-foreground">{{ formData.blNumber }}</p>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="handleCopyFromJob"
            class="btn-outline text-xs h-8 gap-2"
            :disabled="isLoading"
          >
            <Copy class="w-3.5 h-3.5" />
            Copy from Job
          </button>
          <button
            @click="$emit('update:modelValue', false)"
            class="p-2 hover:bg-muted rounded-full"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6 space-y-8" v-if="!isLoading">
        <!-- General Section -->
        <section class="space-y-4">
          <h3 class="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            General Info
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-medium">BL Number</label>
              <input v-model="formData.blNumber" class="input-field" />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium">Container Number</label>
              <input
                v-model="formData.containerNumber"
                class="input-field"
                placeholder="ABCD1234567"
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium">Seal Number</label>
              <input v-model="formData.sealNumber" class="input-field" />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium">Type</label>
              <select v-model="formData.containerTypeId" class="input-field">
                <option value="">Select Type</option>
                <option v-for="t in containerTypes" :key="t.id" :value="t.id">
                  {{ t.name }}
                </option>
              </select>
            </div>
          </div>
        </section>

        <hr class="border-border" />

        <!-- Parties Section -->
        <section class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Parties
            </h3>
          </div>

          <div class="space-y-4">
            <div class="space-y-2">
              <label class="text-sm font-medium">Shipper</label>
              <Combobox
                v-model="formData.shipperId"
                :options="companies"
                label-key="name"
                value-key="id"
                placeholder="Select Shipper..."
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium">Consignee</label>
              <Combobox
                v-model="formData.consigneeId"
                :options="companies"
                label-key="name"
                value-key="id"
                placeholder="Select Consignee..."
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium">Notify Party</label>
              <Combobox
                v-model="formData.notifyPartyId"
                :options="companies"
                label-key="name"
                value-key="id"
                placeholder="Select Notify Party..."
              />
            </div>
          </div>
        </section>

        <hr class="border-border" />

        <!-- Cargo Section -->
        <section class="space-y-4">
          <h3 class="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Cargo Details
          </h3>
          <div class="grid grid-cols-3 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-medium">Gross Weight</label>
              <div class="relative">
                <input
                  v-model.number="formData.grossWeight"
                  type="number"
                  class="input-field pr-8"
                />
                <span class="absolute right-3 top-2.5 text-xs text-muted-foreground">KGS</span>
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium">Net Weight</label>
              <div class="relative">
                <input v-model.number="formData.netWeight" type="number" class="input-field pr-8" />
                <span class="absolute right-3 top-2.5 text-xs text-muted-foreground">KGS</span>
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium">Measurement</label>
              <div class="relative">
                <input
                  v-model.number="formData.measurement"
                  type="number"
                  class="input-field pr-8"
                />
                <span class="absolute right-3 top-2.5 text-xs text-muted-foreground">CBM</span>
              </div>
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Description of Goods</label>
            <textarea
              v-model="formData.cargoDescription"
              rows="4"
              class="input-field min-h-[100px]"
            ></textarea>
          </div>
        </section>
      </div>

      <div v-else class="flex-1 flex items-center justify-center">
        <Loader2 class="w-8 h-8 animate-spin text-primary" />
      </div>

      <!-- Footer -->
      <div class="p-6 border-t border-border flex justify-end gap-3 bg-card/50 backdrop-blur">
        <button type="button" @click="$emit('update:modelValue', false)" class="btn-secondary">
          Cancel
        </button>
        <button
          type="button"
          @click="handleSave"
          class="btn-primary"
          :disabled="isSaving || isLoading"
        >
          <Loader2 v-if="isSaving" class="w-4 h-4 mr-2 animate-spin" />
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>
