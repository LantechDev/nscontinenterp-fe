import { useAuth } from "~/composables/useAuth";

export default defineNuxtPlugin(async (nuxtApp) => {
  // Use 'app:created' hook so auth state is populated BEFORE middleware runs.
  // Without this, middleware runs before fetchSession completes, causing a flash to /login.
  nuxtApp.hook("app:created", async () => {
    const { fetchSession } = useAuth();
    await fetchSession();
  });
});
