<script setup lang="ts">
import { Edit3, Loader2, MapPin, Plane, Plus, Search, Ship, Trash2 } from "lucide-vue-next";
import { toast } from "vue-sonner";
import Combobox from "~/components/ui/Combobox.vue";
import Modal from "~/components/ui/Modal.vue";
import type {
  LocationSource,
  LocationType,
  SaveTransportLocationPayload,
  TransportLocation,
} from "~/composables/usePorts";

definePageMeta({
  layout: "dashboard",
});

const { ports, pagination, stats, isLoading, fetchPorts, createPort, updatePort, deletePort } =
  usePorts();
const { canManage, requireManage } = useFeatureAccess("master.logistics");

const searchQuery = ref("");
const selectedType = ref<"ocean" | "air">("ocean");
const selectedStatus = ref("active");
const selectedSource = ref("all");
const currentPage = ref(1);
const pageSize = ref(25);
const isModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isSubmitting = ref(false);
const formError = ref<string | null>(null);
const editingLocation = ref<TransportLocation | null>(null);
const locationToDelete = ref<TransportLocation | null>(null);

const typeOptions = [
  { id: "ocean", name: "Sea Ports" },
  { id: "air", name: "Airports" },
];

const statusOptions = [
  { id: "active", name: "Active" },
  { id: "inactive", name: "Inactive" },
  { id: "all", name: "All Status" },
];

const sourceOptions = [
  { id: "all", name: "All Source" },
  { id: "SYSTEM", name: "System" },
  { id: "CUSTOM", name: "Custom" },
];

const form = ref<SaveTransportLocationPayload>({
  type: "SEA_PORT",
  code: "",
  name: "",
  city: "",
  country: "",
  countryCode: "",
  province: "",
  timezone: "",
  iataCode: "",
  icaoCode: "",
  isActive: true,
});

const apiType = computed(() => selectedType.value);
const pageTitle = computed(() => (selectedType.value === "air" ? "Airports" : "Sea Ports"));
const isAirportForm = computed(() => form.value.type === "AIRPORT");

const loadLocations = async () => {
  await fetchPorts({
    search: searchQuery.value.trim() || undefined,
    type: apiType.value || "ocean",
    page: currentPage.value,
    limit: pageSize.value,
    status: (selectedStatus.value || "active") as "all" | "active" | "inactive",
    source: (selectedSource.value || "all") as "all" | "SYSTEM" | "CUSTOM",
    paginated: true,
  });
};

let searchTimer: ReturnType<typeof setTimeout> | null = null;
watch([searchQuery, selectedType, selectedStatus, selectedSource], () => {
  if (searchTimer) clearTimeout(searchTimer);
  currentPage.value = 1;
  searchTimer = setTimeout(() => {
    loadLocations();
  }, 250);
});

watch(currentPage, loadLocations);

onMounted(loadLocations);

const filteredLocations = computed(() => {
  return [...ports.value].toSorted((a, b) => a.code.localeCompare(b.code));
});

const normalizeLocationType = (type: "ocean" | "air"): LocationType =>
  type === "air" ? "AIRPORT" : "SEA_PORT";

const resetForm = (type: LocationType = normalizeLocationType(selectedType.value)) => {
  form.value = {
    type,
    code: "",
    name: "",
    city: "",
    country: "",
    countryCode: "",
    province: "",
    timezone: "",
    iataCode: "",
    icaoCode: "",
    isActive: true,
  };
  formError.value = null;
};

const openCreateModal = () => {
  if (!requireManage("You only have view access for logistics master data.")) return;
  editingLocation.value = null;
  resetForm();
  isModalOpen.value = true;
};

const openEditModal = (location: TransportLocation) => {
  if (!requireManage("You only have view access for logistics master data.")) return;
  editingLocation.value = location;
  form.value = {
    type: location.type || normalizeLocationType(selectedType.value),
    code: location.code || "",
    name: location.name || "",
    city: location.city || "",
    country: location.country || "",
    countryCode: location.countryCode || "",
    province: location.province || "",
    timezone: location.timezone || "",
    iataCode: location.iataCode || "",
    icaoCode: location.icaoCode || "",
    isActive: location.isActive ?? true,
  };
  formError.value = null;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  editingLocation.value = null;
  resetForm();
};

const cleanPayload = (): SaveTransportLocationPayload => ({
  type: form.value.type,
  code: form.value.code.trim().toUpperCase(),
  name: form.value.name.trim().toUpperCase(),
  city: form.value.city?.trim().toUpperCase() || null,
  country: form.value.country.trim().toUpperCase(),
  countryCode: form.value.countryCode?.trim().toUpperCase() || null,
  province: form.value.province?.trim().toUpperCase() || null,
  timezone: form.value.timezone?.trim() || null,
  iataCode: form.value.iataCode?.trim().toUpperCase() || null,
  icaoCode: form.value.icaoCode?.trim().toUpperCase() || null,
  isActive: form.value.isActive,
});

