import React, { useEffect } from "react";
import { Modal } from "react-native";

import {
  Container,
  Box,
  Title,
  Description,
  ButtonContainer,
  Button,
  ButtonText,
  Icon
} from "./styles";

export interface ModalProps {
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
  title: string;
  description: string;
  okButtonText: string;
  okButtonType: "main" | "minor";
  okButtonAction?: () => any;
  cancelButtonText?: string;
  cancelButtonType?: "main" | "minor";
  cancelButtonAction?: () => any;
  icon: 'success' | 'warning' | 'error' | 'info';
}

const icons = {
  success: 'checkcircleo',
  warning: 'warning',
  error: 'exclamationcircleo',
  info: 'infocirlceo'
}

export function CustomModal({
  openModal,
  setOpenModal,
  title,
  description,
  okButtonText,
  okButtonType,
  okButtonAction,
  cancelButtonText,
  cancelButtonType,
  cancelButtonAction,
  icon
}: ModalProps) {
  const handleCancelButton = async () => {
    setOpenModal(false);
    if (cancelButtonAction) {
      cancelButtonAction();
    }
  };

  const handleOkButton = async () => {
    setOpenModal(false);
    if (okButtonAction) {
      okButtonAction();
    }
  };

  return (
    <>
      <Modal visible={openModal} transparent={true} animationType="fade">
        <Container>
          <Box>
            <Icon name={icons[icon]} type={icon} />
            <Title>{title}</Title>
            <Description>{description}</Description>
            <ButtonContainer>
              {cancelButtonText ? (
                <Button onPress={handleCancelButton} type={cancelButtonType}>
                  <ButtonText type={cancelButtonType}>
                    {cancelButtonText}
                  </ButtonText>
                </Button>
              ) : (
                <></>
              )}

              {okButtonText ? (
                <Button onPress={handleOkButton} type={okButtonType}>
                  <ButtonText type={okButtonType}>{okButtonText}</ButtonText>
                </Button>
              ) : (
                <></>
              )}
            </ButtonContainer>
          </Box>
        </Container>
      </Modal>
    </>
  );
}
