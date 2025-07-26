export type TypeServiceType = "physical" | "digital";

export type TypeServiceMethod =
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "one_time"
  | "per_delivery";

export type TypeService = {
  id: string;

  status: boolean;
  name: string;
  description: string;
  type: TypeServiceType;

  pricingValue: string;
  pricingMethod: TypeServiceMethod;

  tags: string[];

  userId: string;
  workspaceId: string;

  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
};
