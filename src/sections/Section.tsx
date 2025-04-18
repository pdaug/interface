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
    <div className="fadeui-section">
      <div className="fadeui-section-header">
        <div className="fadeui-section-header-title">{title}</div>
        <div className="fadeui-section-header-description">{description}</div>
      </div>
      <div className="fadeui-section-content">{children}</div>
      <div className="fadeui-section-footer">
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
