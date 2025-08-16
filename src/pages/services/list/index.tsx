// pages
import ServicesList from "./ServicesList";
import ServicesInspect from "./ServicesInspect";

export default [
  {
    index: true,
    Component: ServicesList,
  },
  {
    path: "inspect",
    Component: ServicesInspect,
  },
  {
    path: "inspect/:id",
    Component: ServicesInspect,
  },
];
