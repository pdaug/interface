// pages
import sales from "./sale/index";
import products from "./list/index";
import purchases from "./purchase/index";

export default [
  {
    path: "products",
    children: products,
  },
  {
    path: "sales",
    children: sales,
  },
  {
    path: "purchases",
    children: purchases,
  },
];
