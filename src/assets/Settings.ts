export const SettingsCompanyActivities = [
  "industry",
  "commerce",
  "services",
  "agribusiness",
  "construction",
  "logistics_and_transportation",
  "education",
  "healthcare",
  "it_and_software",
  "financial_services",
  "advertising_and_communication",
  "public_sector",
  "non_profits_and_foundations",
  "import_and_export",
  "energy_and_utilities",
  "mining_and_extraction",
];

export const SettingsAddressState = [
  { code: "AC", name: "Acre" },
  { code: "AL", name: "Alagoas" },
  { code: "AP", name: "Amapá" },
  { code: "AM", name: "Amazonas" },
  { code: "BA", name: "Bahia" },
  { code: "CE", name: "Ceará" },
  { code: "DF", name: "Distrito Federal" },
  { code: "ES", name: "Espírito Santo" },
  { code: "GO", name: "Goiás" },
  { code: "MA", name: "Maranhão" },
  { code: "MT", name: "Mato Grosso" },
  { code: "MS", name: "Mato Grosso do Sul" },
  { code: "MG", name: "Minas Gerais" },
  { code: "PA", name: "Pará" },
  { code: "PB", name: "Paraíba" },
  { code: "PR", name: "Paraná" },
  { code: "PE", name: "Pernambuco" },
  { code: "PI", name: "Piauí" },
  { code: "RJ", name: "Rio de Janeiro" },
  { code: "RN", name: "Rio Grande do Norte" },
  { code: "RS", name: "Rio Grande do Sul" },
  { code: "RO", name: "Rondônia" },
  { code: "RR", name: "Roraima" },
  { code: "SC", name: "Santa Catarina" },
  { code: "SP", name: "São Paulo" },
  { code: "SE", name: "Sergipe" },
  { code: "TO", name: "Tocantins" },
];

export const SettingsTimezone = [
  { name: "UTC-10 (Pacific/Honolulu)", offset: -10 },
  { name: "UTC-09 (America/Anchorage)", offset: -9 },
  { name: "UTC-08 (America/Los_Angeles)", offset: -8 },
  { name: "UTC-07 (America/Denver)", offset: -7 },
  { name: "UTC-06 (America/Chicago)", offset: -6 },
  { name: "UTC-05 (America/New_York)", offset: -5 },
  { name: "UTC-04 (America/Santo_Domingo)", offset: -4 },
  { name: "UTC-03 (America/Sao_Paulo)", offset: -3 },
  { name: "UTC-02 (America/Noronha)", offset: -2 },
  { name: "UTC-01 (Atlantic/Azores)", offset: -1 },
  { name: "UTC 00 (Europe/London)", offset: 0 },
  { name: "UTC+01 (Europe/Paris)", offset: 1 },
  { name: "UTC+02 (Africa/Cairo)", offset: 2 },
  { name: "UTC+03 (Europe/Moscow)", offset: 3 },
  { name: "UTC+04 (Asia/Dubai)", offset: 4 },
  { name: "UTC+05 (Asia/Karachi)", offset: 5 },
  { name: "UTC+06 (Asia/Dhaka)", offset: 6 },
  { name: "UTC+07 (Asia/Bangkok)", offset: 7 },
  { name: "UTC+08 (Asia/Shanghai)", offset: 8 },
  { name: "UTC+09 (Asia/Tokyo)", offset: 9 },
  { name: "UTC+10 (Australia/Sydney)", offset: 10 },
  { name: "UTC+12 (Pacific/Auckland)", offset: 12 },
];

export const SettingsTheme = ["light", "dark"] as const;

export const SettingsLanguages = [
  {
    id: "pt",
    value: "pt",
    text: "Português",
  },
  {
    id: "es",
    value: "es",
    text: "Español",
    disabled: true,
  },
  {
    id: "en",
    value: "en",
    text: "English",
  },
];

export const SettingsCurrencies = [
  {
    id: "BRL",
    value: "BRL",
    text: "BRL - Real (R$)",
  },
  {
    id: "USD",
    value: "USD",
    text: "USD - Dollar ($)",
  },
  {
    id: "EUR",
    value: "EUR",
    text: "EUR - Euro (€)",
  },
  {
    id: "GBP",
    value: "GBP",
    text: "GBP - Pound Sterling (£)",
  },
  {
    id: "BTC",
    value: "BTC",
    text: "BTC - Bitcoin (BTC)",
  },
];
