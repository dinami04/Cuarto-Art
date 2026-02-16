import { View, Text, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AdminScreen({ navigation }) {
  const logout = async () => {
    await AsyncStorage.clear();
    navigation.replace("Login");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 22 }}>Panel de Administrador</Text>
      <Button title="Cerrar sesión" onPress={logout} />
    </View>
  );
}
