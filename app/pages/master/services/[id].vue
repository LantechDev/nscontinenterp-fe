<script setup lang="ts">
import { ArrowLeft, Edit, Package, Loader2 } from "lucide-vue-next";
import { cn } from "~/lib/utils";
import { ServiceCreateModal } from "./components";
import type { Service } from "~/composables/useServices";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const id = route.params.id as string;
const { updateService } = useServices();

// SSR-first: fetch service detail
const {
  data: serviceData,
  pending,
  refresh,
} = await useAsyncData<Service>(
  `service-${id}`,
  async () => {
    const result = await $fetch<Service>(`/api/master/services/${id}`);
    if (!result) throw new Error("Service not found");
    return result;
  },
  { server: false },
);

const service = computed(() => serviceData.value);
const isLoading = computed(() => pending.value);

const isEditOpen = ref(false);
const isSubmitting = ref(false);
const formError = ref<string | null>(null);

interface ServiceFormData {
  name: string;
  code: string;
  status: string;
  unitId: string;
  categoryId: string;
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Handle update - refresh data after success
const handleUpdateService = async (formData: ServiceFormData) => {
  isSubmitting.value = true;
  formError.value = null;

  const payload = {
    name: formData.name,
    code: formData.code,
    unitId: formData.unitId || undefined,
    categoryId: formData.categoryId || undefined,
    isActive: formData.status === "Active",
  };

  const result = await updateService(id, payload);
  if (result.success) {
    await refresh();
    isEditOpen.value = false;
  } else {
    formError.value = result.error || "Failed to update service";
  }
  isSubmitting.value = false;
};
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <Loader2 class="w-8 h-8 animate-spin text-primary" />
    </div>

    <template v-else-if="service">
      <div class="page-header">
        <div class="flex items-center gap-4">
          <NuxtLink to="/master/services" class="p-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft class="w-5 h-5" />
          </NuxtLink>
          <div>
            <h1 class="page-title">{{ service.name }}</h1>
            <p class="text-muted-foreground mt-1">Detail jasa untuk {{ service.code }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div
            :class="
              cn(
                'px-3 py-1 rounded-full text-xs font-medium',
                service.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
              )
            "
          >
            {{ service.isActive ? "Active" : "Inactive" }}
          </div>
          <button @click="isEditOpen = true" class="btn-secondary">
            <Edit class="w-4 h-4 mr-2" />
            Edit
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div class="lg:col-span-3 space-y-6">
          <div class="border border-border rounded-xl bg-white overflow-hidden">
            <div class="p-4 border-b border-border bg-slate-50 flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package class="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 class="font-bold text-foreground">Service Information</h2>
                <p class="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                  General details & classification
                </p>
              </div>
            </div>

            <div class="p-6">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
                <div class="space-y-1">
                  <p class="text-muted-foreground font-medium">Service Code</p>
                  <p class="font-bold text-slate-900">{{ service.code }}</p>
                </div>
                <div class="space-y-1">
                  <p class="text-muted-foreground font-medium">Category</p>
                  <p class="font-bold text-slate-900 capitalize">
                    {{ service.category?.name || "-" }}
                  </p>
                </div>
                <div class="space-y-1">
                  <p class="text-muted-foreground font-medium">Unit</p>
                  <p class="font-bold text-slate-900">{{ service.unit?.name || "-" }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="border border-border rounded-xl bg-white overflow-hidden">
            <div class="p-4 bg-slate-50 border-b border-border">
              <h3 class="font-bold text-xs uppercase tracking-widest text-slate-500">Metadata</h3>
            </div>
            <div class="p-5 space-y-4">
              <div class="space-y-1">
                <p class="text-[10px] font-bold uppercase text-muted-foreground">Registered At</p>
                <p class="text-sm font-semibold text-slate-700">
                  {{ formatDate(service.createdAt) }}
                </p>
              </div>
              <div class="space-y-1">
                <p class="text-[10px] font-bold uppercase text-muted-foreground">Last Updated</p>
                <p class="text-sm font-semibold text-slate-700">
                  {{ formatDate(service.updatedAt) }}
                </p>
              </div>
            </div>
          </div>

          <div class="border border-border border-dashed rounded-xl p-4 bg-slate-50/50">
            <p class="text-[10px] font-black uppercase text-slate-500 mb-1 tracking-widest">
              Service Status
            </p>
            <p class="text-[11px] text-muted-foreground leading-relaxed font-medium">
              This service is currently
              <span
                :class="service.isActive ? 'text-green-600 font-bold' : 'text-red-600 font-bold'"
                >{{ service.isActive ? "operational" : "suspended" }}</span
              >.
            </p>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="flex flex-col items-center justify-center py-20 text-muted-foreground">
      <Package class="w-12 h-12 mb-4 opacity-20" />
      <p>Service not found</p>
      <NuxtLink to="/master/services" class="mt-4 text-primary hover:underline">
        Back to Services
      </NuxtLink>
    </div>

    <ServiceCreateModal
      :is-open="isEditOpen"
      :is-submitting="isSubmitting"
      :error="formError"
      :initial-data="service"
      @update:is-open="(val) => (isEditOpen = val)"
      @submit="handleUpdateService"
    />
  </div>
</template>
