import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { Contacts } from "../../screens/Contacts";

const { Navigator, Screen } = createStackNavigator();

// rotas da tela de contatos
export function ContactsStack() {
  return (
    <Navigator>
      <Screen
        name="Contacts"
        component={Contacts}
        options={{
          headerShown: false,
        }}
      />
    </Navigator>
  );
}
