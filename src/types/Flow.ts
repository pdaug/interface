export type TypeFlowType = "inflow" | "outflow";

export type TypeFlowStages =
  | "draft"
  | "pending"
  | "processing"
  | "review"
  | "scheduled"
  | "paid"
  | "reconciled"
  | "canceled"
  | "expired"
  | "failed"
  | "refunded"
  | "declined"
  | "reversed"
  | "returned"
  | "disputed";

export type TypeFlowEntities =
  | "sales"
  | "purchases"
  | "orders"
  | "vehicle_maitenances"
  | "vehicle_refuels"
  | "manual";

export type TypeFlowPaymentMethod =
  | "credit_card"
  | "debit_card"
  | "bank_transfer"
  | "e_wallet"
  | "benefit_card"
  | "gift_card"
  | "ticket"
  | "voucher"
  | "qr_code"
  | "cash"
  | "cheque"
  | "pix"
  | "boleto"
  | "transfer_ted"
  | "transfer_doc";

export type TypeFlow = {
  id: string;
  name: string;
  description: string;

  type: TypeFlowType;
  stage: TypeFlowStages;

  entityId?: string;
  entityName: TypeFlowEntities;

  paymentValue?: string; // e.g. 1000
  paymentTimes?: number; // e.g. 2 of 6
  paymentInstallments?: number; // 6 is total
  paymentMethod: TypeFlowPaymentMethod;
  paymentDate?: string | null; // e.g. 2025-01-01
  paymentExpires?: string | null; // e.g. 2025-01-02

  recurringId?: string | null;
  userId: string;
  accountId: string;
  workspaceId: string;

  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
};
