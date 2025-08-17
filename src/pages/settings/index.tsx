// pages
import users from "./users";
import accounts from "./accounts";
import workspaces from "./workspaces";
import integrations from "./integrations";
import SettingsPanel from "./panel/SettingsPanel";

export default [
  {
    path: "settings",
    Component: SettingsPanel,
  },
  {
    path: "users",
    children: users,
  },
  {
    path: "accounts",
    children: accounts,
  },
  {
    path: "workspaces",
    children: workspaces,
  },
  {
    path: "integrations",
    children: integrations,
  },
];
