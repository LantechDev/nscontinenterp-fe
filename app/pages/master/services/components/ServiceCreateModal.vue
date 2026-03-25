<script setup lang="ts">
import { Save, Loader2, ChevronDown } from "lucide-vue-next";

interface Props {
  isOpen: boolean;
  isSubmitting?: boolean;
  error?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  isSubmitting: false,
  error: null,
});

const emit = defineEmits<{
  (e: "update:isOpen", value: boolean): void;
  (
    e: "submit",
    data: { name: string; code: string; price: string; status: string; unit: string },
  ): void;
}>();

// Form state
const formData = ref({
  name: "",
  code: "",
  price: "",
  status: "Active",
  unit: "Per Container",
});

const resetForm = () => {
  formData.value = {
    name: "",
    code: "",
    price: "",
    status: "Active",
    unit: "Per Container",
  };
};

const handleSubmit = () => {
  emit("submit", { ...formData.value });
};

const handleClose = () => {
  emit("update:isOpen", false);
  resetForm();
};

// Expose resetForm for parent
defineExpose({ resetForm });
</script>

<template>
  <UiModal
    :model-value="isOpen"
    @update:model-value="(val) => emit('update:isOpen', val)"
    title="Add new Service"
    description="Register your new Service"
    width="max-w-xl"
    @close="handleClose"
  >
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <!-- Error Message -->
      <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>

      <div class="space-y-1.5">
        <label class="text-sm font-medium text-foreground">
          Service Name <span class="text-red-500">*</span>
        </label>
        <input
          v-model="formData.name"
          type="text"
          placeholder="e.g. Ocean Freight"
          class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
          required
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label class="text-sm font-medium text-foreground">
            Code <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.code"
            type="text"
            placeholder="SVC-XXX"
            class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
        </div>
        <div class="space-y-1.5">
          <label class="text-sm font-medium text-foreground">Status</label>
          <div class="relative">
            <select
              v-model="formData.status"
              class="w-full px-3 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <ChevronDown
              class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
            />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label class="text-sm font-medium text-foreground">Price</label>
          <input
            v-model="formData.price"
            type="text"
            placeholder="Rp 0"
            class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div class="space-y-1.5">
          <label class="text-sm font-medium text-foreground">Unit</label>
          <div class="relative">
            <select
              v-model="formData.unit"
              class="w-full px-3 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
            >
              <option>Per Container</option>
              <option>Per CBM</option>
              <option>Per Trip</option>
            </select>
            <ChevronDown
              class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
            />
          </div>
        </div>
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
