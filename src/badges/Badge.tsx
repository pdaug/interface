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
  id?: string;
  name?: string;
  value: string;
  category: BadgeCategories;
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
  onChange,
}: BadgeProps) {
  return options && options.length > 0 ? (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className={`fz-badge fz-badge-${category}`}
    >
      {options.map(function ({ id, value, label }, index) {
        return (
          <option key={`fz-badge-option-${index}-${id}`} id={id} value={value}>
            {label}
          </option>
        );
      })}
    </select>
  ) : (
    <div id={id} className={`fz-badge fz-badge-${category}`}>
      <span>{value || "badge_empty_text"}</span>
    </div>
  );
};

export default Badge;
