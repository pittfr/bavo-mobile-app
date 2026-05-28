import {
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
    useFonts,
} from "@expo-google-fonts/inter";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";

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
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        checkLoginStatus();
    }, []);

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === "(auth)";

        if (isAuthenticated && inAuthGroup) {
            router.replace("/");
        } else if (!isAuthenticated && !inAuthGroup) {
            router.replace("/(auth)");
        }
    }, [isAuthenticated, isLoading, segments]);

    if (isLoading || !fontsLoaded) return null;

    return <Stack screenOptions={{ headerShown: false }} />;
}
