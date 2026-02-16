import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAgenda } from "../services/api";

export default function CreateAgendaScreen({ navigation }) {
  const [idProyecto, setIdProyecto] = useState("");
  const [tipo, setTipo] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  const handleCreate = async () => {
    if (!idProyecto || !tipo || !fecha || !hora) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");

      await createAgenda(token, {
        id_proyecto: Number(idProyecto),
        tipo,
        fecha,
        hora,
      });

      Alert.alert("Éxito", "Agenda creada correctamente");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Agenda</Text>

      <TextInput
        placeholder="ID del proyecto"
        style={styles.input}
        value={idProyecto}
        onChangeText={setIdProyecto}
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Tipo (ensayo, evento, grabación)"
        style={styles.input}
        value={tipo}
        onChangeText={setTipo}
      />

      <TextInput
        placeholder="Fecha (YYYY-MM-DD)"
        style={styles.input}
        value={fecha}
        onChangeText={setFecha}
      />

      <TextInput
        placeholder="Hora (HH:MM)"
        style={styles.input}
        value={hora}
        onChangeText={setHora}
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
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
