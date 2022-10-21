import styled from "styled-components/native";

export const Container = styled.ScrollView.attrs({
  contentContainerStyle: {
    flex: 1,
    alignItems: "center",
  },
  showsVerticalScrollIndicator: false,
})`
  background-color: ${({ theme }) => theme.colors.background};
  padding: 20px;
`;
