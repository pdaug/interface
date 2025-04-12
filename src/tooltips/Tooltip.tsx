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
        className={`baseui-tooltip-container baseui-tooltip-container-${position}`}
      >
        <div
          className={`baseui-tooltip-content baseui-tooltip-content-${theme}`}
        >
          {content}
        </div>
      </div>
      {children}
    </div>
  );
};

export default Tooltip;
