import { enUS, ptBR } from "date-fns/locale";
import { format, getDay, parse, startOfWeek } from "date-fns";
import { Calendar, CalendarProps, dateFnsLocalizer } from "react-big-calendar";

// styles
import "./Agenda.css";

const Agenda = function (props: Omit<CalendarProps, "localizer">) {
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

export default Agenda;
