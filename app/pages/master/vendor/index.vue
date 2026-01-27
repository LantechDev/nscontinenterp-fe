<script setup lang="ts">
import {
    Plus,
    Search,
    MoreVertical,
    Building2,
    Mail,
    Phone,
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

const vendors = ref([
    {
        id: "1",
        name: "PT Pelayaran Nusantara",
        code: "VND-001",
        email: "ops@pelayanusantara.co.id",
        phone: "+62 21 5551234",
        type: "Shipping Line",
        status: "Active",
        selected: false,
    },
    {
        id: "2",
        name: "CV Trucking Mandiri",
        code: "VND-002",
        email: "admin@truckingmandiri.com",
        phone: "+62 31 7771234",
        type: "Trucking",
        status: "Active",
        selected: false,
    },
    {
        id: "3",
        name: "PT Bea Cukai Partner",
        code: "VND-003",
        email: "contact@bcpartner.id",
        phone: "+62 21 8881234",
        type: "Customs",
        status: "Active",
        selected: false,
    },
]);

const selectAll = computed({
    get: () => vendors.value.length > 0 && vendors.value.every((v) => v.selected),
    set: (val) => vendors.value.forEach((v) => (v.selected = val)),
});
</script>

<template>
    <div class="space-y-6 animate-fade-in pb-10">
        <!-- Page header -->
        <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold">Vendor</h1>

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
                    placeholder="Search Vendor..."
                    class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
                />
            </div>

            <div class="flex items-center gap-3">
                <button
                    class="flex items-center justify-between gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors min-w-[140px] text-foreground"
                >
                    <span>Select Type</span>
                    <ChevronDown class="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                    @click="isCreateOpen = true"
                    class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap"
                >
                    <Plus class="w-4 h-4" />
                    <span>New Vendor</span>
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
                            <th class="py-3 px-4 text-sm font-medium text-foreground">
                                No. Vendor
                            </th>
                            <th class="py-3 px-4 text-sm font-medium text-foreground">Vendor</th>
                            <th class="py-3 px-4 text-sm font-medium text-foreground">Email</th>
                            <th class="py-3 px-4 text-sm font-medium text-foreground">Phone</th>
                            <th class="py-3 px-4 text-sm font-medium text-foreground">Type</th>
                            <th class="py-3 px-4 text-sm font-medium text-foreground">Status</th>
                            <th class="py-3 px-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="vendor in vendors"
                            :key="vendor.id"
                            class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                            @click="navigateTo(`/master/vendor/${vendor.id}`)"
                        >
                            <td class="py-3 px-4" @click.stop>
                                <UiCheckbox v-model="vendor.selected" />
                            </td>
                            <td class="py-3 px-4 text-sm font-medium">{{ vendor.code }}</td>
                            <td class="py-3 px-4 text-sm font-medium">{{ vendor.name }}</td>
                            <td class="py-3 px-4 text-sm font-normal">{{ vendor.email }}</td>
                            <td class="py-3 px-4 text-sm font-normal">{{ vendor.phone }}</td>
                            <td class="py-3 px-4">
                                <span
                                    class="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-medium"
                                >
                                    {{ vendor.type }}
                                </span>
                            </td>
                            <td class="py-3 px-4">
                                <span
                                    :class="
                                        cn(
                                            'px-2 py-0.5 rounded border text-xs font-medium bg-white',
                                            vendor.status === 'Active'
                                                ? 'text-blue-500 border-blue-200'
                                                : 'text-red-500 border-red-200'
                                        )
                                    "
                                >
                                    {{ vendor.status }}
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
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            <div
                v-for="vendor in vendors"
                :key="vendor.id"
                class="border border-border rounded-xl bg-white p-5 hover:shadow-sm transition-shadow cursor-pointer"
                @click="navigateTo(`/master/vendor/${vendor.id}`)"
            >
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-start gap-4">
                        <div
                            class="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0"
                        >
                            <Building2 class="w-6 h-6 text-[#012D5A]" />
                        </div>
                        <div>
                            <h3 class="font-bold text-base text-foreground">{{ vendor.name }}</h3>
                            <p class="text-xs text-muted-foreground">{{ vendor.code }}</p>
                        </div>
                    </div>
                    <button class="text-muted-foreground hover:text-foreground" @click.stop>
                        <MoreVertical class="w-4 h-4" />
                    </button>
                </div>

                <div class="space-y-2 mb-6">
                    <div class="flex items-center gap-3 text-sm text-gray-600">
                        <Mail class="w-4 h-4" />
                        <span>{{ vendor.email }}</span>
                    </div>
                    <div class="flex items-center gap-3 text-sm text-gray-600">
                        <Phone class="w-4 h-4" />
                        <span>{{ vendor.phone }}</span>
                    </div>
                </div>

                <div class="flex items-center justify-between pt-4 border-t border-border">
                    <span class="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-medium">{{
                        vendor.type
                    }}</span>
                    <span
                        :class="
                            cn(
                                'px-2 py-0.5 rounded border text-xs font-medium bg-white',
                                vendor.status === 'Active'
                                    ? 'text-blue-500 border-blue-200'
                                    : 'text-red-500 border-red-200'
                            )
                        "
                    >
                        {{ vendor.status }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between text-sm text-muted-foreground">
            <p>{{ vendors.length }} data found.</p>
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
            title="Add new Vendor"
            description="Register your new Vendor"
            width="max-w-4xl"
        >
            <form class="space-y-6">
                <!-- Vendor Detail -->
                <div>
                    <h3 class="text-base font-bold text-foreground mb-4">Vendor Detail</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-1.5">
                            <label class="text-sm font-medium text-foreground"
                                >Vendor Code <span class="text-red-500">*</span></label
                            >
                            <input
                                type="text"
                                placeholder="VND-XXX"
                                class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-sm font-medium text-foreground"
                                >Name <span class="text-red-500">*</span></label
                            >
                            <input
                                type="text"
                                placeholder="Input name"
                                class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-sm font-medium text-foreground"
                                >Email <span class="text-red-500">*</span></label
                            >
                            <input
                                type="email"
                                placeholder="Input email"
                                class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-sm font-medium text-foreground"
                                >Phone number <span class="text-red-500">*</span></label
                            >
                            <div class="flex gap-2">
                                <select
                                    class="w-24 px-2 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    <option>US</option>
                                    <option>ID</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="+1 (333) 000-0000"
                                    class="flex-1 px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-sm font-medium text-foreground"
                                >Type <span class="text-red-500">*</span></label
                            >
                            <div class="relative">
                                <select
                                    class="w-full px-3 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                                >
                                    <option value="" disabled selected>Select Type</option>
                                    <option value="shipping">Shipping Line</option>
                                    <option value="trucking">Trucking</option>
                                    <option value="customs">Customs</option>
                                </select>
                                <ChevronDown
                                    class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
                                />
                            </div>
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-sm font-medium text-foreground"
                                >Status <span class="text-red-500">*</span></label
                            >
                            <div class="relative">
                                <select
                                    class="w-full px-3 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                                <ChevronDown
                                    class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="border-t border-border"></div>

                <!-- Address -->
                <div>
                    <h3 class="text-base font-bold text-foreground mb-4">Address</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-1.5">
                            <label class="text-sm font-medium text-foreground"
                                >Country <span class="text-red-500">*</span></label
                            >
                            <input
                                type="text"
                                placeholder="Input country"
                                class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-sm font-medium text-foreground"
                                >City <span class="text-red-500">*</span></label
                            >
                            <input
                                type="text"
                                placeholder="Input city"
                                class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-sm font-medium text-foreground"
                                >Street/ P.O. Box <span class="text-red-500">*</span></label
                            >
                            <div class="flex gap-2">
                                <select
                                    class="w-24 px-2 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    <option>US</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="+1 (333) 000-0000"
                                    class="flex-1 px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-sm font-medium text-foreground"
                                >Postal/ Zip code <span class="text-red-500">*</span></label
                            >
                            <div class="relative">
                                <select
                                    class="w-full px-3 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                                >
                                    <option value="" disabled selected>Select Type</option>
                                </select>
                                <ChevronDown
                                    class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
                                />
                            </div>
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-sm font-medium text-foreground"
                                >State <span class="text-red-500">*</span></label
                            >
                            <div class="flex gap-2">
                                <select
                                    class="w-24 px-2 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    <option>US</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="+1 (333) 000-0000"
                                    class="flex-1 px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-sm font-medium text-foreground"
                                >EORI No. <span class="text-red-500">*</span></label
                            >
                            <div class="relative">
                                <select
                                    class="w-full px-3 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                                >
                                    <option value="" disabled selected>Select Type</option>
                                </select>
                                <ChevronDown
                                    class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
                                />
                            </div>
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
