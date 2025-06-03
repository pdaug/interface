import {
  Bar,
  BarChart,
  CartesianGrid,
  CartesianGridProps,
  LegendProps,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  XAxisProps,
  YAxis,
  YAxisProps,
} from "recharts";
import { LayoutType, Margin } from "recharts/types/util/types";

// styles
import "./Chart.css";

const ChartTooltip = function (props: TooltipProps<string, string>) {
  return (
    <div className="fz-chart-tooltip">
      <div className="fz-chart-tooltip-title">{props.label}</div>
      <div className="fz-chart-tooltip-content">
        {props?.payload?.map(function (payload, index) {
          return (
            <div className="fz-chart-tooltip-payload" key={`payload-${index}`}>
              <div
                style={{ background: payload?.stroke }}
                className="fz-chart-tooltip-payload-square"
              ></div>
              <div className="fz-chart-tooltip-payload-name">
                {payload?.name}
              </div>
              <div className="fz-chart-tooltip-payload-value">
                {payload?.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export type ChartData = {
  [key: string]: number | string;
};

export type ChartProps = {
  // container
  width?: string | number;
  height?: string | number;
  // chart
  data: ChartData[];
  margin?: Margin;
  layout?: LayoutType;
  // elements
  gridProps?: CartesianGridProps;
  axisXProps?: XAxisProps;
  axisYProps?: YAxisProps;
  tooltipProps?: TooltipProps<"name", "value">;
  legendProps?: LegendProps;
};

export type ChartLineProps = ChartProps & {
  lines: {
    dataKey: string;
    type?: Line["props"]["type"];
    dot?: object | boolean;
    label?: string;
    stroke?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
    unit?: number;
  }[];
};

const ChartLine = function ({
  // container
  width = "100%",
  height = 480,
  // chart
  data,
  layout = "horizontal",
  margin = { top: 5, right: 5, left: 0, bottom: 5 },
  lines,
  // others props
  gridProps,
  axisXProps,
  axisYProps,
}: ChartLineProps) {
  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={data} margin={margin} layout={layout}>
        <CartesianGrid {...gridProps} />
        <XAxis {...axisXProps} />
        <YAxis {...axisYProps} />
        <Tooltip content={<ChartTooltip />} />
        {lines?.map(function (lineProps, index) {
          return <Line key={`chart-line-${index}`} {...lineProps} />;
        })}
      </LineChart>
    </ResponsiveContainer>
  );
};

export type ChartBarProps = ChartProps & {
  bars: {
    layout?: Bar["props"]["layout"];
    dataKey: string;
    label?: string;
    barSize?: number;
    barSizeMax?: number;
    fill?: string;
    stackId?: string;
  }[];
};

const ChartBar = function ({
  // container
  width = "100%",
  height = 480,
  // chart
  data,
  layout = "horizontal",
  margin = { top: 5, right: 5, left: 0, bottom: 5 },
  bars,
  // others props
  gridProps,
  axisXProps,
  axisYProps,
}: ChartBarProps) {
  return (
    <ResponsiveContainer width={width} height={height}>
      <BarChart data={data} margin={margin} layout={layout}>
        <CartesianGrid {...gridProps} />
        <XAxis {...axisXProps} />
        <YAxis {...axisYProps} />
        <Tooltip content={<ChartTooltip />} />
        {bars?.map(function (barsProps, index) {
          return <Bar key={`chart-bar-${index}`} {...barsProps} />;
        })}
      </BarChart>
    </ResponsiveContainer>
  );
};

export { ChartLine, ChartBar };
