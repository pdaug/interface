import { format } from "date-fns";

// hooks
import useSystem from "./useSystem";

export const DateTimeFormat = {
  "yyyy-MM-dd": "yyyy-MM-dd HH:mm:ss",
  "dd/MM/yyyy": "dd/MM/yyyy HH:mm:ss",
  "MM/dd/yyyy": "MM/dd/yyyy HH:mm:ss",
};

export const TimeFormat = "HH:mm:ss";

const useDateTime = function () {
  const { instance } = useSystem();

  const instanceDate = function (source: Date | number | string): string {
    const datetime = new Date(source);
    const formatted = format(datetime, instance.dateFormat);
    return formatted;
  };

  const instanceTime = function (
    source: Date | number | string,
    removeSeconds?: boolean,
  ): string {
    const datetime = new Date(source);
    if (removeSeconds) {
      const formatted = format(datetime, TimeFormat.slice(0, -3));
      return formatted;
    }
    const formatted = format(datetime, TimeFormat);
    return formatted;
  };

  const instanceDateTime = function (
    source?: Date | number | string | null,
  ): string {
    const datetime = new Date(source || Date.now());
    const formatString = DateTimeFormat?.[instance.dateFormat];
    if (formatString) {
      const formatted = format(datetime, formatString);
      return formatted;
    }
    const formatted = datetime.toISOString();
    return formatted;
  };

  return { instanceDate, instanceTime, instanceDateTime };
};

export default useDateTime;
