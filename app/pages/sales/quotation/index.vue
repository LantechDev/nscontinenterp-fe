<script setup lang="ts">
import {
    Plus,
    Search,
    FileText,
    Eye,
    Send,
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

interface Quotation {
    id: string;
    number: string;
    customer: string;
    date: string;
    amount: string;
    status: "sent" | "draft" | "accepted" | "rejected";
}

const quotations: Quotation[] = [
    {
        id: "1",
        number: "QUO-2024-001",
        customer: "PT Maju Bersama",
        date: "7 Jan 2025",
        amount: "Rp 25.500.000",
        status: "sent",
    },
    {
        id: "2",
        number: "QUO-2024-002",
        customer: "CV Sukses Makmur",
        date: "6 Jan 2025",
        amount: "Rp 18.250.000",
        status: "draft",
    },
    {
        id: "3",
        number: "QUO-2024-003",
        customer: "PT Logistik Nusantara",
        date: "5 Jan 2025",
        amount: "Rp 32.000.000",
        status: "accepted",
    },
    {
        id: "4",
        number: "QUO-2024-004",
        customer: "PT Indo Shipping",
        date: "4 Jan 2025",
        amount: "Rp 15.750.000",
        status: "rejected",
    },
];

const statusConfig: Record<Quotation["status"], { label: string; class: string }> = {
    draft: { label: "Draft", class: "bg-gray-100 text-gray-700 border-gray-200" },
    sent: { label: "Terkirim", class: "bg-yellow-50 text-yellow-700 border-yellow-200" },
    accepted: { label: "Diterima", class: "bg-green-50 text-green-700 border-green-200" },
    rejected: { label: "Ditolak", class: "bg-red-50 text-red-700 border-red-200" },
};

type ViewMode = "list" | "grid";
const viewMode = ref<ViewMode>("list");
</script>

<template>
    <div class="space-y-6 animate-fade-in pb-10">
        <!-- Page header -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold">Penawaran</h1>
                <p class="text-muted-foreground mt-1">Kelola quotation dan penawaran harga</p>
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
                    placeholder="Cari penawaran..."
                    class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
                />
            </div>

            <div class="flex items-center gap-3">
                <select
                    class="px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                    <option value="">Semua Status</option>
                    <option value="draft">Draft</option>
                    <option value="sent">Terkirim</option>
                    <option value="accepted">Diterima</option>
                    <option value="rejected">Ditolak</option>
                </select>
                <NuxtLink
                    to="/sales/quotation/create"
                    class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap"
                >
                    <Plus class="w-4 h-4" />
                    <span>Buat Penawaran</span>
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
                                No. Penawaran
                            </th>
                            <th class="py-3 px-4 text-sm font-medium text-foreground">Customer</th>
                            <th class="py-3 px-4 text-sm font-medium text-foreground">Tanggal</th>
                            <th class="py-3 px-4 text-sm font-medium text-foreground">Total</th>
                            <th class="py-3 px-4 text-sm font-medium text-foreground">Status</th>
                            <th class="py-3 px-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="quotation in quotations"
                            :key="quotation.id"
                            class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                            @click="navigateTo(`/sales/quotation/${quotation.id}`)"
                        >
                            <td class="py-3 px-4">
                                <div class="flex items-center gap-2">
                                    <div class="p-1.5 rounded bg-blue-50 text-[#012D5A]">
                                        <FileText class="w-4 h-4" />
                                    </div>
                                    <span class="text-sm font-medium">{{ quotation.number }}</span>
                                </div>
                            </td>
                            <td class="py-3 px-4 text-sm font-medium">{{ quotation.customer }}</td>
                            <td class="py-3 px-4 text-sm text-muted-foreground">
                                {{ quotation.date }}
                            </td>
                            <td class="py-3 px-4 text-sm font-medium">{{ quotation.amount }}</td>
                            <td class="py-3 px-4">
                                <span
                                    :class="
                                        cn(
                                            'px-2 py-0.5 rounded border text-xs font-medium',
                                            statusConfig[quotation.status]?.class
                                        )
                                    "
                                >
                                    {{ statusConfig[quotation.status]?.label }}
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
                v-for="quotation in quotations"
                :key="quotation.id"
                class="border border-border rounded-xl bg-white p-5 hover:shadow-sm transition-shadow cursor-pointer"
                @click="navigateTo(`/sales/quotation/${quotation.id}`)"
            >
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-start gap-4">
                        <div
                            class="w-12 h-12 rounded-lg bg-blue-50 text-[#012D5A] flex items-center justify-center shrink-0"
                        >
                            <FileText class="w-6 h-6" />
                        </div>
                        <div>
                            <h3 class="font-bold text-base text-foreground">
                                {{ quotation.number }}
                            </h3>
                            <p class="text-xs text-muted-foreground">{{ quotation.date }}</p>
                        </div>
                    </div>
                    <button class="text-muted-foreground hover:text-foreground" @click.stop>
                        <MoreVertical class="w-4 h-4" />
                    </button>
                </div>

                <div class="space-y-3 mb-4">
                    <div>
                        <p class="text-xs text-muted-foreground mb-1">Customer</p>
                        <p class="text-sm font-medium">{{ quotation.customer }}</p>
                    </div>
                    <div>
                        <p class="text-xs text-muted-foreground mb-1">Total Amount</p>
                        <p class="text-lg font-bold text-[#012D5A]">{{ quotation.amount }}</p>
                    </div>
                </div>

                <div class="flex items-center justify-between pt-4 border-t border-border">
                    <span
                        :class="
                            cn(
                                'px-2 py-0.5 rounded border text-xs font-medium',
                                statusConfig[quotation.status]?.class
                            )
                        "
                    >
                        {{ statusConfig[quotation.status]?.label }}
                    </span>
                    <div class="flex gap-2">
                        <button
                            class="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                            title="Kirim"
                            @click.stop
                        >
                            <Send class="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between text-sm text-muted-foreground">
            <p>{{ quotations.length }} data found.</p>
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
