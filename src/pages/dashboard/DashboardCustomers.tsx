import { toast } from "sonner";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { endOfDay, startOfYear } from "date-fns";
import { FunnelSimple, IdentificationCard } from "@phosphor-icons/react";

// apis
import apis from "../../apis";

// types
import {
  TypeStats,
  DashboardHiddenProps,
  DashboardIntervalProps,
} from "../../types/Dashboard";
import { ApiPreference } from "../../types/Api";
import { TypeCustomer } from "../../types/Customers";

// hooks
import useAsync from "../../hooks/useAsync";
import useSounds from "../../hooks/useSounds";
import useSystem from "../../hooks/useSystem";
import useCurrency from "../../hooks/useCurrency";
import useDateTime from "../../hooks/useDateTime";
import useTranslate from "../../hooks/useTranslate";

// components
import Stats from "../../components/stats/Stats";
import Badge from "../../components/badges/Badge";
import Button from "../../components/buttons/Button";
import Profile from "../../components/profiles/Profile";
import Tooltip from "../../components/tooltips/Tooltip";
import Callout from "../../components/callouts/Callout";
import { useDialog } from "../../components/dialogs/Dialog";
import { InputSelect } from "../../components/inputs/Input";
import Table, { TableData } from "../../components/tables/Table";
import { Horizontal, Vertical } from "../../components/aligns/Align";

