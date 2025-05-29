import type { StoryObj } from "@storybook/react";

import Breadcrumb from "./Breadcrumb";

export default {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
};

export const Default: StoryObj<typeof Breadcrumb> = {
  args: {
    links: [
      { id: "home", label: "Home", url: "/" },
      { id: "financial", label: "Financial", url: "/financial" },
    ],
  },
};

export const WithMultiples: StoryObj<typeof Breadcrumb> = {
  args: {
    links: [
      { id: "home", label: "Home", url: "/" },
      { id: "corporation", label: "Corporation", url: "/corporation" },
      { id: "workspace", label: "Workspace", url: "/corporation/workspace" },
      {
        id: "users",
        label: "Users",
        url: "/corporation/workspace/users",
      },
    ],
  },
};

export const WithExternalLink: StoryObj<typeof Breadcrumb> = {
  args: {
    links: [
      { id: "home", label: "Home", url: "/" },
      {
        id: "api",
        label: "API",
        url: "https://docs.example.com/api",
        target: "_blank",
      },
    ],
  },
};
