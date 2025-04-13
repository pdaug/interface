import React from "react";

// styles
import "./Section.css";

// components
import Button, { ButtonProps } from "../buttons/Button";

export type SectionProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  onCancel?: () => void;
  onConfirm?: () => void;
  actions?: ButtonProps[];
};

const Section = function ({
  title,
  description,
  children,
  onCancel,
  onConfirm,
  actions,
}: SectionProps) {
  return (
    <div className="baseui-section">
      <div className="baseui-section-header">
        <div className="baseui-section-header-title">{title}</div>
        <div className="baseui-section-header-description">{description}</div>
      </div>
      <div className="baseui-section-content">{children}</div>
      <div className="baseui-section-footer">
        {onCancel && (
          <Button category="neutral" text="Cancelar" onClick={onCancel} />
        )}
        {actions &&
          actions?.map(function (action, index) {
            return (
              <Button
                key={`action-${index}`}
                text={action.text}
                category={action.category}
                id={action.id}
                name={action.name}
                disabled={action.disabled}
                Icon={action.Icon}
                IconWeight={action.IconWeight}
                IconSize={action.IconSize}
                IconPosition={action.IconPosition}
                style={action.style}
                dropdown={action.dropdown}
                type={action.type}
                onClick={action.onClick}
              />
            );
          })}
        {onConfirm && (
          <Button category="primary" text="Confirmar" onClick={onConfirm} />
        )}
      </div>
    </div>
  );
};

export default Section;
