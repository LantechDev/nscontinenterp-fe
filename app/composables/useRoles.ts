import { type AuthResponse } from "../types/auth";

export interface Role {
  id: string;
  code: string;
  name: string;
  description?: string;
  permissions: Record<string, string[]>;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

type ErrorResponse = {
  message?: string;
  error?: string;
};

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "data" in error) {
    const errorData = (error as { data?: ErrorResponse }).data;
    if (errorData?.message) return errorData.message;
    if (errorData?.error) return errorData.error;
  }
  if (error instanceof Error) return error.message;
  return "An error occurred";
}

function handleApiError<T = unknown>(error: unknown): AuthResponse<T> {
  return { success: false, error: getErrorMessage(error) };
}

export function useRoles() {
  const config = useRuntimeConfig();
  const isLoading = ref(false);
  const roles = useState<Role[]>("roles-list", () => []);

  async function fetchRoles(): Promise<AuthResponse<Role[]>> {
    isLoading.value = true;
    try {
      const data = await $fetch<Role[]>(`${config.public.apiBase}/admin/roles`, {
        credentials: "include",
      });
      roles.value = data || [];
      return { success: true, data: roles.value };
    } catch (error) {
      return handleApiError<Role[]>(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function createRole(roleData: {
    code: string;
    name: string;
    description?: string;
    permissions: Record<string, string[]>;
  }): Promise<AuthResponse<Role>> {
    isLoading.value = true;
    try {
      const data = await $fetch<Role>(`${config.public.apiBase}/admin/roles`, {
        method: "POST",
        body: roleData,
        credentials: "include",
      });
      roles.value = [...roles.value, data];
      return { success: true, data };
    } catch (error) {
      return handleApiError<Role>(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function updateRole(
    id: string,
    roleData: {
      code?: string;
      name?: string;
      description?: string;
      permissions?: Record<string, string[]>;
    },
  ): Promise<AuthResponse<Role>> {
    isLoading.value = true;
    try {
      const data = await $fetch<Role>(`${config.public.apiBase}/admin/roles/${id}`, {
        method: "PUT",
        body: roleData,
        credentials: "include",
      });
      roles.value = roles.value.map((r) => (r.id === id ? { ...r, ...data } : r));
      return { success: true, data };
    } catch (error) {
      return handleApiError<Role>(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteRole(id: string): Promise<AuthResponse> {
    isLoading.value = true;
    try {
      await $fetch(`${config.public.apiBase}/admin/roles/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      roles.value = roles.value.filter((r) => r.id !== id);
      return { success: true };
    } catch (error) {
      return handleApiError(error);
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
    deleteRole,
  };
}
