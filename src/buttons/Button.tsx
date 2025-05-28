import {
  CaretDown,
  CaretUp,
  IconWeight,
  Icon as PhosphorIcons,
} from "@phosphor-icons/react";
import React, { useEffect, useRef, useState } from "react";

// styles
import "./Button.css";

export type ButtonCategories =
  | "primary"
  | "secondary"
  | "danger"
  | "warn"
  | "neutral";

export type ButtonDropdowns = {
  id: string;
  label: string;
  disabled?: boolean;
  Icon?: PhosphorIcons;
  onClick?: React.EventHandler<React.MouseEvent<HTMLButtonElement>>;
}[];

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
  dropdown?: ButtonDropdowns;
  type?: ButtonType;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
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
  dropdown,
}: ButtonProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const buttonDropdownRef = useRef<HTMLDivElement | null>(null);

  const ToggleDropdown = function () {
    setDropdownOpen(!dropdownOpen);
    return;
  };

  const ButtonBase = (
    <button
      id={id}
      name={name}
      type={type}
      style={style}
      onClick={onClick}
      disabled={disabled}
      className={`fadeui-button fadeui-button-${category}`}
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

  useEffect(function () {
    const HandleClickButton = function (event: MouseEvent) {
      if (
        event.target &&
        buttonDropdownRef.current &&
        !buttonDropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
        return;
      }
      return;
    };
    document.addEventListener("mousedown", HandleClickButton);
    return function () {
      document.removeEventListener("mousedown", HandleClickButton);
      return;
    };
  }, []);

  return dropdown ? (
    <div ref={buttonDropdownRef} className="fadeui-button-dropdown">
      <div className="fadeui-button-dropdown-actor">
        {ButtonBase}
        <button
          onClick={ToggleDropdown}
          className={`fadeui-button fadeui-button-${category} fadeui-button-actor`}
        >
          {dropdownOpen ? <CaretUp /> : <CaretDown />}
        </button>
      </div>
      <div
        style={{ display: dropdownOpen ? "flex" : "none" }}
        className="fadeui-button-dropdown-content"
      >
        {dropdown.map(function ({ id, label, Icon, disabled, onClick }) {
          const onClickWithClose = function (
            event: React.MouseEvent<HTMLButtonElement>,
          ) {
            if (onClick) {
              onClick(event);
            }
            setDropdownOpen(false);
            return;
          };
          return (
            <button
              key={id}
              disabled={disabled}
              onClick={onClickWithClose}
              className="fadeui-button-dropdown-content-option"
            >
              {Icon && <Icon />}
              <span>{label}</span>
            </button>
          );
        })}
        x
      </div>
    </div>
  ) : (
    ButtonBase
  );
};

export default Button;
