<script setup lang="ts">
import {
  X,
  Box,
  CheckCircle2,
  PlusCircle,
  Filter,
  Loader2,
  Settings,
  Clock,
  Ship,
  Printer,
} from "lucide-vue-next";
import type { BillOfLading } from "~/composables/useJobs";

interface Props {
  modelValue: boolean;
  blId: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const { currentJob, getJob, isLoading } = useJobs();

const activeTab = ref("container");
const tabs = [
  { id: "overview", label: "Overview" },
  { id: "container", label: "Container" },
  { id: "history", label: "History" },
];

const bl = ref<BillOfLading | null>(null);
const loadingBl = ref(false);
const headers = useRequestHeaders(["cookie"]);
watch(
  () => props.modelValue,
  async (isOpen) => {
    if (isOpen && props.blId) {
      activeTab.value = "container";
      loadingBl.value = true;
      try {
        const response = await $fetch<{ data: BillOfLading }>(
          `/api/operational/bill-of-lading/${props.blId}`,
          {
            headers,
            credentials: "include",
          },
        );
        bl.value = response.data;
      } catch (error) {
        console.error("Failed to load BL details", error);
      } finally {
        loadingBl.value = false;
      }
    }
  },
);

const formatDate = (dateString?: string | null) => {
  if (!dateString) return "-";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  } catch (e) {
    return dateString;
  }
};

const getStatusName = computed(() => bl.value?.status?.name || "Draft");
const getContainerNumber = computed(() => bl.value?.containerNumber || "MSKU9081234");
const getSealNumber = computed(() => bl.value?.sealNumber || "ML-882211");
const getGrossWeight = computed(() => bl.value?.grossWeight || "18,500");

// Dummy history data for mockup demonstration
const auditTrail = [
  {
    id: 1,
    type: "status_changed",
    title: "Status Changed",
    desc: "Changed status from Draft to Issued.",
    user: "Admin",
    date: "Today 9:49 PM",
  },
  {
    id: 2,
    type: "created",
    title: "BL Created",
    desc: "Draft BL created from job.",
    user: "Admin",
    date: "Today 9:49 PM",
  },
];
</script>

