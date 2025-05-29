import { StoryObj } from "@storybook/react";
import { Plus, Trash } from "@phosphor-icons/react";

import Button, { ButtonCategories } from "./Button";

export default {
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

export const Default: StoryObj<typeof Button> = {
  args: {
    text: "Default",
    category: "primary",
  },
};

export const All: StoryObj<typeof Button> = {
  render: () => {
    const categories = ["primary", "secondary", "danger", "warn", "neutral"];
    return (
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {categories.map((category) => (
          <Button
            key={category}
            category={category as ButtonCategories}
            onClick={() => alert(`${category} clicked`)}
            text={category.charAt(0).toUpperCase() + category.slice(1)}
          />
        ))}
      </div>
    );
  },
};

export const WithLeftIcon: StoryObj<typeof Button> = {
  args: {
    text: "Add",
    category: "primary",
    Icon: Plus,
    IconSize: 16,
    IconWeight: "regular",
    IconPosition: "left",
  },
};

export const WithRightIcon: StoryObj<typeof Button> = {
  args: {
    text: "Delete",
    category: "danger",
    Icon: Trash,
    IconSize: 16,
    IconWeight: "regular",
    IconPosition: "right",
  },
};

export const Disabled: StoryObj<typeof Button> = {
  args: {
    text: "Disabled",
    category: "primary",
    disabled: true,
  },
};
