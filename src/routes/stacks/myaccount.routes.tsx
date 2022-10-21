import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { MyAccount } from "../../screens/MyAccount";

const { Navigator, Screen } = createStackNavigator();

// rotas da tela de minha conta
export function MyAccountStack() {
  return (
    <Navigator>
      <Screen
        name="MyAccount"
        component={MyAccount}
        options={{
          headerShown: false,
        }}
      />
    </Navigator>
  );
}
