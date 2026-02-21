export default defineNuxtRouteMiddleware(async (to, _from) => {
  const { isLoggedIn, fetchSession, user } = useAuth();

  const publicRoutes = ["/login", "/"];
  const isPublicRoute = publicRoutes.includes(to.path);

  // Skip middleware on server to avoid hydration mismatch
  // The session will be fetched on client side
  if (process.server) {
    return;
  }

  // Fetch session if user is not set
  if (!user.value) {
    await fetchSession();
  }

  // Redirect if not logged in and trying to access protected route
  if (!isLoggedIn.value && !isPublicRoute) {
    return navigateTo("/login");
  }

  // Handle organization selection for logged in users
  if (isLoggedIn.value) {
    const { session, listOrganizations, setActiveOrganization } = useAuth();

    if (session.value && !session.value.activeOrganizationId) {
      const { success, data: organizations } = await listOrganizations();
      if (success && organizations && organizations.length > 0) {
        const org = organizations[0];
        if (org) {
          await setActiveOrganization(org.id);
        }
      }
    }
  }

  // Redirect logged in users away from public routes
  if (isLoggedIn.value && isPublicRoute) {
    return navigateTo("/dashboard");
  }
});
