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
    <div className="fadeui-tooltip">
      <div
        style={{ width }}
        className={`fadeui-tooltip-container fadeui-tooltip-container-${position}`}
      >
        <div
          className={`fadeui-tooltip-content fadeui-tooltip-content-${theme}`}
        >
          {content}
        </div>
      </div>
      {children}
    </div>
  );
};

export default Tooltip;