<template>
  <div v-if="modelValue" class="fixed inset-0 top-16 z-[999] flex justify-end">
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-black/40 transition-opacity"
      @click="$emit('update:modelValue', false)"
    ></div>

    <!-- Drawer Panel -->
    <div
      class="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-slide-in-right"
    >
      <!-- Header -->
      <div class="px-6 pt-5 pb-4 border-b border-border flex items-center justify-between">
        <div class="flex items-center gap-2 text-sm text-muted-foreground font-medium">
          EBL <span class="mx-1">›</span>
          <span class="text-foreground">{{ bl?.blNumber || "..." }}</span>
        </div>
        <button
          @click="$emit('update:modelValue', false)"
          class="text-sm font-medium hover:bg-muted px-3 py-1.5 rounded-md transition-colors"
        >
          Close
        </button>
      </div>

      <div v-if="loadingBl" class="flex-1 flex items-center justify-center">
        <Loader2 class="w-8 h-8 animate-spin text-primary" />
      </div>

      <div v-else-if="bl" class="flex-1 overflow-y-auto flex flex-col">
        <!-- BL Summary Header -->
        <div class="px-8 py-6 pb-2">
          <h2 class="text-2xl font-bold text-foreground mb-1">{{ bl.blNumber }}</h2>
          <p class="text-sm text-muted-foreground mb-6">JOB-2025-12023</p>

          <div class="grid grid-cols-[140px_1fr] gap-y-3 text-sm">
            <div class="flex items-center gap-2 text-muted-foreground">
              <Settings class="w-4 h-4" /> Status
            </div>
            <div>
              <span
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200"
              >
                {{ getStatusName }}
              </span>
            </div>

            <div class="flex items-center gap-2 text-muted-foreground">
              <Clock class="w-4 h-4" /> Created Time
            </div>
            <div class="font-medium">{{ formatDate(bl.createdAt) }}</div>

            <div class="flex items-center gap-2 text-muted-foreground">
              <Ship class="w-4 h-4" /> Service
            </div>
            <div class="font-medium">Port To Port</div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="px-8 mt-6 border-b border-border flex gap-6">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="pb-3 text-sm font-medium transition-colors relative"
            :class="
              activeTab === tab.id
                ? 'text-[#012D5A]'
                : 'text-muted-foreground hover:text-foreground'
            "
          >
            {{ tab.label }}
            <div
              v-if="activeTab === tab.id"
              class="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#012D5A] rounded-t-full"
            ></div>
          </button>
        </div>

        <!-- Tab Content -->
        <div class="p-8 flex-1">
          <!-- Container Tab -->
          <div v-if="activeTab === 'container'" class="space-y-4 animate-fade-in">
            <!-- Mock container card -->
            <!-- We will show 3 of these to match mockup -->
            <div
              v-for="i in 3"
              :key="i"
              class="border border-border rounded-xl p-5 shadow-sm bg-white"
            >
              <div class="flex items-start justify-between mb-6">
                <div class="flex gap-4 items-center">
                  <div
                    class="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0"
                  >
                    <Box class="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h3 class="font-bold text-base text-foreground">{{ getContainerNumber }}</h3>
                    <p class="text-sm text-muted-foreground">Seal: {{ getSealNumber }}</p>
                  </div>
                </div>
                <span class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium"
                  >40' HC</span
                >
              </div>

              <div class="grid grid-cols-3 divide-x divide-border">
                <div class="text-center">
                  <p class="text-xs text-muted-foreground mb-1">Packages</p>
                  <p class="font-bold text-sm">850 Ctns</p>
                </div>
                <div class="text-center">
                  <p class="text-xs text-muted-foreground mb-1">Gross Weight</p>
                  <p class="font-bold text-sm">{{ getGrossWeight }} KGS</p>
                </div>
                <div class="text-center">
                  <p class="text-xs text-muted-foreground mb-1">Measurement</p>
                  <p class="font-bold text-sm">65.5 CBM</p>
                </div>
              </div>
            </div>
          </div>

          <!-- History Tab -->
          <div v-else-if="activeTab === 'history'" class="animate-fade-in">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-sm text-muted-foreground font-medium">Audit Trail</h3>
              <button
                class="flex items-center gap-1.5 text-sm font-medium hover:text-primary transition-colors"
              >
                <Filter class="w-4 h-4" /> Filter
              </button>
            </div>

            <h4 class="font-bold mb-4">Latest Activity</h4>
            <div class="space-y-6">
              <!-- Audit Item -->
              <div
                v-for="item in auditTrail"
                :key="item.id"
                class="flex gap-4 items-start relative pb-6 last:pb-0"
              >
                <!-- Line connector -->
                <div
                  class="absolute left-[15px] top-[32px] bottom-0 w-px bg-border last:hidden"
                ></div>

                <div class="mt-0.5">
                  <CheckCircle2
                    v-if="item.type === 'status_changed'"
                    class="w-8 h-8 text-green-500 bg-white"
                  />
                  <PlusCircle v-else class="w-8 h-8 text-blue-500 bg-white" />
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <p class="font-bold text-sm">{{ item.title }}</p>
                    <p class="text-xs text-muted-foreground">{{ item.date }}</p>
                  </div>
                  <p class="text-sm text-foreground my-1">{{ item.desc }}</p>
                  <p class="text-xs text-muted-foreground text-blue-600">By {{ item.user }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Other tabs placeholders -->
          <div v-else class="py-12 text-center text-muted-foreground">
            <p>{{ tabs.find((t) => t.id === activeTab)?.label }} content coming soon.</p>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="p-6 border-t border-border flex justify-between bg-card/50 backdrop-blur">
          <button type="button" class="btn-outline flex items-center gap-2">
            <Printer class="w-4 h-4" /> Print BL
          </button>
          <div class="flex gap-3">
            <button type="button" class="btn-outline">Issue BL</button>
            <button type="button" class="btn-primary bg-[#012D5A] hover:bg-[#012D5A]/90 text-white">
              Edit BL
            </button>
          </div>
        </div>
      </div>

      <div v-else class="flex-1 flex items-center justify-center text-muted-foreground">
        BL not found
      </div>
    </div>
  </div>
</template>
