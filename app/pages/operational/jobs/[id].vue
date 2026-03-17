<script setup lang="ts">
import { ArrowLeft, Ship, FileText, Receipt, FileCheck } from "lucide-vue-next";
import BlEditor from "~/components/operational/BlEditor.vue";
import JobOverviewTab from "./components/JobOverviewTab.vue";
import JobBlTab from "./components/JobBlTab.vue";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const { currentJob, getJob, isLoading } = useJobs();

const job = computed(() => currentJob.value);
const activeTab = ref("overview");
const isBlEditorOpen = ref(false);
const selectedBlId = ref("");

// Tab definitions
const tabs = [
  { id: "overview", label: "Overview", icon: Ship },
  { id: "bl", label: "Bills of Lading", icon: FileText },
  { id: "charges", label: "Charges", icon: Receipt },
  { id: "documents", label: "Documents", icon: FileCheck },
];

// Watch for route changes
watch(
  () => route.params.id,
  async (newId) => {
    if (newId) await getJob(newId as string);
  },
  { immediate: true },
);

function openBlEditor(blId: string) {
  selectedBlId.value = blId;
  isBlEditorOpen.value = true;
}

function handleBlSaved() {
  if (route.params.id) getJob(route.params.id as string);
}
</script>

<template>
  <div v-if="job" class="space-y-6 animate-fade-in pb-20">
    <!-- Header -->
    <div class="page-header">
      <div class="flex items-center gap-4">
        <NuxtLink to="/operational/jobs" class="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft class="w-5 h-5" />
        </NuxtLink>
        <div>
          <h1 class="page-title flex items-center gap-2">{{ job.jobNumber }}</h1>
          <p class="text-muted-foreground mt-1">Detail job/shipment</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="badge-success">{{ job.statusId || "Active" }}</span>
        <span
          class="text-xs font-medium uppercase text-chart-1 border px-2 py-1 rounded bg-background"
        >
          {{ job.tradeType?.name || job.tradeTypeId || "Export" }}
        </span>
      </div>
    </div>

    <!-- Tabs Navigation -->
    <div class="border-b border-border overflow-x-auto">
      <nav class="flex space-x-1" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            activeTab === tab.id
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
            'whitespace-nowrap border-b-2 py-4 px-6 text-sm font-medium flex items-center gap-2 transition-colors',
          ]"
        >
          <component :is="tab.icon" class="w-4 h-4" />
          {{ tab.label }}
          <span v-if="tab.id === 'bl'" class="ml-1 bg-muted text-xs py-0.5 px-2 rounded-full">
            {{ job.billsOfLading?.length || 0 }}
          </span>
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <JobOverviewTab v-if="activeTab === 'overview'" :job="job" />
    <JobBlTab v-else-if="activeTab === 'bl'" :job="job" @edit-bl="openBlEditor" />

    <!-- 3. Charges Tab -->
    <div v-else-if="activeTab === 'charges'" class="py-12 text-center text-muted-foreground">
      <Receipt class="w-12 h-12 mx-auto mb-3 opacity-20" />
      <p>Charges & Invoicing module coming soon.</p>
    </div>

    <!-- 4. Documents Tab -->
    <div v-else-if="activeTab === 'documents'" class="py-12 text-center text-muted-foreground">
      <FileCheck class="w-12 h-12 mx-auto mb-3 opacity-20" />
      <p>Document archive coming soon.</p>
    </div>
  </div>

  <div v-else-if="isLoading" class="p-8 text-center text-muted-foreground">
    Loading job details...
  </div>
  <div v-else class="p-8 text-center text-muted-foreground">Job not found.</div>

  <!-- BL Editor Drawer -->
  <BlEditor v-model="isBlEditorOpen" :bl-id="selectedBlId" @saved="handleBlSaved" />
</template>
