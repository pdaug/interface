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
  id: string;
  fuel: TypeVehicleRefuelFuel;
  gasBrand: string;
  gasStation: string;
  unitPrice: string;
  unitType: TypeVehicleRefuelUnitType;
  unitQuantity: number;
  total: string;
  vehicleId: string;
  vehicleName: string;
  vehicleBrand: string;
  userId: string;
  workspaceId: string;
  refuelAt: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
};

export type TypeVehicleMaintenanceType =
  | "preventive"
  | "corrective"
  | "predictive"
  | "detective"
  | "others";

export type TypeVehicleMaintenanceCategory =
  | "mechanic"
  | "auto_electrician"
  | "specialist"
  | "machinist"
  | "welder"
  | "body_repairman"
  | "panel_beater"
  | "automotive_painter"
  | "polisher"
  | "detailer"
  | "tire_repairman"
  | "assembler"
  | "automotive_installer"
  | "upholsterer"
  | "glazier"
  | "locksmith"
  | "others";

export type TypeVehicleMaintenanceInspection = {
  name: string;
  reason: string;
};

export type TypeVehicleMaintenanceRepair = {
  name: string;
  description: string;
  pricing: string;
};

export type TypeVehicleMaintenance = {
  id: string;
  name: string;
  local: string;

  type: TypeVehicleMaintenanceType;
  category: TypeVehicleMaintenanceCategory;

  maintenanceStart: string;
  maintenanceEstimatedEnd: string;
  maintenanceEnd?: string;

  pricingInstallment: number;
  pricingTotal: string;

  // relationships
  inspection: TypeVehicleMaintenanceInspection[];
  repair: TypeVehicleMaintenanceRepair[];

  // vehicle
  vehicleId: string;
  vehicleName: string;
  vehicleBrand: string;

  // relations
  userId: string;
  accountId: string;
  workspaceId: string;

  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
};
