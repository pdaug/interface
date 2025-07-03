import React from "react";
import { QuestionMark, DownloadSimple } from "@phosphor-icons/react";

// components
import Stats from "../../components/stats/Stats";
import Button from "../../components/buttons/Button";
import Wrapper from "../../components/wrapper/Wrapper";
import { ChartLine } from "../../components/charts/Chart";
import Dropdown from "../../components/dropdowns/Dropdown";
import { Horizontal } from "../../components/aligns/Align";
import { useDialog } from "../../components/dialogs/Dialog";
import { InputInterval, InputSelect } from "../../components/inputs/Input";

const Dashboard = function () {
  const { OpenDialog } = useDialog();

  return (
    <React.Fragment>
      <Horizontal>
        <h1>Dashboard</h1>
      </Horizontal>
      <Horizontal internal={1}>
        <InputSelect
          styles={{ maxWidth: "10rem" }}
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
        <InputInterval
          label=""
          styles={{ maxWidth: "20rem" }}
          value={["2025-01-01", "2025-02-02"]}
        />
        <div style={{ flex: 1 }}></div>
        <Dropdown
          values={[
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
        <Button
          onClick={() =>
            OpenDialog({
              category: "Info",
              title: "Título",
              description: (
                <iframe
                  width="100%"
                  height="315"
                  title="YouTube video player"
                  src="https://www.youtube.com/embed/q7vKnhTSoK8?si=gQf4QNmMqIEeRg_G"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
              ),
            })
          }
          category="Neutral"
          text=""
          Icon={QuestionMark}
          onlyIcon
        />
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
    </React.Fragment>
  );
};

export default Dashboard;
