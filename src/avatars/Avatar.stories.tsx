import { Meta, StoryObj } from "@storybook/react";
import { Smiley, Lightning } from "@phosphor-icons/react";

// styles
import "./Avatar.css";

import Avatar from "./Avatar";

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,
  argTypes: {
    size: { control: { type: "number", min: 1, max: 10 } },
    circle: { control: "boolean" },
    photo: { control: "text" },
    label: { control: "text" },
    Icon: { control: false },
  },
};
export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    label: "Alice",
    size: 4,
  },
};

export const CircleWithInitial: Story = {
  args: {
    label: "Bob",
    size: 5,
    circle: true,
  },
};

export const WithPhoto: Story = {
  args: {
    label: "Carla",
    size: 5,
    circle: true,
    photo: "https://i.pravatar.cc/100?img=3",
  },
};

export const WithIcon: Story = {
  args: {
    label: "Daniel",
    size: 5,
    circle: false,
    Icon: Smiley,
  },
};

export const CustomIcon: Story = {
  args: {
    label: "Eva",
    size: 6,
    circle: true,
    Icon: Lightning,
  },
};

export const LargeSize: Story = {
  args: {
    label: "Felipe",
    size: 8,
    circle: true,
  },
};
