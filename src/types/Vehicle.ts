export type TypeVehicleCategory =
  | "passenger"
  | "motocycle"
  | "pickup"
  | "truck"
  | "commercial"
  | "cargo_light"
  | "cargo_heavy"
  | "transport"
  | "cargo"
  | "vintage"
  | "competition"
  | "polylift_single"
  | "polylift_double"
  | "hydro_vacuum"
  | "rollon_rolloff"
  | "bus"
  | "tractor"
  | "trailer"
  | "tricycle"
  | "quadricycle"
  | "buggy"
  | "utility"
  | "special"
  | "others";

export type TypeVehiclePlateType = "brazil" | "mercosul";

export type TypeVehicle = {
  id: string;

  status: boolean;
  name: string;
  description: string;

  category: TypeVehicleCategory;

  document: string;
  plate: string;
  plateType: TypeVehiclePlateType;
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
