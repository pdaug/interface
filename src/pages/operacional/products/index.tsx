// pages
import ProductsList from "./ProductsList";

export default {
  path: "products",
  children: [
    {
      index: true,
      Component: ProductsList,
    },
  ],
};
