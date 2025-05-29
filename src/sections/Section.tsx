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
    <div className="fz-section">
      <div className="fz-section-header">
        <div className="fz-section-header-title">{title}</div>
        <div className="fz-section-header-description">{description}</div>
      </div>
      <div className="fz-section-content">{children}</div>
      {(onCancel || onConfirm || actions?.length) && (
        <div className="fz-section-footer">
          {onCancel && (
            <Button category="neutral" text="Cancelar" onClick={onCancel} />
          )}
          {actions &&
            actions?.map(function (action, index) {
              return <Button key={`action-${index}`} {...action} />;
            })}
          {onConfirm && (
            <Button category="primary" text="Confirmar" onClick={onConfirm} />
          )}
        </div>
      )}
    </div>
  );
};

export default Section;
