<script setup lang="ts">
import {
  ArrowLeft,
  Edit,
  Ship,
  FileText,
  Receipt,
  Plus,
  Trash2,
  Copy,
  FileCheck,
} from "lucide-vue-next";
import type { BlParty } from "~/composables/useJobs";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const { currentJob, getJob, deleteBl, isLoading } = useJobs();

const job = computed(() => currentJob.value);
const activeTab = ref("overview"); // overview, bl, charges, documents
const isBlEditorOpen = ref(false);
const selectedBlId = ref("");

// Fetch job data when ID changes
watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      await getJob(newId as string);
    }
  },
  { immediate: true },
);

async function handleDeleteBl(blId: string) {
  if (confirm("Are you sure you want to delete this BL?")) {
    await deleteBl(blId);
    if (route.params.id) await getJob(route.params.id as string); // Refresh
  }
}

function openBlEditor(blId: string) {
  selectedBlId.value = blId;
  isBlEditorOpen.value = true;
}

function handleBlSaved() {
  // Refresh job data to show updated BL details
  if (route.params.id) getJob(route.params.id as string);
}

// Tab definitions
const tabs = [
  { id: "overview", label: "Overview", icon: Ship },
  { id: "bl", label: "Bills of Lading", icon: FileText },
  { id: "charges", label: "Charges", icon: Receipt },
  { id: "documents", label: "Documents", icon: FileCheck },
];
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
          <h1 class="page-title flex items-center gap-2">
            {{ job.jobNumber }}
          </h1>
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

    <!-- 1. Overview Tab -->
    <div v-if="activeTab === 'overview'" class="space-y-6 animate-fade-in-up">
      <div class="card-elevated p-6">
        <div class="flex items-center gap-4 mb-6 pb-6 border-b border-border">
          <div class="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
            <Ship class="w-7 h-7 text-primary" />
          </div>
          <div>
            <h2 class="text-xl font-semibold">{{ job.commodity }}</h2>
            <p class="text-muted-foreground">Job Overview</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="space-y-4">
            <h4 class="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Route
            </h4>
            <div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-4">
              <div class="w-1 h-full bg-border relative">
                <div
                  class="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary"
                ></div>
                <div
                  class="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary"
                ></div>
              </div>
              <div class="space-y-6">
                <div>
                  <p class="text-xs text-muted-foreground">POL (Port of Loading)</p>
                  <p class="font-medium text-lg">{{ job.pol }}</p>
                  <p class="text-sm text-muted-foreground">
                    {{ job.etd || "TBA" }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-muted-foreground">POD (Port of Discharge)</p>
                  <p class="font-medium text-lg">{{ job.pod }}</p>
                  <p class="text-sm text-muted-foreground">
                    {{ job.eta || "TBA" }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <h4 class="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Details
            </h4>
            <div class="space-y-3">
              <div class="flex justify-between border-b border-dashed border-border pb-2">
                <span class="text-sm text-muted-foreground">Vessel</span>
                <span class="font-medium">{{ job.vessel?.name || "-" }}</span>
              </div>
              <div class="flex justify-between border-b border-dashed border-border pb-2">
                <span class="text-sm text-muted-foreground">Container Type</span>
                <span class="font-medium">{{ job.containerType?.name || "-" }}</span>
              </div>
              <div class="flex justify-between border-b border-dashed border-border pb-2">
                <span class="text-sm text-muted-foreground">Total BLs</span>
                <span class="font-medium">{{ job.totalBlCount }}</span>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <h4 class="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Parties (Default)
            </h4>
            <div class="space-y-3">
              <div
                v-for="party in job.jobParties"
                :key="party.id"
                class="p-3 bg-muted/30 rounded-lg"
              >
                <p class="text-xs text-muted-foreground mb-1">
                  {{ party.partyRole?.name || party.partyRoleId }}
                </p>
                <p class="font-medium truncate">
                  {{ party.companyName || party.company?.name }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. Bills of Lading Tab -->
    <div v-else-if="activeTab === 'bl'" class="space-y-6 animate-fade-in-up">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold">Managed Bills of Lading</h2>
        <button class="btn-primary text-sm" disabled>
          <Plus class="w-4 h-4 mr-2" />
          New BL
        </button>
      </div>

      <div v-if="job.billsOfLading && job.billsOfLading.length > 0" class="grid gap-4">
        <div
          v-for="bl in job.billsOfLading"
          :key="bl.id"
          class="card-elevated p-0 overflow-hidden hover:shadow-lg transition-shadow group"
        >
          <div class="p-5 flex items-start gap-4">
            <div
              class="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0"
            >
              <FileText class="w-5 h-5" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <h3
                  class="font-semibold text-lg hover:text-primary cursor-pointer transition-colors"
                  @click="openBlEditor(bl.id)"
                >
                  {{ bl.blNumber }}
                </h3>
                <span class="badge-secondary">{{ bl.status?.name || "DRAFT" }}</span>
              </div>
              <div class="flex gap-6 text-sm text-muted-foreground mb-3">
                <span class="flex items-center gap-1">
                  <span class="font-medium text-foreground">Container:</span>
                  {{ bl.containerNumber || "Pending" }}
                </span>
                <span class="flex items-center gap-1">
                  <span class="font-medium text-foreground">Seal:</span>
                  {{ bl.sealNumber || "-" }}
                </span>
              </div>
              <!-- Quick Party Preview -->
              <div class="flex gap-2 text-xs text-muted-foreground mt-2">
                <div class="px-2 py-1 bg-muted rounded border border-border">
                  Shipper:
                  {{
                    bl.blParties?.find((p: BlParty) => p.partyRoleCode === "SHIPPER")
                      ?.companyName || "Not Set"
                  }}
                </div>
                <div class="px-2 py-1 bg-muted rounded border border-border">
                  Consignee:
                  {{
                    bl.blParties?.find((p: BlParty) => p.partyRoleCode === "CONSIGNEE")
                      ?.companyName || "Not Set"
                  }}
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <button @click="openBlEditor(bl.id)" class="btn-outline text-xs w-full">
                <Edit class="w-3.5 h-3.5 mr-2" />
                Edit Details
              </button>
              <!--
                            <button class="btn-ghost text-xs w-full text-muted-foreground hover:text-destructive">
                                <Trash2 class="w-3.5 h-3.5 mr-2" />
                                Delete
                            </button>
                            -->
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border"
      >
        <FileText class="w-12 h-12 mx-auto mb-3 opacity-20" />
        No Bills of Lading found.
      </div>
    </div>

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
