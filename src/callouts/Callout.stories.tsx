import {
  Info,
  Warning,
  CheckCircle,
  WarningOctagon,
} from "@phosphor-icons/react";
import { Meta, StoryObj } from "@storybook/react";

import Callout, { CalloutProps } from "./Callout";

const meta: Meta<CalloutProps> = {
  title: "Components/Callout",
  component: Callout,
  args: {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas et ligula sit amet tortor dapibus tempus ac et augue.",
    IconSize: 20,
  },
  argTypes: {
    category: {
      control: { type: "select" },
      options: ["primary", "secondary", "danger", "warn", "neutral"],
    },
    Icon: {
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<CalloutProps>;

export const Primary: Story = {
  args: {
    category: "primary",
    Icon: CheckCircle,
  },
};

export const Secondary: Story = {
  args: {
    category: "secondary",
    Icon: Info,
  },
};

export const Warn: Story = {
  args: {
    category: "warn",
    Icon: Warning,
  },
};

export const Danger: Story = {
  args: {
    category: "danger",
    Icon: WarningOctagon,
  },
};

export const Neutral: Story = {
  args: {
    category: "neutral",
    Icon: undefined,
  },
};
