import axios from "axios";

// types
import { ApiExchange } from "../../types/Api";

const Exchange = function (currency: string) {
  const url = `https://economia.awesomeapi.com.br/json/last/${currency}`;
  return axios.get<ApiExchange>(url);
};

export default Exchange;
