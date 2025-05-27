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
  text?: React.ReactNode;
  category: BadgeCategories;
  options?: {
    id: string;
    value: string;
    label: string;
  }[];
};

const Badge = function ({ id, name, text, category, options }: BadgeProps) {
  return options && options.length > 0 ? (
    <select id={id} name={name} className={`fz-badge fz-badge-${category}`}>
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
      <span>{text || "badge_empty_text"}</span>
    </div>
  );
};

export default Badge;
