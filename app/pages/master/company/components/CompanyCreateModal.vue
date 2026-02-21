<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { ChevronDown, Save, Loader2 } from "lucide-vue-next";
import { useCompanies, type CreateCompanyInput } from "~/composables/useCompanies";

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "refresh"): void;
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const { createCompany } = useCompanies();
const isSubmitting = ref(false);
const formError = ref<string | null>(null);
const formData = ref({
  name: "",
  email: "",
  phone: "",
  countryCode: "ID",
  isCustomer: true,
  isVendor: false,
  status: "active",
  country: "",
  city: "",
  fullAddress: "",
  postalCode: "",
  state: "",
  eoriNo: "",
  description: "",
  notes: "",
});

const resetForm = () => {
  formData.value = {
    name: "",
    email: "",
    phone: "",
    countryCode: "ID",
    isCustomer: true,
    isVendor: false,
    status: "active",
    country: "",
    city: "",
    fullAddress: "",
    postalCode: "",
    state: "",
    eoriNo: "",
    description: "",
    notes: "",
  };
  formError.value = null;
};
watch(isOpen, (val) => {
  if (val) resetForm();
});

const handleCreateCompany = async () => {
  if (!formData.value.name || !formData.value.email || !formData.value.phone) {
    formError.value = "Please fill in all required fields (Name, Email, Phone)";
    return;
  }
  isSubmitting.value = true;
  formError.value = null;
  const result = await createCompany({
    name: formData.value.name,
    email: formData.value.email,
    phone: formData.value.phone,
    fullAddress: formData.value.fullAddress,
    country: formData.value.country,
    city: formData.value.city,
    isCustomer: formData.value.isCustomer,
    isVendor: formData.value.isVendor,
    description: formData.value.description,
    notes: formData.value.notes,
  });
  if (result.success) {
    isOpen.value = false;
    emit("refresh");
  } else {
    formError.value = result.error || "Failed to create company";
  }
  isSubmitting.value = false;
};
</script>

<template>
  <UiModal
    v-model="isOpen"
    title="Add new Company"
    description="Register your new Company"
    width="max-w-4xl"
  >
    <form class="space-y-6" @submit.prevent="handleCreateCompany">
      <!-- Error Message -->
      <div v-if="formError" class="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-sm text-red-600">{{ formError }}</p>
      </div>

      <!-- Company Detail -->
      <div>
        <h3 class="text-base font-bold text-foreground mb-4">Company Detail</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-foreground"
              >Name <span class="text-red-500">*</span></label
            >
            <input
              v-model="formData.name"
              type="text"
              placeholder="Input name"
              class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-foreground"
              >Email <span class="text-red-500">*</span></label
            >
            <input
              v-model="formData.email"
              type="email"
              placeholder="Input email"
              class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-foreground"
              >Phone number <span class="text-red-500">*</span></label
            >
            <div class="flex gap-2">
              <select
                v-model="formData.countryCode"
                class="w-24 px-2 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="ID">ID</option>
                <option value="US">US</option>
                <option value="SG">SG</option>
                <option value="MY">MY</option>
              </select>
              <input
                v-model="formData.phone"
                type="tel"
                placeholder="+62 812-3456-7890"
                class="flex-1 px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-foreground">Role</label>
            <div class="flex items-center gap-4 mt-2">
              <label class="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  v-model="formData.isCustomer"
                  class="rounded border-gray-300 text-primary focus:ring-primary"
                />
                Customer
              </label>
              <label class="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  v-model="formData.isVendor"
                  class="rounded border-gray-300 text-primary focus:ring-primary"
                />
                Vendor
              </label>
            </div>
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-foreground">Status</label>
            <div class="relative">
              <select
                v-model="formData.status"
                class="w-full px-3 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <ChevronDown
                class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="border-t border-border"></div>

      <!-- Address -->
      <div>
        <h3 class="text-base font-bold text-foreground mb-4">Address</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-foreground">Country</label>
            <input
              v-model="formData.country"
              type="text"
              placeholder="Input country"
              class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-foreground">City</label>
            <input
              v-model="formData.city"
              type="text"
              placeholder="Input city"
              class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div class="space-y-1.5 md:col-span-2">
            <label class="text-sm font-medium text-foreground">Full Address</label>
            <textarea
              v-model="formData.fullAddress"
              placeholder="Enter full address"
              rows="3"
              class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            ></textarea>
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-foreground">Postal/ Zip code</label>
            <input
              v-model="formData.postalCode"
              type="text"
              placeholder="Input postal code"
              class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-foreground">State</label>
            <input
              v-model="formData.state"
              type="text"
              placeholder="Input state"
              class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      <div class="border-t border-border"></div>

      <!-- Additional Info -->
      <div>
        <h3 class="text-base font-bold text-foreground mb-4">Additional Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-foreground">Description</label>
            <textarea
              v-model="formData.description"
              placeholder="Enter company description"
              rows="3"
              class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            ></textarea>
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-foreground">Notes</label>
            <textarea
              v-model="formData.notes"
              placeholder="Enter notes"
              rows="3"
              class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            ></textarea>
          </div>
        </div>
      </div>
    </form>

    <template #footer>
      <button
        type="button"
        @click="isOpen = false"
        class="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg text-foreground hover:bg-gray-50 transition-colors"
        :disabled="isSubmitting"
      >
        Cancel
      </button>
      <button
        type="button"
        @click="handleCreateCompany"
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
