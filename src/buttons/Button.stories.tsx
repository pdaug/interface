import type { StoryObj } from "@storybook/react";
import { Plus, Trash } from "@phosphor-icons/react";

import Button, { ButtonCategories, ButtonCategoriesList } from "./Button";

export default {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    category: {
      control: "select",
      options: ButtonCategoriesList,
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
    return (
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {ButtonCategoriesList.map((category) => (
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
  render: () => {
    return (
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {ButtonCategoriesList.map((category) => (
          <Button
            disabled
            key={category}
            category={category as ButtonCategories}
            text={category.charAt(0).toUpperCase() + category.slice(1)}
          />
        ))}
      </div>
    );
  },
};
