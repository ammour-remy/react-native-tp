import { Image, StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";

declare type Props = { imageUri: string, title: string }

export default function Card({ imageUri, title }: Props) {

    return <View style={styles.card}>
        <Image
            style={{ width: 200, height: 140, marginBottom: 5 }}
            source={{
                uri: imageUri
            }}
        />
        <ThemedText type="subtitle">{title}</ThemedText>
    </View>

}

const styles = StyleSheet.create({
    card: {
        width: 150,
        height: 200,
        backgroundColor: "#eee",
        marginRight: 8
    }
})