const validateForm = () => {
  if (!form.value.code.trim()) return "Code is required";
  if (!form.value.name.trim()) return "Name is required";
  if (!form.value.country.trim()) return "Country is required";
  return null;
};

const handleSubmit = async () => {
  const error = validateForm();
  if (error) {
    formError.value = error;
    return;
  }

  isSubmitting.value = true;
  formError.value = null;
  const payload = cleanPayload();
  const result =
    editingLocation.value?.id != null
      ? await updatePort(editingLocation.value.id, payload)
      : await createPort(payload);

  if (result.success) {
    toast.success(editingLocation.value ? "Location updated" : "Location created");
    closeModal();
    selectedType.value = payload.type === "AIRPORT" ? "air" : "ocean";
    await loadLocations();
  } else {
    formError.value = result.error || "Failed to save location";
  }
  isSubmitting.value = false;
};

const openDeleteModal = (location: TransportLocation) => {
  if (!requireManage("You only have view access for logistics master data.")) return;
  if (location.source !== "CUSTOM") {
    toast.error("System locations cannot be deleted from this page.");
    return;
  }
  locationToDelete.value = location;
  isDeleteModalOpen.value = true;
};

const handleDelete = async () => {
  if (!locationToDelete.value?.id) return;
  isSubmitting.value = true;
  const result = await deletePort(locationToDelete.value.id);
  if (result.success) {
    toast.success("Location deleted");
    isDeleteModalOpen.value = false;
    locationToDelete.value = null;
    await loadLocations();
  } else {
    toast.error(result.error || "Failed to delete location");
  }
  isSubmitting.value = false;
};

const typeBadgeClass = (type?: LocationType) =>
  type === "AIRPORT"
    ? "bg-sky-50 text-sky-700 border-sky-200"
    : "bg-[#012D5A]/5 text-[#012D5A] border-[#012D5A]/15";

const sourceBadgeClass = (source?: LocationSource) =>
  source === "CUSTOM"
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : "bg-slate-50 text-slate-600 border-slate-200";

