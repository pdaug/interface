// apis
import { ApiBase } from "../Base";

// types
import { ApiPreferenceData, ApiResponse } from "../../types/Api";

const Preference = {
  get: function <T>(instance: string, Authorization: string, id: string) {
    const headers = {
      Authorization,
      "X-Instance": instance,
    };
    const config = { headers };
    return ApiBase.get<ApiResponse<T>>(`/preference/${id}`, config);
  },
  set: function <T>(
    instance: string,
    Authorization: string,
    id: string,
    data: { hidden: ApiPreferenceData },
  ) {
    const headers = {
      Authorization,
      "X-Instance": instance,
    };
    const config = { headers };
    return ApiBase.post<ApiResponse<T>>(`/preference/${id}`, data, config);
  },
};

export default Preference;
