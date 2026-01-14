<script setup lang="ts">
import { ArrowLeft, Edit, User, Shield } from "lucide-vue-next";

definePageMeta({
    layout: "dashboard",
});

const route = useRoute();
const userId = route.params.id;

const user = {
    id: userId,
    name: "Direktur",
    email: "direktur@lantech.co.id",
    role: "Superuser",
    status: "active",
    lastLogin: "7 Jan 2025, 09:15",
    createdAt: "1 Des 2024",
};
</script>

<template>
    <div class="space-y-6 animate-fade-in">
        <div class="page-header">
            <div class="flex items-center gap-4">
                <NuxtLink to="/settings/users" class="p-2 rounded-lg hover:bg-muted transition-colors">
                    <ArrowLeft class="w-5 h-5" />
                </NuxtLink>
                <div>
                    <h1 class="page-title">{{ user.name }}</h1>
                    <p class="text-muted-foreground mt-1">Detail user</p>
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
                    <User class="w-7 h-7 text-primary" />
                </div>
                <div>
                    <h2 class="text-xl font-semibold">{{ user.name }}</h2>
                    <p class="text-muted-foreground">{{ user.email }}</p>
                </div>
                <span class="ml-auto badge-success">Aktif</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-1">
                    <p class="text-sm text-muted-foreground">Role</p>
                    <p class="font-medium flex items-center gap-2">
                        <Shield class="w-4 h-4 text-accent" />
                        {{ user.role }}
                    </p>
                </div>
                <div class="space-y-1">
                    <p class="text-sm text-muted-foreground">Status</p>
                    <p class="font-medium">{{ user.status === 'active' ? 'Aktif' : 'Tidak Aktif' }}</p>
                </div>
                <div class="space-y-1">
                    <p class="text-sm text-muted-foreground">Login Terakhir</p>
                    <p class="font-medium">{{ user.lastLogin }}</p>
                </div>
                <div class="space-y-1">
                    <p class="text-sm text-muted-foreground">Tanggal Dibuat</p>
                    <p class="font-medium">{{ user.createdAt }}</p>
                </div>
            </div>
        </div>
    </div>
</template>
