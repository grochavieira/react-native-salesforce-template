import React, { useEffect, useState } from "react";

import { CustomModal } from "../../components/CustomModal";

import {
  Container,
  Title,
  ActionContainer,
  Action,
  ActionContent,
  ActionIconFeather,
  ActionIconAntDesign,
  ActionIconMaterialIcons,
  ActionName,
} from "./styles";

import { useAuth } from "../../hooks/auth";
import { useSync } from "../../hooks/sync";

export interface Action {
  name: string;
  icon: string;
  onPress: () => void;
}

export function MyAccount() {
  const { user, handleLogout } = useAuth();
  const { setSyncProcessList } = useSync();

  const [openSyncModal, setOpenSyncModal] = useState(false);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);

  useEffect(() => {}, []);

  const handleSyncData = () => {
    setSyncProcessList([
      "loadBaseData",
      "sendAccountData",
      "sendContactData",
      "refreshAccessToken",
    ]);
  };

  return (
    <>
      <CustomModal
        openModal={openSyncModal}
        setOpenModal={setOpenSyncModal}
        title="Sincronizar Dados"
        description="Tem certeza que deseja sincronizar seus dados?"
        okButtonText="Sim"
        okButtonType="main"
        okButtonAction={handleSyncData}
        cancelButtonText="Não"
        cancelButtonType="minor"
        icon="info"
      />
      <CustomModal
        openModal={openLogoutModal}
        setOpenModal={setOpenLogoutModal}
        title="Deseja Sair?"
        description="Se confirmar, o processo de login terá que ser feito novamente sendo necessário uma conexão com a internet."
        okButtonText="Sim"
        okButtonType="main"
        okButtonAction={handleLogout}
        cancelButtonText="Não"
        cancelButtonType="minor"
        icon="info"
      />
      <Container>
        <Title>{user.userName}</Title>

        <ActionContainer>
          <Action onPress={() => setOpenSyncModal(true)}>
            <ActionContent>
              <ActionIconAntDesign name="sync" />
              <ActionName>Sincronizar</ActionName>
            </ActionContent>
            <ActionIconMaterialIcons name="keyboard-arrow-right" />
          </Action>
        </ActionContainer>

        <ActionContainer>
          <Action onPress={() => setOpenLogoutModal(true)}>
            <ActionContent>
              <ActionIconFeather name="log-out" />
              <ActionName>Sair</ActionName>
            </ActionContent>
            <ActionIconMaterialIcons name="keyboard-arrow-right" />
          </Action>
        </ActionContainer>
      </Container>
    </>
  );
}
