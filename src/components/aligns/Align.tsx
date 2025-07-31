import "./Align.css";

export type AlignCenterProps = {
  children: React.ReactNode;
};

const Center = function ({ children }: AlignCenterProps) {
  return <div className="alignCenter">{children}</div>;
};

export type AlignElementProps = {
  external?: number;
  internal?: number;
  styles?: React.CSSProperties;
  children: React.ReactNode;
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
