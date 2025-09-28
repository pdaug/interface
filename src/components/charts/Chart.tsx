import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  CartesianGridProps,
  Cell,
  Label,
  Legend,
  LegendProps,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  XAxisProps,
  YAxis,
  YAxisProps,
} from "recharts";
import { LayoutType, Margin } from "recharts/types/util/types";
import { Payload } from "recharts/types/component/DefaultTooltipContent";

// styles
import "./Chart.css";

const RADIAN = Math.PI / 180;

const ChartTooltip = function (props: TooltipProps<string, string>) {
  return (
    <div className="chartTooltip">
      {props?.label && <div className="chartTooltipTitle">{props.label}</div>}
      <div className="chartTooltipContent">
        {props?.payload?.map(function (payload, index) {
          const name = payload?.name || payload?.payload?.name;
          const value =
            typeof payload?.value === "number"
              ? payload?.value
              : payload?.payload?.value || 0;
          return (
            <div className="chartTooltipPayload" key={`payload-${index}`}>
              <div
                style={{
                  background:
                    payload?.stroke || payload?.fill || payload?.payload?.fill,
                }}
                className="chartTooltipPayloadColor"
              ></div>
              {name && (
                <div className="chartTooltipPayloadName">
                  {payload?.name || payload?.payload?.name}
                </div>
              )}
              {typeof value === "number" && (
                <div className="chartTooltipPayloadValue">
                  {typeof payload?.formatter === "function"
                    ? payload?.formatter(
                        String(value),
                        payload.name as string,
                        payload,
                        index,
                        payload as unknown as Payload<string, string>[],
                      )
                    : value}
                </div>
              )}
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
  id: string;
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
    formatter?: (value: number) => string;
  }[];
};

const ChartLine = function ({
  id,
  // container
  width = "100%",
  height = 480,
  // chart
  data,
  layout = "horizontal",
  margin = { top: 10, right: 10, left: 10, bottom: 10 },
  lines,
  // others props
  gridProps,
  axisXProps,
  axisYProps,
}: ChartLineProps) {
  return (
    <div className="chartContainer">
      <ResponsiveContainer width={width} minWidth={320} height={height}>
        <AreaChart data={data} margin={margin} layout={layout}>
          <CartesianGrid {...gridProps} />
          <XAxis {...axisXProps} />
          <YAxis {...axisYProps} />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#dedede" }} />

          <defs>
            {lines?.map((lineProps, index) => (
              <linearGradient
                key={index}
                id={`gradient-${id}-${index}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="25%"
                  stopColor={lineProps.stroke}
                  stopOpacity={0.2}
                />
                <stop
                  offset="100%"
                  stopColor={lineProps.stroke}
                  stopOpacity={0}
                />
              </linearGradient>
            ))}
          </defs>

          {lines?.map(function (lineProps, index) {
            return (
              <Area
                key={`chart-line-${id}-${index}`}
                fill={`url(#gradient-${id}-${index})`}
                {...lineProps}
                strokeDasharray="none"
              />
            );
          })}
        </AreaChart>
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
    innerRadius: number | string;
    outerRadius: number | string;
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
  const total = data.reduce((acc, cur) => acc + Number(cur?.value) || 0, 0);

  return (
    <ResponsiveContainer width={width} height={height}>
      <PieChart data={data} margin={margin} layout={layout}>
        <Pie
          labelLine={false}
          label={function ({
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            percent,
          }: Record<string, number>) {
            const radius = innerRadius + (outerRadius - innerRadius) * 0.3;
            const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
            const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

            return percent !== 0 ? (
              <text
                x={x}
                y={y}
                fill="white"
                dominantBaseline="central"
                textAnchor={x > cx ? "start" : "end"}
                style={{ fontSize: "var(--textSmall)" }}
              >
                {`${((percent ?? 1) * 100).toFixed(0)}%`}
              </text>
            ) : null;
          }}
          data={data}
          innerRadius={pie.innerRadius}
          outerRadius={pie.outerRadius}
          paddingAngle={pie.paddingAngle}
          cx={pie?.cx || "50%"}
          cy={pie?.cy || "50%"}
          dataKey={pie.dataKey}
        >
          {pie.pieces?.map(function (pieceProps, index) {
            return <Cell key={`cell-${index}`} fill={pieceProps.fill} />;
          })}

          <Label
            value={total}
            fill="var(--textColor)"
            position="center"
            style={{
              color: "var(--textColor)",
              fontSize: "var(--textTitle)",
              fontWeight: "bold",
            }}
          />
        </Pie>

        <Tooltip content={<ChartTooltip />} cursor={{ fill: "#ebebeb" }} />

        <Legend
          align="right"
          layout="vertical"
          verticalAlign="middle"
          content={function ({ payload }) {
            return (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {payload?.map((entry, index) => (
                  <li
                    key={`item-${index}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 4,
                      fontSize: "var(--textSmall)",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: 12,
                        height: 12,
                        backgroundColor: entry.color,
                        marginRight: 8,
                        borderRadius: "50%",
                      }}
                    />
                    {data[index].value} - {entry.value}
                  </li>
                ))}
              </ul>
            );
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export { ChartLine, ChartBar, ChartPie };
