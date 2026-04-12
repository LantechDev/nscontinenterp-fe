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
  openMenuId: string | null;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: "toggle-sort", field: string): void;
  (e: "toggle-menu", id: string): void;
  (e: "edit", id: string): void;
  (e: "delete", id: string): void;
}>();

const toggleSort = (field: string) => {
  emit("toggle-sort", field);
};

const handleEdit = (id: string) => {
  emit("edit", id);
};

const handleDelete = (id: string) => {
  emit("delete", id);
};
</script>

<template>
  <div class="border border-border rounded-xl bg-white overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-border bg-white text-left">
            <th
              class="py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"
              @click="toggleSort('imoNumber')"
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
              @click="toggleSort('name')"
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
              @click="toggleSort('createdAt')"
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
              @click="toggleSort('status')"
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
            <td class="py-3 px-4 text-right relative">
              <button
                @click.stop="emit('toggle-menu', vessel.id)"
                class="text-muted-foreground hover:text-foreground dropdown-menu"
              >
                <MoreVertical class="w-4 h-4" />
              </button>
              <!-- Dropdown Menu -->
              <div
                v-if="openMenuId === vessel.id"
                class="absolute right-4 top-10 z-10 w-36 bg-white border border-border rounded-lg shadow-lg overflow-hidden dropdown-menu"
              >
                <button
                  @click.stop="
                    handleEdit(vessel.id);
                    emit('toggle-menu', vessel.id);
                  "
                  class="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                >
                  <Pencil class="w-4 h-4" />
                  Edit
                </button>
                <button
                  @click.stop="
                    handleDelete(vessel.id);
                    emit('toggle-menu', vessel.id);
                  "
                  class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 class="w-4 h-4" />
                  Delete
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="vessels.length === 0">
            <td colspan="5" class="py-8 text-center text-muted-foreground">No vessels found</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
