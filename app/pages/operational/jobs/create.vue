<script setup lang="ts">
import { ArrowLeft, Save } from "lucide-vue-next";
import Combobox from "~/components/ui/Combobox.vue";

// Import types implicitly or explicitly if exported from composable
import type { Company, ContainerType, Vessel } from "~/composables/useMasterData";

const { confirm } = useConfirm();

definePageMeta({
  layout: "dashboard",
});

const { createJob, isLoading } = useJobs();
const { fetchCompanies, fetchContainerTypes, fetchVessels, createCompany, createVessel } =
  useMasterData();
const router = useRouter();

const companies = ref<Company[]>([]);
const containerTypes = ref<ContainerType[]>([]);
const vessels = ref<Vessel[]>([]);

onMounted(async () => {
  await refreshMasterData();
});

async function refreshMasterData() {
  const [comps, types, vess] = await Promise.all([
    fetchCompanies(),
    fetchContainerTypes(),
    fetchVessels(),
  ]);
  companies.value = comps;
  containerTypes.value = types;
  vessels.value = vess;
}

const formData = reactive({
  shipperId: "",
  consigneeId: "",
  commodity: "",
  pol: "",
  pod: "",
  vesselId: "",
  etd: "",
  eta: "",
  containerTypeId: "",
  totalBlCount: 1,
});

async function handleCreateCompany(name: string, field: "shipperId" | "consigneeId") {
  const confirmed = await confirm({
    title: "Create Company",
    message: `Create new company "${name}"?`,
  });
  if (!confirmed) return;

  const result = await createCompany(name);
  if (result.success && result.data) {
    await refreshMasterData(); // Refresh list to include new company
    formData[field] = result.data.id; // Select the new company
  } else {
    await confirm({
      title: "Error",
      message: "Failed to create company: " + (result.error || "Unknown error"),
      type: "danger",
    });
  }
}

async function handleCreateVessel(name: string) {
  const confirmed = await confirm({
    title: "Create Vessel",
    message: `Create new vessel "${name}"?`,
  });
  if (!confirmed) return;

  const result = await createVessel(name);
  if (result.success && result.data) {
    await refreshMasterData();
    formData.vesselId = result.data.id;
  } else {
    await confirm({
      title: "Error",
      message: "Failed to create vessel: " + (result.error || "Unknown error"),
      type: "danger",
    });
  }
}

async function handleSubmit() {
  // Basic validation
  if (!formData.shipperId || !formData.consigneeId) {
    await confirm({
      title: "Validation Error",
      message: "Shipper and Consignee are required",
      type: "danger",
    });
    return;
  }

  const { success, error } = await createJob({
    ...formData,
  });

  if (success) {
    router.push("/operational/jobs");
  } else {
    await confirm({
      title: "Error",
      message: "Failed to create job: " + (error || JSON.stringify(error)),
      type: "danger",
    });
  }
}
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <div class="page-header">
      <div class="flex items-center gap-4">
        <NuxtLink to="/operational/jobs" class="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft class="w-5 h-5" />
        </NuxtLink>
        <div>
          <h1 class="page-title">Open Job Baru</h1>
          <p class="text-muted-foreground mt-1">Buat job/shipment baru</p>
        </div>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="card-elevated p-6 space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Shipper/Consignee inputs -->
        <div class="space-y-2">
          <label class="text-sm font-medium">Shipper</label>
          <Combobox
            v-model="formData.shipperId"
            :options="companies"
            label-key="name"
            value-key="id"
            placeholder="Pilih atau Buat Shipper..."
            allow-create
            @create="(name) => handleCreateCompany(name, 'shipperId')"
          />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Consignee</label>
          <Combobox
            v-model="formData.consigneeId"
            :options="companies"
            label-key="name"
            value-key="id"
            placeholder="Pilih atau Buat Consignee..."
            allow-create
            @create="(name) => handleCreateCompany(name, 'consigneeId')"
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">Komoditas</label>
          <input
            v-model="formData.commodity"
            type="text"
            placeholder="Electronics"
            class="input-field"
            required
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">Pelabuhan Muat (POL)</label>
          <input
            v-model="formData.pol"
            type="text"
            placeholder="Jakarta"
            class="input-field"
            required
          />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Pelabuhan Bongkar (POD)</label>
          <input
            v-model="formData.pod"
            type="text"
            placeholder="Singapore"
            class="input-field"
            required
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">Vessel / Nama Kapal</label>
          <Combobox
            v-model="formData.vesselId"
            :options="vessels"
            label-key="name"
            value-key="id"
            placeholder="Pilih atau Buat Vessel..."
            allow-create
            @create="handleCreateVessel"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">ETD</label>
            <input v-model="formData.etd" type="date" class="input-field" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">ETA</label>
            <input v-model="formData.eta" type="date" class="input-field" />
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">Jenis Container</label>
          <select v-model="formData.containerTypeId" class="input-field">
            <option value="">Pilih Jenis</option>
            <option v-for="type in containerTypes" :key="type.id" :value="type.id">
              {{ type.name }} ({{ type.code }})
            </option>
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Jumlah BL</label>
          <input v-model.number="formData.totalBlCount" type="number" min="1" class="input-field" />
        </div>
      </div>
      <div class="flex justify-end gap-3 pt-4 border-t border-border">
        <NuxtLink to="/operational/jobs" class="btn-secondary">Batal</NuxtLink>
        <button type="submit" class="btn-primary" :disabled="isLoading">
          <Save class="w-4 h-4 mr-2" />
          {{ isLoading ? "Menyimpan..." : "Simpan" }}
        </button>
      </div>
    </form>
  </div>
</template>
