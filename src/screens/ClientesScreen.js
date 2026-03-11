import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../services/api";

export default function ClientesScreen() {
  const [clientes, setClientes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const resp = await fetch(`${API_URL}/clientes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await resp.json();

      setClientes(data);
    } catch (error) {
      console.log("Error cargando clientes", error);
    }
  };

  const agregarCliente = async () => {
    if (!nombre || !telefono) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");

      await fetch(`${API_URL}/clientes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre,
          telefono,
        }),
      });

      setNombre("");
      setTelefono("");

      cargarClientes();
    } catch (error) {
      console.log("Error agregando cliente", error);
    }
  };

  const eliminarCliente = async (id) => {
    const token = await AsyncStorage.getItem("token");

    await fetch(`${API_URL}/clientes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    cargarClientes();
  };

  const renderCliente = ({ item }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.nombre}>{item.nombre}</Text>

        <Text style={styles.telefono}>{item.telefono}</Text>

        <View style={styles.botones}>
          <TouchableOpacity>
            <Text style={styles.editar}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => eliminarCliente(item.id_cliente)}>
            <Text style={styles.eliminar}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Clientes</Text>

      <TextInput
        placeholder="Nombre"
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        placeholder="Teléfono"
        style={styles.input}
        value={telefono}
        onChangeText={setTelefono}
      />

      <TouchableOpacity style={styles.boton} onPress={agregarCliente}>
        <Text style={styles.botonTexto}>Agregar Cliente</Text>
      </TouchableOpacity>

      <FlatList
        data={clientes}
        keyExtractor={(item) => item.id_cliente.toString()}
        renderItem={renderCliente}
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

  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },

  boton: {
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },

  botonTexto: {
    color: "#fff",
    fontWeight: "bold",
  },

  card: {
    marginBottom: 20,
  },

  nombre: {
    fontSize: 18,
    fontWeight: "bold",
  },

  telefono: {
    fontSize: 16,
    marginBottom: 10,
  },

  botones: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  editar: {
    color: "blue",
  },

  eliminar: {
    color: "red",
  },
});
