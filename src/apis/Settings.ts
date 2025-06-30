// apis
import { apiBase } from ".";

// types
import { ApiResponse } from "../types/apis";

const Settings = {
  get: function <T>(instance: string, data: unknown) {
    const headers = { "X-Instance": instance };
    const config = { headers };
    return apiBase.post<ApiResponse<T>>("/settings", data, config);
  },
  set: function <T>(Authorization: string, instance: string, data: unknown) {
    const headers = {
      Authorization,
      "X-Instance": instance,
    };
    const config = { headers };
    return apiBase.post<ApiResponse<T>>("/settings", data, config);
  },
};

export default Settings;
