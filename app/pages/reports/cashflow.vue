<script setup lang="ts">
import { Download, ArrowDown, ArrowUp } from "lucide-vue-next";

definePageMeta({
  layout: "dashboard",
});

const cashflow = [
  {
    id: "1",
    date: "7 Jan 2025",
    description: "Pembayaran dari PT Maju Bersama",
    type: "in",
    amount: "Rp 25.500.000",
    balance: "Rp 125.500.000",
  },
  {
    id: "2",
    date: "6 Jan 2025",
    description: "Pembayaran ke CV Trucking Mandiri",
    type: "out",
    amount: "Rp 3.500.000",
    balance: "Rp 100.000.000",
  },
  {
    id: "3",
    date: "5 Jan 2025",
    description: "Pembayaran dari CV Sukses Makmur",
    type: "in",
    amount: "Rp 18.250.000",
    balance: "Rp 103.500.000",
  },
  {
    id: "4",
    date: "5 Jan 2025",
    description: "Pembayaran ke PT Pelayaran Nusantara",
    type: "out",
    amount: "Rp 12.500.000",
    balance: "Rp 85.250.000",
  },
];
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <div class="page-header">
      <div>
        <h1 class="page-title">Laporan Arus Kas</h1>
        <p class="text-muted-foreground mt-1">Periode: Januari 2025</p>
      </div>
      <button class="btn-outline">
        <Download class="w-4 h-4 mr-2" />
        Export PDF
      </button>
    </div>

    <!-- Summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="stat-card">
        <p class="text-sm text-muted-foreground mb-1">Saldo Awal</p>
        <p class="text-2xl font-bold">Rp 72.250.000</p>
      </div>
      <div class="stat-card">
        <p class="text-sm text-muted-foreground mb-1">Total Masuk</p>
        <p class="text-2xl font-bold text-success">Rp 69.250.000</p>
      </div>
      <div class="stat-card">
        <p class="text-sm text-muted-foreground mb-1">Total Keluar</p>
        <p class="text-2xl font-bold text-destructive">Rp 16.000.000</p>
      </div>
    </div>

    <!-- Transactions -->
    <div class="card-elevated overflow-hidden">
      <table class="data-table">
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Deskripsi</th>
            <th class="text-right">Masuk</th>
            <th class="text-right">Keluar</th>
            <th class="text-right">Saldo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cashflow" :key="item.id">
            <td class="text-muted-foreground">{{ item.date }}</td>
            <td>
              <div class="flex items-center gap-2">
                <ArrowDown v-if="item.type === 'in'" class="w-4 h-4 text-success" />
                <ArrowUp v-else class="w-4 h-4 text-destructive" />
                {{ item.description }}
              </div>
            </td>
            <td class="text-right font-medium text-success">
              {{ item.type === "in" ? item.amount : "-" }}
            </td>
            <td class="text-right font-medium text-destructive">
              {{ item.type === "out" ? item.amount : "-" }}
            </td>
            <td class="text-right font-medium">{{ item.balance }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
