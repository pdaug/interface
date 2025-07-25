import React, { useState } from "react";
import { endOfDay, startOfYear } from "date-fns";
import { QuestionMark, DownloadSimple } from "@phosphor-icons/react";

// types
import { TypeInputInterval } from "../../../types/Components";

// hooks
import useSystem from "../../../hooks/useSystem";
import useTranslate from "../../../hooks/useTranslate";

// components
import Stats from "../../../components/stats/Stats";
import Button from "../../../components/buttons/Button";
import Wrapper from "../../../components/wrapper/Wrapper";
import Tooltip from "../../../components/tooltips/Tooltip";
import { ChartLine } from "../../../components/charts/Chart";
import Dropdown from "../../../components/dropdowns/Dropdown";
import { Horizontal } from "../../../components/aligns/Align";
import { useDialog } from "../../../components/dialogs/Dialog";
import Breadcrumb from "../../../components/breadcrumbs/Breadcrumb";
import { InputInterval, InputSelect } from "../../../components/inputs/Input";

const Dashboard = function () {
  const t = useTranslate();
  const { OpenDialog } = useDialog();
  const { instance, workspaces, workspaceId } = useSystem();

  const [interval, setInterval] = useState<TypeInputInterval>({
    start: startOfYear(new Date()),
    end: endOfDay(new Date()),
  });

  return (
    <React.Fragment>
      <Horizontal>
        <h2>
          <Breadcrumb
            links={[
              {
                id: "workspace",
                label:
                  workspaces.find(function (workspace) {
                    return workspace.id === workspaceId;
                  })?.name || "",
                url: "/f/",
              },
              {
                id: "dashboard",
                label: t.dashboard.dashboard,
                url: "/f/dashboard",
              },
            ]}
          />
        </h2>
      </Horizontal>
      <Horizontal internal={1}>
        <InputSelect
          label=""
          empty=""
          value="general"
          styles={{ maxWidth: "10rem" }}
          options={[
            {
              id: "inflow",
              value: "inflow",
              text: t.menu.inflows,
            },
            {
              id: "outflow",
              value: "outflow",
              text: t.menu.outflows,
            },
            {
              id: "general",
              value: "general",
              text: t.components.all,
            },
          ]}
        />
        <div style={{ minWidth: 200, maxWidth: 256 }}>
          <InputInterval
            label=""
            value={[interval.start, interval.end]}
            onChange={function (interval) {
              const [start, end] = interval;
              setInterval({
                start: start ? new Date(start) : null,
                end: end ? new Date(end) : null,
              });
              return;
            }}
          />
        </div>
        <div style={{ flex: 1 }}></div>
        <Dropdown
          values={[
            {
              id: "xlsx",
              label: t.components.xlsx,
            },
            {
              id: "csv",
              label: t.components.csv,
            },
            {
              id: "json",
              label: t.components.json,
            },
          ]}
        >
          <Button
            category="Neutral"
            text={t.components.download}
            Icon={DownloadSimple}
          />
        </Dropdown>
        <Tooltip content={t.components.help}>
          <Button
            text=""
            onlyIcon
            category="Neutral"
            Icon={QuestionMark}
            onClick={function () {
              OpenDialog({
                width: 700,
                category: "Success",
                title: t.components.help,
                cancelText: t.components.close,
                description: (
                  <iframe
                    height={400}
                    style={{ border: "none", width: "100%" }}
                    src="https://www.youtube.com/embed/L-yA7-puosA"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  />
                ),
              });
              return;
            }}
          />
        </Tooltip>
      </Horizontal>
      <Horizontal internal={1}>
        <Stats
          title={t.dashboard.stats_inflows_title}
          value={5000}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
          footer={t.dashboard.stats_inflows_description}
        />
        <Stats
          metric={0.1}
          metricStatus="Up"
          metricLocale="pt-BR"
          metricOptions={{ style: "percent" }}
          title={t.dashboard.stats_inflows_receive_title}
          value={500}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
          footer={t.dashboard.stats_inflows_receive_description}
        />
        <Stats
          metric={0.2}
          metricStatus="Up"
          metricLocale="pt-BR"
          metricOptions={{ style: "percent" }}
          title={t.dashboard.stats_inflows_late_title}
          value={1000}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
          footer={t.dashboard.stats_inflows_late_description}
        />
      </Horizontal>
      <Horizontal internal={1}>
        <Stats
          title={t.dashboard.stats_outflows_title}
          value={1000}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
          footer={t.dashboard.stats_outflows_description}
        />
        <Stats
          metric={0.05}
          metricStatus="Down"
          metricLocale="pt-BR"
          metricOptions={{ style: "percent" }}
          title={t.dashboard.stats_outflows_receive_title}
          value={50}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
          footer={t.dashboard.stats_outflows_receive_description}
        />
        <Stats
          metric={0.1}
          metricStatus="Down"
          metricLocale="pt-BR"
          metricOptions={{ style: "percent" }}
          title={t.dashboard.stats_outflows_late_title}
          value={100}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
          footer={t.dashboard.stats_outflows_late_description}
        />
      </Horizontal>
      <Horizontal internal={1}>
        <Wrapper
          title={t.dashboard.chart_inflows_title}
          description={t.dashboard.chart_inflows_description}
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
          title={t.dashboard.chart_outflows_title}
          description={t.dashboard.chart_outflows_description}
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
          title={t.dashboard.chart_inflows_resume_title}
          description={t.dashboard.chart_inflows_resume_description}
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
          title={t.dashboard.chart_outflows_resume_title}
          description={t.dashboard.chart_outflows_resume_description}
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
      <div style={{ minHeight: 128 }}></div>
    </React.Fragment>
  );
};

export default Dashboard;
