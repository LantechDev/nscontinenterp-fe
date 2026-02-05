<script setup lang="ts">
import { ArrowLeft, Wallet } from "lucide-vue-next";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const expenseId = route.params.id;

const expense = {
  id: expenseId,
  number: "EXP-2024-001",
  description: "Trucking Fee - JOB-2024-001234",
  vendor: "CV Trucking Mandiri",
  job: "JOB-2024-001234",
  date: "6 Jan 2025",
  amount: "Rp 3.500.000",
  category: "Trucking",
  notes: "Biaya trucking dari gudang ke pelabuhan",
};
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <div class="page-header">
      <div class="flex items-center gap-4">
        <NuxtLink to="/finance/expenses" class="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft class="w-5 h-5" />
        </NuxtLink>
        <div>
          <h1 class="page-title">{{ expense.number }}</h1>
          <p class="text-muted-foreground mt-1">Detail biaya operasional</p>
        </div>
      </div>
    </div>

    <div class="card-elevated p-6">
      <div class="flex items-center gap-4 mb-6 pb-6 border-b border-border">
        <div class="w-14 h-14 rounded-xl bg-destructive/10 flex items-center justify-center">
          <Wallet class="w-7 h-7 text-destructive" />
        </div>
        <div>
          <h2 class="text-xl font-semibold">{{ expense.number }}</h2>
          <p class="text-muted-foreground">{{ expense.vendor }}</p>
        </div>
        <span class="ml-auto text-2xl font-bold text-destructive">{{ expense.amount }}</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-1 md:col-span-2">
          <p class="text-sm text-muted-foreground">Deskripsi</p>
          <p class="font-medium">{{ expense.description }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-sm text-muted-foreground">No. Job</p>
          <p class="font-medium text-primary">{{ expense.job }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-sm text-muted-foreground">Tanggal</p>
          <p class="font-medium">{{ expense.date }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-sm text-muted-foreground">Kategori</p>
          <span class="text-xs bg-muted px-2 py-0.5 rounded-full">{{ expense.category }}</span>
        </div>
        <div class="space-y-1">
          <p class="text-sm text-muted-foreground">Keterangan</p>
          <p class="font-medium">{{ expense.notes }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
