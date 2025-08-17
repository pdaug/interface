// pages
import customers from "./customers";
import suppliers from "./suppliers";

export default [
  {
    path: "customers",
    children: customers,
  },
  {
    path: "suppliers",
    children: suppliers,
  },
];
