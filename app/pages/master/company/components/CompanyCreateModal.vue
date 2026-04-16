<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import { Save, Loader2 } from "lucide-vue-next";
import { useCompanies } from "~/composables/useCompanies";
import { useMasterData } from "~/composables/useMasterData";
import Combobox from "~/components/ui/Combobox.vue";
import MultiSelect from "~/components/ui/MultiSelect.vue";
import SearchSelect from "~/components/ui/SearchSelect.vue";
import Radio from "~/components/ui/Radio.vue";

const props = defineProps<{
  modelValue: boolean;
  mode?: "create" | "edit";
  company?: Company | null;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "refresh"): void;
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const isEditMode = computed(() => props.mode === "edit");
const { createCompany, updateCompany } = useCompanies();
const isSubmitting = ref(false);
const formError = ref<string | null>(null);
const phoneError = ref<string | null>(null);
const phoneOptions = ref<{ code: string; dialCode: string }[]>([
  { code: "ID", dialCode: "+62" },
  { code: "US", dialCode: "+1" },
  { code: "SG", dialCode: "+65" },
  { code: "MY", dialCode: "+60" },
]);
const selectedCountryCode = ref("ID");

const countryCodeOptions = computed(() =>
  phoneOptions.value.map((opt) => ({ id: opt.code, name: `${opt.code} ${opt.dialCode}` })),
);

const isActive = ref(true);

const { fetchCompanyCategories, createCompanyCategory } = useMasterData();
const categories = ref<{ id: string; name: string }[]>([]);
const isCategoryLoading = ref(false);

const loadCategories = async () => {
  isCategoryLoading.value = true;
  categories.value = await fetchCompanyCategories();
  isCategoryLoading.value = false;
};

const handleCreateCategory = async (name: string) => {
  const result = await createCompanyCategory(name);
  if (result.success && result.data) {
    await loadCategories();
    formData.value.categoryId = result.data.id;
  }
};

const roleOptions = [
  { id: "customer", name: "Customer" },
  { id: "vendor", name: "Vendor" },
];

const selectedRoles = computed({
  get: () => {
    const roles: string[] = [];
    if (formData.value.isCustomer) roles.push("customer");
    if (formData.value.isVendor) roles.push("vendor");
    return roles;
  },
  set: (roles: string[]) => {
    formData.value.isCustomer = roles.includes("customer");
    formData.value.isVendor = roles.includes("vendor");
  },
});

// Categories logic

const formData = ref({
  name: "",
  email: "",
  phone: "",
  countryCode: "ID",
  isCustomer: true,
  isVendor: false,
  isActive: true,
  categoryId: "",
  country: "",
  city: "",
  fullAddress: "",
  postalCode: "",
  state: "",
  eori: "",
  description: "",
  notes: "",
});

const dialCodeMap = computed(() => {
  const map: Record<string, string> = {};
  phoneOptions.value.forEach((option) => {
    map[option.code] = option.dialCode.replace(/\D/g, "");
  });
  return map;
});

const phoneRules: Record<
  string,
  {
    min: number;
    max: number;
  }
> = {
  ID: { min: 9, max: 13 },
  US: { min: 10, max: 10 },
  SG: { min: 8, max: 8 },
  MY: { min: 9, max: 10 },
};

const normalizePhone = (countryCode: string, rawValue: string) => {
  const dialCode = dialCodeMap.value[countryCode];
  const digits = rawValue.replace(/\D/g, "");

  if (!digits) {
    return { error: "Phone number is required." };
  }

  let nationalNumber = digits;
  if (dialCode && digits.startsWith(dialCode)) {
    nationalNumber = digits.slice(dialCode.length);
  }
  nationalNumber = nationalNumber.replace(/^0+/, "");

  const rule = phoneRules[countryCode];
  if (rule && (nationalNumber.length < rule.min || nationalNumber.length > rule.max)) {
    return {
      error: `Phone number length for ${countryCode} must be ${rule.min}${
        rule.max === rule.min ? "" : `-${rule.max}`
      } digits.`,
    };
  }

  return {
    value: dialCode ? `+${dialCode}${nationalNumber}` : rawValue,
  };
};

const parsePhone = (value?: string | null) => {
  if (!value) {
    return { countryCode: "ID", phone: "" };
  }
  const digits = value.replace(/\D/g, "");
  const match = Object.entries(dialCodeMap.value).find(([, dial]) => digits.startsWith(dial));
  if (match) {
    const [code, dial] = match;
    return {
      countryCode: code,
      phone: digits.slice(dial.length),
    };
  }
  return { countryCode: "ID", phone: value };
};

