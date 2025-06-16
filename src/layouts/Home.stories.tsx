import {
  Cube,
  Table,
  GearSix,
  CaretDown,
  Paperclip,
  SuitcaseSimple,
  DownloadSimple,
  QuestionMark,
} from "@phosphor-icons/react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import Stats from "../components/stats/Stats";
import Button from "../components/buttons/Button";
import Wrapper from "../components/wrapper/Wrapper";
import Sidebar from "../components/sidebar/Sidebar";
import { ChartLine } from "../components/charts/Chart";
import Dropdown from "../components/dropdowns/Dropdown";
import { Horizontal, Vertical } from "../components/aligns/Align";
import { InputSelect, InputInterval } from "../components/inputs/Input";

const meta: Meta = {
  title: "Layout/Dashboard",
  tags: ["autodocs"],
};

export default meta;

export const Default: StoryObj = {
  render: () => {
    const [path, setPath] = useState("dashboard");
    return (
      <Horizontal styles={{ height: "100vh" }}>
        <Sidebar
          path={path}
          header={{
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
        <Vertical
          internal={1}
          styles={{ padding: "1rem", flex: 1, overflowY: "scroll" }}
        >
          <Horizontal>
            <h1>Dashboard</h1>
          </Horizontal>
          <Horizontal internal={1}>
            <InputSelect
              label=""
              empty=""
              value="general"
              options={[
                {
                  id: "inflow",
                  text: "Entradas",
                  value: "inflow",
                },
                {
                  id: "outflow",
                  text: "Saídas",
                  value: "outflow",
                },
                {
                  id: "general",
                  text: "Geral",
                  value: "general",
                },
              ]}
            />
            <InputInterval label="" value={["2025-01-01", "2025-02-02"]} />
            <div style={{ flex: 1 }}></div>
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
              <Button category="Neutral" text="Baixar" Icon={DownloadSimple} />
            </Dropdown>
            <Button category="Neutral" text="" Icon={QuestionMark} onlyIcon />
          </Horizontal>
          <Horizontal internal={1}>
            <Stats
              title="Entradas"
              value={5000}
              valueLocale="pt-BR"
              valueOptions={{ style: "currency", currency: "BRL" }}
              footer="Total de entradas já realizadas"
            />
            <Stats
              metric={0.1}
              metricStatus="Up"
              metricLocale="pt-BR"
              metricOptions={{ style: "percent" }}
              title="Entradas a receber"
              value={500}
              valueLocale="pt-BR"
              valueOptions={{ style: "currency", currency: "BRL" }}
              footer="Total de entradas que ainda serão recebidas"
            />
            <Stats
              metric={0.2}
              metricStatus="Up"
              metricLocale="pt-BR"
              metricOptions={{ style: "percent" }}
              title="Entradas em atraso"
              value={1000}
              valueLocale="pt-BR"
              valueOptions={{ style: "currency", currency: "BRL" }}
              footer="Total de entradas que já deveriam ter sido recebidas"
            />
          </Horizontal>
          <Horizontal internal={1}>
            <Stats
              title="Saídas"
              value={1000}
              valueLocale="pt-BR"
              valueOptions={{ style: "currency", currency: "BRL" }}
              footer="Total de saídas já realizadas"
            />
            <Stats
              metric={0.05}
              metricStatus="Down"
              metricLocale="pt-BR"
              metricOptions={{ style: "percent" }}
              title="Saídas a realizar"
              value={50}
              valueLocale="pt-BR"
              valueOptions={{ style: "currency", currency: "BRL" }}
              footer="Total de saídas que ainda serão realizadas"
            />
            <Stats
              metric={0.1}
              metricStatus="Down"
              metricLocale="pt-BR"
              metricOptions={{ style: "percent" }}
              title="Saídas em atraso"
              value={100}
              valueLocale="pt-BR"
              valueOptions={{ style: "currency", currency: "BRL" }}
              footer="Total de saídas que já deveriam ter sido realizadas"
            />
          </Horizontal>
          <Horizontal internal={1}>
            <Wrapper
              title="Entradas Financeiras"
              description="As entradas distribuídas ao longo do intervalo de tempo."
            >
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
                    dataKey: "inflow",
                    stroke: "#22c55e",
                    strokeDasharray: "1",
                    strokeWidth: 4,
                    dot: false,
                  },
                ]}
                axisXProps={{
                  stroke: "#bebebe",
                  strokeWidth: 1,
                  dataKey: "date",
                  tick: { fontSize: 10, fill: "#222" },
                  interval: 0,
                  padding: { left: 15, right: 15 },
                }}
                axisYProps={{
                  tick: { fontSize: 10, fill: "#222" },
                  stroke: "",
                  strokeWidth: 0,
                  width: 24,
                }}
                data={[
                  { date: "01/01", inflow: 1000 },
                  { date: "02/01", inflow: 500 },
                  { date: "03/01", inflow: 2000 },
                  { date: "04/01", inflow: 500 },
                  { date: "05/01", inflow: 0 },
                  { date: "06/01", inflow: 0 },
                  { date: "07/01", inflow: 1000 },
                ]}
              />
            </Wrapper>
            <Wrapper
              title="Saídas Financeiras"
              description="As saídas distribuídas ao longo do intervalo de tempo."
            >
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
                    dataKey: "outflow",
                    stroke: "#ef4444",
                    strokeDasharray: "1",
                    strokeWidth: 4,
                    dot: false,
                  },
                ]}
                axisXProps={{
                  stroke: "#bebebe",
                  strokeWidth: 1,
                  dataKey: "date",
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
                  { date: "01/01", outflow: 50 },
                  { date: "02/01", outflow: 100 },
                  { date: "03/01", outflow: 200 },
                  { date: "04/01", outflow: 150 },
                  { date: "05/01", outflow: 50 },
                  { date: "06/01", outflow: 100 },
                  { date: "07/01", outflow: 100 },
                ]}
              />
            </Wrapper>
          </Horizontal>
          <Horizontal internal={1}>
            <Wrapper
              title="Resumo de Entradas"
              description="Visualização das entradas a receber e em atraso."
            >
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
                    dataKey: "inflowPending",
                    stroke: "#22c55e",
                    strokeDasharray: "1",
                    strokeWidth: 4,
                    dot: false,
                  },
                  {
                    type: "monotone",
                    dataKey: "inflowOverdue",
                    stroke: "#22c55e",
                    strokeDasharray: "1",
                    strokeWidth: 4,
                    dot: false,
                  },
                ]}
                axisXProps={{
                  stroke: "#bebebe",
                  strokeWidth: 1,
                  dataKey: "date",
                  tick: { fontSize: 10, fill: "#222" },
                  interval: 0,
                  padding: { left: 15, right: 15 },
                }}
                axisYProps={{
                  tick: { fontSize: 10, fill: "#222" },
                  stroke: "",
                  strokeWidth: 0,
                  width: 24,
                }}
                data={[
                  { date: "01/01", inflowPending: 0, inflowOverdue: 100 },
                  { date: "02/01", inflowPending: 50, inflowOverdue: 100 },
                  { date: "03/01", inflowPending: 100, inflowOverdue: 200 },
                  { date: "04/01", inflowPending: 50, inflowOverdue: 200 },
                  { date: "05/01", inflowPending: 0, inflowOverdue: 200 },
                  { date: "06/01", inflowPending: 150, inflowOverdue: 200 },
                  { date: "07/01", inflowPending: 150, inflowOverdue: 200 },
                ]}
              />
            </Wrapper>
            <Wrapper
              title="Resumo de Saídas"
              description="Visualização das sáidas a realizar e em atraso."
            >
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
                    dataKey: "outflowPending",
                    stroke: "#ef4444",
                    strokeDasharray: "1",
                    strokeWidth: 4,
                    dot: false,
                  },
                  {
                    type: "monotone",
                    dataKey: "outflowOverdue",
                    stroke: "#ef4444",
                    strokeDasharray: "1",
                    strokeWidth: 4,
                    dot: false,
                  },
                ]}
                axisXProps={{
                  angle: 20,
                  stroke: "#bebebe",
                  strokeWidth: 1,
                  dataKey: "date",
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
                  { date: "01/01", outflowPending: 0, outflowOverdue: 10 },
                  { date: "02/01", outflowPending: 10, outflowOverdue: 20 },
                  { date: "03/01", outflowPending: 0, outflowOverdue: 10 },
                  { date: "04/01", outflowPending: 10, outflowOverdue: 20 },
                  { date: "05/01", outflowPending: 10, outflowOverdue: 20 },
                  { date: "06/01", outflowPending: 10, outflowOverdue: 10 },
                  { date: "07/01", outflowPending: 10, outflowOverdue: 10 },
                ]}
              />
            </Wrapper>
          </Horizontal>
        </Vertical>
      </Horizontal>
    );
  },
};
