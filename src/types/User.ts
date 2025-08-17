export type TypeUserRole = "master" | "admin" | "collaborator";

export type TypeUser = {
  id: string;
  status: boolean;
  photo?: string | null;
  name: string;
  document1: string;
  document2: string;
  password?: string;
  phone: string;
  mobile: string;
  email: string;
  role: TypeUserRole;
  addressStreet: string;
  addressNumber: string;
  addressComplement: string;
  addressPostalCode: string;
  addressNeighborhood: string;
  addressCity: string;
  addressState: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
};

export type TypeUserAudit = {
  userId: string;
  action: string;
  module: string;
  snapshot?: unknown;
  workspaceId?: string;
  createdAt: string;
};
