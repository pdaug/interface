// types
import { TypePurchaseStage } from "../types/Purchases";
import { BadgeCategories } from "../components/badges/Badge";

export const PurchaseStagesOptions: TypePurchaseStage[] = [
  "draft",
  "pending",
  "negotiation",
  "paid",
  "processing",
  "shipped",
  "completed",
  "canceled",
  "failed",
  "refunded",
  "returned",
];

export const PurchaseStagesCategory: Record<
  TypePurchaseStage,
  BadgeCategories
> = {
  draft: "Neutral",
  pending: "Warning",
  negotiation: "Warning",
  processing: "Warning",
  shipped: "Warning",
  paid: "Success",
  completed: "Success",
  canceled: "Danger",
  failed: "Danger",
  refunded: "Danger",
  returned: "Danger",
};

export const PurchaseDetailsType = [
  "tax",
  "discount",
  "promo",
  "fee",
  "coupon",
  "voucher",
];

export const PurchaseDetailsMode = ["percent", "amount"];
