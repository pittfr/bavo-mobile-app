import InterText from "@/components/inter-text";
import { useAuthStore } from "@/store/authStore";
import { TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import "../../unistyles";

export default function Index() {
    const { logout } = useAuthStore();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <InterText>Edit app/index.tsx to edit this screen.</InterText>
            <TouchableOpacity onPress={handleLogout}>
                <InterText style={styles.logOutText}>Log Out</InterText>
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
