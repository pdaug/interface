// pages
import sales from "./sale/index";
import products from "./list/index";

export default [
  {
    path: "products",
    children: products,
  },
  {
    path: "sales",
    children: sales,
  },
];
