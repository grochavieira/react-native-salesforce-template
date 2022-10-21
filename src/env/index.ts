interface Env {
  NAME: string;
  VERSION: string;
  DB_VERSION: string;
  API_VERSION: string;
  connection: {
    SALESFORCE_BASE_URL: string;
    REDIRECT_URL: string;
    CLIENT_ID: string;
    CLIENT_SECRET: string;
  };
}

// aqui é definido as variaveis de ambiente do aplicativo, na qual
// inclui informações sobre o app, assim como dados essenciais
// para a conexão
const env: Env = {
  NAME: "SFAPP",
  VERSION: "1.0",
  DB_VERSION: "1.0",
  API_VERSION: "1_0",
  connection: {
    SALESFORCE_BASE_URL: "https://nscara143-dev-ed.my.salesforce.com",
    REDIRECT_URL: "exp://192.168.1.6:19000",
    CLIENT_ID:
      "",
    CLIENT_SECRET:
      "",
  },
};

export default env;
