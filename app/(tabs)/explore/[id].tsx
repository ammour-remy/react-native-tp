import Button from "@/components/Button";
import { ThemedText } from "@/components/ThemedText";
import { Produit } from "@/models/Produit";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRef, } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function Details() {

    const { id } = useLocalSearchParams();
    const [produit, setProduit] = useState<Produit | null>(null);
    
    const [showCamera, setShowCamera] = useState<boolean>(false);
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    function takePhoto() {
        if (cameraRef.current) {

            cameraRef.current
                ?.takePictureAsync({
                    skipProcessing: true,
                })
                .then((photoData) => {
                    console.log(photoData);
                    setShowCamera(false);
                });
        }
    }

    useEffect(() => {
        fetch(`https://dummyjson.com/products/${id}`)
            .then(res => res.json())
            .then(res => setProduit(res));
    }, []);

    if (produit == null) {
        return <SafeAreaView>
            <Text>Chargement des données du produit</Text>
        </SafeAreaView>
    } else {

        if (showCamera) {

            if (!permission) {
                // Camera permissions are still loading.
                return <View />;
            }

            if (!permission.granted) {
                // Camera permissions are not granted yet.
                return (
                    <View style={styles.container}>
                        <Text style={styles.message}>We need your permission to show the camera</Text>
                        <Button width={200} onPress={requestPermission} title="grant permission" />
                    </View>
                );
            }

            return (
                <View style={styles.container}>
                    <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                                <Text style={styles.text}>Flip Camera</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.button} onPress={takePhoto}>
                                <Text style={styles.text}>Prendre photo</Text>
                            </TouchableOpacity>
                        </View>
                    </CameraView>
                </View>
            );

        } else {

            return <SafeAreaView>
                <ThemedText>{produit.title}</ThemedText>

                <ThemedText>Prendre une photo</ThemedText>

                <Button
                    title="photo"
                    width={100}
                    onPress={() => setShowCamera(true)}>
                </Button>

            </SafeAreaView>
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
});