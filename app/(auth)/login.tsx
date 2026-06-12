import { Input } from "@/components/input";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Button } from "../../components/button";
import InterText from "../../components/inter-text";
import { AuthScreenLayout } from "../../components/layouts/AuthScreenLayout";
import { useAuthStore } from "../../store/authStore";

export default function Login() {
    const router = useRouter();
    const { login } = useAuthStore();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!email || !password) return;
        setLoading(true);
        try {
            const result = await login(email, password);

            if (!result?.success) {
                Alert.alert("Login failed", "Please check your credentials");
            }
        } catch {
            Alert.alert("Login failed", "Please check your credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthScreenLayout
            title="Welcome back"
            subtitle="Sign in to manage your smart lock"
            footer={
                <InterText style={styles.footerText}>
                    Don't have an account?{" "}
                    <InterText
                        style={styles.signUpLink}
                        onPress={() => router.replace("/(auth)/register")}
                    >
                        Sign Up
                    </InterText>
                </InterText>
            }
        >
            {/* Email Field */}
            <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                keyboardType="email-address"
            />

            {/* Password Field */}
            <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                isPassword
            />

            {/* Forgot Password Button */}
            <TouchableOpacity
                onPress={() => router.push("/(auth)/forgot-password")}
                style={styles.forgotPasswordButton}
            >
                <InterText style={styles.forgotPasswordText}>Forgot password?</InterText>
            </TouchableOpacity>

            {/* Action Block */}
            <View style={styles.actionBlock}>
                <Button size="lg" disabled={loading || !email || !password} onPress={handleSubmit}>
                    {loading ? "Signing in..." : "Sign In"}
                </Button>
            </View>
        </AuthScreenLayout>
    );
}

// Only the styles directly related to the login form remain
const styles = StyleSheet.create((theme) => ({
    forgotPasswordButton: {
        alignSelf: "flex-start",
        marginTop: 4,
    },
    forgotPasswordText: {
        fontSize: theme.typography.sizes.s,
        fontWeight: theme.typography.weights.medium,
        color: theme.colors.primary,
    },
    actionBlock: {
        marginTop: 32,
    },
    footerText: {
        fontSize: theme.typography.sizes.s,
        color: theme.colors.neutral7,
    },
    signUpLink: {
        fontWeight: theme.typography.weights.extrabold,
        color: theme.colors.primary,
    },
}));
