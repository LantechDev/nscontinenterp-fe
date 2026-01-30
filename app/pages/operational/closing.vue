<script setup lang="ts">
import {
    Search,
    CheckCircle,
    Clock,
    LayoutList,
    LayoutGrid,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    ArrowRight,
    TrendingUp,
    TrendingDown,
    DollarSign,
} from "lucide-vue-next";
import { cn } from "~/lib/utils";

definePageMeta({
    layout: "dashboard",
});

const closingJobs = [
    {
        id: "1",
        jobId: "3",
        number: "JOB-2024-001232",
        customer: "PT Logistik Nusantara",
        totalRevenue: "Rp 32.500.000",
        totalCost: "Rp 24.200.000",
        profit: "Rp 8.300.000",
        status: "closed",
    },
    {
        id: "2",
        jobId: "4",
        number: "JOB-2024-001230",
        customer: "PT Maju Bersama",
        totalRevenue: "Rp 28.000.000",
        totalCost: "Rp 21.500.000",
        profit: "Rp 6.500.000",
        status: "pending",
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
                <h1 class="text-2xl font-bold">Closing Job</h1>
                <p class="text-muted-foreground mt-1">Tutup job dan hitung profit</p>
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
                    placeholder="Cari job untuk closing..."
                    class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
                />
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
                            <th class="py-3 px-4 text-sm font-medium text-foreground">No. Job</th>
                            <th class="py-3 px-4 text-sm font-medium text-foreground">Customer</th>
                            <th class="py-3 px-4 text-sm font-medium text-foreground">
                                Total Revenue
                            </th>
                            <th class="py-3 px-4 text-sm font-medium text-foreground">
                                Total Cost
                            </th>
                            <th class="py-3 px-4 text-sm font-medium text-foreground">Profit</th>
                            <th class="py-3 px-4 text-sm font-medium text-foreground">Status</th>
                            <th class="py-3 px-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="job in closingJobs"
                            :key="job.id"
                            class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                            @click="navigateTo(`/operational/jobs/${job.jobId}`)"
                        >
                            <td class="py-3 px-4">
                                <span class="text-sm font-medium">{{ job.number }}</span>
                            </td>
                            <td class="py-3 px-4 text-sm">{{ job.customer }}</td>
                            <td class="py-3 px-4 text-sm text-green-600 font-medium">
                                {{ job.totalRevenue }}
                            </td>
                            <td class="py-3 px-4 text-sm text-red-600 font-medium">
                                {{ job.totalCost }}
                            </td>
                            <td class="py-3 px-4 text-sm text-[#012D5A] font-bold">
                                {{ job.profit }}
                            </td>
                            <td class="py-3 px-4">
                                <span
                                    v-if="job.status === 'closed'"
                                    class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200"
                                >
                                    <CheckCircle class="w-3 h-3" /> Closed
                                </span>
                                <span
                                    v-else
                                    class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200"
                                >
                                    <Clock class="w-3 h-3" /> Pending
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
                v-for="job in closingJobs"
                :key="job.id"
                class="border border-border rounded-xl bg-white p-5 hover:shadow-sm transition-shadow cursor-pointer"
                @click="navigateTo(`/operational/jobs/${job.jobId}`)"
            >
                <div class="flex items-start justify-between mb-4">
                    <div>
                        <h3 class="font-bold text-base text-foreground">{{ job.number }}</h3>
                        <p class="text-xs text-muted-foreground">{{ job.customer }}</p>
                    </div>
                    <button class="text-muted-foreground hover:text-foreground" @click.stop>
                        <MoreVertical class="w-4 h-4" />
                    </button>
                </div>

                <div class="space-y-4 mb-4">
                    <div class="grid grid-cols-2 gap-2 text-sm">
                        <div class="space-y-1">
                            <p class="text-xs text-muted-foreground">Revenue</p>
                            <p class="font-medium text-green-600">{{ job.totalRevenue }}</p>
                        </div>
                        <div class="space-y-1">
                            <p class="text-xs text-muted-foreground">Cost</p>
                            <p class="font-medium text-red-600">{{ job.totalCost }}</p>
                        </div>
                    </div>
                    <div class="pt-3 border-t border-border">
                        <div class="flex items-center justify-between">
                            <p class="text-sm font-medium text-muted-foreground">Profit</p>
                            <p class="text-lg font-bold text-[#012D5A]">{{ job.profit }}</p>
                        </div>
                    </div>
                </div>

                <div class="flex items-center justify-between pt-4 border-t border-border">
                    <span
                        v-if="job.status === 'closed'"
                        class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200"
                    >
                        <CheckCircle class="w-3 h-3" /> Closed
                    </span>
                    <span
                        v-else
                        class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200"
                    >
                        <Clock class="w-3 h-3" /> Pending
                    </span>
                </div>
            </div>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between text-sm text-muted-foreground">
            <p>{{ closingJobs.length }} data found.</p>
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
