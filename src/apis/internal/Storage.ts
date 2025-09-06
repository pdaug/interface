// apis
import { ApiBase } from "../Base";

// types
import { ApiResponse } from "../../types/Api";

const Storage = {
  file: function <T>(
    instance: string,
    Authorization: string,
    data: { file: File; name: string },
  ) {
    const formData = new FormData();
    formData.append("file", data.file);
    formData.append("name", data.name);
    const headers = {
      Authorization,
      "X-Instance": instance,
      "Content-Type": "multipart/form-data",
    };
    const config = { headers };
    return ApiBase.post<ApiResponse<T>>(
      "/storage/upload/file",
      formData,
      config,
    );
  },

  image: function <T>(
    instance: string,
    Authorization: string,
    data: {
      file: File;
      name: string;
      path?: string;
      height?: number;
      width?: number;
      quality?: number;
    },
  ) {
    const formData = new FormData();
    formData.append("file", data.file);
    formData.append("name", data.name);
    if (data.path) formData.append("path", String(data.path));
    if (data.height) formData.append("height", String(data.height));
    if (data.width) formData.append("width", String(data.width));
    if (data.quality) formData.append("quality", String(data.quality));
    const headers = {
      Authorization,
      "X-Instance": instance,
      "Content-Type": "multipart/form-data",
    };
    const config = { headers };
    return ApiBase.post<ApiResponse<T>>(
      "/storage/upload/image",
      formData,
      config,
    );
  },
};

export default Storage;
