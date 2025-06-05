import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { Center, Horizontal } from "../aligns/Align";
import Badge, { BadgeCategoriesList } from "./Badge";

export default {
  title: "Components/Badge",
  component: Badge,
  decorators: (Story) => (
    <Center>
      <Story />
    </Center>
  ),
  tags: ["autodocs"],
  argTypes: {
    category: {
      control: "select",
      options: BadgeCategoriesList,
    },
  },
} as Meta;

export const Default: StoryObj<typeof Badge> = {
  args: {
    id: "default-badge",
    value: "Default",
    category: "Primary",
  },
};

export const All: StoryObj<typeof Badge> = {
  render: () => {
    return (
      <Horizontal internal={1}>
        {BadgeCategoriesList.map((category) => (
          <Badge
            key={category}
            category={category}
            value={category.charAt(0).toUpperCase() + category.slice(1)}
          />
        ))}
      </Horizontal>
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
    category: "Secondary",
    options: [
      { id: "1", value: "opt1", label: "Option 1" },
      { id: "2", value: "opt2", label: "Option 2" },
      { id: "3", value: "opt3", label: "Option 3" },
    ],
  },
};
