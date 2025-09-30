import {
  format,
  isEqual,
  endOfDay,
  isSameDay,
  startOfDay,
  startOfYear,
  eachDayOfInterval,
} from "date-fns";
import { toast } from "sonner";
import React, { useState } from "react";
import { FunnelSimple, CalendarDots } from "@phosphor-icons/react";

// apis
import apis from "../../apis";

// assets
import { ScheduleCategoriesColors } from "../../assets/Schedules";

// types
import {
  DashboardHiddenProps,
  DashboardIntervalProps,
} from "../../types/Dashboard";
import { TypeSchedule } from "../../types/Schedules";
import { ApiPreference, ApiResponsePaginate } from "../../types/Api";

// hooks
import useAsync from "../../hooks/useAsync";
import useSounds from "../../hooks/useSounds";
import useSystem from "../../hooks/useSystem";
import useDateTime from "../../hooks/useDateTime";
import useTranslate from "../../hooks/useTranslate";

// components
import Stats from "../../components/stats/Stats";
import Button from "../../components/buttons/Button";
import Wrapper from "../../components/wrapper/Wrapper";
import Profile from "../../components/profiles/Profile";
import Tooltip from "../../components/tooltips/Tooltip";
import Callout from "../../components/callouts/Callout";
import { Horizontal, Vertical } from "../../components/aligns/Align";
import Table, { TableData } from "../../components/tables/Table";
import { ChartBar, ChartPie } from "../../components/charts/Chart";
import Badge, { BadgeCategories } from "../../components/badges/Badge";
import { useDialog } from "../../components/dialogs/Dialog";
import { InputSelect } from "../../components/inputs/Input";

