<script setup lang="ts">
import { type AccessLevel, featureGroups, normalizeAccessLevel } from "~/lib/permission-registry";

const props = defineProps<{
  permissions: Record<string, AccessLevel>;
}>();

const emit = defineEmits<{
  (e: "update", feature: string, level: AccessLevel): void;
}>();

const levelLabels: Record<AccessLevel, string> = {
  none: "No Access",
  view: "View",
  manage: "Manage",
  approve: "Approve",
};

const getLevel = (feature: string) => normalizeAccessLevel(props.permissions[feature]);

const setLevel = (feature: string, level: AccessLevel) => {
  emit("update", feature, level);
};
</script>

<template>
  <div class="space-y-6">
    <div v-for="(features, group) in featureGroups" :key="group" class="space-y-3">
      <h3 class="text-sm font-semibold text-foreground">{{ group }}</h3>
      <div class="border border-border rounded-lg overflow-hidden bg-white">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-border">
            <tr>
              <th class="text-left py-3 px-4 font-medium text-muted-foreground w-[38%]">Feature</th>
              <th class="text-left py-3 px-4 font-medium text-muted-foreground">Access</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="feature in features"
              :key="feature.key"
              class="border-b border-border last:border-0 hover:bg-gray-50/50 transition-colors"
            >
              <td class="py-3 px-4 align-top">
                <div class="font-medium text-foreground">{{ feature.label }}</div>
                <div class="text-xs text-muted-foreground">{{ feature.description }}</div>
              </td>
              <td class="py-3 px-4">
                <div
                  class="inline-flex flex-wrap gap-1 rounded-lg border border-border bg-muted/30 p-1"
                >
                  <button
                    v-for="level in feature.levels"
                    :key="`${feature.key}-${level}`"
                    type="button"
                    class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors"
                    :class="
                      getLevel(feature.key) === level
                        ? 'bg-[#012D5A] text-white shadow-sm'
                        : 'text-muted-foreground hover:bg-white hover:text-foreground'
                    "
                    @click="setLevel(feature.key, level)"
                  >
                    {{ levelLabels[level] }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
