import axios from "axios";

// types
import { ApiCompanyDate } from "../../types/Api";

const CompanyData = function (document: string) {
  const url = `https://brasilapi.com.br/api/cnpj/v1/${document}`;
  return axios.get<ApiCompanyDate>(url);
};

export default CompanyData;
