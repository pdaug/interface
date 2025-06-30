// apis
import { apiBase } from ".";

// types
import { ApiResponse } from "../types/apis";

const User = {
  create: function <T>(Authorization: string, instance: string, data: unknown) {
    const headers = {
      Authorization,
      "X-Instance": instance,
    };
    const config = { headers };
    return apiBase.post<ApiResponse<T>>("/user", data, config);
  },
  list: function <T>(Authorization: string, instance: string) {
    const headers = {
      Authorization,
      "X-Instance": instance,
    };
    const config = { headers };
    return apiBase.get<ApiResponse<T>>("/user", config);
  },
  get: function <T>(Authorization: string, instance: string, id: string) {
    const headers = {
      Authorization,
      "X-Instance": instance,
    };
    const config = { headers };
    return apiBase.get<ApiResponse<T>>(`/user/${id}`, config);
  },
  update: function <T>(
    Authorization: string,
    instance: string,
    id: string,
    data: unknown,
  ) {
    const headers = {
      Authorization,
      "X-Instance": instance,
    };
    const config = { headers };
    return apiBase.put<ApiResponse<T>>(`/user/${id}`, data, config);
  },
  delete: function <T>(Authorization: string, instance: string, id: string) {
    const headers = {
      Authorization,
      "X-Instance": instance,
    };
    const config = { headers };
    return apiBase.delete<ApiResponse<T>>(`/user/${id}`, config);
  },
};

export default User;
