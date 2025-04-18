import React from "react";

// styles
import "./Panel.css";

export type PanelProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

const Panel = function ({ title, description, children }: PanelProps) {
  return (
    <div className="fadeui-panel">
      <div className="fadeui-panel-header">
        <div className="fadeui-panel-header-title">{title}</div>
        <div className="fadeui-panel-header-description">{description}</div>
      </div>
      <div className="fadeui-panel-content">{children}</div>
    </div>
  );
};

export default Panel;
