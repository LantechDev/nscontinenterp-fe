<script setup lang="ts">
import { MoreVertical, ChevronDown } from "lucide-vue-next";
import { cn } from "~/lib/utils";
import Checkbox from "~/components/ui/Checkbox.vue";

interface ServiceItem {
  id: string;
  name: string;
  code: string;
  unit: string;
  unitId: string;
  selected: boolean;
  status: string;
}

const props = defineProps<{
  services: ServiceItem[];
  sortField: string;
  sortDirection: "asc" | "desc";
}>();

const emit = defineEmits<{
  (e: "toggle-sort", field: string): void;
  (e: "row-click", id: string): void;
}>();

const selectedIds = ref(new Set<string>());

const isAllSelected = computed({
  get: () => props.services.length > 0 && props.services.every((s) => selectedIds.value.has(s.id)),
  set: (val: boolean) => {
    if (val) {
      props.services.forEach((s) => selectedIds.value.add(s.id));
    } else {
      selectedIds.value.clear();
    }
  },
});

const toggleSelection = (id: string) => {
  if (selectedIds.value.has(id)) {
    selectedIds.value.delete(id);
  } else {
    selectedIds.value.add(id);
  }
};

const toggleSort = (field: string) => {
  emit("toggle-sort", field);
};

const handleRowClick = (id: string) => {
  emit("row-click", id);
};
</script>

<template>
  <div class="border border-border rounded-xl bg-white overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-border bg-white text-left">
            <th class="py-3 px-4 w-10">
              <Checkbox v-model="isAllSelected" />
            </th>
            <th
              class="py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"
              @click="toggleSort('code')"
            >
              <div class="flex items-center gap-1">
                Code
                <ChevronDown
                  v-if="sortField === 'code'"
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
                Service Name
                <ChevronDown
                  v-if="sortField === 'name'"
                  class="w-4 h-4"
                  :class="{ 'rotate-180': sortDirection === 'desc' }"
                />
              </div>
            </th>
            <th class="py-3 px-4 text-sm font-medium text-foreground">Unit</th>
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
            v-for="service in services"
            :key="service.id"
            class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
            @click="handleRowClick(service.id)"
          >
            <td class="py-3 px-4" @click.stop>
              <Checkbox
                :modelValue="selectedIds.has(service.id)"
                @update:modelValue="toggleSelection(service.id)"
              />
            </td>
            <td class="py-3 px-4 text-sm font-medium">{{ service.code }}</td>
            <td class="py-3 px-4 text-sm font-medium">{{ service.name }}</td>
            <td class="py-3 px-4 text-sm text-muted-foreground">{{ service.unit }}</td>
            <td class="py-3 px-4">
              <span
                :class="
                  cn(
                    'px-2 py-0.5 rounded border text-xs font-medium bg-white',
                    service.status === 'Active'
                      ? 'text-blue-500 border-blue-200'
                      : 'text-red-500 border-red-200',
                  )
                "
              >
                {{ service.status }}
              </span>
            </td>
            <td class="py-3 px-4 text-right">
              <button class="text-muted-foreground hover:text-foreground">
                <MoreVertical class="w-4 h-4" />
              </button>
            </td>
          </tr>
          <tr v-if="services.length === 0">
            <td colspan="6" class="py-8 text-center text-muted-foreground">No services found</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
