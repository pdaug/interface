import { BadgeCategories } from "../components/badges/Badge";
import { TypePurchaseStage } from "../types/Purchases";

const PurchaseStagesOptions: TypePurchaseStage[] = [
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

const PurchaseStagesCategory: Record<TypePurchaseStage, BadgeCategories> = {
  draft: "Neutral",
  pending: "Warning",
  negotiation: "Warning",
  paid: "Success",
  processing: "Warning",
  shipped: "Warning",
  completed: "Success",
  canceled: "Danger",
  failed: "Danger",
  refunded: "Danger",
  returned: "Danger",
};

export { PurchaseStagesOptions, PurchaseStagesCategory };
