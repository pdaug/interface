import type { Meta, StoryObj } from "@storybook/react";

import "./Badge.css";

import Badge from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  argTypes: {
    category: {
      control: "select",
      options: ["primary", "secondary", "danger", "warn", "neutral"],
    },
    text: { control: "text" },
    id: { control: "text" },
    name: { control: "text" },
    options: { control: false },
  },
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const TextOnly: Story = {
  args: {
    id: "badge1",
    category: "primary",
    text: "Texto fixo",
  },
};

export const AllCategories: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      <Badge category="primary" text="Primário" />
      <Badge category="secondary" text="Secundário" />
      <Badge category="danger" text="Perigo" />
      <Badge category="warn" text="Aviso" />
      <Badge category="neutral" text="Neutro" />
    </div>
  ),
};

export const AsDropdown: Story = {
  args: {
    id: "badge-select",
    name: "badge-option",
    category: "secondary",
    options: [
      { id: "opt1", value: "1", label: "Opção 1" },
      { id: "opt2", value: "2", label: "Opção 2" },
      { id: "opt3", value: "3", label: "Opção 3" },
    ],
  },
};

export const WithCustomIdAndName: Story = {
  args: {
    id: "custom-id",
    name: "custom-name",
    category: "neutral",
    text: "Customizado",
  },
};
