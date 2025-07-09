// pages
import SettingsPanel from "./SettingsPanel";

export default {
  path: "settings",
  children: [
    {
      index: true,
      Component: SettingsPanel,
    },
  ],
};
