import axios from "axios";

// types
import { ApiAddressProps, ApiAddressResult } from "../../types/Api";

const CompanyData = function (
  address: ApiAddressProps,
  polygon = 1,
  format = "jsonv2",
) {
  const query = `${address.street},${address.number},${address.city}`;
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&polygon_geojson=${polygon}&format=${format}`;
  return axios.get<ApiAddressResult>(url);
};

export default CompanyData;
