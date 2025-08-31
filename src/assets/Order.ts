// types
import { TypeOrderStage } from "../types/Order";
import { BadgeCategories } from "../components/badges/Badge";

export const OrderStages = [
  "draft",
  "open",
  "pending",
  "review",
  "progress",
  "completed",
  "canceled",
];

export const OrderStagesCategory: Record<TypeOrderStage, BadgeCategories> = {
  draft: "Neutral",
  open: "Info",
  pending: "Info",
  review: "Info",
  progress: "Info",
  completed: "Success",
  canceled: "Danger",
};

export const OrderDetailsType = [
  "tax",
  "discount",
  "promo",
  "fee",
  "coupon",
  "voucher",
];

export const OrderDetailsMode = ["percent", "amount"];
