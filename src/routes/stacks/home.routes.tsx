import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { Home } from "../../screens/Home";

const { Navigator, Screen } = createStackNavigator();

// rotas da tela da home
export function HomeStack() {
  return (
    <Navigator>
      <Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
    </Navigator>
  );
}
