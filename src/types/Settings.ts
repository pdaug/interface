export type TypeSettingsTheme = "light" | "dark";

export type TypeSettingsLanguage = "pt" | "en" | "es";

export type TypeSettingsCurrency = "BRL" | "USD" | "BTC" | "EUR";

export type TypeSettingsDateFormat = "yyyy-MM-dd" | "dd/MM/yyyy" | "MM/dd/yyyy";

export type TypeSettings = {
  companyName: string;
  companyDocument: string;
  companyPhone: string;
  companyMobile: string;
  companyEmail: string;
  companyWebsite: string;
  companyActivity: string | null;
  addressStreet: string;
  addressNumber: string;
  addressComplement: string;
  addressPostalCode: string;
  addressNeighborhood: string;
  addressCity: string;
  addressState: string;
  colorPrimary: string;
  colorSecondary: string;
  logo: string | null;
  logoLarge: string | null;
  favicon: string | null;
  theme: TypeSettingsTheme;
  dateFormat: TypeSettingsDateFormat;
  language: TypeSettingsLanguage;
  timezone: number;
  currency: TypeSettingsCurrency;
};
