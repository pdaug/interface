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
import { ApiResponsePaginate } from "../../types/Api";
import { TypeInputInterval } from "../../types/Components";

// hooks
import useAsync from "../../hooks/useAsync";
import useSounds from "../../hooks/useSounds";
import useSystem from "../../hooks/useSystem";
import useTranslate from "../../hooks/useTranslate";

// components
import Button from "../../components/buttons/Button";
import Tooltip from "../../components/tooltips/Tooltip";
import { Horizontal } from "../../components/aligns/Align";
import Dropdown from "../../components/dropdowns/Dropdown";
import { useDialog } from "../../components/dialogs/Dialog";
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
