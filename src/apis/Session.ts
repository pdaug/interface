// apis
import { ApiBase } from ".";

// types
import { ApiResponse } from "../types/Api";

const Session = {
  new: function <T>(
    instance: string,
    Authorization: string,
    data: { userId: string },
  ) {
    const headers = {
      Authorization,
      "X-Instance": instance,
    };
    const config = { headers };
    return ApiBase.post<ApiResponse<T>>("/session", data, config);
  },
  user: function <T>(
    instance: string,
    Authorization: string,
    data: { userId: string },
  ) {
    const headers = {
      Authorization,
      "X-Instance": instance,
    };
    const config = { headers };
    return ApiBase.get<ApiResponse<T>>(`/session/user/${data.userId}`, config);
  },
  check: function <T>(
    instance: string,
    Authorization: string,
    data: { token: string },
  ) {
    const headers = {
      Authorization,
      "X-Instance": instance,
    };
    const config = { headers };
    return ApiBase.get<ApiResponse<T>>(`/session/check/${data.token}`, config);
  },
};

export default Session;
