<script setup lang="ts">
import {
  Plus,
  Search,
  Calculator,
  Eye,
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

interface TaxRecord {
  id: string;
  number: string;
  type: "ppn" | "pph";
  period: string;
  amount: string;
  status: "reported" | "pending" | "paid";
}

const taxRecords: TaxRecord[] = [
  {
    id: "1",
    number: "TAX-2024-001",
    type: "ppn",
    period: "Januari 2025",
    amount: "Rp 5.500.000",
    status: "pending",
  },
  {
    id: "2",
    number: "TAX-2024-002",
    type: "pph",
    period: "Januari 2025",
    amount: "Rp 2.250.000",
    status: "reported",
  },
  {
    id: "3",
    number: "TAX-2024-003",
    type: "ppn",
    period: "Desember 2024",
    amount: "Rp 4.800.000",
    status: "paid",
  },
];

const statusConfig: Record<TaxRecord["status"], { label: string; class: string }> = {
  pending: { label: "Pending", class: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  reported: { label: "Dilaporkan", class: "bg-green-50 text-green-700 border-green-200" },
  paid: { label: "Dibayar", class: "bg-gray-100 text-gray-700 border-gray-200" },
};

const typeConfig: Record<TaxRecord["type"], string> = {
  ppn: "PPN",
  pph: "PPh",
};

type ViewMode = "list" | "grid";
const viewMode = ref<ViewMode>("list");
</script>

<template>
  <div class="space-y-6 animate-fade-in pb-10">
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
          type="text"
          placeholder="Cari pajak..."
          class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
        />
      </div>

      <div class="flex items-center gap-3">
        <select
          class="px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">Semua Tipe</option>
          <option value="ppn">PPN</option>
          <option value="pph">PPh</option>
        </select>
        <select
          class="px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="reported">Dilaporkan</option>
          <option value="paid">Dibayar</option>
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

    <!-- List View -->
    <div
      v-if="viewMode === 'list'"
      class="border border-border rounded-xl bg-white overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border bg-white text-left">
              <th class="py-3 px-4 text-sm font-medium text-foreground">No. Pajak</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">Tipe</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">Periode</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">Jumlah</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">Status</th>
              <th class="py-3 px-4 w-10"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="tax in taxRecords"
              :key="tax.id"
              class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
              @click="navigateTo(`/finance/tax/${tax.id}`)"
            >
              <td class="py-3 px-4">
                <div class="flex items-center gap-2">
                  <div class="p-1.5 rounded bg-blue-50 text-[#012D5A]">
                    <Calculator class="w-4 h-4" />
                  </div>
                  <span class="text-sm font-medium">{{ tax.number }}</span>
                </div>
              </td>
              <td class="py-3 px-4">
                <span
                  class="text-xs font-medium uppercase bg-muted px-2 py-0.5 rounded-full text-muted-foreground border"
                  >{{ typeConfig[tax.type] }}</span
                >
              </td>
              <td class="py-3 px-4 text-sm text-muted-foreground">
                {{ tax.period }}
              </td>
              <td class="py-3 px-4 text-sm font-medium">{{ tax.amount }}</td>
              <td class="py-3 px-4">
                <span
                  :class="
                    cn(
                      'px-2 py-0.5 rounded border text-xs font-medium',
                      statusConfig[tax.status]?.class,
                    )
                  "
                >
                  {{ statusConfig[tax.status]?.label }}
                </span>
              </td>
              <td class="py-3 px-4 text-right">
                <button class="p-1.5 rounded hover:bg-muted transition-colors" @click.stop>
                  <Eye class="w-4 h-4 text-muted-foreground" />
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
        v-for="tax in taxRecords"
        :key="tax.id"
        class="border border-border rounded-xl bg-white p-5 hover:shadow-sm transition-shadow cursor-pointer"
        @click="navigateTo(`/finance/tax/${tax.id}`)"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-start gap-4">
            <div
              class="w-12 h-12 rounded-lg bg-blue-50 text-[#012D5A] flex items-center justify-center shrink-0"
            >
              <Calculator class="w-6 h-6" />
            </div>
            <div>
              <h3 class="font-bold text-base text-foreground">{{ tax.number }}</h3>
              <p class="text-xs text-muted-foreground">{{ tax.period }}</p>
            </div>
          </div>
          <button class="text-muted-foreground hover:text-foreground" @click.stop>
            <MoreVertical class="w-4 h-4" />
          </button>
        </div>

        <div class="space-y-4 mb-4">
          <div>
            <p class="text-xs text-muted-foreground mb-1">Pajak</p>
            <span
              class="text-xs font-medium uppercase bg-muted px-2 py-0.5 rounded-full text-muted-foreground border"
              >{{ typeConfig[tax.type] }}</span
            >
          </div>

          <div>
            <p class="text-xs text-muted-foreground mb-1">Status</p>
            <span
              :class="
                cn(
                  'px-2 py-0.5 rounded border text-xs font-medium',
                  statusConfig[tax.status]?.class,
                )
              "
            >
              {{ statusConfig[tax.status]?.label }}
            </span>
          </div>

          <div class="pt-3 border-t border-border">
            <p class="text-xs text-muted-foreground mb-1">Amount</p>
            <p class="text-lg font-bold text-[#012D5A]">{{ tax.amount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between text-sm text-muted-foreground">
      <p>{{ taxRecords.length }} data found.</p>
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
