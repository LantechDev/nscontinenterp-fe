<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { ChevronRight, X } from "lucide-vue-next";
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
    <Transition name="slide-over">
      <div v-if="isOpen" class="fixed inset-0 z-[1050] flex justify-end">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 transition-opacity" @click="isOpen = false"></div>

        <!-- Slideover Content -->
        <div
          class="slide-panel relative w-full bg-white h-full shadow-2xl flex flex-col overflow-hidden z-10 transition-all duration-300"
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
              class="px-6 pt-5 pb-4 border-b border-border flex items-center justify-between shrink-0 bg-white z-20"
            >
              <div class="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                Master Data <span class="mx-1">›</span> Company <span class="mx-1">›</span>
                <span class="text-foreground">{{ companyDetails.name }}</span>
                <template v-if="addressMode !== 'view'">
                  <span class="mx-1">›</span> Address <span class="mx-1">›</span>
                  <span class="text-foreground">{{ addressMode === "add" ? "Add" : "Edit" }}</span>
                </template>
              </div>
              <div class="flex items-center gap-2">
                <button
                  @click="isOpen = false"
                  class="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X class="w-5 h-5" />
                </button>
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
    </Transition>
  </Teleport>
</template>

<style scoped>
.slide-over-enter-active {
  transition: opacity 0.4s ease;
}
.slide-over-leave-active {
  transition: opacity 0.3s ease;
}

.slide-over-enter-from,
.slide-over-leave-to {
  opacity: 0;
}

.slide-panel {
  will-change: transform;
}

.slide-over-enter-active .slide-panel {
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-over-leave-active .slide-panel {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-over-enter-from .slide-panel,
.slide-over-leave-to .slide-panel {
  transform: translateX(100%);
}
</style>
