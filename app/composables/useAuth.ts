import type {
  User,
  Session,
  AuthSession,
  LoginResponse,
  SignUpResponse,
  UserListResponse,
  AuthResponse,
  Organization,
} from "../types/auth";

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

export function useAuth() {
  const user = useState<User | null>("auth-user", () => null);
  const session = useState<Session | null>("auth-session", () => null);
  const isLoading = ref(true);
  const config = useRuntimeConfig();

  async function fetchSession(): Promise<AuthSession | null> {
    isLoading.value = true;
    try {
      const data = await $fetch<AuthSession>(`${config.public.apiBase}/auth/get-session`, {
        credentials: "include",
      });
      user.value = data.user || null;
      session.value = data.session || null;
      return data;
    } catch (error) {
      console.warn("[Auth] Session fetch failed:", error);
      user.value = null;
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function login(email: string, password: string): Promise<AuthResponse<LoginResponse>> {
    isLoading.value = true;
    try {
      const data = await $fetch<LoginResponse>(`${config.public.apiBase}/auth/sign-in/email`, {
        method: "POST",
        body: { email, password },
        credentials: "include",
      });
      user.value = data.user || null;
      return { success: true, data };
    } catch (error) {
      console.error("[Auth] Login failed:", error);
      return handleApiError<LoginResponse>(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function logout(): Promise<AuthResponse> {
    isLoading.value = true;
    try {
      await $fetch(`${config.public.apiBase}/auth/sign-out`, {
        method: "POST",
        credentials: "include",
      });
      user.value = null;
      return { success: true };
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function createUser(
    name: string,
    email: string,
    password: string,
    role: string,
  ): Promise<AuthResponse<SignUpResponse>> {
    isLoading.value = true;
    try {
      const data = await $fetch<SignUpResponse>(`${config.public.apiBase}/auth/admin/create-user`, {
        method: "POST",
        body: { name, email, password, role },
        credentials: "include",
      });
      return { success: true, data };
    } catch (error) {
      return handleApiError<SignUpResponse>(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function requestPasswordReset(email: string, redirectTo?: string): Promise<AuthResponse> {
    isLoading.value = true;
    try {
      await $fetch(`${config.public.apiBase}/auth/request-password-reset`, {
        method: "POST",
        body: { email, redirectTo },
        credentials: "include",
      });
      return { success: true };
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function resetPassword(newPassword: string, token: string): Promise<AuthResponse> {
    isLoading.value = true;
    try {
      await $fetch(`${config.public.apiBase}/auth/reset-password`, {
        method: "POST",
        body: { newPassword, token },
        credentials: "include",
      });
      return { success: true };
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<AuthResponse> {
    isLoading.value = true;
    try {
      await $fetch(`${config.public.apiBase}/auth/change-password`, {
        method: "POST",
        body: { currentPassword, newPassword },
        credentials: "include",
      });
      return { success: true };
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function updateUser(data: {
    name?: string;
    image?: string;
  }): Promise<AuthResponse<{ user: User }>> {
    isLoading.value = true;
    try {
      const responseData = await $fetch<{ user: User }>(
        `${config.public.apiBase}/auth/update-user`,
        {
          method: "POST",
          body: data,
          credentials: "include",
        },
      );
      if (responseData.user) {
        user.value = { ...user.value, ...responseData.user } as User;
      }
      return { success: true, data: responseData };
    } catch (error) {
      return handleApiError<{ user: User }>(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchUsers(): Promise<AuthResponse<UserListResponse>> {
    isLoading.value = true;
    try {
      const data = await $fetch<UserListResponse>(`${config.public.apiBase}/admin/users`, {
        credentials: "include",
      });
      return { success: true, data };
    } catch (error) {
      return handleApiError<UserListResponse>(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchUserById(id: string): Promise<AuthResponse<{ user: User }>> {
    isLoading.value = true;
    try {
      const data = await $fetch<{ user: User }>(`${config.public.apiBase}/admin/users`, {
        params: { id },
        credentials: "include",
      });
      return { success: true, data };
    } catch (error) {
      return handleApiError<{ user: User }>(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function adminUpdateUser(
    userId: string,
    data: {
      name?: string;
      email?: string;
      password?: string;
      role?: string;
      status?: "active" | "inactive";
    },
  ): Promise<AuthResponse<{ user: User }>> {
    isLoading.value = true;
    try {
      const responseData = await $fetch<{ user: User }>(
        `${config.public.apiBase}/auth/admin/update-user`,
        {
          method: "POST",
          body: { userId, data },
          credentials: "include",
        },
      );
      return { success: true, data: responseData };
    } catch (error) {
      return handleApiError<{ user: User }>(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteUser(userId: string): Promise<AuthResponse> {
    isLoading.value = true;
    try {
      await $fetch(`${config.public.apiBase}/auth/admin/delete-user`, {
        method: "POST",
        body: { userId },
        credentials: "include",
      });
      return { success: true };
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function listOrganizations(): Promise<AuthResponse<Organization[]>> {
    isLoading.value = true;
    try {
      const data = await $fetch<Organization[]>(`${config.public.apiBase}/auth/organization/list`, {
        credentials: "include",
      });
      return { success: true, data };
    } catch (error) {
      return handleApiError<Organization[]>(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function setActiveOrganization(organizationId: string): Promise<AuthResponse> {
    isLoading.value = true;
    try {
      await $fetch(`${config.public.apiBase}/auth/organization/set-active`, {
        method: "POST",
        body: { organizationId },
        credentials: "include",
      });
      await fetchSession();
      return { success: true };
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function createOrganization(data: {
    name: string;
    slug: string;
    logo?: string;
    metadata?: Record<string, unknown>;
  }): Promise<AuthResponse<Organization>> {
    isLoading.value = true;
    try {
      const responseData = await $fetch<Organization>(
        `${config.public.apiBase}/auth/organization/create`,
        {
          method: "POST",
          body: data,
          credentials: "include",
        },
      );
      return { success: true, data: responseData };
    } catch (error) {
      return handleApiError<Organization>(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function updateOrganization(
    organizationId: string,
    data: { name?: string; slug?: string; logo?: string; metadata?: Record<string, unknown> },
  ): Promise<AuthResponse<Organization>> {
    isLoading.value = true;
    try {
      const responseData = await $fetch<Organization>(
        `${config.public.apiBase}/auth/organization/update`,
        {
          method: "POST",
          body: { organizationId, data },
          credentials: "include",
        },
      );
      return { success: true, data: responseData };
    } catch (error) {
      return handleApiError<Organization>(error);
    } finally {
      isLoading.value = false;
    }
  }

  const isLoggedIn = computed(() => !!user.value);

  return {
    user,
    session,
    isLoggedIn,
    isLoading,
    fetchSession,
    login,
    logout,
    createUser,
    requestPasswordReset,
    resetPassword,
    changePassword,
    updateUser,
    fetchUsers,
    fetchUserById,
    adminUpdateUser,
    deleteUser,
    listOrganizations,
    setActiveOrganization,
    updateOrganization,
    createOrganization,
  };
}
