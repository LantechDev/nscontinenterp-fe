<script setup lang="ts">
import { Save, Loader2 } from "lucide-vue-next";
import type { Vessel } from "~/composables/useVessels";

interface Props {
  isOpen: boolean;
  isSubmitting?: boolean;
  error?: string | null;
  editingVessel?: Vessel | null;
}

const props = withDefaults(defineProps<Props>(), {
  isSubmitting: false,
  error: null,
  editingVessel: null,
});

const emit = defineEmits<{
  (e: "update:isOpen", value: boolean): void;
  (
    e: "submit",
    data: { name: string; imoNumber: string; description: string; isActive: boolean },
  ): void;
}>();

// Form state
const formData = ref({
  name: "",
  imoNumber: "",
  description: "",
  isActive: true,
});

const resetForm = () => {
  formData.value = {
    name: "",
    imoNumber: "",
    description: "",
    isActive: true,
  };
};

const handleSubmit = () => {
  emit("submit", { ...formData.value });
};

const handleClose = () => {
  emit("update:isOpen", false);
  resetForm();
};

// Watch for editing vessel changes
watch(
  () => props.editingVessel,
  (vessel) => {
    if (vessel) {
      formData.value = {
        name: vessel.name,
        imoNumber: vessel.imoNumber || "",
        description: vessel.description || "",
        isActive: vessel.isActive,
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
    :title="editingVessel ? 'Edit Vessel' : 'Add New Vessel'"
    :description="editingVessel ? 'Update vessel information' : 'Register a new vessel'"
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
          Vessel Name <span class="text-red-500">*</span>
        </label>
        <input
          v-model="formData.name"
          type="text"
          placeholder="e.g. MV Ever Given"
          class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
          required
        />
      </div>

      <div class="space-y-1.5">
        <label class="text-sm font-medium text-foreground">IMO Number</label>
        <input
          v-model="formData.imoNumber"
          type="text"
          placeholder="e.g. IMO9811000"
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
            />
            <span class="text-sm text-foreground">Active</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="formData.isActive"
              type="radio"
              :value="false"
              class="w-4 h-4 text-[#012D5A] border-border focus:ring-primary"
            />
            <span class="text-sm text-foreground">Inactive</span>
          </label>
        </div>
      </div>

      <div class="space-y-1.5">
        <label class="text-sm font-medium text-foreground">Description</label>
        <textarea
          v-model="formData.description"
          rows="3"
          placeholder="Enter vessel description..."
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
