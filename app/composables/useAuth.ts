import axios from "axios";
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

    // Create an axios instance with base URL and credentials
    const api = axios.create({
        baseURL: `${config.public.apiBase}/auth`,
        withCredentials: true,
    });

    const handleError = <T>(error: any): AuthResponse<T> => {
        const apiError = error.response?.data;
        const errorMessage =
            typeof apiError === "string"
                ? apiError
                : apiError?.message || error.message || "An error occurred";

        return {
            success: false,
            error: errorMessage,
        };
    };

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
        } catch (error: any) {
            return handleError(error);
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
        } catch (error: any) {
            return handleError(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function createUser(
        name: string,
        email: string,
        password: string,
        role: string
    ): Promise<AuthResponse<SignUpResponse>> {
        isLoading.value = true;
        try {
            const { data } = await api.post<SignUpResponse>("/admin/create-user", {
                name,
                email,
                password,
                role,
            });
            // Do not update user.value as this is an admin action creating ANOTHER user
            return { success: true, data };
        } catch (error: any) {
            return handleError(error);
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
        } catch (error: any) {
            return handleError(error);
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
        } catch (error: any) {
            return handleError(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function changePassword(
        currentPassword: string,
        newPassword: string
    ): Promise<AuthResponse> {
        isLoading.value = true;
        try {
            await api.post("/change-password", {
                currentPassword,
                newPassword,
            });
            return { success: true };
        } catch (error: any) {
            return handleError(error);
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
        } catch (error: any) {
            return handleError(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchUsers(): Promise<AuthResponse<UserListResponse>> {
        isLoading.value = true;
        try {
            const { data } = await api.get<UserListResponse>("/admin/list-users");
            return { success: true, data };
        } catch (error: any) {
            return handleError(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchUserById(id: string): Promise<AuthResponse<{ user: User }>> {
        isLoading.value = true;
        try {
            const { data } = await api.get<{ user: User }>("/admin/get-user", {
                params: { id },
            });
            return { success: true, data };
        } catch (error: any) {
            return handleError(error);
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
        }
    ): Promise<AuthResponse<{ user: User }>> {
        isLoading.value = true;
        try {
            const { data: responseData } = await api.post<{ user: User }>("/admin/update-user", {
                userId,
                data: data,
            });
            return { success: true, data: responseData };
        } catch (error: any) {
            return handleError(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function deleteUser(userId: string): Promise<AuthResponse> {
        isLoading.value = true;
        try {
            await api.post("/admin/delete-user", { userId });
            return { success: true };
        } catch (error: any) {
            return handleError(error);
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
    };

    async function listOrganizations(): Promise<AuthResponse<Organization[]>> {
        isLoading.value = true;
        try {
            const { data } = await api.get<Organization[]>("/organization/list");
            return { success: true, data };
        } catch (error: any) {
            return handleError(error);
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
            // Refresh session to update activeOrganizationId
            await fetchSession();
            return { success: true };
        } catch (error: any) {
            return handleError(error);
        } finally {
            isLoading.value = false;
        }
    }
}
