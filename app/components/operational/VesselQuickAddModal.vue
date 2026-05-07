<script setup lang="ts">
import { Save, Loader2, Ship } from "lucide-vue-next";
import { useVessels } from "~/composables/useVessels";

interface Props {
  isOpen: boolean;
  initialName?: string;
}

const props = withDefaults(defineProps<Props>(), {
  initialName: "",
});

const emit = defineEmits<{
  (e: "update:isOpen", value: boolean): void;
  (e: "success", vessel: { id: string; name: string }): void;
}>();

const { createVessel, isLoading } = useVessels();
const error = ref<string | null>(null);

// Form state
const formData = ref({
  name: props.initialName,
  imoNumber: "",
  description: "",
  isActive: true,
});

// Watch for initialName changes (e.g. when user types in select and hits enter)
watch(
  () => props.initialName,
  (newVal) => {
    if (newVal) {
      formData.value.name = newVal;
    }
  },
);

const resetForm = () => {
  formData.value = {
    name: props.initialName,
    imoNumber: "",
    description: "",
    isActive: true,
  };
  error.value = null;
};

const handleClose = () => {
  emit("update:isOpen", false);
  resetForm();
};

const handleSubmit = async () => {
  if (!formData.value.name) {
    error.value = "Vessel name is required";
    return;
  }

  error.value = null;
  const result = await createVessel({
    name: formData.value.name,
    imoNumber: formData.value.imoNumber || undefined,
    description: formData.value.description || undefined,
    isActive: formData.value.isActive,
  });

  if (result.success && result.data) {
    emit("success", { id: result.data.id, name: result.data.name });
    handleClose();
  } else {
    error.value = result.error || "Failed to create vessel";
  }
};
</script>

<template>
  <UiModal
    :model-value="isOpen"
    @update:model-value="(val) => emit('update:isOpen', val)"
    title="Add New Vessel"
    description="Register a new vessel to the system database"
    width="max-w-lg"
    @close="handleClose"
  >
    <form class="space-y-4 py-2" @submit.prevent="handleSubmit">
      <!-- Error Message -->
      <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg animate-shake">
        <p class="text-sm text-red-600 font-medium">{{ error }}</p>
      </div>

      <div class="space-y-1.5">
        <label class="text-sm font-semibold text-foreground flex items-center gap-2">
          <Ship class="w-4 h-4 text-muted-foreground" />
          Vessel Name <span class="text-red-500">*</span>
        </label>
        <input
          v-model="formData.name"
          type="text"
          placeholder="e.g. MV Ever Given"
          class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          required
          autofocus
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label class="text-sm font-semibold text-foreground">IMO Number</label>
          <input
            v-model="formData.imoNumber"
            type="text"
            placeholder="e.g. IMO9811000"
            class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-semibold text-foreground">Status</label>
          <div class="flex items-center gap-4 h-[42px]">
            <label class="flex items-center gap-2 cursor-pointer group">
              <input
                v-model="formData.isActive"
                type="radio"
                :value="true"
                class="w-4 h-4 text-[#012D5A] border-border focus:ring-primary"
              />
              <span class="text-sm text-foreground group-hover:text-blue-600 transition-colors"
                >Active</span
              >
            </label>
            <label class="flex items-center gap-2 cursor-pointer group">
              <input
                v-model="formData.isActive"
                type="radio"
                :value="false"
                class="w-4 h-4 text-[#012D5A] border-border focus:ring-primary"
              />
              <span class="text-sm text-foreground group-hover:text-red-600 transition-colors"
                >Inactive</span
              >
            </label>
          </div>
        </div>
      </div>

      <div class="space-y-1.5">
        <label class="text-sm font-semibold text-foreground">Description</label>
        <textarea
          v-model="formData.description"
          rows="3"
          placeholder="Enter vessel description or additional info..."
          class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
        />
      </div>
    </form>

    <template #footer>
      <div class="flex items-center justify-end gap-3 w-full">
        <button
          type="button"
          @click="handleClose"
          class="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg text-foreground hover:bg-gray-50 transition-all"
          :disabled="isLoading"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="handleSubmit"
          :disabled="isLoading || !formData.name"
          class="flex items-center gap-2 px-6 py-2 text-sm font-bold bg-[#012D5A] text-white rounded-lg hover:bg-[#012D5A]/90 shadow-md shadow-blue-900/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        >
          <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
          <Save v-else class="w-4 h-4" />
          {{ isLoading ? "Creating..." : "Create Vessel" }}
        </button>
      </div>
    </template>
  </UiModal>
</template>
