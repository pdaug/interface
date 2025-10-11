import { TypeSettings } from "./Settings";

export type TypeInstancePlan = "essential" | "advanced" | "professional";

export type TypeInstance = TypeSettings & {
  id: string;
  name: string;
  status: boolean;
  agreement: boolean;
  agreementDate: string | null;
  paymentDay: number;
  paymentValue: number;
  paymentPlan: TypeInstancePlan;
  responsibleName: string;
  responsibleDocument1: string;
  responsibleDocument2: string;
  responsiblePhone: string;
  responsibleMobile: string;
  responsibleEmail: string;
  limitWorkspaces: number;
  limitUsers: number;
  createdAt: string;
  expiresAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
};
