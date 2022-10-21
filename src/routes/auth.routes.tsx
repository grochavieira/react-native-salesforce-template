import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { Login } from "../screens/Login";

const { Navigator, Screen } = createStackNavigator();

// rotas deslogado
export function AuthRoutes() {
  return (
    <Navigator>
      <Screen name="Login" component={Login} options={{ headerShown: false }} />
    </Navigator>
  );
}
