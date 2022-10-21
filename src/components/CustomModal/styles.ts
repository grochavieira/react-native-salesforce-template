import styled, { css } from "styled-components/native";
import { AntDesign } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";

export interface ButtonType {
  type: "main" | "minor";
}

export interface IconProps {
  type: "success" | "warning" | "error" | "info";
}

export const Container = styled.View`
  position: absolute;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;
  padding: 50px 20px;

  background-color: ${({ theme }) => theme.colors.text}70;

  z-index: 0;
`;

export const Box = styled.View`
  width: 100%;
  min-height: 200px;
  padding: 15px;

  background-color: ${({ theme }) => theme.colors.shape};

  border-radius: 6px;

  align-items: center;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.colors.text};

  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: ${RFValue(18)}px;
`;

export const Description = styled.Text`
  color: ${({ theme }) => theme.colors.text};

  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 14px;
  text-align: center;

  margin: 20px 0px;
`;

export const ButtonContainer = styled.View`
  margin-top: auto;

  flex-direction: row;
  justify-content: flex-end;
`;

export const Button = styled.TouchableOpacity<ButtonType>`
  width: 120px;
  height: 40px;
  margin-left: 10px;

  align-items: center;
  justify-content: center;

  border-radius: 3px;

  ${({ type }) => {
    if (type === "main") {
      return css`
        background-color: ${({ theme }) => theme.colors.primary};
      `;
    } else if (type === "minor") {
      return css`
        background-color: ${({ theme }) => theme.colors.box};
      `;
    }
  }}
`;

export const ButtonText = styled.Text<ButtonType>`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: ${RFValue(14)}px;

  ${({ type }) => {
    if (type === "main") {
      return css`
        color: ${({ theme }) => theme.colors.shape};
      `;
    } else if (type === "minor") {
      return css`
        color: ${({ theme }) => theme.colors.primary};
      `;
    }
  }}
`;

export const Icon = styled(AntDesign)<IconProps>`
  font-size: ${RFValue(80)}px;
  margin-bottom: 20px;

  ${({ type }) => {
    if (type === "success") {
      return css`
        color: ${({ theme }) => theme.colors.success};
      `;
    } else if (type === "warning") {
      return css`
        color: ${({ theme }) => theme.colors.warning};
      `;
    } else if (type === "error") {
      return css`
        color: ${({ theme }) => theme.colors.attention};
      `;
    } else if (type === "info") {
      return css`
        color: ${({ theme }) => theme.colors.info};
      `;
    }
  }}
`;
