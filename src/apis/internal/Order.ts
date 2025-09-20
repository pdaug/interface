import { AxiosRequestConfig } from "axios";

// apis
import { ApiBase, ApiBaseCrud } from "../Base";

// types
import { ApiResponse } from "../../types/Api";

const path = "order";

const Order = ApiBaseCrud(path);

export default {
  ...Order,
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
