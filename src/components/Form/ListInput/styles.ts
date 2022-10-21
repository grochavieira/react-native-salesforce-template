import styled, { css } from "styled-components/native";
import { MaterialIcons } from "@expo/vector-icons";

interface InputProps {
  hasError: boolean;
}

export const Container = styled.View`
  width: 100%;

  position: relative;
`;

export const Label = styled.Text`
  color: ${({ theme }) => theme.colors.text};

  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 14px;
`;

export const ErrorMessage = styled.Text`
  color: ${({ theme }) => theme.colors.attention};
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 8px;
  text-transform: uppercase;
`;

export const InputContainer = styled.TouchableOpacity<InputProps>`
  flex-direction: row;
  align-items: center;

  width: 100%;
  height: 45px;
  padding: 0px 10px;
  margin-bottom: 15px;

  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 12px;

  background-color: ${({ theme }) => theme.colors.box};
  border: 1px solid ${({ theme }) => theme.colors.text}16;

  border-radius: 4px;

  ${({ hasError }) =>
    hasError &&
    css`
      border: 2px solid ${({ theme }) => theme.colors.attention};
    `}
`;

export const InputContent = styled.Text`
  flex: 1;

  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 12px;

  color: ${({ theme }) => theme.colors.text};

  margin-right: 5px;
`;

export const Placeholder = styled.Text`
  flex: 1;

  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 12px;

  color: ${({ theme }) => theme.colors.text}80;

  margin-right: 5px;
`;

export const Icon = styled(MaterialIcons)`
  color: ${({ theme }) => theme.colors.text};

  font-size: 20px;
`;
