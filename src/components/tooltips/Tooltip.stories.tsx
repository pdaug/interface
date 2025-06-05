import type { Meta, StoryObj } from "@storybook/react";

import Button from "../buttons/Button";
import { Center, Horizontal } from "../aligns/Align";
import Tooltip, { TooltipPlacement } from "./Tooltip";

export default {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  decorators: (Story) => (
    <Center>
      <Story />
    </Center>
  ),
} as Meta;

export const Default: StoryObj<typeof Tooltip> = {
  render: () => (
    <Tooltip content="Tooltip message">
      <Button text="Hover me" category="Primary" />
    </Tooltip>
  ),
};

export const Light: StoryObj<typeof Tooltip> = {
  render: () => {
    const placements = ["top", "bottom", "left", "right"];
    return (
      <Horizontal internal={1}>
        {placements.map((placement) => (
          <Tooltip
            theme="light"
            key={placement}
            content={`Tooltip ${placement}`}
            placement={placement as TooltipPlacement}
          >
            <Button text={placement} category="Neutral" />
          </Tooltip>
        ))}
      </Horizontal>
    );
  },
};

export const Dark: StoryObj<typeof Tooltip> = {
  render: () => {
    const placements = ["top", "bottom", "left", "right"];
    return (
      <Horizontal internal={1}>
        {placements.map((placement) => (
          <Tooltip
            theme="dark"
            key={placement}
            content={`Tooltip ${placement}`}
            placement={placement as TooltipPlacement}
          >
            <Button text={placement} category="Neutral" />
          </Tooltip>
        ))}
      </Horizontal>
    );
  },
};
