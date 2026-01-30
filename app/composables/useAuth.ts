import axios, { type AxiosError } from "axios";
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

export function useAuth() {
  const user = useState<User | null>("auth-user", () => null);
  const session = useState<Session | null>("auth-session", () => null);
  const isLoading = useState<boolean>("auth-loading", () => true);
  const config = useRuntimeConfig();

  const api = axios.create({
    baseURL: `${config.public.apiBase}/auth`,
    withCredentials: true,
  });

  // Separate axios instance for admin routes (not under /auth)
  const adminApi = axios.create({
    baseURL: config.public.apiBase,
    withCredentials: true,
  });

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

    return {
      success: false,
      error: errorMessage,
    };
  }

  async function fetchSession(): Promise<AuthSession | null> {
    isLoading.value = true;
    try {
      const { data } = await api.get<AuthSession>("/get-session");
      user.value = data.user || null;
      session.value = data.session || null;
      return data;
    } catch {
      user.value = null;
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function login(email: string, password: string): Promise<AuthResponse<LoginResponse>> {
    isLoading.value = true;
    try {
      const { data } = await api.post<LoginResponse>("/sign-in/email", {
        email,
        password,
      });
      user.value = data.user || null;
      return { success: true, data };
    } catch (error) {
      return handleApiError<LoginResponse>(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function logout(): Promise<AuthResponse> {
    isLoading.value = true;
    try {
      await api.post("/sign-out", {});
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
      const { data } = await api.post<SignUpResponse>("/admin/create-user", {
        name,
        email,
        password,
        role,
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
      await api.post("/request-password-reset", {
        email,
        redirectTo,
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
      await api.post("/reset-password", {
        newPassword,
        token,
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
      await api.post("/change-password", {
        currentPassword,
        newPassword,
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
      const { data: responseData } = await api.post<{ user: User }>("/update-user", data);
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
      // Use custom admin endpoint that allows owner role
      const { data } = await adminApi.get<UserListResponse>("/admin/users");
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
      // Use custom admin endpoint
      const { data } = await adminApi.get<{ user: User }>("/admin/users", {
        params: { id },
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
      const { data: responseData } = await api.post<{ user: User }>("/admin/update-user", {
        userId,
        data: data,
      });
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
      await api.post("/admin/delete-user", { userId });
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
      const { data } = await api.get<Organization[]>("/organization/list");
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
      await api.post("/organization/set-active", {
        organizationId,
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
      const { data: responseData } = await api.post<Organization>("/organization/create", data);
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
      const { data: responseData } = await api.post<Organization>("/organization/update", {
        organizationId,
        data,
      });

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
