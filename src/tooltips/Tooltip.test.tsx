// components
import Tooltip from "./Tooltip";

export type TooltipTestElementProps = {
  text: string;
};

const TooltipTestElement = function ({ text }: TooltipTestElementProps) {
  return (
    <div
      style={{
        alignItems: "center",
        background: "var(--border-light)",
        borderRadius: "var(--rounded)",
        display: "flex",
        height: 120,
        justifyContent: "center",
        padding: "4px 1rem",
        width: 120,
      }}
    >
      {text}
    </div>
  );
};
const TooltipTest = function () {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>Tooltip</div>
      <div style={{ display: "flex", gap: "2rem" }}>
        <Tooltip content="Content" position="top" theme="dark">
          <TooltipTestElement text="Tooltip Dark" />
        </Tooltip>
        <Tooltip
          width={300}
          position="top"
          content="Praesent volutpat leo et libero aliquet, ornare viverra nibh fringilla. Curabitur sed nisi vel turpis consequat pellentesque. Curabitur consequat tortor at tristique mollis. Sed quis velit ut dui cursus suscipit quis in erat. Morbi blandit felis eget lectus condimentum facilisis. Etiam facilisis metus et venenatis lacinia. Nulla finibus nisi ut egestas convallis. Vivamus eget placerat turpis."
        >
          <TooltipTestElement text="Tooltip Width" />
        </Tooltip>
        <Tooltip content="Content" position="top">
          <TooltipTestElement text="Tooltip Top" />
        </Tooltip>
        <Tooltip content="Content" position="bottom">
          <TooltipTestElement text="Tooltip Bottom" />
        </Tooltip>
        <Tooltip content="Content" position="left">
          <TooltipTestElement text="Tooltip Left" />
        </Tooltip>
        <Tooltip content="Content" position="right">
          <TooltipTestElement text="Tooltip Right" />
        </Tooltip>
      </div>
    </div>
  );
};

export default TooltipTest;
