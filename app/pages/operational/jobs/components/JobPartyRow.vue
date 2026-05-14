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
    class="px-6 py-5 hover:bg-muted/5 transition-colors relative divide-y divide-border/10"
    :style="{ zIndex: zIndex }"
  >
    <!-- Top Row: Extra Controls (If any) -->
    <div v-if="hasExtraControls" class="grid grid-cols-12 gap-6 mb-3">
      <div class="col-span-2"></div>
      <div class="col-span-10">
        <slot name="extra-controls" />
      </div>
    </div>

    <!-- Main Row: Label + Inputs + Details -->
    <div class="grid grid-cols-12 gap-6 pt-3 first:pt-0">
      <!-- Label Column -->
      <div
        class="col-span-2 font-semibold text-[11px] pt-2.5 text-muted-foreground uppercase tracking-wider flex flex-col"
      >
        <span>{{ label }} <span v-if="required" class="text-destructive">*</span></span>
        <span v-if="description" class="text-[10px] font-normal lowercase mt-0.5 opacity-70">{{
          description
        }}</span>
      </div>

      <!-- Company Picker Column -->
      <div class="col-span-4">
        <Combobox
          v-model="companyId"
          :options="companies"
          label-key="name"
          value-key="id"
          placeholder="Select Company..."
          allow-create
          :disabled="disabledCompany"
          @create="(name) => emit('create', name)"
        />
      </div>

      <!-- Address Picker Column -->
      <div class="col-span-4">
        <Combobox
          v-model="addressId"
          :options="addressOptions"
          label-key="label"
          value-key="id"
          placeholder="Select Address..."
          :disabled="disabledAddress || !companyId"
        />
      </div>

      <!-- Details Column -->
      <div class="col-span-2 text-[11px] text-muted-foreground/80 space-y-1 leading-relaxed pt-2.5">
        <template v-if="addressDetails">
          <div
            class="border-b border-border/40 pb-1.5 mb-1.5 text-foreground leading-snug font-medium"
          >
            {{ addressDetails.fullAddress }}
          </div>
          <div class="flex justify-between items-center opacity-80">
            <span class="mr-2">Country:</span>
            <span class="text-foreground shrink-0">{{ addressDetails.country }}</span>
          </div>
          <div class="flex justify-between items-center opacity-80">
            <span class="mr-2">City:</span>
            <span class="text-foreground shrink-0">{{ addressDetails.city }}</span>
          </div>
          <div
            v-if="addressDetails.taxId"
            class="flex justify-between items-center opacity-80 pt-0.5"
          >
            <span class="mr-2">Tax ID:</span>
            <span class="text-foreground shrink-0">{{ addressDetails.taxId }}</span>
          </div>
        </template>
        <template v-else>
          <div
            class="text-center italic opacity-40 bg-muted/20 py-4 rounded-lg border border-dashed border-border/40 text-[10px]"
          >
            Select company
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
