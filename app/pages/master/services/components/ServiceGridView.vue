<script setup lang="ts">
import { MoreVertical, Package } from "lucide-vue-next";
import { cn } from "~/lib/utils";

interface ServiceItem {
  id: string;
  name: string;
  code: string;
  unit: string;
  status: string;
}

defineProps<{
  services: ServiceItem[];
}>();

const emit = defineEmits<{
  (e: "row-click", id: string): void;
}>();

const handleClick = (id: string) => {
  emit("row-click", id);
};
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div
      v-for="service in services"
      :key="service.id"
      class="border border-border rounded-xl bg-white p-5 hover:shadow-sm transition-shadow cursor-pointer"
      @click="handleClick(service.id)"
    >
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
            <Package class="w-6 h-6 text-[#012D5A]" />
          </div>
          <div>
            <h3 class="font-bold text-base text-foreground">{{ service.name }}</h3>
            <p class="text-xs text-muted-foreground">{{ service.code }}</p>
          </div>
        </div>
        <button class="text-muted-foreground hover:text-foreground" @click.stop>
          <MoreVertical class="w-4 h-4" />
        </button>
      </div>

      <div class="space-y-1 mb-6">
        <p class="text-xs text-muted-foreground">{{ service.unit }}</p>
      </div>

      <div class="flex items-center justify-between pt-4 border-t border-border">
        <span
          :class="
            cn(
              'px-2 py-0.5 rounded border text-xs font-medium bg-white',
              service.status === 'Active'
                ? 'text-blue-500 border-blue-200'
                : 'text-red-500 border-red-200',
            )
          "
        >
          {{ service.status }}
        </span>
      </div>
    </div>
    <div v-if="services.length === 0" class="col-span-3 py-8 text-center text-muted-foreground">
      No services found
    </div>
  </div>
</template>
