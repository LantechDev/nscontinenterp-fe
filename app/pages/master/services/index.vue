<script setup lang="ts">
import {
    Plus,
    Search,
    MoreVertical,
    Package,
    LayoutList,
    LayoutGrid,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Save,
} from "lucide-vue-next";
import { cn } from "~/lib/utils";

definePageMeta({
    layout: "dashboard",
});

type ViewMode = "list" | "grid";
const viewMode = ref<ViewMode>("list");
const isCreateOpen = ref(false);

const services = ref([
    {
        id: "1",
        name: "Ocean Freight - FCL",
        code: "SVC-001",
        price: "Rp 15.000.000",
        unit: "Per Container",
        selected: false,
        status: "Active",
    },
    {
        id: "2",
        name: "Ocean Freight - LCL",
        code: "SVC-002",
        price: "Rp 2.500.000",
        unit: "Per CBM",
        selected: false,
        status: "Active",
    },
    {
        id: "3",
        name: "Trucking - 20ft",
        code: "SVC-003",
        price: "Rp 3.500.000",
        unit: "Per Trip",
        selected: false,
        status: "Active",
    },
    {
        id: "4",
        name: "Customs Clearance",
        code: "SVC-004",
        price: "Rp 1.200.000",
        unit: "Per Shipment",
        selected: false,
        status: "Inactive",
    },
    {
        id: "5",
        name: "Warehousing",
        code: "SVC-005",
        price: "Rp 50.000",
        unit: "Per CBM/Day",
        selected: false,
        status: "Active",
    },
]);

const selectAll = computed({
    get: () => services.value.length > 0 && services.value.every((s) => s.selected),
    set: (val) => services.value.forEach((s) => (s.selected = val)),
});
</script>

