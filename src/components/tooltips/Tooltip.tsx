import React from "react";
import Tippy from "@tippyjs/react";
import { Placement } from "tippy.js";

// styles
import "./Tooltip.css";
import "tippy.js/dist/tippy.css";

export type TooltipTheme = "dark" | "light";

export type TooltipPlacement = Placement;

export type TooltipProps = {
  content: string | React.ReactNode;
  theme?: TooltipTheme;
  placement?: TooltipPlacement;
  children: React.ReactElement | string | number | boolean;
};

const Tooltip = function ({
  content,
  theme = "dark",
  placement = "top",
  children,
}: TooltipProps) {
  return (
    <Tippy content={content} theme={theme} placement={placement}>
      <div>{children}</div>
    </Tippy>
  );
};

export default Tooltip;
