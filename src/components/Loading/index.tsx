import React from "react";
import { useTheme } from "styled-components";
import { ActivityIndicator, Modal } from "react-native";

import { Container, LoadingStatus } from "./styles";
import { useAuth } from "../../hooks/auth";

export function Loading() {
  const { isLoading, loadingStatus } = useAuth();
  const theme = useTheme();
  return (
    <>
      <Modal visible={isLoading} transparent={true} animationType="fade" >
        <Container>
          <ActivityIndicator color={theme.colors.primary} size="large"></ActivityIndicator>
          <LoadingStatus>{loadingStatus}</LoadingStatus>
        </Container>
      </Modal>
    </>
  );
}
