import { DatabaseConnection } from "./DatabaseConnection";
import { extractArrayFromDBResult } from "../utils";
import env from "../env";

const db = DatabaseConnection.getConnection();

export interface LoginData {
  instance_url: string;
  refresh_token: string;
  access_token: string;
}

export interface ResponseData {
  success: boolean;
  error: any;
}

export interface SystemData {
  userEmail: string;                
  userName: string;                 
  userIdx: string;                  
  userProfile: string;              
  apiHost: string;                  
  refreshToken: string;             
  sessionKey: string;               
  lastSyncBaseData: string;         
  lastSyncTransactionData: string;  
  lastSyncAccountData: string;      
  lastSyncAccountDataId: string;    
  lastSyncContactData: string;      
  lastSyncContactDataId: string;    
}

export interface AccountRows {
  ACCOUNT_ID: string;
  ACCOUNT_IDX: string;
  ACCOUNT_NAME: string;
  ACCOUNT_PHONE: string;
  ACCOUNT_TYPE: string;
  DELETED: number;
  SYNC_STATUS: number;
}

export interface SystemDataResponse extends ResponseData {
  systemData: SystemData | null;
}

export interface ListResponse extends ResponseData {
  list: string[];
}

export interface OutOfSyncAccountResponse extends ResponseData {
  accounts: AccountRows[];
}

export default class DatabaseManager {
  // Cria as tabelas do banco caso não existam
  static async initDB():Promise<ResponseData> {
    return new Promise(async (resolve) =>
      db.transaction(
        (tx) => {
          // cria a tabela do sistema (dados do usuário)
          tx.executeSql(
            "CREATE TABLE IF NOT EXISTS SYSTEM ( " +
              "	SYSTEM_ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
              "	SYSTEM_VERSION TEXT NOT NULL DEFAULT '', " +
              "	DB_VERSION TEXT NOT NULL DEFAULT '', " +
              "	API_HOST_URL TEXT NOT NULL DEFAULT '', " +
              "	USER_EMAIL TEXT NOT NULL DEFAULT '', " +
              "	USER_NAME TEXT NOT NULL DEFAULT '', " +
              "	USER_IDX TEXT NOT NULL DEFAULT '', " +
              "	USER_PROFILE TEXT NOT NULL DEFAULT '', " +
              "	REFRESH_TOKEN TEXT NOT NULL DEFAULT '', " +
              "	SESSION_KEY TEXT NOT NULL DEFAULT '', " +
              "	LAST_SYNC_BASE_DATA NUMERIC DEFAULT 0, " +
              "	LAST_SYNC_TRANSACTION_DATA NUMERIC DEFAULT 0, " +
              " 	LAST_SYNC_ACCOUNT NUMERIC DEFAULT 0, " +
              " 	LAST_SYNC_ACCOUNT_ID TEXT DEFAULT '', " +
              " 	LAST_SYNC_CONTACT NUMERIC DEFAULT 0, " +
              " 	LAST_SYNC_CONTACT_ID TEXT DEFAULT '' " +
              ");",
            [],
            (txObj, { rows: { _array } }) =>
              tx.executeSql(
                "INSERT OR IGNORE INTO SYSTEM (SYSTEM_ID, SYSTEM_VERSION, DB_VERSION, API_HOST_URL, USER_NAME, " +
                  "USER_EMAIL, USER_IDX, USER_PROFILE, REFRESH_TOKEN, SESSION_KEY) " +
                  'VALUES (1, "' +
                  env.VERSION +
                  '", "' +
                  env.DB_VERSION +
                  '", "", "", "", "", "", "", "");'
              ),
            null,
          );

          tx.executeSql(
            "CREATE TABLE IF NOT EXISTS sync_finger_print ( " +
              "	TABLE_NAME TEXT NOT NULL DEFAULT '', " +
              "	FINGER_PRINT TEXT NOT NULL DEFAULT '', " +
              "	ID INTEGER NOT NULL DEFAULT 0, " +
              "	PRIMARY KEY (TABLE_NAME,FINGER_PRINT)" +
              ");"
          );

          // cria a tabela de contas
          tx.executeSql(
            "CREATE TABLE IF NOT EXISTS ACCOUNT( " +
              "    ACCOUNT_ID INTEGER PRIMARY KEY AUTOINCREMENT, " +
              "    ACCOUNT_IDX TEXT NOT NULL DEFAULT '', " +
              "    ACCOUNT_NAME TEXT NOT NULL DEFAULT '', " +
              "    ACCOUNT_PHONE TEXT NOT NULL DEFAULT '', " +
              "    ACCOUNT_TYPE TEXT NOT NULL DEFAULT '', " +
              "    DELETED NUMERIC NOT NULL DEFAULT 0, " +
              " 	 SYNC_STATUS NUMERIC NOT NULL DEFAULT 0 " +
              "); "
          );

          // cria a tabela de tipos da conta
          tx.executeSql(
            "CREATE TABLE IF NOT EXISTS ACCOUNT_TYPE( " +
              "    ACCOUNT_TYPE_IDX TEXT NOT NULL DEFAULT '', " +
              "    ACCOUNT_TYPE_NAME TEXT NOT NULL DEFAULT '', " +
              "    PRIMARY KEY(ACCOUNT_TYPE_IDX) " +
              "); "
          );

          // cria a tabela de contatos
          tx.executeSql(
            "CREATE TABLE IF NOT EXISTS CONTACT( " +
              "    CONTACT_ID INTEGER PRIMARY KEY AUTOINCREMENT, " +
              "    CONTACT_IDX TEXT NOT NULL DEFAULT '', " +
              "    CONTACT_FIRST_NAME TEXT NOT NULL DEFAULT '', " +
              "    CONTACT_LAST_NAME TEXT NOT NULL DEFAULT '', " +
              "    CONTACT_EMAIL TEXT NOT NULL DEFAULT '', " +
              "    ACCOUNT_IDX TEXT NOT NULL DEFAULT '', " +
              "    DELETED NUMERIC NOT NULL DEFAULT 0, " +
              " 	 SYNC_STATUS NUMERIC NOT NULL DEFAULT 0 " +
              "); "
          );
        },
        (error) => resolve({success: false, error}),
        () => resolve({success: true, error: null})
      )
    );
  }

