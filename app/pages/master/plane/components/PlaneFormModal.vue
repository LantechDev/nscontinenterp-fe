<script setup lang="ts">
import { Save, Loader2 } from "lucide-vue-next";
import type { Plane } from "~/composables/usePlanes";

interface Props {
  isOpen: boolean;
  isSubmitting?: boolean;
  error?: string | null;
  editingPlane?: Plane | null;
}

const props = withDefaults(defineProps<Props>(), {
  isSubmitting: false,
  error: null,
  editingPlane: null,
});

const emit = defineEmits<{
  (e: "update:isOpen", value: boolean): void;
  (e: "submit", data: { name: string; code: string; description: string; isActive: boolean }): void;
}>();

// Form state
const formData = ref({
  name: "",
  code: "",
  description: "",
  isActive: true,
});

const resetForm = () => {
  formData.value = {
    name: "",
    code: "",
    description: "",
    isActive: true,
  };
};

const handleSubmit = () => {
  emit("submit", {
    ...formData.value,
    name: formData.value.name.toUpperCase(),
    code: formData.value.code.toUpperCase(),
    description: formData.value.description.toUpperCase(),
  });
};

const handleClose = () => {
  emit("update:isOpen", false);
  resetForm();
};

// Watch for editing plane changes
watch(
  () => props.editingPlane,
  (plane) => {
    if (plane) {
      formData.value = {
        name: plane.name,
        code: plane.code || "",
        description: plane.description || "",
        isActive: plane.isActive,
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
    :title="editingPlane ? 'Edit Plane' : 'Add New Plane'"
    :description="editingPlane ? 'Update plane information' : 'Register a new plane'"
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
          Plane Name <span class="text-red-500">*</span>
        </label>
        <input
          v-model="formData.name"
          v-uppercase
          type="text"
          placeholder="e.g. BOEING 747"
          class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
          required
        />
      </div>

      <div class="space-y-1.5">
        <label class="text-sm font-medium text-foreground">Plane Code</label>
        <input
          v-model="formData.code"
          v-uppercase
          type="text"
          placeholder="e.g. B744F"
          class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div class="space-y-1.5">
        <label class="text-sm font-medium text-foreground">Status</label>
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="formData.isActive"
              type="radio"
              :value="true"
              class="w-4 h-4 text-[#012D5A] border-border focus:ring-primary"
              v-uppercase
            />
            <span class="text-sm text-foreground">Active</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="formData.isActive"
              type="radio"
              :value="false"
              class="w-4 h-4 text-[#012D5A] border-border focus:ring-primary"
              v-uppercase
            />
            <span class="text-sm text-foreground">Inactive</span>
          </label>
        </div>
      </div>

      <div class="space-y-1.5">
        <label class="text-sm font-medium text-foreground">Description</label>
        <textarea
          v-model="formData.description"
          v-uppercase
          rows="3"
          placeholder="Enter plane description..."
          class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary resize-none"
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
        :disabled="isSubmitting"
        class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white rounded-lg hover:bg-[#012D5A]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
        <Save v-else class="w-4 h-4" />
        {{ isSubmitting ? "Saving..." : "Save" }}
      </button>
    </template>
  </UiModal>
</template>
