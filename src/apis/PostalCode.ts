import axios from "axios";

// types
import { ApiPostalCode } from "../types/Api";

const PostalCode = function (postalcode: string) {
  const url = `https://brasilapi.com.br/api/cep/v2/${postalcode}`;
  return axios.get<ApiPostalCode>(url);
};

export default PostalCode;
