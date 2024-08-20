import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, FlatList, View, ScrollView } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { useEffect, useState } from 'react';
import Card from '@/components/Card';
import { Link } from 'expo-router';

export type Produit = {
    id: string,
    title: string,
    thumbnail: string
}

export default function ExploreScreen() {

    const [produits, setProduits] = useState<Produit[]>([]);

    useEffect(() => {
        fetch('https://dummyjson.com/products')
            .then(res => res.json())
            .then(res => setProduits(res.products));
    }, []);

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}>

            <FlatList
                horizontal={true}
                data={produits}
                renderItem={({ item }) =>
                    
                    <Link href={`/explore/${item.id}`}>
                        <Card imageUri={item.thumbnail} title={item.title} ></Card>
                    </Link>
                }
                keyExtractor={(item: Produit) => item.id}
            />

        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
});
