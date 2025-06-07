import { CaretDown } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react";

import Profile from "./Profile";
import { Center, Vertical } from "../aligns/Align";

export default {
  title: "Components/Profile",
  component: Profile,
  decorators: (Story) => (
    <Center>
      <Vertical styles={{ width: "35rem" }}>
        <Story />
      </Vertical>
    </Center>
  ),
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    description: { control: "text" },
    photo: { control: "text" },
    photoSize: { control: "number" },
    border: { control: "boolean" },
    padding: { control: "boolean" },
  },
} as Meta;

export const Default: StoryObj<typeof Profile> = {
  args: {
    name: "John Doe",
    padding: false,
    border: false,
  },
};

export const WithPhoto: StoryObj<typeof Profile> = {
  args: {
    name: "Edward Cullen",
    description: "Product Designer",
    photo: "https://randomuser.me/api/portraits/men/75.jpg",
    photoSize: 4,
    photoCircle: true,
    padding: false,
    border: false,
  },
};

export const WithBorder: StoryObj<typeof Profile> = {
  args: {
    name: "Isabella Swan",
    description: "Product Designer",
    photo: "https://randomuser.me/api/portraits/women/2.jpg",
    photoSize: 4,
    photoCircle: true,
    border: true,
  },
};

export const WithDropdown: StoryObj<typeof Profile> = {
  args: {
    name: "Company LTDA Name Large and Long full name to fall in overflow",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum feugiat sapien at varius mattis. Etiam ac magna maximus, facilisis lorem nec, lacinia dui. Pellentesque cursus venenatis maximus. Quisque et enim posuere, malesuada elit vel, accumsan metus. Donec eleifend vulputate ex, eu vulputate libero efficitur sit amet. Vivamus varius volutpat laoreet. Etiam eu feugiat arcu, nec porttitor turpis. Nunc rhoncus urna id purus porttitor, condimentum luctus leo suscipit. In eu ex sed nulla viverra tempor. Proin tincidunt quam vitae ex lobortis, a bibendum turpis fermentum.",
    photoSize: 8,
    padding: true,
    dropdown: {
      children: <CaretDown />,
      values: [
        {
          id: "Item 1",
          label: "Item 1",
        },
        {
          id: "Item 2",
          label: "Item 2",
        },
      ],
    },
  },
};
