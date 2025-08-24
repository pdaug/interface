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
  type: TypeSaleDetailsType;
  mode: TypeSaleDetailsMode;
  percent: number;
  amount: string;
  description: string;
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
  customerId: string;
  customerName: string;
  customerMobile: string;
  customerDocument?: string | null;
  products: TypeSaleProduct[];
  details: TypeSaleDetails[];
  shippingMethod: TypeSaleShippingMethod;
  shippingAddress: string;
  shippingCost: string;
  userId: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
};
