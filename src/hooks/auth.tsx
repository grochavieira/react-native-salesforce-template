import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {Platform} from 'react-native';

import DatabaseManager, { SystemData } from "../database/DatabaseManager";

interface AuthProviderProps {
  children: ReactNode;
}

interface User extends SystemData {}

interface GlobalModalProps {
  title?: string;
  description?: string;
  okButtonText?: string;
  okButtonType?: "main" | "minor";
  okButtonAction?: () => any;
  cancelButtonText?: string;
  cancelButtonType?: "main" | "minor";
  cancelButtonAction?: () => any;
  icon?: "success" | "warning" | "error" | "info";
}

interface IAuthContextData {
  user: User;
  setUser: (user: any) => void;
  loadingStatus: string;
  setLoadingStatus: (status: string) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  handleLogout: () => Promise<void>;
  errorHandler: (e: any) => void;
  globalModal: GlobalModalProps;
  setGlobalModal: (globalModalProps: GlobalModalProps) => void;
  openGlobalModal: boolean;
  setOpenGlobalModal: (value: boolean) => void;
}

export const AuthContext = createContext({} as IAuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [globalModal, setGlobalModal] = useState({} as GlobalModalProps);
  const [user, setUser] = useState<User>({} as User);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openGlobalModal, setOpenGlobalModal] = useState(false);

  useEffect(() => {
    initApplication();
  }, []);

  // método para lidar com os erros da aplicação, resetar os loadings
  // e apresentar um popup com o erro
  const errorHandler = (e: any, globalProps?: GlobalModalProps) => {
    console.log("errorHandler =>", e);
    let error = "";
    if (e === null) {
      error = "Houve um erro no sistema";
    } else {
      error = typeof e.code != "undefined" ? "( code: " + e.code + " ) " : "";
      error += typeof e.message != "undefined" ? e.message : e;
    }

    setGlobalModal({
      title:
        globalProps && globalProps.title ? globalProps.title : "Internal Error",
      icon: globalProps && globalProps.icon ? globalProps.icon : "error",
      description:
        globalProps && globalProps.description
          ? globalProps.description
          : error,
      okButtonText:
        globalProps && globalProps.okButtonText
          ? globalProps.okButtonText
          : "OK",
      okButtonType:
        globalProps && globalProps.okButtonType
          ? globalProps.okButtonType
          : "main",
    });

    setIsLoading(false);
    setLoadingStatus("");
    
    setTimeout(() => {
      setOpenGlobalModal(true);
    }, Platform.OS === 'ios' ? 600 : 0);
  };

  // inicializa a aplicação, montando o banco de dados
  // e puxando os dados do usuário para 'loga-lo' caso
  // exista os dados
  async function initApplication() {
    setIsLoading(true);
    try {
      setLoadingStatus("Carregando dados...");
      await DatabaseManager.initDB();
      const system = await DatabaseManager.getSystemInfo();

      if (system.success) {
        setUser(system.systemData);
      } else {
        return errorHandler(system.error);
      }
    } catch (err) {
      errorHandler(err);
    } finally {
      setIsLoading(false);
    }
  }

  // método para deslogar o usuário
  const handleLogout = async () => {
    try {
      // limpa todos os dados do usuário
      const clearResult = await DatabaseManager.clearUserInfo(true);
      if (!clearResult.success) {
        return errorHandler(clearResult.error);
      }
      // limpa todos os dados de registros
      const dropResult = await DatabaseManager.dropDatabase();
      if (!dropResult.success) {
        return errorHandler(dropResult.error);
      }
      // 'desloga' de fato o usuário
      setUser({} as User);
    } catch (err) {
      errorHandler(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loadingStatus,
        setLoadingStatus,
        isLoading,
        setIsLoading,
        handleLogout,
        errorHandler,
        globalModal,
        setGlobalModal,
        openGlobalModal,
        setOpenGlobalModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };
