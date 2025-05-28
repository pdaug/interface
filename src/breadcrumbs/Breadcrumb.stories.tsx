import type { Meta, StoryObj } from "@storybook/react";

import Breadcrumb from "./Breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Basic: Story = {
  args: {
    links: [
      { id: "home", label: "Home", url: "/" },
      { id: "financial", label: "Financial", url: "/financial" },
    ],
  },
};

export const MultiLevel: Story = {
  args: {
    links: [
      { id: "corporation", label: "Corporation", url: "/corporation" },
      { id: "workspace", label: "Workspace", url: "/corporation/workspace" },
      {
        id: "user",
        label: "John Smith",
        url: "/corporation/workspace/JohnSmith",
      },
    ],
  },
};

export const WithExternalLink: Story = {
  args: {
    links: [
      {
        id: "docs",
        label: "Docs",
        url: "https://docs.example.com",
        target: "_blank",
      },
      {
        id: "api",
        label: "API",
        url: "https://docs.example.com/api",
        target: "_blank",
      },
    ],
  },
};
