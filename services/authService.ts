const OUTSYSTEMS_BASE_AUTH_URL = process.env.EXPO_PUBLIC_OUTSYSTEMS_AUTH_URL;

interface TokenResponse {
    token?: string;
    error_message?: string;
}

interface SuccessResponse {
    success: boolean;
    error_message?: string;
}

const makeRequest = async (endpoint: string, payload: object) => {
    const response = await fetch(`${OUTSYSTEMS_BASE_AUTH_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return { response, data: await response.json() };
};

const fetchToken = async (
    endpoint: string,
    payload: object,
    defaultError: string,
): Promise<TokenResponse> => {
    try {
        const { response, data } = await makeRequest(endpoint, payload);

        if (!response.ok) {
            return { error_message: data.error_message || defaultError };
        }
        return { token: data.token };
    } catch (error) {
        console.error(`Network Error [${endpoint}]:`, error);
        return { error_message: "Check your internet connection." };
    }
};

const fetchSuccess = async (
    endpoint: string,
    payload: object,
    defaultError: string,
): Promise<SuccessResponse> => {
    try {
        const { response, data } = await makeRequest(endpoint, payload);

        if (!response.ok || data.success === false) {
            return { success: false, error_message: data.error_message || defaultError };
        }
        return { success: true };
    } catch (error) {
        console.error(`Network Error [${endpoint}]:`, error);
        return { success: false, error_message: "Check your internet connection." };
    }
};

export const authService = {
    login: async (email: string, password: string): Promise<TokenResponse> =>
        fetchToken(
            "/login",
            {
                email: email,
                password: password,
            },
            "Invalid username or password.",
        ),

    register: async (
        first_name: string,
        last_name: string,
        email: string,
        password: string,
    ): Promise<SuccessResponse> =>
        fetchSuccess(
            "/register",
            {
                first_name: first_name,
                last_name: last_name,
                email: email,
                password: password,
            },
            "Could not create account.",
        ),

    resendVerificationCode: async (email: string): Promise<SuccessResponse> =>
        fetchSuccess(
            "/resend-verification-code",
            {
                email: email,
            },
            "Could not resend code.",
        ),

    verifyUser: async (email: string, code: string): Promise<TokenResponse> =>
        fetchToken(
            "/verify-user",
            {
                email: email,
                code: code,
            },
            "Invalid or expired code.",
        ),

    forgotPassword: async (email: string): Promise<SuccessResponse> =>
        fetchSuccess(
            "/forgot-password",
            {
                email: email,
            },
            "Could not send code.",
        ),

    resetPassword: async (
        email: string,
        code: string,
        new_password: string,
    ): Promise<TokenResponse> =>
        fetchToken(
            "/reset-password",
            {
                email: email,
                code: code,
                new_password: new_password,
            },
            "Could not reset password.",
        ),

    logout: async (token: string): Promise<SuccessResponse> =>
        fetchSuccess(
            "/logout",
            {
                token: token,
            },
            "Could not log out.",
        ),
};
