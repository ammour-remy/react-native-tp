import Button from "@/components/Button";
import { ThemedText } from "@/components/ThemedText";
import { Produit } from "@/models/Produit";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { Text, View } from "react-native";

export default function Details() {

    const { id } = useLocalSearchParams();

    const [produit, setProduit] = useState<Produit | null>(null);

    useEffect(() => {
        fetch(`https://dummyjson.com/products/${id}`)
            .then(res => res.json())
            .then(res => setProduit(res));
    }, []);

    if (produit == null) {
        return <View><Text>Chargement des données du produit</Text></View>
    } else {
        return <View>
            <ThemedText>{produit.title}</ThemedText>

            <ThemedText>Prendre une photo</ThemedText>

            <Button
                title="photo"
                width={100}>
            </Button>

        </View>
    }
}