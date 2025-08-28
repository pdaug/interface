// types
import { BadgeCategories } from "../components/badges/Badge";
import { TypeSaleStage } from "../types/Sale";

export const SaleStages = [
  "draft",
  "open",
  "proposal",
  "negotiation",
  "pending",
  "paid",
  "processing",
  "shipped",
  "won",
  "lost",
  "completed",
  "canceled",
  "failed",
  "refunded",
  "returned",
  "disputed",
];

export const SaleStagesCategory: Record<TypeSaleStage, BadgeCategories> = {
  draft: "Neutral",
  open: "Warning",
  pending: "Warning",
  proposal: "Warning",
  negotiation: "Warning",
  paid: "Info",
  processing: "Info",
  shipped: "Info",
  won: "Success",
  lost: "Danger",
  completed: "Success",
  canceled: "Neutral",
  failed: "Danger",
  refunded: "Danger",
  returned: "Danger",
  disputed: "Danger",
};

export const SaleDetailsType = [
  "tax",
  "discount",
  "promo",
  "fee",
  "shipping",
  "coupon",
  "voucher",
];

export const SaleDetailsMode = ["percent", "amount"];

export const SaleShippingMethod = [
  "standard",
  "express",
  "pickup_store",
  "pickup_partner",
  "freight",
  "dropshipping",
  "delivery",
];
