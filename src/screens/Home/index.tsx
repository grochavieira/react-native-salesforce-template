import React from "react";

import {
  Container,
  Title,
  Logo,
} from "./styles";

export function Home() {
  return (
    <>
      <Container>
        <Logo source={require("../../assets/nescara-logo.png")} />
        <Title>Seja Bem-Vindo ao Aplicativo!</Title>
      </Container>
    </>
  );
}
