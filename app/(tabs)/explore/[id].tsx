import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function Details() {

    const { id } = useLocalSearchParams();

    console.log(id);

    return <View></View>

}