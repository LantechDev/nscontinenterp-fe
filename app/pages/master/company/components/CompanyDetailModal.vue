<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import {
  Plus,
  Mail,
  Phone,
  MoreVertical,
  Building2,
  MapPinPlus,
  ChevronRight,
  Pencil,
  Trash2,
} from "lucide-vue-next";
import type { MappedCompany } from "~/composables/useCompanies";
import type { Address } from "~/composables/useMasterData";

const props = defineProps<{ modelValue: boolean; company: MappedCompany | null }>();
const emit = defineEmits<{ (e: "update:modelValue", value: boolean): void }>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
const activeTab = ref("Job");
const tabList = ["Activity", "Job", "Invoice", "Address", "Notes"];
watch(
  () => props.modelValue,
  (val) => {
    if (val) activeTab.value = "Activity";
  },
);

// Format date helper
const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return (
    date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB"
  );
};

// Get company addresses - use real data from database
const companyAddresses = computed<Address[]>(() => {
  return props.company?.addresses || [];
});

// Address popup menu state
const activeAddressMenu = ref<string | null>(null);
const showAddressMenu = (addressId: string) => {
  activeAddressMenu.value = activeAddressMenu.value === addressId ? null : addressId;
};
const closeAddressMenu = () => {
  activeAddressMenu.value = null;
};

// Address edit/add mode state
const addressMode = ref<"view" | "edit" | "add">("view");
const editingAddressId = ref<string | null>(null);

const openAddAddressMode = () => {
  addressMode.value = "add";
  editingAddressId.value = null;
  closeAddressMenu();
};

const openEditAddressMode = (addressId: string) => {
  addressMode.value = "edit";
  editingAddressId.value = addressId;
  closeAddressMenu();
};

const closeAddressMode = () => {
  addressMode.value = "view";
  editingAddressId.value = null;
};

// Reset state when modal closes
watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      closeAddressMode();
      closeAddressMenu();
    }
  },
);

const navigateToNewJob = () => {
  isOpen.value = false;
  navigateTo("/operational/jobs/create");
};

