import axios from "axios";

// types
import { ApiShipping } from "../../types/Api";

export type ShippingOptions = {
  width?: number;
  height?: number;
  length?: number;
  insurance_value?: number;
};

const Shipping = function (
  from: string,
  to: string,
  {
    width = 10,
    height = 10,
    length = 10,
    insurance_value = 0,
  }: ShippingOptions,
) {
  const url = `https://www.melhorenvio.com.br/api/v2/calculator`;
  return axios.get<ApiShipping>(url, {
    params: {
      from,
      to,
      width,
      height,
      length,
      insurance_value,
    },
  });
};

export default Shipping;
