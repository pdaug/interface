import {
  Cube,
  Table,
  GearSix,
  CaretDown,
  Paperclip,
  SuitcaseSimple,
  DownloadSimple,
} from "@phosphor-icons/react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import Stats from "../components/stats/Stats";
import Wrapper from "../components/wrapper/Wrapper";
import Sidebar from "../components/sidebar/Sidebar";
import { ChartLine } from "../components/charts/Chart";
import { Horizontal, Vertical } from "../components/aligns/Align";
import { InputInterval } from "../components/inputs/Input";
import Button from "../components/buttons/Button";
import Tooltip from "../components/tooltips/Tooltip";
import Dropdown from "../components/dropdowns/Dropdown";

const meta: Meta = {
  title: "Layout/Home",
  tags: ["autodocs"],
};

export default meta;

export const Default: StoryObj = {
  render: () => {
    const [path, setPath] = useState("`");
    return (
      <Horizontal>
        <Sidebar
          path={path}
          header={{
            padding: false,
            name: "Company Name",
            description: "Workspace Selected",
            dropdown: {
              children: (
                <div className="cursor">
                  <CaretDown />
                </div>
              ),
              values: [
                {
                  id: "workspace_1",
                  label: "Workspace 1",
                },
                {
                  id: "workspace_2",
                  label: "Workspace 2",
                },
              ],
            },
          }}
          menu={[
            {
              id: "financial",
              name: "Financial",
              Icon: Table,
              items: [
                {
                  id: "dashboard",
                  label: "Dashboard",
                  onClick: () => setPath("dashboard"),
                },
                {
                  id: "orders",
                  label: "Orders",
                  onClick: () => setPath("orders"),
                },
                {
                  id: "inflow",
                  label: "Inflow",
                  onClick: () => setPath("inflow"),
                },
                {
                  id: "outflow",
                  label: "Outflow",
                  onClick: () => setPath("outflow"),
                },
                {
                  id: "statements",
                  label: "Statements",
                  onClick: () => setPath("statements"),
                },
              ],
            },
            {
              id: "administrative",
              name: "Administrative",
              Icon: SuitcaseSimple,
              items: [
                {
                  id: "customers",
                  label: "Customers",
                  onClick: () => setPath("customers"),
                },
                {
                  id: "suppliers",
                  label: "Suppliers",
                  onClick: () => setPath("suppliers"),
                },
                {
                  id: "employees",
                  label: "Employees",
                  onClick: () => setPath("employees"),
                },
              ],
            },
            {
              id: "operational",
              name: "Operational",
              Icon: Cube,
              items: [
                {
                  id: "products",
                  label: "Products",
                  onClick: () => setPath("products"),
                },
                {
                  id: "services",
                  label: "Services",
                  onClick: () => setPath("services"),
                },
                {
                  id: "vehicles",
                  label: "Vehicles",
                  onClick: () => setPath("vehicles"),
                },
              ],
            },
            {
              id: "tools",
              name: "Tools",
              Icon: Paperclip,
              items: [
                {
                  id: "documents",
                  label: "Documents",
                  onClick: () => setPath("documents"),
                },
                {
                  id: "schedules",
                  label: "Schedules",
                  onClick: () => setPath("schedules"),
                },
              ],
            },
          ]}
          footer={{
            padding: false,
            name: "",
            description: "John Doe",
            photoCircle: true,
            dropdown: {
              children: (
                <div className="cursor">
                  <GearSix />
                </div>
              ),
              values: [
                {
                  id: "settings",
                  label: "Settings",
                },
                {
                  id: "sign_out",
                  label: "Sign Out",
                },
              ],
            },
          }}
        />
        <Vertical internal={1} external={1} styles={{ flex: 1 }}>
          <Horizontal>
            <h1>Dashboard</h1>
          </Horizontal>
          <Horizontal internal={1} styles={{ alignItems: "center" }}>
            <div>
              <InputInterval label="" value={["2025-01-01", "2025-02-02"]} />
            </div>
            <Tooltip content="Download PDF">
              <Dropdown
                values={[
                  {
                    id: "pdf",
                    label: "Arquivo PDF",
                  },
                  {
                    id: "xlsx",
                    label: "Planilha XSL",
                  },
                  {
                    id: "csv",
                    label: "Arquivo CSV",
                  },
                  {
                    id: "json",
                    label: "Formato JSON",
                  },
                ]}
              >
                <Button
                  category="Neutral"
                  text=""
                  Icon={DownloadSimple}
                  onlyIcon
                />
              </Dropdown>
            </Tooltip>
          </Horizontal>
          <Horizontal internal={1}>
            <Stats
              metric={0.5}
              metricStatus="Up"
              metricLocale="pt-BR"
              metricOptions={{ style: "percent" }}
              title="Entradas Pagas"
              value={5000}
              valueLocale="pt-BR"
              valueOptions={{ style: "currency", currency: "BRL" }}
            />
            <Stats
              metric={0.05}
              metricStatus="Up"
              metricLocale="pt-BR"
              metricOptions={{ style: "percent" }}
              title="Entradas Pendentes"
              value={50}
              valueLocale="pt-BR"
              valueOptions={{ style: "currency", currency: "BRL" }}
            />
            <Stats
              metric={0.122}
              metricStatus="Down"
              metricLocale="pt-BR"
              metricOptions={{ style: "percent" }}
              title="Saídas Pagas"
              value={1000}
              valueLocale="pt-BR"
              valueOptions={{ style: "currency", currency: "BRL" }}
            />
            <Stats
              metric={0.5}
              metricStatus="Down"
              metricLocale="pt-BR"
              metricOptions={{ style: "percent" }}
              title="Saídas em Atraso"
              value={500}
              valueLocale="pt-BR"
              valueOptions={{ style: "currency", currency: "BRL" }}
            />
          </Horizontal>
          <Horizontal internal={1}>
            <Wrapper title="Chart Pie Basic">
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
            <Wrapper title="Chart Pie Basic">
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
        </Vertical>
      </Horizontal>
    );
  },
};
