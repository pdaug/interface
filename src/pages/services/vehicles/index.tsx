// pages
import VehiclesList from "./VehiclesList";
import VehiclesInspect from "./VehiclesInspect";
import VehiclesRefuel from "./VehiclesRefuel";
import VehiclesMaintenance from "./VehiclesMaintenance";

export default [
  {
    index: true,
    Component: VehiclesList,
  },
  {
    path: "inspect",
    Component: VehiclesInspect,
  },
  {
    path: "inspect/:id",
    Component: VehiclesInspect,
  },
  {
    path: "refuel",
    Component: VehiclesRefuel,
  },
  {
    path: "maintenance",
    Component: VehiclesMaintenance,
  },
];
