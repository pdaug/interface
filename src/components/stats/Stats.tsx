// styles
import "./Stats.css";

export type StatsStatus = "Up" | "Down";

export type StatsProps = {
  title: string;
  metric?: number;
  metricStatus?: StatsStatus;
  metricLocale?: Intl.LocalesArgument;
  metricOptions?: Intl.NumberFormatOptions;
  value: number;
  valueUnit?: string;
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
  valueUnit,
  valueLocale,
  valueOptions,
}: StatsProps) {
  const metricFormatted = metric
    ? new Intl.NumberFormat(metricLocale, metricOptions).format(metric)
    : "";

  const valueFormatted = new Intl.NumberFormat(
    valueLocale,
    valueOptions,
  ).format(value);

  return (
    <div className="stats">
      <div className="statsHead">
        <div className="statsHeadTitle">{title}</div>
        {metricFormatted && (
          <div className={`statsHeadMetric statsHeadMetric${metricStatus}`}>
            {metricStatus ? (metricStatus === "Up" ? "+" : "-") : ""}
            {metricFormatted}
          </div>
        )}
      </div>
      <div className="statsBody">
        {valueFormatted} {valueUnit}
      </div>
    </div>
  );
};

export default Stats;