const sourceDotClass = (source?: LocationSource) =>
  source === "CUSTOM" ? "bg-emerald-500" : "bg-slate-400";
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Ports & Airports</h1>
        <p class="text-sm text-muted-foreground mt-1">
          Master data for route pickers and BL document print labels.
        </p>
      </div>
      <button
        v-if="canManage"
        type="button"
        @click="openCreateModal"
        class="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors"
      >
        <Plus class="w-4 h-4" />
        Add Location
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <div class="border border-border rounded-lg bg-white p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-muted-foreground">Loaded</p>
            <p class="text-2xl font-bold">{{ stats.total }}</p>
          </div>
          <div
            class="h-10 w-10 rounded-lg bg-[#012D5A]/10 text-[#012D5A] flex items-center justify-center"
          >
            <MapPin class="w-5 h-5" />
          </div>
        </div>
      </div>
      <div class="border border-border rounded-lg bg-white p-4">
        <p class="text-sm text-muted-foreground">Active</p>
        <p class="text-2xl font-bold">{{ stats.active }}</p>
      </div>
      <div class="border border-border rounded-lg bg-white p-4">
        <p class="text-sm text-muted-foreground">System</p>
        <p class="text-2xl font-bold">{{ stats.system }}</p>
      </div>
      <div class="border border-border rounded-lg bg-white p-4">
        <p class="text-sm text-muted-foreground">Custom</p>
        <p class="text-2xl font-bold">{{ stats.custom }}</p>
      </div>
    </div>

    <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
      <div class="relative w-full lg:max-w-md">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search code, name, city, country..."
          class="w-full h-10 pl-10 pr-4 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
          v-uppercase
        />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 w-full xl:w-auto">
        <Combobox v-model="selectedType" :options="typeOptions" class="min-w-[160px]" />
        <Combobox v-model="selectedStatus" :options="statusOptions" class="min-w-[150px]" />
        <Combobox v-model="selectedSource" :options="sourceOptions" class="min-w-[150px]" />
        <Combobox
          :model-value="String(pageSize)"
          :options="[
            { id: '25', name: '25 / page' },
            { id: '50', name: '50 / page' },
            { id: '100', name: '100 / page' },
          ]"
          class="min-w-[130px]"
          @update:model-value="
            (value) => {
              pageSize = Number(value || 25);
              currentPage = 1;
              loadLocations();
            }
          "
        />
      </div>
    </div>

    <div class="bg-white border border-border rounded-lg overflow-hidden">
      <div class="px-4 py-3 border-b border-border flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Ship v-if="selectedType === 'ocean'" class="w-4 h-4 text-[#012D5A]" />
          <Plane v-else class="w-4 h-4 text-[#012D5A]" />
          <h2 class="text-sm font-bold text-foreground">{{ pageTitle }}</h2>
        </div>
        <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin text-muted-foreground" />
      </div>

      <div class="relative overflow-x-auto">
        <div
          v-if="isLoading && filteredLocations.length > 0"
          class="absolute inset-0 z-10 bg-white/65 backdrop-blur-[1px] flex items-start justify-center pt-20"
        >
          <div
            class="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-border shadow-sm text-sm font-bold text-[#012D5A]"
          >
            <Loader2 class="w-4 h-4 animate-spin" />
            Loading locations...
          </div>
        </div>
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-border">
            <tr class="text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <th class="px-4 py-3">Type</th>
              <th class="px-4 py-3">Code</th>
              <th class="px-4 py-3">Name</th>
              <th class="px-4 py-3">City</th>
              <th class="px-4 py-3">Country</th>
              <th class="px-4 py-3">Source</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border/60">
            <template v-if="isLoading && filteredLocations.length === 0">
              <tr v-for="row in 8" :key="`loading-${row}`">
                <td class="px-4 py-4" colspan="8">
                  <div class="h-5 rounded bg-gray-100 animate-pulse"></div>
                </td>
              </tr>
            </template>
            <tr
              v-for="location in filteredLocations"
              :key="`${location.type}-${location.code}`"
              class="hover:bg-gray-50/70 transition-colors"
            >
              <td class="px-4 py-3">
                <span
                  class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium"
                  :class="typeBadgeClass(location.type)"
                >
                  <Plane v-if="location.type === 'AIRPORT'" class="h-3.5 w-3.5" />
                  <Ship v-else class="h-3.5 w-3.5" />
                  {{ location.type === "AIRPORT" ? "Airport" : "Sea Port" }}
                </span>
              </td>
              <td class="px-4 py-3 font-mono font-bold text-[#012D5A]">{{ location.code }}</td>
              <td class="px-4 py-3 min-w-[240px]">
                <div class="font-semibold text-foreground">{{ location.name }}</div>
                <div
                  v-if="location.iataCode || location.icaoCode"
                  class="text-xs text-muted-foreground"
                >
                  {{ [location.iataCode, location.icaoCode].filter(Boolean).join(" / ") }}
                </div>
              </td>
              <td class="px-4 py-3 text-muted-foreground">{{ location.city || "-" }}</td>
              <td class="px-4 py-3">{{ location.country || "-" }}</td>
              <td class="px-4 py-3">
                <span
                  class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium"
                  :class="sourceBadgeClass(location.source)"
                >
                  <span class="h-1.5 w-1.5 rounded-full" :class="sourceDotClass(location.source)" />
                  {{ location.source === "CUSTOM" ? "Custom" : "System" }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span
                  class="text-xs font-bold"
                  :class="(location.isActive ?? true) ? 'text-emerald-700' : 'text-red-600'"
                >
                  {{ (location.isActive ?? true) ? "Active" : "Inactive" }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center justify-end gap-1">
                  <button
                    v-if="canManage"
                    type="button"
                    @click="openEditModal(location)"
                    class="p-2 text-muted-foreground hover:text-[#012D5A] hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit location"
                  >
                    <Edit3 class="w-4 h-4" />
                  </button>
                  <button
                    v-if="canManage"
                    type="button"
                    @click="openDeleteModal(location)"
                    class="p-2 rounded-lg transition-colors"
                    :class="
                      location.source === 'CUSTOM'
                        ? 'text-muted-foreground hover:text-red-600 hover:bg-red-50'
                        : 'text-muted-foreground/40 cursor-not-allowed'
                    "
                    :title="
                      location.source === 'CUSTOM'
                        ? 'Delete location'
                        : 'System locations cannot be deleted'
                    "
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!isLoading && filteredLocations.length === 0">
              <td colspan="8" class="px-4 py-10 text-center text-muted-foreground">
                No locations found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="pagination.total > 0"
        class="px-4 py-3 border-t border-border bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3"
      >
        <p class="text-xs text-muted-foreground font-medium">
          Showing
          <span class="font-bold text-foreground">
            {{ (pagination.page - 1) * pagination.limit + 1 }}
          </span>
          -
          <span class="font-bold text-foreground">
            {{ Math.min(pagination.page * pagination.limit, pagination.total) }}
          </span>
          of
          <span class="font-bold text-foreground">{{ pagination.total }}</span>
          locations
        </p>
        <div :class="isLoading ? 'pointer-events-none opacity-60' : ''">
          <UiPagination
            v-model:page="currentPage"
            :total="pagination.total"
            :items-per-page="pagination.limit"
          />
        </div>
      </div>
    </div>

    <Modal
      v-model="isModalOpen"
      :title="editingLocation ? 'Edit Location' : 'Add Location'"
      description="Manage sea ports and airports used by operational documents."
      width="max-w-3xl"
      @close="closeModal"
    >
      <form class="space-y-5" @submit.prevent="handleSubmit">
        <div v-if="formError" class="p-3 rounded-lg bg-red-50 text-red-700 text-sm font-medium">
          {{ formError }}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="space-y-1.5">
            <label class="text-xs font-bold uppercase text-muted-foreground">Type</label>
            <Combobox
              :model-value="form.type"
              :options="[
                { id: 'SEA_PORT', name: 'Sea Port' },
                { id: 'AIRPORT', name: 'Airport' },
              ]"
              @update:model-value="(value) => (form.type = (value as LocationType) || 'SEA_PORT')"
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-bold uppercase text-muted-foreground">Code</label>
            <input
              v-model="form.code"
              class="w-full h-10 px-3 text-sm border border-border rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="IDJKT / CGK"
              v-uppercase
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-bold uppercase text-muted-foreground">Status</label>
            <Combobox
              :model-value="form.isActive ? 'active' : 'inactive'"
              :options="[
                { id: 'active', name: 'Active' },
                { id: 'inactive', name: 'Inactive' },
              ]"
              @update:model-value="(value) => (form.isActive = value !== 'inactive')"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-xs font-bold uppercase text-muted-foreground">Name</label>
            <input
              v-model="form.name"
              class="w-full h-10 px-3 text-sm border border-border rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Port / airport name"
              v-uppercase
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-bold uppercase text-muted-foreground">City</label>
            <input
              v-model="form.city"
              class="w-full h-10 px-3 text-sm border border-border rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="City"
              v-uppercase
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="space-y-1.5 md:col-span-2">
            <label class="text-xs font-bold uppercase text-muted-foreground">Country</label>
            <input
              v-model="form.country"
              class="w-full h-10 px-3 text-sm border border-border rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Indonesia"
              v-uppercase
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-bold uppercase text-muted-foreground">Country Code</label>
            <input
              v-model="form.countryCode"
              class="w-full h-10 px-3 text-sm border border-border rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="ID"
              v-uppercase
            />
          </div>
        </div>

        <div v-if="isAirportForm" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-xs font-bold uppercase text-muted-foreground">IATA Code</label>
            <input
              v-model="form.iataCode"
              class="w-full h-10 px-3 text-sm border border-border rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="CGK"
              v-uppercase
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-bold uppercase text-muted-foreground">ICAO Code</label>
            <input
              v-model="form.icaoCode"
              class="w-full h-10 px-3 text-sm border border-border rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="WIII"
              v-uppercase
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-xs font-bold uppercase text-muted-foreground">Province</label>
            <input
              v-model="form.province"
              class="w-full h-10 px-3 text-sm border border-border rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Province / state"
              v-uppercase
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-bold uppercase text-muted-foreground">Timezone</label>
            <input
              v-model="form.timezone"
              class="w-full h-10 px-3 text-sm border border-border rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Asia/Jakarta"
            />
          </div>
        </div>
      </form>

      <template #footer>
        <button
          type="button"
          @click="closeModal"
          class="px-4 py-2 text-sm font-bold border border-border rounded-lg hover:bg-muted transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="handleSubmit"
          :disabled="isSubmitting"
          class="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold bg-[#012D5A] text-white rounded-lg hover:bg-[#012D5A]/90 disabled:opacity-50 transition-colors"
        >
          <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
          Save
        </button>
      </template>
    </Modal>

    <Modal
      v-model="isDeleteModalOpen"
      title="Delete Location"
      description="This will hide the custom location from future pickers."
      width="max-w-md"
    >
      <p class="text-sm text-muted-foreground">
        Delete
        <span class="font-bold text-foreground">{{ locationToDelete?.code }}</span>
        -
        <span class="font-bold text-foreground">{{ locationToDelete?.name }}</span
        >?
      </p>
      <template #footer>
        <button
          type="button"
          @click="isDeleteModalOpen = false"
          class="px-4 py-2 text-sm font-bold border border-border rounded-lg hover:bg-muted transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="handleDelete"
          :disabled="isSubmitting"
          class="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
          Delete
        </button>
      </template>
    </Modal>
  </div>
</template>
