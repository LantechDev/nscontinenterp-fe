<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    amount: number | string | null | undefined;
    currency?: string | null;
    exchangeRate?: number | string | null;
    primaryClass?: string;
    secondaryClass?: string;
    align?: "left" | "right";
    showRate?: boolean;
    prefix?: string;
    suffix?: string;
  }>(),
  {
    currency: "IDR",
    exchangeRate: 1,
    primaryClass: "font-black text-foreground",
    secondaryClass: "text-muted-foreground opacity-70",
    align: "left",
    showRate: false,
    prefix: "",
    suffix: "",
  },
);

const sourceCurrency = computed(() => props.currency || "IDR");
const numericAmount = computed(() => Number(props.amount || 0));
const numericRate = computed(() => Number(props.exchangeRate || 1));
const hasUsdConversion = computed(() => sourceCurrency.value === "USD" && numericRate.value > 1);
const convertedAmount = computed(() =>
  hasUsdConversion.value ? numericAmount.value * numericRate.value : numericAmount.value,
);
const primaryCurrency = computed(() => (hasUsdConversion.value ? "IDR" : sourceCurrency.value));
const secondaryCurrency = computed(() => (hasUsdConversion.value ? "USD" : ""));

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat(currency === "IDR" ? "id-ID" : "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "IDR" ? 0 : 2,
    maximumFractionDigits: currency === "IDR" ? 0 : 2,
  }).format(amount);
}
</script>

<template>
  <div :class="['leading-tight', align === 'right' ? 'text-right' : 'text-left']">
    <div :class="primaryClass">
      {{ prefix }}{{ formatMoney(convertedAmount, primaryCurrency)
      }}<span v-if="suffix"> {{ suffix }}</span>
    </div>
    <div v-if="secondaryCurrency" :class="['mt-0.5 font-mono', secondaryClass]">
      {{ prefix }}{{ formatMoney(numericAmount, secondaryCurrency) }}
      <span v-if="showRate"> · Kurs: {{ formatMoney(numericRate, "IDR") }}</span>
    </div>
  </div>
</template>
