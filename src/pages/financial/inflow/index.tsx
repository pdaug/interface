// pages
import InflowsList from "./InflowsList";
import InflowsInspect from "./InflowsInspect";

export default [
  {
    index: true,
    Component: InflowsList,
  },
  {
    path: "inspect",
    Component: InflowsInspect,
  },
  {
    path: "inspect/:id",
    Component: InflowsInspect,
  },
];
