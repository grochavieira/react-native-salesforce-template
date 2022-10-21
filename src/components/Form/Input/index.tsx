import React from "react";
import { KeyboardTypeOptions } from "react-native";

import {
  Container,
  InputContainer,
  InputContent,
  Label,
  ErrorMessage,
  Icon,
} from "./styles";

interface InputProps {
  value: string;
  onAction: (value: string) => void;
  label: string;
  placeholder: string;
  hasError: boolean;
  errorMessage: string;
  keyboardType: KeyboardTypeOptions;
  autoCapitalize?: string;
}

export function Input({
  value,
  onAction,
  label,
  placeholder,
  hasError,
  errorMessage,
  keyboardType,
  autoCapitalize,
}: InputProps) {
  return (
    <>
      <Container>
        <Label>
          {label}
          <ErrorMessage>{hasError ? `  *${errorMessage}` : ""}</ErrorMessage>
        </Label>
        <InputContainer hasError={hasError}>
          <InputContent
            value={value}
            onChangeText={(e) => onAction(e)}
            placeholder={placeholder}
            hasError={hasError}
            keyboardType={keyboardType}
            returnKeyType="done"
            autoCapitalize={autoCapitalize ? autoCapitalize : "sentences"}
          />
        </InputContainer>
      </Container>
    </>
  );
}
