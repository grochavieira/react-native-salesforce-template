import React from "react";
import { Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather, AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "styled-components";

import { HomeStack } from "./stacks/home.routes";
import { MyAccountStack } from "./stacks/myaccount.routes";
import { AccountsStack } from "./stacks/accounts.routes";
import { ContactsStack } from "./stacks/contacts.routes";

const { Navigator, Screen } = createBottomTabNavigator();

// rotas logado
export function AppRoutes() {
  const theme = useTheme();
  return (
    <Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarStyle: {
          height: Platform.OS === "ios" ? 80 : 60,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: theme.fonts.regular,
          textTransform: "uppercase",
          textAlign: "center",
        },
      }}
    >
      <Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: "Início",
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <Feather name="home" size={22} color={color} />
          ),
        }}
      />
      <Screen
        name="AccountsTab"
        component={AccountsStack}
        options={{
          tabBarLabel: "Contas",
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <Feather name="user" size={22} color={color} />
          ),
        }}
      />
      <Screen
        name="ContactsTab"
        component={ContactsStack}
        options={{
          tabBarLabel: "Contatos",
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="contacts" size={22} color={color} />
          ),
        }}
      />
      <Screen
        name="MyAccountTab"
        component={MyAccountStack}
        options={{
          tabBarLabel: "Minha Conta",
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="data-usage" size={22} color={color} />
          ),
        }}
      />
    </Navigator>
  );
}
