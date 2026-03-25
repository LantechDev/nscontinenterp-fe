<script setup lang="ts">
import { ArrowUpDown, Download, Filter } from "lucide-vue-next";
import { cn } from "~/lib/utils";

export interface TableColumn {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
}

export interface TableFilter {
  label: string;
  model: string;
  options: { value: string; label: string }[];
}

defineProps<{
  title: string;
  columns: TableColumn[];
  data: Record<string, unknown>[];
  filters?: TableFilter[];
  showSort?: boolean;
  showExport?: boolean;
  showTimePeriod?: boolean;
  paginationText?: string;
}>();

const emit = defineEmits<{
  (e: "sort"): void;
  (e: "export"): void;
  (e: "page-change", page: number): void;
}>();

const currentPage = ref(1);
const totalPages = 3;
</script>

<template>
  <div class="border border-border rounded-xl bg-white">
    <!-- Section Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5">
      <h2 class="text-lg font-semibold">{{ title }}</h2>

      <!-- Filters and Actions -->
      <div class="flex flex-wrap items-center gap-2">
        <!-- Time Period Filter -->
        <div v-if="showTimePeriod" class="relative">
          <select
            class="appearance-none px-3 py-2 pr-8 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option>Jan - Dec, 2025</option>
            <option>Jan - Dec, 2024</option>
          </select>
          <Filter
            class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
          />
        </div>

        <!-- Dynamic Filters -->
        <select
          v-for="filter in filters"
          :key="filter.label"
          v-model="filter.model"
          class="px-3 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option v-for="opt in filter.options" :key="opt.value">{{ opt.label }}</option>
        </select>

        <!-- Sort Button -->
        <button
          v-if="showSort"
          class="flex items-center gap-2 px-3 py-2 text-sm border border-border bg-white hover:bg-gray-50 rounded-lg transition-colors"
          @click="emit('sort')"
        >
          <ArrowUpDown class="w-4 h-4" />
          <span>Sort</span>
        </button>

        <!-- Export Button -->
        <button
          v-if="showExport"
          class="flex items-center gap-2 px-3 py-2 text-sm border border-border bg-white hover:bg-gray-50 rounded-lg transition-colors"
          @click="emit('export')"
        >
          <Download class="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>
    </div>

    <!-- Data Table -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-border bg-gray-50/50">
            <th
              v-for="col in columns"
              :key="col.key"
              :class="
                cn(
                  'py-3 px-4 text-sm font-medium text-gray-500',
                  col.align === 'right'
                    ? 'text-right'
                    : col.align === 'center'
                      ? 'text-center'
                      : 'text-left',
                )
              "
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, idx) in data"
            :key="idx"
            class="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
          >
            <slot :row="row" :index="idx" />
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between p-4 border-t border-border">
      <p class="text-sm text-muted-foreground">
        {{ paginationText || `0 of ${data.length} row(s) selected.` }}
      </p>
      <div class="flex items-center gap-2">
        <button
          class="px-3 py-1.5 text-sm border border-border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentPage === 1"
          @click="
            currentPage--;
            emit('page-change', currentPage);
          "
        >
          Previous
        </button>
        <button
          v-for="page in totalPages"
          :key="page"
          :class="
            cn(
              'px-3 py-1.5 text-sm border rounded-md',
              currentPage === page
                ? 'bg-[#012D5A] text-white border-[#012D5A]'
                : 'border-border hover:bg-gray-50',
            )
          "
          @click="
            currentPage = page;
            emit('page-change', page);
          "
        >
          {{ page }}
        </button>
        <button
          class="px-3 py-1.5 text-sm border border-border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentPage === totalPages"
          @click="
            currentPage++;
            emit('page-change', currentPage);
          "
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>
