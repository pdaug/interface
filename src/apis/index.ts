import axios from "axios";

// types
import { ApiResponse } from "../types/Apis";

// apis
import Instance from "./Instance";
import Login from "./Login";
import Session from "./Session";
import Settings from "./Settings";

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
    ) {
      const headers = {
        Authorization,
        "X-Instance": instance,
      };
      const config = { headers };
      return ApiBase.post<ApiResponse<T>>(`/${path}`, data, config);
    },
    list: function <T>(Authorization: string, instance: string) {
      const headers = {
        Authorization,
        "X-Instance": instance,
      };
      const config = { headers };
      return ApiBase.get<ApiResponse<T>>(`/${path}`, config);
    },
    get: function <T>(Authorization: string, instance: string, id: string) {
      const headers = {
        Authorization,
        "X-Instance": instance,
      };
      const config = { headers };
      return ApiBase.get<ApiResponse<T>>(`/${path}/${id}`, config);
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
      return ApiBase.put<ApiResponse<T>>(`/${path}/${id}`, data, config);
    },
    delete: function <T>(Authorization: string, instance: string, id: string) {
      const headers = {
        Authorization,
        "X-Instance": instance,
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
};
