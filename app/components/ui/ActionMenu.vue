<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { onClickOutside } from "@vueuse/core";

const isOpen = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);

const position = ref({ top: "0px", left: "0px", minWidth: "140px" });

const updatePosition = () => {
  if (triggerRef.value && menuRef.value) {
    const triggerRect = triggerRef.value.getBoundingClientRect();
    const menuRect = menuRef.value.getBoundingClientRect();

    let top = triggerRect.bottom + 4;
    let left = triggerRect.right - menuRect.width;

    // Check if it goes off bottom of screen
    if (top + menuRect.height > window.innerHeight) {
      top = triggerRect.top - menuRect.height - 4;
    }

    // Check if it goes off left of screen
    if (left < 0) {
      left = triggerRect.left;
    }

    position.value = {
      top: `${top}px`,
      left: `${left}px`,
      minWidth: `${Math.max(140, menuRect.width)}px`,
    };
  }
};

const toggle = async () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    await nextTick();
    updatePosition();
  }
};

const close = () => {
  isOpen.value = false;
};

onClickOutside(menuRef, (e) => {
  if (triggerRef.value && triggerRef.value.contains(e.target as Node)) {
    return;
  }
  close();
});

import { watch } from "vue";

const onScrollOrResize = () => {
  if (isOpen.value) {
    updatePosition();
  }
};

watch(isOpen, (newVal) => {
  if (newVal) {
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
  } else {
    window.removeEventListener("scroll", onScrollOrResize, true);
    window.removeEventListener("resize", onScrollOrResize);
  }
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScrollOrResize, true);
  window.removeEventListener("resize", onScrollOrResize);
});
</script>

<template>
  <div class="relative inline-block" ref="triggerRef">
    <div @click.stop="toggle" class="cursor-pointer inline-flex items-center justify-center">
      <slot name="trigger"></slot>
    </div>

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div
          v-if="isOpen"
          ref="menuRef"
          :style="{ top: position.top, left: position.left, minWidth: position.minWidth }"
          class="fixed z-[100] bg-white border border-border rounded-lg shadow-lg overflow-hidden py-1"
          @click.stop="close"
        >
          <slot name="content"></slot>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
