import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PagosScreen() {

  const [busqueda, setBusqueda] = useState("");
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  const [total, setTotal] = useState("");
  const [anticipo, setAnticipo] = useState("");
  const [pagos, setPagos] = useState([]);

  useEffect(() => {
    cargarPagos();
    cargarClientes();
  }, []);

  const cargarPagos = async () => {
    const data = await AsyncStorage.getItem("pagos");
    if (data) setPagos(JSON.parse(data));
  };

  const cargarClientes = async () => {
    const data = await AsyncStorage.getItem("clientes");
    if (data) setClientes(JSON.parse(data));
  };

  const guardarPago = async () => {
    if (!clienteSeleccionado || !total) return;

    const nuevoPago = {
      id: Date.now().toString(),
      cliente: clienteSeleccionado.nombre,
      clienteId: clienteSeleccionado.id,
      total: Number(total),
      anticipo: Number(anticipo || 0),
      fecha: new Date().toISOString()
    };

    const nuevosPagos = [...pagos, nuevoPago];
    setPagos(nuevosPagos);
    await AsyncStorage.setItem("pagos", JSON.stringify(nuevosPagos));

    setBusqueda("");
    setClienteSeleccionado(null);
    setTotal("");
    setAnticipo("");
  };

  const calcularRestante = (total, anticipo) => {
    return total - anticipo;
  };

  // FILTRO DE CLIENTES
  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cobranza</Text>

      {/* BUSCADOR */}
      <TextInput
        placeholder="Buscar cliente..."
        value={busqueda}
        onChangeText={setBusqueda}
        style={styles.input}
      />

      {/* LISTA FILTRADA */}
      {busqueda.length > 0 && (
        <FlatList
          data={clientesFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                setClienteSeleccionado(item);
                setBusqueda(item.nombre);
              }}
            >
              <Text>{item.nombre}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* CLIENTE SELECCIONADO */}
      {clienteSeleccionado && (
        <Text style={{ marginBottom: 10 }}>
          Cliente seleccionado: {clienteSeleccionado.nombre}
        </Text>
      )}

      <TextInput
        placeholder="Total"
        value={total}
        onChangeText={setTotal}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="Anticipo"
        value={anticipo}
        onChangeText={setAnticipo}
        keyboardType="numeric"
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={guardarPago}>
        <Text style={styles.buttonText}>Guardar pago</Text>
      </TouchableOpacity>

      <FlatList
        data={pagos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Cliente: {item.cliente}</Text>
            <Text>Total: ${item.total}</Text>
            <Text>Anticipo: ${item.anticipo}</Text>
            <Text>Restante: ${calcularRestante(item.total, item.anticipo)}</Text>
          </View>
        )}
      />
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
    marginBottom: 10,
    borderRadius: 6,
  },
  button: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: { color: "#fff", textAlign: "center" },
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
    borderRadius: 6,
  },
});