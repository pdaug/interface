import {
  Eye,
  EyeSlash,
  PaintBrush,
  QuestionMark,
  DownloadSimple,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { subDays, endOfDay } from "date-fns";
import React, { useEffect, useState } from "react";

// apis
import apis from "../../apis";

// types
import { TypeAccount } from "../../types/Account";
import { TypeInputInterval } from "../../types/Components";
import { ApiPreference, ApiResponsePaginate } from "../../types/Api";

// hooks
import useAsync from "../../hooks/useAsync";
import useSounds from "../../hooks/useSounds";
import useSystem from "../../hooks/useSystem";
import useTranslate from "../../hooks/useTranslate";

// components
import Button from "../../components/buttons/Button";
import Tooltip from "../../components/tooltips/Tooltip";
import Dropdown from "../../components/dropdowns/Dropdown";
import { useDialog } from "../../components/dialogs/Dialog";
import { Horizontal, Vertical } from "../../components/aligns/Align";
import { InputInterval, InputSelect } from "../../components/inputs/Input";

// sections
import DashboardProducts from "./DashboardProducts";
import DashboardServices from "./DashboardServices";
import DashboardSchedules from "./DashboardSchedules";
import DashboardFinancial from "./DashboardFinancial";
import DashboardExchangesIndexes from "./DashboardExchangesIndexes";

const Dashboard = function () {
  const t = useTranslate();
  const play = useSounds();
  const { OpenDialog, CloseDialog } = useDialog();
  const {
    user,
    token,
    instance,
    workspaces,
    workspaceId,
    preferences,
    setPreferences,
  } = useSystem();

  const [interval, setInterval] = useState<TypeInputInterval>({
    start: subDays(new Date(), 30),
    end: endOfDay(new Date()),
  });

  console.log({ startPreferences: preferences });

  const [greeting, setGreeting] = useState<string>("");
  const [hidden, setHidden] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<TypeAccount[]>([]);

  const preferencesHidden =
    preferences?.hidden && typeof preferences?.hidden === "object"
      ? preferences?.hidden
      : {};

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

  const customizeAction = function () {
    OpenDialog({
      width: 520,
      nonFooter: true,
      category: "Success",
      title: t.dashboard.customize,
      description: function () {
        const [hidden, setHidden] = useState<Record<string, boolean>>({
          exchanges: preferencesHidden?.exchanges || false,
          indexes: preferencesHidden?.indexes || false,

          inflows: preferencesHidden?.inflows || false,
          outflows: preferencesHidden?.outflows || false,

          schedulesStats: preferencesHidden?.schedulesStats || false,
          schedulesCharts: preferencesHidden?.schedulesCharts || false,
          schedulesTable: preferencesHidden?.schedulesTable || false,

          productsStats: preferencesHidden?.productsStats || false,
          productsSales: preferencesHidden?.productsSales || false,
          productsPurchases: preferencesHidden?.productsPurchases || false,
          productsCharts: preferencesHidden?.productsCharts || false,

          servicesStats: preferencesHidden?.servicesStats || false,
          servicesOrders: preferencesHidden?.servicesOrders || false,
          servicesVehicles: preferencesHidden?.servicesVehicles || false,
          servicesCharts: preferencesHidden?.servicesCharts || false,
        });

        return (
          <Vertical internal={1}>
            <InputSelect
              empty={t.stacks.no_option}
              label={t.dashboard.exchanges_indexes}
              value={String(hidden?.exchanges && hidden?.indexes)}
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
                if (event.target?.value === "true") {
                  newHidden.exchanges = true;
                  newHidden.indexes = true;
                } else {
                  newHidden.exchanges = false;
                  newHidden.indexes = false;
                }
                setHidden(newHidden);
                return;
              }}
            />

            <InputSelect
              empty={t.stacks.no_option}
              label={t.financial.financial}
              value={String(hidden?.inflows && hidden?.outflows)}
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
                if (event.target?.value === "true") {
                  newHidden.inflows = true;
                  newHidden.outflows = true;
                } else {
                  newHidden.inflows = false;
                  newHidden.outflows = false;
                }
                setHidden(newHidden);
                return;
              }}
            />

            <InputSelect
              empty={t.stacks.no_option}
              label={t.schedule.schedules}
              value={String(
                hidden?.schedulesStats &&
                  hidden?.schedulesCharts &&
                  hidden?.schedulesTable,
              )}
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
                if (event.target?.value === "true") {
                  newHidden.schedulesStats = true;
                  newHidden.schedulesCharts = true;
                  newHidden.schedulesTable = true;
                } else {
                  newHidden.schedulesStats = false;
                  newHidden.schedulesCharts = false;
                  newHidden.schedulesTable = false;
                }
                setHidden(newHidden);
                return;
              }}
            />

            <InputSelect
              empty={t.stacks.no_option}
              label={t.product.products}
              value={String(
                hidden?.productsStats &&
                  hidden?.productsSales &&
                  hidden?.productsPurchases &&
                  hidden?.productsCharts,
              )}
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
                if (event.target?.value === "true") {
                  newHidden.productsStats = true;
                  newHidden.productsSales = true;
                  newHidden.productsPurchases = true;
                  newHidden.productsCharts = true;
                } else {
                  newHidden.productsStats = false;
                  newHidden.productsSales = false;
                  newHidden.productsPurchases = false;
                  newHidden.productsCharts = false;
                }
                setHidden(newHidden);
                return;
              }}
            />

            <InputSelect
              empty={t.stacks.no_option}
              label={t.service.services}
              value={String(
                hidden?.servicesStats &&
                  hidden?.servicesOrders &&
                  hidden?.servicesVehicles &&
                  hidden?.servicesCharts,
              )}
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
                if (event.target?.value === "true") {
                  newHidden.servicesStats = true;
                  newHidden.servicesOrders = true;
                  newHidden.servicesVehicles = true;
                  newHidden.servicesCharts = true;
                } else {
                  newHidden.servicesStats = false;
                  newHidden.servicesOrders = false;
                  newHidden.servicesVehicles = false;
                  newHidden.servicesCharts = false;
                }
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
                    console.error("[src/pages/dashboard/index.tsx]", err);
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
          onClick={customizeAction}
        />

        <Tooltip content={t.components.hide_and_show}>
          <Button
            text=""
            onlyIcon
            Icon={hidden ? EyeSlash : Eye}
            IconSize={18}
            category={hidden ? "Info" : "Neutral"}
            // text={hidden ? t.components.show : t.components.hide}
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

      {!preferencesHidden?.exchanges && !preferencesHidden.indexes && (
        <DashboardExchangesIndexes />
      )}

      {!preferencesHidden?.inflows && !preferencesHidden?.outflows && (
        <DashboardFinancial hidden={hidden} />
      )}

      {!preferencesHidden?.schedulesStats &&
        !preferencesHidden?.schedulesCharts &&
        !preferencesHidden?.schedulesTable && (
          <DashboardSchedules interval={interval} hidden={hidden} />
        )}

      {!preferencesHidden?.productsStats &&
        !preferencesHidden?.productsSales &&
        !preferencesHidden?.productsPurchases &&
        !preferencesHidden?.productsCharts && (
          <DashboardProducts interval={interval} hidden={hidden} />
        )}

      {!preferencesHidden?.servicesStats &&
        !preferencesHidden?.servicesOrders &&
        !preferencesHidden?.servicesVehicles &&
        !preferencesHidden?.servicesCharts && (
          <DashboardServices interval={interval} hidden={hidden} />
        )}

      <div style={{ minHeight: 128 }}></div>
    </React.Fragment>
  );
};

export default Dashboard;
