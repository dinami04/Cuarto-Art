import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAgenda } from "../services/api";

export default function CreateAgendaScreen({ navigation }) {
  const [nombre_proyecto, setNombreProyecto] = useState("");
  const [tipo, setTipo] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  const handleCreate = async () => {
    if (!nombre_proyecto || !tipo || !fecha || !hora) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");

      await createAgenda(token, {
        nombre_proyecto,
        tipo,
        fecha,
        hora,
      });

      Alert.alert("Éxito", "Agenda creada correctamente");

      navigation.goBack(); // 👈 Regresa a AgendaScreen
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Agenda</Text>

      <TextInput
        placeholder="Nombre del proyecto"
        value={nombre_proyecto}
        onChangeText={setNombreProyecto}
        style={styles.input}
      />

      <TextInput
        placeholder="Tipo"
        value={tipo}
        onChangeText={setTipo}
        style={styles.input}
      />

      <TextInput
        placeholder="Fecha (YYYY-MM-DD)"
        value={fecha}
        onChangeText={setFecha}
        style={styles.input}
      />

      <TextInput
        placeholder="Hora (HH:MM)"
        value={hora}
        onChangeText={setHora}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleCreate}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", textAlign: "center" },
});
