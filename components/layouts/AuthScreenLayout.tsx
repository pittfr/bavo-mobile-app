import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { KeyboardAvoidingView, Pressable, ScrollView, View } from "react-native";
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import InterText from "../../components/inter-text";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface AuthScreenLayoutProps {
    title: string;
    subtitle: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

export function AuthScreenLayout({ title, subtitle, children, footer }: AuthScreenLayoutProps) {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { theme } = useUnistyles();
    const pressProgress = useSharedValue(0);

    const animatedBackground = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                pressProgress.value,
                [0, 1],
                [theme.colors.neutral2, theme.colors.muted],
            ),
        };
    });

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }} keyboardVerticalOffset={0}>
                <ScrollView
                    automaticallyAdjustKeyboardInsets={true}
                    contentContainerStyle={[
                        styles.scrollContainer,
                        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 },
                    ]}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <AnimatedPressable
                            onPressIn={() =>
                                (pressProgress.value = withTiming(1, { duration: 150 }))
                            }
                            onPressOut={() =>
                                (pressProgress.value = withTiming(0, { duration: 150 }))
                            }
                            onPress={() => router.replace("/(auth)")}
                            style={[styles.backButton, animatedBackground]}
                        >
                            <ArrowLeft size={20} color={styles.iconColor.color} />
                        </AnimatedPressable>
                    </View>

                    <View style={styles.titleContainer}>
                        <InterText style={styles.title}>{title}</InterText>
                        <InterText style={styles.subtitle}>{subtitle}</InterText>
                    </View>

                    <View style={styles.form}>{children}</View>

                    {footer && <View style={styles.footer}>{footer}</View>}
                </ScrollView>
            </KeyboardAvoidingView>
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
        lineHeight: 24,
    },
    form: {
        flex: 1,
    },
    actionBlock: {
        marginTop: 32,
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
    footerLink: {
        fontWeight: theme.typography.weights.extrabold,
        color: theme.colors.primary,
    },
    iconColor: {
        color: theme.colors.text,
    },
}));
