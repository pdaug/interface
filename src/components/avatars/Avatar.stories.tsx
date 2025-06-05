import { Rocket } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react";

import Avatar from "./Avatar";
import { Center } from "../aligns/Align";

export default {
  title: "Components/Avatar",
  component: Avatar,
  decorators: (Story) => (
    <Center>
      <Story />
    </Center>
  ),
  tags: ["autodocs"],
  argTypes: {
    size: { control: { type: "number", min: 1, max: 10 } },
    circle: { control: "boolean" },
    photo: { control: "text" },
    label: { control: "text" },
    Icon: { control: false },
  },
} as Meta;

export const Default: StoryObj<typeof Avatar> = {
  args: {
    label: "Default",
    size: 8,
  },
};

export const WithCircle: StoryObj<typeof Avatar> = {
  args: {
    label: "Circle",
    size: 8,
    circle: true,
  },
};

export const WithPhoto: StoryObj<typeof Avatar> = {
  args: {
    label: "Photo",
    size: 8,
    circle: true,
    photo: "https://i.pravatar.cc/100?img=3",
  },
};

export const WithIcon: StoryObj<typeof Avatar> = {
  args: {
    label: "Icon",
    size: 8,
    circle: true,
    Icon: Rocket,
  },
};