const resetForm = () => {
  isActive.value = true;
  selectedCountryCode.value = "ID";
  formData.value = {
    name: "",
    email: "",
    phone: "",
    countryCode: "ID",
    isCustomer: true,
    isVendor: false,
    isActive: true,
    categoryId: "",
    country: "",
    city: "",
    fullAddress: "",
    postalCode: "",
    state: "",
    eori: "",
    description: "",
    notes: "",
  };
  formError.value = null;
  phoneError.value = null;
};
watch(isOpen, (val) => {
  if (!val) return;
  resetForm();
  if (isEditMode.value && props.company) {
    const parsedPhone = parsePhone(props.company.phone);
    selectedCountryCode.value = parsedPhone.countryCode;
    isActive.value = props.company.isActive ?? true;

    isActive.value = props.company.isActive ?? true;

    formData.value = {
      name: props.company.name || "",
      email: props.company.email || "",
      phone: parsedPhone.phone,
      countryCode: parsedPhone.countryCode,
      isCustomer: props.company.isCustomer ?? true,
      isVendor: props.company.isVendor ?? false,
      isActive: props.company.isActive ?? true,
      categoryId: props.company.categoryId || "",
      country: props.company.addresses?.[0]?.country || "",
      city: props.company.addresses?.[0]?.city || "",
      fullAddress: props.company.addresses?.[0]?.fullAddress || "",
      postalCode: props.company.addresses?.[0]?.postalCode || "",
      state: props.company.addresses?.[0]?.state || "",
      eori: props.company.addresses?.[0]?.eori || "",
      description: props.company.description || "",
      notes: props.company.notes || "",
    };
  }
});

watch(
  () => [formData.value.phone, formData.value.countryCode],
  () => {
    phoneError.value = null;
  },
);

const loadPhoneOptions = async () => {
  const config = useRuntimeConfig();
  try {
    const response = await $fetch<{ code: string; dial_code: string }[]>(
      `${config.public.apiBase}/master/phone-numbers`,
      { credentials: "include" },
    );
    const mapped = response.map((item) => ({ code: item.code, dialCode: item.dial_code }));
    if (mapped.length > 0) {
      phoneOptions.value = mapped;
    }
  } catch {
    // Keep fallback options when API fails
  }
};

onMounted(() => {
  loadPhoneOptions();
  loadCategories();
});

const handleSubmitCompany = async () => {
  if (!formData.value.name || !formData.value.email || !formData.value.phone) {
    formError.value = "Please fill in all required fields (Name, Email, Phone)";
    return;
  }
  if (isEditMode.value && !props.company?.id) {
    formError.value = "Company data is missing.";
    return;
  }
  phoneError.value = null;
  const normalizedPhone = normalizePhone(formData.value.countryCode, formData.value.phone);
  if (normalizedPhone.error) {
    phoneError.value = normalizedPhone.error;
    return;
  }
  isSubmitting.value = true;
  formError.value = null;
  const payload = {
    name: formData.value.name,
    email: formData.value.email,
    phone: normalizedPhone.value,
    fullAddress: formData.value.fullAddress,
    country: formData.value.country,
    city: formData.value.city,
    state: formData.value.state,
    postalCode: formData.value.postalCode,
    eori: formData.value.eori,
    isCustomer: formData.value.isCustomer,
    isVendor: formData.value.isVendor,
    categoryId: formData.value.categoryId,
    isActive: isActive.value,
    description: formData.value.description,
    notes: formData.value.notes,
  };
  const result = isEditMode.value
    ? await updateCompany(props.company?.id || "", payload)
    : await createCompany(payload);
  if (result.success) {
    isOpen.value = false;
    emit("refresh");
  } else {
    formError.value = result.error || "Failed to save company";
  }
  isSubmitting.value = false;
};
</script>

<template>
  <UiModal
    v-model="isOpen"
    :title="isEditMode ? 'Edit Company' : 'Add new Company'"
    :description="isEditMode ? 'Update company information' : 'Register your new Company'"
    width="max-w-4xl"
  >
    <form class="space-y-6" @submit.prevent="handleSubmitCompany">
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
              <SearchSelect
                v-model="selectedCountryCode"
                :initial-options="countryCodeOptions"
                placeholder="Code"
                class="w-28"
              />
              <input
                v-model="formData.phone"
                type="tel"
                placeholder="812-3456-7890"
                class="flex-1 px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <p v-if="phoneError" class="text-xs text-red-500">{{ phoneError }}</p>
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-foreground">Status</label>
            <div class="flex items-center gap-4 h-[42px]">
              <label class="flex items-center gap-2 text-sm text-foreground cursor-pointer group">
                <Radio :value="true" v-model="isActive" />
                <span class="group-hover:text-[#012D5A] transition-colors">Active</span>
              </label>
              <label class="flex items-center gap-2 text-sm text-foreground cursor-pointer group">
                <Radio :value="false" v-model="isActive" />
                <span class="group-hover:text-[#012D5A] transition-colors">Inactive</span>
              </label>
            </div>
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-foreground">Role</label>
            <MultiSelect
              v-model="selectedRoles"
              :options="roleOptions"
              placeholder="Select roles..."
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-foreground">Type</label>
            <Combobox
              v-model="formData.categoryId"
              :options="categories"
              placeholder="Select type..."
              allow-create
              @create="handleCreateCategory"
            />
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
        @click="handleSubmitCompany"
        :disabled="isSubmitting"
        class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white rounded-lg hover:bg-[#012D5A]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
        <Save v-else class="w-4 h-4" />
        {{ isSubmitting ? "Saving..." : isEditMode ? "Update" : "Save" }}
      </button>
    </template>
  </UiModal>
</template>
