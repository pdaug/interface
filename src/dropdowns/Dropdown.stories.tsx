import type { StoryObj } from "@storybook/react";
import { CopySimple } from "@phosphor-icons/react";

import Dropdown, {
  DropdownProps,
  DropdownCategories,
  DropdownCategoriesList,
} from "./Dropdown";
import { Horizontal } from "../aligns/Align";

export default {
  title: "Components/Dropdown",
  component: Dropdown,
  tags: ["autodocs"],
  args: {
    values: [
      {
        id: "1",
        label: "Paste",
        onClick: () => alert(`Paste clicked!`),
      },
      {
        id: "2",
        label: "Copy",
        Icon: CopySimple,
        onClick: () => alert(`Copy clicked!`),
      },
      {
        id: "3",
        label: "Delete",
        disabled: true,
      },
    ],
  },
};

export const All: StoryObj<typeof Dropdown> = {
  render: (args: DropdownProps) => {
    return (
      <Horizontal internal={1}>
        {DropdownCategoriesList.map((category) => (
          <Dropdown
            {...args}
            key={category}
            category={category as DropdownCategories}
            text={category.charAt(0).toUpperCase() + category.slice(1)}
          />
        ))}
      </Horizontal>
    );
  },
};
