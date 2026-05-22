<script setup lang="ts">
import { Save, Loader2 } from "lucide-vue-next";
import type { ServiceUnit } from "~/types/master";

interface Props {
  isOpen: boolean;
  isSubmitting?: boolean;
  error?: string | null;
  editingUnit?: ServiceUnit | null;
}

const props = withDefaults(defineProps<Props>(), {
  isSubmitting: false,
  error: null,
  editingUnit: null,
});

const emit = defineEmits<{
  (e: "update:isOpen", value: boolean): void;
  (e: "submit", data: { name: string }): void;
}>();

// Form state
const formData = ref({
  name: "",
});

const resetForm = () => {
  formData.value = {
    name: "",
  };
};

const handleSubmit = () => {
  emit("submit", {
    name: formData.value.name.toUpperCase(),
  });
};

const handleClose = () => {
  emit("update:isOpen", false);
  resetForm();
};

// Watch for editing unit changes
watch(
  () => props.editingUnit,
  (unit) => {
    if (unit) {
      formData.value = {
        name: unit.name,
      };
    } else {
      resetForm();
    }
  },
  { immediate: true },
);

defineExpose({ resetForm });
</script>

<template>
  <UiModal
    :model-value="isOpen"
    @update:model-value="(val) => emit('update:isOpen', val)"
    :title="editingUnit ? 'Edit Service Unit' : 'Add New Service Unit'"
    :description="editingUnit ? 'Update service unit details' : 'Register a new service unit'"
    width="max-w-lg"
    @close="handleClose"
  >
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <!-- Error Message -->
      <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>

      <div class="space-y-1.5">
        <label class="text-sm font-medium text-foreground">
          Unit Name <span class="text-red-500">*</span>
        </label>
        <input
          v-model="formData.name"
          v-uppercase
          type="text"
          placeholder="e.g. CONTAINER"
          class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
          required
        />
      </div>
    </form>

    <template #footer>
      <button
        type="button"
        @click="handleClose"
        class="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg text-foreground hover:bg-gray-50 transition-colors"
        :disabled="isSubmitting"
      >
        Cancel
      </button>
      <button
        type="button"
        @click="handleSubmit"
        :disabled="isSubmitting || !formData.name.trim()"
        class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white rounded-lg hover:bg-[#012D5A]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
        <Save v-else class="w-4 h-4" />
        {{ isSubmitting ? "Saving..." : "Save" }}
      </button>
    </template>
  </UiModal>
</template>
