import { Meta, StoryObj } from "@storybook/react";
import { Plus, Trash, WarningCircle } from "@phosphor-icons/react";

import Button from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    category: {
      control: "select",
      options: ["primary", "secondary", "danger", "warn", "neutral"],
    },
    Icon: {
      control: false,
    },
    onClick: { action: "clicked" },
  },
};

export const AllCategories = () => {
  const categories = [
    "primary",
    "secondary",
    "danger",
    "warn",
    "neutral",
  ] as const;

  return (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      {categories.map((category) => (
        <Button
          key={category}
          category={category}
          text={category.charAt(0).toUpperCase() + category.slice(1)}
          onClick={() => console.log(`${category} clicked`)}
        />
      ))}
    </div>
  );
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Basic: Story = {
  args: {
    text: "Click me",
    category: "primary",
  },
};

export const WithLeftIcon: Story = {
  args: {
    text: "Add",
    category: "primary",
    Icon: Plus,
    IconSize: 16,
    IconWeight: "regular",
    IconPosition: "left",
  },
};

export const WithRightIcon: Story = {
  args: {
    text: "Delete",
    category: "danger",
    Icon: Trash,
    IconSize: 16,
    IconWeight: "regular",
    IconPosition: "right",
  },
};

export const Disabled: Story = {
  args: {
    text: "Disabled",
    category: "neutral",
    disabled: true,
    Icon: WarningCircle,
    IconSize: 16,
    IconWeight: "regular",
  },
};
