<script setup lang="ts">
interface Props {
  permissions: Record<string, string[]>;
  availableActions: string[];
  availableResources: { key: string; label: string; description: string }[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "toggle", resource: string, action: string): void;
  (e: "toggle-all", resource: string): void;
}>();

const hasPermission = (resource: string, action: string) => {
  return props.permissions[resource]?.includes(action) || false;
};

const isAllSelected = (resource: string) => {
  const current = props.permissions[resource];
  return current && current.length === props.availableActions.length;
};

const handleToggle = (resource: string, action: string) => {
  emit("toggle", resource, action);
};

const handleToggleAll = (resource: string) => {
  emit("toggle-all", resource);
};
</script>

<template>
  <div class="border border-border rounded-lg overflow-hidden bg-white">
    <table class="w-full text-sm">
      <thead class="bg-gray-50 border-b border-border">
        <tr>
          <th class="text-left py-3 px-4 font-medium text-muted-foreground w-1/3">Resource</th>
          <th
            v-for="action in availableActions"
            :key="action"
            class="text-center py-3 px-4 font-medium text-muted-foreground capitalize"
          >
            {{ action }}
          </th>
          <th class="text-center py-3 px-4 font-medium text-muted-foreground">All</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="resource in availableResources"
          :key="resource.key"
          class="border-b border-border last:border-0 hover:bg-gray-50/50 transition-colors"
        >
          <td class="py-3 px-4">
            <div class="font-medium text-foreground">{{ resource.label }}</div>
            <div class="text-xs text-muted-foreground">{{ resource.description }}</div>
          </td>
          <td v-for="action in availableActions" :key="action" class="text-center py-3 px-4">
            <div class="flex justify-center">
              <UiCheckbox
                :model-value="hasPermission(resource.key, action)"
                @update:model-value="handleToggle(resource.key, action)"
              />
            </div>
          </td>
          <td class="text-center py-3 px-4">
            <div class="flex justify-center">
              <UiCheckbox
                :model-value="isAllSelected(resource.key)"
                @update:model-value="handleToggleAll(resource.key)"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
