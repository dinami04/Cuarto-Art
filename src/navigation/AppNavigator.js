import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "../screens/LoginScreen";
import DashboardScreen from "../screens/DashboardScreen";
import AgendaScreen from "../screens/AgendaScreen";
import CreateAgendaScreen from "../screens/CreateAgendaScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Agenda" component={AgendaScreen} />
        <Stack.Screen
          name="CreateAgenda"
          component={CreateAgendaScreen}
          options={{ title: "Crear Agenda" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
