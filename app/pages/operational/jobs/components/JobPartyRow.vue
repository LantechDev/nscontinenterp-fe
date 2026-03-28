<script setup lang="ts">
import { computed } from "vue";
import type { Company, Address } from "~/composables/useMasterData";
import Combobox from "~/components/ui/Combobox.vue";

const props = defineProps<{
  label: string;
  description?: string;
  required?: boolean;
  companies: Company[];
  disabledCompany?: boolean;
  disabledAddress?: boolean;
  zIndex?: string | number;
  hasExtraControls?: boolean;
}>();

const companyId = defineModel<string | null | undefined>("companyId");
const addressId = defineModel<string | null | undefined>("addressId");

const emit = defineEmits<{
  (e: "create", name: string): void;
}>();

const company = computed(() => props.companies.find((c) => c.id === companyId.value));
const addressOptions = computed(() => {
  return (company.value?.addresses || []).map((addr) => ({
    id: addr.id,
    label: `${addr.label || "Default"} (${addr.city || "No City"})`,
  }));
});

const addressDetails = computed(() => {
  if (!company.value || !addressId.value) return null;
  return company.value.addresses?.find((a: Address) => a.id === addressId.value);
});
</script>

<template>
  <div
    class="grid grid-cols-12 gap-6 p-6 items-start hover:bg-muted/5 transition-colors relative"
    :style="{ zIndex: zIndex }"
  >
    <div class="col-span-2 font-medium text-[14px] pt-2 text-foreground/90 flex flex-col">
      <span>{{ label }} <span v-if="required" class="text-destructive">*</span></span>
      <span v-if="description" class="text-muted-foreground font-normal text-xs mt-0.5">{{
        description
      }}</span>
    </div>

    <div class="col-span-4 space-y-1.5 transform transition-transform flex flex-col">
      <slot name="extra-controls" />
      <Combobox
        v-model="companyId"
        :options="companies as any"
        label-key="name"
        value-key="id"
        placeholder="Select Company..."
        allow-create
        :disabled="disabledCompany"
        @create="(name) => emit('create', name)"
      />
    </div>

    <div class="col-span-4" :class="{ 'pt-[36px]': hasExtraControls }">
      <Combobox
        v-model="addressId"
        :options="addressOptions"
        label-key="label"
        value-key="id"
        placeholder="Select Address..."
        :disabled="disabledAddress || !companyId"
      />
    </div>

    <div
      class="col-span-2 text-[12px] text-muted-foreground/80 space-y-1.5"
      :class="{ 'pt-[38px]': hasExtraControls, 'pt-2': !hasExtraControls }"
    >
      <template v-if="addressDetails">
        <div class="border-b border-border/40 pb-1.5 mb-1 text-foreground leading-tight">
          {{ addressDetails.fullAddress }}
        </div>
        <div class="flex justify-between border-b border-border/40 pb-1">
          <span class="mr-2">Country:</span>
          <span class="text-foreground font-medium text-right">{{ addressDetails.country }}</span>
        </div>
        <div
          class="flex justify-between"
          :class="{ 'border-b border-border/40 pb-1': addressDetails.taxId }"
        >
          <span class="mr-2">City:</span>
          <span class="text-foreground font-medium text-right">{{ addressDetails.city }}</span>
        </div>
        <div v-if="addressDetails.taxId" class="flex justify-between">
          <span class="mr-2">Tax ID:</span>
          <span class="text-foreground font-medium text-right">{{ addressDetails.taxId }}</span>
        </div>
      </template>
      <template v-else>
        <div
          class="text-center italic opacity-60 bg-muted/30 py-3 rounded-md border border-dashed border-border/60 text-[11px]"
        >
          Select company
        </div>
      </template>
    </div>
  </div>
</template>
