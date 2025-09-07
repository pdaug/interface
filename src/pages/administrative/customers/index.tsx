// pages
import CustomersList from "./CustomersList.tsx";
import CustomersInspect from "./CustomersInspect.tsx";
import CustomersSales from "./CustomersSales.tsx";
import CustomersOrders from "./CustomersOrders.tsx";

export default [
  {
    index: true,
    Component: CustomersList,
  },
  {
    path: "inspect",
    Component: CustomersInspect,
  },
  {
    path: "inspect/:id",
    Component: CustomersInspect,
  },
  {
    path: "sales/:id",
    Component: CustomersSales,
  },
  {
    path: "orders/:id",
    Component: CustomersOrders,
  },
];
