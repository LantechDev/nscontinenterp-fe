<script setup lang="ts">
import { Save, Loader2, ChevronDown } from "lucide-vue-next";
import Combobox from "~/components/ui/Combobox.vue";

interface ServiceData {
  name?: string;
  code?: string;
  vendorPrice?: number | null;
  customerPrice?: number | null;
  currency?: string | null;
  taxRate?: number | string | null;
  isActive?: boolean;
  unitId?: string | null;
  categoryId?: string | null;
}

interface Props {
  isOpen: boolean;
  isSubmitting?: boolean;
  error?: string | null;
  initialData?: ServiceData | null;
}

const props = withDefaults(defineProps<Props>(), {
  isSubmitting: false,
  error: null,
  initialData: null,
});

const emit = defineEmits<{
  (e: "update:isOpen", value: boolean): void;
  (
    e: "submit",
    data: {
      name: string;
      code: string;
      vendorPrice: string;
      customerPrice: string;
      currency: string;
      taxRate: string;
      status: string;
      unitId: string;
      categoryId: string;
    },
  ): void;
}>();

const { categories, units, fetchCategories, fetchUnits } = useServices();

const categoryOptions = computed(() => categories.value.map((c) => ({ id: c.id, name: c.name })));
const unitOptions = computed(() => units.value.map((u) => ({ id: u.id, name: u.name })));

onMounted(async () => {
  if (categories.value.length === 0) await fetchCategories();
  if (units.value.length === 0) await fetchUnits();
});

const formData = ref({
  name: "",
  code: "",
  vendorPrice: "",
  customerPrice: "",
  currency: "IDR",
  taxRate: "0",
  status: "Active",
  unitId: "",
  categoryId: "",
});

const resetForm = () => {
  formData.value = {
    name: "",
    code: "",
    vendorPrice: "",
    customerPrice: "",
    currency: "IDR",
    taxRate: "0",
    status: "Active",
    unitId: "",
    categoryId: "",
  };
};

const syncForm = () => {
  if (props.initialData) {
    formData.value = {
      name: props.initialData.name || "",
      code: props.initialData.code || "",
      vendorPrice:
        props.initialData.vendorPrice !== undefined && props.initialData.vendorPrice !== null
          ? Number(props.initialData.vendorPrice).toLocaleString("id-ID")
          : "",
      customerPrice:
        props.initialData.customerPrice !== undefined && props.initialData.customerPrice !== null
          ? Number(props.initialData.customerPrice).toLocaleString("id-ID")
          : "",
      currency: props.initialData.currency || "IDR",
      taxRate: String(props.initialData.taxRate ?? "0"),
      status: props.initialData.isActive ? "Active" : "Inactive",
      unitId: props.initialData.unitId || "",
      categoryId: props.initialData.categoryId || "",
    };
  } else {
    resetForm();
  }
};

watch(
  () => props.initialData,
  () => syncForm(),
  { immediate: true },
);
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) syncForm();
  },
);

const handlePriceInput = (field: "vendorPrice" | "customerPrice", event: Event) => {
  const input = event.target as HTMLInputElement;
  const val = input.value;
  const numericValue = val.replace(/\D/g, "");
  if (numericValue === "") {
    formData.value[field] = "";
  } else {
    formData.value[field] = Number(numericValue).toLocaleString("id-ID");
  }
  // Force update the input element value to match formatted state
  input.value = formData.value[field];
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
    :title="initialData ? 'Edit Service' : 'Add new Service'"
    :description="initialData ? 'Modify service details' : 'Register your new Service'"
    width="max-w-3xl"
    @close="handleClose"
  >
    <form class="space-y-4 pb-32" @submit.prevent="handleSubmit">
      <!-- Error Message -->
      <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>

      <div class="grid grid-cols-2 gap-4">
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
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label class="text-sm font-medium text-foreground">Category</label>
          <Combobox
            v-model="formData.categoryId"
            :options="categoryOptions"
            placeholder="-- Select Category --"
          />
        </div>
        <div class="space-y-1.5">
          <label class="text-sm font-medium text-foreground">Unit</label>
          <Combobox
            v-model="formData.unitId"
            :options="unitOptions"
            placeholder="-- Select Unit --"
          />
        </div>
      </div>

      <div class="grid grid-cols-3 gap-4">
        <div class="space-y-1.5">
          <label class="text-sm font-medium text-foreground">Currency</label>
          <Combobox
            v-model="formData.currency"
            :options="[
              { id: 'IDR', name: 'IDR' },
              { id: 'USD', name: 'USD' },
              { id: 'EUR', name: 'EUR' },
            ]"
            placeholder="Select Currency"
          />
        </div>
        <div class="space-y-1.5">
          <label class="text-sm font-medium text-foreground">Tax Rate (%)</label>
          <Combobox
            v-model="formData.taxRate"
            :options="[
              { id: '0', name: '0%' },
              { id: '1.1', name: '1.1%' },
              { id: '11', name: '11%' },
            ]"
            placeholder="Select Tax Rate"
          />
        </div>
        <div class="space-y-1.5">
          <label class="text-sm font-medium text-foreground">Status</label>
          <Combobox
            v-model="formData.status"
            :options="[
              { id: 'Active', name: 'Active' },
              { id: 'Inactive', name: 'Inactive' },
            ]"
            placeholder="Select Status"
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label class="text-sm font-medium text-foreground">Cost Price (Vendor)</label>
          <div class="relative">
            <div
              class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium"
            >
              {{ formData.currency }}
            </div>
            <input
              :value="formData.vendorPrice"
              @input="handlePriceInput('vendorPrice', $event)"
              type="text"
              placeholder="0"
              class="w-full pl-12 pr-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        <div class="space-y-1.5">
          <label class="text-sm font-medium text-foreground"
            >Selling Price (Customer) <span class="text-red-500">*</span></label
          >
          <div class="relative">
            <div
              class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium"
            >
              {{ formData.currency }}
            </div>
            <input
              :value="formData.customerPrice"
              @input="handlePriceInput('customerPrice', $event)"
              type="text"
              placeholder="0"
              class="w-full pl-12 pr-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
              required
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
