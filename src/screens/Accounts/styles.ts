import styled from "styled-components/native";
import { RFValue } from 'react-native-responsive-fontsize';
import { AntDesign, Entypo } from '@expo/vector-icons';

export const Container = styled.View`
flex: 1;
  position: relative;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 0px 20px;
  padding-top: 60px;
`;

export const AccountContainer = styled.ScrollView.attrs({
  contentContainerStyle: {
    paddingBottom: 200,
  },
  showsVerticalScrollIndicator: false,
})`
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Account = styled.TouchableOpacity`
  margin: 10px 0px;
  padding: 20px;
  background-color: #F7F5F5;
  border: 1px solid #F7F5F5;
  border-radius: 5px;
`;

export const AccountNameContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 10px;
`;

export const AccountName = styled.Text`
  margin-right: 10px;
  flex: 1;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${RFValue(12)}px;
  font-weight: regular;
  font-family: ${({ theme }) => theme.fonts.medium};
`;

export const AccountInfo = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${RFValue(10)}px;
  margin-bottom: 2px;
  font-family: ${({ theme }) => theme.fonts.regular};
`;

export const ButtonContainer = styled.TouchableOpacity`
  width: 100%;
`;

export const Button = styled.View`
  position: absolute;
  width: 60px;
  height: 60px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50px;

  align-items: center;
  justify-content: center;

  bottom: 0px;
  right: 0px;
  margin-bottom: 20px;
`;

export const ButtonIcon = styled(Entypo)`
  color: ${({ theme }) => theme.colors.background};
  font-size: ${RFValue(28)}px;
`;

export const Icon = styled(AntDesign)`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${RFValue(16)}px;
`;
