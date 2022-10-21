import styled from "styled-components/native";
import { Feather, AntDesign, MaterialIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";

export const Container = styled.ScrollView.attrs({
  contentContainerStyle: {
    flex: 1,
  },
  showsVerticalScrollIndicator: false,
})`
  background-color: ${({ theme }) => theme.colors.background};
  padding: 60px 20px;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${RFValue(18)}px;
  font-weight: regular;
  margin-bottom: 20px;
  font-family: ${({ theme }) => theme.fonts.medium};
`;

export const ActionContainer = styled.View`
  border: 1px solid transparent;
  border-bottom-color: ${({ theme }) => theme.colors.text}16;
`;

export const ActionContent = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Action = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  padding: 20px 5px;
`;

export const ActionIconFeather = styled(Feather)`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${RFValue(18)}px;

  margin-right: 20px;
`;

export const ActionIconAntDesign = styled(AntDesign)`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${RFValue(18)}px;

  margin-right: 20px;
`;

export const ActionIconMaterialIcons = styled(MaterialIcons)`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${RFValue(18)}px;
`;

export const ActionName = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${RFValue(14)}px;
  font-weight: regular;
  font-family: ${({ theme }) => theme.fonts.regular};
`;
