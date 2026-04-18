<script setup lang="ts">
import { X } from "lucide-vue-next";
import { cn } from "~/lib/utils";

const props = defineProps<{
  modelValue: boolean;
  title?: string;
  description?: string;
  width?: string;
  position?: "center" | "right";
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "close"): void;
}>();

const close = () => {
  emit("update:modelValue", false);
  emit("close");
};
</script>

<template>
  <Teleport defer to="body">
    <div
      v-if="modelValue"
      :class="
        cn(
          'fixed inset-0 z-[1100] flex p-4',
          props.position === 'right' ? 'justify-end' : 'items-center justify-center',
        )
      "
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/50 transition-opacity backdrop-blur-sm"
        @click="close"
      ></div>

      <!-- Modal Content -->
      <div
        :class="
          cn(
            'relative bg-white shadow-xl w-full flex flex-col transition-all duration-200 animate-in fade-in zoom-in-95',
            props.position === 'right'
              ? cn('rounded-none rounded-l-xl h-full', props.width || 'max-w-2xl')
              : cn('rounded-xl max-h-[90vh]', props.width || 'max-w-3xl'),
          )
        "
      >
        <!-- Header -->
        <div class="flex items-start justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <h2
              v-if="title"
              class="text-xl font-bold text-foreground overflow-hidden text-ellipsis"
            >
              {{ title }}
            </h2>
            <p v-if="description" class="text-sm text-muted-foreground mt-1">
              {{ description }}
            </p>
          </div>
          <button
            @click="close"
            class="p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Body -->
        <div :class="cn('p-6 overflow-y-auto', props.position === 'right' && 'flex-1 min-h-0')">
          <slot></slot>
        </div>

        <!-- Footer -->
        <div
          v-if="$slots.footer"
          class="px-6 py-4 border-t border-border bg-gray-50/50 flex items-center justify-end gap-3 shrink-0"
          :class="props.position === 'right' ? '' : 'rounded-b-xl'"
        >
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>
