import React, { useCallback, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { SmallLoader } from "../../components/SmallLoader";

import {
  Container,
  AccountContainer,
  Account,
  AccountNameContainer,
  AccountName,
  AccountInfo,
  ButtonContainer,
  Button,
  ButtonIcon,
  Icon,
} from "./styles";

import AccountManager, { AccountData } from "../../database/AccountManager";
import { useAuth } from "../../hooks/auth";

export function Accounts() {
  const { errorHandler } = useAuth();
  const navigator = useNavigation();
  const [accounts, setAccounts] = useState([]);
  const [isAccountLoading, setAccountLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadAccounts = async () => {
        setAccountLoading(true);
        try {
          const result = await AccountManager.getAccounts();
          setAccounts(result.accounts);
        } catch (err) {
          errorHandler(err);
        } finally {
          setAccountLoading(false);
        }
      };
      loadAccounts();
    }, [])
  );

  return (
    <>
      <Container>
        {isAccountLoading ? (
          <SmallLoader />
        ) : (
          <>
            <AccountContainer>
              {accounts.length > 0 &&
                accounts.map((item: AccountData) => (
                  <Account key={item.id} onPress={() => navigator.navigate("SaveAccount", {account: item})}>
                    <AccountNameContainer>
                      <AccountName>{item.name}</AccountName>
                      {item.syncStatus === 0 ? <Icon name="sync" /> : null}
                    </AccountNameContainer>

                    <AccountInfo>Telefone: {item.phone}</AccountInfo>
                    <AccountInfo>Tipo: {item.type}</AccountInfo>
                    <AccountInfo>IDX: {item.idx}</AccountInfo>
                  </Account>
                ))}
            </AccountContainer>
            <ButtonContainer
              onPress={() => navigator.navigate("SaveAccount")}
            >
              <Button>
                <ButtonIcon name="plus" />
              </Button>
            </ButtonContainer>
          </>
        )}
      </Container>
    </>
  );
}
