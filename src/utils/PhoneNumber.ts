import { parsePhoneNumberFromString } from "libphonenumber-js";

export default {
  Get: function (number: string) {
    const result = parsePhoneNumberFromString(number);
    return result;
  },
  Internacional: function (number: string): string {
    const result = parsePhoneNumberFromString(number);
    return result?.formatInternational() || number;
  },
};
