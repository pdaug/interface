import { TrendUp, TrendDown, FunnelSimple } from "@phosphor-icons/react";
import React, { useState } from "react";

// types
import { DashboardHiddenProps } from "../../types/Dashboard";

// hooks
import useAsync from "../../hooks/useAsync";
import useSystem from "../../hooks/useSystem";
import useTranslate from "../../hooks/useTranslate";

// components
import Stats from "../../components/stats/Stats";
import Button from "../../components/buttons/Button";
import Wrapper from "../../components/wrapper/Wrapper";
import { ChartLine } from "../../components/charts/Chart";
import { Horizontal } from "../../components/aligns/Align";

const DashboardFinancial = function ({ hidden }: DashboardHiddenProps) {
  const t = useTranslate();
  const { instance } = useSystem();

  const [loading, setLoading] = useState<boolean>(true);

  useAsync(async function () {
    try {
      setLoading(true);
    } catch (err) {
      console.error("[src/pages/Dashboard.tsx]", err);
    } finally {
      setLoading(false);
    }
    return;
  }, []);

  return (
    <React.Fragment>
      <Horizontal internal={1} className="itemsCenter">
        <h3 className="flex1">{t.financial.financial}</h3>
        <Button
          category="Neutral"
          Icon={FunnelSimple}
          text={t.components.filter}
        />
      </Horizontal>

      <Horizontal internal={1}>
        <Stats
          animation
          hidden={hidden}
          loading={loading}
          metric={0.1}
          metricStatus="Up"
          metricLocale="pt-BR"
          metricOptions={{ style: "percent" }}
          title={t.dashboard.stats_inflows_title}
          Icon={TrendUp}
          category="Success"
          value={5000}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
          footer={t.dashboard.stats_inflows_description}
        />

        <Stats
          animation
          hidden={hidden}
          loading={loading}
          title={t.dashboard.stats_inflows_receive_title}
          Icon={TrendUp}
          value={500}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
          footer={t.dashboard.stats_inflows_receive_description}
        />

        <Stats
          animation
          hidden={hidden}
          loading={loading}
          title={t.dashboard.stats_inflows_late_title}
          Icon={TrendUp}
          value={1000}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
          footer={t.dashboard.stats_inflows_late_description}
        />
      </Horizontal>

      <Horizontal internal={1}>
        <Stats
          animation
          hidden={hidden}
          loading={loading}
          metric={0.05}
          metricStatus="Down"
          metricLocale="pt-BR"
          metricOptions={{ style: "percent" }}
          title={t.dashboard.stats_outflows_title}
          Icon={TrendDown}
          category="Danger"
          value={-1000}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
          footer={t.dashboard.stats_outflows_description}
        />

        <Stats
          animation
          hidden={hidden}
          loading={loading}
          title={t.dashboard.stats_outflows_pay_title}
          Icon={TrendDown}
          value={-50}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
          footer={t.dashboard.stats_outflows_pay_description}
        />

        <Stats
          animation
          hidden={hidden}
          loading={loading}
          title={t.dashboard.stats_outflows_late_title}
          Icon={TrendDown}
          value={-100}
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
            id="chart_inflows"
            height={320}
            margin={{ top: 8, right: 8, left: 48, bottom: 16 }}
            gridProps={{
              stroke: "#dedede",
              strokeWidth: 1,
              vertical: false,
              horizontal: true,
            }}
            lines={[
              {
                type: "monotone",
                name: t.dashboard.stats_inflows_title,
                dataKey: "inflow",
                stroke: "#22c55e",
                strokeDasharray: "1",
                strokeWidth: 4,
                dot: false,
                formatter: (value: number) =>
                  new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: instance.currency,
                  }).format(value),
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
              tickFormatter: (value) =>
                new Intl.NumberFormat(instance.language, {
                  currency: instance.currency,
                  style: "currency",
                }).format(value),
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
            id="chart_outflows"
            height={320}
            margin={{ top: 8, right: 8, left: 48, bottom: 16 }}
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
                name: t.dashboard.stats_outflows_title,
                stroke: "#ef4444",
                strokeDasharray: "1",
                strokeWidth: 4,
                dot: false,
                formatter: (value: number) =>
                  new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: instance.currency,
                  }).format(value),
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
              tickFormatter: (value) =>
                new Intl.NumberFormat(instance.language, {
                  currency: instance.currency,
                  style: "currency",
                }).format(value),
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
    </React.Fragment>
  );
};

export default DashboardFinancial;
