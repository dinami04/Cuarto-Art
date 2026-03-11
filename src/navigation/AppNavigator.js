import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "../screens/LoginScreen";
import DashboardScreen from "../screens/DashboardScreen";
import AgendaScreen from "../screens/AgendaScreen";
import CreateAgendaScreen from "../screens/CreateAgendaScreen";
import ClienteScreen from "../screens/ClienteScreen";
import PagosScreen from "../screens/PagosScreen";
import EventosScreen from "../screens/EventosScreen";
import ClientesScreen from "../screens/ClientesScreen";

import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerStyle: {
              backgroundColor: "#393d42",
            },
            headerTintColor: "#000",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            headerStyle: {
              backgroundColor: "#393d42",
            },
            headerTintColor: "#000",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="Agenda"
          component={AgendaScreen}
          options={{
            headerStyle: {
              backgroundColor: "#393d42",
            },
            headerTintColor: "#000",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="Clientes"
          component={ClientesScreen}
          options={{
            headerStyle: {
              backgroundColor: "#393d42",
            },
            headerTintColor: "#000",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="Pagos"
          component={PagosScreen}
          options={{
            headerStyle: {
              backgroundColor: "#393d42",
            },
            headerTintColor: "#000",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="CreateAgenda"
          component={CreateAgendaScreen}
          options={{
            headerStyle: {
              backgroundColor: "#393d42",
            },
            headerTintColor: "#000",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="Eventos"
          component={EventosScreen}
          options={{
            headerStyle: {
              backgroundColor: "#393d42",
            },
            headerTintColor: "#000",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
