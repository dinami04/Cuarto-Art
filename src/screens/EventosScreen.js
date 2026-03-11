import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { getEventos } from "../services/api";

export default function EventosScreen() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // =========================
  // 🔥 Cargar eventos
  // =========================
  const cargarEventos = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Sesión expirada", "Vuelve a iniciar sesión");
        return;
      }

      const data = await getEventos(token);
      setEventos(data);
    } catch (error) {
      console.log("❌ Error al cargar eventos:", error.message);
      Alert.alert("Error", "No se pudieron cargar los eventos");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 cuando entras a la pantalla
  useFocusEffect(
    useCallback(() => {
      cargarEventos();
    }, []),
  );

  // 🔄 pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await cargarEventos();
    setRefreshing(false);
  };

  // =========================
  // 🎨 Render item
  // =========================
  const renderEvento = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.titulo}>{item.titulo}</Text>
      <Text style={styles.texto}>📅 {item.fecha}</Text>
      <Text style={styles.texto}>📍 {item.lugar}</Text>

      {item.descripcion ? (
        <Text style={styles.descripcion}>{item.descripcion}</Text>
      ) : null}
    </View>
  );

  // =========================
  // ⏳ Loading
  // =========================
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Cargando eventos...</Text>
      </View>
    );
  }

  // =========================
  // 🚀 UI
  // =========================
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Agenda / Eventos</Text>

      <FlatList
        data={eventos}
        keyExtractor={(item) => item.id_evento.toString()}
        renderItem={renderEvento}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay eventos registrados</Text>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

// =========================
// 🎨 Styles
// =========================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  texto: {
    fontSize: 14,
    color: "#333",
  },
  descripcion: {
    marginTop: 6,
    fontStyle: "italic",
    color: "#555",
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#666",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
