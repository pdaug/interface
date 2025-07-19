// pages
import products from "./products";
import services from "./services";

export default [
  {
    path: "products",
    children: products,
  },
  {
    path: "services",
    children: services,
  },
];
