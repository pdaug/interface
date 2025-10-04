import React, { useState } from "react";
import { CaretDown, CaretUp } from "@phosphor-icons/react";

// styles
import "./Wrapper.css";

// components
import { Horizontal, Vertical } from "../aligns/Align";
import Button, { ButtonCategories, ButtonProps } from "../buttons/Button";

export type WrapperProps = {
  title?: string;
  description?: string;
  collapsible?: boolean;
  children: React.ReactNode;
  onCancel?: () => void;
  onCancelLabel?: string;
  onConfirmCategory?: ButtonCategories;
  onConfirm?: (() => void) | (() => Promise<void>);
  onConfirmLabel?: string;
  actions?: ButtonProps[];
  styles?: React.CSSProperties;
  contentStyles?: React.CSSProperties;
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
  onConfirmCategory,
  actions,
  styles,
  contentStyles,
}: WrapperProps) {
  const [isCollapsible, setCollapsible] = useState(Boolean(collapsible));

  return (
    <div className="wrapper" style={styles}>
      {title && (
        <div className="wrapperHeader">
          <Horizontal className="itemsCenter">
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
                type="button"
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
      <div className="wrapperContent" style={contentStyles}>
        {!isCollapsible ? children : <div>&nbsp;</div>}
      </div>
      {(onCancel || onConfirm || actions?.length) && (
        <div className="wrapperFooter">
          {onCancel && (
            <Button
              type="button"
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
              type="submit"
              category={onConfirmCategory || "Success"}
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
