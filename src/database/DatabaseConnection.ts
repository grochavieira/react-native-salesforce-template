import * as SQLite from "expo-sqlite";

// inicializa uma conexão com o banco de dados
export const DatabaseConnection = {
  getConnection: () => SQLite.openDatabase("sfapp.db"),
};
