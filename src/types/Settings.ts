export type TypeSettingsTheme = "light" | "dark";

export type TypeSettingsLanguage = "pt_BR" | "en";

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
  language: TypeSettingsLanguage;
  timezone: number;
};
