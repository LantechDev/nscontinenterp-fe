<script setup lang="ts">
import { Check, ChevronsUpDown, Plus } from "lucide-vue-next";
import { onClickOutside } from "@vueuse/core";
import { cn } from "~/lib/utils"; // Assuming you have a utility for class merging, standard in detailed-codebases

// Fallback if utility doesn't exist
function cx(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(" ");
}

const props = defineProps<{
    modelValue: string;
    options: any[];
    labelKey?: string;
    valueKey?: string; // unique ID
    placeholder?: string;
    allowCreate?: boolean;
}>();

const emit = defineEmits(["update:modelValue", "create"]);

const open = ref(false);
const searchQuery = ref("");
const containerRef = ref<HTMLElement | null>(null);

const filteredOptions = computed(() => {
    if (!props.options) return [];
    if (!searchQuery.value) return props.options;
    const lowerQuery = searchQuery.value.toLowerCase();
    return props.options.filter((opt) => {
        const label = props.labelKey ? opt[props.labelKey] : opt.name;
        return String(label).toLowerCase().includes(lowerQuery);
    });
});

const selectedLabel = computed(() => {
    const selected = props.options.find((opt) => {
        const val = props.valueKey ? opt[props.valueKey] : opt.id;
        return val === props.modelValue;
    });
    return selected
        ? props.labelKey
            ? selected[props.labelKey]
            : selected.name
        : props.placeholder || "Select option...";
});

function selectOption(option: any) {
    const val = props.valueKey ? option[props.valueKey] : option.id;
    emit("update:modelValue", val);
    open.value = false;
    searchQuery.value = "";
}

function handleCreate() {
    if (!props.allowCreate || !searchQuery.value) return;
    emit("create", searchQuery.value);
    open.value = false;
    searchQuery.value = "";
}

// Click outside to close
onClickOutside(containerRef, () => {
    open.value = false;
});
</script>

<template>
    <div ref="containerRef" class="relative">
        <button
            type="button"
            class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            @click="open = !open"
        >
            <span class="truncate">{{ selectedLabel }}</span>
            <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>

        <div
            v-if="open"
            class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
        >
            <div class="flex items-center border-b px-3 sticky top-0 bg-popover">
                <input
                    v-model="searchQuery"
                    class="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Search..."
                    autofocus
                />
            </div>
            <div class="p-1">
                <div
                    v-if="filteredOptions.length === 0 && !allowCreate"
                    class="py-6 text-center text-sm"
                >
                    No results found.
                </div>

                <div
                    v-if="filteredOptions.length === 0 && allowCreate && searchQuery"
                    class="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none bg-accent/50 hover:bg-accent text-accent-foreground"
                    @click="handleCreate"
                >
                    <Plus class="mr-2 h-4 w-4" />
                    Create "{{ searchQuery }}"
                </div>

                <div
                    v-for="option in filteredOptions"
                    :key="props.valueKey ? option[props.valueKey] : option.id"
                    class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    :class="{
                        'bg-accent':
                            modelValue === (props.valueKey ? option[props.valueKey] : option.id),
                    }"
                    @click="selectOption(option)"
                >
                    <Check
                        class="mr-2 h-4 w-4"
                        :class="
                            modelValue === (props.valueKey ? option[props.valueKey] : option.id)
                                ? 'opacity-100'
                                : 'opacity-0'
                        "
                    />
                    {{ props.labelKey ? option[props.labelKey] : option.name }}
                </div>
            </div>
        </div>
    </div>
</template>
