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

export type ApiAddressProps = {
  street: string;
  number: string;
  city: string;
};

export type ApiAddressResult = {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: string;
  category: string;
  type: string;
  addresstype: string;
  name: string;
  display_name: string;
  lat: string | number;
  lon: string | number;
}[];

export type ApiShipping = {
  id: number;
  name: string;
  company: {
    id: number;
    name: string;
    picture?: string;
  };

  // error
  error?: string;

  // success
  price?: string;
  custom_price?: string;
  currency?: string;
  delivery_time?: number;
  delivery_range?: {
    min: number;
    max: number;
  };
}[];

export type ApiExchangeContent = {
  code: string;
  codein: string;
  name: string;
  high: string;
  low: string;
  varBid: string;

  // percentage change
  pctChange: string;

  // value of purchase
  bid: string;

  // value of sale
  ask: string;

  timestamp: string;
  create_date: string;
};

export type ApiExchange = {
  [currency: string]: ApiExchangeContent;
};

export type ApiBitcoinContent = {
  "15m": number;
  last: number;
  buy: number;
  sell: number;
  symbol: string;
};

export type ApiBitcoin = {
  [currency: string]: ApiBitcoinContent;
};

export type ApiIbovespa = {
  currencyType: number;
  currency: string;
  symbol: number;
  prices: {
    price: number;
    date: string;
  }[];
}[];

export type ApiIndexes = {
  nome: string;
  valor: number;
}[];

export type ApiPreferenceData =
  | string
  | number
  | boolean
  | Record<string, boolean>;

export type ApiPreference = {
  [key: string]: string | number | boolean | Record<string, boolean>;
};
