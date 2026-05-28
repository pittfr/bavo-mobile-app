import { StyleSheet, Text, TextProps, TextStyle } from "react-native";

const getFontFamily = (weight?: TextStyle["fontWeight"]): string => {
    switch (weight) {
        case "300":
            return "Inter_300Light";
        case "normal":
        case "400":
            return "Inter_400Regular";
        case "500":
            return "Inter_500Medium";
        case "bold":
        case "700":
            return "Inter_700Bold";
        case "800":
            return "Inter_800ExtraBold";
        case "900":
            return "Inter_900Black";
        default:
            return "Inter_400Regular";
    }
};

export default function InterText({ style, ...rest }: TextProps) {
    const flatStyle = StyleSheet.flatten(style || {}) as TextStyle;

    const { fontWeight, ...remainingStyles } = flatStyle;

    const resolvedFontFamily = getFontFamily(fontWeight);

    return <Text style={[remainingStyles, { fontFamily: resolvedFontFamily }]} {...rest} />;
}
