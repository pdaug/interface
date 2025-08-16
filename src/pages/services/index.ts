// pages
import services from "./list/index";
import vehicles from "./vehicles/index";
import orders from "./orders/index";

export default [
  {
    path: "services",
    children: services,
  },
  {
    path: "vehicles",
    children: vehicles,
  },
  {
    path: "orders",
    children: orders,
  },
];
