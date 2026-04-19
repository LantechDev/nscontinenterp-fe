import { useAuth } from "~/composables/useAuth";

export default defineNuxtPlugin(async () => {
  if (import.meta.server) {
    const { fetchSession } = useAuth();
    await fetchSession();
  }
});
