import type { StoryObj } from "@storybook/react";
import { Clipboard, CopySimple, Trash } from "@phosphor-icons/react";

import Dropdown from "./Dropdown";
import Button from "../buttons/Button";
import { Horizontal } from "../aligns/Align";

export default {
  title: "Components/Dropdown",
  component: Dropdown,
  tags: ["autodocs"],
};

export const Default: StoryObj<typeof Dropdown> = {
  render: () => {
    return (
      <Horizontal internal={1}>
        <Dropdown
          values={[
            {
              id: "1",
              label: "Paste",
              onClick: () => alert(`Paste clicked!`),
            },
          ]}
        >
          <Button category="neutral" text="Dropdown" />
        </Dropdown>
      </Horizontal>
    );
  },
};

export const WithIcon: StoryObj<typeof Dropdown> = {
  render: () => {
    return (
      <Horizontal internal={1}>
        <Dropdown
          values={[
            {
              id: "1",
              label: "Paste",
              Icon: Clipboard,
              onClick: () => alert(`Paste clicked!`),
            },
            {
              id: "2",
              label: "Copy",
              Icon: CopySimple,
              onClick: () => alert(`Copy clicked!`),
            },
          ]}
        >
          <Button category="neutral" text="Dropdown" />
        </Dropdown>
      </Horizontal>
    );
  },
};

export const WithDisabled: StoryObj<typeof Dropdown> = {
  render: () => {
    return (
      <Horizontal internal={1}>
        <Dropdown
          values={[
            {
              id: "1",
              label: "Paste",
              Icon: Clipboard,
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
              Icon: Trash,
              disabled: true,
            },
          ]}
        >
          <Button category="neutral" text="Dropdown" />
        </Dropdown>
      </Horizontal>
    );
  },
};
