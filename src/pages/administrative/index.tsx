// pages
import customers from "./customers";
import employees from "./employees";
import suppliers from "./suppliers";

export default [
  {
    path: "employees",
    children: employees,
  },
  {
    path: "customers",
    children: customers,
  },
  {
    path: "suppliers",
    children: suppliers,
  },
];
