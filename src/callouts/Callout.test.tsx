import {
  CheckCircle,
  Info,
  Warning,
  WarningOctagon,
} from "@phosphor-icons/react";

// components
import Callout from "./Callout";

const CalloutTest = function () {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>Callout</div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Callout
          category="primary"
          Icon={CheckCircle}
          IconSize={20}
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas et ligula sit amet tortor dapibus tempus ac et augue."
        />
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Callout
          category="secondary"
          Icon={Info}
          IconSize={20}
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas et ligula sit amet tortor dapibus tempus ac et augue."
        />
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Callout
          category="warn"
          Icon={Warning}
          IconSize={20}
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas et ligula sit amet tortor dapibus tempus ac et augue."
        />
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Callout
          category="danger"
          Icon={WarningOctagon}
          IconSize={20}
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas et ligula sit amet tortor dapibus tempus ac et augue."
        />
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Callout
          category="neutral"
          IconSize={20}
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas et ligula sit amet tortor dapibus tempus ac et augue."
        />
      </div>
    </div>
  );
};

export default CalloutTest;
