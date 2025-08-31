// types
import { TypeAddress } from "./Components";

export type TypeOrderStage =
  | "draft"
  | "open"
  | "pending"
  | "review"
  | "progress"
  | "completed"
  | "canceled";

export type TypeOrderService = {
  serviceId: string;
  serviceName: string;
  quantity: number;
  price: string;
};

export type TypeOrderDetailsType =
  | "tax"
  | "discount"
  | "promo"
  | "coupon"
  | "voucher"
  | "fee";

export type TypeOrderDetailsMode = "percent" | "amount";

export type TypeOrderDetails = {
  title: string;
  type: TypeOrderDetailsType;
  mode: TypeOrderDetailsMode;
  percent: number;
  amount: string;
};

export type TypeOrder = {
  id: string;
  orderId: string;
  stage: TypeOrderStage;
  description: string;

  dateStart?: string;
  dateEnd?: string;

  customerId: string;
  customerName: string;
  customerMobile: string;
  customerDocument?: string | null;

  services: TypeOrderService[];

  details: TypeOrderDetails[];

  documentProposal?: string;
  documentContract?: string;

  addresses: (TypeAddress & { description?: string })[];

  userId: string;
  sellerId: string;
  accountId: string;

  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
};
