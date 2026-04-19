<script setup lang="ts">
import {
  Plus,
  Search,
  Calculator,
  LayoutList,
  LayoutGrid,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-vue-next";
import { cn } from "~/lib/utils";
import { useTaxPage } from "~/composables/useTaxPage";
import { type Tax } from "~/composables/useFinanceTax";
import type { Pagination } from "~/composables/useFinanceExpense";
import { TaxEditModal } from "./components";

definePageMeta({
  layout: "dashboard",
});

const {
  taxes,
  filters,
  pagination,
  viewMode,
  searchQuery,
  isEditModalOpen,
  isSubmitting,
  editError,
  editingTaxId,
  formData,
  taxTypeOptions,
  formatCurrency,
  isLoading,
  handlePageChange,
  handleRowClick,
  openEditModal,
  closeEditModal,
  handleUpdate,
  handleDelete,
  setData,
} = useTaxPage();

// SSR-first: fetch initial data and inject into composable
const { data: taxesData } = await useAsyncData("tax-list", async () => {
  const response = await $fetch("/api/finance/tax");
  return response;
});

// Inject SSR data into composable
if (taxesData.value) {
  setData(taxesData.value as { items: Tax[]; pagination: Pagination });
}
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Pajak</h1>
        <p class="text-muted-foreground mt-1">Kelola catatan pajak PPN dan PPh</p>
      </div>

      <div class="flex items-center gap-2">
        <div class="flex items-center bg-white border border-border rounded-lg p-1 mr-2">
          <button
            @click="viewMode = 'list'"
            :class="
              cn(
                'p-1.5 rounded transition-colors',
                viewMode === 'list'
                  ? 'bg-[#012D5A] text-white'
                  : 'text-muted-foreground hover:bg-muted',
              )
            "
          >
            <LayoutList class="w-4 h-4" />
          </button>
          <button
            @click="viewMode = 'grid'"
            :class="
              cn(
                'p-1.5 rounded transition-colors',
                viewMode === 'grid'
                  ? 'bg-[#012D5A] text-white'
                  : 'text-muted-foreground hover:bg-muted',
              )
            "
          >
            <LayoutGrid class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex items-center justify-between gap-4">
      <div class="relative w-full max-w-sm">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari pajak..."
          class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
        />
      </div>

      <div class="flex items-center gap-3">
        <select
          v-model="filters.type"
          class="px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">Semua Tipe</option>
          <option value="ppn">PPN</option>
          <option value="pph">PPh</option>
        </select>
        <NuxtLink
          to="/finance/tax/create"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap"
        >
          <Plus class="w-4 h-4" />
          <span>Catat Pajak</span>
        </NuxtLink>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <template v-else>
      <!-- List View -->
      <div
        v-if="viewMode === 'list'"
        class="border border-border rounded-xl bg-white overflow-hidden"
      >
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-border bg-white text-left">
                <th class="py-3 px-4 text-sm font-medium text-foreground">Nama</th>
                <th class="py-3 px-4 text-sm font-medium text-foreground">Tipe</th>
                <th class="py-3 px-4 text-sm font-medium text-foreground">Rate (%)</th>
                <th class="py-3 px-4 text-sm font-medium text-foreground">Deskripsi</th>
                <th class="py-3 px-4 text-sm font-medium text-foreground">Status</th>
                <th class="py-3 px-4 w-10"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="tax in taxes"
                :key="tax.id"
                class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td class="py-3 px-4">
                  <div class="flex items-center gap-2">
                    <div class="p-1.5 rounded bg-blue-50 text-[#012D5A]">
                      <Calculator class="w-4 h-4" />
                    </div>
                    <span class="text-sm font-medium">{{ tax.name }}</span>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <span
                    class="text-xs font-medium uppercase bg-muted px-2 py-0.5 rounded-full text-muted-foreground border"
                  >
                    {{ tax.type }}
                  </span>
                </td>
                <td class="py-3 px-4 text-sm font-medium">{{ tax.rate }}%</td>
                <td class="py-3 px-4 text-sm text-muted-foreground">
                  {{ tax.description || "-" }}
                </td>
                <td class="py-3 px-4">
                  <span
                    :class="
                      cn(
                        'px-2 py-0.5 rounded border text-xs font-medium',
                        tax.isActive
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-gray-100 text-gray-500 border-gray-200',
                      )
                    "
                  >
                    {{ tax.isActive ? "Aktif" : "Nonaktif" }}
                  </span>
                </td>
                <td class="py-3 px-4 text-right">
                  <div class="flex gap-1 justify-end">
                    <button
                      class="p-1.5 rounded hover:bg-muted transition-colors"
                      @click.stop="openEditModal(tax.id)"
                    >
                      <Pencil class="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      class="p-1.5 rounded hover:bg-muted transition-colors"
                      @click.stop="handleDelete(tax.id)"
                    >
                      <Trash2 class="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="taxes.length === 0">
                <td colspan="6" class="py-12 text-center text-muted-foreground">
                  Tidak ada pajak ditemukan.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Grid View -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="tax in taxes"
          :key="tax.id"
          class="border border-border rounded-xl bg-white p-5 hover:shadow-sm transition-shadow cursor-pointer"
          @click="handleRowClick(tax.id)"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-start gap-4">
              <div
                class="w-12 h-12 rounded-lg bg-blue-50 text-[#012D5A] flex items-center justify-center shrink-0"
              >
                <Calculator class="w-6 h-6" />
              </div>
              <div>
                <h3 class="font-bold text-base text-foreground">{{ tax.name }}</h3>
                <p class="text-xs text-muted-foreground uppercase">{{ tax.type }}</p>
              </div>
            </div>
            <button class="text-muted-foreground hover:text-foreground" @click.stop>
              <MoreVertical class="w-4 h-4" />
            </button>
          </div>

          <div class="space-y-4 mb-4">
            <div>
              <p class="text-xs text-muted-foreground mb-1">Rate</p>
              <p class="text-lg font-bold text-[#012D5A]">{{ tax.rate }}%</p>
            </div>
            <div>
              <p class="text-xs text-muted-foreground mb-1">Status</p>
              <span
                :class="
                  cn(
                    'px-2 py-0.5 rounded border text-xs font-medium',
                    tax.isActive
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-gray-100 text-gray-500 border-gray-200',
                  )
                "
              >
                {{ tax.isActive ? "Aktif" : "Nonaktif" }}
              </span>
            </div>
          </div>

          <div class="pt-3 border-t border-border">
            <p class="text-xs text-muted-foreground line-clamp-2">
              {{ tax.description || "Tidak ada deskripsi" }}
            </p>
          </div>
        </div>
        <div
          v-if="taxes.length === 0"
          class="col-span-full py-12 text-center text-muted-foreground"
        >
          Tidak ada pajak ditemukan.
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between text-sm text-muted-foreground">
        <p>{{ pagination.total }} data found.</p>
        <UiPagination
          v-if="pagination.total > 0"
          v-model:page="filters.page"
          :total="pagination.total"
          :items-per-page="pagination.limit"
          @update:page="handlePageChange"
        />
      </div>
    </template>
  </div>

  <!-- Edit Modal -->
  <TaxEditModal
    :is-open="isEditModalOpen"
    :is-submitting="isSubmitting"
    :edit-error="editError"
    :editing-tax-id="editingTaxId"
    :form-data="formData"
    :tax-type-options="taxTypeOptions"
    @close="closeEditModal"
    @submit="handleUpdate"
  />
</template>
