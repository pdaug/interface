// pages
import customers from "./customers";
import employees from "./employees";

export default [
  {
    path: "employees",
    children: employees,
  },
  {
    path: "customers",
    children: customers,
  },
];
