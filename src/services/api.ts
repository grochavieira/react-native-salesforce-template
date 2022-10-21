import axios from "axios";
import env from "../env";

// define a URL base do aplicativo para realizar
// chamadas posteriores a API do salesforce
export const api = axios.create({
  baseURL: env.connection.SALESFORCE_BASE_URL,
});
