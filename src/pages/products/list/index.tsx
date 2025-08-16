// pages
import ProductsList from "./ProductsList";
import ProductsInspect from "./ProductsInspect";

export default [
  {
    index: true,
    Component: ProductsList,
  },
  {
    path: "inspect",
    Component: ProductsInspect,
  },
  {
    path: "inspect/:id",
    Component: ProductsInspect,
  },
];
