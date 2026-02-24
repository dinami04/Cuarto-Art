import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert
} from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Header";

export default function MusicosScreen({ navigation }) {

  const [nombre, setNombre] = useState("");
  const [instrumento, setInstrumento] = useState("");
  const [musicos, setMusicos] = useState([]);

  useEffect(() => {
    cargarMusicos();
  }, []);

  const cargarMusicos = async () => {
    const data = await AsyncStorage.getItem("musicos");
    if (data) {
      setMusicos(JSON.parse(data));
    }
  };

  const guardarMusicos = async (lista) => {
    setMusicos(lista);
    await AsyncStorage.setItem("musicos", JSON.stringify(lista));
  };

  const agregarMusico = () => {
    if (!nombre || !instrumento) {
      Alert.alert("Faltan datos", "Completa todos los campos");
      return;
    }

    const nuevo = {
      id: Date.now().toString(),
      nombre,
      instrumento
    };

    guardarMusicos([...musicos, nuevo]);
    setNombre("");
    setInstrumento("");
  };

  const eliminarMusico = (id) => {
    const nuevaLista = musicos.filter(m => m.id !== id);
    guardarMusicos(nuevaLista);
  };

  return (
    <View style={{ flex: 1 }}>
      <Header navigation={navigation} title="Catálogo de Músicos" />

      <View style={styles.container}>

        <TextInput
          placeholder="Nombre del músico"
          value={nombre}
          onChangeText={setNombre}
          style={styles.input}
        />

        <TextInput
          placeholder="Instrumento"
          value={instrumento}
          onChangeText={setInstrumento}
          style={styles.input}
        />

        <TouchableOpacity style={styles.boton} onPress={agregarMusico}>
          <Text style={{ color: "white" }}>Agregar músico</Text>
        </TouchableOpacity>

        <FlatList
          data={musicos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.nombre}>{item.nombre}</Text>
              <Text>{item.instrumento}</Text>

              <TouchableOpacity
                onPress={() => eliminarMusico(item.id)}
                style={styles.deleteBtn}
              >
                <Text style={{ color: "white" }}>Eliminar</Text>
              </TouchableOpacity>

            </View>
          )}
        />

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10
  },
  boton: {
    backgroundColor: "#1c1c1c",
    padding: 15,
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 15
  },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10
  },
  nombre: {
    fontSize: 16,
    fontWeight: "bold"
  },
  deleteBtn: {
    backgroundColor: "#b00020",
    padding: 8,
    marginTop: 10,
    borderRadius: 6,
    alignItems: "center"
  }
});