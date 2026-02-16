import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function AgendaItem({ agenda }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{agenda.nombre_proyecto}</Text>
      <Text>Tipo: {agenda.tipo}</Text>
      <Text>Fecha: {agenda.fecha}</Text>
      <Text>Hora: {agenda.hora}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    marginBottom: 12,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
