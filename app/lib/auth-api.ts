import { handleApiError } from "~/lib/auth-utils";
import type {
  LoginResponse,
  SignUpResponse,
  UserListResponse,
  Organization,
  User,
  AuthResponse,
  AuthSession,
} from "~/types/auth";

function getApiBase() {
  const config = useRuntimeConfig();
  return config.public.apiBase as string;
}

function normalizeOrganizationListResponse(
  response:
    | Organization[]
    | { data?: Organization[] }
    | { organizations?: Organization[] }
    | null
    | undefined,
) {
  if (!response) {
    return [];
  }

  if (Array.isArray(response)) {
    return response;
  }

  if ("data" in response && Array.isArray(response.data)) {
    return response.data;
  }

  if ("organizations" in response && Array.isArray(response.organizations)) {
    return response.organizations;
  }

  return [];
}

export const authApi = {
  async getSession(): Promise<AuthSession | null> {
    const headers = useRequestHeaders(["cookie"]);
    try {
      return await $fetch<AuthSession>(`${getApiBase()}/auth/get-session`, {
        credentials: "include",
        headers,
      });
    } catch (error) {
      console.warn("[Auth] Session fetch failed:", error);
      return null;
    }
  },

  async signIn(email: string, password: string): Promise<AuthResponse<LoginResponse>> {
    const headers = useRequestHeaders(["cookie"]);
    try {
      const data = await $fetch<LoginResponse>(`${getApiBase()}/auth/login`, {
        method: "POST",
        body: { email, password },
        credentials: "include",
        headers,
      });
      return { success: true, data };
    } catch (error) {
      return handleApiError<LoginResponse>(error);
    }
  },

  async signOut(): Promise<AuthResponse> {
    const headers = useRequestHeaders(["cookie"]);
    try {
      await $fetch(`${getApiBase()}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers,
      });
      return { success: true };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async createUser(
    name: string,
    email: string,
    password: string,
    role: string,
  ): Promise<AuthResponse<SignUpResponse>> {
    const headers = useRequestHeaders(["cookie"]);
    try {
      const data = await $fetch<SignUpResponse>(`${getApiBase()}/auth/admin/create-user`, {
        method: "POST",
        body: { name, email, password, role },
        credentials: "include",
        headers,
      });
      return { success: true, data };
    } catch (error) {
      return handleApiError<SignUpResponse>(error);
    }
  },

  async requestPasswordReset(email: string, redirectTo?: string): Promise<AuthResponse> {
    try {
      await $fetch(`${getApiBase()}/auth/request-password-reset`, {
        method: "POST",
        body: { email, redirectTo },
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return { success: true };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async resetPassword(newPassword: string, token: string): Promise<AuthResponse> {
    try {
      await $fetch(`${getApiBase()}/auth/reset-password`, {
        method: "POST",
        body: { newPassword, token },
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return { success: true };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<AuthResponse> {
    try {
      await $fetch(`${getApiBase()}/auth/change-password`, {
        method: "POST",
        body: { currentPassword, newPassword },
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return { success: true };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async updateUser(data: { name?: string; image?: string }): Promise<AuthResponse<{ user: User }>> {
    try {
      const responseData = await $fetch<{ user: User }>(`${getApiBase()}/auth/update-user`, {
        method: "POST",
        body: data,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return { success: true, data: responseData };
    } catch (error) {
      return handleApiError<{ user: User }>(error);
    }
  },

  async fetchUsers(): Promise<AuthResponse<UserListResponse>> {
    const headers = useRequestHeaders(["cookie"]);
    try {
      const data = await $fetch<UserListResponse>(`${getApiBase()}/admin/users`, {
        credentials: "include",
        headers,
      });
      return { success: true, data };
    } catch (error) {
      return handleApiError<UserListResponse>(error);
    }
  },

  async fetchUserById(id: string): Promise<AuthResponse<{ user: User }>> {
    try {
      const data = await $fetch<User>(`${getApiBase()}/admin/users/${id}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return { success: true, data: { user: data } };
    } catch (error) {
      return handleApiError<{ user: User }>(error);
    }
  },

  async adminUpdateUser(
    userId: string,
    data: {
      name?: string;
      email?: string;
      password?: string;
      role?: string;
      status?: "active" | "inactive";
    },
  ): Promise<AuthResponse<{ user: User }>> {
    try {
      const responseData = await $fetch<{ user: User }>(`${getApiBase()}/auth/admin/update-user`, {
        method: "POST",
        body: { userId, data },
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return { success: true, data: responseData };
    } catch (error) {
      return handleApiError<{ user: User }>(error);
    }
  },

  async deleteUser(userId: string): Promise<AuthResponse> {
    try {
      await $fetch(`${getApiBase()}/auth/admin/delete-user`, {
        method: "POST",
        body: { userId },
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return { success: true };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async listOrganizations(): Promise<AuthResponse<Organization[]>> {
    try {
      const response = await $fetch<
        Organization[] | { data?: Organization[] } | { organizations?: Organization[] }
      >(`${getApiBase()}/organization/list`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return { success: true, data: normalizeOrganizationListResponse(response) };
    } catch (error) {
      return handleApiError<Organization[]>(error);
    }
  },

  async setActiveOrganization(organizationId: string): Promise<AuthResponse> {
    try {
      await $fetch(`${getApiBase()}/organization/set-active`, {
        method: "POST",
        body: { organizationId },
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return { success: true };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async createOrganization(data: {
    name: string;
    slug: string;
    logo?: string;
    metadata?: Record<string, unknown>;
  }): Promise<AuthResponse<Organization>> {
    try {
      const responseData = await $fetch<Organization>(`${getApiBase()}/auth/organization/create`, {
        method: "POST",
        body: data,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return { success: true, data: responseData };
    } catch (error) {
      return handleApiError<Organization>(error);
    }
  },

  async updateOrganization(
    organizationId: string,
    data: {
      name?: string;
      slug?: string;
      logo?: string;
      metadata?: Record<string, unknown>;
    },
  ): Promise<AuthResponse<Organization>> {
    try {
      const responseData = await $fetch<Organization>(`${getApiBase()}/auth/organization/update`, {
        method: "POST",
        body: { organizationId, data },
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return { success: true, data: responseData };
    } catch (error) {
      return handleApiError<Organization>(error);
    }
  },
};
