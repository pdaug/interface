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

export const SaleStagesGroupped = [
  { value: "draft", group: "funnel" },
  { value: "open", group: "funnel" },
  { value: "proposal", group: "funnel" },
  { value: "negotiation", group: "funnel" },
  { value: "pending", group: "funnel" },
  { value: "won", group: "funnel" },
  { value: "lost", group: "funnel" },

  { value: "processing", group: "closing" },
  { value: "paid", group: "closing" },
  { value: "shipped", group: "closing" },
  { value: "completed", group: "closing" },
  { value: "canceled", group: "closing" },
  { value: "failed", group: "closing" },
  { value: "refunded", group: "closing" },
  { value: "returned", group: "closing" },
  { value: "disputed", group: "closing" },
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
