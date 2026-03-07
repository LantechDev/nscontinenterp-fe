<script setup lang="ts">
import {
  Plus,
  Search,
  MoreVertical,
  Package,
  LayoutList,
  LayoutGrid,
  ChevronDown,
  Save,
  Loader2,
} from "lucide-vue-next";
import { cn } from "~/lib/utils";
import type { Service } from "~/composables/useServices";

definePageMeta({
  layout: "dashboard",
});

const { services: servicesList, isLoading, fetchServices, createService } = useServices();

// Fetch services on mount
onMounted(async () => {
  await fetchServices();
});

// Search and filter state
const searchQuery = ref("");
const selectedStatus = ref<string>("all");
const selectedUnit = ref<string>("all");

// Format currency
function formatPrice(price: number | null | undefined): string {
  if (!price) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

// Parse price input
function parsePrice(value: string): number {
  const cleaned = value.replace(/[^\d]/g, "");
  return parseInt(cleaned) || 0;
}

// Transform API services to view format with filtering
const services = computed(() => {
  let filtered = servicesList.value.map((s: Service) => ({
    id: s.id,
    name: s.name,
    code: s.code,
    price: formatPrice(s.customerPrice),
    rawPrice: s.customerPrice || 0,
    unit: s.unit?.name || "-",
    unitId: s.unit?.id || "",
    selected: false,
    status: s.isActive ? "Active" : "Inactive",
  }));

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (s) => s.name.toLowerCase().includes(query) || s.code.toLowerCase().includes(query),
    );
  }

  // Apply status filter
  if (selectedStatus.value !== "all") {
    filtered = filtered.filter(
      (s) => s.status.toLowerCase() === selectedStatus.value.toLowerCase(),
    );
  }

  // Apply unit filter
  if (selectedUnit.value !== "all") {
    filtered = filtered.filter((s) => s.unit === selectedUnit.value);
  }

  return filtered;
});

// Sorting state
const sortField = ref<string>("name");
const sortDirection = ref<"asc" | "desc">("asc");

const sortedServices = computed(() => {
  const sorted = [...services.value];
  sorted.sort((a, b) => {
    let comparison = 0;
    switch (sortField.value) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "code":
        comparison = a.code.localeCompare(b.code);
        break;
      case "price":
        comparison = a.rawPrice - b.rawPrice;
        break;
      case "status":
        comparison = a.status.localeCompare(b.status);
        break;
      default:
        comparison = a.name.localeCompare(b.name);
    }
    return sortDirection.value === "asc" ? comparison : -comparison;
  });
  return sorted;
});

const toggleSort = (field: string) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortDirection.value = "asc";
  }
};

type ViewMode = "list" | "grid";
const viewMode = ref<ViewMode>("list");
const isCreateOpen = ref(false);
const isSubmitting = ref(false);
const formError = ref<string | null>(null);

// Form state
const formData = ref({
  name: "",
  code: "",
  price: "",
  status: "Active",
  unit: "Per Container",
});

const resetForm = () => {
  formData.value = {
    name: "",
    code: "",
    price: "",
    status: "Active",
    unit: "Per Container",
  };
  formError.value = null;
};

const handleCreateService = async () => {
  // Validation
  if (!formData.value.name || !formData.value.code) {
    formError.value = "Please fill in all required fields (Name, Code)";
    return;
  }

  isSubmitting.value = true;
  formError.value = null;

  const serviceData = {
    name: formData.value.name,
    code: formData.value.code,
    customerPrice: parsePrice(formData.value.price),
    isActive: formData.value.status === "Active",
    // Note: unitId should come from a proper unit selection
    // For now we'll use the name as-is
  };

  const result = await createService(serviceData);

  if (result.success) {
    // Close modal and reset form
    isCreateOpen.value = false;
    resetForm();

    // Refresh service list
    await fetchServices();
  } else {
    formError.value = result.error || "Failed to create service";
  }

  isSubmitting.value = false;
};

const selectAll = computed({
  get: () => services.value.length > 0 && services.value.every((s) => s.selected),
  set: (val) => services.value.forEach((s) => (s.selected = val)),
});

