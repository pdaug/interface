import "./Align.css";

export type AlignCenterProps = {
  styles?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
};

const Center = function ({ children, styles, className }: AlignCenterProps) {
  return (
    <div className={`alignCenter ${className || ""}`} style={styles}>
      {children}
    </div>
  );
};

export type AlignElementProps = {
  external?: number;
  internal?: number;
  children: React.ReactNode;
  styles?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
};

const Vertical = function ({
  external,
  internal,
  styles,
  className,
  children,
  onClick,
}: AlignElementProps) {
  const style = { gap: `${internal}rem`, margin: `${external}rem`, ...styles };
  return (
    <div
      className={`alignVertical ${className || ""}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const Horizontal = function ({
  external,
  internal,
  styles,
  className,
  children,
  onClick,
}: AlignElementProps) {
  const style = { gap: `${internal}rem`, margin: `${external}rem`, ...styles };
  return (
    <div
      className={`alignHorizontal ${className || ""}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export { Center, Vertical, Horizontal };
