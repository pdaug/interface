import type { Meta, StoryObj } from "@storybook/react";

import Wrapper from "./Wrapper";
import { Center } from "../aligns/Align";

export default {
  title: "Components/Wrapper",
  component: Wrapper,
  tags: ["autodocs"],
  decorators: (Story) => (
    <Center>
      <Story />
    </Center>
  ),
} as Meta;

export const Default: StoryObj<typeof Wrapper> = {
  args: {
    children: (
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam luctus
        lacus vitae feugiat sagittis. Nunc varius libero id arcu sodales
        rhoncus. Curabitur diam eros.
      </div>
    ),
  },
};

export const WithFooter: StoryObj<typeof Wrapper> = {
  args: {
    children: (
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam luctus
        lacus vitae feugiat sagittis. Nunc varius libero id arcu sodales
        rhoncus. Curabitur diam eros.
      </div>
    ),
    actions: [
      {
        text: "Edit",
        category: "Success",
        onClick: () => alert("Edit clicked!"),
      },
    ],
  },
};

export const WithHeader: StoryObj<typeof Wrapper> = {
  args: {
    title: "Title Wrapper",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    children: (
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam luctus
        lacus vitae feugiat sagittis. Nunc varius libero id arcu sodales
        rhoncus. Curabitur diam eros.
      </div>
    ),
  },
};

export const WithCancelConfirm: StoryObj<typeof Wrapper> = {
  args: {
    title: "Title Wrapper",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    children: (
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam luctus
        lacus vitae feugiat sagittis. Nunc varius libero id arcu sodales
        rhoncus. Curabitur diam eros.
      </div>
    ),
    onCancel: () => alert("Cancel clicked!"),
    onConfirm: () => alert("Confirm clicked!"),
  },
};

export const WithActions: StoryObj<typeof Wrapper> = {
  args: {
    title: "Title Wrapper",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    children: (
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam luctus
        lacus vitae feugiat sagittis. Nunc varius libero id arcu sodales
        rhoncus. Curabitur diam eros.
      </div>
    ),
    actions: [
      {
        category: "Success",
        text: "Edit",
        onClick: () => alert("Edit clicked!"),
      },
      {
        category: "Danger",
        text: "Delete",
        onClick: () => alert("Delete clicked!"),
      },
    ],
  },
};

export const Full: StoryObj<typeof Wrapper> = {
  args: {
    title: "Title Wrapper",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    children: (
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
    ),
    onCancel: () => alert("Cancel clicked!"),
    onConfirm: () => alert("Confirm clicked!"),
    actions: [
      {
        category: "Neutral",
        text: "Help",
        onClick: () => alert("Help clicked!"),
      },
    ],
  },
};
