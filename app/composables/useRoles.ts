import axios from "axios";

export function useRoles() {
  const config = useRuntimeConfig();
  const isLoading = useState<boolean>('roles-loading', () => false);
  const roles = useState<any[]>('roles-list', () => []);

  // API instance for Role Management (Directly under /api based on spec)
  const api = axios.create({
    baseURL: config.public.apiBase, // Expecting http://localhost:9999/api
    withCredentials: true,
  });

  async function fetchRoles() {
    isLoading.value = true;
    try {
      const { data } = await api.get("/admin/roles");
      // Spec says response is an array of roles
      roles.value = data || [];
      return { success: true, data };
    } catch (error: any) {
      console.error("Error fetching roles:", error);
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    } finally {
      isLoading.value = false;
    }
  }

  async function createRole(roleData: { code: string; name: string; description?: string; permissions: Record<string, string[]> }) {
    isLoading.value = true;
    try {
      const { data } = await api.post("/admin/roles", roleData);
      // Optimistically update list or re-fetch
      await fetchRoles(); 
      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    } finally {
      isLoading.value = false;
    }
  }

  async function updateRole(id: string, roleData: { code?: string; name?: string; description?: string; permissions?: Record<string, string[]> }) {
    isLoading.value = true;
    try {
      const { data } = await api.put(`/admin/roles/${id}`, roleData);
      await fetchRoles();
      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteRole(id: string) {
    isLoading.value = true;
    try {
      await api.delete(`/admin/roles/${id}`);
      // Remove from local state
      roles.value = roles.value.filter(r => r.id !== id);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    } finally {
      isLoading.value = false;
    }
  }

  return {
    roles,
    isLoading,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole
  };
}
