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
  styles?: React.CSSProperties;
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
  styles,
}: StatsProps) {
  const metricFormatted = metric
    ? new Intl.NumberFormat(metricLocale, metricOptions).format(metric)
    : "";

  const valueFormatted = new Intl.NumberFormat(
    valueLocale,
    valueOptions,
  ).format(value);

  return (
    <div className="stats" style={styles}>
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
