import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from "./app.routes";
import { useAuth } from "../hooks/auth";

export function Routes() {
  const { user } = useAuth();
  // aqui é onde define se o usuário estará logado ou não,
  // apresentando as rotas do app se ele estiver logado, ou
  // as rotas de auth (autorização) se estiver deslogado
  return (
    <NavigationContainer>
      {user.refreshToken ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
}
