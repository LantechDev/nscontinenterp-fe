export default defineNuxtRouteMiddleware(async (to, from) => {
    const { isLoggedIn, fetchSession, user, isLoading } = useAuth();
    
    const publicRoutes = ['/login'];
    const isPublicRoute = publicRoutes.includes(to.path);

    if (process.server) return;

    if (!user.value) {
        await fetchSession();
    }

    if (!isLoggedIn.value && !isPublicRoute) {
        return navigateTo('/login');
    }

    // Check for active organization and set defaults if missing
    if (isLoggedIn.value && !process.server) {
        // We can access session from useAuth (which we exposed) or fetch it if not available
        // Note: fetchSession already updates session state
        
        const { session, listOrganizations, setActiveOrganization } = useAuth();
        
        // If logged in but no active organization
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
        return navigateTo('/dashboard');
    }
});
