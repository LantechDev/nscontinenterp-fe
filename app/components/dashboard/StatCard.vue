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
    <div :class="cn('stat-card animate-slide-up', variantStyles[props.variant])">
        <div class="flex items-start justify-between mb-4">
            <div :class="cn(
                'p-3 rounded-xl',
                props.variant === 'default' && 'bg-muted',
                props.variant === 'primary' && 'bg-primary-foreground/20',
                props.variant === 'accent' && 'bg-accent-foreground/20',
                props.variant === 'success' && 'bg-success/20',
                props.variant === 'warning' && 'bg-warning/20',
            )
                ">
                <component :is="props.icon" class="w-5 h-5" />
            </div>
            <div v-if="props.change !== undefined" :class="cn(
                'flex items-center gap-1 text-sm font-medium',
                isPositive ? 'text-success' : 'text-destructive',
            )
                ">
                <TrendingUp v-if="isPositive" class="w-4 h-4" />
                <TrendingDown v-else class="w-4 h-4" />
                <span>{{ Math.abs(props.change) }}%</span>
            </div>
        </div>
        <div>
            <p :class="cn(
                'text-sm mb-1',
                props.variant === 'default' ||
                    props.variant === 'success' ||
                    props.variant === 'warning'
                    ? 'text-muted-foreground'
                    : 'text-primary-foreground/80',
            )
                ">
                {{ props.title }}
            </p>
            <p :class="cn(
                'text-2xl font-bold',
                props.variant === 'default' && 'text-foreground',
                props.variant === 'success' && 'text-success',
                props.variant === 'warning' && 'text-warning',
            )
                ">
                {{ props.value }}
            </p>
            <p v-if="props.changeLabel" :class="cn(
                'text-xs mt-1',
                props.variant === 'default'
                    ? 'text-muted-foreground'
                    : 'text-primary-foreground/60',
            )
                ">
                {{ props.changeLabel }}
            </p>
        </div>
    </div>
</template>
