import { DatabaseConnection } from "./DatabaseConnection";
import { ResponseData } from './DatabaseManager';
import { stringEscape } from "../utils";

const db = DatabaseConnection.getConnection();

export interface AccountData {
	id: string;
	idx: string;
	name: string;
	phone: string;
	type: string;
	deleted: number;
	syncStatus: number;    
}

export interface RequiredAccountData {
	id?: string;
	name: string;
	phone: string;
	type: string;
}
  
export interface AccountDataResponse extends ResponseData {
	accounts: AccountData[] | [];
}

export interface FieldError {
	hasError: boolean;
	message: string;
}

export interface AccountFieldError {
	name: FieldError;
	phone: FieldError;
	type: FieldError;
}

export interface SaveAccountResponse extends ResponseData {
	fieldsError: AccountFieldError;
}

export default class AccountManager {
	// puxa todas as contas do banco de dados
	static async getAccounts():Promise<AccountDataResponse> {
		let accounts = [];
		return new Promise(async (resolve) =>
			db.transaction(
				(tx) => {
					const accountQuery =   
					"SELECT " +
					"	        ACCOUNT_ID, " +
					"	        ACCOUNT_IDX, " +
					"	        ACCOUNT_NAME, " +
					"	        ACCOUNT_PHONE, " +
					"	        ACCOUNT_TYPE, " +
					"	        DELETED, " +
					"	        account_type.ACCOUNT_TYPE_NAME, " +
					"	        SYNC_STATUS " +
					"FROM       account " +
					"LEFT JOIN  account_type on account_type.ACCOUNT_TYPE_IDX = account.ACCOUNT_TYPE " +
					"ORDER BY   ACCOUNT_NAME ";
					tx.executeSql(
						accountQuery,
						[],
						(txObj, { rows }) => {
							if (rows.length > 0) {
								for (let i = 0; i < rows.length; i++) {
									const account = {
										id:         rows.item(i).ACCOUNT_ID,
										idx:        rows.item(i).ACCOUNT_IDX,
										name:       rows.item(i).ACCOUNT_NAME,
										phone:      rows.item(i).ACCOUNT_PHONE,
										type:       rows.item(i).ACCOUNT_TYPE,
										deleted:    rows.item(i).DELETED,
										syncStatus: rows.item(i).SYNC_STATUS,
									}
									accounts.push(account);
								}
							}
						},
					);
				},
				(error) => resolve({success: false, error, accounts}), 
				() => resolve({success: true, error: null, accounts})
			)
		);
	}

	// método para salvar/atualizar uma conta no banco de dados
	static async saveAccount(account: RequiredAccountData):Promise<SaveAccountResponse> {
		return new Promise(async (resolve) => {
				const { fieldsError, isValid } = this.verifyAccountFields(account);
				if (isValid) {

					let accountBaseDMLInsert = 'INSERT INTO account (ACCOUNT_NAME, ACCOUNT_PHONE, ACCOUNT_TYPE, SYNC_STATUS) VALUES ';
					let accountBaseDMLUpdate = 'UPDATE account SET ';
					let accountQuery = ``;

					if (account.id) {
						accountQuery = `
							${accountBaseDMLUpdate}
							ACCOUNT_NAME = '${account.name}',
							ACCOUNT_PHONE = '${account.phone}',
							ACCOUNT_TYPE = '${account.type}',
							SYNC_STATUS = '0'
							WHERE ACCOUNT_ID = '${account.id}'
						`;
					} else {
						accountQuery = `
						${accountBaseDMLInsert}
							(
								'${stringEscape(account.name)}',
								'${stringEscape(account.phone)}',
								'${stringEscape(account.type)}',
								'${stringEscape(0)}'
							)
						`;
					}

					accountQuery = accountQuery.replace(/(\r\n|\n|\r)/gm, "");

					db.transaction(
						(tx) => {
							tx.executeSql(
								accountQuery,
								[],
							);
						},
						(error) => resolve({success: false, error, fieldsError}), 
						() => resolve({success: true, error: null, fieldsError})
					)
				} else {
					resolve(
						{
							success: false, 
							error: null, 
							fieldsError
						}
					);
				}
			}
		);
	}

	// realiza uma verficação dos dados da conta
	static verifyAccountFields(account: RequiredAccountData):any {
		let fieldsError = {};
		let isValid = true;
		let requiredFields = ["name", "phone", "type"];
		
		requiredFields.forEach((field) => {
			const error = {
				hasError: false,
				message: ""
			}

			if (!account[field]) {
				error.hasError = true;
				error.message = "Campo obrigatório"
				
				isValid = false;
			}

			fieldsError[field] = error;
		});

		return {
			fieldsError,
			isValid
		}
	}	
}