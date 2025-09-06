import { TypeAddress } from "./Components";

export type TypeCustomer = {
  id: string;
  status: boolean;
  photo?: string | null;

  // company
  name: string;
  document1?: string;
  mobile: string;
  phone1?: string;
  email?: string;
  description: string;

  // personal
  representativeName?: string;
  representativeRole?: string;
  phone2?: string;
  document2?: string;

  // others
  registrationMunicipal?: string;
  registrationState?: string;
  taxpayer?: string;
  taxregime?: string;

  addresses: TypeAddress[];

  workspaceId: string;
  userId: string;

  createdAt: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
};
