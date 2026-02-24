import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    FlatList, 
    StyleSheet 
  } from "react-native";
  import { useState, useEffect } from "react";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import Header from "../components/Header";
  
  export default function ClientesScreen({ navigation }) {
  
    const [clientes, setClientes] = useState([]);
    const [nombre, setNombre] = useState("");
    const [telefono, setTelefono] = useState("");
    const [editandoId, setEditandoId] = useState(null);
  
    // Cargar clientes guardados
    useEffect(() => {
      cargarClientes();
    }, []);
  
    const cargarClientes = async () => {
      const data = await AsyncStorage.getItem("clientes");
      if (data) {
        setClientes(JSON.parse(data));
      }
    };
  
    const guardarClientes = async (lista) => {
      setClientes(lista);
      await AsyncStorage.setItem("clientes", JSON.stringify(lista));
    };
  
    const agregarCliente = () => {
      if (!nombre) return;
  
      if (editandoId) {
        const actualizados = clientes.map(c =>
          c.id === editandoId ? { ...c, nombre, telefono } : c
        );
        guardarClientes(actualizados);
        setEditandoId(null);
      } else {
        const nuevo = {
          id: Date.now().toString(),
          nombre,
          telefono
        };
        guardarClientes([...clientes, nuevo]);
      }
  
      setNombre("");
      setTelefono("");
    };
  
    const editarCliente = (cliente) => {
      setNombre(cliente.nombre);
      setTelefono(cliente.telefono);
      setEditandoId(cliente.id);
    };
  
    const eliminarCliente = (id) => {
      const filtrados = clientes.filter(c => c.id !== id);
      guardarClientes(filtrados);
    };
  
    return (
      <View style={{ flex: 1 }}>
        <Header navigation={navigation} title="Clientes" />
  
        <View style={styles.container}>
  
          <TextInput
            placeholder="Nombre"
            value={nombre}
            onChangeText={setNombre}
            style={styles.input}
          />
  
          <TextInput
            placeholder="Teléfono"
            value={telefono}
            onChangeText={setTelefono}
            style={styles.input}
          />
  
          <TouchableOpacity style={styles.boton} onPress={agregarCliente}>
            <Text style={{ color: "white" }}>
              {editandoId ? "Actualizar Cliente" : "Agregar Cliente"}
            </Text>
          </TouchableOpacity>
  
          <FlatList
            data={clientes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.nombre}>{item.nombre}</Text>
                <Text>{item.telefono}</Text>
  
                <View style={styles.botonesCard}>
                  <TouchableOpacity onPress={() => editarCliente(item)}>
                    <Text style={styles.editar}>Editar</Text>
                  </TouchableOpacity>
  
                  <TouchableOpacity onPress={() => eliminarCliente(item.id)}>
                    <Text style={styles.eliminar}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
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
      padding: 10,
      marginBottom: 10,
      borderRadius: 8
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
    botonesCard: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 10
    },
    editar: {
      color: "blue"
    },
    eliminar: {
      color: "red"
    }
  });