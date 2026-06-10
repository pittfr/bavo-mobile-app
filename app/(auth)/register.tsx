import { Input } from "@/components/input";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, Pressable, ScrollView, View } from "react-native";
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Button } from "../../components/button";
import InterText from "../../components/inter-text";
import { useAuthStore } from "../../store/authStore";
import "../../unistyles";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Register() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const { theme } = useUnistyles();

    const { register } = useAuthStore();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const pressProgress = useSharedValue(0);

    const animatedBackground = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            pressProgress.value,
            [0, 1],
            [theme.colors.neutral2, theme.colors.muted],
        );

        return {
            backgroundColor,
        };
    });

    const handleSubmit = async () => {
        if (!fullName || !email || !password) return;
        setLoading(true);

        const nameParts = fullName.trim().split(" ");

        const firstName = nameParts[0];

        const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

        try {
            await register(firstName, lastName, email, password);
            router.replace("/");
        } catch {
            Alert.alert("Failed to create account", "Please check your credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                automaticallyAdjustKeyboardInsets={true}
                contentContainerStyle={[
                    styles.scrollContainer,
                    { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 },
                ]}
                keyboardShouldPersistTaps="handled"
            >
                {/* Go Back Button */}
                <View style={styles.header}>
                    <AnimatedPressable
                        onPressIn={() => {
                            pressProgress.value = withTiming(1, { duration: 150 });
                        }}
                        onPressOut={() => {
                            pressProgress.value = withTiming(0, { duration: 150 });
                        }}
                        onPress={() => router.replace("/(auth)")}
                        style={[styles.backButton, animatedBackground]}
                    >
                        <ArrowLeft size={20} color={styles.iconColor.color} />
                    </AnimatedPressable>
                </View>

                <View style={styles.titleContainer}>
                    <InterText style={styles.title}>Create account</InterText>
                    <InterText style={styles.subtitle}>Set up your smart lock in seconds</InterText>
                </View>

                <View style={styles.form}>
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
                            disabled={loading || !email || !password}
                            onPress={handleSubmit}
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </Button>
                    </View>
                </View>

                {/* Bottom Redirection Block */}
                <View style={styles.footer}>
                    <InterText style={styles.footerText}>
                        Already have an account?{" "}
                        <InterText
                            style={styles.signInLink}
                            onPress={() => router.replace("/(auth)/login")}
                        >
                            Sign In
                        </InterText>
                    </InterText>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create((theme) => ({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 24,
    },
    header: {
        height: 48,
        justifyContent: "center",
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.muted,
        marginLeft: -8,
    },
    titleContainer: {
        marginTop: 32,
        marginBottom: 40,
    },
    title: {
        fontSize: theme.typography.sizes.h1,
        fontWeight: theme.typography.weights.extrabold,
        color: theme.colors.text,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: theme.typography.sizes.base,
        color: theme.colors.neutral7,
        marginTop: 8,
    },
    form: {
        flex: 1,
    },
    actionBlock: {
        marginTop: 16,
    },
    footer: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 24,
    },
    footerText: {
        fontSize: theme.typography.sizes.s,
        color: theme.colors.neutral7,
    },
    signInLink: {
        fontWeight: theme.typography.weights.extrabold,
        color: theme.colors.primary,
    },

    iconColor: {
        color: theme.colors.text,
    },
    placeholderColor: {
        color: theme.colors.muted,
    },
}));
