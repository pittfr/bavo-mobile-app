const OUTSYSTEMS_BASE_AUTH_URL = process.env.EXPO_PUBLIC_OUTSYSTEMS_AUTH_URL;

interface TokenResponse {
    token?: string;
    error_message?: string;
}

interface SuccessResponse {
    success: boolean;
    error_message?: string;
}

export const authService = {
    login: async (email: string, password: string): Promise<TokenResponse> => {
        try {
            const response = await fetch(`${OUTSYSTEMS_BASE_AUTH_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                return { error_message: data.error_message || "Invalid username or password." };
            }

            return { token: data.token };
        } catch (error) {
            console.error("Network Error during login:", error);
            return {
                error_message: "Check your internet connection.",
            };
        }
    },

    register: async (
        first_name: string,
        last_name: string,
        email: string,
        password: string,
    ): Promise<SuccessResponse> => {
        try {
            const response = await fetch(`${OUTSYSTEMS_BASE_AUTH_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    password: password,
                }),
            });

            const data = await response.json();

            if (!response.ok || data.success === false) {
                return {
                    success: false,
                    error_message: data.error_message || "Could not create account.",
                };
            }

            return { success: true };
        } catch (error) {
            console.error("Network Error during registration:", error);
            return {
                success: false,
                error_message: "Check your internet connection.",
            };
        }
    },

    resendVerificationCode: async (email: string): Promise<SuccessResponse> => {
        try {
            const response = await fetch(`${OUTSYSTEMS_BASE_AUTH_URL}/resend-verification-code`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                }),
            });

            const data = await response.json();

            if (!response.ok || data.success === false) {
                return {
                    success: false,
                    error_message: data.error_message || "Could not resend code.",
                };
            }

            return { success: true };
        } catch (error) {
            console.error("Network Error while trying to resend code:", error);

            return {
                success: false,
                error_message: "Check your internet connection.",
            };
        }
    },

    verifyUser: async (email: string, code: string): Promise<TokenResponse> => {
        try {
            const response = await fetch(`${OUTSYSTEMS_BASE_AUTH_URL}/verify-user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    code: code,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                return { error_message: data.error_message || "Invalid or expired code." };
            }

            return { token: data.token };
        } catch (error) {
            console.error("Network Error while verifying user:", error);
            return {
                error_message: "Check your internet connection.",
            };
        }
    },
};
