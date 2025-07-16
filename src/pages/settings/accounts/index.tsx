// pages
import AccountList from "./AccountList";
import AccountInspect from "./AccountInspect";

export default [
  {
    index: true,
    Component: AccountList,
  },
  {
    path: "inspect",
    Component: AccountInspect,
  },
  {
    path: "inspect/:id",
    Component: AccountInspect,
  },
];
