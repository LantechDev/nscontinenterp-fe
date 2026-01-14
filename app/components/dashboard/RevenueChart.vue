<script setup lang="ts">
// Simple revenue chart component (placeholder for recharts equivalent)
// In a real implementation, you would use vue-chartjs or ApexCharts

const data = [
    { month: "Jan", pendapatan: 45, pengeluaran: 32 },
    { month: "Feb", pendapatan: 52, pengeluaran: 38 },
    { month: "Mar", pendapatan: 48, pengeluaran: 35 },
    { month: "Apr", pendapatan: 61, pengeluaran: 42 },
    { month: "Mei", pendapatan: 55, pengeluaran: 39 },
    { month: "Jun", pendapatan: 67, pengeluaran: 45 },
    { month: "Jul", pendapatan: 72, pengeluaran: 48 },
    { month: "Aug", pendapatan: 69, pengeluaran: 46 },
    { month: "Sep", pendapatan: 78, pengeluaran: 52 },
    { month: "Okt", pendapatan: 82, pengeluaran: 55 },
    { month: "Nov", pendapatan: 85, pengeluaran: 58 },
    { month: "Des", pendapatan: 91, pengeluaran: 62 },
];

const maxValue = Math.max(...data.map((d) => Math.max(d.pendapatan, d.pengeluaran)));

const getHeight = (value: number) => (value / maxValue) * 100;
</script>

<template>
    <div class="card-elevated p-6">
        <div class="flex items-center justify-between mb-6">
            <div>
                <h3 class="section-title mb-0">Pendapatan vs Pengeluaran</h3>
                <p class="text-sm text-muted-foreground">Tahun 2024</p>
            </div>
            <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full bg-chart-1"></div>
                    <span class="text-sm text-muted-foreground">Pendapatan</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full bg-chart-2"></div>
                    <span class="text-sm text-muted-foreground">Pengeluaran</span>
                </div>
            </div>
        </div>

        <!-- Simple bar chart visualization -->
        <div class="h-72 flex items-end gap-2">
            <div v-for="item in data" :key="item.month" class="flex-1 flex flex-col items-center gap-1">
                <div class="flex gap-1 items-end w-full justify-center h-56">
                    <div class="w-3 bg-chart-1 rounded-t transition-all duration-300 hover:opacity-80"
                        :style="{ height: `${getHeight(item.pendapatan)}%` }"
                        :title="`Pendapatan: Rp ${item.pendapatan}jt`"></div>
                    <div class="w-3 bg-chart-2 rounded-t transition-all duration-300 hover:opacity-80"
                        :style="{ height: `${getHeight(item.pengeluaran)}%` }"
                        :title="`Pengeluaran: Rp ${item.pengeluaran}jt`"></div>
                </div>
                <span class="text-xs text-muted-foreground">{{ item.month }}</span>
            </div>
        </div>
    </div>
</template>
