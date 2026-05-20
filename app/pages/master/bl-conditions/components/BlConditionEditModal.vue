<script setup lang="ts">
import Checkbox from "~/components/ui/Checkbox.vue";
import { Loader2 } from "lucide-vue-next";

defineProps<{
  isOpen: boolean;
  isSubmitting: boolean;
  editError: string | null;
  editingId: string | null;
  formData: {
    clauseNumber: string;
    clauseTitle: string;
    clauseContent: string;
    isActive: boolean;
  };
}>();

const emit = defineEmits<{
  close: [];
  submit: [];
}>();
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[1100] flex items-center justify-center">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50" @click="emit('close')"></div>

      <!-- Modal Content -->
      <div
        class="relative bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
      >
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-border">
          <h2 class="text-xl font-bold">{{ editingId ? "Edit Clause" : "Add New Clause" }}</h2>
          <button @click="emit('close')" class="p-1 hover:bg-muted rounded-lg transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Body -->
        <form @submit.prevent="emit('submit')" class="p-6 space-y-4">
          <div v-if="editError" class="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
            {{ editError }}
          </div>

          <div class="grid grid-cols-4 gap-4">
            <div class="col-span-1">
              <label class="block text-sm font-medium mb-1">Clause #</label>
              <input
                v-model="formData.clauseNumber"
                v-uppercase
                type="text"
                required
                placeholder="e.g. 1"
                class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div class="col-span-3">
              <label class="block text-sm font-medium mb-1">Clause Title</label>
              <input
                v-model="formData.clauseTitle"
                v-uppercase
                type="text"
                required
                placeholder="e.g. DEFINITIONS"
                class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Content</label>
            <textarea
              v-model.trim="formData.clauseContent"
              v-uppercase
              required
              rows="12"
              placeholder="Detailed clause text..."
              class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary font-mono text-sm leading-relaxed"
            ></textarea>
          </div>

          <div
            class="flex items-center gap-2 cursor-pointer w-fit group"
            @click="formData.isActive = !formData.isActive"
          >
            <Checkbox v-model="formData.isActive" class="pointer-events-none" />
            <span
              class="text-sm font-medium select-none group-hover:text-blue-900 transition-colors"
              >Active (Visible on eBL Back Page)</span
            >
          </div>

          <!-- Modal Footer -->
          <div class="flex justify-end gap-3 pt-4 border-t border-border mt-6">
            <button
              type="button"
              @click="emit('close')"
              class="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-4 py-2 text-sm font-medium bg-[#012D5A] text-white rounded-lg hover:bg-[#012D5A]/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
              {{ isSubmitting ? "Saving..." : editingId ? "Save Changes" : "Create Clause" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
