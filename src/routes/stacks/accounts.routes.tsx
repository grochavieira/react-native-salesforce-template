import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { Header } from "../../components/Header";

import { Accounts } from "../../screens/Accounts";
import { SaveAccount } from "../../screens/SaveAccount";

const { Navigator, Screen } = createStackNavigator();

// rotas da tela de contas
export function AccountsStack() {
  return (
    <Navigator>
      <Screen
        name="Accounts"
        component={Accounts}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        name="SaveAccount"
        component={SaveAccount}
        options={{
          header: (props) => <Header {...props} title={"Salvar Conta"} />,
        }}
      />
    </Navigator>
  );
}
