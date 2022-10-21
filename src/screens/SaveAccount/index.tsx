import React, { useState, useEffect } from "react";
import { Modal, Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { Input } from "../../components/Form/Input";
import { ListInput } from "../../components/Form/ListInput";
import { Button } from "../../components/Form/Button";
import { List } from "../../components/List";
import { CustomModal } from "../../components/CustomModal";

import { Container } from "./styles";

import AccountManager, {
  AccountFieldError,
  AccountData,
} from "../../database/AccountManager";
import { useAuth } from "../../hooks/auth";

const defaultErrors: AccountFieldError = {
  name: {
    hasError: false,
    message: "",
  },
  phone: {
    hasError: false,
    message: "",
  },
  type: {
    hasError: false,
    message: "",
  },
};

interface ModalProps {
  title: string;
  description: string;
  icon: "success" | "warning" | "error" | "info";
  okButtonAction: () => void;
}

interface AccountParams {
  account: AccountData;
}

export function SaveAccount() {
  const navigator = useNavigation();
  const { setIsLoading, setLoadingStatus, errorHandler } = useAuth();
  const route = useRoute();
  const params = route.params as AccountParams;

  const [id, setId] = useState("");
  const [idx, setIdx] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("");
  const [isNewAccount, setIsNewAccount] = useState(false);
  
  const [isTypeModalVisible, setIsTypeModalVisible] = useState(false);
  const [openAccountModal, setOpenAccountModal] = useState(false);
  const [modalProps, setModalProps] = useState({
    title: "",
    description: "",
    icon: "success",
    okButtonAction: () => {},
  } as ModalProps);

  const [registerErrors, setRegisterErrors] =
    useState<AccountFieldError>(defaultErrors);

  useEffect(() => {
    console.log("route params =>", params);
    if (params && params.account) {
      const { account } = params;
      setId(account.id);
      setIdx(account.idx);
      setName(account.name);
      setPhone(account.phone);
      setType(account.type);
      setIsNewAccount(false);
    } else {
      setIsNewAccount(true);
    }
  }, []);

  const handleRegisterAccount = async () => {
    try {
      setIsLoading(true);
      setLoadingStatus("Salvando a conta...");

      const account = {
        id,
        name,
        phone,
        type,
      };

      const saveAccountResult = await AccountManager.saveAccount(account);
      
      if (saveAccountResult.success) {
        setModalProps({
          title: "Sucesso",
          description: "A conta foi salva com sucesso!",
          icon: "success",
          okButtonAction: navigator.goBack,
        });

        setTimeout(() => {
          setOpenAccountModal(true);
        }, Platform.OS === 'ios' ? 600 : 0);
        
      } else if (
        saveAccountResult.fieldsError &&
        Object.keys(saveAccountResult.fieldsError).length > 0
      ) {
        setRegisterErrors(saveAccountResult.fieldsError);
        setModalProps({
          title: "Erro nos campos",
          description: "Por favor, verifique os campos prenchidos!",
          icon: "error",
          okButtonAction: () => {},
        });
        setTimeout(() => {
          setOpenAccountModal(true);
        }, Platform.OS === 'ios' ? 600 : 0);
      } else {
        errorHandler(saveAccountResult.error);
      }
    } catch (err) {
      errorHandler(err);
    } finally {
      setIsLoading(false);
      setLoadingStatus("");
    }
  };

  return (
    <>
      <CustomModal
        openModal={openAccountModal}
        setOpenModal={setOpenAccountModal}
        title={modalProps.title}
        description={modalProps.description}
        okButtonText="OK"
        okButtonType="main"
        okButtonAction={modalProps.okButtonAction}
        icon={modalProps.icon}
      />
      <Container>
        <Input
          value={name}
          onAction={setName}
          label="Nome"
          placeholder="Nome da Conta"
          hasError={registerErrors.name.hasError}
          errorMessage={registerErrors.name.message}
          keyboardType="default"
        />
        <Input
          value={phone}
          onAction={setPhone}
          label="Telefone"
          placeholder="Telefone da Conta"
          hasError={registerErrors.phone.hasError}
          errorMessage={registerErrors.phone.message}
          keyboardType="default"
        />
        <ListInput
          value={type}
          onAction={() => setIsTypeModalVisible(true)}
          label="Tipo"
          placeholder="Tipo da Conta"
          hasError={registerErrors.type.hasError}
          errorMessage={registerErrors.type.message}
        />
        <Button
          text="Salvar Conta"
          onAction={() => handleRegisterAccount()}
        />

        <Modal
          animationType="fade"
          visible={isTypeModalVisible}
          transparent={true}
        >
          <List
            value={type}
            setValue={setType}
            listType="ACCOUNT_TYPE"
            headerTitle="Tipo da Conta"
            buttonText="Selecionar Tipo da Conta"
            onAction={() => setIsTypeModalVisible(false)}
          />
        </Modal>
        <Modal
          animationType="fade"
          visible={isTypeModalVisible}
          transparent={true}
        >
          <List
            value={type}
            setValue={setType}
            listType="ACCOUNT_TYPE"
            headerTitle="Tipo da Conta"
            buttonText="Selecionar Tipo da Conta"
            onAction={() => setIsTypeModalVisible(false)}
          />
        </Modal>
      </Container>
    </>
  );
}
