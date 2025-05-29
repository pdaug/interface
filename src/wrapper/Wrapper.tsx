import React from "react";

// styles
import "./Wrapper.css";

// components
import Button, { ButtonProps } from "../buttons/Button";

export type WrapperProps = {
  title?: string;
  description?: string;
  children: React.ReactNode;
  onCancel?: () => void;
  onCancelLabel?: string;
  onConfirm?: () => void;
  onConfirmLabel?: string;
  actions?: ButtonProps[];
};

const Wrapper = function ({
  title,
  description,
  children,
  onCancel,
  onCancelLabel,
  onConfirm,
  onConfirmLabel,
  actions,
}: WrapperProps) {
  return (
    <div className="fz-wrapper">
      {title && (
        <div className="fz-wrapper-header">
          <div className="fz-wrapper-header-title">{title}</div>
          {description && (
            <div className="fz-wrapper-header-description">{description}</div>
          )}
        </div>
      )}
      <div className="fz-wrapper-content">{children}</div>
      {(onCancel || onConfirm || actions?.length) && (
        <div className="fz-wrapper-footer">
          {onCancel && (
            <Button
              category="neutral"
              onClick={onCancel}
              text={onCancelLabel || "Cancel"}
            />
          )}
          {actions &&
            actions?.map(function (action, index) {
              return <Button key={`action-${index}`} {...action} />;
            })}
          {onConfirm && (
            <Button
              category="primary"
              text={onConfirmLabel || "Confirm"}
              onClick={onConfirm}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Wrapper;
