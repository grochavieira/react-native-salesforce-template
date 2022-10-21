import React from "react";
import { useNavigation } from "@react-navigation/native";

import {
  Container,
  HeaderContainer,
  HeaderText,
  HeaderButton,
  Icon,
  Dummy,
} from "./styles";

export function Header({ title }) {
  const navigation = useNavigation();
  return (
    <>
      <Container style={{ borderBottomWidth: 1, borderColor: "#33333310" }}>
        <HeaderContainer>
          <HeaderButton onPress={() => navigation.goBack()}>
            <Icon name="keyboard-arrow-left" />
          </HeaderButton>
          <HeaderText>{title}</HeaderText>
          <Dummy />
        </HeaderContainer>
      </Container>
    </>
  );
}
