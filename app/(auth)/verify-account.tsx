import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Pressable, TextInput, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Button } from "../../components/button";
import InterText from "../../components/inter-text";
import { AuthScreenLayout } from "../../components/layouts/AuthScreenLayout";
import { useAuthStore } from "../../store/authStore";

const CODE_LENGTH = 6;

export default function VerifyAccount() {
    const router = useRouter();
    const { verifyUser, resendVerificationCode } = useAuthStore();

    const { email } = useLocalSearchParams<{ email: string }>();

    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendIn, setResendIn] = useState(30);
    const inputRef = useRef<TextInput>(null);

    // if no email was passed, move the user back to register
    useEffect(() => {
        if (!email) {
            router.replace("/(auth)/register");
        }
    }, [email]);

    // resend email timer logic
    useEffect(() => {
        if (resendIn <= 0) return;
        const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
        return () => clearTimeout(t);
    }, [resendIn]);

    const maskedEmail = useMemo(() => {
        if (!email) return "";
        const [name, domain] = email.split("@");
        if (!domain) return email;
        const masked =
            name.length <= 2
                ? name[0] + "*"
                : name.slice(0, 2) + "*".repeat(Math.max(1, name.length - 2));
        return `${masked}@${domain}`;
    }, [email]);

    const handleSubmit = async (submitCode: string) => {
        if (!email || submitCode.length !== CODE_LENGTH) return;

        setLoading(true);
        try {
            const result = await verifyUser(email, submitCode);

            if (!result?.success) {
                Alert.alert("Invalid code", result.error || "The code you entered is incorrect.");
                setCode("");
                inputRef.current?.focus();
            }
        } catch {
            Alert.alert("Error", "Check your internet connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (!email) return;
        setResendIn(30);

        const result = await resendVerificationCode(email);

        if (!result?.success) {
            Alert.alert("Error", result.error || "Failed to resend code.");
            setResendIn(0);
        }
    };

    if (!email) return null;

    return (
        <AuthScreenLayout
            title="Verify your email"
            subtitle={
                <>
                    Enter the 6-digit code we sent to{" "}
                    <InterText style={styles.emailHighlight}>{maskedEmail}</InterText>
                </>
            }
        >
            <View style={styles.formContent}>
                {/* Native OTP Input Block */}
                <Pressable style={styles.otpContainer} onPress={() => inputRef.current?.focus()}>
                    {Array.from({ length: CODE_LENGTH }).map((_, index) => {
                        const digit = code[index] || "";
                        const isFocused =
                            index === code.length ||
                            (index === CODE_LENGTH - 1 && code.length === CODE_LENGTH);

                        return (
                            <View
                                key={index}
                                style={[styles.otpSlot, isFocused && styles.otpSlotFocused]}
                            >
                                <InterText style={styles.otpText}>{digit}</InterText>
                            </View>
                        );
                    })}

                    <TextInput
                        ref={inputRef}
                        value={code}
                        onChangeText={(val) => {
                            const cleanVal = val.replace(/[^0-9]/g, "").slice(0, CODE_LENGTH);
                            setCode(cleanVal);
                            if (cleanVal.length === CODE_LENGTH) {
                                handleSubmit(cleanVal);
                            }
                        }}
                        keyboardType="number-pad"
                        textContentType="oneTimeCode"
                        autoFocus
                        caretHidden
                        style={styles.hiddenInput}
                    />
                </Pressable>

                {/* Submit Button */}
                <Button
                    size="lg"
                    disabled={loading || code.length !== CODE_LENGTH}
                    onPress={() => handleSubmit(code)}
                >
                    {loading ? "Verifying..." : "Verify"}
                </Button>

                {/* Resend Timer Text */}
                <View style={styles.resendContainer}>
                    <InterText style={styles.resendText}>Didn't get the code? </InterText>
                    {resendIn > 0 ? (
                        <InterText style={styles.resendText}>Resend in {resendIn}s</InterText>
                    ) : (
                        <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
                            <InterText style={styles.resendLink}>Resend</InterText>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </AuthScreenLayout>
    );
}

const styles = StyleSheet.create((theme) => ({
    emailHighlight: {
        fontWeight: theme.typography.weights.medium,
        color: theme.colors.text,
    },
    formContent: {
        gap: 24,
    },
    otpContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
        position: "relative",
    },
    otpSlot: {
        width: 48,
        height: 56,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "transparent",
        backgroundColor: theme.colors.neutral3,
        justifyContent: "center",
        alignItems: "center",
    },
    otpSlotFocused: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.neutral1,
    },
    otpText: {
        fontSize: theme.typography.sizes.h4,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.text,
    },
    hiddenInput: {
        position: "absolute",
        width: 1,
        height: 1,
        opacity: 0,
    },
    resendContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 8,
    },
    resendText: {
        fontSize: theme.typography.sizes.s,
        color: theme.colors.neutral7,
    },
    resendLink: {
        fontSize: theme.typography.sizes.s,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.primary,
    },
}));
