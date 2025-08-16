import { enUS, ptBR } from "date-fns/locale";
import {
  endOfDay,
  format,
  getDay,
  isSameDay,
  isToday,
  isWithinInterval,
  parse,
  startOfDay,
  startOfWeek,
} from "date-fns";
import {
  Calendar,
  CalendarProps,
  dateFnsLocalizer,
  ToolbarProps,
} from "react-big-calendar";

// styles
import "./Agenda.css";

// types
import { TypeSchedulePriority } from "../../types/Schedules";

// components
import Wrapper from "../wrapper/Wrapper";
import { Horizontal, Vertical } from "../aligns/Align";

// hooks
import useSystem from "../../hooks/useSystem";
import useDateTime from "../../hooks/useDateTime";
import useTranslate from "../../hooks/useTranslate";
import Button from "../buttons/Button";

const locales = {
  "en-US": enUS,
  en: enUS,
  "pt-BR": ptBR,
  pt: ptBR,
};

export const AgendaEvents = {
  none: {
    background: "var(--backgroundColor)",
    border: "1px solid var(--borderColor)",
    secondary: "var(--textColor)",
    color: "var(--textColor)",
  },
  low: {
    background: "var(--successColor)",
    border: "1px solid var(--successDark)",
    secondary: "var(--successDark)",
    color: "white",
  },
  medium: {
    background: "var(--infoColor)",
    border: "1px solid var(--infoDark)",
    secondary: "var(--infoDark)",
    color: "white",
  },
  high: {
    background: "var(--warningColor)",
    border: "1px solid var(--warningDark)",
    secondary: "var(--warningDark)",
    color: "white",
  },
  critical: {
    background: "var(--dangerColor)",
    border: "1px solid var(--dangerDark)",
    secondary: "var(--dangerDark)",
    color: "white",
  },
};

export type AgendaDateProps = {
  priority: TypeSchedulePriority;
  date: Date;
  title: React.ReactNode;
  description: string;
  start: Date | number | string;
  end: Date | number | string;
};

export const AgendaDate = function ({
  priority,
  date,
  title,
  description,
  start,
  end,
}: AgendaDateProps) {
  const t = useTranslate();
  const { instance } = useSystem();
  const { instanceTime, instanceDateTime } = useDateTime();

  const locale = locales?.[instance.language as keyof typeof locales];

  const isSameDayStartEnd = isSameDay(start, end);

  const descriptionEllipses =
    description?.length > 128
      ? `${description.slice(0, 128)}...`
      : description || t.schedule.no_description;

  const AgendaEventPriority =
    AgendaEvents[(priority as keyof typeof AgendaEvents) || "none"];

  return (
    <Wrapper styles={{ flex: "none" }} contentStyles={{ padding: "0.4rem" }}>
      <Horizontal internal={1} className="itemsCenter">
        <div
          className="agendaDate"
          style={{ border: AgendaEventPriority.border }}
        >
          <div
            className="agendaDateMonth"
            style={{
              background: AgendaEventPriority.background,
              backgroundColor: AgendaEventPriority.background,
              borderBottom: AgendaEventPriority.border,
              color: AgendaEventPriority.color,
            }}
          >
            {format(date, "MMM", { locale })}
          </div>
          <div
            className="agendaDateDay"
            style={{
              color: AgendaEventPriority.secondary,
            }}
          >
            {format(date, "dd")}
          </div>
        </div>
        <Vertical internal={0.2} className="ellipses">
          <div className="ellipses">{title || t.schedule.no_title}</div>
          <div className="agendaDateDescription" style={{ textWrap: "wrap" }}>
            {descriptionEllipses}
          </div>
          <div className="ellipses agendaDateDescription">
            {isSameDayStartEnd ? (
              <span>
                {instanceTime(start)} - {instanceTime(end)}
              </span>
            ) : (
              <span>
                {instanceDateTime(start)} - {instanceDateTime(end)}
              </span>
            )}
          </div>
        </Vertical>
      </Horizontal>
    </Wrapper>
  );
};

export const Agenda = function (
  props: Omit<CalendarProps, "localizer"> & { selected: [Date, Date] },
) {
  const t = useTranslate();
  const { instance } = useSystem();

  const locale = locales?.[instance.language as keyof typeof locales];

  const localizer = dateFnsLocalizer({
    format: function (date: Date | number | string, formatStr: string) {
      return format(date, formatStr, { locale });
    },
    parse: function (dateString: string, formatStr: string, backupDate: Date) {
      return parse(dateString, formatStr, backupDate, { locale });
    },
    startOfWeek: function (date: Date) {
      return startOfWeek(date || new Date(), { locale });
    },
    getDay,
    locales,
  });

  const AgendaToolbar = function ({ label, onNavigate, date }: ToolbarProps) {
    return (
      <Horizontal
        internal={1}
        className="itemsCenter"
        styles={{ paddingBottom: "1rem" }}
      >
        <span className="flex1" style={{ textTransform: "capitalize" }}>
          {label}
        </span>

        <Horizontal internal={0.4}>
          <Button
            category="Neutral"
            text={t.schedule.previous}
            onClick={() => onNavigate("PREV")}
          />

          <Button
            category={isToday(date) ? "Info" : "Neutral"}
            text={t.schedule.today}
            onClick={() => onNavigate("TODAY")}
          />

          <Button
            category="Neutral"
            text={t.schedule.next}
            onClick={() => onNavigate("NEXT")}
          />
        </Horizontal>
      </Horizontal>
    );
  };

  return (
    <Calendar
      {...props}
      localizer={localizer}
      components={{
        toolbar: AgendaToolbar,
      }}
      messages={{
        allDay: t.schedule.all_day,
        previous: t.schedule.previous,
        next: t.schedule.next,
        today: t.schedule.today,
        month: t.schedule.month,
        week: t.schedule.week,
        day: t.schedule.day,
        agenda: t.schedule.agenda,
        date: t.schedule.date,
        time: t.schedule.time,
        event: t.schedule.event,
        noEventsInRange: t.schedule.no_events_in_range,
        showMore: (total) => `+${total} ${t.schedule.more}`,
      }}
      dayPropGetter={function (date) {
        const isSelected = isWithinInterval(date, {
          start: startOfDay(
            Array.isArray(props.selected) ? props.selected[0] : props.selected,
          ),
          end: endOfDay(
            Array.isArray(props.selected)
              ? props.selected[props.selected.length - 1]
              : props.selected,
          ),
        });
        if (isSelected) {
          return {
            className: "selected",
            style: {
              background: "var(--infoLight)",
              backgroundColor: "var(--infoLight)",
            },
          };
        }

        return {};
      }}
      eventPropGetter={function (event) {
        if (!("priority" in event) || !event.priority) return {};
        const isPast = new Date(event?.end || 0) < new Date();
        const AgendaEventPriority =
          AgendaEvents[
            (event?.priority as keyof typeof AgendaEvents) || "none"
          ];
        const style = {
          opacity: isPast ? 0.5 : 1,
          background: AgendaEventPriority.background,
          backgroundColor: AgendaEventPriority.background,
          border: AgendaEventPriority.border,
          color: AgendaEventPriority.color,
        };
        return { style };
      }}
    />
  );
};
