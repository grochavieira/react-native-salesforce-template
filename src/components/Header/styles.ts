import styled from "styled-components/native";
import { MaterialIcons } from "@expo/vector-icons";

export const Container = styled.View`
  width: 100%;
  height: 90px;
  padding-bottom: 10px;

  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;

  background-color: ${({ theme }) => theme.colors.box};

  position: relative;
`;

export const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const HeaderText = styled.Text`
  flex: 5;
  color: ${({ theme }) => theme.colors.text};

  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 16px;
  text-align: center;
`;

export const HeaderButton = styled.TouchableOpacity`
  flex: 1;
`;

export const Icon = styled(MaterialIcons)`
  font-size: 32px;
  margin-left: 20px;

  color: ${({ theme }) => theme.colors.text};
`;

export const Dummy = styled.View`
  flex: 1;
`;
