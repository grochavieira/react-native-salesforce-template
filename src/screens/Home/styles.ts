import styled from "styled-components/native";
import { RFValue } from "react-native-responsive-fontsize";

export const Container = styled.ScrollView.attrs({
  contentContainerStyleProp: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  showsVerticalScrollIndicator: false,
})`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 20px;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${RFValue(28)}px;
  font-family: ${({ theme }) => theme.fonts.bold};
  text-align: center;

  margin-top: 100px;
`;

export const Logo = styled.Image`
  width: 200px;
  height: 55px;
  margin-top: 50px;
  align-self: center;
`;
