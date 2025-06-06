import { Plus, Trash } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react";

import { Center, Horizontal } from "../aligns/Align";
import Button, { ButtonCategories, ButtonCategoriesList } from "./Button";

export default {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  decorators: (Story) => (
    <Center>
      <Story />
    </Center>
  ),
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
} as Meta;

export const Default: StoryObj<typeof Button> = {
  args: {
    text: "Default",
    category: "Success",
  },
};

export const All: StoryObj<typeof Button> = {
  render: () => {
    return (
      <Horizontal internal={1}>
        {ButtonCategoriesList.map((category) => (
          <Button
            key={category}
            category={category as ButtonCategories}
            onClick={() => alert(`${category} clicked`)}
            text={category.charAt(0).toUpperCase() + category.slice(1)}
          />
        ))}
      </Horizontal>
    );
  },
};

export const WithLeftIcon: StoryObj<typeof Button> = {
  args: {
    text: "Add",
    category: "Success",
    Icon: Plus,
    IconSize: 16,
    IconWeight: "regular",
    IconPosition: "left",
  },
};

export const WithRightIcon: StoryObj<typeof Button> = {
  args: {
    text: "Delete",
    category: "Danger",
    Icon: Trash,
    IconSize: 16,
    IconWeight: "regular",
    IconPosition: "right",
  },
};

export const Disabled: StoryObj<typeof Button> = {
  render: () => {
    return (
      <Horizontal internal={1}>
        {ButtonCategoriesList.map((category) => (
          <Button
            disabled
            key={category}
            category={category as ButtonCategories}
            text={category.charAt(0).toUpperCase() + category.slice(1)}
          />
        ))}
      </Horizontal>
    );
  },
};
