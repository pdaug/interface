// pages
import OrdersList from "./OrdersList";
import OrdersInspect from "./OrdersInspect";

export default [
  {
    index: true,
    Component: OrdersList,
  },
  {
    path: "inspect",
    Component: OrdersInspect,
  },
  {
    path: "inspect/:id",
    Component: OrdersInspect,
  },
];
