import {
  subDays,
  isEqual,
  endOfDay,
  isSameDay,
  startOfDay,
  startOfYear,
} from "date-fns";
import {
  Eye,
  Tag,
  Truck,
  Toolbox,
  Package,
  TrendUp,
  EyeSlash,
  TrendDown,
  Blueprint,
  PaintBrush,
  CurrencyBtc,
  FunnelSimple,
  CoinVertical,
  CalendarDots,
  QuestionMark,
  DownloadSimple,
  ShoppingBagOpen,
  PresentationChart,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import React, { useEffect, useState } from "react";

// apis
import apis from "../apis";

// assets
import { ScheduleCategoriesColors } from "../assets/Schedules";

// types
import {
  ApiIndexes,
  ApiBitcoinContent,
  ApiExchangeContent,
  ApiResponsePaginate,
} from "../types/Api";
import { TypeAccount } from "../types/Account";
import { TypeSchedule } from "../types/Schedules";
import { TypeInputInterval } from "../types/Components";

// hooks
import useAsync from "../hooks/useAsync";
import useSounds from "../hooks/useSounds";
import useSystem from "../hooks/useSystem";
import useDateTime from "../hooks/useDateTime";
import useTranslate from "../hooks/useTranslate";

// components
import Stats from "../components/stats/Stats";
import Button from "../components/buttons/Button";
import Wrapper from "../components/wrapper/Wrapper";
import Profile from "../components/profiles/Profile";
import Tooltip from "../components/tooltips/Tooltip";
import { ChartLine } from "../components/charts/Chart";
import Dropdown from "../components/dropdowns/Dropdown";
import { Horizontal } from "../components/aligns/Align";
import { useDialog } from "../components/dialogs/Dialog";
import Table, { TableData } from "../components/tables/Table";
import Badge, { BadgeCategories } from "../components/badges/Badge";
import { InputInterval, InputSelect } from "../components/inputs/Input";

type TypeStats = Record<string, number>;

type DashboardHiddenProps = {
  hidden?: boolean;
};

type DashboardIntervalProps = {
  interval: TypeInputInterval;
};

const DashboardExchangesIndexes = function () {
  const t = useTranslate();
  const play = useSounds();
  const { instance } = useSystem();

  const [loading, setLoading] = useState<boolean>(true);
  const [indexes, setIndexes] = useState<ApiIndexes>([]);
  const [euro, setEuro] = useState<ApiExchangeContent | null>(null);
  const [pound, setPound] = useState<ApiExchangeContent | null>(null);
  const [dollar, setDollar] = useState<ApiExchangeContent | null>(null);
  const [bitcoin, setBitcoin] = useState<ApiBitcoinContent | null>(null);

  // fetch exchanges and indexes
  useAsync(
    async function () {
      try {
        setLoading(true);
        if (!instance?.currency) return;

        if (instance.currency !== "USD") {
          const responseDollar = await apis.Exchange(
            `USD-${instance.currency}`,
          );
          if (!responseDollar.data) {
            play("alert");
            toast.warning(t.toast.warning_error, {
              description: t.stacks.no_find_item,
            });
            return;
          }
          const newDollar = Object.values(responseDollar.data)[0];
          setDollar(newDollar);
        }

        if (instance.currency !== "EUR") {
          const responseEuro = await apis.Exchange(`EUR-${instance.currency}`);
          if (!responseEuro.data) {
            play("alert");
            toast.warning(t.toast.warning_error, {
              description: t.stacks.no_find_item,
            });
            return;
          }
          const newEuro = Object.values(responseEuro.data)[0];
          setEuro(newEuro);
        }

        if (instance.currency !== "GBP") {
          const responsePound = await apis.Exchange(`GBP-${instance.currency}`);
          if (!responsePound.data) {
            play("alert");
            toast.warning(t.toast.warning_error, {
              description: t.stacks.no_find_item,
            });
            return;
          }
          const newPound = Object.values(responsePound.data)[0];
          setPound(newPound);
        }

        const responseBitcoin = await apis.Bitcoin();
        if (!responseBitcoin.data) {
          play("alert");
          toast.warning(t.toast.warning_error, {
            description: t.stacks.no_find_item,
          });
        }
        const newBitcoin = responseBitcoin.data?.[instance.currency] || null;
        setBitcoin(newBitcoin);

        const responeindexes = await apis.Indexes();
        if (!responeindexes.data) {
          play("alert");
          toast.warning(t.toast.warning_error, {
            description: t.stacks.no_find_item,
          });
        }
        const newIndexes = responeindexes.data || [];
        setIndexes(newIndexes);
      } catch (err) {
        play("alert");
        toast.error(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        console.error("[src/pages/Dashboard.tsx]", err);
      } finally {
        setLoading(false);
      }
      return;
    },
    [instance.currency],
  );

  return (
    <React.Fragment>
      <Horizontal internal={1} className="itemsCenter">
        <h3 className="flex1">{t.dashboard.exchange_indexes}</h3>
        <Button
          category="Neutral"
          Icon={FunnelSimple}
          text={t.components.filter}
        />
      </Horizontal>

      <Horizontal internal={1}>
        <Stats
          loading={loading}
          metric={Math.abs(parseFloat(dollar?.pctChange || "0")) / 100}
          metricStatus={
            parseFloat(dollar?.pctChange || "0") > 0 ? "Up" : "Down"
          }
          metricLocale={instance.language}
          metricOptions={{ style: "percent", minimumFractionDigits: 4 }}
          title={t.dashboard.stats_exchange_dollar}
          Icon={CoinVertical}
          category="Info"
          value={parseFloat(dollar?.bid || "1")}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
        />

        <Stats
          loading={loading}
          metric={Math.abs(parseFloat(euro?.pctChange || "0")) / 100}
          metricStatus={parseFloat(euro?.pctChange || "0") > 0 ? "Up" : "Down"}
          metricLocale={instance.language}
          metricOptions={{ style: "percent", minimumFractionDigits: 4 }}
          title={t.dashboard.stats_exchange_euro}
          Icon={CoinVertical}
          category="Info"
          value={parseFloat(euro?.bid || "1")}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
        />

        <Stats
          loading={loading}
          metric={Math.abs(parseFloat(pound?.pctChange || "0")) / 100}
          metricStatus={parseFloat(pound?.pctChange || "0") > 0 ? "Up" : "Down"}
          metricLocale={instance.language}
          metricOptions={{ style: "percent", minimumFractionDigits: 4 }}
          title={t.dashboard.stats_exchange_pound}
          Icon={CoinVertical}
          category="Info"
          value={parseFloat(pound?.bid || "1")}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
        />

        <Stats
          loading={loading}
          title={t.dashboard.stats_exchange_bitcoin}
          Icon={CurrencyBtc}
          category="Info"
          value={bitcoin?.buy || 0}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
        />
      </Horizontal>

      <Horizontal internal={1}>
        <Stats
          loading={loading}
          title={t.dashboard.stats_index_selic}
          Icon={PresentationChart}
          value={
            (indexes.find((index) => index.nome === "Selic")?.valor || 0) / 100
          }
          valueLocale={instance.language}
          valueOptions={{ style: "percent", minimumFractionDigits: 2 }}
          footer={
            <a
              href="https://www.bcb.gov.br/controleinflacao/taxaselic"
              target="_blank"
              rel="noreferrer"
            >
              {t.dashboard.stats_index_selic_description}
            </a>
          }
        />

        <Stats
          loading={loading}
          title={t.dashboard.stats_index_cdi}
          Icon={PresentationChart}
          value={
            (indexes.find((index) => index.nome === "CDI")?.valor || 0) / 100
          }
          valueLocale={instance.language}
          valueOptions={{ style: "percent", minimumFractionDigits: 2 }}
          footer={
            <a
              href="https://pt.wikipedia.org/wiki/Certificado_de_Dep%C3%B3sito_Interbanc%C3%A1rio"
              target="_blank"
              rel="noreferrer"
            >
              {t.dashboard.stats_index_cdi_description}
            </a>
          }
        />

        <Stats
          loading={loading}
          title={t.dashboard.stats_index_ipca}
          Icon={PresentationChart}
          value={
            (indexes.find((index) => index.nome === "IPCA")?.valor || 0) / 100
          }
          valueLocale={instance.language}
          valueOptions={{ style: "percent", minimumFractionDigits: 2 }}
          footer={
            <a
              href="https://pt.wikipedia.org/wiki/%C3%8Dndice_de_pre%C3%A7os_no_consumidor"
              target="_blank"
              rel="noreferrer"
            >
              {t.dashboard.stats_index_ipca_description}
            </a>
          }
        />
      </Horizontal>
    </React.Fragment>
  );
};

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

const DashboardSchedules = function ({
  interval,
  hidden,
}: DashboardHiddenProps & DashboardIntervalProps) {
  const t = useTranslate();
  const play = useSounds();
  const { instanceDateTime, instanceDate } = useDateTime();
  const { users, token, instance, workspaceId } = useSystem();

  const [loading, setLoading] = useState<boolean>(true);
  const [schedules, setSchedules] = useState<TypeSchedule[]>([]);

  // fetch schedules
  useAsync(
    async function () {
      setLoading(true);
      try {
        const response = await apis.Schedule.list<
          ApiResponsePaginate<TypeSchedule>
        >(
          token,
          instance.name,
          {
            pageSize: 999,
            pageCurrent: 1,
            orderField: "start",
            orderSort: "desc",
            showDeleted: "true",
            filter: JSON.stringify({
              start: {
                $gte: interval.start
                  ? new Date(interval.start)
                  : startOfYear(new Date()),
                $lt: interval.end
                  ? new Date(interval.end)
                  : endOfDay(new Date()),
              },
              $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
            }),
          },
          workspaceId,
        );
        if (!response.data?.result?.items) {
          play("alert");
          toast.warning(t.toast.warning_error, {
            description: t.stacks.no_find_item,
          });
          console.warn("[src/pages/Dashboard.tsx]", response.data);
          return;
        }
        const parse = response.data.result.items?.map(function (item) {
          return {
            ...item,
            start: new Date(item.start),
            end: item?.end ? new Date(item.end) : null,
          };
        });
        setSchedules(parse as TypeSchedule[]);
        return;
      } catch (err) {
        play("alert");
        toast.error(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        console.error("[src/pages/Dashboard.tsx]", err);
        return;
      } finally {
        setLoading(false);
      }
    },
    [interval, workspaceId],
  );

  return (
    <React.Fragment>
      <Horizontal internal={1} className="itemsCenter">
        <h3 className="flex1">{t.schedule.schedules}</h3>
        <Button
          category="Neutral"
          Icon={FunnelSimple}
          text={t.components.filter}
        />
      </Horizontal>

      <Horizontal internal={1}>
        <Stats
          hidden={hidden}
          loading={loading}
          title={t.dashboard.stats_schedules_title}
          Icon={CalendarDots}
          value={schedules?.length || 0}
          valueUnit={t.components.items.toLowerCase()}
          footer={t.dashboard.stats_schedules_description}
          styles={{ minWidth: "28%" }}
        />

        <Stats
          hidden={hidden}
          loading={loading}
          title={t.dashboard.stats_schedules_low}
          Icon={CalendarDots}
          category="Success"
          value={
            schedules?.filter((schedule) => schedule.priority === "low")
              ?.length || 0
          }
          valueUnit={t.components.items.toLowerCase()}
          styles={{ display: "flex" }}
        />

        <Stats
          hidden={hidden}
          loading={loading}
          title={t.dashboard.stats_schedules_medium}
          Icon={CalendarDots}
          category="Info"
          value={
            schedules?.filter((schedule) => schedule.priority === "medium")
              ?.length || 0
          }
          valueUnit={t.components.items.toLowerCase()}
          styles={{ display: "flex" }}
        />

        <Stats
          hidden={hidden}
          loading={loading}
          title={t.dashboard.stats_schedules_high}
          Icon={CalendarDots}
          category="Warning"
          value={
            schedules?.filter((schedule) => schedule.priority === "high")
              ?.length || 0
          }
          valueUnit={t.components.items.toLowerCase()}
          styles={{ display: "flex" }}
        />

        <Stats
          hidden={hidden}
          loading={loading}
          title={t.dashboard.stats_schedules_critical}
          Icon={CalendarDots}
          category="Danger"
          value={
            schedules?.filter((schedule) => schedule.priority === "critical")
              ?.length || 0
          }
          valueUnit={t.components.items.toLowerCase()}
          styles={{ display: "flex" }}
        />
      </Horizontal>

      <div style={{ maxHeight: 400 }}>
        <Table
          border
          noSelect
          loading={loading}
          data={
            schedules?.filter(
              (schedule) => schedule.priority !== "none",
            ) as TableData[]
          }
          styles={{ display: "flex", flexDirection: "column", height: "100%" }}
          stylesBody={{ overflowY: "scroll" }}
          columns={{
            priority: {
              label: t.schedule.priority,
              maxWidth: 128,
              handler: function (data) {
                return (
                  <Badge
                    category={
                      ScheduleCategoriesColors[
                        data.priority as BadgeCategories
                      ] || "Neutral"
                    }
                    value={
                      t.schedule?.[data.priority as keyof typeof t.schedule] ||
                      t.components.unknown
                    }
                  />
                );
              },
            },
            category: {
              label: t.schedule.category,
              maxWidth: 96,
              handler: function (data) {
                return (
                  <Badge
                    category="Neutral"
                    value={
                      t.schedule?.[data.category as keyof typeof t.schedule] ||
                      t.components.unknown
                    }
                  />
                );
              },
            },
            title: {
              label: t.schedule.title,
            },
            description: {
              label: t.schedule.description,
              handler: function (data) {
                return data.description ? (
                  <span>{(data?.description as string) || ""}</span>
                ) : (
                  <i style={{ color: "var(--textLight)" }}>
                    {t.stacks.no_description}
                  </i>
                );
              },
            },
            start: {
              label: t.schedule.start_date,
              maxWidth: 160,
              handler: function (data) {
                const startSameDayEnd = isSameDay(
                  data.start as string,
                  data.end as string,
                );
                const isStartDay = isEqual(
                  data.start as string,
                  startOfDay(data.start as string),
                );
                const datetime =
                  startSameDayEnd || isStartDay
                    ? instanceDate(data.start as string)
                    : instanceDateTime(data.start as string, true);
                return datetime;
              },
            },
            end: {
              label: t.schedule.end_date,
              maxWidth: 160,
              handler: function (data) {
                const startSameDayStart = isSameDay(
                  data.start as string,
                  data.end as string,
                );
                const isEndDay = isEqual(
                  data.end as string,
                  endOfDay(data.end as string),
                );
                const datetime = startSameDayStart ? (
                  <i style={{ color: "var(--textLight)" }}>
                    {t.schedule.same_day}
                  </i>
                ) : isEndDay ? (
                  instanceDate(data.end as string)
                ) : (
                  instanceDateTime(data.end as string, true)
                );
                return datetime;
              },
            },
            user: {
              label: t.components.user,
              handler: function (data) {
                const userFinded = users?.find(function (user) {
                  return user.id === data.userId;
                });
                return (
                  <Tooltip
                    content={t.components[userFinded?.role || "collaborator"]}
                  >
                    <Profile
                      photoCircle
                      photoSize={3}
                      padding={false}
                      styles={{ lineHeight: 1 }}
                      photo={userFinded?.photo || ""}
                      description={userFinded?.email || ""}
                      name={userFinded?.name || t.components.unknown}
                    />
                  </Tooltip>
                );
              },
            },
          }}
        />
      </div>
    </React.Fragment>
  );
};

const DashboardProducts = function ({
  interval,
  hidden,
}: DashboardIntervalProps & DashboardHiddenProps) {
  const t = useTranslate();
  const play = useSounds();
  const { instance, token, workspaceId } = useSystem();

  const [loading, setLoading] = useState<boolean>(true);

  const [statsSales, setStatsSales] = useState<TypeStats>({});
  const [statsProducts, setStatsProducts] = useState<TypeStats>({});
  const [statsPurchases, setStatsPurchases] = useState<TypeStats>({});
  const [chartSalesPurchases, setChartSalesPurchases] = useState<
    { date: string; sales: number; purchases: number }[]
  >([]);

  // fetch stats
  useAsync(
    async function () {
      try {
        setLoading(true);
        const responseProductsStats = await apis.Product.stats<TypeStats>(
          token,
          instance.name,
          {
            dateStart: interval.start
              ? interval.start.toISOString()
              : startOfYear(new Date()).toISOString(),
            dateEnd: interval.end
              ? interval.end.toISOString()
              : endOfDay(new Date()).toISOString(),
          },
          workspaceId,
        );
        if (
          !responseProductsStats.data?.result ||
          responseProductsStats.status !== 200
        ) {
          play("alert");
          toast.warning(t.toast.warning_error, {
            description: t.stacks.no_find_item,
          });
          console.error(
            "[src/pages/Dashboard.tsx]",
            responseProductsStats.data,
          );
          return;
        }
        setStatsProducts(responseProductsStats.data.result);

        const responseSalesStats = await apis.Sale.stats<TypeStats>(
          token,
          instance.name,
          {
            dateStart: interval.start
              ? interval.start.toISOString()
              : startOfYear(new Date()).toISOString(),
            dateEnd: interval.end
              ? interval.end.toISOString()
              : endOfDay(new Date()).toISOString(),
          },
          workspaceId,
        );
        if (!responseSalesStats.data?.result) {
          play("alert");
          toast.warning(t.toast.warning_error, {
            description: t.stacks.no_find_item,
          });
          console.warn("[src/pages/Dashboard.tsx]", responseSalesStats.data);
          return;
        }
        setStatsSales(responseSalesStats.data.result);

        const responsePurchasesStats = await apis.Purchase.stats<TypeStats>(
          token,
          instance.name,
          {
            dateStart: interval.start
              ? interval.start.toISOString()
              : startOfYear(new Date()).toISOString(),
            dateEnd: interval.end
              ? interval.end.toISOString()
              : endOfDay(new Date()).toISOString(),
          },
          workspaceId,
        );
        if (!responsePurchasesStats.data?.result) {
          play("alert");
          toast.warning(t.toast.warning_error, {
            description: t.stacks.no_find_item,
          });
          console.warn(
            "[src/pages/Dashboard.tsx]",
            responsePurchasesStats.data,
          );
          return;
        }
        setStatsPurchases(responsePurchasesStats.data.result);
      } catch (err) {
        play("alert");
        toast.error(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        console.error("[src/pages/Dashboard.tsx]", err);
      } finally {
        setLoading(false);
      }
      return;
    },
    [interval, workspaceId],
  );

  // fetch charts
  useAsync(
    async function () {
      try {
        const response = await apis.Dashboard.ChartSalesPurchases<
          { date: string; sales: number; purchases: number }[]
        >(instance.name, token, workspaceId, {
          dateStart: interval.start
            ? interval.start.toISOString()
            : startOfYear(new Date()).toISOString(),
          dateEnd: interval.end
            ? interval.end.toISOString()
            : endOfDay(new Date()).toISOString(),
        });
        if (!response.data?.result) {
          play("alert");
          toast.warning(t.toast.warning_error, {
            description: t.stacks.no_find_item,
          });
          return;
        }
        setChartSalesPurchases(response.data.result);
      } catch (err) {
        play("alert");
        toast.error(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        console.error("[src/pages/Dashboard.tsx]", err);
      }
      return;
    },
    [interval, workspaceId],
  );

  return (
    <React.Fragment>
      <Horizontal internal={1} className="itemsCenter">
        <h3 className="flex1">{t.product.products}</h3>
        <Button
          category="Neutral"
          Icon={FunnelSimple}
          text={t.components.filter}
        />
      </Horizontal>

      <Horizontal internal={1}>
        <Stats
          hidden={hidden}
          loading={loading}
          title={t.dashboard.stats_products_title}
          Icon={Package}
          value={statsProducts?.quantity || 0}
          valueUnit={t.product.products.toLowerCase()}
          footer={t.dashboard.stats_products_description}
        />

        <Stats
          hidden={hidden}
          loading={loading}
          title={t.dashboard.stats_products_active_title}
          Icon={Package}
          category="Success"
          value={statsProducts?.productsActive || 0}
          valueUnit={`${t.components.of} ${statsProducts?.quantity || 0} ${t.product.products.toLowerCase()}`}
          footer={t.dashboard.stats_products_active_description}
        />

        <Stats
          hidden={hidden}
          loading={loading}
          title={t.dashboard.stats_products_inactive_title}
          Icon={Package}
          category="Danger"
          value={statsProducts?.productsInactive || 0}
          valueUnit={`${t.components.of} ${statsProducts?.quantity || 0} ${t.product.products.toLowerCase()}`}
          footer={t.dashboard.stats_products_inactive_description}
        />
      </Horizontal>

      <Horizontal internal={1}>
        <Stats
          hidden={hidden}
          loading={loading}
          title={t.sale.stats_quantity}
          Icon={Tag}
          value={statsSales?.quantity || 0}
          valueUnit={t.sale.sales.toLowerCase()}
          footer={t.sale.stats_quantity_description}
        />

        <Stats
          hidden={hidden}
          loading={loading}
          title={t.sale.stats_value}
          Icon={Tag}
          category="Success"
          value={statsSales?.salesWon || 0}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
          footer={t.sale.stats_value_description}
        />

        <Stats
          hidden={hidden}
          loading={loading}
          title={t.sale.stats_pending}
          Icon={Tag}
          category="Warning"
          value={statsSales?.salesPending || 0}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
          footer={t.sale.stats_pending_description}
        />

        <Stats
          hidden={hidden}
          loading={loading}
          title={t.sale.stats_lost}
          Icon={Tag}
          category="Danger"
          value={-statsSales?.salesLost || 0}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
          footer={t.sale.stats_lost_description}
        />
      </Horizontal>

      <Horizontal internal={1}>
        <Stats
          hidden={hidden}
          loading={loading}
          title={t.purchase.stats_quantity}
          Icon={ShoppingBagOpen}
          value={statsPurchases?.quantity || 0}
          valueUnit={t.purchase.purchases.toLowerCase()}
          footer={t.purchase.stats_quantity_description}
        />

        <Stats
          hidden={hidden}
          loading={loading}
          title={t.purchase.stats_successful}
          Icon={ShoppingBagOpen}
          category="Success"
          value={statsPurchases?.purchasesSuccessful || 0}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
          footer={t.purchase.stats_successful_description}
        />

        <Stats
          hidden={hidden}
          loading={loading}
          title={t.purchase.stats_pending}
          Icon={ShoppingBagOpen}
          category="Warning"
          value={statsPurchases?.purchasesPending || 0}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
          footer={t.purchase.stats_pending_description}
        />

        <Stats
          hidden={hidden}
          loading={loading}
          title={t.purchase.stats_unsuccessful}
          Icon={ShoppingBagOpen}
          category="Danger"
          value={-statsPurchases?.purchasesUnsuccessful || 0}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
          footer={t.purchase.stats_unsuccessful_description}
        />
      </Horizontal>

      <div>
        <Wrapper
          title={t.dashboard.chart_sales_purchases_title}
          description={t.dashboard.chart_sales_purchases_description}
        >
          <ChartLine
            id="chart_sales_purchases"
            height={320}
            gridProps={{
              stroke: "#dedede",
              strokeWidth: 1,
              vertical: false,
              horizontal: true,
            }}
            margin={{ top: 8, right: 8, left: 48, bottom: 16 }}
            lines={[
              {
                type: "monotone",
                name: t.sale.sales,
                dataKey: "sale",
                stroke: "var(--chartColor3)",
                strokeDasharray: "1",
                strokeWidth: 4,
                dot: false,
                formatter: (value: number) =>
                  new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(value),
              },
              {
                type: "monotone",
                name: t.purchase.purchases,
                dataKey: "purchase",
                stroke: "var(--chartColor6)",
                strokeDasharray: "1",
                strokeWidth: 4,
                dot: false,
                formatter: (value: number) =>
                  new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(value),
              },
            ]}
            axisXProps={{
              stroke: "#bebebe",
              strokeWidth: 1,
              dataKey: "date",
              tick: { fontSize: 10, fill: "#222", angle: 30, dy: 16 } as Record<
                string,
                number | string
              >,
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
            data={chartSalesPurchases}
          />
        </Wrapper>
      </div>
    </React.Fragment>
  );
};

const DashboardServices = function ({
  hidden,
  interval,
}: DashboardIntervalProps & DashboardHiddenProps) {
  const t = useTranslate();
  const play = useSounds();
  const { instance, token, workspaceId } = useSystem();

  const [loading, setLoading] = useState<boolean>(true);

  const [statsOrders, setStatsOrders] = useState<TypeStats>({});
  const [statsServices, setStatsServices] = useState<TypeStats>({});

  // fetch stats
  useAsync(
    async function () {
      try {
        setLoading(true);

        const responseServicesStats = await apis.Service.stats<TypeStats>(
          token,
          instance.name,
          {
            dateStart: interval.start
              ? interval.start.toISOString()
              : startOfYear(new Date()).toISOString(),
            dateEnd: interval.end
              ? interval.end.toISOString()
              : endOfDay(new Date()).toISOString(),
          },
          workspaceId,
        );
        if (!responseServicesStats.data?.result) {
          play("alert");
          toast.warning(t.toast.warning_error, {
            description: t.stacks.no_find_item,
          });
          console.warn("[src/pages/Dashboard.tsx]", responseServicesStats.data);
          return;
        }
        setStatsServices(responseServicesStats.data.result);

        const responseOrdersStats = await apis.Order.stats<TypeStats>(
          token,
          instance.name,
          {
            dateStart: interval.start
              ? interval.start.toISOString()
              : startOfYear(new Date()).toISOString(),
            dateEnd: interval.end
              ? interval.end.toISOString()
              : endOfDay(new Date()).toISOString(),
          },
          workspaceId,
        );
        if (!responseOrdersStats.data?.result) {
          play("alert");
          toast.warning(t.toast.warning_error, {
            description: t.stacks.no_find_item,
          });
          console.warn("[src/pages/Dashboard.tsx]", responseOrdersStats.data);
          return;
        }
        setStatsOrders(responseOrdersStats.data.result);
      } catch (err) {
        play("alert");
        toast.error(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        console.error("[src/pages/Dashboard.tsx]", err);
      } finally {
        setLoading(false);
      }
      return;
    },
    [interval, workspaceId],
  );

  return (
    <React.Fragment>
      <Horizontal internal={1} className="itemsCenter">
        <h3 className="flex1">{t.service.services}</h3>
        <Button
          category="Neutral"
          Icon={FunnelSimple}
          text={t.components.filter}
        />
      </Horizontal>

      <Horizontal internal={1}>
        <Stats
          hidden={hidden}
          loading={loading}
          title={t.dashboard.stats_services_title}
          Icon={Toolbox}
          value={statsServices.quantity || 0}
          valueUnit={t.service.services.toLowerCase()}
          footer={t.dashboard.stats_services_description}
        />

        <Stats
          hidden={hidden}
          loading={loading}
          title={t.dashboard.stats_services_active_title}
          Icon={Toolbox}
          category="Success"
          value={statsServices.servicesActive || 0}
          valueUnit={`${t.components.of} ${statsServices.quantity || 0} ${t.service.services.toLowerCase()}`}
          footer={t.dashboard.stats_services_active_description}
        />

        <Stats
          hidden={hidden}
          loading={loading}
          title={t.dashboard.stats_services_inactive_title}
          Icon={Toolbox}
          category="Danger"
          value={statsServices.servicesInactive || 0}
          valueUnit={`${t.components.of} ${statsServices.quantity || 0} ${t.service.services.toLowerCase()}`}
          footer={t.dashboard.stats_services_inactive_description}
        />
      </Horizontal>

      <Horizontal internal={1}>
        <Stats
          hidden={hidden}
          loading={loading}
          Icon={Blueprint}
          title={t.order.stats_quantity}
          value={statsOrders.quantity || 0}
          valueUnit={t.order.orders.toLowerCase()}
          footer={t.order.stats_quantity_description}
        />

        <Stats
          hidden={hidden}
          loading={loading}
          category="Success"
          Icon={Blueprint}
          title={t.order.stats_completed}
          value={statsOrders.ordersCompleted || 0}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
          footer={t.order.stats_completed_description}
        />

        <Stats
          hidden={hidden}
          loading={loading}
          category="Warning"
          Icon={Blueprint}
          title={t.order.stats_pending}
          value={statsOrders.ordersPending || 0}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
          footer={t.order.stats_pending_description}
        />

        <Stats
          hidden={hidden}
          loading={loading}
          category="Danger"
          Icon={Blueprint}
          title={t.order.stats_canceled}
          value={-statsOrders.ordersCanceled || 0}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
          footer={t.order.stats_canceled_description}
        />
      </Horizontal>

      <Horizontal internal={1}>
        <Stats
          hidden={hidden}
          loading={loading}
          Icon={Truck}
          title={t.dashboard.stats_vehicles_title}
          value={0}
          valueUnit={t.vehicle.vehicle.toLowerCase()}
          footer={t.dashboard.stats_vehicles_description}
        />

        <Stats
          hidden={hidden}
          loading={loading}
          category="Warning"
          Icon={Truck}
          title={t.dashboard.stats_vehicles_fuel}
          value={0}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
          footer={t.dashboard.stats_vehicles_fuel_description}
        />

        <Stats
          hidden={hidden}
          loading={loading}
          category="Warning"
          Icon={Truck}
          title={t.dashboard.stats_vehicles_maintenance}
          value={-0}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
          footer={t.dashboard.stats_vehicles_maintenance_description}
        />
      </Horizontal>
    </React.Fragment>
  );
};

const Dashboard = function () {
  const t = useTranslate();
  const play = useSounds();
  const { OpenDialog } = useDialog();
  const { user, token, instance, workspaceId, workspaces } = useSystem();

  const [interval, setInterval] = useState<TypeInputInterval>({
    start: subDays(new Date(), 30),
    end: endOfDay(new Date()),
  });

  const [greeting, setGreeting] = useState<string>("");
  const [hidden, setHidden] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<TypeAccount[]>([]);

  // get greeting
  useEffect(function () {
    const random = Math.floor(Math.random() * 6) + 1;
    const hour = new Date().getHours();
    let greetingText = "";
    // dawn -> hour 06 - 09
    if (hour >= 6 && hour <= 9)
      greetingText =
        t.dashboard[`good_dawn_${random}` as keyof typeof t.dashboard];
    // morning -> hour 10 - 11
    if (hour >= 10 && hour <= 11)
      greetingText =
        t.dashboard[`good_morning_${random}` as keyof typeof t.dashboard];
    // afternoon -> hour 12 - 17
    if (hour >= 12 && hour <= 17)
      greetingText =
        t.dashboard[`good_afternoon_${random}` as keyof typeof t.dashboard];
    // night -> hour 18 - 23
    if (hour >= 18 && hour <= 23)
      greetingText =
        t.dashboard[`good_night_${random}` as keyof typeof t.dashboard];
    // rest -> hour 00 - 05
    if (hour >= 0 && hour <= 5)
      greetingText =
        t.dashboard[`good_rest_${random}` as keyof typeof t.dashboard];
    const userName = user.name.split(" ")[0];
    const greetingNamed = greetingText.replace("{{name}}", userName);
    setGreeting(greetingNamed);
    return;
  }, []);

  // fetch accounts
  useAsync(
    async function () {
      try {
        const response = await apis.Account.list<
          ApiResponsePaginate<TypeAccount>
        >(
          token,
          instance.name,
          {
            pageSize: 999,
            pageCurrent: 1,
            orderField: "createdAt",
            orderSort: "asc",
          },
          workspaceId,
        );
        if (!response.data?.result || response.status !== 200) {
          play("alert");
          toast.warning(t.toast.warning_error, {
            description: t.stacks.no_find_item,
          });
          return;
        }
        setAccounts(response.data.result.items);
      } catch (err) {
        play("alert");
        toast.error(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        console.error("[src/pages/Dashboard.tsx]", err);
        return;
      }
    },
    [workspaceId],
  );

  return (
    <React.Fragment>
      <Horizontal internal={1}>
        <h1>{greeting}</h1>
      </Horizontal>

      <Horizontal internal={1}>
        <InputSelect
          label=""
          empty=""
          disabled
          value={workspaceId}
          styles={{ maxWidth: 200 }}
          options={workspaces.map(function (workspace) {
            return {
              id: workspace.id,
              value: workspace.id,
              text: workspace.name,
            };
          })}
        />

        <InputSelect
          label=""
          empty=""
          styles={{ maxWidth: 200 }}
          value={accounts[0]?.id || ""}
          options={accounts.map(function (account) {
            return {
              id: account.id,
              value: account.id,
              text: account.name,
            };
          })}
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

        <Tooltip content={t.components.hide_and_show}>
          <Button
            Icon={hidden ? EyeSlash : Eye}
            IconSize={18}
            category={hidden ? "Info" : "Neutral"}
            text={hidden ? t.components.show : t.components.hide}
            onClick={function () {
              setHidden(!hidden);
              return;
            }}
          />
        </Tooltip>

        <Button
          category="Neutral"
          Icon={PaintBrush}
          IconSize={18}
          text={t.dashboard.customize}
        />

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
            onlyIcon
            disabled
            text=""
            category="Neutral"
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

      <DashboardExchangesIndexes />

      <DashboardFinancial hidden={hidden} />

      <DashboardSchedules interval={interval} hidden={hidden} />

      <DashboardProducts interval={interval} hidden={hidden} />

      <DashboardServices interval={interval} hidden={hidden} />

      <div style={{ minHeight: 128 }}></div>
    </React.Fragment>
  );
};

export default Dashboard;
