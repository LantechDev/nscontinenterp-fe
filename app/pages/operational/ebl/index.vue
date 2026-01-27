<script setup lang="ts">
import {
    Plus,
    Search,
    FileText,
    Download,
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

interface Ebl {
    id: string;
    number: string;
    job: string;
    shipper: string;
    consignee: string;
    status: "issued" | "draft" | "surrendered";
}

const ebls: Ebl[] = [
    {
        id: "1",
        number: "EBL-2024-001",
        job: "JOB-2024-001234",
        shipper: "PT Maju Bersama",
        consignee: "Singapore Trading Co",
        status: "issued",
    },
    {
        id: "2",
        number: "EBL-2024-002",
        job: "JOB-2024-001231",
        shipper: "PT Indo Shipping",
        consignee: "Korea Import Ltd",
        status: "draft",
    },
];

const statusConfig: Record<Ebl["status"], { label: string; class: string }> = {
    draft: { label: "Draft", class: "bg-gray-100 text-gray-700 border-gray-200" },
    issued: { label: "Terbit", class: "bg-green-50 text-green-700 border-green-200" },
    surrendered: { label: "Surrendered", class: "bg-yellow-50 text-yellow-700 border-yellow-200" },
};

type ViewMode = "list" | "grid";
const viewMode = ref<ViewMode>("list");
</script>

<template>
    <div class="space-y-6 animate-fade-in pb-10">
        <!-- Page header -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold">eBL (Electronic Bill of Lading)</h1>
                <p class="text-muted-foreground mt-1">Kelola dokumen eBL</p>
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
                    placeholder="Cari eBL..."
                    class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
                />
            </div>

            <div class="flex items-center gap-3">
                <NuxtLink
                    to="/operational/ebl/create"
                    class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap"
                >
                    <Plus class="w-4 h-4" />
                    <span>Buat eBL</span>
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
                            <th class="py-3 px-4 text-sm font-medium text-foreground">No. eBL</th>
                            <th class="py-3 px-4 text-sm font-medium text-foreground">No. Job</th>
                            <th class="py-3 px-4 text-sm font-medium text-foreground">Shipper</th>
                            <th class="py-3 px-4 text-sm font-medium text-foreground">Consignee</th>
                            <th class="py-3 px-4 text-sm font-medium text-foreground">Status</th>
                            <th class="py-3 px-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="ebl in ebls"
                            :key="ebl.id"
                            class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                            @click="navigateTo(`/operational/ebl/${ebl.id}`)"
                        >
                            <td class="py-3 px-4">
                                <div class="flex items-center gap-2">
                                    <div class="p-1.5 rounded bg-blue-50 text-[#012D5A]">
                                        <FileText class="w-4 h-4" />
                                    </div>
                                    <span class="text-sm font-medium">{{ ebl.number }}</span>
                                </div>
                            </td>
                            <td class="py-3 px-4 text-sm text-muted-foreground">{{ ebl.job }}</td>
                            <td class="py-3 px-4 text-sm">{{ ebl.shipper }}</td>
                            <td class="py-3 px-4 text-sm">{{ ebl.consignee }}</td>
                            <td class="py-3 px-4">
                                <span
                                    :class="
                                        cn(
                                            'px-2 py-0.5 rounded border text-xs font-medium',
                                            statusConfig[ebl.status]?.class
                                        )
                                    "
                                >
                                    {{ statusConfig[ebl.status]?.label }}
                                </span>
                            </td>
                            <td class="py-3 px-4 text-right">
                                <button
                                    class="p-1.5 rounded hover:bg-muted transition-colors"
                                    @click.stop
                                >
                                    <Download class="w-4 h-4 text-muted-foreground" />
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
                v-for="ebl in ebls"
                :key="ebl.id"
                class="border border-border rounded-xl bg-white p-5 hover:shadow-sm transition-shadow cursor-pointer"
                @click="navigateTo(`/operational/ebl/${ebl.id}`)"
            >
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-start gap-4">
                        <div
                            class="w-12 h-12 rounded-lg bg-blue-50 text-[#012D5A] flex items-center justify-center shrink-0"
                        >
                            <FileText class="w-6 h-6" />
                        </div>
                        <div>
                            <h3 class="font-bold text-base text-foreground">{{ ebl.number }}</h3>
                            <p class="text-xs text-muted-foreground">{{ ebl.job }}</p>
                        </div>
                    </div>
                    <button class="text-muted-foreground hover:text-foreground" @click.stop>
                        <MoreVertical class="w-4 h-4" />
                    </button>
                </div>

                <div class="space-y-3 mb-4">
                    <div>
                        <p class="text-xs text-muted-foreground mb-1">Shipper</p>
                        <p class="text-sm font-medium">{{ ebl.shipper }}</p>
                    </div>
                    <div>
                        <p class="text-xs text-muted-foreground mb-1">Consignee</p>
                        <p class="text-sm font-medium">{{ ebl.consignee }}</p>
                    </div>
                </div>

                <div class="flex items-center justify-between pt-4 border-t border-border">
                    <span
                        :class="
                            cn(
                                'px-2 py-0.5 rounded border text-xs font-medium',
                                statusConfig[ebl.status]?.class
                            )
                        "
                    >
                        {{ statusConfig[ebl.status]?.label }}
                    </span>
                    <button class="p-1.5 rounded hover:bg-muted transition-colors" @click.stop>
                        <Download class="w-4 h-4 text-muted-foreground" />
                    </button>
                </div>
            </div>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between text-sm text-muted-foreground">
            <p>{{ ebls.length }} data found.</p>
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
