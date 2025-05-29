import { CopySimple } from "@phosphor-icons/react";
import type { StoryObj } from "@storybook/react";

import Dropdown, {
  DropdownProps,
  DropdownCategories,
  DropdownCategoriesList,
} from "./Dropdown";

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
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {DropdownCategoriesList.map((category) => (
          <Dropdown
            {...args}
            key={category}
            category={category as DropdownCategories}
            text={category.charAt(0).toUpperCase() + category.slice(1)}
          />
        ))}
      </div>
    );
  },
};
