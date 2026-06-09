import { StyleSheet } from "react-native-unistyles";

const sharedTokens = {
    dimensions: {
        headerSize: 56,
        headerSizeContent: 48,
        sideMenuSize: 280,
        bottomBarHeight: 65,
    },
    typography: {
        sizes: {
            display: 36,
            h1: 32,
            h2: 28,
            h3: 26,
            h4: 22,
            h5: 20,
            h6: 18,
            base: 16,
            s: 14,
            xs: 12,
            label: 11,
        },
        weights: {
            light: "300" as const,
            regular: "400" as const,
            medium: "500" as const,
            bold: "700" as const,
            extrabold: "800" as const,
            black: "900" as const,
        },
    },
};

const lightTheme = {
    colors: {
        background: "#FFFFFF",
        primaryDark: "#07095c",
        primary: "#0a0c7b",
        primaryLight: "#4d50a8",
        primaryHover: "#07095c",
        primarySelected: "#07095c",
        secondary: "#1f8fff",
        info: "#1a56f0",
        success: "#20b16d",
        warning: "#f59f0a",
        error: "#dc2828",

        neutral0: "#ffffff",
        neutral1: "#f8f9fa",
        neutral2: "#f1f3f5",
        neutral3: "#e9ecef",
        neutral4: "#dee2e6",
        neutral5: "#ced4da",
        neutral6: "#adb5bd",
        neutral7: "#6a7178",
        neutral8: "#4f575e",
        neutral9: "#272b30",
        neutral10: "#101213",

        muted: "#6a7178",
        text: "#101213",
    },
    ...sharedTokens,
};

const darkTheme = {
    colors: {
        background: "#000000",
        primaryDark: "#2024b0",
        primary: "#3d42ee",
        primaryLight: "#7b7eff",
        primaryHover: "#2024b0",
        primarySelected: "#2024b0",
        secondary: "#3399ff",
        info: "#1a56f0",
        success: "#20b16d",
        warning: "#f59f0a",
        error: "#dc2828",

        neutral0: "#0e0e0e",
        neutral1: "#141414",
        neutral2: "#1f1f1f",
        neutral3: "#252525",
        neutral4: "#282828",
        neutral5: "#323232",
        neutral6: "#858585",
        neutral7: "#c9c9c9",
        neutral8: "#d7d7d7",
        neutral9: "#f8f9fa",
        neutral10: "#ffffff",

        muted: "#858585",
        text: "#f8f9fa",
        headerColor: "#252525",
    },
    ...sharedTokens,
};

const appThemes = {
    light: lightTheme,
    dark: darkTheme,
};

type AppThemes = typeof appThemes;

declare module "react-native-unistyles" {
    export interface UnistylesThemes extends AppThemes {}
}

StyleSheet.configure({
    themes: appThemes,
    settings: {
        adaptiveThemes: true,
    },
});
