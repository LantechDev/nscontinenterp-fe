<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { ChevronRight } from "lucide-vue-next";
import type { MappedCompany, CompanyDetails, CompanyActivityLog } from "~/composables/useCompanies";
import type { Address } from "~/composables/useMasterData";
import CompanySidebar from "./CompanySidebar.vue";
import CompanyMainContent from "./CompanyMainContent.vue";
import CompanyAddressForm from "./CompanyAddressForm.vue";
import { useCompanyAddressForm } from "./useCompanyAddressForm";

const props = defineProps<{ modelValue: boolean; company: MappedCompany | null }>();
const emit = defineEmits<{ (e: "update:modelValue", value: boolean): void }>();

const { getCompanyDetails } = useCompanies();

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const activeTab = ref("Activity");
const tabList = ["Activity", "Job", "Invoice", "Address", "Notes"];

// Company details state
const companyDetails = ref<CompanyDetails | null>(null);
const isLoading = ref(false);

// Use the address form composable
const {
  activeAddressMenu,
  showAddressMenu,
  closeAddressMenu,
  addressMode,
  editingAddress,
  openAddAddressMode,
  openEditAddressMode,
  closeAddressMode,
  handleAddressSave,
  handleDeleteAddress,
  companyAddresses,
} = useCompanyAddressForm(
  companyDetails as unknown as { value: { id: string; addresses: Address[] } | null },
);

// Fetch company details when modal opens
watch(
  () => props.modelValue,
  async (val) => {
    if (val && props.company?.id) {
      activeTab.value = "Activity";
      isLoading.value = true;
      const { success, data } = await getCompanyDetails(props.company.id);
      if (success && data) {
        companyDetails.value = data;
      }
      isLoading.value = false;
    }
  },
);

// Reset state when modal closes
watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      closeAddressMode();
      closeAddressMenu();
      companyDetails.value = null;
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
        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center h-full">
          <div class="flex flex-col items-center gap-3">
            <div
              class="h-10 w-10 animate-spin rounded-full border-4 border-[#012D5A] border-t-transparent"
            ></div>
            <p class="text-sm text-gray-500">Loading company details...</p>
          </div>
        </div>

        <div
          v-else-if="companyDetails"
          class="w-full h-full bg-white flex flex-col overflow-hidden"
        >
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
                  {{ companyDetails.name }}
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
            <!-- Sidebar / Left Panel -->
            <CompanySidebar
              v-if="addressMode === 'view'"
              :company="companyDetails"
              :addresses="companyAddresses"
              :active-address-menu="activeAddressMenu"
              @new-job="navigateToNewJob"
              @add-address="openAddAddressMode"
              @edit-address="openEditAddressMode"
              @toggle-menu="showAddressMenu"
              @close-menu="closeAddressMenu"
              @delete-address="handleDeleteAddress"
            />

            <!-- Address Edit/Add Form -->
            <CompanyAddressForm
              v-if="addressMode !== 'view'"
              :mode="addressMode"
              :company-id="companyDetails.id"
              :address="editingAddress"
              @cancel="closeAddressMode"
              @save="handleAddressSave"
            />

            <!-- Main Content Area -->
            <CompanyMainContent
              v-if="addressMode === 'view'"
              :company="companyDetails"
              :active-tab="activeTab"
              :tab-list="tabList"
              :active-address-menu="activeAddressMenu"
              @update:active-tab="activeTab = $event"
              @add-address="openAddAddressMode"
              @edit-address="openEditAddressMode"
              @toggle-menu="showAddressMenu"
              @delete-address="handleDeleteAddress"
            />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
