<script setup lang="ts">
import { ArrowLeft, Edit, Building2, Mail, Phone } from "lucide-vue-next";

definePageMeta({
    layout: "dashboard",
});

const route = useRoute();
const vendorId = route.params.id;

const vendor = {
    id: vendorId,
    name: "PT Pelayaran Nusantara",
    code: "VND-001",
    email: "ops@pelayanusantara.co.id",
    phone: "+62 21 5551234",
    type: "Shipping Line",
    status: "active",
    createdAt: "10 Des 2024",
};
</script>

<template>
    <div class="space-y-6 animate-fade-in">
        <div class="page-header">
            <div class="flex items-center gap-4">
                <NuxtLink
                    to="/master/vendor"
                    class="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                    <ArrowLeft class="w-5 h-5" />
                </NuxtLink>
                <div>
                    <h1 class="page-title">{{ vendor.name }}</h1>
                    <p class="text-muted-foreground mt-1">Detail vendor</p>
                </div>
            </div>
            <button class="btn-secondary">
                <Edit class="w-4 h-4 mr-2" />
                Edit
            </button>
        </div>

        <div class="card-elevated p-6">
            <div class="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <div class="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Building2 class="w-7 h-7 text-accent" />
                </div>
                <div>
                    <h2 class="text-xl font-semibold">{{ vendor.name }}</h2>
                    <p class="text-muted-foreground">{{ vendor.code }}</p>
                </div>
                <div class="ml-auto flex items-center gap-2">
                    <span class="badge-success">Aktif</span>
                    <span class="text-xs bg-muted px-2 py-0.5 rounded-full">{{ vendor.type }}</span>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-1">
                    <p class="text-sm text-muted-foreground flex items-center gap-2">
                        <Mail class="w-4 h-4" /> Email
                    </p>
                    <p class="font-medium">{{ vendor.email }}</p>
                </div>
                <div class="space-y-1">
                    <p class="text-sm text-muted-foreground flex items-center gap-2">
                        <Phone class="w-4 h-4" /> Telepon
                    </p>
                    <p class="font-medium">{{ vendor.phone }}</p>
                </div>
                <div class="space-y-1">
                    <p class="text-sm text-muted-foreground">Tanggal Registrasi</p>
                    <p class="font-medium">{{ vendor.createdAt }}</p>
                </div>
            </div>
        </div>
    </div>
</template>
