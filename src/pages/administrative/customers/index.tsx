// pages
import CustomersList from "./CustomersList.tsx";
import CustomersInspect from "./CustomersInspect.tsx";

// TODO: display sales
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
];
