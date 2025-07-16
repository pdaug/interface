// pages
import orders from "./orders";
import Dashboard from "./dashboard/Dashboard";

export default [
  {
    path: "dashboard",
    Component: Dashboard,
  },
  {
    path: "orders",
    children: orders,
  },
];
