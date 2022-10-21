import styled from "styled-components/native";
import { FontAwesome5 } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";

export const Container = styled.ScrollView.attrs({
  contentContainerStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
  },
  showsVerticalScrollIndicator: false,
})`
  background-color: ${({ theme }) => theme.colors.background};
  padding: 20px;
`;

export const ButtonContainer = styled.View`
  width: 100%;
`;

export const Button = styled.TouchableOpacity`
  width: 100%;
  padding: 12px;
  margin-bottom: 50px;

  background-color: ${({ theme }) => theme.colors.primary};

  border-radius: 5px;

  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const ButtonText = styled.Text`
  flex: 4;

  color: ${({ theme }) => theme.colors.background};

  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: ${RFValue(14)}px;
  text-align: center;
`;

export const ButtonIcon = styled(FontAwesome5)`
  flex: 1;

  color: ${({ theme }) => theme.colors.background};

  font-size: ${RFValue(28)}px;

  margin-left: 10px;
`;

export const Logo = styled.Image`
  width: 200px;
  height: 55px;
`;

export const Description = styled.Text`
  margin-top: 20px;

  color: ${({ theme }) => theme.colors.primary};

  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: ${RFValue(18)}px;
`;
