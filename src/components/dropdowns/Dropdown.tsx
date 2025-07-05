import React, { useEffect, useRef, useState } from "react";
import { Icon as PhosphorIcons } from "@phosphor-icons/react";

// styles
import "./Dropdown.css";

export type DropdownValues = {
  id: string;
  label: string;
  disabled?: boolean;
  Icon?: PhosphorIcons;
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    data?: unknown,
  ) => void;
}[];

export type DropdownProps = {
  values: DropdownValues;
  children: React.ReactElement;
  data?: unknown;
};

const Dropdown = function ({ children, values, data }: DropdownProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const dropdownContentRef = useRef<HTMLDivElement | null>(null);

  const ToggleDropdown = function () {
    setDropdownOpen(!dropdownOpen);
    return;
  };

  useEffect(
    function () {
      if (!dropdownOpen || !dropdownContentRef.current) return;
      const dropdownEl = dropdownContentRef.current;
      const rect = dropdownEl.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        dropdownEl.style.left = "auto";
        dropdownEl.style.right = "0";
      }
      if (rect.bottom > window.innerHeight) {
        const wrapper = wrapperRef.current?.firstElementChild;
        const wrapperRect = wrapper?.getBoundingClientRect();
        dropdownEl.style.top = "auto";
        dropdownEl.style.bottom = `${window.innerHeight - (wrapperRect?.top || 0)}px`;
      }
      return;
    },
    [dropdownOpen],
  );

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
    <div ref={dropdownRef} className="dropdown">
      <div ref={wrapperRef} onClick={ToggleDropdown}>
        {children}
      </div>
      <div
        ref={dropdownContentRef}
        className={`dropdownContent ${dropdownOpen ? "dropdownContentOpen" : ""}`}
      >
        {values.map(function ({ id, label, Icon, disabled, onClick }) {
          const onClickWithClose = function (
            event: React.MouseEvent<HTMLButtonElement>,
          ) {
            onClick?.(event, data);
            setDropdownOpen(false);
            return;
          };
          return (
            <button
              key={id}
              disabled={disabled}
              onClick={onClickWithClose}
              className="dropdownContentOption"
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
