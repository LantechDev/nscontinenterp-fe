<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { Address } from "~/composables/useMasterData";

const props = defineProps<{
  mode: "add" | "edit";
  companyId: string;
  address?: Address | null;
}>();

const emit = defineEmits<{
  (e: "cancel"): void;
  (e: "save", data: AddressFormData): void;
}>();

export interface AddressFormData {
  label: string;
  type: string;
  fullAddress: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  eori: string;
}

const defaultFormData: AddressFormData = {
  label: "",
  type: "main",
  fullAddress: "",
  street: "",
  city: "",
  state: "",
  postalCode: "",
  country: "id",
  eori: "",
};

const formData = ref<AddressFormData>({ ...defaultFormData });

// Watch for address prop changes to populate form in edit mode
watch(
  () => props.address,
  (newAddress) => {
    if (props.mode === "edit" && newAddress) {
      formData.value = {
        label: newAddress.label || "",
        type: "main", // Default type since it's not in Address type
        fullAddress: newAddress.fullAddress || "",
        street: newAddress.street || "",
        city: newAddress.city || "",
        state: newAddress.state || "",
        postalCode: newAddress.postalCode || "",
        country: newAddress.country || "id",
        eori: newAddress.eori || "",
      };
    } else if (props.mode === "add") {
      // Reset form for add mode
      formData.value = { ...defaultFormData };
    }
  },
  { immediate: true },
);

// Reset form when mode changes
watch(
  () => props.mode,
  (newMode) => {
    if (newMode === "add") {
      formData.value = { ...defaultFormData };
    }
  },
);

const isSubmitting = ref(false);

const handleSave = async () => {
  if (isSubmitting.value) return;

  isSubmitting.value = true;
  try {
    emit("save", formData.value);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="flex-1 self-stretch flex flex-col overflow-hidden">
    <!-- Form Content - Scrollable -->
    <div class="self-stretch flex-1 p-6 overflow-y-auto">
      <div class="self-stretch flex flex-col gap-6">
        <!-- Form Title -->
        <div class="text-black text-lg font-semibold font-['Inter'] leading-7">
          {{ mode === "add" ? "Add New Address" : "Edit Address" }}
        </div>

        <!-- Form -->
        <div class="self-stretch flex flex-col gap-4">
          <!-- Address Label -->
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-slate-700"
              >Address Label <span class="text-red-500">*</span></label
            >
            <input
              v-model="formData.label"
              type="text"
              placeholder="e.g., Head Office, Branch, Warehouse"
              class="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <!-- Address Type -->
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-slate-700">Type</label>
            <select
              v-model="formData.type"
              class="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="main">Main</option>
              <option value="branch">Branch</option>
              <option value="warehouse">Warehouse</option>
            </select>
          </div>

          <!-- Full Address -->
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-slate-700"
              >Full Address <span class="text-red-500">*</span></label
            >
            <textarea
              v-model="formData.fullAddress"
              rows="3"
              placeholder="Enter full address"
              class="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            ></textarea>
          </div>

          <!-- Street -->
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-slate-700">Street</label>
            <input
              v-model="formData.street"
              type="text"
              placeholder="Enter street name"
              class="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <!-- City & State - Two Columns -->
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-medium text-slate-700">City</label>
              <input
                v-model="formData.city"
                type="text"
                placeholder="Enter city"
                class="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-medium text-slate-700">State</label>
              <input
                v-model="formData.state"
                type="text"
                placeholder="Enter state/province"
                class="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <!-- Postal Code & Country - Two Columns -->
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-medium text-slate-700">Postal Code</label>
              <input
                v-model="formData.postalCode"
                type="text"
                placeholder="Enter postal code"
                class="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-medium text-slate-700">Country</label>
              <select
                v-model="formData.country"
                class="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="id">Indonesia</option>
                <option value="sg">Singapore</option>
                <option value="my">Malaysia</option>
              </select>
            </div>
          </div>

          <!-- EORI Number -->
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-slate-700">EORI Number</label>
            <input
              v-model="formData.eori"
              type="text"
              placeholder="Enter EORI number"
              class="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Form Actions - Fixed at bottom -->
    <div
      class="self-stretch border-t border-slate-300 flex justify-end gap-3 p-4 bg-white shrink-0"
    >
      <button
        class="px-4 py-2 border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-50 transition-colors"
        @click="emit('cancel')"
      >
        Cancel
      </button>
      <button
        class="px-4 py-2 bg-primary rounded-md text-sm text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
        :disabled="isSubmitting || !formData.label || !formData.fullAddress"
        @click="handleSave"
      >
        {{ mode === "add" ? "Add Address" : "Save Changes" }}
      </button>
    </div>
  </div>
</template>
