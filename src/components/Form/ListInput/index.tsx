import React from "react";
import { KeyboardTypeOptions } from "react-native";

import {
  Container,
  InputContainer,
  InputContent,
  Label,
  ErrorMessage,
  Icon,
  Placeholder,
} from "./styles";

interface InputProps {
  value: string;
  onAction: () => void;
  label: string;
  placeholder: string;
  hasError: boolean;
  errorMessage: string;
}

export function ListInput({
  value,
  onAction,
  label,
  placeholder,
  hasError,
  errorMessage,
}: InputProps) {
  return (
    <>
      <Container>
        <Label>
          {label}
          <ErrorMessage>{hasError ? `  *${errorMessage}` : ""}</ErrorMessage>
        </Label>
        <InputContainer onPress={() => onAction()} hasError={hasError}>
          {value ? (
            <InputContent>{value}</InputContent>
          ) : (
            <Placeholder>{placeholder}</Placeholder>
          )}
          <Icon name="keyboard-arrow-down"/>
        </InputContainer>
      </Container>
    </>
  );
}
