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

export type TypeVehicleRefuelFuel =
  | "gasoline"
  | "gasoline_additive"
  | "gasoline_premium"
  | "gasoline_octane"
  | "ethanol"
  | "ethanol_additive"
  | "diesel"
  | "diesel_s10"
  | "diesel_s500"
  | "gas"
  | "kerosene"
  | "arla"
  | "bioethanol"
  | "biodiesel"
  | "others";

export type TypeVehicleRefuelUnitType =
  | "liter"
  | "gallon"
  | "kg"
  | "barrel"
  | "m3";

export type TypeVehicleRefuel = {
  id?: string;
  fuel: TypeVehicleRefuelFuel;
  gasBrand: string;
  gasStation: string;
  unitPrice: string;
  unitType: TypeVehicleRefuelUnitType;
  unitQuantity: number;
  total: string;
  vehicleId: string;
  userId: string;
  workspaceId: string;
  refuelAt: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
};
