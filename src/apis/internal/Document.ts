// apis
import { ApiBase, ApiBaseCrud } from "../Base";

// types
import { ApiResponse } from "../../types/Api";

const DocumentApi = ApiBaseCrud("document");

export default {
  ...DocumentApi,
  getPublic: function <T>(instance: string, id: string) {
    const headers = {
      "X-Instance": instance,
    };
    const config = { headers };
    return ApiBase.get<ApiResponse<T>>(`/document/public/${id}`, config);
  },
};
