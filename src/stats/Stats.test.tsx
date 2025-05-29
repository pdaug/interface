import { Meta, StoryObj } from "@storybook/react";

import Stats, { StatsProps } from "./Stats";

export default {
  title: "Data/Stats",
  component: Stats,
  tags: ["autodocs"],
} as Meta<StatsProps>;

export const Default: StoryObj<StatsProps> = {
  args: {
    title: "Vendas Mensais",
    metric: 12.5,
    metricStatus: "up",
    metricLocale: "pt-BR",
    metricOptions: { style: "percent", minimumFractionDigits: 1 },
    value: 42500,
    valueUnit: "R$",
    valueLocale: "pt-BR",
    valueOptions: { style: "currency", currency: "BRL" },
  },
};

export const Down: StoryObj<StatsProps> = {
  args: {
    title: "Usuários Ativos",
    metric: 8.3,
    metricStatus: "down",
    metricLocale: "en-US",
    metricOptions: { style: "percent", minimumFractionDigits: 1 },
    value: 912,
    valueUnit: "",
    valueLocale: "en-US",
    valueOptions: { maximumFractionDigits: 0 },
  },
};
