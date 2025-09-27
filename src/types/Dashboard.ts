// types
import { TypeInputInterval } from "./Components";

export type TypeStats = Record<string, number>;

export type DashboardHiddenProps = {
  hidden?: boolean;
};

export type DashboardIntervalProps = {
  interval: TypeInputInterval;
};
