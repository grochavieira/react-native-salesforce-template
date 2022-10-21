import styled, { css } from "styled-components/native";

import { ButtonType } from ".";

export const Container = styled.TouchableOpacity<ButtonType>`
  width: 100%;
  padding: 12px;
  margin: 20px 0px;

  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 6px;

  align-items: center;
  justify-content: center;

  ${({ type }) =>
    type === "secondary" &&
    css`
      background-color: ${({ theme }) => theme.colors.secondary};
    `}
`;

export const ButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.shape};

  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 16px;
`;
