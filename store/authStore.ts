import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { authService } from "../services/authService";

interface SuccessResponse {
    success: boolean;
    error?: string;
}

interface AuthState {
    isAuthenticated: boolean;
    userToken: string | null;
    isLoading: boolean;
    checkLoginStatus: () => Promise<void>;
    login: (email: string, password: string) => Promise<SuccessResponse>;
    register: (
        firstName: string,
        lastName: string,
        email: string,
        password: string,
    ) => Promise<SuccessResponse>;
    resendVerificationCode: (email: string) => Promise<SuccessResponse>;
    verifyUser: (email: string, code: string) => Promise<SuccessResponse>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => {
    const handleTokenFlow = async (
        apiPromise: Promise<{ token?: string; errorMessage?: string }>,
        defaultError: string,
    ): Promise<SuccessResponse> => {
        try {
            const result = await apiPromise;
            if (result.token) {
                await SecureStore.setItemAsync("userToken", result.token);
                set({ userToken: result.token, isAuthenticated: true });
                return { success: true };
            }
            return { success: false, error: result.errorMessage || defaultError };
        } catch (error) {
            return { success: false, error: "Server error" };
        }
    };

    const handleSuccessFlow = async (
        apiPromise: Promise<{ success?: boolean; errorMessage?: string }>,
        defaultError: string,
    ): Promise<SuccessResponse> => {
        try {
            const result = await apiPromise;
            if (result.success) {
                return { success: true };
            }
            return { success: false, error: result.errorMessage || defaultError };
        } catch (error) {
            return { success: false, error: "Server error" };
        }
    };

    return {
        isAuthenticated: false,
        userToken: null,
        isLoading: true,

        checkLoginStatus: async () => {
            try {
                const token = await SecureStore.getItemAsync("userToken");
                if (token) {
                    set({ userToken: token, isAuthenticated: true });
                }
            } catch (e) {
                console.error("Error reading token", e);
            } finally {
                set({ isLoading: false });
            }
        },

        login: async (email, password) =>
            handleTokenFlow(authService.login(email, password), "Login failed"),

        register: async (firstName, lastName, email, password) =>
            handleSuccessFlow(
                authService.register(firstName, lastName, email, password),
                "Registration failed",
            ),

        resendVerificationCode: async (email) =>
            handleSuccessFlow(authService.resendVerificationCode(email), "Failed to resend code"),

        verifyUser: async (email, code) =>
            handleTokenFlow(authService.verifyUser(email, code), "User verification failed"),

        logout: async () => {
            try {
                await SecureStore.deleteItemAsync("userToken");
                set({ userToken: null, isAuthenticated: false });
            } catch (e) {
                console.error("Error deleting token", e);
            }
        },
    };
});
