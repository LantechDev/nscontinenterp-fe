<script setup lang="ts">
import type {
  CompanyDetails,
  CompanyActivityLog,
  CompanyJob,
  CompanyInvoice,
} from "~/composables/useCompanies";
import type { Address } from "~/composables/useMasterData";
import CompanyActivityTab from "./CompanyActivityTab.vue";
import CompanyJobTab from "./CompanyJobTab.vue";
import CompanyInvoiceTab from "./CompanyInvoiceTab.vue";
import CompanyAddressTab from "./CompanyAddressTab.vue";
import CompanyNotesTab from "./CompanyNotesTab.vue";

const props = defineProps<{
  company: CompanyDetails;
  activeTab: string;
  tabList: string[];
  activeAddressMenu: string | null;
}>();

const emit = defineEmits<{
  (e: "update:activeTab", tab: string): void;
  (e: "add-address"): void;
  (e: "edit-address", id: string): void;
  (e: "delete-address", id: string): void;
  (e: "toggle-menu", id: string): void;
}>();

const addresses = computed<Address[]>(() => props.company.addresses || []);
const activities = computed<CompanyActivityLog[]>(() => props.company.activities || []);
const jobs = computed<CompanyJob[]>(() => props.company.jobs || []);
const invoices = computed<CompanyInvoice[]>(() => props.company.invoices || []);
const totalJobs = computed(() => props.company.totalJobs || 0);
</script>

<template>
  <div class="flex-1 self-stretch flex flex-col justify-center items-end gap-4 overflow-hidden">
    <div class="self-stretch flex-1 flex flex-col justify-start items-start overflow-hidden">
      <!-- Stats Widgets -->
      <div class="self-stretch p-4 flex justify-start items-center gap-4">
        <div
          class="flex-1 p-2 bg-slate-50 rounded-md shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] flex flex-col justify-center items-start"
        >
          <div class="justify-start text-gray-500 text-xs font-normal font-['Inter'] leading-4">
            Total Job
          </div>
          <div
            class="text-center justify-start text-black text-base font-semibold font-['Inter'] leading-6"
          >
            {{ totalJobs }}
          </div>
        </div>
        <div
          class="flex-1 p-2 bg-slate-50 rounded-md shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] flex flex-col justify-center items-start"
        >
          <div class="justify-start text-gray-500 text-xs font-normal font-['Inter'] leading-4">
            Type
          </div>
          <div
            class="text-center justify-start text-black text-base font-semibold font-['Inter'] leading-6"
          >
            <span v-if="company.isCustomer && company.isVendor">Both</span>
            <span v-else-if="company.isCustomer">Customer</span>
            <span v-else-if="company.isVendor">Vendor</span>
            <span v-else>-</span>
          </div>
        </div>
        <div
          class="flex-1 p-2 bg-slate-50 rounded-md shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] flex flex-col justify-center items-start"
        >
          <div class="justify-start text-gray-500 text-xs font-normal font-['Inter'] leading-4">
            Status
          </div>
          <div
            class="text-center justify-start text-[#012D5A] text-base font-semibold font-['Inter'] leading-6"
          >
            {{ company.isActive ? "Active" : "Inactive" }}
          </div>
        </div>
      </div>

      <!-- Tabs and Content Container -->
      <div
        class="self-stretch flex flex-col justify-start items-start gap-4 flex-1 overflow-hidden"
      >
        <!-- Tab Navigation -->
        <div
          class="self-stretch border-b border-black/5 flex justify-start items-start gap-2.5 overflow-hidden shrink-0"
        >
          <div
            v-for="tab in tabList"
            :key="tab"
            @click="emit('update:activeTab', tab)"
            :class="[
              'px-4 py-3 border-b inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden cursor-pointer transition-colors',
              activeTab === tab ? 'border-[#012D5A]' : 'border-transparent hover:border-gray-200',
            ]"
          >
            <div
              :class="[
                'justify-start text-xs leading-4',
                activeTab === tab
                  ? 'text-[#012D5A] font-semibold font-[\'Inter\']'
                  : 'text-black font-normal font-[\'Inter\']',
              ]"
            >
              {{ tab }}
            </div>
          </div>
        </div>

        <!-- Tab Content -->
        <div
          class="self-stretch px-4 flex flex-col justify-start items-start gap-4 overflow-y-auto flex-1 pb-4"
        >
          <CompanyActivityTab v-if="activeTab === 'Activity'" :activities="activities" />
          <CompanyJobTab
            v-else-if="activeTab === 'Job'"
            :jobs="jobs"
            :company-code="company.code"
          />
          <CompanyInvoiceTab v-else-if="activeTab === 'Invoice'" :invoices="invoices" />
          <CompanyAddressTab
            v-else-if="activeTab === 'Address'"
            :addresses="addresses"
            :active-address-menu="activeAddressMenu"
            @add-address="emit('add-address')"
            @edit-address="emit('edit-address', $event)"
            @delete-address="emit('delete-address', $event)"
            @toggle-menu="emit('toggle-menu', $event)"
          />
          <CompanyNotesTab v-else-if="activeTab === 'Notes'" :notes="company.notes" />
          <template v-else>
            <div class="w-full py-12 flex flex-col items-center justify-center text-gray-400">
              <p class="text-sm">No data available for {{ activeTab.toLowerCase() }} yet.</p>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
