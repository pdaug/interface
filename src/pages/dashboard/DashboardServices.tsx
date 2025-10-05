import { toast } from "sonner";
import React, { useState } from "react";
import { endOfDay, startOfYear } from "date-fns";
import { Truck, Toolbox, Blueprint, FunnelSimple } from "@phosphor-icons/react";

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
import { useDialog } from "../../components/dialogs/Dialog";
import { InputSelect } from "../../components/inputs/Input";
import { Horizontal, Vertical } from "../../components/aligns/Align";

const DashboardServices = function ({
  hidden,
  interval,
}: DashboardIntervalProps & DashboardHiddenProps) {
  const t = useTranslate();
  const play = useSounds();
  const { OpenDialog, CloseDialog } = useDialog();
  const { user, token, instance, workspaceId, preferences, setPreferences } =
    useSystem();

  const [loading, setLoading] = useState<boolean>(true);

  const [statsOrders, setStatsOrders] = useState<TypeStats>({});
  const [statsServices, setStatsServices] = useState<TypeStats>({});
  const [statsVehicles, setStatsVehicles] = useState<TypeStats>({});

  const preferencesHidden =
    preferences?.hidden && typeof preferences?.hidden === "object"
      ? preferences?.hidden
      : {};

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

        const responseVehiclesStats = await apis.Vehicle.stats<TypeStats>(
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
        if (!responseVehiclesStats.data?.result) {
          play("alert");
          toast.warning(t.toast.warning_error, {
            description: t.stacks.no_find_item,
          });
          console.warn("[src/pages/Dashboard.tsx]", responseVehiclesStats.data);
          return;
        }
        setStatsVehicles(responseVehiclesStats.data.result);
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

  const filterAction = function () {
    OpenDialog({
      width: 520,
      nonFooter: true,
      category: "Success",
      title: `${t.components.filter}: ${t.service.services}`,
      description: function () {
        const [hidden, setHidden] = useState<Record<string, boolean>>({
          ...preferencesHidden,
          servicesStats: preferencesHidden?.servicesStats || false,
          servicesOrders: preferencesHidden?.servicesOrders || false,
          servicesVehicles: preferencesHidden?.servicesVehicles || false,
          servicesCharts: preferencesHidden?.servicesCharts || false,
        });

        return (
          <Vertical internal={1}>
            <InputSelect
              empty={t.stacks.no_option}
              label={t.service.services}
              value={String(hidden?.servicesStats)}
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
                newHidden.servicesStats = event.target?.value === "true";
                setHidden(newHidden);
                return;
              }}
            />

            <InputSelect
              empty={t.stacks.no_option}
              label={t.order.orders}
              value={String(hidden?.servicesOrders)}
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
                newHidden.servicesOrders = event.target?.value === "true";
                setHidden(newHidden);
                return;
              }}
            />

            <InputSelect
              empty={t.stacks.no_option}
              label={t.vehicle.vehicle}
              value={String(hidden?.servicesVehicles)}
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
                newHidden.servicesVehicles = event.target?.value === "true";
                setHidden(newHidden);
                return;
              }}
            />

            <InputSelect
              empty={t.stacks.no_option}
              label={t.components.charts}
              value={String(hidden?.servicesCharts)}
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
                newHidden.servicesCharts = event.target?.value === "true";
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
                      "[src/pages/dashboard/DashboardServices.tsx]",
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
        <h3 className="flex1">{t.service.services}</h3>
        <Button
          category="Neutral"
          Icon={FunnelSimple}
          text={t.components.filter}
          onClick={filterAction}
        />
      </Horizontal>

      {!preferencesHidden?.servicesStats && (
        <Horizontal internal={1}>
          <Stats
            animation
            hidden={hidden}
            loading={loading}
            title={t.dashboard.stats_services_title}
            Icon={Toolbox}
            value={statsServices.quantity || 0}
            valueUnit={t.service.services.toLowerCase()}
            footer={t.dashboard.stats_services_description}
          />

          <Stats
            animation
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
            animation
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
      )}

      {!preferencesHidden?.servicesOrders && (
        <Horizontal internal={1}>
          <Stats
            animation
            hidden={hidden}
            loading={loading}
            Icon={Blueprint}
            title={t.order.stats_quantity}
            value={statsOrders.quantity || 0}
            valueUnit={t.order.orders.toLowerCase()}
            footer={t.order.stats_quantity_description}
          />

          <Stats
            animation
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
            animation
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
            animation
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
      )}

      {!preferencesHidden?.servicesVehicles && (
        <Horizontal internal={1}>
          <Stats
            animation
            hidden={hidden}
            loading={loading}
            Icon={Truck}
            title={t.dashboard.stats_vehicles_title}
            value={statsVehicles.quantity || 0}
            valueUnit={t.vehicle.vehicle.toLowerCase()}
            footer={t.dashboard.stats_vehicles_description}
          />

          <Stats
            animation
            hidden={hidden}
            loading={loading}
            category="Warning"
            Icon={Truck}
            title={t.dashboard.stats_vehicles_fuel}
            value={-statsVehicles.refuels || 0}
            valueLocale={instance.language}
            valueOptions={{ style: "currency", currency: instance.currency }}
            footer={t.dashboard.stats_vehicles_fuel_description}
          />

          <Stats
            animation
            hidden={hidden}
            loading={loading}
            category="Warning"
            Icon={Truck}
            title={t.dashboard.stats_vehicles_maintenance}
            value={-statsVehicles.maintenances || 0}
            valueLocale={instance.language}
            valueOptions={{ style: "currency", currency: instance.currency }}
            footer={t.dashboard.stats_vehicles_maintenance_description}
          />
        </Horizontal>
      )}
    </React.Fragment>
  );
};

export default DashboardServices;