const DashboardCustomers = function ({
  hidden,
  interval,
}: DashboardHiddenProps & DashboardIntervalProps) {
  const t = useTranslate();
  const play = useSounds();
  const Currency = useCurrency();
  const navigate = useNavigate();
  const { instance } = useSystem();
  const { instanceDateTime } = useDateTime();
  const { OpenDialog, CloseDialog } = useDialog();
  const { user, users, token, preferences, workspaceId, setPreferences } =
    useSystem();

  const [loading, setLoading] = useState<boolean>(true);
  const [customers, setCustomers] = useState<TypeCustomer[]>([]);
  const [statsCustomers, setStatsCustomers] = useState<TypeStats>({});

  const preferencesHidden =
    preferences?.hidden && typeof preferences?.hidden === "object"
      ? preferences?.hidden
      : {};

  // fetch stats
  useAsync(
    async function () {
      try {
        setLoading(true);
        const responseCustomersStats = await apis.Customer.stats<TypeStats>(
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
          !responseCustomersStats.data?.result ||
          responseCustomersStats.status !== 200
        ) {
          play("alert");
          toast.warning(t.toast.warning_error, {
            description: t.stacks.no_find_item,
          });
          console.error(
            "[src/pages/dashboard/DashboardCustomers.tsx]",
            responseCustomersStats.data,
          );
          return;
        }
        setStatsCustomers(responseCustomersStats.data.result);
      } catch (err) {
        play("alert");
        toast.error(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        console.error("[src/pages/dashboard/DashboardCustomers.tsx]", err);
      } finally {
        setLoading(false);
      }
      return;
    },
    [interval, token, instance, workspaceId],
  );

  // fetch customers
  useAsync(
    async function () {
      if (!statsCustomers?.salesValues) return;
      const ids = Object.keys(statsCustomers.salesValues);
      if (ids.length === 0) return;
      const idsString = ids.join(",");
      try {
        const responseCustomers = await apis.Customer.fetch<TypeCustomer[]>(
          token,
          instance.name,
          {
            ids: idsString,
          },
          workspaceId,
        );
        if (!responseCustomers.data?.result) {
          play("alert");
          toast.warning(t.toast.warning_error, {
            description: t.stacks.no_find_item,
          });
          return;
        }
        setCustomers(responseCustomers.data.result);
        return;
      } catch (err) {
        play("alert");
        toast.error(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        console.error("[src/pages/dashboard/DashboardCustomers.tsx]", err);
      }
      return;
    },
    [token, instance, statsCustomers.salesValues, workspaceId],
  );

  const filterAction = function () {
    OpenDialog({
      width: 520,
      nonFooter: true,
      category: "Success",
      title: `${t.components.filter}: ${t.customer.customers}`,
      description: function () {
        const [hidden, setHidden] = useState<Record<string, boolean>>({
          ...preferencesHidden,
          customersStats: preferencesHidden?.customersStats || false,
          customersCharts: preferencesHidden?.customersCharts || false,
          customersTable: preferencesHidden?.customersTable || false,
        });

        return (
          <Vertical internal={1}>
            <InputSelect
              empty={t.stacks.no_option}
              label={t.customer.customer}
              value={String(hidden?.customersStats)}
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
                newHidden.customersStats = event.target?.value === "true";
                setHidden(newHidden);
                return;
              }}
            />

            <InputSelect
              empty={t.stacks.no_option}
              label={t.components.charts}
              value={String(hidden?.customersCharts)}
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
                newHidden.customersCharts = event.target?.value === "true";
                setHidden(newHidden);
                return;
              }}
            />

            <InputSelect
              empty={t.stacks.no_option}
              label={t.components.table}
              value={String(hidden?.customersTable)}
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
                newHidden.customersTable = event.target?.value === "true";
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
        <h3 className="flex1">{t.customer.customers}</h3>
        <Button
          category="Neutral"
          Icon={FunnelSimple}
          onClick={filterAction}
          text={t.components.filter}
        />
      </Horizontal>

      {!preferencesHidden?.customersStats && (
        <React.Fragment>
          <Horizontal internal={1}>
            <Stats
              animation
              hidden={hidden}
              loading={loading}
              title={t.dashboard.stats_customers_title}
              Icon={IdentificationCard}
              category="Info"
              value={statsCustomers.quantity || 0}
              valueUnit={t.customer.customers.toLowerCase()}
              footer={t.dashboard.stats_customers_description}
            />

            <Stats
              animation
              hidden={hidden}
              loading={loading}
              title={t.dashboard.stats_customers_sales_average}
              Icon={IdentificationCard}
              value={statsCustomers.averageSalesValues || 0}
              valueLocale={instance.language}
              valueOptions={{ style: "currency", currency: instance.currency }}
              footer={t.dashboard.stats_customers_sales_average_description}
            />

            <Stats
              animation
              hidden={hidden}
              loading={loading}
              title={t.dashboard.stats_customers_sales_frequency}
              Icon={IdentificationCard}
              value={statsCustomers.averageSalesFrequency || 0}
              valueLocale={instance.language}
              valueOptions={{ style: "percent" }}
              footer={t.dashboard.stats_customers_sales_frequency_description}
            />
          </Horizontal>

          <Horizontal internal={1}>
            <Stats
              animation
              hidden={hidden}
              loading={loading}
              title={t.dashboard.stats_customers_interation}
              Icon={IdentificationCard}
              category="Info"
              value={statsCustomers.interactions || 0}
              valueUnit={t.customer.interactions.toLowerCase()}
              footer={t.dashboard.stats_customers_interation_description}
            />

            <Stats
              animation
              hidden={hidden}
              loading={loading}
              title={t.dashboard.stats_customers_orders_average}
              Icon={IdentificationCard}
              value={statsCustomers.averageOrderValues || 0}
              valueLocale={instance.language}
              valueOptions={{ style: "currency", currency: instance.currency }}
              footer={t.dashboard.stats_customers_orders_average_description}
            />

            <Stats
              animation
              hidden={hidden}
              loading={loading}
              title={t.dashboard.stats_customers_orders_frequency}
              Icon={IdentificationCard}
              value={statsCustomers.averageOrderFrequency || 0}
              valueLocale={instance.language}
              valueOptions={{ style: "percent" }}
              footer={t.dashboard.stats_customers_orders_frequency_description}
            />
          </Horizontal>
        </React.Fragment>
      )}

      {!preferencesHidden?.customersTable && (
        <Horizontal styles={{ maxHeight: 400 }}>
          <Table
            border
            noSelect
            loading={loading}
            data={customers as TableData[]}
            styles={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
            stylesBody={{ overflowY: "scroll" }}
            columns={{
              status: {
                label: t.components.status,
                maxWidth: "96px",
                handler: function (data) {
                  return (
                    <Badge
                      category={data.status ? "Success" : "Danger"}
                      value={
                        data.status
                          ? t.components.active
                          : t.components.inactive
                      }
                    />
                  );
                },
              },
              name: {
                label: t.customer.name,
                handler: function (data) {
                  return (
                    <div
                      className="cursor"
                      onClick={function () {
                        navigate(`/f/customers/inspect/${data.id}`);
                        return;
                      }}
                    >
                      <Profile
                        photoSize={4}
                        padding={false}
                        name={data.name as string}
                        photo={(data.photo as string) ?? undefined}
                        description={(data?.representativeName as string) || ""}
                      />
                    </div>
                  );
                },
              },
              sales: {
                label: t.sale.sales,
                maxWidth: 180,
                handler: function (data) {
                  const average = statsCustomers?.salesValues?.[
                    data.id as keyof typeof statsCustomers.salesValues
                  ]
                    ? Number(
                        statsCustomers?.salesValues?.[
                          data.id as keyof typeof statsCustomers.salesValues
                        ],
                      )
                    : 0;
                  const frequency = statsCustomers?.salesFrequency?.[
                    data.id as keyof typeof statsCustomers.salesFrequency
                  ]
                    ? Number(
                        statsCustomers?.salesFrequency?.[
                          data.id as keyof typeof statsCustomers.salesFrequency
                        ],
                      )
                    : 0;
                  return (
                    <div>
                      <div>{`${Currency(average)}/${t.sale.sale}`}</div>
                      <div>{`${frequency} ${t.sale.sales}`}</div>
                    </div>
                  );
                },
              },
              orders: {
                label: t.order.orders,
                maxWidth: 180,
                handler: function (data) {
                  const average = statsCustomers?.orderValues?.[
                    data.id as keyof typeof statsCustomers.orderValues
                  ]
                    ? Number(
                        statsCustomers?.orderValues?.[
                          data.id as keyof typeof statsCustomers.orderValues
                        ],
                      )
                    : 0;
                  const frequency = statsCustomers?.orderFrequency?.[
                    data.id as keyof typeof statsCustomers.orderFrequency
                  ]
                    ? Number(
                        statsCustomers?.orderFrequency?.[
                          data.id as keyof typeof statsCustomers.orderFrequency
                        ],
                      )
                    : 0;
                  return (
                    <div>
                      <div>{`${Currency(average)}/${t.order.order}`}</div>
                      <div>{`${frequency} ${t.order.orders}`}</div>
                    </div>
                  );
                },
              },
              user: {
                label: t.components.user,
                maxWidth: 200,
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
              createdAt: {
                label: t.components.created_at,
                maxWidth: 180,
                handler: function (data) {
                  const datetime = instanceDateTime(data.createdAt as string);
                  return datetime;
                },
              },
            }}
          />
        </Horizontal>
      )}

      <div>
        <Callout
          Icon={IdentificationCard}
          IconSize={16}
          category="Warning"
          text={t.callout.only_new_customers}
          styles={{ fontSize: "var(--textSmall)" }}
        />
      </div>
    </React.Fragment>
  );
};

export default DashboardCustomers;
