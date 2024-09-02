import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, FlatList, View, SafeAreaView, StatusBar, useColorScheme, Platform, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Button from '@/components/Button';
import { Colors } from '@/constants/Colors';

type Task = {
  text: string;
  photoUri?: string;
};

export default function HomeScreen() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);
  const colorScheme = useColorScheme() || 'light';

  useEffect(() => {
    loadTasks();
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Vous devez accorder la permission d\'accéder à la caméra pour prendre des photos.');
    }
  };

  const saveTasks = async (tasksToSave: Task[]) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasksToSave));
    } catch (error) {
      console.error('Échec de la sauvegarde des tâches dans AsyncStorage', error);
    }
  };

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Échec du chargement des tâches depuis AsyncStorage', error);
    }
  };

  const addTask = () => {
    if (task.trim() || photoUri) {
      const newTask: Task = { text: task.trim(), photoUri };
      const newTasks = [...tasks, newTask];
      setTasks(newTasks);
      setTask('');
      setPhotoUri(undefined);
      saveTasks(newTasks);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const removeTask = (index: number) => {
    Alert.alert(
      "Supprimer la tâche",
      "Êtes-vous sûr de vouloir supprimer cette tâche ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            const updatedTasks = tasks.filter((_, i) => i !== index);
            setTasks(updatedTasks);
            saveTasks(updatedTasks);
          }
        }
      ]
    );
  };

  const startEditingTask = (index: number) => {
    setEditingIndex(index);
    setEditingText(tasks[index].text);
  };

  const cancelEditingTask = () => {
    setEditingIndex(null);
    setEditingText('');
  };

  const confirmEditingTask = (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = { ...updatedTasks[index], text: editingText };
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    cancelEditingTask();
  };

  const renderTask = ({ item, index }: { item: Task; index: number }) => {
    const isEditing = editingIndex === index;

    return (
      <View style={styles.taskContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {item.photoUri && (
            <Image source={{ uri: item.photoUri }} style={styles.thumbnail} />
          )}
          {isEditing ? (
            <TextInput
              style={[
                styles.input,
                styles.editingInput,
                { color: Colors[colorScheme].text, borderColor: Colors[colorScheme].icon },
              ]}
              value={editingText}
              onChangeText={setEditingText}
            />
          ) : (
            <ThemedText>{item.text}</ThemedText>
          )}
        </View>
        <View style={styles.taskButtons}>
          {isEditing ? (
            <>
              <Button 
                onPress={() => confirmEditingTask(index)} 
                type="validate" 
                icon="check"
                iconOnly={true}
              />
              <Button 
                onPress={cancelEditingTask} 
                type="back" 
                icon="arrow-left"
                iconOnly={true}
              />
            </>
          ) : (
            <>
              <Button 
                onPress={() => startEditingTask(index)} 
                type="edit" 
                icon="edit"
                iconOnly={true}
              />
              <Button 
                onPress={() => removeTask(index)} 
                type="delete" 
                icon="trash"
                iconOnly={true}
              />
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: Colors[colorScheme].background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      <View style={styles.container}>
        <ThemedView style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              { color: Colors[colorScheme].text, borderColor: Colors[colorScheme].icon },
            ]}
            placeholder="Ajouter une nouvelle tâche"
            placeholderTextColor={Colors[colorScheme].icon}
            value={task}
            onChangeText={setTask}
          />
          <Button 
            onPress={takePhoto} 
            type="photo" 
            icon="camera"
            iconOnly={true}
          />
          <Button 
            onPress={addTask} 
            type="add" 
            icon="plus"
            iconOnly={true}
          />
        </ThemedView>

        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.tasksList}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  editingInput: {
    marginBottom: 0,
    marginRight: 8,
  },
  tasksList: {
    paddingBottom: 16,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  taskButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 5,
    marginRight: 8,
  },
});
