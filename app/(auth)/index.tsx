import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Button } from "../../components/button";
import InterText from "../../components/inter-text";
import "../../unistyles";

export default function Welcome() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={["#091553", "#03043a", "#000014"]}
                locations={[0, 0.6, 1]}
                style={styles.gradient}
            >
                <View style={styles.contentCenter}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require("../../assets/images/BaVo-logo.png")}
                            style={styles.logo}
                            contentFit="contain"
                        />
                    </View>

                    <View style={styles.textContainer}>
                        <InterText style={styles.title}>BaVo</InterText>

                        <InterText style={styles.subtitle}>Smart access, simplified.</InterText>
                    </View>
                </View>
                <View style={styles.bottomContainer}>
                    <Button
                        size="lg"
                        style={styles.signInButton}
                        textStyle={styles.signInButtonText}
                        onPress={() => router.push("/(auth)/login")}
                    >
                        Sign In
                    </Button>

                    <Button
                        variant="ghost"
                        size="lg"
                        style={styles.createAccountButton}
                        textStyle={styles.createAccountButtonText}
                        onPress={() => router.push("/(auth)/register")}
                    >
                        Create Account
                    </Button>
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create((theme) => ({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    gradient: {
        flex: 1,
    },
    contentCenter: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    bottomContainer: {
        paddingHorizontal: 24,
        paddingBottom: 48,
    },
    logoContainer: {
        height: 180,
        width: 180,
        justifyContent: "center",
    },
    logo: {
        width: "100%",
        height: "100%",
    },
    textContainer: {
        alignItems: "center",
    },
    title: {
        color: theme.colors.neutral10,
        fontWeight: theme.typography.weights.extrabold,
        fontSize: theme.typography.sizes.display,
        textAlign: "center",
    },
    subtitle: {
        color: "#ffffffb3",
        fontSize: theme.typography.sizes.base,
        marginTop: 8,
    },

    signInButton: {
        backgroundColor: theme.colors.neutral10,
        marginBottom: 16,
    },
    signInButtonText: {
        color: theme.colors.primaryDark,
        fontWeight: theme.typography.weights.bold,
    },

    createAccountButton: {},
    createAccountButtonText: {
        color: theme.colors.neutral10,
        fontWeight: theme.typography.weights.bold,
    },
}));
