import { Input } from "@/components/input";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Button } from "../../components/button";
import InterText from "../../components/inter-text";
import { AuthScreenLayout } from "../../components/layouts/AuthScreenLayout";
import { useAuthStore } from "../../store/authStore";

export default function Register() {
    const router = useRouter();
    const { register } = useAuthStore();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!fullName || !email || !password) return;
        setLoading(true);

        const nameParts = fullName.trim().split(" ");
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

        try {
            const result = await register(firstName, lastName, email, password);

            if (!result?.success) {
                Alert.alert("Failed to create account", "Please check your credentials");
            }

            router.replace({ pathname: "/(auth)/verify-account", params: { email: email } });
        } catch {
            Alert.alert("Failed to create account", "Please check your credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthScreenLayout
            title="Create account"
            subtitle="Set up your smart lock in seconds"
            footer={
                <InterText style={styles.footerText}>
                    Already have an account?{" "}
                    <InterText
                        style={styles.signInLink}
                        onPress={() => router.replace("/(auth)/login")}
                    >
                        Sign In
                    </InterText>
                </InterText>
            }
        >
            {/* Name Field */}
            <Input
                label="Full Name"
                value={fullName}
                onChangeText={setFullName}
                placeholder="João Silva"
                keyboardType="default"
            />

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

            {/* Action Block */}
            <View style={styles.actionBlock}>
                <Button
                    size="lg"
                    disabled={loading || !email || !password || !fullName}
                    onPress={handleSubmit}
                >
                    {loading ? "Creating Account..." : "Create Account"}
                </Button>
            </View>
        </AuthScreenLayout>
    );
}

const styles = StyleSheet.create((theme) => ({
    actionBlock: {
        marginTop: 16,
    },
    footerText: {
        fontSize: theme.typography.sizes.s,
        color: theme.colors.neutral7,
    },
    signInLink: {
        fontWeight: theme.typography.weights.extrabold,
        color: theme.colors.primary,
    },
}));
