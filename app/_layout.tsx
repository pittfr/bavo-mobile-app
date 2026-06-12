import {
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
    useFonts,
} from "@expo-google-fonts/inter";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import "../unistyles";

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        Inter_300Light,
        Inter_400Regular,
        Inter_500Medium,
        Inter_700Bold,
        Inter_800ExtraBold,
        Inter_900Black,
    });
    const { isAuthenticated, isLoading, checkLoginStatus } = useAuthStore();

    useEffect(() => {
        checkLoginStatus();
    }, []);

    if (isLoading || !fontsLoaded) return null;

    return (
        <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
            <Stack.Protected guard={isAuthenticated}>
                <Stack.Screen name="(tabs)" />
            </Stack.Protected>
            <Stack.Protected guard={!isAuthenticated}>
                <Stack.Screen name="(auth)" />
            </Stack.Protected>
        </Stack>
    );
}
