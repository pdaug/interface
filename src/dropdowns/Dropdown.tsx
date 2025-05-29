import { useEffect, useRef, useState } from "react";
import { Icon as PhosphorIcons } from "@phosphor-icons/react";

// styles
import "./Dropdown.css";

export const DropdownCategoriesList = [
  "primary",
  "secondary",
  "danger",
  "warn",
  "neutral",
] as const;

export type DropdownType = "submit" | "reset" | "button";

export type DropdownCategories = (typeof DropdownCategoriesList)[number];

export type DropdownValues = {
  id: string;
  label: string;
  disabled?: boolean;
  Icon?: PhosphorIcons;
  onClick?: React.EventHandler<React.MouseEvent<HTMLButtonElement>>;
}[];

export type DropdownProps = {
  text: React.ReactNode;
  category: DropdownCategories;
  id?: string;
  name?: string;
  type?: DropdownType;
  style?: React.CSSProperties;
  disabled?: boolean;
  values: DropdownValues;
};

const Dropdown = function ({
  text,
  category,
  id,
  name,
  type,
  style,
  disabled,
  values,
}: DropdownProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const ToggleDropdown = function () {
    setDropdownOpen(!dropdownOpen);
    return;
  };

  useEffect(function () {
    const HandleClickButton = function (event: MouseEvent) {
      if (
        event.target &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
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

  return (
    <div ref={dropdownRef} className="fz-dropdown">
      <button
        id={id}
        name={name}
        type={type}
        style={style}
        disabled={disabled}
        onClick={ToggleDropdown}
        className={`fz-dropdown-button fz-dropdown-button-${category}`}
      >
        <span>{text}</span>
      </button>
      <div
        style={{ display: dropdownOpen ? "flex" : "none" }}
        className="fz-dropdown-content"
      >
        {values.map(function ({ id, label, Icon, disabled, onClick }) {
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
              className="fz-dropdown-content-option"
            >
              {Icon && <Icon size={16} />}
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Dropdown;
