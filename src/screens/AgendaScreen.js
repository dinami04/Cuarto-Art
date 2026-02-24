import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { getAgendas } from "../services/api";

export default function AgendaScreen({ navigation }) {
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 🔥 se ejecuta cada vez que entras a la pantalla
  useFocusEffect(
    useCallback(() => {
      cargarAgendas();
    }, []),
  );

  const cargarAgendas = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Sesión expirada", "Vuelve a iniciar sesión");
        navigation.replace("Login");
        return;
      }

      const data = await getAgendas(token);

      console.log("📦 Agendas recibidas:", data);

      // 🛡️ asegura que sea array
      setAgendas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("❌ Error agendas:", error);
      Alert.alert(
        "Error",
        error.message || "No se pudieron cargar las agendas",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 🔄 pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await cargarAgendas();
  };

  // ⏳ loading inicial
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 🧠 formatea fecha segura
  const formatearFecha = (fecha) => {
    if (!fecha) return "Sin fecha";
    try {
      return fecha.split("T")[0];
    } catch {
      return fecha;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agendas</Text>

      {/* 🔥 botón crear */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate("CreateAgenda")}
      >
        <Text style={styles.createButtonText}>+ Crear Agenda</Text>
      </TouchableOpacity>

      <FlatList
        data={agendas}
        keyExtractor={(item, index) =>
          item?.id_agenda?.toString() || index.toString()
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.project}>
              {item?.nombre_proyecto || "Proyecto"}
            </Text>

            <Text>{item?.tipo || "Sin tipo"}</Text>

            <Text>
              {formatearFecha(item?.fecha)} — {item?.hora || "--:--"}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay agendas registradas</Text>
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
    borderRadius: 10,
    backgroundColor: "#f2f2f2",
    marginBottom: 10,
  },

  project: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#666",
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
