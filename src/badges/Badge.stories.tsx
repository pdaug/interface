import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import Badge, { BadgeCategories } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    category: {
      control: "select",
      options: ["primary", "secondary", "danger", "warn", "neutral"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Badge>;

const mockOptions = [
  { id: "1", value: "opt1", label: "Option 1" },
  { id: "2", value: "opt2", label: "Option 2" },
  { id: "3", value: "opt3", label: "Option 3" },
];

export const StaticBadge: Story = {
  args: {
    id: "static-badge",
    value: "Static Badge",
    category: "primary",
  },
};

export const SelectableBadge: Story = {
  render: function BadgeWithState(args) {
    const [selected, setSelected] = useState(args.value);
    return (
      <Badge
        {...args}
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
      />
    );
  },
  args: {
    id: "selectable-badge",
    value: "opt1",
    category: "secondary",
    options: mockOptions,
  },
};

export const AllCategories: Story = {
  render: () => {
    const categories: BadgeCategories[] = [
      "primary",
      "secondary",
      "danger",
      "warn",
      "neutral",
    ];
    return (
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {categories.map((cat) => (
          <Badge key={cat} value={cat} category={cat} />
        ))}
      </div>
    );
  },
};
