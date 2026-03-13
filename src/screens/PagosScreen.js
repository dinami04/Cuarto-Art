import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../services/api";

export default function PagosScreen() {
  const [cliente, setCliente] = useState("");
  const [total, setTotal] = useState("");
  const [anticipo, setAnticipo] = useState("");
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(false);

  // ===============================
  // ✅ CARGAR PAGOS
  // ===============================
  const cargarPagos = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const resp = await fetch(`${API_URL}/pagos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await resp.json();

      if (Array.isArray(data)) {
        setPagos(data);
      } else {
        setPagos([]);
      }
    } catch (error) {
      console.log("❌ error cargar pagos:", error);
      setPagos([]);
    }
  };

  // ===============================
  // 💾 GUARDAR PAGO
  // ===============================
  const guardarPago = async () => {
    try {
      // ✅ VALIDACIÓN CORRECTA
      if (!cliente?.trim() || total === "" || anticipo === "") {
        Alert.alert("Error", "Todos los campos son obligatorios");
        return;
      }

      setLoading(true);

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "Sesión expirada");
        return;
      }

      // 🔢 convertir números
      const totalNum = Number(total);
      const anticipoNum = Number(anticipo);

      if (isNaN(totalNum) || isNaN(anticipoNum)) {
        Alert.alert("Error", "Total y anticipo deben ser números");
        return;
      }

      // ===============================
      // 🔍 BUSCAR CLIENTE POR NOMBRE
      // ===============================
      let clienteId = null;

      try {
        const respClientes = await fetch(`${API_URL}/clientes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const clientes = await respClientes.json();

        const clienteExistente = clientes.find(
          (c) =>
            c.nombre?.toLowerCase().trim() === cliente.toLowerCase().trim(),
        );

        clienteId = clienteExistente?.id_cliente || null;
      } catch (err) {
        console.log("⚠️ no se pudieron cargar clientes");
      }

      // ===============================
      // 🆕 CREAR CLIENTE SI NO EXISTE
      // ===============================
      if (!clienteId) {
        console.log("creando cliente...");

        const respNuevo = await fetch(`${API_URL}/clientes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nombre: cliente.trim(),
          }),
        });

        const nuevoCliente = await respNuevo.json();

        if (!nuevoCliente.id_cliente) {
          throw new Error("No se pudo crear el cliente");
        }

        clienteId = nuevoCliente.id_cliente;

        console.log("cliente creado:", clienteId);
      }

      // ===============================
      // 💳 GUARDAR PAGO
      // ===============================
      const resp = await fetch(`${API_URL}/pagos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_cliente: clienteId,
          total: totalNum,
          anticipo: anticipoNum,
        }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.error || "Error al guardar");
      }

      Alert.alert("✅ Éxito", "Pago guardado");

      // limpiar campos
      setCliente("");
      setTotal("");
      setAnticipo("");

      await cargarPagos();
    } catch (error) {
      console.log("❌ ERROR COMPLETO:", error);
      Alert.alert("Error al guardar", error.message);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // 🚀 AL ENTRAR
  // ===============================
  useEffect(() => {
    cargarPagos();
  }, []);

  // ===============================
  // 🎨 RENDER ITEM
  // ===============================
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>
        Cliente: {item.nombre || item.id_cliente}
      </Text>
      <Text style={styles.cardText}>Total: ${item.total}</Text>
      <Text style={styles.cardText}>Anticipo: ${item.anticipo}</Text>
      <Text style={styles.cardText}>Restante: ${item.restante}</Text>
    </View>
  );

  // ===============================
  // 🖼️ UI
  // ===============================
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cobranza</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del cliente"
        value={cliente}
        onChangeText={setCliente}
      />

      <TextInput
        style={styles.input}
        placeholder="Total"
        keyboardType="numeric"
        value={total}
        onChangeText={setTotal}
      />

      <TextInput
        style={styles.input}
        placeholder="Anticipo"
        keyboardType="numeric"
        value={anticipo}
        onChangeText={setAnticipo}
      />

      <TouchableOpacity style={styles.button} onPress={guardarPago}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Guardar Pago</Text>
        )}
      </TouchableOpacity>

      <FlatList
        data={pagos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No hay pagos</Text>}
      />
    </View>
  );
}

// ===============================
// 🎨 ESTILOS
// ===============================
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardText: { fontSize: 14 },
});
