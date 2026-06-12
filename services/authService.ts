const OUTSYSTEMS_BASE_AUTH_URL = process.env.EXPO_PUBLIC_OUTSYSTEMS_AUTH_URL;

interface LoginResponse {
    token?: string;
    errorMessage?: string;
}

interface RegisterResponse {
    success: boolean;
    errorMessage?: string;
}

interface VerifyResponse {
    token?: string;
    errorMessage?: string;
}

interface ResendResponse {
    success?: boolean;
    errorMessage?: string;
}

export const authService = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
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
                return { errorMessage: data.errorMessage || "Invalid username or password." };
            }

            return { token: data.token };
        } catch (error) {
            console.error("Network Error during login:", error);
            return {
                errorMessage: "Check your internet connection.",
            };
        }
    },

    register: async (
        first_name: string,
        last_name: string,
        email: string,
        password: string,
    ): Promise<RegisterResponse> => {
        try {
            const response = await fetch(`${OUTSYSTEMS_BASE_AUTH_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName: first_name,
                    lastName: last_name,
                    email: email,
                    password: password,
                }),
            });

            const data = await response.json();

            if (!response.ok || data.success === false) {
                return {
                    success: false,
                    errorMessage: data.errorMessage || "Could not create account.",
                };
            }

            return { success: true };
        } catch (error) {
            console.error("Network Error during registration:", error);
            return {
                success: false,
                errorMessage: "Check your internet connection.",
            };
        }
    },

    resendVerificationCode: async (email: string): Promise<ResendResponse> => {
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
                    errorMessage: data.errorMessage || "Could not resend code.",
                };
            }

            return { success: true };
        } catch (error) {
            console.error("Network Error while trying to resend code:", error);

            return {
                success: false,
                errorMessage: "Check your internet connection.",
            };
        }
    },

    verifyUser: async (email: string, code: string): Promise<VerifyResponse> => {
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
                return { errorMessage: data.errorMessage || "Invalid or expired code." };
            }

            return { token: data.token };
        } catch (error) {
            console.error("Network Error while verifying user:", error);
            return {
                errorMessage: "Check your internet connection.",
            };
        }
    },
};
