// apis
import { ApiBase } from "../Base";

// types
import { ApiResponse } from "../../types/Api";

const path = "dashboard";

const Password = {
  ChartSalesPurchases: function <T>(
    instance: string,
    Authorization: string,
    workspaceId: string,
    params: { dateStart: string; dateEnd: string },
  ) {
    const headers = {
      Authorization,
      "X-Workspace": workspaceId,
      "X-Instance": instance,
    };
    const config = { headers, params };
    return ApiBase.get<ApiResponse<T>>(`${path}/chart/sales_purchases`, config);
  },
};

export default Password;
