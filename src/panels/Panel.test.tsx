// components
import Panel from "./Panel";

const PanelTest = function () {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>Panel</div>
      <div style={{ alignItems: "flex-start", display: "flex", gap: "1rem" }}>
        <Panel title="Lorem ipsum dolor sit amet">
          <span>Children</span>
        </Panel>

        <Panel
          title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent semper tincidunt arcu, vitae imperdiet ligula ornare in. Vestibulum eu dapibus arcu, et scelerisque sem."
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        >
          <span>Children</span>
        </Panel>
      </div>
    </div>
  );
};

export default PanelTest;
