import type { Meta, StoryObj } from "@storybook/react";
import Profile from "./Profile";

const meta: Meta<typeof Profile> = {
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

export default meta;
type Story = StoryObj<typeof Profile>;

export const Basic: Story = {
  args: {
    name: "Ana Paula",
    description: "Desenvolvedora Frontend",
  },
};

export const WithPhoto: Story = {
  args: {
    name: "Lucas Ribeiro",
    description: "Product Designer",
    photo: "https://randomuser.me/api/portraits/men/75.jpg",
    photoSize: 4,
    border: true,
  },
};

export const WithoutPadding: Story = {
  args: {
    name: "João Mendes",
    description: "Analista de Dados",
    padding: false,
  },
};

export const CustomSize: Story = {
  args: {
    name: "Carla Souza",
    description: "CTO",
    photoSize: 6,
    border: true,
  },
};
