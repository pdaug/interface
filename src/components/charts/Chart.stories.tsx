import type { StoryObj } from "@storybook/react";

import { ChartBar, ChartLine } from "./Chart";
import Wrapper from "../wrapper/Wrapper";
import { Horizontal } from "../aligns/Align";

export default {
  title: "Components/Chart",
  tags: ["autodocs"],
};

export const Line: StoryObj = {
  render: () => {
    return (
      <Horizontal internal={1} styles={{ width: "70rem" }}>
        <Wrapper title="Chart Line Basic">
          <ChartLine
            height={320}
            gridProps={{
              stroke: "#dedede",
              horizontal: true,
              vertical: false,
            }}
            lines={[
              {
                dot: false,
                type: "monotone",
                dataKey: "customer",
                stroke: "#22c55e",
                strokeDasharray: "1",
                strokeWidth: 4,
              },
            ]}
            axisXProps={{
              stroke: "",
              strokeWidth: 0,
              dataKey: "weekday",
              tick: { fontSize: 10, fill: "#222" },
              interval: 0,
              padding: { left: 10, right: 10 },
            }}
            axisYProps={{
              tick: { fontSize: 0, fill: "#222" },
              stroke: "",
              strokeWidth: 0,
              width: 5,
            }}
            data={[
              { weekday: "Mon", customer: 5 },
              { weekday: "Tue", customer: 13 },
              { weekday: "Wed", customer: 20 },
              { weekday: "Thu", customer: 20 },
              { weekday: "Fri", customer: 25 },
              { weekday: "Sat", customer: 6 },
              { weekday: "Sun", customer: 0 },
            ]}
          />
        </Wrapper>
        <Wrapper title="Chart Line Full">
          <ChartLine
            height={320}
            gridProps={{
              stroke: "#dedede",
              strokeWidth: 1,
              vertical: false,
              horizontal: true,
            }}
            lines={[
              {
                type: "monotone",
                dataKey: "temperature",
                stroke: "#22c55e",
                strokeDasharray: "1",
                strokeWidth: 4,
                dot: false,
              },
              {
                type: "monotone",
                dataKey: "humidity",
                stroke: "#0ea5e9",
                strokeDasharray: "1",
                strokeWidth: 4,
                dot: false,
              },
            ]}
            axisXProps={{
              angle: 20,
              stroke: "#bebebe",
              strokeWidth: 1,
              dataKey: "time",
              tick: { fontSize: 10, fill: "#222" },
              interval: 0,
              padding: { left: 10, right: 10 },
            }}
            axisYProps={{
              tick: { fontSize: 10, fill: "#222" },
              stroke: "",
              strokeWidth: 0,
              width: 24,
            }}
            data={[
              { time: "06:00", temperature: 9, humidity: 50 },
              { time: "07:00", temperature: 10, humidity: 48 },
              { time: "08:00", temperature: 15, humidity: 48 },
              { time: "09:00", temperature: 18, humidity: 44 },
              { time: "10:00", temperature: 21, humidity: 40 },
              { time: "11:00", temperature: 21, humidity: 40 },
              { time: "12:00", temperature: 25, humidity: 40 },
              { time: "13:00", temperature: 25, humidity: 40 },
              { time: "14:00", temperature: 25, humidity: 40 },
              { time: "15:00", temperature: 25, humidity: 41 },
              { time: "16:00", temperature: 22, humidity: 42 },
              { time: "17:00", temperature: 21, humidity: 47 },
              { time: "18:00", temperature: 20, humidity: 51 },
            ]}
          />
        </Wrapper>
      </Horizontal>
    );
  },
};

export const Bar: StoryObj = {
  render: () => {
    return (
      <Horizontal internal={1} styles={{ width: "30rem" }}>
        <Wrapper title="Chart Bar">
          <ChartBar
            height={400}
            gridProps={{
              stroke: "#dedede",
              strokeWidth: 1,
              strokeDasharray: "8 8",
            }}
            bars={[
              {
                dataKey: "temperature",
                fill: "#22c55e",
              },
              {
                dataKey: "humidity",
                fill: "#0ea5e9",
              },
            ]}
            axisXProps={{
              angle: 20,
              stroke: "#bebebe",
              strokeWidth: 1,
              dataKey: "name",
              tick: { fontSize: 10, fill: "#222" },
              interval: 0,
              padding: { left: 10, right: 10 },
            }}
            axisYProps={{
              tick: { fontSize: 10, fill: "#222" },
              stroke: "#bebebe",
              strokeWidth: 1,
              width: 24,
            }}
            data={[
              { name: "21/06", temperature: 20, humidity: 41 },
              { name: "22/06", temperature: 20, humidity: 41 },
              { name: "23/06", temperature: 19, humidity: 42 },
              { name: "24/06", temperature: 21, humidity: 39 },
              { name: "25/06", temperature: 21, humidity: 39 },
            ]}
          />
        </Wrapper>
      </Horizontal>
    );
  },
};
