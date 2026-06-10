import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import "../unistyles";

export default function Index() {
    const router = useRouter();

    const { logout } = useAuthStore();

    const handleLogout = async () => {
        await logout();

        router.replace("/");
    };

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>Edit app/index.tsx to edit this screen.</Text>
            <TouchableOpacity onPress={handleLogout}>
                <Text style={styles.logOutText}>Log Out</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create((theme) => ({
    logOutText: {
        color: theme.colors.primary,
        fontSize: theme.typography.sizes.h6,
    },
}));
