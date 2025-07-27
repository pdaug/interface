import { TypeAddress } from "./Components";

export type TypeCustomer = {
  id: string;
  status: boolean;

  photo?: string | null;
  name: string;
  description: string;

  phone1?: string;
  phone2?: string;
  mobile: string;
  email?: string;
  document1?: string;
  document2?: string;
  addresses: TypeAddress[];

  workspaceId: string;
  userId: string;

  createdAt: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
};
