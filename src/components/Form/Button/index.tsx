import React from "react";

import { Container, ButtonText } from "./styles";

export interface ButtonType {
  type?: "primary" | "secondary";
}

interface ButtonProps extends ButtonType {
  text: string;
  onAction: () => void;
}

export function Button({ type, text, onAction }: ButtonProps) {
  return (
    <>
      <Container type={type} onPress={onAction}>
        <ButtonText>{text}</ButtonText>
      </Container>
    </>
  );
}