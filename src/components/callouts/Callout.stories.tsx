import {
  Info,
  Warning,
  CheckCircle,
  WarningOctagon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react";

import { Center } from "../aligns/Align";
import Callout, { CalloutCategoriesList, CalloutProps } from "./Callout";

export default {
  title: "Components/Callout",
  component: Callout,
  decorators: (Story) => (
    <Center>
      <Story />
    </Center>
  ),
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
} as Meta;

export const Primary: StoryObj<CalloutProps> = {
  args: {
    category: "Primary",
    Icon: CheckCircle,
  },
};

export const Secondary: StoryObj<CalloutProps> = {
  args: {
    category: "Secondary",
    Icon: Info,
  },
};

export const Warn: StoryObj<CalloutProps> = {
  args: {
    category: "Warn",
    Icon: Warning,
  },
};

export const Danger: StoryObj<CalloutProps> = {
  args: {
    category: "Danger",
    Icon: WarningOctagon,
  },
};
