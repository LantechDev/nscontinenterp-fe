<script setup lang="ts">
defineProps<{
  isAir: boolean;
  isTrucking?: boolean;
  activeConditions: Array<{
    id: string | number;
    clauseNumber: string;
    clauseTitle: string;
    clauseContent: string;
  }>;
}>();
</script>

<template>
  <div
    class="a4-page-wrapper bg-white shadow-xl shrink-0 flex flex-col text-[#062c58] border p-5"
    style="
      width: 794px;
      height: 1123px;
      box-sizing: border-box;
      position: relative;
      background-color: #fff;
    "
  >
    <div class="mb-2 text-center border-b border-[#062c58] pb-1">
      <h2 class="text-[15px] font-bold uppercase tracking-widest">
        {{
          isAir
            ? "Air Waybill"
            : isTrucking
              ? "Trucking Waybill"
              : "Combined Transport Bill of Lading"
        }}
      </h2>
      <h3 class="text-xs font-semibold uppercase">Conditions of Contract</h3>
    </div>

    <div
      class="columns-2 gap-x-3 text-justify flex-1 overflow-hidden"
      style="font-size: 8.5px; line-height: 1.1"
    >
      <div
        v-for="condition in activeConditions"
        :key="condition.id"
        class="mb-1 break-inside-avoid"
      >
        <span class="font-bold mr-0.5"
          >{{ condition.clauseNumber }}. {{ condition.clauseTitle }}:</span
        >
        <span class="leading-none">{{ condition.clauseContent }}</span>
      </div>
    </div>

    <div class="mt-1 pt-1 border-t border-gray-200 text-[6px] text-center italic opacity-50">
      * These terms and conditions are continued from the face of the
      {{ isAir ? "Air Waybill" : isTrucking ? "Trucking Waybill" : "Bill of Lading" }} *
    </div>
  </div>
</template>

<style scoped>
.a4-page-wrapper {
  width: 794px;
  height: 1123px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 15px 30px;
  box-sizing: border-box;
  background: white;
  position: relative;
}
</style>
