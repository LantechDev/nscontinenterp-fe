<script setup lang="ts">
import { MapPinPlus, MoreVertical, Pencil, Trash2 } from "lucide-vue-next";
import type { Address } from "~/composables/useMasterData";

defineProps<{
  addresses: Address[];
  activeAddressMenu: string | null;
}>();

const emit = defineEmits<{
  (e: "add-address"): void;
  (e: "edit-address", id: string): void;
  (e: "delete-address", id: string): void;
  (e: "toggle-menu", id: string): void;
}>();
</script>

<template>
  <!-- Address Header with Add Button -->
  <div class="self-stretch flex justify-between items-center">
    <div class="text-black text-sm font-semibold font-['Inter'] leading-5">Address</div>
    <div
      class="bg-primary flex justify-end items-center gap-3 rounded-[6px] px-4 py-2 cursor-pointer hover:opacity-80"
      @click="emit('add-address')"
    >
      <MapPinPlus class="w-4 h-4 text-white" />
      <div class="text-white text-sm font-medium font-['Inter'] leading-5">Add Address</div>
    </div>
  </div>

  <!-- Address List -->
  <template v-if="addresses.length > 0">
    <div
      v-for="addr in addresses"
      :key="addr.id"
      class="self-stretch p-4 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col justify-center items-start gap-2 hover:bg-slate-50 transition-colors relative"
    >
      <div class="self-stretch flex justify-between items-start">
        <div class="flex-1 flex justify-start items-center gap-3">
          <div class="flex-1 flex flex-col justify-start items-start gap-1">
            <div class="self-stretch flex justify-between items-start">
              <div class="text-black text-sm font-semibold font-['Inter'] leading-5">
                {{ addr.label }}
              </div>
              <div class="address-menu-container relative">
                <MoreVertical
                  class="w-4 h-4 text-slate-500 cursor-pointer"
                  @click.stop="emit('toggle-menu', 'tab-' + addr.id)"
                />
                <!-- Popup Menu -->
                <div
                  v-if="activeAddressMenu === 'tab-' + addr.id"
                  class="absolute right-0 top-6 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50 min-w-[120px]"
                >
                  <div
                    class="px-3 py-2 hover:bg-slate-50 cursor-pointer flex items-center gap-2"
                    @click="emit('edit-address', 'tab-' + addr.id)"
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
            <div class="self-stretch text-gray-500 text-sm font-normal font-['Inter'] leading-5">
              {{ addr.fullAddress || "-" }}
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="addr.isDefault"
        class="px-2 py-0.5 bg-blue-50 rounded-md shadow-sm outline outline-1 outline-offset-[-1px] outline-blue-200 flex justify-start items-center gap-1 mt-1"
      >
        <div class="text-center text-blue-700 text-sm font-medium font-['Inter'] leading-5">
          Main
        </div>
      </div>
    </div>
  </template>
  <div v-else class="w-full py-8 flex flex-col items-center justify-center text-gray-400">
    <MapPinPlus class="w-8 h-8 mb-2 text-gray-300" />
    <p class="text-sm">No address available yet.</p>
  </div>
</template>
