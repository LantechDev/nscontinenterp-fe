<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import { Save, Loader2, Plus, Pencil, Trash2 } from "lucide-vue-next";
import { useCompanies } from "~/composables/useCompanies";
import { useMasterData } from "~/composables/useMasterData";
import type { Address } from "~/composables/useMasterData";
import Combobox from "~/components/ui/Combobox.vue";
import MultiSelect from "~/components/ui/MultiSelect.vue";
import SearchSelect from "~/components/ui/SearchSelect.vue";
import Radio from "~/components/ui/Radio.vue";
import CompanyAddressModal from "./CompanyAddressModal.vue";
import type { AddressFormData } from "./CompanyAddressForm.vue";

const props = defineProps<{
  modelValue: boolean;
  mode?: "create" | "edit";
  company?: Company | null;
  presetName?: string;
  presetRole?: "customer" | "vendor" | "both";
}>();
const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "refresh"): void;
  (e: "success", company: Company): void;
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const isEditMode = computed(() => props.mode === "edit");
const { createCompany, updateCompany, createAddress, updateAddress, deleteAddress } =
  useCompanies();
const isSubmitting = ref(false);
const formError = ref<string | null>(null);
const companyAddresses = ref<Address[]>([]);
const isAddressModalOpen = ref(false);
const addressMode = ref<"add" | "edit">("add");
const editingAddress = ref<Address | null>(null);
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

const uppercase = (value: string) => value.toUpperCase();

const normalizeAddressCountry = (value: string) => {
  const countryMap: Record<string, string> = {
    id: "INDONESIA",
    sg: "SINGAPORE",
    my: "MALAYSIA",
  };
  return countryMap[value] || uppercase(value);
};

const toAddressPayload = (data: AddressFormData) => ({
  label: uppercase(data.label),
  fullAddress: uppercase(data.fullAddress),
  street: uppercase(data.street),
  city: uppercase(data.city),
  state: uppercase(data.state),
  postalCode: uppercase(data.postalCode),
  country: normalizeAddressCountry(data.country),
  eori: uppercase(data.eori),
});

