import { toast } from "sonner";
import React, { useState } from "react";
import { TrendUp, TrendDown, FunnelSimple } from "@phosphor-icons/react";

// apis
import apis from "../../apis";

// types
import { ApiPreference } from "../../types/Api";
import { DashboardHiddenProps } from "../../types/Dashboard";

// hooks
import useAsync from "../../hooks/useAsync";
import useSounds from "../../hooks/useSounds";
import useSystem from "../../hooks/useSystem";
import useTranslate from "../../hooks/useTranslate";
import { useDialog } from "../../components/dialogs/Dialog";

// components
import Stats from "../../components/stats/Stats";
import Button from "../../components/buttons/Button";
import Wrapper from "../../components/wrapper/Wrapper";
import { ChartLine } from "../../components/charts/Chart";
import { InputSelect } from "../../components/inputs/Input";
import { Horizontal, Vertical } from "../../components/aligns/Align";

const DashboardFinancial = function ({ hidden }: DashboardHiddenProps) {
  const t = useTranslate();
  const play = useSounds();
  const { instance } = useSystem();
  const { OpenDialog, CloseDialog } = useDialog();
  const { user, token, preferences, setPreferences } = useSystem();

  const [loading, setLoading] = useState<boolean>(true);

  const preferencesHidden =
    preferences?.hidden && typeof preferences?.hidden === "object"
      ? preferences?.hidden
      : {};

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

  const filterAction = function () {
    OpenDialog({
      width: 520,
      nonFooter: true,
      category: "Success",
      title: `${t.components.filter}: ${t.financial.financial}`,
      description: function () {
        const [hidden, setHidden] = useState<Record<string, boolean>>({
          ...preferencesHidden,
          inflows: preferencesHidden?.inflows || false,
          outflows: preferencesHidden?.outflows || false,
        });

        return (
          <Vertical internal={1}>
            <InputSelect
              empty={t.stacks.no_option}
              label={t.financial.inflows}
              value={String(hidden?.inflows)}
              options={[
                {
                  id: "true",
                  value: "true",
                  text: t.components.hide,
                },
                {
                  id: "false",
                  value: "false",
                  text: t.components.show,
                },
              ]}
              onChange={function (event) {
                const newHidden = { ...hidden };
                newHidden.inflows = event.target?.value === "true";
                setHidden(newHidden);
                return;
              }}
            />

            <InputSelect
              empty={t.stacks.no_option}
              label={t.financial.outflows}
              value={String(hidden?.outflows)}
              options={[
                {
                  id: "true",
                  value: "true",
                  text: t.components.hide,
                },
                {
                  id: "false",
                  value: "false",
                  text: t.components.show,
                },
              ]}
              onChange={function (event) {
                const newHidden = { ...hidden };
                newHidden.outflows = event.target?.value === "true";
                setHidden(newHidden);
                return;
              }}
            />

            <Horizontal internal={1} styles={{ justifyContent: "flex-end" }}>
              <Button
                category="Neutral"
                text={t.components.cancel}
                onClick={CloseDialog}
              />
              <Button
                category="Info"
                text={t.components.filter}
                onClick={async function () {
                  try {
                    const response = await apis.Preference.set<ApiPreference>(
                      instance.name,
                      token,
                      user.id,
                      { hidden },
                    );
                    if (!response.data) {
                      play("alert");
                      toast.warning(t.toast.warning_error, {
                        description: t.toast.warning_filter,
                      });
                      return;
                    }
                    const newPreferences = { ...response.data.result };
                    delete newPreferences.id;
                    delete newPreferences.updatedAt;
                    delete newPreferences.userId;
                    setPreferences(newPreferences);
                    play("ok");
                    toast.success(t.toast.success, {
                      description: t.toast.success_filter,
                    });
                    CloseDialog();
                  } catch (err) {
                    play("alert");
                    toast.error(t.toast.warning_error, {
                      description: t.toast.error_filter,
                    });
                    console.error(
                      "[src/pages/dashboard/DashboardFinancial.tsx]",
                      err,
                    );
                  }
                  return;
                }}
              />
            </Horizontal>
          </Vertical>
        );
      },
    });
    return;
  };

  return (
    <React.Fragment>
      <Horizontal internal={1} className="itemsCenter">
        <h3 className="flex1">{t.financial.financial}</h3>
        <Button
          category="Neutral"
          Icon={FunnelSimple}
          onClick={filterAction}
          text={t.components.filter}
        />
      </Horizontal>

      {!preferencesHidden?.inflows && (
        <Horizontal internal={1}>
          <Stats
            animation
            hidden={hidden}
            loading={loading}
            // metric={0}
            // metricStatus="Up"
            // metricLocale="pt-BR"
            // metricOptions={{ style: "percent" }}
            title={t.dashboard.stats_inflows_title}
            Icon={TrendUp}
            category="Success"
            value={0}
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
            value={0}
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
            value={0}
            valueLocale={instance.language}
            valueOptions={{ style: "currency", currency: instance.currency }}
            footer={t.dashboard.stats_inflows_late_description}
          />
        </Horizontal>
      )}

      {!preferencesHidden?.outflows && (
        <Horizontal internal={1}>
          <Stats
            animation
            hidden={hidden}
            loading={loading}
            // metric={0.05}
            // metricStatus="Down"
            // metricLocale="pt-BR"
            // metricOptions={{ style: "percent" }}
            title={t.dashboard.stats_outflows_title}
            Icon={TrendDown}
            category="Danger"
            value={0}
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
            value={0}
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
            value={0}
            valueLocale={instance.language}
            valueOptions={{ style: "currency", currency: instance.currency }}
            footer={t.dashboard.stats_outflows_late_description}
          />
        </Horizontal>
      )}

      <Horizontal internal={1}>
        {!preferencesHidden?.inflows && (
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
              data={
                [
                  // { date: "01/01", inflow: 1000 },
                  // { date: "02/01", inflow: 500 },
                  // { date: "03/01", inflow: 2000 },
                  // { date: "04/01", inflow: 500 },
                  // { date: "05/01", inflow: 0 },
                  // { date: "06/01", inflow: 0 },
                  // { date: "07/01", inflow: 1000 },
                ]
              }
            />
          </Wrapper>
        )}

        {!preferencesHidden?.outflows && (
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
              data={
                [
                  // { date: "01/01", outflow: 50 },
                  // { date: "02/01", outflow: 100 },
                  // { date: "03/01", outflow: 200 },
                  // { date: "04/01", outflow: 150 },
                  // { date: "05/01", outflow: 50 },
                  // { date: "06/01", outflow: 100 },
                  // { date: "07/01", outflow: 100 },
                ]
              }
            />
          </Wrapper>
        )}
      </Horizontal>
    </React.Fragment>
  );
};

export default DashboardFinancial;
