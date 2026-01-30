<script setup lang="ts">
import { AlertTriangle, Info } from "lucide-vue-next";

const { state, handleConfirm, handleCancel } = useConfirm();
</script>

<template>
  <UiModal
    :model-value="state.isOpen"
    @update:model-value="(val) => !val && handleCancel()"
    width="max-w-md"
  >
    <div class="p-4">
      <div class="flex flex-col items-center text-center gap-4 py-4">
        <div
          v-if="state.options.type === 'danger'"
          class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600"
        >
          <AlertTriangle class="w-6 h-6" />
        </div>
        <div
          v-else
          class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"
        >
          <Info class="w-6 h-6" />
        </div>

        <div class="space-y-2">
          <h3 class="text-lg font-semibold">{{ state.title }}</h3>
          <p class="text-sm text-muted-foreground">{{ state.message }}</p>
        </div>
      </div>

      <div class="flex items-center gap-3 mt-6">
        <button type="button" class="btn-secondary flex-1 justify-center" @click="handleCancel">
          {{ state.options.cancelText || "Cancel" }}
        </button>
        <button
          type="button"
          :class="[
            'btn-primary flex-1 justify-center',
            state.options.type === 'danger' ? 'bg-red-600 hover:bg-red-700 border-red-600' : '',
          ]"
          @click="handleConfirm"
        >
          {{ state.options.confirmText || "Confirm" }}
        </button>
      </div>
    </div>
  </UiModal>
</template>
