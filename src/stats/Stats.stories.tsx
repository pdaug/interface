import { Meta, StoryObj } from "@storybook/react";

import Stats, { StatsProps } from "./Stats";

export default {
  title: "Components/Stats",
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

export const Grouped = () => (
  <div style={{ display: "flex", gap: "1.5rem" }}>
    <Stats
      title="Receita"
      metric={12.5}
      metricStatus="up"
      value={42500}
      valueUnit="R$"
    />
    <Stats
      title="Clientes"
      metric={3.2}
      metricStatus="down"
      value={120}
      valueUnit=""
    />
    <Stats
      title="Conversão"
      metric={1.1}
      metricStatus="up"
      value={4.2}
      valueUnit="%"
    />
  </div>
);
