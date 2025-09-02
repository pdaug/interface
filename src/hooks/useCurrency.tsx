// hooks
import useSystem from "./useSystem";

// types
import { TypeInstance } from "../types/Instance";

const useCurrency = function (instanceExternal?: TypeInstance) {
  const { instance } = useSystem();

  const language = instance?.language || instanceExternal?.language || "en";
  const currency = instance?.currency || instanceExternal?.currency || "USD";

  const Currency = function (value: string | number): string {
    let number =
      typeof value === "string"
        ? parseFloat(value.replace(",", ".").replace(/[^\d.-]/g, ""))
        : value;
    if (isNaN(number)) number = 0;
    return number.toLocaleString(language, {
      style: "currency",
      currency,
    });
  };

  return Currency;
};

export default useCurrency;
