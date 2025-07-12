export type ApiResponseResult =
  | null
  | string
  | Record<string, unknown>
  | Record<string, unknown>[];

export type ApiResponse<T> = {
  state: "success" | "error";
  server: string;
  version: number;
  path: string;
  method: string;
  timestamp: number;
  result: T;
};

export type ApiResponsePaginate<T> = {
  items: T[];
  pagination: {
    total: number;
    pageSize: number;
    pageCurrent: number;
    pageTotal: number;
  };
};

export type ApiPostalCode = {
  state: string;
  city: string;
  neighborhood: string;
  street: string;
};
