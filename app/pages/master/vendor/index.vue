<script setup lang="ts">
import { Plus, Search, MoreVertical, Building2, Mail, Phone } from "lucide-vue-next";

definePageMeta({
    layout: "dashboard",
});

const vendors = [
    {
        id: "1",
        name: "PT Pelayaran Nusantara",
        code: "VND-001",
        email: "ops@pelayanusantara.co.id",
        phone: "+62 21 5551234",
        type: "Shipping Line",
        status: "active",
    },
    {
        id: "2",
        name: "CV Trucking Mandiri",
        code: "VND-002",
        email: "admin@truckingmandiri.com",
        phone: "+62 31 7771234",
        type: "Trucking",
        status: "active",
    },
    {
        id: "3",
        name: "PT Bea Cukai Partner",
        code: "VND-003",
        email: "contact@bcpartner.id",
        phone: "+62 21 8881234",
        type: "Customs",
        status: "active",
    },
];
</script>

<template>
    <div class="space-y-6 animate-fade-in">
        <div class="page-header">
            <div>
                <h1 class="page-title">Vendor</h1>
                <p class="text-muted-foreground mt-1">
                    Kelola data vendor dan supplier
                </p>
            </div>
            <NuxtLink to="/master/vendor/create" class="btn-primary">
                <Plus class="w-4 h-4 mr-2" />
                Tambah Vendor
            </NuxtLink>
        </div>

        <div class="card-elevated p-4">
            <div class="flex flex-col sm:flex-row gap-4">
                <div class="relative flex-1">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="text" placeholder="Cari vendor..." class="input-field pl-10" />
                </div>
                <select class="input-field w-40">
                    <option value="">Semua Tipe</option>
                    <option value="shipping">Shipping Line</option>
                    <option value="trucking">Trucking</option>
                    <option value="customs">Customs</option>
                </select>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <NuxtLink v-for="vendor in vendors" :key="vendor.id" :to="`/master/vendor/${vendor.id}`"
                class="card-elevated p-5 hover:shadow-lg transition-shadow duration-200 block">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                            <Building2 class="w-6 h-6 text-accent" />
                        </div>
                        <div>
                            <h3 class="font-semibold text-foreground">{{ vendor.name }}</h3>
                            <p class="text-sm text-muted-foreground">{{ vendor.code }}</p>
                        </div>
                    </div>
                    <button class="p-2 rounded-lg hover:bg-muted transition-colors" @click.prevent>
                        <MoreVertical class="w-4 h-4 text-muted-foreground" />
                    </button>
                </div>

                <div class="space-y-2 mb-4">
                    <div class="flex items-center gap-2 text-sm">
                        <Mail class="w-4 h-4 text-muted-foreground" />
                        <span class="text-muted-foreground">{{ vendor.email }}</span>
                    </div>
                    <div class="flex items-center gap-2 text-sm">
                        <Phone class="w-4 h-4 text-muted-foreground" />
                        <span class="text-muted-foreground">{{ vendor.phone }}</span>
                    </div>
                </div>

                <div class="flex items-center justify-between pt-4 border-t border-border">
                    <span class="badge-success">Aktif</span>
                    <span class="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {{ vendor.type }}
                    </span>
                </div>
            </NuxtLink>
        </div>
    </div>
</template>
