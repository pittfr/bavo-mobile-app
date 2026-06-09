import React from "react";
import { StyleProp, TextStyle, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import "../unistyles";
import InterText from "./inter-text";

type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

interface ButtonProps extends TouchableOpacityProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    children: React.ReactNode;
    textStyle?: StyleProp<TextStyle>;
}

export function Button({
    variant = "default",
    size = "default",
    children,
    style,
    textStyle,
    disabled,
    ...props
}: ButtonProps) {
    return (
        <TouchableOpacity
            style={[styles.button(variant, size), disabled && styles.disabled, style]}
            disabled={disabled}
            activeOpacity={0.8}
            {...props}
        >
            {typeof children === "string" ? (
                <InterText style={[styles.text(variant, size), textStyle]}>{children}</InterText>
            ) : (
                children
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create((theme) => ({
    button: (variant: ButtonVariant, size: ButtonSize) => {
        // --- SIZES ---
        const sizeStyles = {
            default: { height: 48, paddingHorizontal: 16, borderRadius: 12 },
            sm: { height: 40, paddingHorizontal: 12, borderRadius: 8 },
            lg: { height: 56, paddingHorizontal: 24, borderRadius: 16 },
            icon: { height: 48, width: 48, borderRadius: 12, justifyContent: "center" as const },
        }[size];

        // --- VARIANTS (Backgrounds & Borders) ---
        const variantStyles = {
            default: { backgroundColor: theme.colors.primary },
            destructive: { backgroundColor: theme.colors.error },
            outline: {
                backgroundColor: "transparent",
                borderWidth: 1,
                borderColor: theme.colors.neutral4,
            },
            secondary: { backgroundColor: theme.colors.secondary },
            ghost: { backgroundColor: "transparent" },
            link: { backgroundColor: "transparent" },
        }[variant];

        return {
            flexDirection: "row" as const,
            alignItems: "center" as const,
            justifyContent: "center" as const,
            ...sizeStyles,
            ...variantStyles,
        };
    },

    text: (variant: ButtonVariant, size: ButtonSize) => {
        // --- TEXT SIZES ---
        const sizeStyles = {
            default: { fontSize: theme.typography.sizes.base },
            sm: { fontSize: theme.typography.sizes.s },
            lg: { fontSize: theme.typography.sizes.base },
            icon: { fontSize: theme.typography.sizes.base },
        }[size];

        // --- TEXT COLORS ---
        const variantStyles = {
            default: {
                color: theme.colors.neutral0,
                fontWeight: theme.typography.weights.extrabold,
            },
            destructive: {
                color: theme.colors.neutral0,
                fontWeight: theme.typography.weights.extrabold,
            },
            outline: { color: theme.colors.text, fontWeight: theme.typography.weights.medium },
            secondary: {
                color: theme.colors.neutral0,
                fontWeight: theme.typography.weights.extrabold,
            },
            ghost: { color: theme.colors.text, fontWeight: theme.typography.weights.medium },
            link: {
                color: theme.colors.primary,
                textDecorationLine: "underline" as const,
                fontWeight: theme.typography.weights.medium,
            },
        }[variant];

        return {
            ...sizeStyles,
            ...variantStyles,
        };
    },

    disabled: {
        opacity: 0.5,
    },
}));
