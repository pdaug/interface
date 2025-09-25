import {
  Eye,
  Tag,
  Toolbox,
  Package,
  TrendUp,
  EyeSlash,
  TrendDown,
  Blueprint,
  PaintBrush,
  FunnelSimple,
  QuestionMark,
  DownloadSimple,
  ShoppingBagOpen,
  Truck,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { endOfDay, startOfYear, subDays } from "date-fns";
import React, { useEffect, useState } from "react";

// apis
import apis from "../apis";

// types
import { TypeAccount } from "../types/Account";
import { ApiResponsePaginate } from "../types/Api";
import { TypeInputInterval } from "../types/Components";

// hooks
import useAsync from "../hooks/useAsync";
import useSounds from "../hooks/useSounds";
import useSystem from "../hooks/useSystem";
import useTranslate from "../hooks/useTranslate";

// components
import Stats from "../components/stats/Stats";
import Button from "../components/buttons/Button";
import Wrapper from "../components/wrapper/Wrapper";
import Tooltip from "../components/tooltips/Tooltip";
import { ChartLine } from "../components/charts/Chart";
import Dropdown from "../components/dropdowns/Dropdown";
import { Horizontal } from "../components/aligns/Align";
import { useDialog } from "../components/dialogs/Dialog";
import { InputInterval, InputSelect } from "../components/inputs/Input";

type TypeStats = Record<string, number>;

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
  const [loading, setLoading] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<TypeAccount[]>([]);

  const [statsSales, setStatsSales] = useState<TypeStats>({});
  const [statsOrders, setStatsOrders] = useState<TypeStats>({});
  const [statsProducts, setStatsProducts] = useState<TypeStats>({});
  const [statsServices, setStatsServices] = useState<TypeStats>({});
  const [statsPurchases, setStatsPurchases] = useState<TypeStats>({});

  const [chartSalesPurchases, setChartSalesPurchases] = useState<
    { date: string; sales: number; purchases: number }[]
  >([]);

  // get greeting
  useEffect(function () {
    const random = Math.floor(Math.random() * 6) + 1;
    const hour = new Date().getHours();
    let greetingText = "";
    // dawn -> hour 06 - 09
    if (hour >= 6 && hour <= 9)
      greetingText =
        t.dashboard[`good_dawn_${random}` as keyof typeof t.dashboard];
    // morning -> hour 10 - 12
    if (hour >= 10 && hour <= 12)
      greetingText =
        t.dashboard[`good_morning_${random}` as keyof typeof t.dashboard];
    // afternoon -> hour 13 - 17
    if (hour >= 13 && hour <= 17)
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

        <Button
          category="Neutral"
          Icon={PaintBrush}
          IconSize={18}
          text={t.dashboard.customize}
        />

        <Tooltip content={t.components.hide_and_show}>
          <Button
            onlyIcon
            text=""
            category={hidden ? "Danger" : "Neutral"}
            Icon={hidden ? EyeSlash : Eye}
            onClick={function () {
              setHidden(!hidden);
              return;
            }}
          />
        </Tooltip>

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
          title={t.dashboard.stats_outflows_receive_title}
          Icon={TrendDown}
          category="Danger"
          value={1000}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
          footer={t.dashboard.stats_outflows_description}
        />

        <Stats
          hidden={hidden}
          loading={loading}
          title={t.dashboard.stats_outflows_title}
          Icon={TrendDown}
          value={50}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
          footer={t.dashboard.stats_outflows_receive_description}
        />

        <Stats
          hidden={hidden}
          loading={loading}
          title={t.dashboard.stats_outflows_late_title}
          Icon={TrendDown}
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
          value={statsSales?.salesLost || 0}
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
          value={statsPurchases?.purchasesUnsuccessful || 0}
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
                stroke: "var(--chartColor1)",
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
                stroke: "var(--chartColor4)",
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
          value={statsOrders.ordersCanceled || 0}
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
          value={0}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
          footer={t.dashboard.stats_vehicles_maintenance_description}
        />
      </Horizontal>

      <div style={{ minHeight: 128 }}></div>
    </React.Fragment>
  );
};

export default Dashboard;
