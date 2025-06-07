import React from "react";
import { IconWeight, Icon as PhosphorIcons } from "@phosphor-icons/react";

// styles
import "./Button.css";

export const ButtonCategoriesList = [
  "Success",
  "Info",
  "Warning",
  "Danger",
  "Neutral",
] as const;

export type ButtonCategories = (typeof ButtonCategoriesList)[number];

export type ButtonType = "submit" | "reset" | "button";

export type ButtonIconPosition = "left" | "right";

export type ButtonProps = {
  text: React.ReactNode;
  category: ButtonCategories;
  id?: string;
  name?: string;
  disabled?: boolean;
  Icon?: PhosphorIcons;
  IconWeight?: IconWeight;
  IconSize?: number;
  IconPosition?: ButtonIconPosition;
  style?: React.CSSProperties;
  type?: ButtonType;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onlyIcon?: boolean;
};

const Button = function ({
  id,
  name,
  type,
  category,
  Icon,
  IconSize,
  IconWeight,
  IconPosition = "left",
  text,
  style,
  onClick,
  disabled,
  onlyIcon,
}: ButtonProps) {
  return (
    <button
      id={id}
      name={name}
      type={type}
      style={style}
      onClick={onClick}
      disabled={disabled}
      className={`button button${category} ${onlyIcon ? "buttonOnlyIcon" : ""}`}
    >
      {Icon && IconPosition === "left" && (
        <Icon weight={IconWeight} size={IconSize} />
      )}
      {text && <span>{text}</span>}
      {Icon && IconPosition === "right" && (
        <Icon weight={IconWeight} size={IconSize} />
      )}
    </button>
  );
};

export default Button;
