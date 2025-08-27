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
  options?: ShippingOptions,
) {
  const url = `https://www.melhorenvio.com.br/api/v2/calculator`;
  return axios.get<ApiShipping>(url, {
    params: {
      from,
      to,
      width: options?.width || 10,
      height: options?.height || 10,
      length: options?.length || 10,
      insurance_value: options?.insurance_value || 0,
    },
  });
};

export default Shipping;
