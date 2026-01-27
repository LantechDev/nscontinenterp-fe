<script setup lang="ts">
import { Check } from 'lucide-vue-next';
import { cn } from '~/lib/utils';

const props = defineProps<{
    modelValue?: boolean;
    disabled?: boolean;
    class?: string;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
}>();

const toggle = () => {
    if (props.disabled) return;
    emit('update:modelValue', !props.modelValue);
};
</script>

<template>
    <button type="button" role="checkbox" :aria-checked="modelValue" :disabled="disabled" @click="toggle" :class="cn(
        'peer h-5 w-5 shrink-0 rounded border border-muted-foreground/30 ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        modelValue
            ? 'bg-[#012D5A] border-[#012D5A] text-white'
            : 'hover:border-[#012D5A]/50 bg-white',
        props.class
    )">
        <div class="flex items-center justify-center w-full h-full" v-if="modelValue">
            <Check class="h-3.5 w-3.5 stroke-[3]" />
        </div>
    </button>
</template>
