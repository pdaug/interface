// components
import Stats from "./Stats";

const StatsTest = function () {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>Stats</div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Stats
          title="Inflow Sales"
          metric={0.1}
          metricStatus="up"
          metricLocale="en-US"
          metricOptions={{
            style: "percent",
            minimumFractionDigits: 2,
          }}
          value={1000}
          valueLocale="en-US"
          valueOptions={{
            currency: "USD",
            style: "currency",
            minimumFractionDigits: 2,
          }}
        />

        <Stats
          title="Outflow Monthly"
          metric={0.1}
          metricStatus="down"
          metricLocale="en-US"
          metricOptions={{
            style: "percent",
            minimumFractionDigits: 2,
          }}
          value={500}
          valueLocale="pt-BR"
          valueOptions={{
            currency: "BRL",
            style: "currency",
            minimumFractionDigits: 2,
          }}
        />

        <Stats
          title="Distance"
          metric={0.1}
          metricStatus="up"
          metricLocale="en-US"
          metricOptions={{
            style: "percent",
            minimumFractionDigits: 2,
          }}
          value={120}
          valueLocale="en-US"
          valueUnit="km"
          valueOptions={{
            minimumFractionDigits: 2,
          }}
        />

        <Stats
          title="Temperature"
          metric={0.6405}
          metricStatus="up"
          metricLocale="en-US"
          metricOptions={{
            style: "percent",
            minimumFractionDigits: 2,
          }}
          value={24.5}
          valueUnit="ºC"
          valueLocale="en-US"
          valueOptions={{
            minimumFractionDigits: 2,
          }}
        />
      </div>
    </div>
  );
};

export default StatsTest;
