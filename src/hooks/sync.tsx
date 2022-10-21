import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import NetInfo from "@react-native-community/netinfo";

import DatabaseManager, { LoginData } from "../database/DatabaseManager";
import SyncController from "../controllers/SyncController";
import env from "../env";
import { api } from "../services/api";
import { useAuth } from "./auth";

interface SyncProviderProps {
  children: ReactNode;
}

interface ISyncContextData {
  setSyncProcessList: (processList: string[]) => void;
}

export const SyncContext = createContext({} as ISyncContextData);

function SyncProvider({ children }: SyncProviderProps) {
  const { setUser, setIsLoading, setLoadingStatus, errorHandler } = useAuth();
  const [syncProcessList, setSyncProcessList] = useState([]);

  // atualiza o access token (SESSION_KEY) do sistema (usuário)
  const refreshAccessToken = async () => {
    try {
      const { systemData } = await DatabaseManager.getSystemInfo();

      const refreshTokenResponse = await api.post(
        `/services/oauth2/token?grant_type=refresh_token&client_id=${env.connection.CLIENT_ID}&refresh_token=${systemData.refreshToken}&client_secret=${env.connection.CLIENT_SECRET}`,
        []
      );

      const { access_token } = refreshTokenResponse.data;

      const setConnectionResult = await DatabaseManager.updateAccessToken(
        access_token
      );

      if (!setConnectionResult.success) {
        return errorHandler(setConnectionResult.error);
      } else {
        api.defaults.headers.Authorization = `Bearer ${access_token}`;

        syncProcessList.pop();
        setSyncProcessList([...syncProcessList]);
      }
    } catch (err) {
      errorHandler(err);
    }
  };

  // sincroniza os dados do salesforce com o aplicativo
  const syncBaseData = async () => {
    try {
      console.log("antes do sync");
      const { systemData } = await DatabaseManager.getSystemInfo();

      console.log("systemData => ", systemData);

      const data = {
        lastSyncStamp: {
          accountSync: {
            lastSyncStamp: systemData.lastSyncAccountData,
            lastSyncId: systemData.lastSyncAccountDataId,
          },
          contactSync: {
            lastSyncStamp: systemData.lastSyncContactData,
            lastSyncId: systemData.lastSyncContactDataId,
          },
        },
      };

      const response = await api.post(
        `/services/apexrest/${env.NAME}/${env.API_VERSION}/loadBaseData/`,
        data
      );

      console.log(response.data);

      const { hasMore } = response.data;
      const query = SyncController.generateSyncQuery(response.data);

      console.log(query);
      const queryResult = await DatabaseManager.bulkSQL(query);
      // console.log("queryResult =>", queryResult);
      console.log("depois do sync");

      if (hasMore) {
        setTimeout(() => {
          syncBaseData();
        }, 10);
      } else {
        // setUser(systemData);
        syncProcessList.pop();
        setSyncProcessList([...syncProcessList]);
        setIsLoading(false);
        console.log("finalizou o processo de sincronizar");
      }
    } catch (err) {
      errorHandler(err);
      setIsLoading(false);
    }
  };

  // método para sincronizar os dados pendentes com o aplicativo (qualquer registro),
  // salvando o id do registro que veio do salesforce no banco local
  const syncResponseTransactData = async (received, object) => {
    let groupQuery = [];

    groupQuery.push(
      `UPDATE ${object} SET ${object}_IDX = '${received.id}', SYNC_STATUS = '1' WHERE ${object}_ID = ${received.appCode}`
    );

    return await DatabaseManager.bulkSQL(groupQuery);
  };

  // sincronização para enviar contas pendentes
  const sendAccountData = async () => {
    try {
      let accountResult = await DatabaseManager.getOutOfSyncAccounts();

      console.log("accountResult =>", accountResult);

      if (
        accountResult.accounts == null ||
        accountResult.accounts.length == 0
      ) {
        syncProcessList.pop();
        setSyncProcessList([...syncProcessList]);
        return;
      }

      const { accounts } = accountResult;

      let accountList = [];

      accounts.forEach((item) => {
        accountList.push({
          id: item.ACCOUNT_IDX ? item.ACCOUNT_IDX : null,
          appCode: item.ACCOUNT_ID,
          name: item.ACCOUNT_NAME,
          phone: item.ACCOUNT_PHONE,
          type: item.ACCOUNT_TYPE,
        });
      });

      let accountLength = accountList.length;
      let hasError = false;
      let count = 0;

      for (const account of accountList) {
        const accountResponse = await api.post(
          `/services/apexrest/${env.NAME}/${env.API_VERSION}/sendAccountData`,
          { accountReq: JSON.stringify(account) }
        );

        if (!accountResponse.data.hasError) {
          const queryResult = await syncResponseTransactData(
            accountResponse.data,
            "ACCOUNT"
          );
          if (!queryResult.success) {
            errorHandler(
              "Não foi possível sincronizar as contas com o aplicativo.",
              { title: "Erro ao sincronizar contas", icon: "warning" }
            );
          }
        } else {
          hasError = true;
        }

        if (count == accountLength) {
          if (hasError) {
            errorHandler("Ocorreram erros ao sincronizar as contas.", {
              title: "Erro ao sincronizar contas",
              icon: "warning",
            });
          }
        }
      }

      syncProcessList.pop();
      setSyncProcessList([...syncProcessList]);
    } catch (err) {
      errorHandler(err);
      setIsLoading(false);
    }
  };

  const sendContactData = async () => {
    try {
      syncProcessList.pop();
      setSyncProcessList([...syncProcessList]);
    } catch (err) {
      errorHandler(err);
      setIsLoading(false);
    }
  };

  const continueSyncProcess = async () => {
    console.log("sync process mudou");
    console.log("syncProcessList =>", syncProcessList);

    setIsLoading(true);
    if (syncProcessList.length > 0) {
      // Checa conexão do usuário
      const netResponse = await NetInfo.fetch();

      if (netResponse.isConnected) {
        let process = syncProcessList[syncProcessList.length - 1];

        switch (process) {
          case "loadBaseData":
            setLoadingStatus("Carregando dados do Salesforce...");
            setTimeout(function () {
              syncBaseData();
            }, 0);
            break;
          case "sendAccountData":
            setLoadingStatus("Enviando dados de conta...");
            setTimeout(function () {
              sendAccountData();
            }, 0);
            break;
          case "sendContactData":
            setLoadingStatus("Enviando dados de contato...");
            setTimeout(function () {
              sendContactData();
            }, 0);
            break;
          case "refreshAccessToken":
            setLoadingStatus(`Atualizando o token...`);
            setTimeout(function () {
              refreshAccessToken();
            }, 0);
            break;
        }
      } else {
        setIsLoading(false);
        setLoadingStatus("");
        errorHandler(
          "Verifique sua conexão com a internet e tente novamente.",
          { title: "Erro de conexão", icon: "warning" }
        );
      }
    } else {
      setIsLoading(false);
      setLoadingStatus("");
      const systemDataResponse = await DatabaseManager.getSystemInfo();
      if (systemDataResponse.success) {
        console.log("puxou dados da conta");
        setUser(systemDataResponse.systemData);
      } else {
        errorHandler("Não foi possível recuperar as informações da sua conta.");
      }
    }
  };

  useEffect(() => {
    continueSyncProcess();
  }, [syncProcessList]);

  return (
    <SyncContext.Provider
      value={{
        setSyncProcessList,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
}

function useSync() {
  const context = useContext(SyncContext);

  return context;
}

export { SyncProvider, useSync };
