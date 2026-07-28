<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: "table" | "table-rows" | "cards" | "stats" | "form" | "job-form" | "inline";
    rows?: number;
    columns?: number;
    cards?: number;
  }>(),
  {
    variant: "table",
    rows: 6,
    columns: 6,
    cards: 6,
  },
);

const rowItems = computed(() => Array.from({ length: props.rows }, (_, index) => index));
const columnItems = computed(() => Array.from({ length: props.columns }, (_, index) => index));
const cardItems = computed(() => Array.from({ length: props.cards }, (_, index) => index));
</script>

<template>
  <tbody v-if="variant === 'table-rows'">
    <tr
      v-for="row in rowItems"
      :key="row"
      class="border-b border-border last:border-0 animate-pulse"
    >
      <td v-for="column in columnItems" :key="column" class="py-3 px-4">
        <div class="space-y-2">
          <div
            class="h-3 rounded bg-muted"
            :class="column === 0 ? 'w-28' : column % 2 === 0 ? 'w-24' : 'w-36'"
          />
          <div v-if="column === 0" class="h-2 w-16 rounded bg-muted" />
        </div>
      </td>
    </tr>
  </tbody>

  <div
    v-else-if="variant === 'table'"
    class="border border-border rounded-xl bg-white overflow-hidden shadow-sm"
  >
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-border bg-gray-50/50 text-left animate-pulse">
            <th v-for="column in columnItems" :key="column" class="py-3 px-4">
              <div
                class="h-3 rounded bg-muted"
                :class="column === 0 ? 'w-20' : column % 2 === 0 ? 'w-16' : 'w-24'"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in rowItems"
            :key="row"
            class="border-b border-border last:border-0 animate-pulse"
          >
            <td v-for="column in columnItems" :key="column" class="py-3 px-4">
              <div class="space-y-2">
                <div
                  class="h-3 rounded bg-muted"
                  :class="column === 0 ? 'w-28' : column % 2 === 0 ? 'w-24' : 'w-36'"
                />
                <div v-if="column === 0" class="h-2 w-16 rounded bg-muted" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-else-if="variant === 'cards'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div
      v-for="card in cardItems"
      :key="card"
      class="border border-border rounded-xl bg-white p-5 animate-pulse"
    >
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-lg bg-blue-50" />
          <div class="space-y-2 pt-1">
            <div class="h-4 w-28 rounded bg-muted" />
            <div class="h-3 w-36 rounded bg-muted" />
          </div>
        </div>
        <div class="h-7 w-14 rounded bg-muted" />
      </div>
      <div class="space-y-3 mb-4">
        <div class="h-3 w-44 rounded bg-muted" />
        <div class="h-3 w-52 rounded bg-muted" />
        <div class="flex gap-2 pt-1">
          <div class="h-5 w-24 rounded bg-muted" />
          <div class="h-5 w-20 rounded bg-muted" />
        </div>
      </div>
      <div class="flex items-center justify-between pt-4 border-t border-border">
        <div class="h-5 w-20 rounded bg-muted" />
        <div class="h-5 w-28 rounded bg-muted" />
      </div>
    </div>
  </div>

  <div v-else-if="variant === 'stats'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <div
      v-for="card in cardItems"
      :key="card"
      class="border border-border rounded-xl bg-white p-4 animate-pulse"
    >
      <div class="flex items-start justify-between gap-4">
        <div class="space-y-3 flex-1">
          <div class="h-3 w-24 rounded bg-muted" />
          <div class="h-7 w-28 rounded bg-muted" />
          <div class="h-3 w-20 rounded bg-muted" />
        </div>
        <div class="h-11 w-11 rounded-lg bg-blue-50" />
      </div>
    </div>
  </div>

  <div v-else-if="variant === 'form'" class="space-y-6 animate-pulse">
    <div class="border border-border rounded-xl bg-white p-6 space-y-5">
      <div class="space-y-2">
        <div class="h-5 w-40 rounded bg-muted" />
        <div class="h-3 w-64 rounded bg-muted" />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="item in 6" :key="item" class="space-y-2">
          <div class="h-3 w-20 rounded bg-muted" />
          <div class="h-10 rounded-lg bg-muted" />
        </div>
      </div>
      <div class="h-24 rounded-lg bg-muted" />
    </div>
  </div>

  <div v-else-if="variant === 'job-form'" class="flex gap-8 relative items-start animate-pulse">
    <aside class="w-60 shrink-0 hidden lg:block sticky top-36 h-fit">
      <div class="space-y-2">
        <div v-for="item in 6" :key="item" class="flex items-center gap-3 px-4 py-3">
          <div class="w-6 h-6 rounded-full bg-muted" />
          <div class="h-3 rounded bg-muted" :class="item % 2 === 0 ? 'w-28' : 'w-36'" />
        </div>
      </div>
    </aside>

    <main class="flex-1 w-full min-w-0">
      <div class="max-w-6xl mx-auto space-y-6 pb-20">
        <div
          v-for="section in 4"
          :key="section"
          class="border border-border rounded-xl bg-white overflow-hidden"
        >
          <div class="p-5 border-b border-border bg-white flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-muted" />
            <div class="space-y-2">
              <div class="h-4 w-40 rounded bg-muted" />
              <div class="h-3 w-56 rounded bg-muted" />
            </div>
          </div>

          <div class="p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
              <div v-for="field in 6" :key="field" class="space-y-2">
                <div class="h-3 w-24 rounded bg-muted" />
                <div class="h-11 rounded-lg bg-muted" />
              </div>
            </div>

            <div v-if="section === 2" class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div v-for="field in 4" :key="field" class="h-20 rounded-lg bg-muted" />
            </div>

            <div v-if="section === 3" class="space-y-3">
              <div class="h-12 rounded-lg bg-muted" />
              <div class="h-12 rounded-lg bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>

  <div v-else class="space-y-3 animate-pulse">
    <div class="h-4 w-48 rounded bg-muted" />
    <div class="h-3 w-64 rounded bg-muted" />
    <div class="h-3 w-40 rounded bg-muted" />
  </div>
</template>