  // função para executar multiplas queries
  static async bulkSQL(queryGroup: string[]):Promise<ResponseData> {
    return new Promise(async (resolve) =>
      db.transaction(
          (tx) => {
              for (let i = 0; i < queryGroup.length; i++) {
                  tx.executeSql(queryGroup[i]);
              }
          }, (error) => {
              resolve({success: false, error})
          }, () => {
              resolve({success: true, error: null})
          },
      ),
    );
  }

  // seta os dados iniciais de conexão do usuário com a API do salesforce
  static async setConnectionInfo(loginData: LoginData):Promise<ResponseData> {
    return new Promise(async (resolve) =>
        db.transaction(
          (tx) => {
            tx.executeSql(
              " INSERT OR REPLACE INTO SYSTEM " + 
              " (SYSTEM_ID, SYSTEM_VERSION, DB_VERSION, API_HOST_URL, REFRESH_TOKEN, SESSION_KEY) " + 
              " VALUES (?, ?, ?, ?, ?, ?) ",
              [
                  1,
                  env.VERSION,
                  env.DB_VERSION,
                  loginData.instance_url,
                  loginData.refresh_token,
                  loginData.access_token,
              ],
            );
          },
          (error) => resolve({success: false, error}),
          () => resolve({success: true, error: null})
        )
    );
  }

  // atualiza apenas o token de acesso do usuário
  static async updateAccessToken(accessToken: string):Promise<ResponseData> {
    return new Promise(async (resolve) =>
        db.transaction(
            (tx) => {
            tx.executeSql(
                "UPDATE SYSTEM SET SESSION_KEY=? WHERE SYSTEM_ID=1",
                [
                    accessToken,
                ],
            );
            },
            (error) => resolve({success: false, error}), 
            () => resolve({success: true, error: null})
        )
    );
  }

