import React, { useEffect, useState } from "react";
import DatabaseManager from "../../database/DatabaseManager";

import { Button } from "../Form/Button";

import {
  Container,
  Header,
  HeaderTitle,
  SearchResultContainer,
  RadioButton,
  RadioOuterCircle,
  RadioInnerCircle,
  RadioLabel,
} from "./styles";

interface ListProps {
  value: string;
  setValue: (value: string) => void;
  headerTitle: string;
  listType: "ACCOUNT_TYPE";
  buttonText: string;
  onAction: () => void;
}

const listTypes = {
  ACCOUNT_TYPE: "getAccountType",
};

export function List({
  value,
  setValue,
  headerTitle,
  listType,
  buttonText,
  onAction,
}: ListProps) {
  const [list, setList] = useState([]);

  const loadList = async () => {
    const listResult = await DatabaseManager[listTypes[listType]]();
    setList(listResult.list);
  };

  useEffect(() => {
    loadList();
  }, []);

  const handleSelectedOption = (option: string) => {
    setValue(option);
  }

  return (
    <>
      <Header>
        <HeaderTitle>{headerTitle}</HeaderTitle>
      </Header>
      <Container>
        <SearchResultContainer
          style={{
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: "#33333333",
          }}
          data={list}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <RadioButton onPress={() => handleSelectedOption(item)}>
              <RadioOuterCircle
                isSelected={item === value ? true : false}
              >
                {item === value ? (
                  <RadioInnerCircle></RadioInnerCircle>
                ) : (
                  <></>
                )}
              </RadioOuterCircle>
              <RadioLabel>{item}</RadioLabel>
            </RadioButton>
          )}
          ListEmptyComponent={() => <></>}
        />
        <Button text={buttonText} onAction={() => onAction()} />
      </Container>
    </>
  );
}
