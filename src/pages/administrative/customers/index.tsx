// pages
import CustomersList from "./CustomersList.tsx";
import CustomersInspect from "./CustomersInspect.tsx";
import CustomersSales from "./CustomersSales.tsx";

// TODO: display orders
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
];
