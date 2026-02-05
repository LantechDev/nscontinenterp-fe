<script setup lang="ts">
import {
  Plus,
  Search,
  MoreVertical,
  Building2,
  Mail,
  Phone,
  LayoutList,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Save,
  Loader2,
} from "lucide-vue-next";
import { cn } from "~/lib/utils";

definePageMeta({
  layout: "dashboard",
});

const { vendors: vendorsList, isLoading, fetchVendors, createVendor } = useVendors();

// Fetch vendors on mount
onMounted(async () => {
  await fetchVendors();
});

// Search and filter state
const searchQuery = ref("");
const selectedType = ref<string>("all");
const selectedStatus = ref<string>("all");

// Transform API vendors to view format with filtering
const vendors = computed(() => {
  let filtered = vendorsList.value.map((v) => ({
    id: v.id,
    name: v.name,
    code: `VND-${v.id.slice(0, 6).toUpperCase()}`,
    email: v.email || "-",
    phone: v.phone || "-",
    type: v.addresses?.[0]?.label || "Vendor",
    status: v.isActive ? "Active" : "Inactive",
    selected: false,
  }));

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (v) =>
        v.name.toLowerCase().includes(query) ||
        v.code.toLowerCase().includes(query) ||
        v.email.toLowerCase().includes(query),
    );
  }

  // Apply type filter
  if (selectedType.value !== "all") {
    filtered = filtered.filter((v) => v.type.toLowerCase() === selectedType.value.toLowerCase());
  }

  // Apply status filter
  if (selectedStatus.value !== "all") {
    filtered = filtered.filter(
      (v) => v.status.toLowerCase() === selectedStatus.value.toLowerCase(),
    );
  }

  return filtered;
});

// Sorting state
const sortField = ref<string>("name");
const sortDirection = ref<"asc" | "desc">("asc");

