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
};

const Vertical = function ({
  external,
  internal,
  styles,
  children,
}: AlignElementProps) {
  const style = { gap: `${internal}rem`, margin: `${external}rem`, ...styles };
  return (
    <div className="alignVertical" style={style}>
      {children}
    </div>
  );
};

const Horizontal = function ({
  external,
  internal,
  styles,
  children,
}: AlignElementProps) {
  const style = { gap: `${internal}rem`, margin: `${external}rem`, ...styles };
  return (
    <div className="alignHorizontal" style={style}>
      {children}
    </div>
  );
};

export { Center, Vertical, Horizontal };
