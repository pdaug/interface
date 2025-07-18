import React, { useState } from "react";
import { CaretDown, CaretUp } from "@phosphor-icons/react";

// styles
import "./Wrapper.css";

// components
import { Horizontal, Vertical } from "../aligns/Align";
import Button, { ButtonProps } from "../buttons/Button";

export type WrapperProps = {
  title?: string;
  description?: string;
  collapsible?: boolean;
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
  collapsible,
  children,
  onCancel,
  onCancelLabel,
  onConfirm,
  onConfirmLabel,
  actions,
  styles,
}: WrapperProps) {
  const [isCollapsible, setCollapsible] = useState(Boolean(collapsible));

  return (
    <div className="wrapper" style={styles}>
      {title && (
        <div className="wrapperHeader">
          <Horizontal styles={{ alignItems: "center" }}>
            <Vertical styles={{ flex: 1 }}>
              <div className="wrapperHeaderTitle">{title}</div>
              {description && (
                <div className="wrapperHeaderDescription">{description}</div>
              )}
            </Vertical>
            {collapsible && (
              <Button
                text=""
                onlyIcon
                category="Neutral"
                Icon={isCollapsible ? CaretUp : CaretDown}
                onClick={function () {
                  setCollapsible(!isCollapsible);
                  return;
                }}
              />
            )}
          </Horizontal>
        </div>
      )}
      <div className="wrapperContent">
        {!isCollapsible ? (
          <div className="wrapperContentInner">{children}</div>
        ) : (
          <div style={{ height: 8 }}></div>
        )}
      </div>
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
