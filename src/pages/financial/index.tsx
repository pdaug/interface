// pages
import dashboard from "./dashboard";
import orders from "./orders";

export default {
  path: "financial",
  children: [dashboard, orders],
};
