// apis
import { apiBase } from ".";

// types
import { ApiResponse } from "../types/apis";

const Instance = {
  create: function <T>(Authorization: string, data: unknown) {
    const headers = { Authorization };
    const config = { headers };
    return apiBase.post<ApiResponse<T>>("/instance", data, config);
  },
  list: function <T>(Authorization: string) {
    const headers = { Authorization };
    const config = { headers };
    return apiBase.get<ApiResponse<T>>("/instance", config);
  },
  get: function <T>(Authorization: string, id: string) {
    const headers = { Authorization };
    const config = { headers };
    return apiBase.get<ApiResponse<T>>(`/instance/${id}`, config);
  },
  search: function <T>(name: string) {
    return apiBase.get<ApiResponse<T>>(`/instance/name/${name}`);
  },
  update: function <T>(Authorization: string, id: string, data: unknown) {
    const headers = { Authorization };
    const config = { headers };
    return apiBase.put<ApiResponse<T>>(`/instance/${id}`, data, config);
  },
  delete: function <T>(Authorization: string, id: string) {
    const headers = { Authorization };
    const config = { headers };
    return apiBase.delete<ApiResponse<T>>(`/instance/${id}`, config);
  },
};

export default Instance;
