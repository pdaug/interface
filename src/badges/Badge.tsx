import { useEffect, useRef, useState } from "react";

// styles
import "./Badge.css";

export type BadgeCategories =
  | "primary"
  | "secondary"
  | "danger"
  | "warn"
  | "neutral";

export type BadgeDropdowns = {
  id: string;
  label: string;
  onClick?: React.EventHandler<React.MouseEvent<HTMLButtonElement>>;
}[];

export type BadgeProps = {
  text: React.ReactNode;
  category: BadgeCategories;
  id?: string;
  style?: React.CSSProperties;
  styleText?: React.CSSProperties;
  dropdown?: BadgeDropdowns;
};

const Badge = function ({
  text,
  category,
  id,
  style,
  styleText,
  dropdown,
}: BadgeProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const badgeDropdownRef = useRef<HTMLDivElement | null>(null);

  const ToggleDropdown = function () {
    setDropdownOpen(!dropdownOpen);
    return;
  };

  const BadgeBase = (
    <div
      id={id}
      style={style}
      className={`fadeui-badge fadeui-badge-${category}`}
    >
      <span style={styleText}>{text}</span>
    </div>
  );

  useEffect(function () {
    const HandleClickButton = function (event: MouseEvent) {
      if (
        event.target &&
        badgeDropdownRef.current &&
        !badgeDropdownRef.current.contains(event.target as Node)
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
    <div
      ref={badgeDropdownRef}
      onClick={ToggleDropdown}
      className="fadeui-badge-dropdown"
    >
      {BadgeBase}
      <div
        style={{ display: dropdownOpen ? "flex" : "none" }}
        className="fadeui-badge-dropdown-content"
      >
        {dropdown.map(function ({ id, label, onClick }) {
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
              onClick={onClickWithClose}
              className="fadeui-badge-dropdown-content-option"
            >
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  ) : (
    BadgeBase
  );
};

export default Badge;
