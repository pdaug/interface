// apis
import { ApiBase } from "../Base";

// types
import { ApiResponse, ApiResponsePaginate } from "../../types/Api";

const Audit = {
  all: function <T>(
    Authorization: string,
    instance: string,
    workspaceId: string,
  ) {
    const headers = {
      Authorization,
      "X-Instance": instance,
      "X-Workspace": workspaceId,
    };
    const config = { headers };
    return ApiBase.get<ApiResponse<ApiResponsePaginate<T>>>("/audit", config);
  },
  get: function <T>(
    Authorization: string,
    instance: string,
    workspaceId: string,
    userId: string,
  ) {
    const headers = {
      Authorization,
      "X-Instance": instance,
      "X-Workspace": workspaceId,
    };
    const config = { headers };
    return ApiBase.get<ApiResponse<ApiResponsePaginate<T>>>(
      `/audit/${userId}`,
      config,
    );
  },
  insert: function <T>(
    Authorization: string,
    instance: string,
    workspaceId: string,
    data: { userId: string; action: string; module: string; snapshot: unknown },
  ) {
    const headers = {
      Authorization,
      "X-Instance": instance,
      "X-Workspace": workspaceId,
    };
    const config = { headers };
    return ApiBase.post<ApiResponse<T>>("/audit", data, config);
  },
  restore: function <T>(
    Authorization: string,
    instance: string,
    workspaceId: string,
    id: string,
  ) {
    const headers = {
      Authorization,
      "X-Instance": instance,
      "X-Workspace": workspaceId,
    };
    const config = { headers };
    return ApiBase.post<ApiResponse<T>>(`/audit/restore/${id}`, config);
  },
};

export default Audit;
