import { DatabaseConnection } from "../database/DatabaseConnection";
import { stringEscape } from "../utils";
const db = DatabaseConnection.getConnection();

export default class SyncController {

  // gera as queries de sincronização
  static generateSyncQuery(received) {
    var groupQuery = [];

    groupQuery = groupQuery.concat(this.syncBaseData(received));
    groupQuery = groupQuery.concat(this.syncSystemData(received));

    return groupQuery;
  }
 
  // cria a query para sincronizar os dados do sistema (usuário)
  static syncSystemData(received) {
    let groupQuery = [];
    let query =
      'UPDATE system SET ' +
      '   USER_IDX = \'' + received.userData.userId + '\' '           +
      ' , USER_NAME = \'' + received.userData.userName + '\' '        +
      ' , USER_EMAIL = \'' + received.userData.userLogin + '\' '      +
      ' , USER_PROFILE = \'' + received.userData.userProfile + '\' '  +
      ' , LAST_SYNC_BASE_DATA = ' + received.userData.lastSyncUser;

    if (received.syncData.accountSync && received.syncData.accountSync.lastSyncStamp) {
      query += ' , LAST_SYNC_ACCOUNT = ' + received.syncData.accountSync.lastSyncStamp;
      query += ' , LAST_SYNC_ACCOUNT_ID = \'' + received.syncData.accountSync.lastSyncId + '\'';
    }

    if (received.syncData.contactSync && received.syncData.contactSync.lastSyncStamp) {
      query += ' , LAST_SYNC_CONTACT = ' + received.syncData.contactSync.lastSyncStamp;
      query += ' , LAST_SYNC_CONTACT_ID = \'' + received.syncData.contactSync.lastSyncId + '\'';
    }

    query += ' WHERE SYSTEM_ID = 1';

    groupQuery.push(query);

    return groupQuery;
  }

  // gera a query para sincronizar os registros do salesforce
  static syncBaseData(received) {
    let groupQuery = [];
    let baseQuery = {
      'account': 'INSERT OR REPLACE INTO account (ACCOUNT_ID, ACCOUNT_IDX, ACCOUNT_NAME, ACCOUNT_PHONE, ACCOUNT_TYPE, SYNC_STATUS) VALUES',
      'contact': 'INSERT OR REPLACE INTO contact (CONTACT_ID, CONTACT_IDX, CONTACT_FIRST_NAME, CONTACT_LAST_NAME, CONTACT_EMAIL, ACCOUNT_IDX, SYNC_STATUS) VALUES',
      'account_type': 'INSERT OR REPLACE INTO account_type (ACCOUNT_TYPE_IDX, ACCOUNT_TYPE_NAME) VALUES',
    },
    queryBuffer = '',
    maxLength = 20000,
    currLength = 0,
    deletedArray = {
        'account': [],
        'contact': []
    };

    //ACCOUNT_ID, ACCOUNT_IDX, ACCOUNT_NAME, ACCOUNT_PHONE, ACCOUNT_TYPE
    if (received.accountRequest && received.accountRequest.id.length > 0) {
      currLength = received.accountRequest.id.length;
      queryBuffer = baseQuery['account'];
      var hasBuffer = false;
      for (var i = 0; i < currLength; i++) {
        if (received.accountRequest.deleted[i]) {
          deletedArray['account'].push(received.accountRequest.id[i]);
        } else {
          queryBuffer += (hasBuffer ? ',' : '') + '('                                                                 +
            ' (SELECT ACCOUNT_ID FROM account WHERE ACCOUNT_IDX = \'' + received.accountRequest.id[i] + '\' ), '    +
            '\'' + stringEscape(received.accountRequest.id[i])                                                  +
            '\',\'' + stringEscape(received.accountRequest.name[i])                                             +
            '\',\'' + stringEscape(received.accountRequest.phone[i])                                            +
            '\',\'' + stringEscape(received.accountRequest.type[i])                                             +
            '\',\'' + stringEscape(1)                                                                           +
            '\''                                                                                                    +
            ')';
          hasBuffer = true;
          if (queryBuffer.length > maxLength) {
            groupQuery.push(queryBuffer + ';');
            queryBuffer = baseQuery['account'];
            hasBuffer = false;
          }
        }
      }
      if (hasBuffer) groupQuery.push(queryBuffer);
      if (deletedArray['account'].length > 0) {
        groupQuery.push(
          'DELETE FROM account ' +
          ' WHERE ACCOUNT_IDX IN (\'' + deletedArray['account'].join('\',\'') + '\')'
        );
      }
    }

    //CONTACT_ID, CONTACT_IDX, CONTACT_FIRST_NAME, CONTACT_LAST_NAME, CONTACT_EMAIL, ACCOUNT_IDX
    if (received.contactRequest && received.contactRequest.id.length > 0) {
      currLength = received.contactRequest.id.length;
      queryBuffer = baseQuery['contact'];
      var hasBuffer = false;
      for (var i = 0; i < currLength; i++) {
        if (received.contactRequest.deleted[i]) {
          deletedArray['contact'].push(received.contactRequest.id[i]);
        } else {
          queryBuffer += (hasBuffer ? ',' : '') + '('                                                                 +
            ' (SELECT CONTACT_ID FROM contact WHERE CONTACT_IDX = \'' + received.contactRequest.id[i] + '\' ), '    +
            '\'' + stringEscape(received.contactRequest.id[i])                                                  +
            '\',\'' + stringEscape(received.contactRequest.firstName[i])                                        +
            '\',\'' + stringEscape(received.contactRequest.lastName[i])                                         +
            '\',\'' + stringEscape(received.contactRequest.email[i])                                            +
            '\',\'' + stringEscape(received.contactRequest.accountId[i])                                        +
            '\',\'' + stringEscape(1)                                                                           +
            '\''                                                                                                    +
            ')';
          hasBuffer = true;
          if (queryBuffer.length > maxLength) {
            groupQuery.push(queryBuffer + ';');
            queryBuffer = baseQuery['contact'];
            hasBuffer = false;
          }
        }
      }
      if (hasBuffer) groupQuery.push(queryBuffer);
      if (deletedArray['contact'].length > 0) {
        groupQuery.push(
          'DELETE FROM contact ' +
          ' WHERE contact_IDX IN (\'' + deletedArray['contact'].join('\',\'') + '\')'
        );
      }
    }

    
    if (received.accountTypeRequest && received.accountTypeRequest.length > 0) {
      groupQuery.push(' DELETE FROM account_type ');
      currLength = received.accountTypeRequest.length;
      queryBuffer = baseQuery['account_type'];
      var hasBuffer = false;
      for (var i = 0; i < currLength; i++) {
        queryBuffer += (hasBuffer ? ',' : '') + '('                                     +
          '\'' + stringEscape(received.accountTypeRequest[i].accountTypeId)       +
          '\',\'' + stringEscape(received.accountTypeRequest[i].accountTypeName)  +
          '\''                                                                        +
          ')';
        hasBuffer = true;
        if (queryBuffer.length > maxLength) {
          groupQuery.push(queryBuffer + ';');
          queryBuffer = baseQuery['account_type'];
          hasBuffer = false;
        }
      }
      if (hasBuffer) groupQuery.push(queryBuffer);
    } else groupQuery.push(' DELETE FROM account_type ');

    return groupQuery;
  }
}


