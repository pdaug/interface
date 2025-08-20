// pages
import SalesList from "./SalesList";
import SalesInspect from "./SalesInspect";

export default [
  {
    index: true,
    Component: SalesList,
  },
  {
    path: "inspect",
    Component: SalesInspect,
  },
  {
    path: "inspect/:id",
    Component: SalesInspect,
  },
];
