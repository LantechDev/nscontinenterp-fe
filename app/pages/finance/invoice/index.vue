<script setup lang="ts">
import { ref } from "vue";
import CustomerInvoiceSection from "./components/CustomerInvoiceSection.vue";
import VendorInvoiceSection from "./components/VendorInvoiceSection.vue";

definePageMeta({
  layout: "dashboard",
});

const { canView: canViewPayments } = useFeatureAccess("finance.payment");
const activeTab = ref("customer");
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Invoice & Tagihan</h1>
        <p class="text-muted-foreground mt-1">Kelola tagihan customer dan vendor</p>
      </div>
    </div>

    <!-- Beautiful Segmented Tab Bar with elegant corporate navy styling -->
    <div class="border-b border-border">
      <div class="flex gap-2">
        <button
          @click="activeTab = 'customer'"
          :class="[
            'px-6 py-3.5 text-xs font-black uppercase tracking-widest border-b-2 transition-all duration-200 outline-none',
            activeTab === 'customer'
              ? 'border-[#012D5A] text-[#012D5A]'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          ]"
        >
          Invoice Customer (A/R)
        </button>
        <button
          v-if="canViewPayments"
          @click="activeTab = 'vendor'"
          :class="[
            'px-6 py-3.5 text-xs font-black uppercase tracking-widest border-b-2 transition-all duration-200 outline-none',
            activeTab === 'vendor'
              ? 'border-[#012D5A] text-[#012D5A]'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          ]"
        >
          Invoice Vendor (A/P)
        </button>
      </div>
    </div>

    <!-- Active Component Section with clean top spacing -->
    <div class="mt-4">
      <CustomerInvoiceSection v-if="activeTab === 'customer'" />
      <VendorInvoiceSection v-else-if="activeTab === 'vendor' && canViewPayments" />
    </div>
  </div>
</template>
