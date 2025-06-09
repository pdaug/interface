import {
  Info,
  Warning,
  CheckCircle,
  WarningOctagon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react";

import Callout, {
  CalloutProps,
  CalloutCategories,
  CalloutCategoriesList,
} from "./Callout";
import { Center, Vertical } from "../aligns/Align";

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
} as Meta;

const IconCategory = {
  Success: CheckCircle,
  Info: Info,
  Warning: Warning,
  Danger: WarningOctagon,
};

export const All: StoryObj<CalloutProps> = {
  render: (args: CalloutProps) => (
    <Vertical internal={1} styles={{ maxWidth: "35rem" }}>
      {CalloutCategoriesList.map(function (category) {
        return (
          <Callout
            {...args}
            key={category}
            Icon={IconCategory[category]}
            category={category as CalloutCategories}
          />
        );
      })}
    </Vertical>
  ),
};
