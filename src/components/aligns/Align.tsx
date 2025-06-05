import "./Align.css";

export type AlignProps = {
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
}: AlignProps) {
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
}: AlignProps) {
  const style = { gap: `${internal}rem`, margin: `${external}rem`, ...styles };
  return (
    <div className="alignHorizontal" style={style}>
      {children}
    </div>
  );
};

export { Vertical, Horizontal };
