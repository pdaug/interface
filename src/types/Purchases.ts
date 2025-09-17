export type TypePurchaseStage =
  | "draft"
  | "pending"
  | "negotiation"
  | "paid"
  | "processing"
  | "shipped"
  | "completed"
  | "canceled"
  | "failed"
  | "refunded"
  | "returned";

export type TypePurchaseItem = {
  itemId: string;
  itemName: string;
  variantId: string;
  variantName: string;
  quantity: number;
  price: string;
};

export type TypePurchaseDetailsType =
  | "tax"
  | "discount"
  | "promo"
  | "coupon"
  | "voucher"
  | "fee";

export type TypePurchaseDetailsMode = "percent" | "amount";

export type TypePurchaseDetails = {
  title: string;
  type: TypePurchaseDetailsType;
  mode: TypePurchaseDetailsMode;
  percent: number;
  amount: string;
};

export type TypePurchase = {
  id: string;
  purchaseId: string;
  stage: TypePurchaseStage;
  description: string;

  supplierId: string;
  supplierName: string;
  supplierMobile: string;
  supplierDocument?: string | null;

  items: TypePurchaseItem[];

  details: TypePurchaseDetails[];

  shippingCost?: string;
  shippingDescription?: string;

  workspaceId: string;
  userId: string;
  purchaserId: string;
  accountId: string;

  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
};
