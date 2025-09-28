import {
  Tag,
  Package,
  FunnelSimple,
  ShoppingBagOpen,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import React, { useState } from "react";
import { endOfDay, startOfYear } from "date-fns";

// apis
import apis from "../../apis";

// types
import {
  TypeStats,
  DashboardHiddenProps,
  DashboardIntervalProps,
} from "../../types/Dashboard";

// hooks
import useAsync from "../../hooks/useAsync";
import useSounds from "../../hooks/useSounds";
import useSystem from "../../hooks/useSystem";
import useTranslate from "../../hooks/useTranslate";

// components
import Stats from "../../components/stats/Stats";
import Button from "../../components/buttons/Button";
import Wrapper from "../../components/wrapper/Wrapper";
import { ChartLine } from "../../components/charts/Chart";
import { Horizontal } from "../../components/aligns/Align";

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
          animation
          hidden={hidden}
          loading={loading}
          title={t.dashboard.stats_products_title}
          Icon={Package}
          value={statsProducts?.quantity || 0}
          valueUnit={t.product.products.toLowerCase()}
          footer={t.dashboard.stats_products_description}
        />

        <Stats
          animation
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
          animation
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
          animation
          hidden={hidden}
          loading={loading}
          title={t.sale.stats_quantity}
          Icon={Tag}
          value={statsSales?.quantity || 0}
          valueUnit={t.sale.sales.toLowerCase()}
          footer={t.sale.stats_quantity_description}
        />

        <Stats
          animation
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
          animation
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
          animation
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
          animation
          hidden={hidden}
          loading={loading}
          title={t.purchase.stats_quantity}
          Icon={ShoppingBagOpen}
          value={statsPurchases?.quantity || 0}
          valueUnit={t.purchase.purchases.toLowerCase()}
          footer={t.purchase.stats_quantity_description}
        />

        <Stats
          animation
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
          animation
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
          animation
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
                stroke: "var(--successColor)",
                strokeDasharray: "1",
                strokeWidth: 4,
                dot: false,
                formatter: (value: number) =>
                  new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(value || 0),
              },
              {
                type: "monotone",
                name: t.purchase.purchases,
                dataKey: "purchase",
                stroke: "var(--infoColor)",
                strokeDasharray: "1",
                strokeWidth: 4,
                dot: false,
                formatter: (value: number) =>
                  new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(value || 0),
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
                }).format(value || 0),
            }}
            data={chartSalesPurchases}
          />
        </Wrapper>
      </div>
    </React.Fragment>
  );
};

export default DashboardProducts;
