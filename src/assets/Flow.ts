// types
import { TypeFlowStages } from "../types/Flow";

// components
import { BadgeCategories } from "../components/badges/Badge";

export const FlowStagesOptions = [
  "draft",
  "pending",
  "processing",
  "review",
  "scheduled",
  "paid",
  "reconciled",
  "overdued",
  "canceled",
  "expired",
  "failed",
  "refunded",
  "declined",
  "reversed",
  "returned",
  "disputed",
];

export const FlowEntitiesOptions = [
  "sales",
  "purchases",
  "orders",
  "vehicle_maitenances",
  "vehicle_refuels",
  "manual",
];

export const FlowPaymentMethodsOptions = [
  "credit_card",
  "debit_card",
  "bank_transfer",
  "e_wallet",
  "benefit_card",
  "gift_card",
  "ticket",
  "voucher",
  "qr_code",
  "cash",
  "cheque",
  "pix",
  "boleto",
  "transfer_ted",
  "transfer_doc",
];

export const FlowStagesCategory: Record<TypeFlowStages, BadgeCategories> = {
  draft: "Neutral",
  pending: "Warning",
  processing: "Info",
  review: "Info",
  scheduled: "Info",
  paid: "Success",
  overdued: "Warning",
  reconciled: "Danger",
  canceled: "Danger",
  expired: "Danger",
  failed: "Danger",
  refunded: "Danger",
  declined: "Danger",
  reversed: "Danger",
  returned: "Danger",
  disputed: "Danger",
};
