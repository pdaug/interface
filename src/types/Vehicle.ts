export type TypeVehicleCategory =
  | "passenger"
  | "commercial"
  | "cargo_light"
  | "cargo"
  | "cargo_heavy"
  | "transport"
  | "vintage"
  | "competition"
  | "polylift_single"
  | "polylift_double"
  | "hydro_vacuum"
  | "rollon_rolloff";

export type TypeVehicle = {
  id: string;

  status: boolean;
  name: string;
  description: string;

  category: TypeVehicleCategory;

  document: string;
  plate: string;
  chassi: string;
  color: string;
  brand: string;
  model: string;
  year: number;

  workspaceId: string;
  userId: string;

  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
};
