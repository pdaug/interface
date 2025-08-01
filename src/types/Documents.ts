import { Descendant } from "slate";

export type TypeDocumentCategory = "sms" | "message" | "document" | "email";

export type TypeDocument = {
  id: string;

  name: string;
  category: TypeDocumentCategory;
  content: Descendant[];
  preview?: string;
  isPublic?: boolean;

  userId: string;
  workspaceId: string;

  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
};
