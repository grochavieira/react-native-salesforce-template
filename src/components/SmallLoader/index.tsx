import React from "react";
import { useTheme } from "styled-components";
import { ActivityIndicator } from "react-native";

import { Container } from "./styles";

export function SmallLoader() {
  const theme = useTheme();
  return (
    <>
      <Container>
        <ActivityIndicator
          color={theme.colors.primary}
          size="large"
        ></ActivityIndicator>
      </Container>
    </>
  );
}
