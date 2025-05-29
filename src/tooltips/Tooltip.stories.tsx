import { Meta, StoryObj } from "@storybook/react";

import { Info } from "@phosphor-icons/react";

import Tooltip, { TooltipProps } from "./Tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
  args: {
    content: "Tooltip message",
    placement: "top",
    theme: "light",
  },
  argTypes: {
    content: { control: "text" },
    placement: {
      control: "select",
      options: [
        "top",
        "bottom",
        "left",
        "right",
        "top-start",
        "top-end",
        "bottom-start",
        "bottom-end",
        "left-start",
        "left-end",
        "right-start",
        "right-end",
        "auto",
      ],
    },
    theme: { control: "radio", options: ["light", "dark"] },
  },
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: (args: TooltipProps) => (
    <Tooltip {...args}>
      <button style={{ padding: "0.5rem 1rem" }}>Hover me</button>
    </Tooltip>
  ),
};

export const WithIcon: Story = {
  render: (args: TooltipProps) => (
    <Tooltip {...args}>
      <Info size={24} />
    </Tooltip>
  ),
};
