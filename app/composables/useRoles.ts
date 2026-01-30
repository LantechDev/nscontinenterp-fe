import axios, { type AxiosError } from "axios";

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

function handleApiError<T = unknown>(error: unknown): AuthResponse<T> {
  const axiosError = error as AxiosError<ErrorResponse>;
  const apiError = axiosError.response?.data;
  const errorMessage =
    typeof apiError === "string"
      ? apiError
      : apiError?.message || apiError?.error || axiosError.message || "An error occurred";

  return { success: false, error: errorMessage };
}

export function useRoles() {
  const config = useRuntimeConfig();
  const isLoading = useState<boolean>("roles-loading", () => false);
  const roles = useState<Role[]>("roles-list", () => []);

  const api = axios.create({
    baseURL: `${config.public.apiBase}`,
    withCredentials: true,
  });

  async function fetchRoles(): Promise<AuthResponse<Role[]>> {
    isLoading.value = true;
    try {
      const { data } = await api.get<Role[]>("/admin/roles");
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
      const { data } = await api.post<Role>("/admin/roles", roleData);
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
      const { data } = await api.put<Role>(`/admin/roles/${id}`, roleData);
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
      await api.delete(`/admin/roles/${id}`);
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
