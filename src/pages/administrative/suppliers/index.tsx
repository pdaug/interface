// pages
import SuppliersList from "./SuppliersList.tsx";
import SuppliersInspect from "./SuppliersInspect.tsx";

export default [
  {
    index: true,
    Component: SuppliersList,
  },
  {
    path: "inspect",
    Component: SuppliersInspect,
  },
  {
    path: "inspect/:id",
    Component: SuppliersInspect,
  },
];
