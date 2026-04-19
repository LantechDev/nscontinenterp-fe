export default defineNuxtRouteMiddleware(async (to, _from) => {
  const { isLoggedIn, fetchSession, user } = useAuth();
  const { canAccessPath, ensureRolesLoaded } = useRoleAccess();

  const publicRoutes = ["/login", "/"];
  const isPublicRoute = publicRoutes.includes(to.path);

  if (process.server) {
    await fetchSession();
  } else {
    if (!user.value) {
      await fetchSession();
    }
  }

  // Redirect if not logged in and trying to access protected route
  if (!isLoggedIn.value && !isPublicRoute) {
    return navigateTo("/login");
  }

  // Handle organization selection for logged in users
  if (isLoggedIn.value) {
    const { user: authUser, session, listOrganizations, setActiveOrganization } = useAuth();

    if (!authUser.value?.activeOrganizationId && !session.value?.activeOrganizationId) {
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

  if (isLoggedIn.value && !isPublicRoute) {
    await ensureRolesLoaded();

    if (!canAccessPath(to.path)) {
      return navigateTo("/dashboard");
    }
  }
});
