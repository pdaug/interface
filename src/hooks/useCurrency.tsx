// hooks
import useSystem from "./useSystem";

const useCurrency = function () {
  const { instance } = useSystem();

  const Currency = function (value: string | number): string {
    let number =
      typeof value === "string"
        ? parseFloat(value.replace(",", ".").replace(/[^\d.-]/g, ""))
        : value;
    if (isNaN(number)) number = 0;
    return number.toLocaleString(instance.language, {
      style: "currency",
      currency: instance.currency,
    });
  };

  return Currency;
};

export default useCurrency;
