<script setup lang="ts">
import { ArrowLeft, Save } from "lucide-vue-next";

definePageMeta({
    layout: "dashboard",
});
</script>

<template>
    <div class="space-y-6 animate-fade-in">
        <div class="page-header">
            <div class="flex items-center gap-4">
                <NuxtLink to="/settings/users" class="p-2 rounded-lg hover:bg-muted transition-colors">
                    <ArrowLeft class="w-5 h-5" />
                </NuxtLink>
                <div>
                    <h1 class="page-title">Tambah User</h1>
                    <p class="text-muted-foreground mt-1">Buat akun user baru</p>
                </div>
            </div>
        </div>

        <form class="card-elevated p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                    <label class="text-sm font-medium">Nama</label>
                    <input type="text" placeholder="Nama lengkap" class="input-field" />
                </div>
                <div class="space-y-2">
                    <label class="text-sm font-medium">Email</label>
                    <input type="email" placeholder="email@example.com" class="input-field" />
                </div>
                <div class="space-y-2">
                    <label class="text-sm font-medium">Password</label>
                    <input type="password" placeholder="••••••••" class="input-field" />
                </div>
                <div class="space-y-2">
                    <label class="text-sm font-medium">Konfirmasi Password</label>
                    <input type="password" placeholder="••••••••" class="input-field" />
                </div>
                <div class="space-y-2">
                    <label class="text-sm font-medium">Role</label>
                    <select class="input-field">
                        <option value="">Pilih role</option>
                        <option value="superuser">Superuser</option>
                        <option value="manager">Manager</option>
                        <option value="staff">Staff</option>
                    </select>
                </div>
                <div class="space-y-2">
                    <label class="text-sm font-medium">Status</label>
                    <select class="input-field">
                        <option value="active">Aktif</option>
                        <option value="inactive">Tidak Aktif</option>
                    </select>
                </div>
            </div>
            <div class="flex justify-end gap-3 pt-4 border-t border-border">
                <NuxtLink to="/settings/users" class="btn-secondary">Batal</NuxtLink>
                <button type="submit" class="btn-primary">
                    <Save class="w-4 h-4 mr-2" />
                    Simpan
                </button>
            </div>
        </form>
    </div>
</template>
