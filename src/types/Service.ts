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

  pricingValue: number;
  pricingMethod: TypeServiceMethod;

  tags: string[];

  workspaceId: string;

  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
};
