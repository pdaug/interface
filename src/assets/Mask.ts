import { TypeVehiclePlateType } from "../types/Vehicle";

export const MaskDocument1 = ["999.999.999-99", "99.999.999/9999-99"];

export const MaskDocument2 = ["99.999.999-9", "99.999.999-A"];

export const MaskPhone = [
  "+9 (999) 999-999",
  "+9 (999) 9999-999",
  "+99 (99) 9999-9999",
  "+99 (99) 99999-9999",
];

export const MaskPlateOld = "AAA-9999";
export const MaskPlateNew = "AAA9A99";
export const MaskPlate: Record<TypeVehiclePlateType, string> = {
  brazil: MaskPlateOld,
  mercosul: MaskPlateNew,
};

export const MaskPostalCode = "99999-999";
