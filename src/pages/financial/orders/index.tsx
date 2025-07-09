// pages
import OrdersEdit from "./OrdersEdit";
import OrdersList from "./OrdersList";

export default {
  path: "orders",
  children: [
    {
      index: true,
      Component: OrdersList,
    },
    {
      path: "inspect",
      Component: OrdersEdit,
    },
    {
      path: "inspect/:id",
      Component: OrdersEdit,
    },
  ],
};