const normalizePhone = (countryCode: string, rawValue: string) => {
  const digits = rawValue.replace(/\D/g, "");

  if (!digits) {
    return { value: "" };
  }

  const dialCode = dialCodeMap.value[countryCode];
  let nationalNumber = digits;
  if (dialCode && digits.startsWith(dialCode)) {
    nationalNumber = digits.slice(dialCode.length);
  }
  nationalNumber = nationalNumber.replace(/^0+/, "");

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
    name: props.presetName || "",
    email: "",
    phone: "",
    countryCode: "ID",
    isCustomer: props.presetRole
      ? props.presetRole === "customer" || props.presetRole === "both"
      : true,
    isVendor: props.presetRole
      ? props.presetRole === "vendor" || props.presetRole === "both"
      : false,
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
  companyAddresses.value = [];
  isAddressModalOpen.value = false;
  addressMode.value = "add";
  editingAddress.value = null;
  formError.value = null;
};
watch(isOpen, (val) => {
  if (!val) return;
  resetForm();
  if (isEditMode.value && props.company) {
    const parsedPhone = parsePhone(props.company.phone);
    selectedCountryCode.value = parsedPhone.countryCode;
    isActive.value = props.company.isActive ?? true;

    isActive.value = props.company.isActive ?? true;
    companyAddresses.value = props.company.addresses ? [...props.company.addresses] : [];

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

const openAddAddress = () => {
  if (!props.company?.id) return;
  addressMode.value = "add";
  editingAddress.value = null;
  isAddressModalOpen.value = true;
};

const openEditAddress = (address: Address) => {
  addressMode.value = "edit";
  editingAddress.value = address;
  isAddressModalOpen.value = true;
};

const emitCompanyAddressUpdate = () => {
  if (!props.company) return;
  emit("success", { ...props.company, addresses: companyAddresses.value });
};

const handleAddressSave = async (data: AddressFormData) => {
  if (!props.company?.id) {
    formError.value = "Company data is missing.";
    return;
  }

  const payload = toAddressPayload(data);
  const result =
    addressMode.value === "edit" && editingAddress.value
      ? await updateAddress(props.company.id, editingAddress.value.id, payload)
      : await createAddress(props.company.id, {
          ...payload,
          isDefault: companyAddresses.value.length === 0,
        });

  if (result.success && result.data) {
    companyAddresses.value =
      addressMode.value === "edit" && editingAddress.value
        ? companyAddresses.value.map((address) =>
            address.id === editingAddress.value?.id ? { ...address, ...result.data } : address,
          )
        : [...companyAddresses.value, result.data];
    isAddressModalOpen.value = false;
    editingAddress.value = null;
    emitCompanyAddressUpdate();
    emit("refresh");
  } else {
    formError.value = result.error || "Failed to save address";
  }
};

const handleDeleteAddress = async (addressId: string) => {
  if (!props.company?.id) return;
  const result = await deleteAddress(props.company.id, addressId);
  if (result.success) {
    companyAddresses.value = companyAddresses.value.filter((address) => address.id !== addressId);
    emitCompanyAddressUpdate();
    emit("refresh");
  } else {
    formError.value = result.error || "Failed to delete address";
  }
};

const loadPhoneOptions = async () => {
  try {
    const response =
      await $fetch<{ code: string; dial_code: string }[]>(`/api/master/phone-numbers`);
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
  if (!formData.value.name) {
    formError.value = "Please fill in all required fields (Name)";
    return;
  }
  if (isEditMode.value && !props.company?.id) {
    formError.value = "Company data is missing.";
    return;
  }
  const normalizedPhone = normalizePhone(formData.value.countryCode, formData.value.phone);
  isSubmitting.value = true;
  formError.value = null;
  const payload = {
    name: uppercase(formData.value.name),
    email: formData.value.email,
    phone: normalizedPhone.value,
    fullAddress: uppercase(formData.value.fullAddress),
    country: uppercase(formData.value.country),
    city: uppercase(formData.value.city),
    state: uppercase(formData.value.state),
    postalCode: uppercase(formData.value.postalCode),
    eori: uppercase(formData.value.eori),
    isCustomer: formData.value.isCustomer,
    isVendor: formData.value.isVendor,
    categoryId: formData.value.categoryId,
    isActive: isActive.value,
    description: uppercase(formData.value.description),
    notes: uppercase(formData.value.notes),
  };
  const result = isEditMode.value
    ? await updateCompany(props.company?.id || "", payload)
    : await createCompany(payload);
  if (result.success) {
    isOpen.value = false;
    if (result.data) emit("success", result.data);
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
              v-uppercase
              type="text"
              placeholder="Input name"
              class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-foreground">Email</label>
            <input
              v-model="formData.email"
              type="email"
              placeholder="Input email"
              class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
              v-uppercase
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-foreground">Phone number</label>
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
                v-uppercase
              />
            </div>
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
        <div class="flex items-center justify-between gap-3 mb-4">
          <h3 class="text-base font-bold text-foreground">Address</h3>
          <button
            v-if="isEditMode"
            type="button"
            class="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[#012D5A] rounded-lg hover:bg-[#012D5A]/90 transition-colors"
            @click="openAddAddress"
          >
            <Plus class="w-4 h-4" />
            Add Address
          </button>
        </div>

        <div v-if="isEditMode" class="space-y-3">
          <div
            v-if="companyAddresses.length === 0"
            class="rounded-lg border border-dashed border-border bg-muted/20 px-4 py-6 text-sm text-muted-foreground text-center"
          >
            No address yet.
          </div>
          <div
            v-for="address in companyAddresses"
            :key="address.id"
            class="rounded-lg border border-border bg-white p-4 flex items-start justify-between gap-4"
          >
            <div class="min-w-0 space-y-1">
              <div class="flex items-center gap-2">
                <p class="font-semibold text-foreground truncate">
                  {{ address.label || "Address" }}
                </p>
                <span
                  v-if="address.isDefault"
                  class="px-2 py-0.5 rounded-md bg-blue-50 text-[#012D5A] text-[11px] font-semibold"
                >
                  Default
                </span>
              </div>
              <p class="text-sm text-foreground whitespace-pre-line">{{ address.fullAddress }}</p>
              <p class="text-xs text-muted-foreground">
                {{
                  [address.city, address.state, address.postalCode, address.country]
                    .filter(Boolean)
                    .join(", ")
                }}
              </p>
            </div>
            <div class="flex items-center gap-1 shrink-0">
              <button
                type="button"
                class="p-2 rounded-md text-muted-foreground hover:text-[#012D5A] hover:bg-blue-50 transition-colors"
                @click="openEditAddress(address)"
                aria-label="Edit address"
              >
                <Pencil class="w-4 h-4" />
              </button>
              <button
                type="button"
                class="p-2 rounded-md text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
                @click="handleDeleteAddress(address.id)"
                aria-label="Delete address"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-foreground">Country</label>
            <input
              v-model="formData.country"
              v-uppercase
              type="text"
              placeholder="Input country"
              class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-foreground">City</label>
            <input
              v-model="formData.city"
              v-uppercase
              type="text"
              placeholder="Input city"
              class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div class="space-y-1.5 md:col-span-2">
            <label class="text-sm font-medium text-foreground">Full Address</label>
            <textarea
              v-model="formData.fullAddress"
              v-uppercase
              placeholder="Enter full address"
              rows="3"
              class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            ></textarea>
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-foreground">Postal/ Zip code</label>
            <input
              v-model="formData.postalCode"
              v-uppercase
              type="text"
              placeholder="Input postal code"
              class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-foreground">State</label>
            <input
              v-model="formData.state"
              v-uppercase
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
              v-uppercase
              placeholder="Enter company description"
              rows="3"
              class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            ></textarea>
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-foreground">Notes</label>
            <textarea
              v-model="formData.notes"
              v-uppercase
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

  <CompanyAddressModal
    v-if="isEditMode && props.company?.id"
    v-model="isAddressModalOpen"
    :mode="addressMode"
    :company-id="props.company.id"
    :address="editingAddress"
    @save="handleAddressSave"
  />
</template>
