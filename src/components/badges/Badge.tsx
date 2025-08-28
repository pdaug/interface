// styles
import "./Badge.css";

export const BadgeCategoriesList = [
  "Success",
  "Info",
  "Warning",
  "Danger",
  "Neutral",
] as const;

export type BadgeCategories = (typeof BadgeCategoriesList)[number];

export type BadgeDropdowns = {
  id: string;
  label: string;
  onClick?: React.EventHandler<React.MouseEvent<HTMLButtonElement>>;
}[];

export type BadgeProps = {
  id?: string;
  name?: string;
  value: string;
  category: BadgeCategories;
  styles?: React.CSSProperties;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  options?: {
    id: string;
    value: string;
    label: string;
  }[];
};

const Badge = function ({
  id,
  name,
  value,
  options,
  category,
  styles,
  onChange,
}: BadgeProps) {
  return options && options.length > 0 ? (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      style={{ ...styles, cursor: "pointer" }}
      className={`badge badge${category}`}
    >
      {options.map(function ({ id, value, label }) {
        return (
          <option key={id} id={id} value={value}>
            {label}
          </option>
        );
      })}
    </select>
  ) : (
    <div id={id} className={`badge badge${category}`} style={styles}>
      <span>{value || "badge_empty_text"}</span>
    </div>
  );
};

export default Badge;
