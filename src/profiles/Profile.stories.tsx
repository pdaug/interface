import type { StoryObj } from "@storybook/react";

import Profile from "./Profile";

export default {
  title: "Components/Profile",
  component: Profile,
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    description: { control: "text" },
    photo: { control: "text" },
    photoSize: { control: "number" },
    border: { control: "boolean" },
    padding: { control: "boolean" },
  },
};

export const Default: StoryObj<typeof Profile> = {
  args: {
    name: "John Doe",
    description: "Frontend Dev",
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
    border: true,
  },
};
