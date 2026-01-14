<script setup lang="ts">
import { Plus, Search, Edit, Trash2, Package } from "lucide-vue-next";

definePageMeta({
    layout: "dashboard",
});

const services = [
    { id: "1", name: "Ocean Freight - FCL", code: "SVC-001", price: "Rp 15.000.000", unit: "Per Container" },
    { id: "2", name: "Ocean Freight - LCL", code: "SVC-002", price: "Rp 2.500.000", unit: "Per CBM" },
    { id: "3", name: "Trucking - 20ft", code: "SVC-003", price: "Rp 3.500.000", unit: "Per Trip" },
    { id: "4", name: "Customs Clearance", code: "SVC-004", price: "Rp 1.200.000", unit: "Per Shipment" },
    { id: "5", name: "Warehousing", code: "SVC-005", price: "Rp 50.000", unit: "Per CBM/Day" },
];
</script>

<template>
    <div class="space-y-6 animate-fade-in">
        <div class="page-header">
            <div>
                <h1 class="page-title">Jasa</h1>
                <p class="text-muted-foreground mt-1">Kelola daftar jasa dan harga</p>
            </div>
            <NuxtLink to="/master/services/create" class="btn-primary">
                <Plus class="w-4 h-4 mr-2" />
                Tambah Jasa
            </NuxtLink>
        </div>

        <div class="card-elevated p-4">
            <div class="relative">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" placeholder="Cari jasa..." class="input-field pl-10" />
            </div>
        </div>

        <div class="card-elevated overflow-hidden">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Kode</th>
                        <th>Nama Jasa</th>
                        <th>Harga</th>
                        <th>Satuan</th>
                        <th class="w-20">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="service in services" :key="service.id" class="cursor-pointer hover:bg-muted/50"
                        @click="navigateTo(`/master/services/${service.id}`)">
                        <td>
                            <div class="flex items-center gap-2">
                                <Package class="w-4 h-4 text-primary" />
                                <span class="font-medium">{{ service.code }}</span>
                            </div>
                        </td>
                        <td>{{ service.name }}</td>
                        <td class="font-medium">{{ service.price }}</td>
                        <td class="text-muted-foreground">{{ service.unit }}</td>
                        <td>
                            <div class="flex gap-1">
                                <NuxtLink :to="`/master/services/${service.id}`"
                                    class="p-1.5 rounded hover:bg-muted transition-colors" @click.stop>
                                    <Edit class="w-4 h-4 text-muted-foreground" />
                                </NuxtLink>
                                <button class="p-1.5 rounded hover:bg-muted transition-colors" @click.stop>
                                    <Trash2 class="w-4 h-4 text-destructive" />
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
