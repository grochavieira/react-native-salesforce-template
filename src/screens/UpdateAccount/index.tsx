import React, { useEffect, useState } from "react";
import { Modal } from "react-native";
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

export function UpdateAccount() {
  const navigator = useNavigation();
  const route = useRoute();
  const params = route.params as AccountParams;
  const { setIsLoading, setLoadingStatus, errorHandler } = useAuth();

  const [id, setId] = useState("");
  const [idx, setIdx] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("");
  
  const [isTypeModalVisible, setIsTypeModalVisible] = useState(false);
  const [openAccountModal, setOpenAccountModal] = useState(false);
  const [modalProps, setModalProps] = useState({
    title: "",
    description: "",
    icon: "success",
    okButtonAction: () => {},
  } as ModalProps);

  const [updateErrors, setUpdateErrors] =
    useState<AccountFieldError>(defaultErrors);

  useEffect(() => {
    console.log("route params =>", params);
    if (params.account) {
      const { account } = params;
      setId(account.id);
      setIdx(account.idx);
      setName(account.name);
      setPhone(account.phone);
      setType(account.type);
    } else {
      navigator.goBack();
    }
  }, []);

  const handleUpdateAccount = async () => {
    try {
      const account = {
        name,
        phone,
        type,
      };

      setIsLoading(true);
      setLoadingStatus("Atualizando a conta...");

      const saveAccountResult = await AccountManager.saveAccount(account);

      if (saveAccountResult.success) {
        setModalProps({
          title: "Sucesso",
          description: "A conta foi atualizada com sucesso!",
          icon: "success",
          okButtonAction: navigator.goBack,
        });

        setOpenAccountModal(true);
      } else if (
        saveAccountResult.fieldsError &&
        Object.keys(saveAccountResult.fieldsError).length > 0
      ) {
        setUpdateErrors(saveAccountResult.fieldsError);
        setModalProps({
          title: "Erro nos campos",
          description: "Por favor, verifique os campos prenchidos!",
          icon: "error",
          okButtonAction: () => {},
        });
        setOpenAccountModal(true);
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
          hasError={updateErrors.name.hasError}
          errorMessage={updateErrors.name.message}
          keyboardType="default"
        />
        <Input
          value={phone}
          onAction={setPhone}
          label="Telefone"
          placeholder="Telefone da Conta"
          hasError={updateErrors.phone.hasError}
          errorMessage={updateErrors.phone.message}
          keyboardType="default"
        />
        <ListInput
          value={type}
          onAction={() => setIsTypeModalVisible(true)}
          label="Tipo"
          placeholder="Tipo da Conta"
          hasError={updateErrors.type.hasError}
          errorMessage={updateErrors.type.message}
        />
        <Button text="Atualizar Conta" onAction={() => handleUpdateAccount()} />

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
