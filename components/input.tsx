import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import { TextInput, TextInputProps, TouchableOpacity, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import InterText from "./inter-text";

interface InputProps extends TextInputProps {
    label?: string;
    isPassword?: boolean;
}

export function Input({ label, isPassword, style, onFocus, onBlur, ...props }: InputProps) {
    const { theme } = useUnistyles();
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <View style={styles.container}>
            {label && <InterText style={styles.label}>{label}</InterText>}

            <View style={styles.inputWrapper}>
                <TextInput
                    style={[
                        styles.input,
                        isFocused && styles.inputFocused,
                        isPassword && styles.passwordPadding,
                        style,
                    ]}
                    onFocus={(e) => {
                        setIsFocused(true);
                        onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        onBlur?.(e);
                    }}
                    secureTextEntry={isPassword && !isPasswordVisible}
                    placeholderTextColor={theme.colors.muted}
                    autoCapitalize="none"
                    autoCorrect={false}
                    underlineColorAndroid="transparent"
                    {...props}
                />

                {isPassword && (
                    <TouchableOpacity
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        style={styles.eyeIcon}
                        activeOpacity={0.7}
                    >
                        {isPasswordVisible ? (
                            <EyeOff size={20} color={theme.colors.muted} />
                        ) : (
                            <Eye size={20} color={theme.colors.muted} />
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create((theme) => ({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: theme.typography.sizes.xs,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.muted,
        textTransform: "uppercase" as const,
        letterSpacing: 1,
        marginBottom: 6,
    },
    inputWrapper: {
        position: "relative",
        justifyContent: "center",
        padding: 1,
    },
    input: {
        height: 50,
        borderRadius: 16,
        backgroundColor: theme.colors.neutral3,
        paddingHorizontal: 20,
        fontSize: theme.typography.sizes.base,
        color: theme.colors.text,
        borderWidth: 2,
        borderColor: "transparent",
    },
    inputFocused: {
        borderColor: theme.colors.primary,
    },
    passwordPadding: {
        paddingRight: 56,
    },
    eyeIcon: {
        position: "absolute",
        right: 16,
        height: "100%",
        justifyContent: "center",
    },
}));
