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

  // Store last visited path for protected routes
  if (!isPublicRoute && isLoggedIn.value) {
    if (process.client) {
      localStorage.setItem("lastVisitedPath", to.fullPath);
    }
  }

  // Redirect if not logged in and trying to access protected route
  if (!isLoggedIn.value && !isPublicRoute) {
    if (process.client) {
      localStorage.setItem("redirectAfterLogin", to.fullPath);
    }
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

  // Redirect logged in users away from public routes to last visited page
  if (isLoggedIn.value && isPublicRoute) {
    let redirectTo = "/dashboard";
    if (process.client) {
      const lastPath = localStorage.getItem("lastVisitedPath");
      if (lastPath && lastPath !== "/login" && lastPath !== "/") {
        redirectTo = lastPath;
      }
    }
    return navigateTo(redirectTo);
  }

  if (isLoggedIn.value && !isPublicRoute) {
    await ensureRolesLoaded();

    if (!canAccessPath(to.path)) {
      return navigateTo("/dashboard");
    }
  }
});
