import React from "react";
import { View, Platform } from "react-native";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

import {
  Container,
  Button,
  ButtonText,
  ButtonIcon,
  Logo,
  Description,
  ButtonContainer,
} from "./styles";

import env from "../../env";
import DatabaseManager, { LoginData } from "../../database/DatabaseManager";
import { useAuth } from "../../hooks/auth";
import { useSync } from "../../hooks/sync";

export function Login() {
  const { setUser, errorHandler } = useAuth();
  const { setSyncProcessList } = useSync();

  // método para logar no salesforce
  const handleSalesforceLogin = async () => {
    try {
      // cria um evento antes de abrir o browser para que ele fique
      // "escutando" pela URL de callback após logar no salesforce,
      // para então entrar no método dentro do evento
      Linking.addEventListener("url", async ({ url }) => {
        // pega a URL de callback e substitui o '#' por '?' para
        // poder pegar os parâmetros
        let urlData = Linking.parse(url.replace("#", "?"));

        // pega os parâmetros da URL
        const { access_token, refresh_token, instance_url } =
          urlData.queryParams;

        const data: LoginData = {
          access_token: String(access_token),
          refresh_token: String(refresh_token),
          instance_url: String(instance_url),
        };

        // armazena os dados de conexão do usuário no banco de dados
        const setConnectionResult = await DatabaseManager.setConnectionInfo(
          data
        );

        // caso a plataforma seja IOS, é necessário fechar o browser automáticamente,
        // mas no Android, o event listener fecha sózinho
        if (Platform.OS === "ios") {
          WebBrowser.dismissBrowser();
        }

        // se os dados foram salvos com sucesso...
        if (setConnectionResult.success) {
          // seta os tokens no user para que seja 'confirmado' o login do usuário
          setUser({
            accessToken: access_token,
            refreshToken: refresh_token,
          });

          // inicializa o processo de sincronizar os dados
          setSyncProcessList(["loadBaseData", "refreshAccessToken"]);
        } else { // caso contrário
          // retorna uma mensagem de erro ao usuário
          errorHandler(setConnectionResult.error);
        }
      });

      // URL de login + oauth2
      const url =
        `${env.connection.SALESFORCE_BASE_URL}/services/oauth2/authorize?` +
        `response_type=token&client_id=${env.connection.CLIENT_ID}&redirect_uri=${env.connection.REDIRECT_URL}`;
      // abre o browser dentro do próprio aplicativo para a tela de login do salesforce
      await WebBrowser.openBrowserAsync(url);
    } catch (e) {
      errorHandler(e);
    }
  };

  return (
    <>
      <Container>
        <Logo source={require("../../assets/nescara-logo.png")} />
        <ButtonContainer>
          <Button onPress={handleSalesforceLogin}>
            <ButtonIcon name="salesforce" />
            <ButtonText>Logar no Salesforce</ButtonText>
            <View style={{ flex: 1 }} />
          </Button>
        </ButtonContainer>
        <Description>React Native Template</Description>
      </Container>
    </>
  );
}
