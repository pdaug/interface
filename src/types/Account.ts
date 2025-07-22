export type TypeAccount = {
  id: string;
  status: boolean;
  name: string;

  isCoorporate?: boolean;

  holder: string;
  holderDocument1: string;
  holderDocument2?: string;

  bankCode: string;
  bankName: string;
  bankAgency: string;
  bankAccount: string;

  userId: string;

  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
};
