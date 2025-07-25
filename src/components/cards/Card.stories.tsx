import type { Meta, StoryObj } from "@storybook/react";

import Card from "./Card";
import { Center } from "../aligns/Align";

export default {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  decorators: (Story) => (
    <Center>
      <Story />
    </Center>
  ),
} as Meta;

export const Default: StoryObj<typeof Card> = {
  args: {
    photo: "https://photo.picsum/600/600",
  },
};
