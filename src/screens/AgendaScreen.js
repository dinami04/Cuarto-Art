import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAgendas } from "../services/api";

export default function AgendaScreen({ navigation }) {
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarAgendas();
  }, []);

  const cargarAgendas = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Error", "Sesión no válida");
        return;
      }

      const data = await getAgendas(token);
      setAgendas(data);
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "No se pudieron cargar las agendas",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agendas</Text>

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate("CreateAgenda")}
      >
        <Text style={styles.createButtonText}>+ Crear Agenda</Text>
      </TouchableOpacity>

      <FlatList
        data={agendas}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.project}>{item.nombre_proyecto}</Text>
            <Text>{item.tipo}</Text>
            <Text>
              {item.fecha.split("T")[0]} — {item.hora}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center" }}>
            No hay agendas registradas
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  card: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#f2f2f2",
    marginBottom: 10,
  },
  project: {
    fontWeight: "bold",
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  createButton: {
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  createButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
