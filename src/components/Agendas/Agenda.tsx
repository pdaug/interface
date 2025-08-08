import { enUS, ptBR } from "date-fns/locale";
import { format, getDay, isSameDay, parse, startOfWeek } from "date-fns";
import { Calendar, CalendarProps, dateFnsLocalizer } from "react-big-calendar";

// styles
import "./Agenda.css";

// components
import Wrapper from "../wrapper/Wrapper";
import { Horizontal, Vertical } from "../aligns/Align";

// hooks
import useSystem from "../../hooks/useSystem";
import useDateTime from "../../hooks/useDateTime";
import useTranslate from "../../hooks/useTranslate";

const locales = {
  "en-US": enUS,
  en: enUS,
  "pt-BR": ptBR,
  pt: ptBR,
};

export type AgendaDateProps = {
  date: Date;
  title: React.ReactNode;
  description: string;
  start: Date | number | string;
  end: Date | number | string;
};

export const AgendaDate = function ({
  date,
  title,
  description,
  start,
  end,
}: AgendaDateProps) {
  const t = useTranslate();
  const { instance } = useSystem();
  const { instanceTime, instanceDateTime } = useDateTime();

  const isPast = new Date(end) < new Date();

  const locale = locales?.[instance.language as keyof typeof locales];

  const isSameDayStartEnd = isSameDay(start, end);

  const descriptionEllipses =
    description?.length > 128
      ? `${description.slice(0, 128)}...`
      : description || t.schedule.no_description;

  return (
    <Wrapper styles={{ flex: "none" }} contentStyles={{ padding: "0.4rem" }}>
      <Horizontal internal={1} className="itemsCenter">
        <div className={`agendaDate ${isPast ? "agendaDatePast" : ""}`}>
          <div className="agendaDateMonth">
            {format(date, "MMM", { locale })}
          </div>
          <div className="agendaDateDay">{format(date, "dd")}</div>
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

export const Agenda = function (props: Omit<CalendarProps, "localizer">) {
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

  return (
    <Calendar
      {...props}
      localizer={localizer}
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
      eventPropGetter={function (_event, _start, end) {
        const isPast = new Date(end) < new Date();
        const style = {
          opacity: isPast ? 0.4 : 1,
        };
        return { style };
      }}
    />
  );
};
