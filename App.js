import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
  AsyncStorage,
} from "react-native";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function App() {
  const [task, setTask] = useState([]);
  const [newTask, setNewTask] = useState("");

  async function addTask() {
    if(newTask === '') {
      Alert.alert("A nota está vazia", "adicione algo para salvar!")
      return;
    }

    const search = task.filter(task => task === newTask);
    if(search.length != 0) {
      Alert.alert("Nome da tarefa é repetido!", "Você não pode adicionar a mesma coisas mais de uma vez.")
      return;
    }


    //atribuo tudo o que já tinha em newTask com os novos valores.
    setTask([ ... task, newTask]);
    setNewTask("");

    Keyboard.dismiss();
  }


  async function removeTask(item) {
    Alert.alert(
      "Deletar task",
      "Tem certesa que deseja deletar esta task?",
      [
        {
          text: "Cancel",
          onPress: () => {
            return;
          },
          style: 'cancel'
        },
        {
          text: "Ok",
          onPress: () => setTask(task.filter(tasks => tasks != item))
        }
      ],
      { cancelable: false }
    )
  }

  useEffect(() => {
    async function carregaDados() {
      const task = await AsyncStorage.getItem("task");

      if(task) {
        setTask(JSON.parse(task))
      }
    }
    carregaDados();
  }, [])

  useEffect(() => {
    async function salvaDados() {
      AsyncStorage.setItem("item", JSON.stringify(task))
    }
    salvaDados();
  }, [task]);

  return (
    <>
      <KeyboardAvoidingView
        keyboardVerticalOffset={0}
        behavior="padding"
        style={{ flex: 1 }}
        enabled={Platform.OS === "ios"}
      >
        <View style={styles.container}>
          <View style={styles.Body}>
            <FlatList
              style={styles.FlatList}
              data={task}
              keyExtractor={(item) => item.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.ContainerView}>
                  <Text style={styles.Text}>{item}</Text>
                  <TouchableOpacity onPress={() => removeTask(item)}>
                    <MaterialIcons
                      name="delete-forever"
                      size={25}
                      color="#f64675"
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
          <View style={styles.Form}>
            <TextInput
              style={styles.Input}
              placeholderTextColor="#999"
              autoCorrect={true}
              placeholder="Adicione uma nota..."
              maxLength={150}
              onChangeText={ text => setNewTask(text) }
              value={newTask}
            />
            <TouchableOpacity style={styles.Button} onPress={() => addTask()}>
              <Ionicons name="ios-add" size={25} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 20,
  },
  Body: {
    flex: 1,
  },
  Form: {
    padding: 0,
    height: 60,
    justifyContent: "center",
    alignSelf: "stretch",
    flexDirection: "row",
    paddingTop: 13,
    borderTopWidth: 1,
    borderColor: "#000",
  },
  Input: {
    flex: 1,
    height: 40,
    backgroundColor: "#eee",
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  Button: {
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1c6cce",
    borderRadius: 4,
    marginLeft: 10,
  },
  FlatList: {
    flex: 1,
    marginTop: 5,
  },
  ContainerView: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 4,
    backgroundColor: "#eee",

    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#eee",
  },
  Text: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
    marginTop: 4,
    textAlign: "center",
  },
});
