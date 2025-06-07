import type { Meta, StoryObj } from "@storybook/react";
import { Clipboard, CopySimple, Trash } from "@phosphor-icons/react";

// components
import Dropdown from "./Dropdown";
import Button from "../buttons/Button";
import { Horizontal, Vertical } from "../aligns/Align";

export default {
  title: "Components/Dropdown",
  component: Dropdown,
  tags: ["autodocs"],
} as Meta;

export const Default: StoryObj<typeof Dropdown> = {
  render: () => {
    const dropdown = (
      <Dropdown
        values={[
          {
            id: "1",
            label: "Paste",
            onClick: () => alert(`Paste clicked!`),
          },
        ]}
      >
        <Button category="Neutral" text="Dropdown" />
      </Dropdown>
    );
    return (
      <Vertical styles={{ height: "100vh" }}>
        <Horizontal>
          {dropdown}
          <div style={{ flex: 1 }}></div>
          {dropdown}
          <div style={{ flex: 1 }}></div>
          {dropdown}
        </Horizontal>
        <div style={{ flex: 1 }}></div>
        <Horizontal>
          {dropdown}
          <div style={{ flex: 1 }}></div>
          {dropdown}
          <div style={{ flex: 1 }}></div>
          {dropdown}
        </Horizontal>
        <div style={{ flex: 1 }}></div>
        <Horizontal>
          {dropdown}
          <div style={{ flex: 1 }}></div>
          {dropdown}
          <div style={{ flex: 1 }}></div>
          {dropdown}
        </Horizontal>
      </Vertical>
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
          <Button category="Neutral" text="Dropdown" />
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
          <Button category="Neutral" text="Dropdown" />
        </Dropdown>
      </Horizontal>
    );
  },
};
