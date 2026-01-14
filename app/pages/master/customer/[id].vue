<script setup lang="ts">
import { ArrowLeft, Edit, Building2, Mail, Phone, MapPin } from "lucide-vue-next";

definePageMeta({
    layout: "dashboard",
});

const route = useRoute();
const customerId = route.params.id;

// Placeholder data
const customer = {
    id: customerId,
    name: "PT Maju Bersama",
    code: "CUST-001",
    email: "finance@majubersama.co.id",
    phone: "+62 21 5551234",
    address: "Jl. Sudirman No. 123, Jakarta Pusat",
    type: "Shipper",
    status: "active",
    totalJobs: 45,
    createdAt: "15 Des 2024",
};
</script>

<template>
    <div class="space-y-6 animate-fade-in">
        <div class="page-header">
            <div class="flex items-center gap-4">
                <NuxtLink to="/master/customer"
                    class="p-2 rounded-lg hover:bg-muted transition-colors">
                    <ArrowLeft class="w-5 h-5" />
                </NuxtLink>
                <div>
                    <h1 class="page-title">{{ customer.name }}</h1>
                    <p class="text-muted-foreground mt-1">Detail customer</p>
                </div>
            </div>
            <button class="btn-secondary">
                <Edit class="w-4 h-4 mr-2" />
                Edit
            </button>
        </div>

        <div class="card-elevated p-6">
            <div class="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <div class="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Building2 class="w-7 h-7 text-primary" />
                </div>
                <div>
                    <h2 class="text-xl font-semibold">{{ customer.name }}</h2>
                    <p class="text-muted-foreground">{{ customer.code }}</p>
                </div>
                <div class="ml-auto flex items-center gap-2">
                    <span class="badge-success">Aktif</span>
                    <span class="text-xs bg-muted px-2 py-0.5 rounded-full">{{ customer.type }}</span>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-1">
                    <p class="text-sm text-muted-foreground flex items-center gap-2">
                        <Mail class="w-4 h-4" /> Email
                    </p>
                    <p class="font-medium">{{ customer.email }}</p>
                </div>
                <div class="space-y-1">
                    <p class="text-sm text-muted-foreground flex items-center gap-2">
                        <Phone class="w-4 h-4" /> Telepon
                    </p>
                    <p class="font-medium">{{ customer.phone }}</p>
                </div>
                <div class="space-y-1 md:col-span-2">
                    <p class="text-sm text-muted-foreground flex items-center gap-2">
                        <MapPin class="w-4 h-4" /> Alamat
                    </p>
                    <p class="font-medium">{{ customer.address }}</p>
                </div>
                <div class="space-y-1">
                    <p class="text-sm text-muted-foreground">Total Job</p>
                    <p class="font-medium text-lg">{{ customer.totalJobs }}</p>
                </div>
                <div class="space-y-1">
                    <p class="text-sm text-muted-foreground">Tanggal Registrasi</p>
                    <p class="font-medium">{{ customer.createdAt }}</p>
                </div>
            </div>
        </div>
    </div>
</template>
