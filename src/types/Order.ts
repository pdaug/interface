import { TypeAddress } from "./Components";

export type TypeOrder = {
  id: string;
  status: boolean;
  description: string;
  dateStart: string;
  dateEnd?: string | null;
  products?: {
    productId: string;
    variantId: string;
    quantity: number;
  }[];
  services?: {
    serviceId: string;
    quantity: number;
  }[];
  customerId?: string;
  supplierId?: string;
  addresses: TypeAddress & { description: string }[];
  createdAt: string;
  updatedAt: string | null;
};
