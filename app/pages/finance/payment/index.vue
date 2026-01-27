<script setup lang="ts">
import {
    Plus,
    Search,
    CreditCard,
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

const payments = [
    {
        id: "1",
        number: "PAY-2024-001",
        invoice: "INV-2024-0891",
        customer: "CV Sukses Makmur",
        date: "6 Jan 2025",
        amount: "Rp 18.250.000",
        method: "Bank Transfer",
    },
    {
        id: "2",
        number: "PAY-2024-002",
        invoice: "INV-2024-0889",
        customer: "PT Indo Global",
        date: "5 Jan 2025",
        amount: "Rp 12.500.000",
        method: "Bank Transfer",
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
                <h1 class="text-2xl font-bold">Pembayaran</h1>
                <p class="text-muted-foreground mt-1">Catat pembayaran dari customer</p>
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
                                    : 'text-muted-foreground hover:bg-muted'
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
                                    : 'text-muted-foreground hover:bg-muted'
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
                <Search
                    class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                />
                <input
                    type="text"
                    placeholder="Cari pembayaran..."
                    class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
                />
            </div>

            <div class="flex items-center gap-3">
                <NuxtLink
                    to="/finance/payment/create"
                    class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap"
                >
                    <Plus class="w-4 h-4" />
                    <span>Catat Pembayaran</span>
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
                            <th class="py-3 px-4 text-sm font-medium text-foreground">
                                No. Pembayaran
                            </th>
                            <th class="py-3 px-4 text-sm font-medium text-foreground">
                                No. Invoice
                            </th>
                            <th class="py-3 px-4 text-sm font-medium text-foreground">Customer</th>
                            <th class="py-3 px-4 text-sm font-medium text-foreground">Tanggal</th>
                            <th class="py-3 px-4 text-sm font-medium text-foreground">Jumlah</th>
                            <th class="py-3 px-4 text-sm font-medium text-foreground">Metode</th>
                            <th class="py-3 px-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="payment in payments"
                            :key="payment.id"
                            class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                            @click="navigateTo(`/finance/payment/${payment.id}`)"
                        >
                            <td class="py-3 px-4">
                                <div class="flex items-center gap-2">
                                    <div class="p-1.5 rounded bg-green-50 text-success">
                                        <CreditCard class="w-4 h-4" />
                                    </div>
                                    <span class="text-sm font-medium">{{ payment.number }}</span>
                                </div>
                            </td>
                            <td class="py-3 px-4 text-sm text-muted-foreground">
                                {{ payment.invoice }}
                            </td>
                            <td class="py-3 px-4 text-sm">{{ payment.customer }}</td>
                            <td class="py-3 px-4 text-sm text-muted-foreground">
                                {{ payment.date }}
                            </td>
                            <td class="py-3 px-4 text-sm font-medium text-success">
                                {{ payment.amount }}
                            </td>
                            <td class="py-3 px-4 text-sm text-muted-foreground">
                                {{ payment.method }}
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
                v-for="payment in payments"
                :key="payment.id"
                class="border border-border rounded-xl bg-white p-5 hover:shadow-sm transition-shadow cursor-pointer"
                @click="navigateTo(`/finance/payment/${payment.id}`)"
            >
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-start gap-4">
                        <div
                            class="w-12 h-12 rounded-lg bg-green-50 text-success flex items-center justify-center shrink-0"
                        >
                            <CreditCard class="w-6 h-6" />
                        </div>
                        <div>
                            <h3 class="font-bold text-base text-foreground">
                                {{ payment.number }}
                            </h3>
                            <p class="text-xs text-muted-foreground">{{ payment.invoice }}</p>
                        </div>
                    </div>
                    <button class="text-muted-foreground hover:text-foreground" @click.stop>
                        <MoreVertical class="w-4 h-4" />
                    </button>
                </div>

                <div class="space-y-4 mb-4">
                    <div>
                        <p class="text-xs text-muted-foreground mb-1">Customer</p>
                        <p class="text-sm font-medium">{{ payment.customer }}</p>
                    </div>
                    <div>
                        <p class="text-xs text-muted-foreground mb-1">Method</p>
                        <p class="text-sm font-medium">{{ payment.method }}</p>
                    </div>

                    <div class="pt-3 border-t border-border">
                        <p class="text-xs text-muted-foreground mb-1">Amount</p>
                        <p class="text-lg font-bold text-success">{{ payment.amount }}</p>
                    </div>
                </div>
                <div class="flex items-center justify-between pt-4 border-t border-border">
                    <span class="text-xs text-muted-foreground">{{ payment.date }}</span>
                </div>
            </div>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between text-sm text-muted-foreground">
            <p>{{ payments.length }} data found.</p>
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
