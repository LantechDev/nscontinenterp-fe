export default defineNuxtRouteMiddleware(async (to, _from) => {
  const { isLoggedIn, fetchSession, user } = useAuth();

  const publicRoutes = ["/login"];
  const isPublicRoute = publicRoutes.includes(to.path);

  if (process.server) return;

  if (!user.value) {
    await fetchSession();
  }

  if (!isLoggedIn.value && !isPublicRoute) {
    return navigateTo("/login");
  }

  if (isLoggedIn.value && !process.server) {
    const { session, listOrganizations, setActiveOrganization } = useAuth();

    if (session.value && !session.value.activeOrganizationId) {
      const { success, data: organizations } = await listOrganizations();
      if (success && organizations && organizations.length > 0) {
        // Auto-select the first organization
        const org = organizations[0];
        if (org) {
          await setActiveOrganization(org.id);
        }
      }
    }
  }

  if (isLoggedIn.value && isPublicRoute) {
    return navigateTo("/dashboard");
  }
});