  // puxa todos os dados do usuário
  static async getSystemInfo():Promise<SystemDataResponse> {
    let systemData = null;
    return new Promise(async (resolve) =>
        db.transaction(
            (tx) => {
            tx.executeSql(
                "SELECT * FROM SYSTEM WHERE SYSTEM_ID = 1",
                [],
                (txObj, { rows }) => {
                  if (rows.length > 0) {
                    systemData = {
                      userEmail:                rows.item(0).USER_EMAIL,
                      userName:                 rows.item(0).USER_NAME,
                      userIdx:                  rows.item(0).USER_IDX,
                      userProfile:              rows.item(0).USER_PROFILE,
                      apiHost:                  rows.item(0).API_HOST_URL,
                      refreshToken:             rows.item(0).REFRESH_TOKEN,
                      sessionKey:               rows.item(0).SESSION_KEY,
                      lastSyncBaseData:         rows.item(0).LAST_SYNC_BASE_DATA,
                      lastSyncTransactionData:  rows.item(0).LAST_SYNC_TRANSACTION_DATA,
                      lastSyncAccountData:      rows.item(0).LAST_SYNC_ACCOUNT,
                      lastSyncAccountDataId:    rows.item(0).LAST_SYNC_ACCOUNT_ID,
                      lastSyncContactData:      rows.item(0).LAST_SYNC_CONTACT,
                      lastSyncContactDataId:    rows.item(0).LAST_SYNC_CONTACT_ID,
                    }
                  }
                },
            );
            },
            (error) => resolve({success: false, error, systemData}), 
            () => resolve({success: true, error: null, systemData})
        )
    );
  }

  // puxa todos os dados do tipo da conta (lista)
  static async getAccountType():Promise<ListResponse> {
    let list = [];
    return new Promise(async (resolve) =>
        db.transaction(
          (tx) => {
            const accountTypeQuery = 
            " SELECT    * " +
            " FROM      ACCOUNT_TYPE " + 
            " ORDER BY  ACCOUNT_TYPE_NAME ";
            tx.executeSql(
              accountTypeQuery,
                [],
                (txObj, { rows }) => {
                    if (rows.length > 0) {
                        for (let i = 0; i < rows.length; i++) {
                            list.push(rows.item(i).ACCOUNT_TYPE_NAME);
                        }
                    }
                },
            );
          },
          (error) => resolve({success: false, error, list}),
          () => resolve({success: true, error: null, list})
        )
    );
  }

  // puxa todas as contas que não foram sincronizadas com o salesforce
  static async getOutOfSyncAccounts():Promise<OutOfSyncAccountResponse> {
    let accounts = [];
    return new Promise(async (resolve) =>
        db.transaction(
          (tx) => {
            var accountQuery =
            " SELECT " +
            "					   ACCOUNT_ID, " +
            "					   ACCOUNT_IDX, " +
            "					   ACCOUNT_NAME, " +
            "					   ACCOUNT_PHONE, " +
            "					   ACCOUNT_TYPE, " +
            "					   account_type.ACCOUNT_TYPE_NAME " +
            " FROM       account " +
            " LEFT JOIN  account_type on account_type.ACCOUNT_TYPE_IDX = account.ACCOUNT_TYPE " +
            " WHERE      account.SYNC_STATUS = 0 ";
            tx.executeSql(
              accountQuery,
                [],
                (txObj, { rows }) => {
                    accounts = extractArrayFromDBResult(rows);
                    
                },
            );
          },
          (error) => resolve({success: false, error, accounts}),
          () => resolve({success: true, error: null, accounts})
        )
    );
  }

  // limpa todos os dados do usuário
  static async clearUserInfo(clearAll: boolean):Promise<ResponseData> {
    return new Promise(async (resolve) =>
        db.transaction(
          (tx) => {
            var clearUserQuery =
            "UPDATE SYSTEM SET " +
            ' USER_EMAIL     = "", ' +
            ' USER_NAME      = "", ' +
            ' API_HOST_URL   = "", ' +
            ' REFRESH_TOKEN  = "", ' +
            ' SYSTEM_VERSION = "", ' +
            ' DB_VERSION     = "", ' +
            ' SESSION_KEY    = ""  ' +
            (clearAll
              ? ' , USER_IDX                  	= ""' +
                " , LAST_SYNC_BASE_DATA       	= 0 " +
                " , LAST_SYNC_TRANSACTION_DATA	= 0 " +
                " , LAST_SYNC_ACCOUNT         	= 0 " +
                " , LAST_SYNC_ACCOUNT_ID      	= 0 " +
                " , LAST_SYNC_CONTACT			= 0 " +
                " , LAST_SYNC_CONTACT_ID		= 0 "
              : "") +
            "WHERE SYSTEM_ID = 1";
              tx.executeSql(
                clearUserQuery,
                [],
              );
          },
          (error) => resolve({success: false, error}), 
          () => resolve({success: true, error: null})
        )
    );
  }

  // Remove todos os dados de registros do aplicativo
  static async dropDatabase():Promise<ResponseData> {
    const groupQuery = [
      "DELETE FROM account",
      "DELETE FROM account_type",
      "DELETE FROM contact",
    ];
    
    return await this.bulkSQL(groupQuery);
  }
}
