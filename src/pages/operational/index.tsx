// pages
import products from "./products";
import services from "./services";
import vehicles from "./vehicles";

export default [
  {
    path: "products",
    children: products,
  },
  {
    path: "services",
    children: services,
  },
  {
    path: "vehicles",
    children: vehicles,
  },
];
