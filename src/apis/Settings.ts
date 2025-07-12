// apis
import { ApiBase } from ".";

// types
import { ApiResponse } from "../types/Api";

const Settings = {
  get: function <T>(instance: string) {
    const headers = { "X-Instance": instance };
    const config = { headers };
    return ApiBase.get<ApiResponse<T>>("/settings", config);
  },
  set: function <T>(Authorization: string, instance: string, data: unknown) {
    const headers = {
      Authorization,
      "X-Instance": instance,
    };
    const config = { headers };
    return ApiBase.post<ApiResponse<T>>("/settings", data, config);
  },
};

export default Settings;
