// components
import Stats from "./Stats";

const StatsTest = function () {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>Stats</div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Stats
          title="Total Subscribers"
          metric={0.0802}
          metricStatus="down"
          metricLocale="en-US"
          metricOptions={{
            style: "percent",
            minimumFractionDigits: 2,
          }}
          value={4}
          valueLocale="en-US"
          valueOptions={{
            currency: "USD",
            style: "currency",
            minimumFractionDigits: 2,
          }}
        />

        <Stats
          title="Average Open Rate"
          metric={0.1603}
          metricStatus="up"
          metricLocale="en-US"
          metricOptions={{
            style: "percent",
            minimumFractionDigits: 2,
          }}
          value={834.22}
          valueLocale="pt-BR"
          valueOptions={{
            currency: "BRL",
            style: "currency",
            minimumFractionDigits: 2,
          }}
        />

        <Stats
          title="Average Click Rate"
          metric={0.3204}
          metricStatus="down"
          metricLocale="en-US"
          metricOptions={{
            style: "percent",
            minimumFractionDigits: 2,
          }}
          value={10}
          valueLocale="en-US"
          valueOptions={{
            currency: "EUR",
            style: "currency",
            minimumFractionDigits: 2,
          }}
        />

        <Stats
          title="Reais"
          metric={0.6405}
          metricStatus="up"
          metricLocale="en-US"
          metricOptions={{
            style: "percent",
            minimumFractionDigits: 2,
          }}
          value={1234}
          valueLocale="en-US"
          valueOptions={{
            currency: "USD",
            style: "currency",
            minimumFractionDigits: 2,
          }}
        />
      </div>
    </div>
  );
};

export default StatsTest;
