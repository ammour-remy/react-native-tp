import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabAbout() {

    const insets = useSafeAreaInsets();

    return <View style={{
        marginTop: insets.top,
        marginBottom: insets.bottom,
        marginLeft: insets.left,
        marginRight: insets.right
    }}>
        
        <ThemedText type="title">Ma super app !</ThemedText>

    </View>

}