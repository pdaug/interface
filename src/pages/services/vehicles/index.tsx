// pages
import VehiclesList from "./VehiclesList";
import VehiclesInspect from "./VehiclesInspect";

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
];
