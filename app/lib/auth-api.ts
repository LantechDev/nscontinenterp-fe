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

export const authApi = {
  async getSession(): Promise<AuthSession | null> {
    try {
      return await $fetch<AuthSession>(`${getApiBase()}/auth/get-session`, {
        credentials: "include",
      });
    } catch (error) {
      console.warn("[Auth] Session fetch failed:", error);
      return null;
    }
  },

  async signIn(email: string, password: string): Promise<AuthResponse<LoginResponse>> {
    try {
      const data = await $fetch<LoginResponse>(`${getApiBase()}/auth/sign-in/email`, {
        method: "POST",
        body: { email, password },
        credentials: "include",
      });
      return { success: true, data };
    } catch (error) {
      return handleApiError<LoginResponse>(error);
    }
  },

  async signOut(): Promise<AuthResponse> {
    try {
      await $fetch(`${getApiBase()}/auth/sign-out`, {
        method: "POST",
        credentials: "include",
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
    try {
      const data = await $fetch<SignUpResponse>(`${getApiBase()}/auth/admin/create-user`, {
        method: "POST",
        body: { name, email, password, role },
        credentials: "include",
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
      });
      return { success: true, data: responseData };
    } catch (error) {
      return handleApiError<{ user: User }>(error);
    }
  },

  async fetchUsers(): Promise<AuthResponse<UserListResponse>> {
    try {
      const data = await $fetch<UserListResponse>(`${getApiBase()}/admin/users`, {
        credentials: "include",
      });
      return { success: true, data };
    } catch (error) {
      return handleApiError<UserListResponse>(error);
    }
  },

  async fetchUserById(id: string): Promise<AuthResponse<{ user: User }>> {
    try {
      const data = await $fetch<{ user: User }>(`${getApiBase()}/admin/users`, {
        params: { id },
        credentials: "include",
      });
      return { success: true, data };
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
      });
      return { success: true };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async listOrganizations(): Promise<AuthResponse<Organization[]>> {
    try {
      const data = await $fetch<Organization[]>(`${getApiBase()}/auth/organization/list`, {
        credentials: "include",
      });
      return { success: true, data };
    } catch (error) {
      return handleApiError<Organization[]>(error);
    }
  },

  async setActiveOrganization(organizationId: string): Promise<AuthResponse> {
    try {
      await $fetch(`${getApiBase()}/auth/organization/set-active`, {
        method: "POST",
        body: { organizationId },
        credentials: "include",
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
      });
      return { success: true, data: responseData };
    } catch (error) {
      return handleApiError<Organization>(error);
    }
  },
};
