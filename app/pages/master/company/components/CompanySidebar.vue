<script setup lang="ts">
import { Plus, Mail, Phone, MapPinPlus, Pencil, Trash2, MoreVertical } from "lucide-vue-next";
import type { CompanyDetails } from "~/composables/useCompanies";
import type { Address } from "~/composables/useMasterData";

const props = defineProps<{
  company: CompanyDetails;
  addresses: Address[];
  activeAddressMenu: string | null;
}>();

const emit = defineEmits<{
  (e: "new-job"): void;
  (e: "add-address"): void;
  (e: "edit-address", id: string): void;
  (e: "delete-address", id: string): void;
  (e: "toggle-menu", id: string): void;
  (e: "close-menu"): void;
}>();

const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return (
    date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB"
  );
};
</script>

<template>
  <div
    class="w-96 shrink-0 self-stretch p-5 border-r border-slate-200 flex flex-col justify-between items-start overflow-y-auto"
  >
    <div class="self-stretch flex flex-col justify-start items-start gap-4">
      <!-- Title & Code -->
      <div class="self-stretch inline-flex justify-start items-start">
        <div class="inline-flex flex-col justify-start items-start">
          <div class="text-black text-base font-semibold font-['Inter'] leading-6">
            {{ company.name }}
          </div>
          <div class="text-gray-500 text-sm font-normal font-['Inter'] leading-5">
            {{ company.code }}
          </div>
        </div>
      </div>

      <!-- New Job Button -->
      <div class="self-stretch inline-flex justify-center items-center gap-4">
        <div
          class="flex-1 px-4 py-2.5 bg-primary rounded-md flex justify-center items-center gap-1.5 cursor-pointer hover:bg-primary/90 transition-colors"
          @click="emit('new-job')"
        >
          <Plus class="w-4 h-4 text-white" />
          <div class="text-white text-sm font-medium font-['Inter'] leading-5">New Job</div>
        </div>
      </div>

      <!-- Description -->
      <div class="self-stretch flex flex-col justify-start items-start gap-4 mt-2">
        <div class="self-stretch flex flex-col justify-start items-start gap-2">
          <div class="text-black text-sm font-semibold font-['Inter'] leading-5">Description</div>
          <div class="self-stretch h-px bg-slate-100"></div>
        </div>
        <div class="self-stretch text-black text-sm font-normal font-['Inter'] leading-5">
          {{ company.description || "-" }}
        </div>
      </div>

      <!-- Contact Details -->
      <div class="self-stretch flex flex-col justify-start items-start gap-4 mt-2">
        <div class="self-stretch flex flex-col justify-start items-start gap-2">
          <div class="text-black text-sm font-semibold font-['Inter'] leading-5">
            Contact Details
          </div>
          <div class="self-stretch h-px bg-slate-100"></div>
        </div>
        <div class="self-stretch flex flex-col justify-start items-start gap-4">
          <div class="inline-flex justify-center items-center gap-2.5">
            <div
              class="p-2 bg-slate-100 rounded-full inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden"
            >
              <Mail class="w-4 h-4 text-[#012D5A]" />
            </div>
            <div class="inline-flex flex-col justify-center items-start">
              <div class="text-gray-500 text-sm font-normal font-['Inter'] leading-5">
                Email Address
              </div>
              <div class="text-black text-sm font-semibold font-['Inter'] leading-5">
                {{ company.email || "-" }}
              </div>
            </div>
          </div>
          <div class="inline-flex justify-center items-center gap-2.5">
            <div
              class="p-2 bg-slate-100 rounded-full inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden"
            >
              <Phone class="w-4 h-4 text-[#012D5A]" />
            </div>
            <div class="inline-flex flex-col justify-center items-start">
              <div class="text-gray-500 text-sm font-normal font-['Inter'] leading-5">Phone</div>
              <div class="text-black text-sm font-semibold font-['Inter'] leading-5">
                {{ company.phone || "-" }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Address Section -->
      <div class="self-stretch flex flex-col justify-start items-start gap-4 mt-2">
        <div class="self-stretch flex flex-col justify-start items-start gap-2">
          <div class="self-stretch inline-flex justify-between items-center">
            <div class="text-black text-sm font-semibold font-['Inter'] leading-5">Address</div>
            <div
              class="flex justify-end items-center gap-2 px-4 py-2 cursor-pointer hover:opacity-80"
              @click="emit('add-address')"
            >
              <MapPinPlus class="w-4 h-4 text-primary" />
              <div class="text-primary text-sm font-medium font-['Inter'] leading-5">
                Add Address
              </div>
            </div>
          </div>
          <div class="self-stretch h-px bg-slate-100"></div>
        </div>

        <!-- Address List -->
        <template v-if="addresses.length > 0">
          <div
            v-for="addr in addresses"
            :key="addr.id"
            class="self-stretch p-4 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col justify-center items-start gap-2 relative"
          >
            <div class="self-stretch inline-flex justify-between items-start">
              <div class="flex-1 flex justify-start items-center gap-3">
                <div class="flex-1 inline-flex flex-col justify-start items-start gap-1">
                  <div class="self-stretch inline-flex justify-between items-start">
                    <div class="text-black text-sm font-semibold font-['Inter'] leading-5">
                      {{ addr.label }}
                    </div>
                    <div class="address-menu-container relative">
                      <MoreVertical
                        class="w-4 h-4 text-slate-500 cursor-pointer"
                        @click.stop="emit('toggle-menu', addr.id)"
                      />
                      <!-- Popup Menu -->
                      <div
                        v-if="activeAddressMenu === addr.id"
                        class="absolute right-0 top-6 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50 min-w-[120px]"
                      >
                        <div
                          class="px-3 py-2 hover:bg-slate-50 cursor-pointer flex items-center gap-2"
                          @click="emit('edit-address', addr.id)"
                        >
                          <Pencil class="w-3.5 h-3.5 text-slate-600" />
                          <span class="text-sm text-slate-700">Edit</span>
                        </div>
                        <div
                          class="px-3 py-2 hover:bg-red-50 cursor-pointer flex items-center gap-2"
                          @click="emit('delete-address', addr.id)"
                        >
                          <Trash2 class="w-3.5 h-3.5 text-red-500" />
                          <span class="text-sm text-red-500">Delete</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="self-stretch text-gray-500 text-sm font-normal font-['Inter'] leading-5"
                  >
                    {{ addr.fullAddress || "-" }}
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="addr.isDefault"
              class="px-2 py-0.5 bg-blue-50 rounded-md shadow-sm outline outline-1 outline-offset-[-1px] outline-blue-200 inline-flex justify-start items-center gap-1 mt-1"
            >
              <div class="text-center text-blue-700 text-sm font-medium font-['Inter'] leading-5">
                Main
              </div>
            </div>
          </div>
        </template>
        <div
          v-else
          class="self-stretch text-gray-400 text-sm font-normal font-['Inter'] leading-5 py-4"
        >
          No address available
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="self-stretch flex flex-col justify-start items-start gap-3 mt-6">
      <div class="inline-flex justify-center items-center gap-2.5">
        <div class="inline-flex flex-col justify-center items-start">
          <div class="text-gray-400 text-sm font-normal font-['Inter'] leading-5">
            Created {{ formatDate(company.createdAt) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
