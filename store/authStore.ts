import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { authService } from "../services/authService";

interface AuthState {
    isAuthenticated: boolean;
    userToken: string | null;
    isLoading: boolean;
    checkLoginStatus: () => Promise<void>;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (
        firstName: string,
        lastName: string,
        email: string,
        password: string,
    ) => Promise<{ success: boolean; error?: string }>;
    resendVerificationCode: (email: string) => Promise<{ success: boolean; error?: string }>;
    verifyCode: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
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

    login: async (email, password) => {
        try {
            const result = await authService.login(email, password);

            if (result.token) {
                await SecureStore.setItemAsync("userToken", result.token);

                set({ userToken: result.token, isAuthenticated: true });
                return { success: true };
            } else {
                return { success: false, error: result.errorMessage || "Login failed" };
            }
        } catch (error) {
            return { success: false, error: "Server error" };
        }
    },

    register: async (firstName, lastName, email, password) => {
        const result = await authService.register(firstName, lastName, email, password);

        if (result.success) {
            return { success: true };
        } else {
            return { success: false, error: result.errorMessage || "Registration failed" };
        }
    },

    resendVerificationCode: async (email) => {
        const result = await authService.resendVerificationCode(email);

        if (result.success) {
            return { success: true };
        } else {
            return { success: false, error: result.errorMessage || "Failed to resend code" };
        }
    },

    verifyCode: async (email, code) => {
        try {
            const result = await authService.verifyCode(email, code);

            if (result.token) {
                await SecureStore.setItemAsync("userToken", result.token);

                set({ userToken: result.token, isAuthenticated: true });
                return { success: true };
            } else {
                return { success: false, error: result.errorMessage || "Code verification failed" };
            }
        } catch (error) {
            return { success: false, error: "Server error" };
        }
    },

    logout: async () => {
        try {
            await SecureStore.deleteItemAsync("userToken");
            set({ userToken: null, isAuthenticated: false });
        } catch (e) {
            console.error("Error deleting token", e);
        }
    },
}));
