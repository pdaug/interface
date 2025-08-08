import { forwardRef } from "react";

// styles
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

const Horizontal = forwardRef<HTMLDivElement, AlignElementProps>(function (
  { external, internal, styles, className, children, onClick },
  ref,
) {
  const style = {
    gap: `${internal}rem`,
    margin: `${external}rem`,
    ...styles,
  };
  return (
    <div
      ref={ref}
      style={style}
      onClick={onClick}
      className={`alignHorizontal ${className || ""}`}
    >
      {children}
    </div>
  );
});

Horizontal.displayName = "Horizontal";

export { Center, Vertical, Horizontal };
