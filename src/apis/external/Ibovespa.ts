import axios from "axios";

// types
import { ApiIbovespa } from "../../types/Api";

const Ibovespa = function () {
  const url = `https://statusinvest.com.br/indice/tickerprice?ticker=ibovespa&type=-1`;
  return axios.get<ApiIbovespa>(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Referer: "https://google.com",
      Accept: "application/json, text/plain, */*",
    },
    maxRedirects: 5,
    withCredentials: true,
  });
};

export default Ibovespa;
