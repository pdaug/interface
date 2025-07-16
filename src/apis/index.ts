import axios, { AxiosRequestConfig } from "axios";

// types
import { ApiResponse } from "../types/Api";

// apis
import Login from "./Login";
import Upload from "./Upload";
import Session from "./Session";
import Settings from "./Settings";
import Instance from "./Instance";
import PostalCode from "./PostalCode";

export const ApiBase = axios.create({
  baseURL: "https://api.forzasistemas.com",
  timeout: 10000,
});

export const ApiCrud = function (path: string) {
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
        pageSize?: number;
        pageCurrent?: number;
        search?: string;
        searchField?: string;
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
  };
};

export default {
  Instance,
  Login,
  Session,
  Settings,
  User: ApiCrud("user"),
  Workspace: ApiCrud("workspace"),
  Account: ApiCrud("account"),
  Product: ApiCrud("product"),
  PostalCode,
  Upload,
};
