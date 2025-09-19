import { AxiosRequestConfig } from "axios";

// apis
import { ApiBase, ApiBaseCrud } from "../Base";

// types
import { ApiResponse } from "../../types/Api";

const path = "sale";

const Sale = ApiBaseCrud("sale");

export default {
  ...Sale,
  stats: function <T>(
    Authorization: string,
    instance: string,
    params: { dateStart: string; dateEnd: string },
    workspaceId?: string,
  ) {
    const headers = {
      Authorization,
      "X-Instance": instance,
      "X-Workspace": workspaceId,
    };
    const config: AxiosRequestConfig = { headers, params };
    return ApiBase.get<ApiResponse<T>>(`/${path}/stats`, config);
  },
};
