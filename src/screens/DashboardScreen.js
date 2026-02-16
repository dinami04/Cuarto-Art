import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function DashboardScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panel de Administración</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Agenda")}
      >
        <Text style={styles.buttonText}>Agendas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Eventos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Pagos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Clientes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
});
