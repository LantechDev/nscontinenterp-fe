<script setup lang="ts">
import { MoreVertical, ChevronDown } from "lucide-vue-next";
import { cn } from "~/lib/utils";
import type { MappedCompany } from "~/composables/useCompanies";
import { UiCheckbox } from "#components";

defineProps<{
  companies: MappedCompany[];
  sortField: string;
  sortDirection: "asc" | "desc";
  selectAll: boolean;
}>();

defineEmits<{
  (e: "update:sort", field: string): void;
  (e: "open-detail", company: MappedCompany): void;
  (e: "update:selectAll", value: boolean): void;
}>();
</script>

<template>
  <div class="border border-border rounded-xl bg-white overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-border bg-white text-left">
            <th class="py-3 px-4 w-10">
              <UiCheckbox
                :model-value="selectAll"
                @update:model-value="$emit('update:selectAll', $event)"
              />
            </th>
            <th
              class="py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"
              @click="$emit('update:sort', 'code')"
            >
              <div class="flex items-center gap-1">
                No. Cust
                <ChevronDown
                  v-if="sortField === 'code'"
                  class="w-4 h-4"
                  :class="{ 'rotate-180': sortDirection === 'desc' }"
                />
              </div>
            </th>
            <th
              class="py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"
              @click="$emit('update:sort', 'name')"
            >
              <div class="flex items-center gap-1">
                Company
                <ChevronDown
                  v-if="sortField === 'name'"
                  class="w-4 h-4"
                  :class="{ 'rotate-180': sortDirection === 'desc' }"
                />
              </div>
            </th>
            <th class="py-3 px-4 text-sm font-medium text-foreground">Email</th>
            <th class="py-3 px-4 text-sm font-medium text-foreground">Total Job</th>
            <th
              class="py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"
              @click="$emit('update:sort', 'type')"
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
              @click="$emit('update:sort', 'status')"
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
            v-for="company in companies"
            :key="company.id"
            class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
            @click="$emit('open-detail', company)"
          >
            <td class="py-3 px-4" @click.stop>
              <UiCheckbox v-model="company.selected" />
            </td>
            <td class="py-3 px-4 text-sm font-medium">{{ company.code }}</td>
            <td class="py-3 px-4 text-sm font-medium">{{ company.name }}</td>
            <td class="py-3 px-4 text-sm font-normal">{{ company.email }}</td>
            <td class="py-3 px-4 text-sm">{{ company.totalJobs }}</td>
            <td class="py-3 px-4">
              <span
                :class="
                  cn(
                    'px-2 py-1 rounded text-xs font-medium',
                    company.type === 'Shipper'
                      ? 'bg-gray-100 text-gray-700'
                      : company.type === 'Consignee'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-gray-900 text-white',
                  )
                "
              >
                {{ company.type }}
              </span>
            </td>
            <td class="py-3 px-4">
              <span
                :class="
                  cn(
                    'px-2 py-0.5 rounded border text-xs font-medium bg-white',
                    company.status === 'Active'
                      ? 'text-blue-500 border-blue-200'
                      : 'text-red-500 border-red-200',
                  )
                "
              >
                {{ company.status }}
              </span>
            </td>
            <td class="py-3 px-4 text-right">
              <button class="text-muted-foreground hover:text-foreground" @click.stop>
                <MoreVertical class="w-4 h-4" />
              </button>
            </td>
          </tr>
          <tr v-if="companies.length === 0">
            <td colspan="8" class="py-8 text-center text-muted-foreground">No companies found</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
