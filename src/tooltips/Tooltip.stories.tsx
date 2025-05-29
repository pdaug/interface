import type { StoryObj } from "@storybook/react";

import Button from "../buttons/Button";
import Tooltip, { TooltipPlacement } from "./Tooltip";

export default {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
};

export const Default: StoryObj<typeof Tooltip> = {
  render: () => (
    <Tooltip content="Tooltip message">
      <Button text="Hover me" category="primary" />
    </Tooltip>
  ),
};

export const Light: StoryObj<typeof Tooltip> = {
  render: () => {
    const placements = ["top", "bottom", "left", "right"];
    return (
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {placements.map((placement) => (
          <Tooltip
            theme="light"
            key={placement}
            content={`Tooltip ${placement}`}
            placement={placement as TooltipPlacement}
          >
            <Button text={placement} category="neutral" />
          </Tooltip>
        ))}
      </div>
    );
  },
};

export const Dark: StoryObj<typeof Tooltip> = {
  render: () => {
    const placements = ["top", "bottom", "left", "right"];
    return (
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {placements.map((placement) => (
          <Tooltip
            theme="dark"
            key={placement}
            content={`Tooltip ${placement}`}
            placement={placement as TooltipPlacement}
          >
            <Button text={placement} category="neutral" />
          </Tooltip>
        ))}
      </div>
    );
  },
};
