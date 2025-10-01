import { toast } from "sonner";
import React, { useState } from "react";
import { endOfDay, startOfYear } from "date-fns";
import { FunnelSimple, IdentificationCard } from "@phosphor-icons/react";

// apis
import apis from "../../apis";

// types
import { ApiPreference } from "../../types/Api";
import {
  DashboardHiddenProps,
  DashboardIntervalProps,
  TypeStats,
} from "../../types/Dashboard";

// hooks
import useAsync from "../../hooks/useAsync";
import useSounds from "../../hooks/useSounds";
import useSystem from "../../hooks/useSystem";
import useTranslate from "../../hooks/useTranslate";
import { useDialog } from "../../components/dialogs/Dialog";

// components
import Stats from "../../components/stats/Stats";
import Button from "../../components/buttons/Button";
import { InputSelect } from "../../components/inputs/Input";
import { Horizontal, Vertical } from "../../components/aligns/Align";

const DashboardCustomers = function ({
  hidden,
  interval,
}: DashboardHiddenProps & DashboardIntervalProps) {
  const t = useTranslate();
  const play = useSounds();
  const { instance } = useSystem();
  const { OpenDialog, CloseDialog } = useDialog();
  const { user, token, preferences, workspaceId, setPreferences } = useSystem();

  const [loading, setLoading] = useState<boolean>(true);

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
    [interval, workspaceId],
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
            title={t.dashboard.stats_customers_average}
            Icon={IdentificationCard}
            value={statsCustomers.conflicts || 0}
            valueLocale={instance.language}
            valueOptions={{ style: "currency", currency: instance.currency }}
            footer={t.dashboard.stats_customers_average_description}
          />

          <Stats
            animation
            hidden={hidden}
            loading={loading}
            title={t.dashboard.stats_customers_frequency}
            Icon={IdentificationCard}
            value={statsCustomers.interactions || 0}
            valueLocale={instance.language}
            valueOptions={{ style: "currency", currency: instance.currency }}
            footer={t.dashboard.stats_customers_frequency_description}
          />
        </Horizontal>
      )}
    </React.Fragment>
  );
};

export default DashboardCustomers;
