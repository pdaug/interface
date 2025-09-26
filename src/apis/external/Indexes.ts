import axios from "axios";

// types
import { ApiIndexes } from "../../types/Api";

const Indexes = function () {
  const url = `https://brasilapi.com.br/api/taxas/v1`;
  return axios.get<ApiIndexes>(url);
};

export default Indexes;
