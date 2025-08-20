import axios, { AxiosRequestConfig } from "axios";

// types
import { ApiResponse } from "../types/Api";

export const ApiBase = axios.create({
  baseURL: "https://api.forzasistemas.com/",
  timeout: 30000,
});

export const ApiBaseCrud = function (path: string) {
  return {
    create: function <T>(
      Authorization: string,
      instance: string,
      data: unknown,
      workspaceId?: string,
    ) {
      const headers = {
        Authorization,
        "X-Instance": instance,
        "X-Workspace": workspaceId,
      };
      const config = { headers };
      return ApiBase.post<ApiResponse<T>>(`/${path}`, data, config);
    },
    list: function <T>(
      Authorization: string,
      instance: string,
      params?: {
        orderField?: string;
        orderSort?: string;
        pageSize?: number;
        pageCurrent?: number;
        search?: string;
        searchField?: string;
        dateStart?: string;
        dateEnd?: string;
        showDeleted?: "true" | "false";
      },
      workspaceId?: string,
    ) {
      const headers = {
        Authorization,
        "X-Instance": instance,
        "X-Workspace": workspaceId,
      };
      const config: AxiosRequestConfig = { headers, params };
      return ApiBase.get<ApiResponse<T>>(`/${path}`, config);
    },
    get: function <T>(
      Authorization: string,
      instance: string,
      id: string,
      workspaceId?: string,
    ) {
      const headers = {
        Authorization,
        "X-Instance": instance,
        "X-Workspace": workspaceId,
      };
      const config = { headers };
      return ApiBase.get<ApiResponse<T>>(`/${path}/${id}`, config);
    },
    update: function <T>(
      Authorization: string,
      instance: string,
      id: string,
      data: unknown,
      workspaceId?: string,
    ) {
      const headers = {
        Authorization,
        "X-Instance": instance,
        "X-Workspace": workspaceId,
      };
      const config = { headers };
      return ApiBase.put<ApiResponse<T>>(`/${path}/${id}`, data, config);
    },
    delete: function <T>(
      Authorization: string,
      instance: string,
      id: string,
      workspaceId?: string,
    ) {
      const headers = {
        Authorization,
        "X-Instance": instance,
        "X-Workspace": workspaceId,
      };
      const config = { headers };
      return ApiBase.delete<ApiResponse<T>>(`/${path}/${id}`, config);
    },
    deletePermanently: function <T>(
      Authorization: string,
      instance: string,
      id: string,
      workspaceId?: string,
    ) {
      const headers = {
        Authorization,
        "X-Instance": instance,
        "X-Workspace": workspaceId,
      };
      const params = {
        hard: "true",
      };
      const config = { headers, params };
      return ApiBase.delete<ApiResponse<T>>(`/${path}/${id}`, config);
    },
  };
};
