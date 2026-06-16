<script setup lang="ts">
import {
  Plus,
  Search,
  LayoutList,
  LayoutGrid,
  Pencil,
  Trash2,
  FileText,
  ChevronUp,
  ChevronDown,
} from "lucide-vue-next";
import { cn } from "~/lib/utils";
import Combobox from "~/components/ui/Combobox.vue";
import { useBlConditionsPage } from "~/composables/useBlConditionsPage";
import { useBlConditions, type BlCondition } from "~/composables/useBlConditions";
import { BlConditionEditModal } from "./components";

definePageMeta({
  layout: "dashboard",
});

const {
  conditions,
  filteredConditions,
  viewMode,
  searchQuery,
  isEditModalOpen,
  isSubmitting,
  editError,
  editingId,
  formData,
  isLoading,
  openAddModal,
  openEditModal,
  closeEditModal,
  handleSubmit,
  handleDelete,
  toggleStatus,
  move,
  initialize,
  setData,
} = useBlConditionsPage();
const { canManage, requireManage } = useFeatureAccess("master.logistics");

const openAddModalIfAllowed = () => {
  if (!requireManage("You only have view access for logistics master data.")) return;
  openAddModal();
};

const openEditModalIfAllowed = (id: string) => {
  if (!requireManage("You only have view access for logistics master data.")) return;
  openEditModal(id);
};

const handleDeleteIfAllowed = (id: string) => {
  if (!requireManage("You only have view access for logistics master data.")) return;
  handleDelete(id);
};

const toggleStatusIfAllowed = (item: BlCondition) => {
  if (!requireManage("You only have view access for logistics master data.")) return;
  toggleStatus(item);
};

const moveIfAllowed = (index: number, direction: "up" | "down") => {
  if (!requireManage("You only have view access for logistics master data.")) return;
  move(index, direction);
};

const handleSubmitIfAllowed = () => {
  if (!requireManage("You only have view access for logistics master data.")) return;
  handleSubmit();
};

const selectedStatus = ref("all");
const statusOptions = [
  { id: "all", name: "All Status" },
  { id: "active", name: "Active" },
  { id: "inactive", name: "Inactive" },
];

const isBootstrapping = ref(false);
const bootstrapError = ref<Error | null>(null);

const fetchBlConditions = async () => {
  isBootstrapping.value = true;
  bootstrapError.value = null;
  try {
    const res = await $fetch<{ success: boolean; data: BlCondition[] }>(
      "/api/master/bl-conditions",
    );
    setData({ items: res.data });
  } catch (err) {
    bootstrapError.value = err as Error;
  } finally {
    isBootstrapping.value = false;
  }
};

const refreshBootstrap = () => {
  fetchBlConditions();
};

const route = useRoute();
watch(
  () => route.fullPath,
  () => {
    fetchBlConditions();
  },
);

onMounted(() => {
  fetchBlConditions();
});

const isPageLoading = computed(() => isLoading.value || isBootstrapping.value);

const conditionStats = computed(() => {
  const total = conditions.value.length;
  const active = conditions.value.filter((condition) => condition.isActive).length;
  return {
    total,
    active,
    inactive: total - active,
  };
});

