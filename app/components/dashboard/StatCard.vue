<script setup lang="ts">
import { TrendingUp, TrendingDown } from "lucide-vue-next";
import { cn } from "~/lib/utils";
import type { Component } from "vue";

interface StatCardProps {
    title: string;
    value: string;
    change?: number;
    changeLabel?: string;
    icon: Component;
    variant?: "default" | "primary" | "accent" | "success" | "warning";
}

const props = withDefaults(defineProps<StatCardProps>(), {
    variant: "default",
});

const isPositive = computed(() => props.change && props.change > 0);

const variantStyles: Record<string, string> = {
    default: "bg-card",
    primary: "bg-gradient-primary text-primary-foreground",
    accent: "bg-gradient-accent text-accent-foreground",
    success: "bg-success/10 border-success/20",
    warning: "bg-warning/10 border-warning/20",
};
</script>

<template>
    <div :class="cn(
        'card-stat p-4 rounded-xl border border-border transition-all duration-300 hover:shadow-md',
        props.variant === 'primary' ? 'bg-[#012D5A] text-white border-[#012D5A]' : 'bg-card text-card-foreground'
    )">
        <!-- Header: Icon & Title -->
        <div class="flex items-center gap-3 mb-3">
            <div :class="cn(
                'p-2 rounded-lg',
                props.variant === 'primary' ? 'bg-white/10' : 'bg-muted'
            )">
                <component :is="props.icon"
                    :class="cn('w-5 h-5', props.variant === 'primary' ? 'text-white' : 'text-muted-foreground')" />
            </div>
            <p :class="cn(
                'text-sm font-medium',
                props.variant === 'primary' ? 'text-white/80' : 'text-muted-foreground'
            )">
                {{ props.title }}
            </p>
        </div>

        <!-- Body: Value & Trend -->
        <div>
            <div class="flex items-end justify-between gap-2">
                <h3 class="text-2xl font-bold tracking-tight">{{ props.value }}</h3>

                <div v-if="props.change !== undefined" :class="cn(
                    'flex items-center gap-1 text-xs font-medium mb-1',
                    isPositive ? 'text-emerald-500' : 'text-rose-500'
                )">
                    <TrendingUp v-if="isPositive" class="w-3 h-3" />
                    <TrendingDown v-else class="w-3 h-3" />
                    <span>{{ Math.abs(props.change).toString().replace('.', ',') }}%</span>
                </div>
            </div>
            <p v-if="props.changeLabel" :class="cn(
                'text-xs mt-1',
                props.variant === 'primary' ? 'text-white/50' : 'text-muted-foreground'
            )">
                {{ props.changeLabel }}
            </p>
        </div>
    </div>
</template>
