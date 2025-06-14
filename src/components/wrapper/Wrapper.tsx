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
  styles?: React.CSSProperties;
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
  styles,
}: WrapperProps) {
  return (
    <div className="wrapper" style={styles}>
      {title && (
        <div className="wrapperHeader">
          <div className="wrapperHeaderTitle">{title}</div>
          {description && (
            <div className="wrapperHeaderDescription">{description}</div>
          )}
        </div>
      )}
      <div className="wrapperContent">{children}</div>
      {(onCancel || onConfirm || actions?.length) && (
        <div className="wrapperFooter">
          {onCancel && (
            <Button
              category="Neutral"
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
              category="Success"
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