const DashboardSchedules = function ({
  interval,
  hidden,
}: DashboardHiddenProps & DashboardIntervalProps) {
  const t = useTranslate();
  const play = useSounds();
  const { OpenDialog, CloseDialog } = useDialog();
  const { instanceDateTime, instanceDate } = useDateTime();
  const {
    user,
    users,
    token,
    instance,
    workspaceId,
    preferences,
    setPreferences,
  } = useSystem();

  const [loading, setLoading] = useState<boolean>(true);
  const [schedules, setSchedules] = useState<TypeSchedule[]>([]);

  const preferencesHidden =
    preferences?.hidden && typeof preferences?.hidden === "object"
      ? preferences?.hidden
      : {};

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

  const schedulesLow =
    schedules?.filter((schedule) => schedule.priority === "low")?.length || 0;
  const schedulesMedium =
    schedules?.filter((schedule) => schedule.priority === "medium")?.length ||
    0;
  const schedulesHigh =
    schedules?.filter((schedule) => schedule.priority === "high")?.length || 0;
  const schedulesCritical =
    schedules?.filter((schedule) => schedule.priority === "critical")?.length ||
    0;

  const schedulesTask =
    schedules?.filter((schedule) => schedule.category === "task")?.length || 0;
  const schedulesNote =
    schedules?.filter((schedule) => schedule.category === "note")?.length || 0;
  const schedulesEvent =
    schedules?.filter((schedule) => schedule.category === "event")?.length || 0;
  const schedulesRemind =
    schedules?.filter((schedule) => schedule.category === "remind")?.length ||
    0;
  const schedulesDeadline =
    schedules?.filter((schedule) => schedule.category === "deadline")?.length ||
    0;
  const schedulesWork =
    schedules?.filter((schedule) => schedule.category === "work")?.length || 0;
  const schedulesReserved =
    schedules?.filter((schedule) => schedule.category === "reserved")?.length ||
    0;
  const schedulesMeeting =
    schedules?.filter((schedule) => schedule.category === "meeting")?.length ||
    0;

  const allDates = eachDayOfInterval({
    start: interval.start || startOfYear(new Date()),
    end: interval.end || endOfDay(new Date()),
  }).map((d) => format(d, "yyyy-MM-dd"));

  const chartSchedules = allDates?.map(function (date) {
    const items = schedules?.filter((s) => isSameDay(s.start, date));
    return {
      date,
      items: items?.length || 0,
    };
  });

  const filterAction = function () {
    OpenDialog({
      width: 520,
      nonFooter: true,
      category: "Success",
      title: `${t.components.filter}: ${t.financial.financial}`,
      description: function () {
        const [hidden, setHidden] = useState<Record<string, boolean>>({
          ...preferencesHidden,
          schedulesStats: preferencesHidden?.schedulesStats || false,
          schedulesCharts: preferencesHidden?.schedulesCharts || false,
          schedulesTable: preferencesHidden?.schedulesTable || false,
        });

        return (
          <Vertical internal={1}>
            <InputSelect
              empty={t.stacks.no_option}
              label={t.schedule.schedules}
              value={String(hidden?.schedulesStats)}
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
                newHidden.schedulesStats = event.target?.value === "true";
                setHidden(newHidden);
                return;
              }}
            />

            <InputSelect
              empty={t.stacks.no_option}
              label={t.schedule.charts}
              value={String(hidden?.schedulesCharts)}
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
                newHidden.schedulesCharts = event.target?.value === "true";
                setHidden(newHidden);
                return;
              }}
            />

            <InputSelect
              empty={t.stacks.no_option}
              label={t.schedule.table}
              value={String(hidden?.schedulesTable)}
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
                newHidden.schedulesTable = event.target?.value === "true";
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
                      "[src/pages/dashboard/DashboardSchedules.tsx]",
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
        <h3 className="flex1">{t.schedule.schedules}</h3>
        <Button
          category="Neutral"
          Icon={FunnelSimple}
          text={t.components.filter}
          onClick={filterAction}
        />
      </Horizontal>

      {!preferencesHidden?.schedulesStats && (
        <React.Fragment>
          <Horizontal internal={1}>
            <Stats
              animation
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
              animation
              hidden={hidden}
              loading={loading}
              title={t.dashboard.stats_schedules_low}
              Icon={CalendarDots}
              category="Success"
              value={schedulesLow}
              valueUnit={t.components.items.toLowerCase()}
              styles={{ display: "flex" }}
            />

            <Stats
              animation
              hidden={hidden}
              loading={loading}
              title={t.dashboard.stats_schedules_medium}
              Icon={CalendarDots}
              category="Info"
              value={schedulesMedium}
              valueUnit={t.components.items.toLowerCase()}
              styles={{ display: "flex" }}
            />

            <Stats
              animation
              hidden={hidden}
              loading={loading}
              title={t.dashboard.stats_schedules_high}
              Icon={CalendarDots}
              category="Warning"
              value={schedulesHigh}
              valueUnit={t.components.items.toLowerCase()}
              styles={{ display: "flex" }}
            />

            <Stats
              animation
              hidden={hidden}
              loading={loading}
              title={t.dashboard.stats_schedules_critical}
              Icon={CalendarDots}
              category="Danger"
              value={schedulesCritical}
              valueUnit={t.components.items.toLowerCase()}
              styles={{ display: "flex" }}
            />
          </Horizontal>

          <Horizontal internal={1}>
            <Stats
              animation
              hidden={hidden}
              loading={loading}
              title={t.schedule.task}
              category="Success"
              value={schedulesTask}
              valueUnit={t.components.items.toLowerCase()}
            />

            <Stats
              animation
              hidden={hidden}
              loading={loading}
              title={t.schedule.note}
              category="Success"
              value={schedulesNote}
              valueUnit={t.components.items.toLowerCase()}
            />

            <Stats
              animation
              hidden={hidden}
              loading={loading}
              title={t.schedule.event}
              category="Info"
              value={schedulesEvent}
              valueUnit={t.components.items.toLowerCase()}
            />

            <Stats
              animation
              hidden={hidden}
              loading={loading}
              title={t.schedule.remind}
              category="Info"
              value={schedulesRemind}
              valueUnit={t.components.items.toLowerCase()}
            />

            <Stats
              animation
              hidden={hidden}
              loading={loading}
              title={t.schedule.deadline}
              category="Warning"
              value={schedulesDeadline}
              valueUnit={t.components.items.toLowerCase()}
            />

            <Stats
              animation
              hidden={hidden}
              loading={loading}
              title={t.schedule.work}
              category="Warning"
              value={schedulesWork}
              valueUnit={t.components.items.toLowerCase()}
            />

            <Stats
              animation
              hidden={hidden}
              loading={loading}
              title={t.schedule.reserved}
              category="Danger"
              value={schedulesReserved}
              valueUnit={t.components.items.toLowerCase()}
            />

            <Stats
              animation
              hidden={hidden}
              loading={loading}
              title={t.schedule.meeting}
              category="Danger"
              value={schedulesMeeting}
              valueUnit={t.components.items.toLowerCase()}
            />
          </Horizontal>
        </React.Fragment>
      )}

      {!preferencesHidden?.schedulesCharts && (
        <React.Fragment>
          <Horizontal internal={1}>
            <Wrapper
              title={t.dashboard.chart_schedules_priority}
              description={t.dashboard.chart_schedules_priority_description}
            >
              <ChartPie
                id="chart_schedules_priority"
                height={240}
                gridProps={{
                  stroke: "#dedede",
                  strokeWidth: 1,
                  vertical: false,
                  horizontal: true,
                }}
                pie={{
                  cx: "50%",
                  cy: "50%",
                  dataKey: "value",
                  innerRadius: "50%",
                  outerRadius: "100%",
                  paddingAngle: 2,
                  pieces: [
                    { fill: "var(--successColor)" },
                    { fill: "var(--infoColor)" },
                    { fill: "var(--warningColor)" },
                    { fill: "var(--dangerColor)" },
                  ],
                }}
                data={[
                  {
                    name: t.dashboard.stats_schedules_low,
                    date: "low",
                    value: schedulesLow,
                  },
                  {
                    name: t.dashboard.stats_schedules_medium,
                    date: "medium",
                    value: schedulesMedium,
                  },
                  {
                    name: t.dashboard.stats_schedules_high,
                    date: "high",
                    value: schedulesHigh,
                  },
                  {
                    name: t.dashboard.stats_schedules_critical,
                    date: "critical",
                    value: schedulesCritical,
                  },
                ]}
              />
            </Wrapper>

            <Wrapper
              title={t.dashboard.chart_schedules_category}
              description={t.dashboard.chart_schedules_category_description}
            >
              <ChartPie
                id="chart_schedules_category"
                height={240}
                gridProps={{
                  stroke: "#dedede",
                  strokeWidth: 1,
                  vertical: false,
                  horizontal: true,
                }}
                pie={{
                  cx: "50%",
                  cy: "50%",
                  dataKey: "value",
                  innerRadius: "50%",
                  outerRadius: "100%",
                  paddingAngle: 2,
                  pieces: [
                    { fill: "var(--successColor)" },
                    { fill: "var(--successDark)" },
                    { fill: "var(--infoColor)" },
                    { fill: "var(--infoDark)" },
                    { fill: "var(--warningColor)" },
                    { fill: "var(--warningDark)" },
                    { fill: "var(--dangerColor)" },
                    { fill: "var(--dangerDark)" },
                  ],
                }}
                data={[
                  {
                    name: t.schedule.task,
                    date: "task",
                    value: schedulesTask,
                  },
                  {
                    name: t.schedule.note,
                    date: "note",
                    value: schedulesNote,
                  },
                  {
                    name: t.schedule.event,
                    date: "event",
                    value: schedulesEvent,
                  },
                  {
                    name: t.schedule.remind,
                    date: "remind",
                    value: schedulesRemind,
                  },
                  {
                    name: t.schedule.deadline,
                    date: "deadline",
                    value: schedulesDeadline,
                  },
                  {
                    name: t.schedule.work,
                    date: "work",
                    value: schedulesWork,
                  },
                  {
                    name: t.schedule.reserved,
                    date: "reserved",
                    value: schedulesReserved,
                  },
                  {
                    name: t.schedule.meeting,
                    date: "meeting",
                    value: schedulesMeeting,
                  },
                ]}
              />
            </Wrapper>
          </Horizontal>

          <Horizontal internal={1}>
            <Wrapper
              title={t.dashboard.chart_schedules_time}
              description={t.dashboard.chart_schedules_time_description}
            >
              <ChartBar
                id="chart_schedule_time"
                height={240}
                margin={{ top: 8, right: 8, left: 8, bottom: 16 }}
                gridProps={{
                  stroke: "#dedede",
                  strokeWidth: 1,
                  vertical: false,
                  horizontal: true,
                }}
                bars={[
                  {
                    dataKey: "items",
                    fill: "var(--infoColor)",
                    radius: [4, 4, 0, 0],
                    barSize: 32,
                    barSizeMax: 32,
                  },
                ]}
                axisXProps={{
                  stroke: "#bebebe",
                  strokeWidth: 1,
                  dataKey: "date",
                  tick: {
                    fontSize: 10,
                    fill: "var(--textColor)",
                    angle: 30,
                    dy: 16,
                  } as Record<string, number | string>,
                  interval: 0,
                  padding: { left: 15, right: 15 },
                }}
                axisYProps={{
                  tick: {
                    fontSize: 10,
                    fill: "var(--textColor)",
                  },
                  stroke: "",
                  strokeWidth: 0,
                  width: 24,
                }}
                data={chartSchedules}
              />
            </Wrapper>
          </Horizontal>
        </React.Fragment>
      )}

      {!preferencesHidden?.schedulesTable && (
        <React.Fragment>
          <Horizontal styles={{ maxHeight: 400 }}>
            <Table
              border
              noSelect
              loading={loading}
              data={
                schedules?.filter(
                  (schedule) => schedule.priority !== "none",
                ) as TableData[]
              }
              styles={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
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
                          t.schedule?.[
                            data.priority as keyof typeof t.schedule
                          ] || t.components.unknown
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
                          t.schedule?.[
                            data.category as keyof typeof t.schedule
                          ] || t.components.unknown
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
                        content={
                          t.components[userFinded?.role || "collaborator"]
                        }
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
          </Horizontal>

          <div>
            <Callout
              Icon={CalendarDots}
              IconSize={16}
              category="Warning"
              text={t.callout.only_schedules_with_priority}
              styles={{ fontSize: "var(--textSmall)" }}
            />
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default DashboardSchedules;
