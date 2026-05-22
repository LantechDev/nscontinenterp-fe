<script setup lang="ts">
import { ChevronDown, MoreVertical, Pencil, Trash2 } from "lucide-vue-next";
import type { ServiceUnit } from "~/types/master";

interface Props {
  units: ServiceUnit[];
  sortField: string;
  sortDirection: "asc" | "desc";
}

defineProps<Props>();

const emit = defineEmits<{
  (e: "toggle-sort", field: string): void;
  (e: "edit", unit: ServiceUnit): void;
  (e: "delete", unit: ServiceUnit): void;
}>();

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
</script>

<template>
  <div class="border border-border rounded-xl bg-white overflow-x-auto">
    <table class="w-full min-w-[640px]">
      <thead>
        <tr class="border-b border-border bg-white text-left">
          <th
            class="py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"
            @click="emit('toggle-sort', 'code')"
          >
            <div class="flex items-center gap-1">
              Unit Code
              <ChevronDown
                v-if="sortField === 'code'"
                class="w-4 h-4"
                :class="{ 'rotate-180': sortDirection === 'desc' }"
              />
            </div>
          </th>
          <th
            class="py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"
            @click="emit('toggle-sort', 'name')"
          >
            <div class="flex items-center gap-1">
              Unit Name
              <ChevronDown
                v-if="sortField === 'name'"
                class="w-4 h-4"
                :class="{ 'rotate-180': sortDirection === 'desc' }"
              />
            </div>
          </th>
          <th
            class="py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"
            @click="emit('toggle-sort', 'createdAt')"
          >
            <div class="flex items-center gap-1">
              Create Date
              <ChevronDown
                v-if="sortField === 'createdAt'"
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
          v-for="unit in units"
          :key="unit.id"
          class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
        >
          <td class="py-3 px-4 text-sm font-medium">{{ unit.code }}</td>
          <td class="py-3 px-4 text-sm font-medium">{{ unit.name }}</td>
          <td class="py-3 px-4 text-sm text-muted-foreground">{{ formatDate(unit.createdAt) }}</td>
          <td class="py-3 px-4 text-right">
            <UiActionMenu>
              <template #trigger>
                <button class="text-muted-foreground hover:text-foreground">
                  <MoreVertical class="w-4 h-4" />
                </button>
              </template>
              <template #content>
                <button
                  class="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                  @click="emit('edit', unit)"
                >
                  <Pencil class="w-4 h-4" />
                  Edit
                </button>
                <button
                  class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  @click="emit('delete', unit)"
                >
                  <Trash2 class="w-4 h-4" />
                  Delete
                </button>
              </template>
            </UiActionMenu>
          </td>
        </tr>
        <tr v-if="units.length === 0">
          <td colspan="4" class="py-8 text-center text-muted-foreground">No units found</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
