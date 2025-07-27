// apis
import { ApiBase } from "../Base";

// types
import { ApiResponse, ApiWhatsAppContact } from "../../types/Api";

const WhatsApp = {
  connect: function () {
    return ApiBase.get("/whatsapp/connect");
  },
  disconnect: function () {
    return ApiBase.get<ApiResponse<string>>("/whatsapp/disconnect");
  },
  status: function () {
    return ApiBase.get<ApiResponse<Record<string, unknown>>>(
      "/whatsapp/status",
    );
  },
  check: function (data: { number: string }) {
    return ApiBase.post<ApiResponse<Record<string, unknown>>>(
      "/whatsapp/check",
      data,
    );
  },
  contact: function (data: { number: string }) {
    return ApiBase.post<ApiResponse<ApiWhatsAppContact>>(
      "/whatsapp/contact",
      data,
    );
  },
  message: function (data: { number: string; message: string }) {
    return ApiBase.post<ApiResponse<Record<string, unknown>>>(
      "/whatsapp/message",
      data,
    );
  },
};

export default WhatsApp;
