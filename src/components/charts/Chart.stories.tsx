import type { StoryObj } from "@storybook/react";

import { ChartLine } from "./Chart";
import Wrapper from "../wrapper/Wrapper";
import { Vertical } from "../aligns/Align";

export default {
  title: "Components/Chart",
  tags: ["autodocs"],
};

export const Line: StoryObj = {
  render: () => {
    return (
      <Vertical internal={1} styles={{ width: "30rem" }}>
        <Wrapper title="Chart Line">
          <ChartLine
            height={400}
            gridProps={{
              stroke: "#dedede",
              strokeWidth: 1,
            }}
            lines={[
              {
                type: "monotone",
                dataKey: "temperature",
                stroke: "#22c55e",
                strokeDasharray: "1",
                strokeWidth: 2,
              },
              {
                type: "monotone",
                dataKey: "humidity",
                stroke: "#0ea5e9",
                strokeDasharray: "1",
                strokeWidth: 2,
              },
            ]}
            axisXProps={{
              stroke: "#bebebe",
              strokeWidth: 1,
              dataKey: "name",
              tick: { fontSize: 10, fill: "#222" },
              interval: 0,
            }}
            axisYProps={{
              tick: { fontSize: 10, fill: "#222" },
              stroke: "#bebebe",
              strokeWidth: 1,
              width: 24,
            }}
            data={[
              { name: "06:00", temperature: 12, humidity: 41 },
              { name: "07:00", temperature: 13, humidity: 41 },
              { name: "08:00", temperature: 15, humidity: 41 },
              { name: "09:00", temperature: 18, humidity: 41 },
              { name: "10:00", temperature: 21, humidity: 40 },
              { name: "11:00", temperature: 21, humidity: 39 },
              { name: "12:00", temperature: 22, humidity: 39 },
              { name: "13:00", temperature: 23, humidity: 38 },
              { name: "14:00", temperature: 22, humidity: 39 },
              { name: "15:00", temperature: 22, humidity: 41 },
              { name: "16:00", temperature: 22, humidity: 42 },
              { name: "17:00", temperature: 21, humidity: 42 },
              { name: "18:00", temperature: 20, humidity: 42 },
            ]}
          />
        </Wrapper>
      </Vertical>
    );
  },
};
