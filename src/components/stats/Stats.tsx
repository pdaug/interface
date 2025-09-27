import { Icon as IconPhosphor } from "@phosphor-icons/react";

// styles
import "./Stats.css";

export type StatsStatus = "Up" | "Down";

export type StatsIconCategories = "Success" | "Info" | "Warning" | "Danger";

export type StatsProps = {
  loading?: boolean;
  hidden?: boolean;
  Icon?: IconPhosphor;
  category?: StatsIconCategories;
  title: string;
  metric?: number;
  metricStatus?: StatsStatus;
  metricLocale?: Intl.LocalesArgument;
  metricOptions?: Intl.NumberFormatOptions;
  value: number;
  valueUnit?: string;
  valueLocale?: Intl.LocalesArgument;
  valueOptions?: Intl.NumberFormatOptions;
  footer?: string | React.ReactNode;
  styles?: React.CSSProperties;
  stylesContainer?: React.CSSProperties;
};

const Stats = function ({
  loading,
  hidden,
  Icon,
  category,
  title,
  metric,
  metricStatus,
  metricLocale,
  metricOptions,
  value,
  valueUnit,
  valueLocale,
  valueOptions,
  footer,
  styles,
  stylesContainer,
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
      <div className="statsContainer" style={stylesContainer}>
        {Icon && (
          <div
            className={`statsIcon ${category ? `statsIcon${category}` : ""}`}
          >
            <Icon size={24} />
          </div>
        )}
        <div className="statsContent">
          <div className="statsHead">
            <div className="statsHeadTitle">{title}</div>
            {metricFormatted && (
              <div className={`statsHeadMetric statsHeadMetric${metricStatus}`}>
                {metricStatus ? (metricStatus === "Up" ? "+" : "-") : ""}
                {metricFormatted}
              </div>
            )}
          </div>
          <div
            className={`statsBody ${category ? `statsBody${category}` : ""}`}
          >
            {loading || hidden ? "- - -" : valueFormatted} {valueUnit}
          </div>
          {footer && (
            <div className="statsFooter">
              <span>{footer}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stats;
