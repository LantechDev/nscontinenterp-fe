<script setup lang="ts">
import { WifiOff } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { useNetwork } from "@vueuse/core";
import { h } from "vue";

const needRefresh = ref(false);
const hasShownUpdateToast = ref(false);

const showUpdateToast = (): void => {
  if (hasShownUpdateToast.value) return;
  hasShownUpdateToast.value = true;

  toast("Versi baru tersedia", {
    description: "Klik reload untuk memperbarui aplikasi.",
    duration: Infinity,
    action: {
      label: "Reload",
      onClick: () => {
        if (import.meta.client) {
          window.location.reload();
        }
      },
    },
  });
};

onMounted(async () => {
  if (!import.meta.client) return;
  if (!("serviceWorker" in navigator)) return;

  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) return;

  if (registration.waiting && navigator.serviceWorker.controller) {
    needRefresh.value = true;
  }

  registration.addEventListener("updatefound", () => {
    const installing = registration.installing;
    if (!installing) return;

    installing.addEventListener("statechange", () => {
      if (installing.state === "installed" && navigator.serviceWorker.controller) {
        needRefresh.value = true;
      }
    });
  });
});

watch(needRefresh, (value) => {
  if (value) showUpdateToast();
});

// Watch for offline state
if (import.meta.client) {
  const { isOnline } = useNetwork();
  watch(
    isOnline,
    (online) => {
      if (!online) {
        toast.error("You are offline", {
          description: "Some features may be limited.",
          icon: h(WifiOff, { class: "w-4 h-4" }),
        });
      } else {
        toast.success("Back online", {
          description: "Your connection has been restored.",
        });
      }
    },
    { immediate: false },
  );
}
</script>

<template>
  <div v-if="false"></div>
</template>
