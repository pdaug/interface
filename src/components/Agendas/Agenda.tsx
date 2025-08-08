import { enUS, ptBR } from "date-fns/locale";
import { format, getDay, parse, startOfWeek } from "date-fns";
import { Calendar, CalendarProps, dateFnsLocalizer } from "react-big-calendar";

// styles
import "./Agenda.css";

// hooks
import useDateTime from "../../hooks/useDateTime";

// components
import Wrapper from "../wrapper/Wrapper";
import { Horizontal, Vertical } from "../aligns/Align";

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
  const { instanceTime } = useDateTime();

  return (
    <Wrapper styles={{ flex: "none" }} contentStyles={{ padding: "0.4rem" }}>
      <Horizontal internal={1} className="itemsCenter">
        <div className="agendaDate">
          <div className="agendaDateMonth">{format(date, "MMM")}</div>
          <div className="agendaDateDay">{format(date, "dd")}</div>
        </div>
        <Vertical internal={0.2} className="ellipses ">
          <div className="ellipses">{title || "no_title"}</div>
          <div
            className="ellipses"
            style={{
              color: "var(--textLight)",
              fontSize: "var(--textSmall)",
            }}
          >
            {description || "no_description"}
          </div>
          <div
            className="ellipses"
            style={{
              color: "var(--textLight)",
              fontSize: "var(--textSmall)",
            }}
          >
            {instanceTime(start, true)} - {instanceTime(end, true)}
          </div>
        </Vertical>
      </Horizontal>
    </Wrapper>
  );
};

export const Agenda = function (props: Omit<CalendarProps, "localizer">) {
  const locales = {
    "en-US": enUS,
    "pt-BR": ptBR,
  };

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });

  return <Calendar {...props} localizer={localizer} />;
};