<template>
    <div class="space-y-6 animate-fade-in pb-10">
        <!-- Page header -->
        <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold">Services</h1>

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
                    placeholder="Search Service..."
                    class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
                />
            </div>

            <div class="flex items-center gap-3">
                <button
                    class="flex items-center justify-between gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors min-w-[140px] text-foreground"
                >
                    <span>Select Unit</span>
                    <ChevronDown class="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                    @click="isCreateOpen = true"
                    class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap"
                >
                    <Plus class="w-4 h-4" />
                    <span>New Service</span>
                </button>
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
                            <th class="py-3 px-4 w-10">
                                <UiCheckbox v-model="selectAll" />
                            </th>
                            <th class="py-3 px-4 text-sm font-medium text-foreground">Code</th>
                            <th class="py-3 px-4 text-sm font-medium text-foreground">
                                Service Name
                            </th>
                            <th class="py-3 px-4 text-sm font-medium text-foreground">Price</th>
                            <th class="py-3 px-4 text-sm font-medium text-foreground">Unit</th>
                            <th class="py-3 px-4 text-sm font-medium text-foreground">Status</th>
                            <th class="py-3 px-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="service in services"
                            :key="service.id"
                            class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                            @click="navigateTo(`/master/services/${service.id}`)"
                        >
                            <td class="py-3 px-4" @click.stop>
                                <UiCheckbox v-model="service.selected" />
                            </td>
                            <td class="py-3 px-4 text-sm font-medium">{{ service.code }}</td>
                            <td class="py-3 px-4 text-sm font-medium">{{ service.name }}</td>
                            <td class="py-3 px-4 text-sm font-medium">{{ service.price }}</td>
                            <td class="py-3 px-4 text-sm text-muted-foreground">
                                {{ service.unit }}
                            </td>
                            <td class="py-3 px-4">
                                <span
                                    :class="
                                        cn(
                                            'px-2 py-0.5 rounded border text-xs font-medium bg-white',
                                            service.status === 'Active'
                                                ? 'text-blue-500 border-blue-200'
                                                : 'text-red-500 border-red-200'
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
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Grid View -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
                v-for="service in services"
                :key="service.id"
                class="border border-border rounded-xl bg-white p-5 hover:shadow-sm transition-shadow cursor-pointer"
                @click="navigateTo(`/master/services/${service.id}`)"
            >
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-start gap-4">
                        <div
                            class="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0"
                        >
                            <Package class="w-6 h-6 text-[#012D5A]" />
                        </div>
                        <div>
                            <h3 class="font-bold text-base text-foreground">{{ service.name }}</h3>
                            <p class="text-xs text-muted-foreground">{{ service.code }}</p>
                        </div>
                    </div>
                    <button class="text-muted-foreground hover:text-foreground" @click.stop>
                        <MoreVertical class="w-4 h-4" />
                    </button>
                </div>

                <div class="space-y-1 mb-6">
                    <div class="flex items-baseline gap-1">
                        <span class="text-lg font-bold text-foreground">{{ service.price }}</span>
                    </div>
                    <p class="text-xs text-muted-foreground">{{ service.unit }}</p>
                </div>

                <div class="flex items-center justify-between pt-4 border-t border-border">
                    <span
                        :class="
                            cn(
                                'px-2 py-0.5 rounded border text-xs font-medium bg-white',
                                service.status === 'Active'
                                    ? 'text-blue-500 border-blue-200'
                                    : 'text-red-500 border-red-200'
                            )
                        "
                    >
                        {{ service.status }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between text-sm text-muted-foreground">
            <p>{{ services.length }} data found.</p>
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
                <button
                    class="w-8 h-8 flex items-center justify-center rounded hover:bg-muted text-muted-foreground"
                >
                    2
                </button>
                <button
                    class="w-8 h-8 flex items-center justify-center rounded hover:bg-muted text-muted-foreground"
                >
                    3
                </button>
                <span class="px-1">...</span>
                <button class="flex items-center gap-1 hover:text-foreground">
                    Next
                    <ChevronRight class="w-4 h-4" />
                </button>
            </div>
        </div>

        <!-- Create Modal -->
        <UiModal
            v-model="isCreateOpen"
            title="Add new Service"
            description="Register your new Service"
            width="max-w-xl"
        >
            <form class="space-y-4">
                <div class="space-y-1.5">
                    <label class="text-sm font-medium text-foreground"
                        >Service Name <span class="text-red-500">*</span></label
                    >
                    <input
                        type="text"
                        placeholder="e.g. Ocean Freight"
                        class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-1.5">
                        <label class="text-sm font-medium text-foreground"
                            >Code <span class="text-red-500">*</span></label
                        >
                        <input
                            type="text"
                            placeholder="SVC-XXX"
                            class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <div class="space-y-1.5">
                        <label class="text-sm font-medium text-foreground"
                            >Status <span class="text-red-500">*</span></label
                        >
                        <div class="relative">
                            <select
                                class="w-full px-3 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                            <ChevronDown
                                class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
                            />
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-1.5">
                        <label class="text-sm font-medium text-foreground"
                            >Price <span class="text-red-500">*</span></label
                        >
                        <input
                            type="text"
                            placeholder="Rp 0"
                            class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <div class="space-y-1.5">
                        <label class="text-sm font-medium text-foreground"
                            >Unit <span class="text-red-500">*</span></label
                        >
                        <div class="relative">
                            <select
                                class="w-full px-3 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                            >
                                <option>Per Container</option>
                                <option>Per CBM</option>
                                <option>Per Trip</option>
                            </select>
                            <ChevronDown
                                class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
                            />
                        </div>
                    </div>
                </div>
            </form>

            <template #footer>
                <button
                    type="button"
                    @click="isCreateOpen = false"
                    class="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg text-foreground hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white rounded-lg hover:bg-[#012D5A]/90 transition-colors"
                >
                    <Save class="w-4 h-4" />
                    Save
                </button>
            </template>
        </UiModal>
    </div>
</template>
