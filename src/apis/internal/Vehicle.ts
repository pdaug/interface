import { AxiosRequestConfig } from "axios";

// types
import { ApiResponse } from "../../types/Api";

// apis
import { ApiBase, ApiBaseCrud } from "../Base";

const path = "vehicle";

const Vehicle = ApiBaseCrud(path);

export default {
  ...Vehicle,
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
