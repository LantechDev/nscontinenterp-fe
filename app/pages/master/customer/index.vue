<script setup lang="ts">
import {
    Plus,
    Search,
    MoreVertical,
    Building2,
    Mail,
    Phone,
} from "lucide-vue-next";

definePageMeta({
    layout: "dashboard",
});

const customers = [
    {
        id: "1",
        name: "PT Maju Bersama",
        code: "CUST-001",
        email: "finance@majubersama.co.id",
        phone: "+62 21 5551234",
        address: "Jl. Sudirman No. 123, Jakarta Pusat",
        type: "Shipper",
        status: "active",
        totalJobs: 45,
    },
    {
        id: "2",
        name: "CV Sukses Makmur",
        code: "CUST-002",
        email: "admin@suksesmakmur.com",
        phone: "+62 31 7771234",
        address: "Jl. Pemuda No. 45, Surabaya",
        type: "Consignee",
        status: "active",
        totalJobs: 32,
    },
    {
        id: "3",
        name: "PT Logistik Nusantara",
        code: "CUST-003",
        email: "ops@logistiknusantara.id",
        phone: "+62 24 8881234",
        address: "Jl. MT Haryono No. 78, Semarang",
        type: "Shipper",
        status: "active",
        totalJobs: 28,
    },
    {
        id: "4",
        name: "PT Indo Shipping",
        code: "CUST-004",
        email: "contact@indoshipping.co.id",
        phone: "+62 21 6661234",
        address: "Jl. Tanjung Priok No. 90, Jakarta Utara",
        type: "Both",
        status: "inactive",
        totalJobs: 15,
    },
];
</script>

<template>
    <div class="space-y-6 animate-fade-in">
        <!-- Page header -->
        <div class="page-header">
            <div>
                <h1 class="page-title">Customer</h1>
                <p class="text-muted-foreground mt-1">
                    Kelola data customer dan shipper/consignee
                </p>
            </div>
            <NuxtLink to="/master/customer/create" class="btn-primary">
                <Plus class="w-4 h-4 mr-2" />
                Tambah Customer
            </NuxtLink>
        </div>

        <!-- Filters -->
        <div class="card-elevated p-4">
            <div class="flex flex-col sm:flex-row gap-4">
                <div class="relative flex-1">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="text" placeholder="Cari customer..." class="input-field pl-10" />
                </div>
                <div class="flex gap-2">
                    <select class="input-field w-40">
                        <option value="">Semua Tipe</option>
                        <option value="shipper">Shipper</option>
                        <option value="consignee">Consignee</option>
                        <option value="both">Keduanya</option>
                    </select>
                    <select class="input-field w-36">
                        <option value="">Semua Status</option>
                        <option value="active">Aktif</option>
                        <option value="inactive">Tidak Aktif</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Customer cards -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <NuxtLink v-for="customer in customers" :key="customer.id" :to="`/master/customer/${customer.id}`"
                class="card-elevated p-5 hover:shadow-lg transition-shadow duration-200 block">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Building2 class="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 class="font-semibold text-foreground">
                                {{ customer.name }}
                            </h3>
                            <p class="text-sm text-muted-foreground">
                                {{ customer.code }}
                            </p>
                        </div>
                    </div>
                    <button class="p-2 rounded-lg hover:bg-muted transition-colors" @click.prevent>
                        <MoreVertical class="w-4 h-4 text-muted-foreground" />
                    </button>
                </div>

                <div class="space-y-2 mb-4">
                    <div class="flex items-center gap-2 text-sm">
                        <Mail class="w-4 h-4 text-muted-foreground" />
                        <span class="text-muted-foreground">{{ customer.email }}</span>
                    </div>
                    <div class="flex items-center gap-2 text-sm">
                        <Phone class="w-4 h-4 text-muted-foreground" />
                        <span class="text-muted-foreground">{{ customer.phone }}</span>
                    </div>
                </div>

                <div class="flex items-center justify-between pt-4 border-t border-border">
                    <div class="flex items-center gap-3">
                        <span :class="[
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                            customer.status === 'active'
                                ? 'badge-success'
                                : 'bg-muted text-muted-foreground',
                        ]">
                            {{ customer.status === "active" ? "Aktif" : "Tidak Aktif" }}
                        </span>
                        <span class="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            {{ customer.type }}
                        </span>
                    </div>
                    <div class="text-right">
                        <p class="text-sm font-medium text-foreground">
                            {{ customer.totalJobs }}
                        </p>
                        <p class="text-xs text-muted-foreground">Total Job</p>
                    </div>
                </div>
            </NuxtLink>
        </div>
    </div>
</template>
