import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, TextInput, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import InterText from "../../components/inter-text";
import { AuthScreenLayout } from "../../components/layouts/AuthScreenLayout";
import { useAuthStore } from "../../store/authStore";

const CODE_LENGTH = 6;

export default function ForgotPassword() {
    const { forgotPassword, resetPassword, resendVerificationCode } = useAuthStore();

    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [resendIn, setResendIn] = useState(30);
    const inputRef = useRef<TextInput>(null);

    // resend email timer logic
    useEffect(() => {
        if (step !== 2 || resendIn <= 0) return;
        const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
        return () => clearTimeout(t);
    }, [resendIn, step]);

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

    // get email
    const handleRequestCode = async () => {
        if (!email) return;

        setLoading(true);
        try {
            const result = await forgotPassword(email);
            if (result?.success) {
                setResendIn(30);
                setStep(2);
            } else {
                Alert.alert("Error", result.error || "Could not request reset code.");
            }
        } catch {
            Alert.alert("Error", "Check your internet connection.");
        } finally {
            setLoading(false);
        }
    };

    // resend otp
    const handleResend = async () => {
        if (!email) return;
        setResendIn(30);

        const result = await resendVerificationCode(email);
        if (result?.success) {
            Alert.alert("Success", "A new verification code was sent to your email.");
        } else {
            Alert.alert("Error", result.error || "Failed to resend code.");
            setResendIn(0);
        }
    };

    const handleFinalReset = async () => {
        if (!email || !code || !newPassword || !confirmPassword) return;

        if (newPassword !== confirmPassword) {
            Alert.alert("Validation Error", "Passwords do not match. Please re-enter.");
            return;
        }

        setLoading(true);
        try {
            const result = await resetPassword(email, code, newPassword);

            if (!result?.success) {
                Alert.alert("Reset Failed", result.error || "Invalid or expired code.");
                setStep(2);
            }
        } catch {
            Alert.alert("Error", "Check your internet connection.");
        } finally {
            setLoading(false);
        }
    };

    const getLayoutStrings = () => {
        switch (step) {
            case 1:
                return {
                    title: "Reset password",
                    subtitle: "A 6-digit verification code will be sent to your email.",
                };
            case 2:
                return {
                    title: "Verify your identity",
                    subtitle: `Enter the 6-digit code sent to ${maskedEmail}`,
                };
            case 3:
                return {
                    title: "Create new password",
                    subtitle: "Please secure your account with a strong password.",
                };
        }
    };

    const strings = getLayoutStrings();

    return (
        <AuthScreenLayout
            title={strings.title}
            subtitle={
                step === 2 ? (
                    <>
                        Enter the 6-digit code we sent to{" "}
                        <InterText style={styles.emailHighlight}>{maskedEmail}</InterText>
                    </>
                ) : (
                    strings.subtitle
                )
            }
        >
            <View style={styles.formContent}>
                {step === 1 && (
                    <>
                        <Input
                            label="Email"
                            value={email}
                            onChangeText={setEmail}
                            placeholder="your@email.com"
                            keyboardType="email-address"
                            editable={!loading}
                        />
                        <Button size="lg" disabled={loading || !email} onPress={handleRequestCode}>
                            {loading ? "Sending..." : "Send Reset Code"}
                        </Button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <TouchableOpacity
                            style={styles.otpContainer}
                            onPress={() => inputRef.current?.focus()}
                            activeOpacity={1}
                        >
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
                                    const cleanVal = val
                                        .replace(/[^0-9]/g, "")
                                        .slice(0, CODE_LENGTH);
                                    setCode(cleanVal);
                                    if (cleanVal.length === CODE_LENGTH) {
                                        setStep(3);
                                    }
                                }}
                                keyboardType="number-pad"
                                textContentType="oneTimeCode"
                                autoFocus
                                caretHidden
                                style={styles.hiddenInput}
                            />
                        </TouchableOpacity>

                        <Button
                            size="lg"
                            disabled={code.length !== CODE_LENGTH}
                            onPress={() => setStep(3)}
                            style={styles.continueButton}
                        >
                            Continue
                        </Button>

                        <View style={styles.resendContainer}>
                            <InterText style={styles.resendText}>Didn't get the code? </InterText>
                            {resendIn > 0 ? (
                                <InterText style={styles.resendText}>
                                    Resend in {resendIn}s
                                </InterText>
                            ) : (
                                <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
                                    <InterText style={styles.resendLink}>Resend</InterText>
                                </TouchableOpacity>
                            )}
                        </View>
                    </>
                )}

                {step === 3 && (
                    <>
                        <Input
                            label="New Password"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            placeholder="••••••••"
                            isPassword
                            editable={!loading}
                        />

                        <Input
                            label="Confirm New Password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="••••••••"
                            isPassword
                            editable={!loading}
                        />

                        <Button
                            size="lg"
                            disabled={loading || !newPassword || !confirmPassword}
                            onPress={handleFinalReset}
                        >
                            {loading ? "Updating..." : "Reset Password"}
                        </Button>
                    </>
                )}

                {step > 1 && (
                    <TouchableOpacity
                        onPress={() => setStep((s) => (s - 1) as 1 | 2)}
                        style={styles.backStepContainer}
                        disabled={loading}
                    >
                        <InterText style={styles.backStepText}>Go back to previous step</InterText>
                    </TouchableOpacity>
                )}
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
        gap: 6,
    },
    otpContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
        position: "relative",
        height: 56,
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
        width: "100%",
        height: "100%",
        opacity: 0,
    },
    continueButton: {
        marginTop: 18,
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
    backStepContainer: {
        alignSelf: "center",
        marginTop: 8,
    },
    backStepText: {
        fontSize: theme.typography.sizes.s,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.neutral7,
    },
}));
