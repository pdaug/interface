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

export type ApiCompanyDate = {
  razao_social: string;
  nome_fantasia: string;
  ddd_telefone_1: string;
  ddd_telefone_2: string;
  email: string | null;

  logradouro: string | null; // street
  numero: string | null; // number
  complemento: string | null; // complement
  bairro: string | null; // neighborhood
  cep: string | null; // postalCode
  municipio: string | null; // city
  uf: string | null; // state
};

export type ApiWhatsAppContact = {
  name: string | null;
  photoUrl: string | null;
  description: string | null;
};
