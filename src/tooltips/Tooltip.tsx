import React from "react";

// styles
import "./Tooltip.css";

export type TooltipTheme = "dark" | "light";

export type TooltipPosition = "bottom" | "top" | "left" | "right";

export type TooltipProps = {
  content: string;
  theme?: TooltipTheme;
  position?: TooltipPosition;
  width?: string | number;
  children: React.ReactNode;
};

const Tooltip = function ({
  content,
  theme = "light",
  position = "top",
  width = "auto",
  children,
}: TooltipProps) {
  return (
    <div className="baseui-tooltip">
      <div
        style={{ width }}
        className={`baseui-tooltip-content baseui-tooltip-content-${position} baseui-tooltip-content-${theme}`}
      >
        {content}
      </div>
      {children}
    </div>
  );
};

export default Tooltip;
