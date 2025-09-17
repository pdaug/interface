// pages
import PurchasesList from "./PurchasesList";
import PurchasesInspect from "./PurchasesInspect";

export default [
  {
    index: true,
    Component: PurchasesList,
  },
  {
    path: "inspect",
    Component: PurchasesInspect,
  },
  {
    path: "inspect/:id",
    Component: PurchasesInspect,
  },
];
