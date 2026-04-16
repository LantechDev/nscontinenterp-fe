<script setup lang="ts">
import { cn } from "~/lib/utils";

const props = defineProps<{
  modelValue?: unknown;
  value: unknown;
  disabled?: boolean;
  class?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: unknown): void;
}>();

const select = () => {
  if (props.disabled) return;
  emit("update:modelValue", props.value);
};

const isChecked = computed(() => props.modelValue === props.value);
</script>

<template>
  <button
    type="button"
    role="radio"
    :aria-checked="isChecked"
    :disabled="disabled"
    @click="select"
    :class="
      cn(
        'peer h-5 w-5 shrink-0 rounded-full border border-muted-foreground/30 ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center',
        isChecked ? 'bg-[#012D5A] border-[#012D5A]' : 'hover:border-[#012D5A]/50 bg-white',
        props.class,
      )
    "
  >
    <div v-if="isChecked" class="h-2 w-2 rounded-full bg-white transition-all scale-100" />
  </button>
</template>