// Pagination
const currentPage = ref(1);
const pagination = ref({
  total: 0,
  limit: 10,
  page: 1,
});

const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchServices();
};
</script>

<template>
  <div class="space-y-6 animate-fade-in pb-10">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Services</h1>

      <div class="flex items-center gap-2">
        <div class="flex items-center bg-white border border-border rounded-lg p-1 mr-2">
          <button
            @click="viewMode = 'list'"
            :class="
              cn(
                'p-1.5 rounded transition-colors',
                viewMode === 'list'
                  ? 'bg-[#012D5A] text-white'
                  : 'text-muted-foreground hover:bg-muted',
              )
            "
          >
            <LayoutList class="w-4 h-4" />
          </button>
          <button
            @click="viewMode = 'grid'"
            :class="
              cn(
                'p-1.5 rounded transition-colors',
                viewMode === 'grid'
                  ? 'bg-[#012D5A] text-white'
                  : 'text-muted-foreground hover:bg-muted',
              )
            "
          >
            <LayoutGrid class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex items-center justify-between gap-4">
      <div class="relative w-full max-w-sm">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search Service..."
          class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
        />
      </div>

      <div class="flex items-center gap-3">
        <div class="relative">
          <select
            v-model="selectedStatus"
            class="flex items-center justify-between gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors min-w-[140px] text-foreground appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <ChevronDown
            class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
          />
        </div>
        <button
          @click="
            isCreateOpen = true;
            resetForm();
          "
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap"
        >
          <Plus class="w-4 h-4" />
          <span>New Service</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <Loader2 class="w-8 h-8 animate-spin text-[#012D5A]" />
    </div>

    <!-- List View -->
    <div
      v-else-if="viewMode === 'list'"
      class="border border-border rounded-xl bg-white overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border bg-white text-left">
              <th class="py-3 px-4 w-10">
                <UiCheckbox v-model="selectAll" />
              </th>
              <th
                class="py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"
                @click="toggleSort('code')"
              >
                <div class="flex items-center gap-1">
                  Code
                  <ChevronDown
                    v-if="sortField === 'code'"
                    class="w-4 h-4"
                    :class="{ 'rotate-180': sortDirection === 'desc' }"
                  />
                </div>
              </th>
              <th
                class="py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"
                @click="toggleSort('name')"
              >
                <div class="flex items-center gap-1">
                  Service Name
                  <ChevronDown
                    v-if="sortField === 'name'"
                    class="w-4 h-4"
                    :class="{ 'rotate-180': sortDirection === 'desc' }"
                  />
                </div>
              </th>
              <th
                class="py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"
                @click="toggleSort('price')"
              >
                <div class="flex items-center gap-1">
                  Price
                  <ChevronDown
                    v-if="sortField === 'price'"
                    class="w-4 h-4"
                    :class="{ 'rotate-180': sortDirection === 'desc' }"
                  />
                </div>
              </th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">Unit</th>
              <th
                class="py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"
                @click="toggleSort('status')"
              >
                <div class="flex items-center gap-1">
                  Status
                  <ChevronDown
                    v-if="sortField === 'status'"
                    class="w-4 h-4"
                    :class="{ 'rotate-180': sortDirection === 'desc' }"
                  />
                </div>
              </th>
              <th class="py-3 px-4 w-10"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="service in sortedServices"
              :key="service.id"
              class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
              @click="navigateTo(`/master/services/${service.id}`)"
            >
              <td class="py-3 px-4" @click.stop>
                <UiCheckbox v-model="service.selected" />
              </td>
              <td class="py-3 px-4 text-sm font-medium">{{ service.code }}</td>
              <td class="py-3 px-4 text-sm font-medium">{{ service.name }}</td>
              <td class="py-3 px-4 text-sm font-medium">{{ service.price }}</td>
              <td class="py-3 px-4 text-sm text-muted-foreground">
                {{ service.unit }}
              </td>
              <td class="py-3 px-4">
                <span
                  :class="
                    cn(
                      'px-2 py-0.5 rounded border text-xs font-medium bg-white',
                      service.status === 'Active'
                        ? 'text-blue-500 border-blue-200'
                        : 'text-red-500 border-red-200',
                    )
                  "
                >
                  {{ service.status }}
                </span>
              </td>
              <td class="py-3 px-4 text-right">
                <button class="text-muted-foreground hover:text-foreground">
                  <MoreVertical class="w-4 h-4" />
                </button>
              </td>
            </tr>
            <tr v-if="sortedServices.length === 0">
              <td colspan="7" class="py-8 text-center text-muted-foreground">No services found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Grid View -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="service in sortedServices"
        :key="service.id"
        class="border border-border rounded-xl bg-white p-5 hover:shadow-sm transition-shadow cursor-pointer"
        @click="navigateTo(`/master/services/${service.id}`)"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
              <Package class="w-6 h-6 text-[#012D5A]" />
            </div>
            <div>
              <h3 class="font-bold text-base text-foreground">{{ service.name }}</h3>
              <p class="text-xs text-muted-foreground">{{ service.code }}</p>
            </div>
          </div>
          <button class="text-muted-foreground hover:text-foreground" @click.stop>
            <MoreVertical class="w-4 h-4" />
          </button>
        </div>

        <div class="space-y-1 mb-6">
          <div class="flex items-baseline gap-1">
            <span class="text-lg font-bold text-foreground">{{ service.price }}</span>
          </div>
          <p class="text-xs text-muted-foreground">{{ service.unit }}</p>
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-border">
          <span
            :class="
              cn(
                'px-2 py-0.5 rounded border text-xs font-medium bg-white',
                service.status === 'Active'
                  ? 'text-blue-500 border-blue-200'
                  : 'text-red-500 border-red-200',
              )
            "
          >
            {{ service.status }}
          </span>
        </div>
      </div>
      <div
        v-if="sortedServices.length === 0"
        class="col-span-3 py-8 text-center text-muted-foreground"
      >
        No services found
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between text-sm text-muted-foreground">
      <p>{{ sortedServices.length }} data found.</p>
      <UiPagination
        v-model:page="currentPage"
        :total="pagination.total"
        :items-per-page="pagination.limit"
        @update:page="handlePageChange"
      />
    </div>

    <!-- Create Modal -->
    <UiModal
      v-model="isCreateOpen"
      title="Add new Service"
      description="Register your new Service"
      width="max-w-xl"
    >
      <form class="space-y-4" @submit.prevent="handleCreateService">
        <!-- Error Message -->
        <div v-if="formError" class="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ formError }}</p>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium text-foreground"
            >Service Name <span class="text-red-500">*</span></label
          >
          <input
            v-model="formData.name"
            type="text"
            placeholder="e.g. Ocean Freight"
            class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-foreground"
              >Code <span class="text-red-500">*</span></label
            >
            <input
              v-model="formData.code"
              type="text"
              placeholder="SVC-XXX"
              class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-foreground">Status</label>
            <div class="relative">
              <select
                v-model="formData.status"
                class="w-full px-3 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <ChevronDown
                class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
              />
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-foreground">Price</label>
            <input
              v-model="formData.price"
              type="text"
              placeholder="Rp 0"
              class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-foreground">Unit</label>
            <div class="relative">
              <select
                v-model="formData.unit"
                class="w-full px-3 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
              >
                <option>Per Container</option>
                <option>Per CBM</option>
                <option>Per Trip</option>
              </select>
              <ChevronDown
                class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
              />
            </div>
          </div>
        </div>
      </form>

      <template #footer>
        <button
          type="button"
          @click="isCreateOpen = false"
          class="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg text-foreground hover:bg-gray-50 transition-colors"
          :disabled="isSubmitting"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="handleCreateService"
          :disabled="isSubmitting"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white rounded-lg hover:bg-[#012D5A]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
          <Save v-else class="w-4 h-4" />
          {{ isSubmitting ? "Saving..." : "Save" }}
        </button>
      </template>
    </UiModal>
  </div>
</template>
