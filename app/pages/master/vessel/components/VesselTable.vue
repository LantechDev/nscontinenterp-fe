<script setup lang="ts">
import { ChevronDown, MoreVertical, Pencil, Trash2 } from "lucide-vue-next";
import { cn } from "~/lib/utils";

interface VesselItem {
  id: string;
  name: string;
  imoNumber: string;
  createdAt: string;
  status: string;
}

interface Props {
  vessels: VesselItem[];
  sortField: string;
  sortDirection: "asc" | "desc";
}

defineProps<Props>();

const emit = defineEmits<{
  (e: "toggle-sort", field: string): void;
  (e: "toggle-menu", id: string): void;
  (e: "edit", id: string): void;
  (e: "delete", id: string): void;
}>();
</script>

<template>
  <div class="border border-border rounded-xl bg-white overflow-x-auto">
    <table class="w-full min-w-[640px]">
      <thead>
        <tr class="border-b border-border bg-white text-left">
          <th
            class="py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"
            @click="emit('toggle-sort', 'imoNumber')"
          >
            <div class="flex items-center gap-1">
              IMO Number
              <ChevronDown
                v-if="sortField === 'imoNumber'"
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
              Vessel Name
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
          <th
            class="py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"
            @click="emit('toggle-sort', 'status')"
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
          v-for="vessel in vessels"
          :key="vessel.id"
          class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
        >
          <td class="py-3 px-4 text-sm font-medium">{{ vessel.imoNumber }}</td>
          <td class="py-3 px-4 text-sm font-medium">{{ vessel.name }}</td>
          <td class="py-3 px-4 text-sm text-muted-foreground">{{ vessel.createdAt }}</td>
          <td class="py-3 px-4">
            <span
              :class="
                cn(
                  'px-2 py-0.5 rounded border text-xs font-medium bg-white',
                  vessel.status === 'Active'
                    ? 'text-blue-500 border-blue-200'
                    : 'text-red-500 border-red-200',
                )
              "
            >
              {{ vessel.status }}
            </span>
          </td>
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
                  @click="emit('edit', vessel.id)"
                >
                  <Pencil class="w-4 h-4" />
                  Edit
                </button>
                <button
                  class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  @click="emit('delete', vessel.id)"
                >
                  <Trash2 class="w-4 h-4" />
                  Delete
                </button>
              </template>
            </UiActionMenu>
          </td>
        </tr>
        <tr v-if="vessels.length === 0">
          <td colspan="5" class="py-8 text-center text-muted-foreground">No vessels found</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
