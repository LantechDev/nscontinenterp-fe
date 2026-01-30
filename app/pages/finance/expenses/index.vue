<script setup lang="ts">
import {
  Plus,
  Search,
  Wallet,
  LayoutList,
  LayoutGrid,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-vue-next";
import { cn } from "~/lib/utils";

definePageMeta({
  layout: "dashboard",
});

const expenses = [
  {
    id: "1",
    number: "EXP-2024-001",
    description: "Trucking Fee - JOB-2024-001234",
    vendor: "CV Trucking Mandiri",
    date: "6 Jan 2025",
    amount: "Rp 3.500.000",
    category: "Trucking",
  },
  {
    id: "2",
    number: "EXP-2024-002",
    description: "Port Charges - JOB-2024-001234",
    vendor: "PT Pelayaran Nusantara",
    date: "5 Jan 2025",
    amount: "Rp 2.200.000",
    category: "Port",
  },
  {
    id: "3",
    number: "EXP-2024-003",
    description: "Customs Clearance - JOB-2024-001233",
    vendor: "PT Bea Cukai Partner",
    date: "4 Jan 2025",
    amount: "Rp 1.200.000",
    category: "Customs",
  },
];

type ViewMode = "list" | "grid";
const viewMode = ref<ViewMode>("list");
</script>

<template>
  <div class="space-y-6 animate-fade-in pb-10">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Biaya Operasional</h1>
        <p class="text-muted-foreground mt-1">Catat pengeluaran operasional</p>
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
          type="text"
          placeholder="Cari biaya..."
          class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
        />
      </div>

      <div class="flex items-center gap-3">
        <select
          class="px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">Semua Kategori</option>
          <option value="trucking">Trucking</option>
          <option value="port">Port</option>
          <option value="customs">Customs</option>
        </select>
        <NuxtLink
          to="/finance/expenses/create"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap"
        >
          <Plus class="w-4 h-4" />
          <span>Catat Biaya</span>
        </NuxtLink>
      </div>
    </div>

    <!-- List View -->
    <div
      v-if="viewMode === 'list'"
      class="border border-border rounded-xl bg-white overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border bg-white text-left">
              <th class="py-3 px-4 text-sm font-medium text-foreground">No. Biaya</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">Deskripsi</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">Vendor</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">Tanggal</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">Jumlah</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">Kategori</th>
              <th class="py-3 px-4 w-10"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="expense in expenses"
              :key="expense.id"
              class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
              @click="navigateTo(`/finance/expenses/${expense.id}`)"
            >
              <td class="py-3 px-4">
                <div class="flex items-center gap-2">
                  <div class="p-1.5 rounded bg-red-50 text-destructive">
                    <Wallet class="w-4 h-4" />
                  </div>
                  <span class="text-sm font-medium">{{ expense.number }}</span>
                </div>
              </td>
              <td class="py-3 px-4 text-sm">{{ expense.description }}</td>
              <td class="py-3 px-4 text-sm text-muted-foreground">
                {{ expense.vendor }}
              </td>
              <td class="py-3 px-4 text-sm text-muted-foreground">
                {{ expense.date }}
              </td>
              <td class="py-3 px-4 text-sm font-medium text-destructive">
                {{ expense.amount }}
              </td>
              <td class="py-3 px-4">
                <span
                  class="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground border"
                >
                  {{ expense.category }}
                </span>
              </td>
              <td class="py-3 px-4 text-right">
                <button class="text-muted-foreground hover:text-foreground">
                  <MoreVertical class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Grid View -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="expense in expenses"
        :key="expense.id"
        class="border border-border rounded-xl bg-white p-5 hover:shadow-sm transition-shadow cursor-pointer"
        @click="navigateTo(`/finance/expenses/${expense.id}`)"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-start gap-4">
            <div
              class="w-12 h-12 rounded-lg bg-red-50 text-destructive flex items-center justify-center shrink-0"
            >
              <Wallet class="w-6 h-6" />
            </div>
            <div>
              <h3 class="font-bold text-base text-foreground">
                {{ expense.number }}
              </h3>
              <p class="text-xs text-muted-foreground">{{ expense.date }}</p>
            </div>
          </div>
          <button class="text-muted-foreground hover:text-foreground" @click.stop>
            <MoreVertical class="w-4 h-4" />
          </button>
        </div>

        <div class="space-y-3 mb-4">
          <div>
            <p class="text-xs text-muted-foreground mb-1">Description</p>
            <p class="text-sm font-medium line-clamp-2">{{ expense.description }}</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground mb-1">Vendor</p>
            <p class="text-sm font-medium">{{ expense.vendor }}</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground mb-1">Amount</p>
            <p class="text-lg font-bold text-destructive">{{ expense.amount }}</p>
          </div>
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-border">
          <span class="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground border">
            {{ expense.category }}
          </span>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between text-sm text-muted-foreground">
      <p>{{ expenses.length }} data found.</p>
      <div class="flex items-center gap-2">
        <button class="p-1 hover:text-foreground disabled:opacity-50">
          <ChevronLeft class="w-4 h-4" />
          <span class="sr-only">Previous</span>
        </button>
        <button
          class="w-8 h-8 flex items-center justify-center rounded border border-border bg-white text-foreground font-medium"
        >
          1
        </button>
        <span class="px-1">...</span>
        <button class="flex items-center gap-1 hover:text-foreground">
          Next
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>
