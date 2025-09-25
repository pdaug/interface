import {
  Bar,
  BarChart,
  CartesianGrid,
  CartesianGridProps,
  Cell,
  LegendProps,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  TooltipProps,
  XAxis,
  XAxisProps,
  YAxis,
  YAxisProps,
} from "recharts";
import { useState } from "react";
import { LayoutType, Margin } from "recharts/types/util/types";

// styles
import "./Chart.css";

const ChartTooltip = function (props: TooltipProps<string, string>) {
  return (
    <div className="chartTooltip">
      <div className="chartTooltipTitle">{props.label}</div>
      <div className="chartTooltipContent">
        {props?.payload?.map(function (payload, index) {
          return (
            <div className="chartTooltipPayload" key={`payload-${index}`}>
              <div
                style={{ background: payload?.stroke || payload?.fill }}
                className="chartTooltipPayloadColor"
              ></div>
              <div className="chartTooltipPayloadName">{payload?.name}</div>
              <div className="chartTooltipPayloadValue">{payload?.value}</div>
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
    name?: string;
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
    <div className="chartContainer">
      <ResponsiveContainer width={width} minWidth={320} height={height}>
        <LineChart data={data} margin={margin} layout={layout}>
          <CartesianGrid {...gridProps} />
          <XAxis {...axisXProps} />
          <YAxis {...axisYProps} />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#dedede" }} />

          <defs>
            {lines?.map((lineProps, index) => (
              <linearGradient
                key={index}
                id={`gradient-${index}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={lineProps.stroke}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={lineProps.stroke}
                  stopOpacity={0}
                />
              </linearGradient>
            ))}
          </defs>

          {lines?.map(function (lineProps, index) {
            return (
              <Line
                key={`chart-line-${index}`}
                {...lineProps}
                strokeDasharray="none"
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
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
    radius?: [number, number, number, number];
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
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "#ebebeb" }} />
        {bars?.map(function (barsProps, index) {
          return <Bar key={`chart-bar-${index}`} {...barsProps} />;
        })}
      </BarChart>
    </ResponsiveContainer>
  );
};

export type ChartPieProps = ChartProps & {
  pie: {
    label?: boolean;
    cx?: number | string;
    cy?: number | string;
    innerRadius: number;
    outerRadius: number;
    paddingAngle: number;
    dataKey: string;
    pieces: {
      fill: string;
    }[];
  };
};

const ChartPie = function ({
  // container
  width = "100%",
  height = 480,
  // chart
  data,
  layout = "horizontal",
  margin = { top: 5, right: 5, left: 0, bottom: 5 },
  pie,
}: ChartPieProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <ResponsiveContainer width={width} height={height}>
      <PieChart data={data} margin={margin} layout={layout}>
        <Pie
          data={data}
          cx={pie?.cx || "50%"}
          cy={pie?.cy || "50%"}
          dataKey={pie.dataKey}
          {...(pie.label
            ? {
                activeIndex: activeIndex,
                activeShape: function (props: Record<string, any>) {
                  console.log(props);
                  return (
                    <g>
                      <Sector
                        cx={props.cx}
                        cy={props.cy}
                        innerRadius={props.innerRadius - 10}
                        outerRadius={props.outerRadius}
                        startAngle={props.startAngle}
                        endAngle={props.endAngle}
                        fill={props.fill}
                      />
                      <text
                        dy={8}
                        x={props.cx}
                        y={props.cy + 10}
                        fontSize={20}
                        fontWeight="bold"
                        fill={props.fill}
                        textAnchor="middle"
                      >
                        {props.payload.value}
                      </text>
                      <text
                        dy={8}
                        x={props.cx}
                        y={props.cy - 10}
                        fontSize={20}
                        fontWeight="bold"
                        fill={props.fill}
                        textAnchor="middle"
                      >
                        {props.payload.date}
                      </text>
                    </g>
                  );
                },
                onMouseEnter: (_, index) => setActiveIndex(index),
              }
            : {})}
          innerRadius={pie.innerRadius}
          outerRadius={pie.outerRadius}
          paddingAngle={pie.paddingAngle}
        >
          {pie.pieces?.map(function (pieceProps, index) {
            return <Cell key={`cell-${index}`} fill={pieceProps.fill} />;
          })}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export { ChartLine, ChartBar, ChartPie };
