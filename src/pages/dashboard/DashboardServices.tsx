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

// hooks
import useAsync from "../../hooks/useAsync";
import useSounds from "../../hooks/useSounds";
import useSystem from "../../hooks/useSystem";
import useTranslate from "../../hooks/useTranslate";

// components
import Stats from "../../components/stats/Stats";
import Button from "../../components/buttons/Button";
import { Horizontal } from "../../components/aligns/Align";

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

      <Horizontal internal={1}>
        <Stats
          animation
          hidden={hidden}
          loading={loading}
          Icon={Truck}
          title={t.dashboard.stats_vehicles_title}
          value={0}
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
          value={0}
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
          value={-0}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
          footer={t.dashboard.stats_vehicles_maintenance_description}
        />
      </Horizontal>
    </React.Fragment>
  );
};

export default DashboardServices;
