import axios from "axios";

// types
import { ApiBitcoin } from "../../types/Api";

const Bitcoin = function () {
  const url = `https://blockchain.info/ticker`;
  return axios.get<ApiBitcoin>(url);
};

export default Bitcoin;
