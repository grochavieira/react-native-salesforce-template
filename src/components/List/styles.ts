import styled, { css } from "styled-components/native";
import { FlatList } from "react-native";

interface SelectedProps {
  isSelected: boolean;
}

export const Container = styled.View`
  flex: 1;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 20px;
`;

export const Header = styled.View`
  width: 100%;
  height: 90px;
  background-color: ${({ theme }) => theme.colors.primary};

  justify-content: flex-end;
`;

export const HeaderTitle = styled.Text`
  color: ${({ theme }) => theme.colors.shape};

  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 16px;
  text-align: center;

  margin-bottom: 15px;
`;

export const SearchResultContainer = styled(
  FlatList as new () => FlatList<string[]>
).attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {
    paddingBottom: 20,
  },
})`
  flex: 1;
  width: 100%;
  margin: 10px 0px;
  padding: 20px 0px;
`;

export const RadioButton = styled.TouchableOpacity`
  width: 100%;
  margin-bottom: 20px;

  flex-direction: row;
  align-items: center;
`;

export const RadioOuterCircle = styled.View<SelectedProps>`
  width: 20px;
  height: 20px;
  margin-right: 10px;
  margin-bottom: 3px;

  border: 3px solid ${({ theme }) => theme.colors.text};
  border-radius: 200px;

  align-items: center;
  justify-content: center;

  ${({ isSelected }) =>
    isSelected &&
    css`
      border-color: ${({ theme }) => theme.colors.primary};
    `}
`;

export const RadioInnerCircle = styled.View`
  width: 10px;
  height: 10px;

  background-color: ${({ theme }) => theme.colors.primary};

  border-radius: 200px;
`;

export const RadioLabel = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 16px;

  color: ${({ theme }) => theme.colors.text};
`;
