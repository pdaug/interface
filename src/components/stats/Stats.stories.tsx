import type { StoryObj } from "@storybook/react";

import Stats, { StatsProps } from "./Stats";
import { Horizontal } from "../aligns/Align";

export default {
  title: "Components/Stats",
  component: Stats,
  tags: ["autodocs"],
};

export const Default: StoryObj<StatsProps> = {
  args: {
    title: "Title Stats",
    metric: 0.0125,
    metricStatus: "up",
    metricLocale: "en",
    metricOptions: { style: "percent", minimumFractionDigits: 2 },
    value: 42500,
    valueLocale: "en",
    valueOptions: { style: "currency", currency: "USD" },
  },
};

export const Down: StoryObj<StatsProps> = {
  args: {
    title: "Title Stats",
    metric: 0.0822,
    metricStatus: "down",
    metricLocale: "en",
    metricOptions: { style: "percent", minimumFractionDigits: 2 },
    value: 912,
    valueUnit: "cars",
    valueLocale: "en",
    valueOptions: { maximumFractionDigits: 0 },
  },
};

export const Grouped = () => (
  <Horizontal internal={1} styles={{ width: "30rem" }}>
    <Stats
      title="Inflow Ccash"
      metric={12.5}
      metricStatus="up"
      value={42500}
      valueUnit="$"
    />
    <Stats
      title="New customers"
      metric={3.2}
      metricStatus="up"
      value={51}
      valueUnit="Customers"
    />
    <Stats
      title="Convertion"
      metric={1.1}
      metricStatus="down"
      value={4}
      valueUnit="points"
    />
  </Horizontal>
);
