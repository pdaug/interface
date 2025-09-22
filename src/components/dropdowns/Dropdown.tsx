import React, { useEffect, useRef, useState } from "react";
import { IconWeight, Icon as PhosphorIcons } from "@phosphor-icons/react";

// styles
import "./Dropdown.css";

export type DropdownValue = {
  id: string;
  label: string;
  hidden?: boolean | ((data: unknown) => boolean);
  styles?: React.CSSProperties;
  disabled?: boolean;
  Icon?: PhosphorIcons;
  IconColor?: string;
  IconWeight?: IconWeight;
  onClick?:
    | (() => void)
    | ((
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        data?: unknown,
      ) => void);
};

export type DropdownProps = {
  values: DropdownValue[];
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

  // on scroll
  useEffect(function () {
    const OnScroll = function () {
      setDropdownOpen(false);
      return;
    };
    window.addEventListener("wheel", OnScroll);
    OnScroll();
    return function () {
      window.removeEventListener("wheel", OnScroll);
      return;
    };
  }, []);

  // position dropdown
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

  // close auto dropdown
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
        {values.map(function ({
          id,
          label,
          styles,
          Icon,
          IconColor,
          IconWeight,
          disabled,
          hidden,
          onClick,
        }) {
          const onClickWithClose = function (
            event: React.MouseEvent<HTMLButtonElement>,
          ) {
            onClick?.(event, data);
            setDropdownOpen(false);
            return;
          };
          if (typeof hidden === "function" ? hidden(data) : hidden) return null;
          return (
            <button
              key={id}
              disabled={disabled}
              onClick={onClickWithClose}
              className="dropdownContentOption"
              style={styles}
            >
              {Icon && (
                <Icon
                  size={16}
                  color={IconColor || "var(--textColor)"}
                  weight={IconWeight}
                />
              )}
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Dropdown;
