import type { Meta, StoryObj } from "@storybook/react";

import Breadcrumb from "./Breadcrumb";
import { Center } from "../aligns/Align";

export default {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  decorators: (Story) => (
    <Center>
      <Story />
    </Center>
  ),
} as Meta;

export const Default: StoryObj<typeof Breadcrumb> = {
  args: {
    links: [
      { id: "home", label: "Home", url: "/" },
      { id: "financial", label: "Financial" },
    ],
  },
};

export const WithMultiples: StoryObj<typeof Breadcrumb> = {
  args: {
    links: [
      { id: "home", label: "Home", url: "/" },
      { id: "corporation", label: "Corporation", url: "/corporation" },
      { id: "workspace", label: "Workspace", url: "/corporation/workspace" },
      { id: "users", label: "Users" },
    ],
  },
};

export const WithExternalLink: StoryObj<typeof Breadcrumb> = {
  args: {
    links: [
      { id: "settings", label: "Settings", url: "/settings" },
      { id: "externals", label: "Externals", url: "/externals" },
      {
        id: "api",
        label: "API",
        url: "https://docs.example.com/api",
        target: "_blank",
      },
    ],
  },
};
