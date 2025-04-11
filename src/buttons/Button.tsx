import React, { useEffect, useRef, useState } from "react";
import {
  CaretDown,
  CaretUp,
  IconWeight,
  Icon as PhosphorIcons,
} from "@phosphor-icons/react";

// styles
import "./Button.css";

export type TypeButtonCategories =
  | "primary"
  | "secondary"
  | "danger"
  | "warn"
  | "neutral";

export type TypeButtonDropdowns = {
  id: string;
  label: string;
  disabled?: boolean;
  Icon?: PhosphorIcons;
  onClick?: React.EventHandler<React.MouseEvent<HTMLButtonElement>>;
}[];

type ButtonProps = {
  text: React.ReactNode;
  category: TypeButtonCategories;
  id?: string;
  name?: string;
  disabled?: boolean;
  Icon?: PhosphorIcons;
  IconWeight?: IconWeight;
  IconSize?: number;
  style?: React.CSSProperties;
  dropdown?: TypeButtonDropdowns;
  type?: "submit" | "reset" | "button";
  onClick?: React.EventHandler<React.MouseEvent<HTMLButtonElement>>;
};

const Button = function ({
  id,
  name,
  type,
  category,
  Icon,
  IconSize,
  IconWeight,
  text,
  style,
  onClick,
  disabled,
  dropdown,
}: ButtonProps) {
  const buttonDropdown = useRef<HTMLDivElement | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const ToggleDropdown = function () {
    setDropdownOpen(!dropdownOpen);
    return;
  };

  const ButtonContent = (
    <button
      id={id}
      name={name}
      type={type}
      style={style}
      onClick={onClick}
      disabled={disabled}
      className={`baseui-button baseui-button-${category}`}
    >
      {Icon && <Icon weight={IconWeight} size={IconSize} />}
      {text && <span>{text}</span>}
    </button>
  );

  useEffect(function () {
    const HandleClickButton = function (event: MouseEvent) {
      if (
        event.target &&
        buttonDropdown.current &&
        !buttonDropdown.current.contains(event.target as Node)
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
    <div ref={buttonDropdown} className="baseui-button-dropdown">
      <div className="baseui-button-dropdown-actor">
        {ButtonContent}
        <button
          onClick={ToggleDropdown}
          className={`baseui-button baseui-button-${category} baseui-button-actor`}
        >
          {dropdownOpen ? <CaretUp /> : <CaretDown />}
        </button>
      </div>
      <div
        style={{ display: dropdownOpen ? "flex" : "none" }}
        className="baseui-button-dropdown-content"
      >
        {dropdown.map(function ({ id, label, Icon, disabled, onClick }) {
          return (
            <button
              key={id}
              onClick={onClick}
              disabled={disabled}
              className="baseui-button-dropdown-content-option"
            >
              {Icon && <Icon />}
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  ) : (
    ButtonContent
  );
};

export default Button;
