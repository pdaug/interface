import {
  Info,
  Warning,
  CheckCircle,
  WarningOctagon,
} from "@phosphor-icons/react";
import type { StoryObj } from "@storybook/react";

import Callout, { CalloutCategoriesList, CalloutProps } from "./Callout";

export default {
  title: "Components/Callout",
  component: Callout,
  tags: ["autodocs"],
  args: {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas et ligula sit amet tortor dapibus tempus ac et augue.",
    IconSize: 20,
  },
  argTypes: {
    category: {
      control: { type: "select" },
      options: CalloutCategoriesList,
    },
    Icon: {
      control: false,
    },
  },
};

export const Primary: StoryObj<CalloutProps> = {
  args: {
    category: "primary",
    Icon: CheckCircle,
  },
};

export const Secondary: StoryObj<CalloutProps> = {
  args: {
    category: "secondary",
    Icon: Info,
  },
};

export const Warn: StoryObj<CalloutProps> = {
  args: {
    category: "warn",
    Icon: Warning,
  },
};

export const Danger: StoryObj<CalloutProps> = {
  args: {
    category: "danger",
    Icon: WarningOctagon,
  },
};
