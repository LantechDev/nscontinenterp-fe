<script setup lang="ts">
import { X } from "lucide-vue-next";
import { cn } from "~/lib/utils";

const props = defineProps<{
  modelValue: boolean;
  title?: string;
  description?: string;
  width?: string;
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
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/50 transition-opacity backdrop-blur-sm"
        @click="close"
      ></div>

      <!-- Modal Content -->
      <div
        :class="
          cn(
            'relative bg-white rounded-xl shadow-xl w-full max-h-[90vh] flex flex-col transition-all duration-200 animate-in fade-in zoom-in-95',
            props.width || 'max-w-3xl',
          )
        "
      >
        <!-- Header -->
        <div class="flex items-start justify-between px-6 py-4 border-b border-border">
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
        <div class="p-6 overflow-y-auto">
          <slot></slot>
        </div>

        <!-- Footer -->
        <div
          v-if="$slots.footer"
          class="px-6 py-4 border-t border-border bg-gray-50/50 rounded-b-xl flex items-center justify-end gap-3"
        >
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>
