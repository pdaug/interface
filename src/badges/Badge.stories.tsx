import { useState } from "react";
import type { StoryObj } from "@storybook/react";

import Badge, { BadgeCategories } from "./Badge";

export default {
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

export const Default: StoryObj<typeof Badge> = {
  args: {
    id: "default-badge",
    value: "Default",
    category: "primary",
  },
};

export const All: StoryObj<typeof Badge> = {
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
        {categories.map((category) => (
          <Badge
            key={category}
            category={category}
            value={category.charAt(0).toUpperCase() + category.slice(1)}
          />
        ))}
      </div>
    );
  },
};

export const WithOptions: StoryObj<typeof Badge> = {
  render: function BadgeWithState(args) {
    const [value, setValue] = useState(args.value);
    return (
      <Badge
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
  args: {
    id: "badge-with-options",
    value: "opt1",
    category: "secondary",
    options: [
      { id: "1", value: "opt1", label: "Option 1" },
      { id: "2", value: "opt2", label: "Option 2" },
      { id: "3", value: "opt3", label: "Option 3" },
    ],
  },
};
