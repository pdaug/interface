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
import { ApiPreference } from "../../types/Api";

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
import { useDialog } from "../../components/dialogs/Dialog";
import { InputSelect } from "../../components/inputs/Input";
import { Horizontal, Vertical } from "../../components/aligns/Align";

const DashboardProducts = function ({
  interval,
  hidden,
}: DashboardIntervalProps & DashboardHiddenProps) {
  const t = useTranslate();
  const play = useSounds();
  const { OpenDialog, CloseDialog } = useDialog();
  const { user, token, instance, workspaceId, preferences, setPreferences } =
    useSystem();

  const [loading, setLoading] = useState<boolean>(true);

  const [statsSales, setStatsSales] = useState<TypeStats>({});
  const [statsProducts, setStatsProducts] = useState<TypeStats>({});
  const [statsPurchases, setStatsPurchases] = useState<TypeStats>({});
  const [chartSalesPurchases, setChartSalesPurchases] = useState<
    { date: string; sales: number; purchases: number }[]
  >([]);

  const preferencesHidden =
    preferences?.hidden && typeof preferences?.hidden === "object"
      ? preferences?.hidden
      : {};

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
            "[src/pages/dashboard/DashboardProducts.tsx]",
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
          console.warn(
            "[src/pages/dashboard/DashboardProducts.tsx]",
            responseSalesStats.data,
          );
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
            "[src/pages/dashboard/DashboardProducts.tsx]",
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
        console.error("[src/pages/dashboard/DashboardProducts.tsx]", err);
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
        console.error("[src/pages/dashboard/DashboardProducts.tsx]", err);
      }
      return;
    },
    [interval, workspaceId],
  );

  const filterAction = function () {
    OpenDialog({
      width: 520,
      nonFooter: true,
      category: "Success",
      title: `${t.components.filter}: ${t.product.products}`,
      description: function () {
        const [hidden, setHidden] = useState<Record<string, boolean>>({
          ...preferencesHidden,
          productsStats: preferencesHidden?.productsStats || false,
          productsSales: preferencesHidden?.productsSales || false,
          productsPurchases: preferencesHidden?.productsPurchases || false,
          productsCharts: preferencesHidden?.productsCharts || false,
        });

        return (
          <Vertical internal={1}>
            <InputSelect
              empty={t.stacks.no_option}
              label={t.product.products}
              value={String(hidden?.productsStats)}
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
                newHidden.productsStats = event.target?.value === "true";
                setHidden(newHidden);
                return;
              }}
            />

            <InputSelect
              empty={t.stacks.no_option}
              label={t.sale.sales}
              value={String(hidden?.productsSales)}
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
                newHidden.productsSales = event.target?.value === "true";
                setHidden(newHidden);
                return;
              }}
            />

            <InputSelect
              empty={t.stacks.no_option}
              label={t.purchase.purchases}
              value={String(hidden?.productsPurchases)}
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
                newHidden.productsPurchases = event.target?.value === "true";
                setHidden(newHidden);
                return;
              }}
            />

            <InputSelect
              empty={t.stacks.no_option}
              label={t.components.charts}
              value={String(hidden?.productsCharts)}
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
                newHidden.productsCharts = event.target?.value === "true";
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
                      "[src/pages/dashboard/DashboardProducts.tsx]",
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
        <h3 className="flex1">{t.product.products}</h3>
        <Button
          category="Neutral"
          Icon={FunnelSimple}
          text={t.components.filter}
          onClick={filterAction}
        />
      </Horizontal>

      {!preferencesHidden?.productsStats && (
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
      )}

      {!preferencesHidden?.productsSales && (
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
      )}

      {!preferencesHidden?.productsPurchases && (
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
      )}

      {!preferencesHidden?.productsCharts && (
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
                tick: {
                  fontSize: 10,
                  fill: "#222",
                  angle: 30,
                  dy: 16,
                } as Record<string, number | string>,
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
      )}
    </React.Fragment>
  );
};

export default DashboardProducts;
