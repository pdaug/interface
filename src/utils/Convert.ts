// assets
import { AssetsCurrencyUnit } from "../assets/Components";

const Convert = {
  stringToCurrency: function (currency: string) {
    return (
      AssetsCurrencyUnit?.[currency as keyof typeof AssetsCurrencyUnit] || "$"
    );
  },
  stringToMoney: function (language: string, currency: string, value: number) {
    return new Intl.NumberFormat(language, {
      style: "currency",
      currency,
    }).format(value);
  },
};

export default Convert;