const visibleConditions = computed(() => {
  if (selectedStatus.value === "all") return filteredConditions.value;
  const isActive = selectedStatus.value === "active";
  return filteredConditions.value.filter((condition) => condition.isActive === isActive);
});
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">B/L Conditions</h1>
        <p class="text-muted-foreground mt-1">
          Manage "Combined Transport Bill of Lading" Contract Clauses
        </p>
      </div>

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

        <button
          v-if="canManage"
          @click="openAddModalIfAllowed"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors"
        >
          <Plus class="w-4 h-4" />
          <span>Add Clause</span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white border border-border rounded-xl p-4 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-blue-50 text-[#012D5A] rounded-lg">
            <FileText class="w-5 h-5" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Total Clauses</p>
            <p class="text-2xl font-bold text-foreground">{{ conditionStats.total }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white border border-border rounded-xl p-4 shadow-sm">
        <p class="text-sm text-muted-foreground">Active Clauses</p>
        <p class="text-2xl font-bold text-green-600 mt-1">{{ conditionStats.active }}</p>
      </div>
      <div class="bg-white border border-border rounded-xl p-4 shadow-sm">
        <p class="text-sm text-muted-foreground">Inactive Clauses</p>
        <p class="text-2xl font-bold text-muted-foreground mt-1">{{ conditionStats.inactive }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex items-center justify-between gap-4">
      <div class="relative w-full max-sm:max-w-none max-w-sm">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search clauses..."
          class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
        />
      </div>
      <Combobox
        v-model="selectedStatus"
        :options="statusOptions"
        placeholder="All Status"
        class="min-w-[150px]"
      />
    </div>

    <div
      v-if="bootstrapError"
      class="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm animate-fade-in"
    >
      <div class="flex items-center justify-between gap-4">
        <span>Failed to load B/L conditions. Please try again.</span>
        <button
          class="px-3 py-1 bg-destructive text-white rounded-md text-xs font-medium"
          @click="refreshBootstrap()"
        >
          Retry
        </button>
      </div>
    </div>

    <div v-if="isPageLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#012D5A]"></div>
    </div>

    <template v-else>
      <!-- List View -->
      <div
        v-if="viewMode === 'list'"
        class="border border-border rounded-xl bg-white overflow-hidden shadow-sm"
      >
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-border bg-gray-50/50 text-left">
                <th
                  class="py-3 px-4 w-12 text-center text-xs font-bold text-muted-foreground uppercase tracking-widest"
                >
                  Ord
                </th>
                <th class="py-3 px-4 text-sm font-bold text-foreground uppercase tracking-wider">
                  Clause #
                </th>
                <th class="py-3 px-4 text-sm font-bold text-foreground uppercase tracking-wider">
                  Title
                </th>
                <th class="py-3 px-4 text-sm font-bold text-foreground uppercase tracking-wider">
                  Preview
                </th>
                <th class="py-3 px-4 text-sm font-bold text-foreground uppercase tracking-wider">
                  Status
                </th>
                <th class="py-3 px-4 w-20"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr
                v-for="(item, index) in visibleConditions"
                :key="item.id"
                class="hover:bg-muted/30 transition-colors group"
              >
                <td class="py-3 px-4">
                  <div class="flex flex-col items-center gap-0.5">
                    <button
                      @click="moveIfAllowed(index, 'up')"
                      :disabled="index === 0"
                      class="p-0.5 hover:bg-gray-100 rounded disabled:opacity-30 text-[#012D5A]"
                    >
                      <ChevronUp class="w-3.5 h-3.5" />
                    </button>
                    <button
                      @click="moveIfAllowed(index, 'down')"
                      :disabled="index === conditions.length - 1"
                      class="p-0.5 hover:bg-gray-100 rounded disabled:opacity-30 text-[#012D5A]"
                    >
                      <ChevronDown class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <span class="text-sm font-mono font-bold text-[#012D5A]">{{
                    item.clauseNumber
                  }}</span>
                </td>
                <td class="py-3 px-4">
                  <span class="text-sm font-semibold">{{ item.clauseTitle }}</span>
                </td>
                <td class="py-3 px-4">
                  <p class="text-xs text-muted-foreground max-w-md truncate line-clamp-1">
                    {{ item.clauseContent }}
                  </p>
                </td>
                <td class="py-3 px-4">
                  <button
                    :disabled="!canManage"
                    @click="toggleStatusIfAllowed(item)"
                    :class="
                      cn(
                        'px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider transition-colors',
                        item.isActive
                          ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                          : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200',
                      )
                    "
                  >
                    {{ item.isActive ? "Active" : "Inactive" }}
                  </button>
                </td>
                <td v-if="canManage" class="py-3 px-4 text-right">
                  <div class="flex gap-1 justify-end">
                    <button
                      class="p-1.5 rounded hover:bg-muted transition-colors"
                      @click="openEditModalIfAllowed(item.id)"
                    >
                      <Pencil class="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      class="p-1.5 rounded hover:bg-muted transition-colors"
                      @click="handleDeleteIfAllowed(item.id)"
                    >
                      <Trash2 class="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="visibleConditions.length === 0">
                <td
                  :colspan="canManage ? 6 : 5"
                  class="py-12 text-center text-muted-foreground italic"
                >
                  No clauses found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Grid View -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="item in visibleConditions"
          :key="item.id"
          class="border border-border rounded-xl bg-white p-5 hover:shadow-sm transition-shadow group relative"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-start gap-4">
              <div
                class="w-10 h-10 rounded-lg bg-blue-50 text-[#012D5A] flex items-center justify-center shrink-0"
              >
                <FileText class="w-5 h-5" />
              </div>
              <div>
                <h3 class="font-bold text-sm text-foreground line-clamp-1">
                  {{ item.clauseTitle }}
                </h3>
                <p class="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                  Clause {{ item.clauseNumber }}
                </p>
              </div>
            </div>

            <div
              v-if="canManage"
              class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <button
                class="p-1.5 rounded hover:bg-muted transition-colors"
                @click="openEditModalIfAllowed(item.id)"
              >
                <Pencil class="w-3.5 h-3.5 text-muted-foreground" />
              </button>
              <button
                class="p-1.5 rounded hover:bg-muted transition-colors"
                @click="handleDeleteIfAllowed(item.id)"
              >
                <Trash2 class="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div class="space-y-4 mb-4 min-h-[60px]">
            <p class="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
              {{ item.clauseContent }}
            </p>
          </div>

          <div class="pt-3 border-t border-border flex items-center justify-between">
            <button
              :disabled="!canManage"
              @click="toggleStatusIfAllowed(item)"
              :class="
                cn(
                  'px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider transition-colors',
                  item.isActive
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-gray-100 text-gray-500 border-gray-200',
                )
              "
            >
              {{ item.isActive ? "Active" : "Inactive" }}
            </button>
            <span class="text-[10px] text-muted-foreground font-mono">#{{ item.sortOrder }}</span>
          </div>
        </div>
        <div
          v-if="visibleConditions.length === 0"
          class="col-span-full py-12 text-center text-muted-foreground"
        >
          No clauses found.
        </div>
      </div>
    </template>
  </div>

  <!-- Edit Modal -->
  <BlConditionEditModal
    :is-open="isEditModalOpen"
    :is-submitting="isSubmitting"
    :edit-error="editError"
    :editing-id="editingId"
    :form-data="formData"
    @close="closeEditModal"
    @submit="handleSubmitIfAllowed"
  />
</template>
