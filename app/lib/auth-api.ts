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

const TOKEN_KEY = "auth_token";
const TOKEN_EXPIRY_KEY = "auth_token_expiry";
const ACTIVE_ORG_KEY = "active_organization_id";

export function getStoredToken(): string | null {
  if (import.meta.server) return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string, expiresAt: string) {
  if (import.meta.server) return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiresAt);
}

export function clearStoredToken() {
  if (import.meta.server) return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
  localStorage.removeItem(ACTIVE_ORG_KEY);
}

export function getStoredOrgId(): string | null {
  if (import.meta.server) return null;
  return localStorage.getItem(ACTIVE_ORG_KEY);
}

export function setStoredOrgId(orgId: string) {
  if (import.meta.server) return;
  localStorage.setItem(ACTIVE_ORG_KEY, orgId);
  // Also set cookie for backend use
  document.cookie = `${ACTIVE_ORG_KEY}=${orgId}; path=/; max-age=31536000; SameSite=Lax`;
}

async function handleUnauthorized() {
  clearStoredToken();
  if (import.meta.client && window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

function getApiFetch() {
  const base = import.meta.server ? useRequestFetch() : $fetch;
  const token = getStoredToken();
  const fetchWithAuth = async (
    url: Parameters<typeof base>[0],
    opts?: Parameters<typeof base>[1],
  ) => {
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const existingHeaders = (opts as { headers?: Record<string, string> } | undefined)?.headers;
    try {
      const response = await base(url, {
        ...opts,
        headers: { ...existingHeaders, ...headers },
      } as Parameters<typeof base>[1]);

      // Check for 401 in response (ofetch wraps non-2xx as error)
      if (import.meta.client && (response as unknown as { status?: number }).status === 401) {
        await handleUnauthorized();
      }

      return response;
    } catch (err: unknown) {
      // ofetch throws FetchError with status field for non-2xx
      const fetchError = err as { status?: number; statusCode?: number };
      if (fetchError.status === 401 || fetchError.statusCode === 401) {
        await handleUnauthorized();
      }
      throw err;
    }
  };
  return fetchWithAuth as typeof base;
}

function normalizeOrganizationListResponse(
  response:
    | Organization[]
    | { data?: Organization[] }
    | { organizations?: Organization[] }
    | null
    | undefined,
) {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if ("data" in response && Array.isArray(response.data)) return response.data;
  if ("organizations" in response && Array.isArray(response.organizations))
    return response.organizations;
  return [];
}

export const authApi = {
  async getSession(): Promise<AuthSession | null> {
    try {
      const data = await getApiFetch()<AuthSession>("/api/auth/get-session");
      if (data?.sessionToken) {
        setStoredToken(data.sessionToken, data.session?.expiresAt || "");
      }
      return data;
    } catch (error) {
      console.warn("[Auth] Session fetch failed:", error);
      return null;
    }
  },

  async signIn(email: string, password: string): Promise<AuthResponse<LoginResponse>> {
    try {
      const data = await getApiFetch()<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });
      if (data.sessionToken) {
        setStoredToken(data.sessionToken, data.expiresAt || "");
      }
      if (data.activeOrganizationId) {
        setStoredOrgId(data.activeOrganizationId);
      }
      return { success: true, data };
    } catch (error) {
      return handleApiError<LoginResponse>(error);
    }
  },

  async signOut(): Promise<AuthResponse> {
    try {
      await getApiFetch()("/api/auth/logout", { method: "POST" });
      clearStoredToken();
      return { success: true };
    } catch (error) {
      clearStoredToken();
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
      const data = await getApiFetch()<SignUpResponse>("/api/auth/admin/create-user", {
        method: "POST",
        body: { name, email, password, role },
      });
      return { success: true, data };
    } catch (error) {
      return handleApiError<SignUpResponse>(error);
    }
  },

  async requestPasswordReset(email: string, redirectTo?: string): Promise<AuthResponse> {
    try {
      await getApiFetch()("/api/auth/request-password-reset", {
        method: "POST",
        body: { email, redirectTo },
      });
      return { success: true };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async resetPassword(newPassword: string, token: string): Promise<AuthResponse> {
    try {
      await getApiFetch()("/api/auth/reset-password", {
        method: "POST",
        body: { newPassword, token },
      });
      return { success: true };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<AuthResponse> {
    try {
      await getApiFetch()("/api/auth/change-password", {
        method: "POST",
        body: { currentPassword, newPassword },
      });
      return { success: true };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async updateUser(data: { name?: string; image?: string }): Promise<AuthResponse<{ user: User }>> {
    try {
      const responseData = await getApiFetch()<{ user: User }>("/api/auth/update-user", {
        method: "POST",
        body: data,
      });
      return { success: true, data: responseData };
    } catch (error) {
      return handleApiError<{ user: User }>(error);
    }
  },

  async fetchUsers(): Promise<AuthResponse<UserListResponse>> {
    try {
      const data = await getApiFetch()<UserListResponse>("/api/admin/users");
      return { success: true, data };
    } catch (error) {
      return handleApiError<UserListResponse>(error);
    }
  },

  async fetchUserById(id: string): Promise<AuthResponse<{ user: User }>> {
    try {
      const data = await getApiFetch()<User>(`/api/admin/users/${id}`);
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
      const responseData = await getApiFetch()<{ user: User }>(`/api/admin/users/${userId}`, {
        method: "PUT",
        body: data,
      });
      return { success: true, data: responseData };
    } catch (error) {
      return handleApiError<{ user: User }>(error);
    }
  },

  async deleteUser(userId: string): Promise<AuthResponse> {
    try {
      await getApiFetch()(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      return { success: true };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async listOrganizations(): Promise<AuthResponse<Organization[]>> {
    try {
      const response = await getApiFetch()<
        Organization[] | { data?: Organization[] } | { organizations?: Organization[] }
      >("/api/organization/list");
      return { success: true, data: normalizeOrganizationListResponse(response) };
    } catch (error) {
      return handleApiError<Organization[]>(error);
    }
  },

  async setActiveOrganization(organizationId: string): Promise<AuthResponse> {
    try {
      await getApiFetch()("/api/organization/set-active", {
        method: "POST",
        body: { organizationId },
      });
      setStoredOrgId(organizationId);
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
      const responseData = await getApiFetch()<Organization>("/api/auth/organization/create", {
        method: "POST",
        body: data,
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
      const responseData = await getApiFetch()<Organization>("/api/auth/organization/update", {
        method: "POST",
        body: { organizationId, data },
      });
      return { success: true, data: responseData };
    } catch (error) {
      return handleApiError<Organization>(error);
    }
  },
};
