// styles
import "./Badge.css";

export type BadgeCategories =
  | "primary"
  | "secondary"
  | "danger"
  | "warn"
  | "neutral";

export type BadgeProps = {
  text: React.ReactNode;
  category: BadgeCategories;
  id?: string;
  style?: React.CSSProperties;
  styleText?: React.CSSProperties;
};

const Badge = function ({ text, category, id, style, styleText }: BadgeProps) {
  return (
    <div
      id={id}
      style={style}
      className={`baseui-badge baseui-badge-${category}`}
    >
      <span style={styleText}>{text}</span>
    </div>
  );
};

export default Badge;
