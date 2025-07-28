import { TypeAddress } from "./Components";

export type TypeSupplier = {
  id: string;

  status: boolean;
  name: string;

  document1?: string;
  document2?: string;

  description: string;

  companyName: string;
  companyDocument?: string;

  companyMobile: string;
  companyPhone?: string;
  companyEmail?: string;

  addresses: TypeAddress[];

  workspaceId: string;
  userId: string;

  createdAt: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
};
