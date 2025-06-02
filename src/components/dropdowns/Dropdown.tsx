import React, { useEffect, useRef, useState } from "react";
import { Icon as PhosphorIcons } from "@phosphor-icons/react";

// styles
import "./Dropdown.css";

export type DropdownValues = {
  id: string;
  label: string;
  disabled?: boolean;
  Icon?: PhosphorIcons;
  onClick?: React.EventHandler<React.MouseEvent<HTMLButtonElement>>;
}[];

export type DropdownProps = {
  values: DropdownValues;
  children: React.ReactElement;
};

const Dropdown = function ({ children, values }: DropdownProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const dropdownContentRef = useRef<HTMLDivElement | null>(null);

  const ToggleDropdown = function () {
    setDropdownOpen(!dropdownOpen);
    return;
  };

  useEffect(() => {
    if (!dropdownOpen || !dropdownContentRef.current) return;
    const dropdownEl = dropdownContentRef.current;
    const rect = dropdownEl.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      dropdownEl.style.left = "auto";
      dropdownEl.style.right = "0";
    }
    if (rect.bottom > window.innerHeight) {
      dropdownEl.style.top = "auto";
      dropdownEl.style.bottom = "100%";
    }
    return;
  }, [dropdownOpen]);

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
      <div onClick={ToggleDropdown}>{children}</div>
      <div
        ref={dropdownContentRef}
        className={`fz-dropdown-content ${dropdownOpen ? "open" : ""}`}
      >
        {values.map(function ({ id, label, Icon, disabled, onClick }) {
          const onClickWithClose = function (
            event: React.MouseEvent<HTMLButtonElement>,
          ) {
            onClick?.(event);
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