// Click outside to close menu
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".address-menu-container")) {
    closeAddressMenu();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-end p-4 sm:p-8">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/50 transition-opacity" @click="isOpen = false"></div>

      <!-- Slideover Content -->
      <div
        class="relative w-full h-full bg-white rounded-xl border border-slate-200 shadow-2xl flex flex-col animate-in fade-in slide-in-from-right-8 overflow-hidden z-10 ms-auto transition-all duration-300"
        :style="addressMode !== 'view' ? 'max-width: 600px;' : 'max-width: calc(100vw - 320px);'"
      >
        <div v-if="company" class="w-full h-full bg-white flex flex-col overflow-hidden">
          <!-- Header -->
          <div
            class="self-stretch p-4 border-b border-slate-200 inline-flex justify-between items-center bg-white z-10 shrink-0"
          >
            <div class="flex justify-start items-center gap-1.5">
              <div class="flex justify-center items-center gap-2.5">
                <div class="text-black text-xs font-normal font-['Inter'] leading-4">
                  Master Data
                </div>
              </div>
              <ChevronRight class="w-3 h-3 text-slate-600" />
              <div class="flex justify-center items-center gap-2.5">
                <div class="text-black text-xs font-normal font-['Inter'] leading-4">Company</div>
              </div>
              <ChevronRight class="w-3 h-3 text-slate-600" />
              <div class="flex justify-center items-center gap-2.5">
                <div class="text-black text-xs font-semibold font-['Inter'] leading-4">
                  {{ company.name }}
                </div>
              </div>
              <template v-if="addressMode !== 'view'">
                <ChevronRight class="w-3 h-3 text-slate-600" />
                <div class="flex justify-center items-center gap-2.5">
                  <div class="text-black text-xs font-normal font-['Inter'] leading-4">Address</div>
                </div>
                <ChevronRight class="w-3 h-3 text-slate-600" />
                <div class="flex justify-center items-center gap-2.5">
                  <div class="text-black text-xs font-semibold font-['Inter'] leading-4">
                    {{ addressMode === "add" ? "Add" : "Edit" }}
                  </div>
                </div>
              </template>
            </div>
            <div
              class="inline-flex justify-center items-center gap-2.5 cursor-pointer hover:opacity-75"
              @click="isOpen = false"
            >
              <div class="text-black text-xs font-semibold font-['Inter'] leading-4">Close</div>
            </div>
          </div>

          <!-- Body -->
          <div class="self-stretch flex-1 flex justify-start items-stretch overflow-hidden">
            <!-- Sidebar / Left Panel - Hidden in edit/add address mode -->
            <div
              v-if="addressMode === 'view'"
              class="w-80 shrink-0 self-stretch p-4 border-r border-slate-200 flex flex-col justify-between items-start overflow-y-auto"
            >
              <div class="self-stretch flex flex-col justify-start items-start gap-4">
                <!-- Title & Code -->
                <div class="self-stretch inline-flex justify-start items-start">
                  <div class="inline-flex flex-col justify-start items-start">
                    <div class="text-black text-base font-semibold font-['Inter'] leading-6">
                      {{ company.name }}
                    </div>
                    <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-4">
                      {{ company.code }}
                    </div>
                  </div>
                </div>
                <!-- Button -->
                <div class="self-stretch hidden justify-center items-center gap-4">
                  <div
                    class="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 rounded-md flex justify-center items-center gap-1.5 overflow-hidden cursor-pointer transition-colors"
                  >
                    <Plus class="w-3.5 h-3.5 text-white" />
                    <div class="text-white text-sm font-medium font-['Inter'] leading-5">
                      New Job
                    </div>
                  </div>
                </div>
                <div class="self-stretch inline-flex justify-center items-center gap-4">
                  <div
                    class="flex-1 px-4 py-2 bg-primary rounded-md flex justify-center items-center gap-1.5 cursor-pointer hover:bg-primary/90 transition-colors"
                    @click="navigateToNewJob"
                  >
                    <Plus class="w-3.5 h-3.5 text-white" />
                    <div class="text-white text-sm font-medium font-['Inter'] leading-5">
                      New Job
                    </div>
                  </div>
                </div>

                <!-- Description -->
                <div class="self-stretch flex flex-col justify-start items-start gap-4 mt-2">
                  <div class="self-stretch flex flex-col justify-start items-start gap-2">
                    <div class="text-black text-sm font-semibold font-['Inter'] leading-5">
                      Description
                    </div>
                    <div class="self-stretch h-px bg-slate-100"></div>
                  </div>
                  <div class="self-stretch text-black text-xs font-normal font-['Inter'] leading-4">
                    -
                  </div>
                </div>

                <!-- Contact Details -->
                <div class="self-stretch flex flex-col justify-start items-start gap-4 mt-2">
                  <div class="self-stretch flex flex-col justify-start items-start gap-2">
                    <div class="text-black text-sm font-semibold font-['Inter'] leading-5">
                      Contact Details
                    </div>
                    <div class="self-stretch h-px bg-slate-100"></div>
                  </div>
                  <div class="self-stretch flex flex-col justify-start items-start gap-4">
                    <div class="inline-flex justify-center items-center gap-2.5">
                      <div
                        class="p-2 bg-slate-100 rounded-full inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden"
                      >
                        <Mail class="w-3.5 h-3.5 text-[#012D5A]" />
                      </div>
                      <div class="inline-flex flex-col justify-center items-start">
                        <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-4">
                          Email Address
                        </div>
                        <div class="text-black text-xs font-semibold font-['Inter'] leading-4">
                          {{ company.email || "-" }}
                        </div>
                      </div>
                    </div>
                    <div class="inline-flex justify-center items-center gap-2.5">
                      <div
                        class="p-2 bg-slate-100 rounded-full inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden"
                      >
                        <Phone class="w-3.5 h-3.5 text-[#012D5A]" />
                      </div>
                      <div class="inline-flex flex-col justify-center items-start">
                        <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-4">
                          Phone
                        </div>
                        <div class="text-black text-xs font-semibold font-['Inter'] leading-4">
                          {{ company.phone || "-" }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Address -->
                <div class="self-stretch flex flex-col justify-start items-start gap-4 mt-2">
                  <div class="self-stretch flex flex-col justify-start items-start gap-2">
                    <div class="self-stretch inline-flex justify-between items-center">
                      <div class="text-black text-sm font-semibold font-['Inter'] leading-5">
                        Address
                      </div>
                      <div
                        class="flex justify-end items-center gap-2 px-4 py-2 cursor-pointer hover:opacity-80"
                        @click="openAddAddressMode"
                      >
                        <MapPinPlus class="w-4 h-4 text-primary" />
                        <div class="text-primary text-xs font-medium font-['Inter'] leading-4">
                          Add Address
                        </div>
                      </div>
                    </div>
                    <div class="self-stretch h-px bg-slate-100"></div>
                  </div>
                  <!-- Show addresses from database -->
                  <template v-if="companyAddresses.length > 0">
                    <div
                      v-for="addr in companyAddresses"
                      :key="addr.id"
                      class="self-stretch p-4 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col justify-center items-start gap-2 relative"
                    >
                      <div class="self-stretch inline-flex justify-between items-start">
                        <div class="flex-1 flex justify-start items-center gap-3">
                          <div class="flex-1 inline-flex flex-col justify-start items-start gap-1">
                            <div class="self-stretch inline-flex justify-between items-start">
                              <div
                                class="text-black text-sm font-semibold font-['Inter'] leading-5"
                              >
                                {{ addr.label }}
                              </div>
                              <div class="address-menu-container relative">
                                <MoreVertical
                                  class="w-4 h-4 text-slate-500 cursor-pointer"
                                  @click.stop="showAddressMenu(addr.id)"
                                />
                                <!-- Popup Menu -->
                                <div
                                  v-if="activeAddressMenu === addr.id"
                                  class="absolute right-0 top-6 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50 min-w-[120px]"
                                >
                                  <div
                                    class="px-3 py-2 hover:bg-slate-50 cursor-pointer flex items-center gap-2"
                                    @click="openEditAddressMode(addr.id)"
                                  >
                                    <Pencil class="w-3.5 h-3.5 text-slate-600" />
                                    <span class="text-xs text-slate-700">Edit</span>
                                  </div>
                                  <div
                                    class="px-3 py-2 hover:bg-red-50 cursor-pointer flex items-center gap-2"
                                  >
                                    <Trash2 class="w-3.5 h-3.5 text-red-500" />
                                    <span class="text-xs text-red-500">Delete</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div
                              class="self-stretch text-gray-500 text-xs font-normal font-['Inter'] leading-4"
                            >
                              {{ addr.fullAddress || "-" }}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        v-if="addr.isDefault"
                        class="px-2 py-0.5 bg-blue-50 rounded-md shadow-sm outline outline-1 outline-offset-[-1px] outline-blue-200 inline-flex justify-start items-center gap-1 mt-1"
                      >
                        <div
                          class="text-center text-blue-700 text-xs font-medium font-['Inter'] leading-4"
                        >
                          Main
                        </div>
                      </div>
                    </div>
                  </template>
                  <div
                    v-else
                    class="self-stretch text-gray-400 text-xs font-normal font-['Inter'] leading-4 py-4"
                  >
                    No address available
                  </div>
                </div>
              </div>
              <!-- Footer details -->
              <div class="self-stretch flex flex-col justify-start items-start gap-3 mt-6">
                <div class="inline-flex justify-center items-center gap-2.5">
                  <div class="inline-flex flex-col justify-center items-start">
                    <div class="text-gray-400 text-xs font-normal font-['Inter'] leading-4">
                      Created {{ formatDate(company.createdAt) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Address Edit/Add Form - Shows when in edit/add mode -->
            <div
              v-if="addressMode !== 'view'"
              class="flex-1 self-stretch flex flex-col overflow-hidden"
            >
              <!-- Form Content - Scrollable -->
              <div class="self-stretch flex-1 p-6 overflow-y-auto">
                <div class="self-stretch flex flex-col gap-6">
                  <!-- Form Title -->
                  <div class="text-black text-lg font-semibold font-['Inter'] leading-7">
                    {{ addressMode === "add" ? "Add New Address" : "Edit Address" }}
                  </div>

                  <!-- Form -->
                  <div class="self-stretch flex flex-col gap-4">
                    <!-- Address Label -->
                    <div class="flex flex-col gap-1.5">
                      <label class="text-sm font-medium text-slate-700">Address Label</label>
                      <input
                        type="text"
                        placeholder="e.g., Head Office, Branch, Warehouse"
                        class="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>

                    <!-- Address Type -->
                    <div class="flex flex-col gap-1.5">
                      <label class="text-sm font-medium text-slate-700">Type</label>
                      <select
                        class="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      >
                        <option value="main">Main</option>
                        <option value="branch">Branch</option>
                        <option value="warehouse">Warehouse</option>
                      </select>
                    </div>

                    <!-- Full Address -->
                    <div class="flex flex-col gap-1.5">
                      <label class="text-sm font-medium text-slate-700">Full Address</label>
                      <textarea
                        rows="3"
                        placeholder="Enter full address"
                        class="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                      ></textarea>
                    </div>

                    <!-- Street -->
                    <div class="flex flex-col gap-1.5">
                      <label class="text-sm font-medium text-slate-700">Street</label>
                      <input
                        type="text"
                        placeholder="Enter street name"
                        class="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>

                    <!-- City & State - Two Columns -->
                    <div class="grid grid-cols-2 gap-4">
                      <div class="flex flex-col gap-1.5">
                        <label class="text-sm font-medium text-slate-700">City</label>
                        <input
                          type="text"
                          placeholder="Enter city"
                          class="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                      <div class="flex flex-col gap-1.5">
                        <label class="text-sm font-medium text-slate-700">State</label>
                        <input
                          type="text"
                          placeholder="Enter state/province"
                          class="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                    </div>

                    <!-- Postal Code & Country - Two Columns -->
                    <div class="grid grid-cols-2 gap-4">
                      <div class="flex flex-col gap-1.5">
                        <label class="text-sm font-medium text-slate-700">Postal Code</label>
                        <input
                          type="text"
                          placeholder="Enter postal code"
                          class="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                      <div class="flex flex-col gap-1.5">
                        <label class="text-sm font-medium text-slate-700">Country</label>
                        <select
                          class="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        >
                          <option value="id">Indonesia</option>
                          <option value="sg">Singapore</option>
                          <option value="my">Malaysia</option>
                        </select>
                      </div>
                    </div>

                    <!-- EORI Number -->
                    <div class="flex flex-col gap-1.5">
                      <label class="text-sm font-medium text-slate-700">EORI Number</label>
                      <input
                        type="text"
                        placeholder="Enter EORI number"
                        class="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>

                    <!-- Tax ID -->
                    <div class="flex flex-col gap-1.5">
                      <label class="text-sm font-medium text-slate-700">Tax ID</label>
                      <input
                        type="text"
                        placeholder="Enter tax ID"
                        class="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Form Actions - Fixed at bottom with full-width border -->
              <div
                class="self-stretch border-t border-slate-300 flex justify-end gap-3 p-4 bg-white shrink-0"
              >
                <button
                  class="px-4 py-2 border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                  @click="closeAddressMode"
                >
                  Cancel
                </button>
                <button
                  class="px-4 py-2 bg-primary rounded-md text-sm text-white hover:bg-primary/90 transition-colors"
                >
                  {{ addressMode === "add" ? "Add Address" : "Save Changes" }}
                </button>
              </div>
            </div>

            <!-- Main Content Area - Hidden in edit/add address mode -->
            <div
              v-if="addressMode === 'view'"
              class="flex-1 self-stretch flex flex-col justify-center items-end gap-4 overflow-hidden"
            >
              <div
                class="self-stretch flex-1 flex flex-col justify-start items-start overflow-hidden"
              >
                <!-- Stats Widgets -->
                <div class="self-stretch p-4 flex justify-start items-center gap-4">
                  <div
                    class="flex-1 p-2 bg-slate-50 rounded-md shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] flex flex-col justify-center items-start"
                  >
                    <div
                      class="justify-start text-gray-500 text-xs font-normal font-['Inter'] leading-4"
                    >
                      Total Job
                    </div>
                    <div
                      class="text-center justify-start text-black text-base font-semibold font-['Inter'] leading-6"
                    >
                      {{ company.totalJobs || 0 }}
                    </div>
                  </div>
                  <div
                    class="flex-1 p-2 bg-slate-50 rounded-md shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] flex flex-col justify-center items-start"
                  >
                    <div
                      class="justify-start text-gray-500 text-xs font-normal font-['Inter'] leading-4"
                    >
                      Type
                    </div>
                    <div
                      class="text-center justify-start text-black text-base font-semibold font-['Inter'] leading-6"
                    >
                      {{ company.type }}
                    </div>
                  </div>
                  <div
                    class="flex-1 p-2 bg-slate-50 rounded-md shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] flex flex-col justify-center items-start"
                  >
                    <div
                      class="justify-start text-gray-500 text-xs font-normal font-['Inter'] leading-4"
                    >
                      Status
                    </div>
                    <div
                      class="text-center justify-start text-[#012D5A] text-base font-semibold font-['Inter'] leading-6"
                    >
                      {{ company.status }}
                    </div>
                  </div>
                </div>

                <!-- Tabs and Content Container -->
                <div
                  class="self-stretch flex flex-col justify-start items-start gap-4 flex-1 overflow-hidden"
                >
                  <div
                    class="self-stretch border-b border-black/5 flex justify-start items-start gap-2.5 overflow-hidden shrink-0"
                  >
                    <div
                      v-for="tab in tabList"
                      :key="tab"
                      @click="activeTab = tab"
                      :class="[
                        'px-4 py-3 border-b inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden cursor-pointer transition-colors',
                        activeTab === tab
                          ? 'border-[#012D5A]'
                          : 'border-transparent hover:border-gray-200',
                      ]"
                    >
                      <div
                        :class="[
                          'justify-start text-xs leading-4',
                          activeTab === tab
                            ? 'text-[#012D5A] font-semibold font-[\'Inter\']'
                            : 'text-black font-normal font-[\'Inter\']',
                        ]"
                      >
                        {{ tab }}
                      </div>
                    </div>
                  </div>

                  <!-- Tab Content -->
                  <div
                    class="self-stretch px-4 flex flex-col justify-start items-start gap-4 overflow-y-auto flex-1 pb-4"
                  >
                    <template v-if="activeTab === 'Activity'">
                      <!-- Latest Activity Section -->
                      <div
                        class="justify-start text-black text-sm font-semibold font-['Inter'] leading-5"
                      >
                        Latest Activity
                      </div>

                      <!-- Empty state for Activity -->
                      <div
                        class="w-full py-8 flex flex-col items-center justify-center text-gray-400"
                      >
                        <Building2 class="w-8 h-8 mb-2 text-gray-300" />
                        <p class="text-sm">No activity available yet.</p>
                      </div>
                    </template>

                    <template v-else-if="activeTab === 'Job'">
                      <div
                        class="justify-start text-black text-sm font-semibold font-['Inter'] leading-5"
                      >
                        Current Job
                      </div>

                      <!-- Empty state for Jobs -->
                      <div
                        class="w-full py-8 flex flex-col items-center justify-center text-gray-400"
                      >
                        <Building2 class="w-8 h-8 mb-2 text-gray-300" />
                        <p class="text-sm">No jobs available yet.</p>
                      </div>
                    </template>

                    <template v-else-if="activeTab === 'Address'">
                      <!-- Address Header with Add Button -->
                      <div class="self-stretch flex justify-between items-center">
                        <div class="text-black text-sm font-semibold font-['Inter'] leading-5">
                          Address
                        </div>
                        <div
                          class="bg-primary flex justify-end items-center gap-3 rounded-[6px] px-4 py-2 cursor-pointer hover:opacity-80"
                          @click="openAddAddressMode"
                        >
                          <MapPinPlus class="w-4 h-4 text-white" />
                          <div class="text-white text-xs font-medium font-['Inter'] leading-4">
                            Add Address
                          </div>
                        </div>
                      </div>

                      <!-- Show addresses from database -->
                      <template v-if="companyAddresses.length > 0">
                        <div
                          v-for="addr in companyAddresses"
                          :key="addr.id"
                          class="self-stretch p-4 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col justify-center items-start gap-2 hover:bg-slate-50 transition-colors relative"
                        >
                          <div class="self-stretch flex justify-between items-start">
                            <div class="flex-1 flex justify-start items-center gap-3">
                              <div class="flex-1 flex flex-col justify-start items-start gap-1">
                                <div class="self-stretch flex justify-between items-start">
                                  <div
                                    class="text-black text-sm font-semibold font-['Inter'] leading-5"
                                  >
                                    {{ addr.label }}
                                  </div>
                                  <div class="address-menu-container relative">
                                    <MoreVertical
                                      class="w-4 h-4 text-slate-500 cursor-pointer"
                                      @click.stop="showAddressMenu('tab-' + addr.id)"
                                    />
                                    <!-- Popup Menu -->
                                    <div
                                      v-if="activeAddressMenu === 'tab-' + addr.id"
                                      class="absolute right-0 top-6 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50 min-w-[120px]"
                                    >
                                      <div
                                        class="px-3 py-2 hover:bg-slate-50 cursor-pointer flex items-center gap-2"
                                        @click="openEditAddressMode('tab-' + addr.id)"
                                      >
                                        <Pencil class="w-3.5 h-3.5 text-slate-600" />
                                        <span class="text-xs text-slate-700">Edit</span>
                                      </div>
                                      <div
                                        class="px-3 py-2 hover:bg-red-50 cursor-pointer flex items-center gap-2"
                                      >
                                        <Trash2 class="w-3.5 h-3.5 text-red-500" />
                                        <span class="text-xs text-red-500">Delete</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  class="self-stretch text-gray-500 text-xs font-normal font-['Inter'] leading-4"
                                >
                                  {{ addr.fullAddress || "-" }}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            v-if="addr.isDefault"
                            class="px-2 py-0.5 bg-blue-50 rounded-md shadow-sm outline outline-1 outline-offset-[-1px] outline-blue-200 flex justify-start items-center gap-1 mt-1"
                          >
                            <div
                              class="text-center text-blue-700 text-xs font-medium font-['Inter'] leading-4"
                            >
                              Main
                            </div>
                          </div>
                        </div>
                      </template>
                      <div
                        v-else
                        class="w-full py-8 flex flex-col items-center justify-center text-gray-400"
                      >
                        <MapPinPlus class="w-8 h-8 mb-2 text-gray-300" />
                        <p class="text-sm">No address available yet.</p>
                      </div>
                    </template>

                    <template v-else>
                      <div
                        class="w-full py-12 flex flex-col items-center justify-center text-gray-400"
                      >
                        <p class="text-sm">
                          No data available for {{ activeTab.toLowerCase() }} yet.
                        </p>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