const sortedVendors = computed(() => {
  const sorted = [...vendors.value];
  sorted.sort((a, b) => {
    let comparison = 0;
    switch (sortField.value) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "code":
        comparison = a.code.localeCompare(b.code);
        break;
      case "type":
        comparison = a.type.localeCompare(b.type);
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
  email: "",
  phone: "",
  countryCode: "ID",
  type: "",
  status: "active",
  country: "",
  city: "",
  fullAddress: "",
  postalCode: "",
  state: "",
  eoriNo: "",
});

const resetForm = () => {
  formData.value = {
    name: "",
    email: "",
    phone: "",
    countryCode: "ID",
    type: "",
    status: "active",
    country: "",
    city: "",
    fullAddress: "",
    postalCode: "",
    state: "",
    eoriNo: "",
  };
  formError.value = null;
};

const handleCreateVendor = async () => {
  // Validation
  if (!formData.value.name || !formData.value.email || !formData.value.phone) {
    formError.value = "Please fill in all required fields (Name, Email, Phone)";
    return;
  }

  isSubmitting.value = true;
  formError.value = null;

  const vendorData = {
    name: formData.value.name,
    email: formData.value.email,
    phone: formData.value.phone,
    address: {
      fullAddress: formData.value.fullAddress,
      country: formData.value.country,
      city: formData.value.city,
      state: formData.value.state,
      postalCode: formData.value.postalCode,
      eori: formData.value.eoriNo,
    },
  };

  const result = await createVendor(vendorData);

  if (result.success) {
    // Close modal and reset form
    isCreateOpen.value = false;
    resetForm();

    // Refresh vendor list
    await fetchVendors();
  } else {
    formError.value = result.error || "Failed to create vendor";
  }

  isSubmitting.value = false;
};

const selectAll = computed({
  get: () => vendors.value.length > 0 && vendors.value.every((v) => v.selected),
  set: (val) => vendors.value.forEach((v) => (v.selected = val)),
});
</script>

<template>
  <div class="space-y-6 animate-fade-in pb-10">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Vendor</h1>

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
          placeholder="Search Vendor..."
          class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
        />
      </div>

      <div class="flex items-center gap-3">
        <div class="relative">
          <select
            v-model="selectedType"
            class="flex items-center justify-between gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors min-w-[140px] text-foreground appearance-none cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="shipping">Shipping Line</option>
            <option value="trucking">Trucking</option>
            <option value="customs">Customs</option>
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
          <span>New Vendor</span>
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
                  No. Vendor
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
                  Vendor
                  <ChevronDown
                    v-if="sortField === 'name'"
                    class="w-4 h-4"
                    :class="{ 'rotate-180': sortDirection === 'desc' }"
                  />
                </div>
              </th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">Email</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">Phone</th>
              <th
                class="py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"
                @click="toggleSort('type')"
              >
                <div class="flex items-center gap-1">
                  Type
                  <ChevronDown
                    v-if="sortField === 'type'"
                    class="w-4 h-4"
                    :class="{ 'rotate-180': sortDirection === 'desc' }"
                  />
                </div>
              </th>
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
              v-for="vendor in sortedVendors"
              :key="vendor.id"
              class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
              @click="navigateTo(`/master/vendor/${vendor.id}`)"
            >
              <td class="py-3 px-4" @click.stop>
                <UiCheckbox v-model="vendor.selected" />
              </td>
              <td class="py-3 px-4 text-sm font-medium">{{ vendor.code }}</td>
              <td class="py-3 px-4 text-sm font-medium">{{ vendor.name }}</td>
              <td class="py-3 px-4 text-sm font-normal">{{ vendor.email }}</td>
              <td class="py-3 px-4 text-sm font-normal">{{ vendor.phone }}</td>
              <td class="py-3 px-4">
                <span class="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-medium">
                  {{ vendor.type }}
                </span>
              </td>
              <td class="py-3 px-4">
                <span
                  :class="
                    cn(
                      'px-2 py-0.5 rounded border text-xs font-medium bg-white',
                      vendor.status === 'Active'
                        ? 'text-blue-500 border-blue-200'
                        : 'text-red-500 border-red-200',
                    )
                  "
                >
                  {{ vendor.status }}
                </span>
              </td>
              <td class="py-3 px-4 text-right">
                <button class="text-muted-foreground hover:text-foreground">
                  <MoreVertical class="w-4 h-4" />
                </button>
              </td>
            </tr>
            <tr v-if="sortedVendors.length === 0">
              <td colspan="8" class="py-8 text-center text-muted-foreground">No vendors found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Grid View -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      <div
        v-for="vendor in sortedVendors"
        :key="vendor.id"
        class="border border-border rounded-xl bg-white p-5 hover:shadow-sm transition-shadow cursor-pointer"
        @click="navigateTo(`/master/vendor/${vendor.id}`)"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
              <Building2 class="w-6 h-6 text-[#012D5A]" />
            </div>
            <div>
              <h3 class="font-bold text-base text-foreground">{{ vendor.name }}</h3>
              <p class="text-xs text-muted-foreground">{{ vendor.code }}</p>
            </div>
          </div>
          <button class="text-muted-foreground hover:text-foreground" @click.stop>
            <MoreVertical class="w-4 h-4" />
          </button>
        </div>

        <div class="space-y-2 mb-6">
          <div class="flex items-center gap-3 text-sm text-gray-600">
            <Mail class="w-4 h-4" />
            <span>{{ vendor.email }}</span>
          </div>
          <div class="flex items-center gap-3 text-sm text-gray-600">
            <Phone class="w-4 h-4" />
            <span>{{ vendor.phone }}</span>
          </div>
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-border">
          <span class="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-medium">{{
            vendor.type
          }}</span>
          <span
            :class="
              cn(
                'px-2 py-0.5 rounded border text-xs font-medium bg-white',
                vendor.status === 'Active'
                  ? 'text-blue-500 border-blue-200'
                  : 'text-red-500 border-red-200',
              )
            "
          >
            {{ vendor.status }}
          </span>
        </div>
      </div>
      <div
        v-if="sortedVendors.length === 0"
        class="col-span-2 py-8 text-center text-muted-foreground"
      >
        No vendors found
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between text-sm text-muted-foreground">
      <p>{{ sortedVendors.length }} data found.</p>
      <div class="flex items-center gap-2">
        <button class="p-1 hover:text-foreground disabled:opacity-50">
          <ChevronLeft class="w-4 h-4" />
          <span class="sr-only">Previous</span>
        </button>
        <button
          class="w-8 h-8 flex items-center justify-center rounded border border-border bg-white text-foreground font-medium"
        >
          1
        </button>
        <button
          class="w-8 h-8 flex items-center justify-center rounded hover:bg-muted text-muted-foreground"
        >
          2
        </button>
        <button
          class="w-8 h-8 flex items-center justify-center rounded hover:bg-muted text-muted-foreground"
        >
          3
        </button>
        <span class="px-1">...</span>
        <button class="flex items-center gap-1 hover:text-foreground">
          Next
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Create Modal -->
    <UiModal
      v-model="isCreateOpen"
      title="Add new Vendor"
      description="Register your new Vendor"
      width="max-w-4xl"
    >
      <form class="space-y-6" @submit.prevent="handleCreateVendor">
        <!-- Error Message -->
        <div v-if="formError" class="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ formError }}</p>
        </div>

        <!-- Vendor Detail -->
        <div>
          <h3 class="text-base font-bold text-foreground mb-4">Vendor Detail</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-foreground"
                >Name <span class="text-red-500">*</span></label
              >
              <input
                v-model="formData.name"
                type="text"
                placeholder="Input name"
                class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-foreground"
                >Email <span class="text-red-500">*</span></label
              >
              <input
                v-model="formData.email"
                type="email"
                placeholder="Input email"
                class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-foreground"
                >Phone number <span class="text-red-500">*</span></label
              >
              <div class="flex gap-2">
                <select
                  v-model="formData.countryCode"
                  class="w-24 px-2 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="ID">ID</option>
                  <option value="US">US</option>
                  <option value="SG">SG</option>
                  <option value="MY">MY</option>
                </select>
                <input
                  v-model="formData.phone"
                  type="tel"
                  placeholder="+62 812-3456-7890"
                  class="flex-1 px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-foreground">Type</label>
              <div class="relative">
                <select
                  v-model="formData.type"
                  class="w-full px-3 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                >
                  <option value="">Select Type</option>
                  <option value="shipping">Shipping Line</option>
                  <option value="trucking">Trucking</option>
                  <option value="customs">Customs</option>
                </select>
                <ChevronDown
                  class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
                />
              </div>
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-foreground">Status</label>
              <div class="relative">
                <select
                  v-model="formData.status"
                  class="w-full px-3 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <ChevronDown
                  class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="border-t border-border"></div>

        <!-- Address -->
        <div>
          <h3 class="text-base font-bold text-foreground mb-4">Address</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-foreground">Country</label>
              <input
                v-model="formData.country"
                type="text"
                placeholder="Input country"
                class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-foreground">City</label>
              <input
                v-model="formData.city"
                type="text"
                placeholder="Input city"
                class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div class="space-y-1.5 md:col-span-2">
              <label class="text-sm font-medium text-foreground">Full Address</label>
              <textarea
                v-model="formData.fullAddress"
                placeholder="Enter full address"
                rows="3"
                class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              ></textarea>
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-foreground">Postal/ Zip code</label>
              <input
                v-model="formData.postalCode"
                type="text"
                placeholder="Input postal code"
                class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-foreground">State</label>
              <input
                v-model="formData.state"
                type="text"
                placeholder="Input state"
                class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-foreground">EORI No.</label>
              <input
                v-model="formData.eoriNo"
                type="text"
                placeholder="Input EORI number"
                class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
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
          @click="handleCreateVendor"
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
