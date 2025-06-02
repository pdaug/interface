import {
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

const ChartTooltip = function (props: unknown) {
  console.log(props);
  return <div className="fz-chart-tooltip"></div>;
};

export type ChartLineData = {
  [key: string]: number | string;
};

export type ChartLineProps = {
  // container
  width?: string | number;
  height?: string | number;
  // chart
  data: ChartLineData[];
  margin?: Margin;
  layout?: LayoutType;
  lines: {
    dataKey: string;
    type?: Line["props"]["type"];
    dot?: object;
    label?: string;
    stroke?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
    unit?: number;
  }[];
  // others props
  gridProps?: CartesianGridProps;
  axisXProps?: XAxisProps;
  axisYProps?: YAxisProps;
  tooltipProps?: TooltipProps<"name", "value">;
  legendProps?: LegendProps;
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

export { ChartLine };
