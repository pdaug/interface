// apis
import { ApiBase } from "../Base";

// types
import { ApiResponse } from "../../types/Api";

const Password = {
  getRequest: function <T>(
    instance: string,
    Authorization: string,
    id: string,
  ) {
    const headers = {
      Authorization,
      "X-Instance": instance,
    };
    const config = { headers };
    return ApiBase.get<ApiResponse<T>>(`/password/request/${id}`, config);
  },
  setRequest: function <T>(
    instance: string,
    Authorization: string,
    id: string,
  ) {
    const headers = {
      Authorization,
      "X-Instance": instance,
    };
    const config = { headers };
    return ApiBase.post<ApiResponse<T>>(`/password/request/${id}`, {}, config);
  },
  change: function <T>(
    instance: string,
    Authorization: string,
    data: {
      userId: string;
      passwordOld: string;
      passwordNew: string;
    },
  ) {
    const headers = {
      Authorization,
      "X-Instance": instance,
    };
    const config = { headers };
    return ApiBase.post<ApiResponse<T>>(`/password/change`, data, config);
  },
};

export default Password;
