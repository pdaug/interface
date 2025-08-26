export type TypeSaleStage =
  | "draft"
  | "open"
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "completed"
  | "canceled"
  | "failed"
  | "refunded"
  | "returned"
  | "disputed";

export type TypeSaleProduct = {
  productId: string;
  productName: string;
  variantId: string;
  variantName: string;
  quantity: number;
  price: string;
};

// UPDATE
export type TypeSaleDetailsType =
  | "tax"
  | "discount"
  | "promo"
  | "coupon"
  | "voucher"
  | "fee"
  | "shipping";

export type TypeSaleDetailsMode = "percent" | "amount";

export type TypeSaleDetails = {
  title: string;
  type: TypeSaleDetailsType;
  mode: TypeSaleDetailsMode;
  percent: number;
  amount: string;
};

export type TypeSaleShippingMethod =
  | "standard"
  | "express"
  | "pickup_store"
  | "pickup_partner"
  | "freight"
  | "dropshipping"
  | "delivery";

export type TypeSale = {
  id: string;
  saleId: string;
  stage: TypeSaleStage;
  description: string;

  datePayment?: string;
  dateShipped?: string;
  dateCompleted?: string;
  dateFailed?: string;
  dateCanceled?: string;
  dateRefunded?: string;

  customerId: string;
  customerName: string;
  customerMobile: string;
  customerDocument?: string | null;

  products: TypeSaleProduct[];

  details: TypeSaleDetails[];

  shippingMethod?: TypeSaleShippingMethod;
  shippingCost?: string;
  shippingFromPostal?: string;
  shippingFromAddress?: string;
  shippingToPostal?: string;
  shippingToAddress?: string;

  userId: string;
  accountId: string;

  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
};
