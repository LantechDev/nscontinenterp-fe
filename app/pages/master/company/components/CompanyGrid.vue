<script setup lang="ts">
import { MoreVertical, Building2, Mail, Phone, Pencil, Trash2 } from "lucide-vue-next";
import type { MappedCompany } from "~/composables/useCompanies";

defineProps<{
  companies: MappedCompany[];
  activeMenuId: string | null;
}>();

defineEmits<{
  (e: "open-detail", company: MappedCompany): void;
  (e: "toggle-menu", id: string): void;
  (e: "edit", company: MappedCompany): void;
  (e: "delete", company: MappedCompany): void;
}>();
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div
      v-for="company in companies"
      :key="company.id"
      class="border border-border rounded-xl bg-white p-5 hover:shadow-sm transition-shadow cursor-pointer"
      @click="$emit('open-detail', company)"
    >
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
            <Building2 class="w-6 h-6 text-[#012D5A]" />
          </div>
          <div>
            <h3 class="font-bold text-base text-foreground">{{ company.name }}</h3>
            <p class="text-xs text-muted-foreground">{{ company.code }}</p>
          </div>
        </div>
        <div class="company-action-menu relative">
          <button
            class="text-muted-foreground hover:text-foreground"
            @click.stop="$emit('toggle-menu', company.id)"
          >
            <MoreVertical class="w-4 h-4" />
          </button>
          <div
            v-if="activeMenuId === company.id"
            class="absolute right-0 top-6 z-50 min-w-[140px] rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
          >
            <button
              class="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              @click.stop="$emit('edit', company)"
            >
              <Pencil class="w-3.5 h-3.5 text-slate-600" />
              Edit
            </button>
            <button
              class="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              @click.stop="$emit('delete', company)"
            >
              <Trash2 class="w-3.5 h-3.5 text-red-500" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <div class="space-y-2 mb-6">
        <div class="flex items-center gap-3 text-sm text-gray-600">
          <Mail class="w-4 h-4" />
          <span>{{ company.email }}</span>
        </div>
        <div class="flex items-center gap-3 text-sm text-gray-600">
          <Phone class="w-4 h-4" />
          <span>{{ company.phone }}</span>
        </div>
      </div>

      <div class="flex items-center justify-between pt-4 border-t border-border">
        <div class="flex items-center gap-2">
          <span class="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-medium">{{
            company.type
          }}</span>
          <span
            class="px-2 py-0.5 rounded border bg-white text-xs font-medium"
            :class="
              company.status === 'Active'
                ? 'border-blue-200 text-blue-500'
                : 'border-red-200 text-red-500'
            "
          >
            {{ company.status }}
          </span>
        </div>
        <div class="text-right">
          <span class="font-bold text-sm text-foreground">{{ company.totalJobs }}</span>
          <span class="text-xs text-muted-foreground ml-1">Total Job</span>
        </div>
      </div>
    </div>
    <div v-if="companies.length === 0" class="col-span-2 py-8 text-center text-muted-foreground">
      No companies found
    </div>
  </div>
</template>
