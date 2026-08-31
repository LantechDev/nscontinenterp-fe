<script setup lang="ts">
import Modal from "~/components/ui/Modal.vue";
import type { Address } from "~/composables/useMasterData";
import CompanyAddressForm, { type AddressFormData } from "./CompanyAddressForm.vue";

const props = defineProps<{
  modelValue: boolean;
  mode: "add" | "edit";
  companyId: string;
  address?: Address | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "save", data: AddressFormData): void;
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>

<template>
  <Modal
    v-model="isOpen"
    :title="mode === 'add' ? 'Add Address' : 'Edit Address'"
    :description="
      mode === 'add' ? 'Tambahkan alamat baru untuk company ini.' : 'Update alamat company ini.'
    "
    width="max-w-2xl"
    @close="emit('update:modelValue', false)"
  >
    <CompanyAddressForm
      :mode="mode"
      :company-id="companyId"
      :address="address"
      @cancel="isOpen = false"
      @save="emit('save', $event)"
    />
  </Modal>
</template>
