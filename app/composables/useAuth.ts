import type { User, Session, AuthSession } from "../types/auth";
import { authApi } from "~/lib/auth-api";

export function useAuth() {
  const user = useState<User | null>("auth-user", () => null);
  const session = useState<Session | null>("auth-session", () => null);
  const isLoading = ref(true);

  async function fetchSession(): Promise<AuthSession | null> {
    isLoading.value = true;
    try {
      const data = await authApi.getSession();
      user.value = data?.user || null;
      session.value = data?.session || null;
      return data;
    } catch (error) {
      console.warn("[Auth] Session fetch failed:", error);
      user.value = null;
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function login(email: string, password: string) {
    isLoading.value = true;
    try {
      const result = await authApi.signIn(email, password);
      if (result.success && result.data) {
        user.value = result.data.user || null;
      }
      return result;
    } finally {
      isLoading.value = false;
    }
  }

  async function logout() {
    isLoading.value = true;
    try {
      const result = await authApi.signOut();
      if (result.success) user.value = null;
      return result;
    } finally {
      isLoading.value = false;
    }
  }

  async function createUser(name: string, email: string, password: string, role: string) {
    isLoading.value = true;
    try {
      return await authApi.createUser(name, email, password, role);
    } finally {
      isLoading.value = false;
    }
  }

  async function requestPasswordReset(email: string, redirectTo?: string) {
    isLoading.value = true;
    try {
      return await authApi.requestPasswordReset(email, redirectTo);
    } finally {
      isLoading.value = false;
    }
  }

  async function resetPassword(newPassword: string, token: string) {
    isLoading.value = true;
    try {
      return await authApi.resetPassword(newPassword, token);
    } finally {
      isLoading.value = false;
    }
  }

  async function changePassword(currentPassword: string, newPassword: string) {
    isLoading.value = true;
    try {
      return await authApi.changePassword(currentPassword, newPassword);
    } finally {
      isLoading.value = false;
    }
  }

  async function updateUser(data: { name?: string; image?: string }) {
    isLoading.value = true;
    try {
      const result = await authApi.updateUser(data);
      if (result.success && result.data?.user) {
        user.value = { ...user.value, ...result.data.user } as User;
      }
      return result;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchUsers() {
    isLoading.value = true;
    try {
      return await authApi.fetchUsers();
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchUserById(id: string) {
    isLoading.value = true;
    try {
      return await authApi.fetchUserById(id);
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
  ) {
    isLoading.value = true;
    try {
      return await authApi.adminUpdateUser(userId, data);
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteUser(userId: string) {
    isLoading.value = true;
    try {
      return await authApi.deleteUser(userId);
    } finally {
      isLoading.value = false;
    }
  }

  async function listOrganizations() {
    isLoading.value = true;
    try {
      return await authApi.listOrganizations();
    } finally {
      isLoading.value = false;
    }
  }

  async function setActiveOrganization(organizationId: string) {
    isLoading.value = true;
    try {
      const result = await authApi.setActiveOrganization(organizationId);
      if (result.success) await fetchSession();
      return result;
    } finally {
      isLoading.value = false;
    }
  }

  async function createOrganization(data: {
    name: string;
    slug: string;
    logo?: string;
    metadata?: Record<string, unknown>;
  }) {
    isLoading.value = true;
    try {
      return await authApi.createOrganization(data);
    } finally {
      isLoading.value = false;
    }
  }

  async function updateOrganization(
    organizationId: string,
    data: { name?: string; slug?: string; logo?: string; metadata?: Record<string, unknown> },
  ) {
    isLoading.value = true;
    try {
      return await authApi.updateOrganization(organizationId, data);
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
    createOrganization,
    updateOrganization,
  };
}
