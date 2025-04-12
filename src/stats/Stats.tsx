// styles
import "./Stats.css";

export type StatsStatus = "up" | "down";

export type StatsProps = {
  title: string;
  metric: number;
  metricStatus: StatsStatus;
  metricLocale?: Intl.LocalesArgument;
  metricOptions?: Intl.NumberFormatOptions;
  value: number;
  valueLocale?: Intl.LocalesArgument;
  valueOptions?: Intl.NumberFormatOptions;
};

const Stats = function ({
  title,
  metric,
  metricStatus,
  metricLocale,
  metricOptions,
  value,
  valueLocale,
  valueOptions,
}: StatsProps) {
  const metricFormatted = new Intl.NumberFormat(
    metricLocale,
    metricOptions,
  ).format(metric);

  const valueFormatted = new Intl.NumberFormat(
    valueLocale,
    valueOptions,
  ).format(value);

  return (
    <div className="baseui-stats">
      <div className="baseui-stats-head">
        <div className="baseui-stats-head-title">{title}</div>
        <div
          className={`baseui-stats-head-metric baseui-stats-head-metric-${metricStatus}`}
        >
          {metricStatus === "up" ? "+" : "-"}
          {metricFormatted}
        </div>
      </div>
      <div className="baseui-stats-body">{valueFormatted}</div>
    </div>
  );
};

export default Stats;
