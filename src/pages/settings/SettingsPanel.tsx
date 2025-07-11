import React, { useState } from "react";
import { Asterisk } from "@phosphor-icons/react";

// apis
import apis from "../../apis";

// types
import {
  TypeSettings,
  TypeSettingsLanguage,
  TypeSettingsTheme,
} from "../../types/Settings";

// assets
import {
  SettingsAddressState,
  SettingsCompanyActivities,
  SettingsTimezone,
} from "../../assets/Settings";
import { MaskPhone } from "../../assets/Mask";

// hooks
import useAsync from "../../hooks/useAsync";
import useSystem from "../../hooks/useSystem";
import useTranslate from "../../hooks/useTranslate";

// components
import Button from "../../components/buttons/Button";
import Wrapper from "../../components/wrapper/Wrapper";
import Callout from "../../components/callouts/Callout";
import { Horizontal, Vertical } from "../../components/aligns/Align";
import {
  Input,
  InputFile,
  InputMask,
  InputSelect,
} from "../../components/inputs/Input";

const SettingsPanel = function () {
  const t = useTranslate();
  const { instance } = useSystem();

  const [form, setForm] = useState<Partial<TypeSettings>>({
    companyName: "",
    companyDocument: "",
    companyPhone: "",
    companyMobile: "",
    companyEmail: "",
    companyWebsite: "",
    companyActivity: "",
    addressStreet: "",
    addressNumber: "",
    addressComplement: "",
    addressPostalCode: "",
    addressNeighborhood: "",
    addressCity: "",
    addressState: "",
    colorPrimary: "",
    colorSecondary: "",
    logo: "",
    logoLarge: "",
    favicon: "",
    theme: "light",
    language: "pt_BR",
    timezone: 0,
  });

  const FetchSettings = async function () {
    try {
      const response = await apis.Settings.get(instance.name);
      if (!response.data?.result) return;
      setForm(response.data.result);
      return;
    } catch (err) {
      console.error("[src/pages/settings/SettingsPanel.tsx]", err);
      return;
    }
  };

  useAsync(FetchSettings, []);

  return (
    <React.Fragment>
      <Horizontal>
        <h1>{t.settings.settings}</h1>
      </Horizontal>
      <div>
        <Vertical internal={1}>
          <Wrapper
            title={t.settings.title_preferences}
            description={t.settings.subtitle_preferences}
          >
            <Vertical internal={1}>
              <Horizontal internal={1}>
                <InputSelect
                  required
                  name="theme"
                  id="settings_theme"
                  value={form?.theme || "light"}
                  empty={t.stacks.no_option}
                  label={t.components.theme}
                  options={[
                    {
                      id: "light",
                      value: "light",
                      text: t.components.light,
                    },
                    {
                      id: "dark",
                      value: "dark",
                      text: t.components.dark,
                    },
                  ]}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.theme = (event.currentTarget?.value ||
                      "light") as TypeSettingsTheme;
                    setForm(newForm);
                    return;
                  }}
                />
                <InputSelect
                  required
                  name="theme"
                  id="settings_language"
                  empty={t.stacks.no_option}
                  value={form?.language || "en"}
                  label={t.components.language}
                  options={[
                    {
                      id: "pt_BR",
                      value: "pt_BR",
                      text: "Português",
                    },
                    {
                      id: "en",
                      value: "en",
                      text: "English",
                    },
                  ]}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.language = (event.currentTarget?.value ||
                      "en") as TypeSettingsLanguage;
                    setForm(newForm);
                    return;
                  }}
                />
                <InputSelect
                  required
                  name="timezone"
                  id="settings_timezone"
                  empty={t.stacks.no_option}
                  label={t.components.timezone}
                  value={String(form?.timezone)}
                  options={SettingsTimezone.map(function (timezone) {
                    return {
                      id: String(timezone.offset),
                      value: String(timezone.offset),
                      text: timezone.name,
                    };
                  })}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.timezone = Number(
                      event.currentTarget?.value || "0",
                    );
                    setForm(newForm);
                    return;
                  }}
                />
              </Horizontal>
              <Horizontal internal={1}>
                <InputSelect
                  required
                  name="datetime"
                  id="settings_datetime"
                  empty={t.stacks.no_option}
                  value={form?.datetime || "dd/MM/yyyy"}
                  label={t.components.datetime}
                  options={[
                    {
                      id: "dd/MM/yyyy",
                      value: "dd/MM/yyyy",
                      text: "dd/MM/yyyy",
                    },
                    {
                      id: "MM/dd/yyyy",
                      value: "MM/dd/yyyy",
                      text: "MM/dd/yyyy",
                    },
                    {
                      id: "yyyy-MM-dd",
                      value: "yyyy-MM-dd",
                      text: "yyyy-MM-dd",
                    },
                  ]}
                  onChange={function (event) {
                    return;
                  }}
                />
                <InputSelect
                  required
                  name="currency"
                  id="settings_currency"
                  empty={t.stacks.no_option}
                  value={form?.currency || "USD"}
                  label={t.components.currency}
                  options={[
                    {
                      id: "BRL",
                      value: "BRL",
                      text: "Real (BRL)",
                    },
                    {
                      id: "USD",
                      value: "USD",
                      text: "Dollar (USD)",
                    },
                  ]}
                  onChange={function (event) {
                    return;
                  }}
                />
              </Horizontal>
            </Vertical>
          </Wrapper>

          <Wrapper
            title={t.settings.title_apparence}
            description={t.settings.subtitle_apparence}
          >
            <Vertical internal={1}>
              <Horizontal internal={1}>
                <InputFile label="Ola" accept="image" />
                <InputSelect
                  required
                  name="status"
                  id="workspace_status"
                  empty={t.stacks.no_option}
                  value={""}
                  label={t.components.status}
                  options={[
                    {
                      id: "true",
                      value: "true",
                      text: t.components.active,
                    },
                    {
                      id: "false",
                      value: "false",
                      text: t.components.inactive,
                    },
                  ]}
                  onChange={function () {
                    return;
                  }}
                />
              </Horizontal>
            </Vertical>
          </Wrapper>

          <Wrapper
            title={t.settings.title_company}
            description={t.settings.subtitle_company}
          >
            <Vertical internal={1}>
              <Horizontal internal={1}>
                <Input
                  min={1}
                  max={32}
                  required
                  name="companyName"
                  id="settings_company_name"
                  value={form?.companyName || ""}
                  label={t.settings.company_name}
                  placeholder={t.settings.company_name_placeholder}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.companyName = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
                <InputMask
                  required
                  mask={MaskPhone}
                  name="companyMobile"
                  id="settings_company_mobie"
                  value={form?.companyMobile || ""}
                  label={t.settings.company_mobile}
                  placeholder={t.settings.company_phone_placeholder}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.companyMobile = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
                <InputMask
                  mask={MaskPhone}
                  name="companyPhone"
                  id="settings_company_phone"
                  value={form?.companyPhone || ""}
                  label={t.settings.company_phone}
                  placeholder={t.settings.company_phone_placeholder}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.companyPhone = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
              </Horizontal>
              <Horizontal internal={1}>
                <Input
                  min={1}
                  max={1024}
                  type="url"
                  name="companyWebsite"
                  id="settings_company_website"
                  value={form?.companyWebsite || ""}
                  label={t.settings.company_website}
                  placeholder={t.settings.company_website_placeholder}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.companyWebsite = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
                <InputSelect
                  name="companyActivity"
                  empty={t.stacks.no_option}
                  id="settings_company_activity"
                  value={form?.companyActivity || ""}
                  label={t.settings.company_activity}
                  options={SettingsCompanyActivities.map(function (activies) {
                    return {
                      id: activies,
                      value: activies,
                      text:
                        t.settings?.[activies as keyof typeof t.settings] ||
                        "no_company_activity",
                    };
                  })}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.companyActivity = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
              </Horizontal>
            </Vertical>
          </Wrapper>

          <Wrapper
            title={t.settings.title_address}
            description={t.settings.subtitle_address}
          >
            <Vertical internal={1}>
              <Horizontal internal={1}>
                <Input
                  min={4}
                  max={64}
                  required
                  name="addressStreet"
                  id="settings_address_street"
                  value={form?.addressStreet || ""}
                  label={t.settings.address_street}
                  placeholder={t.settings.address_street_placeholder}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.addressStreet = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
                <Input
                  min={1}
                  max={8}
                  required
                  name="addressNumber"
                  id="settings_address_number"
                  value={form?.addressNumber || ""}
                  label={t.settings.address_number}
                  placeholder={t.settings.address_number_placeholder}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.addressNumber = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
              </Horizontal>
              <Horizontal internal={1}>
                <Input
                  max={32}
                  name="addressComplement"
                  id="settings_address_complement"
                  value={form?.addressComplement || ""}
                  label={t.settings.address_complement}
                  placeholder={t.settings.address_complement_placeholder}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.addressComplement =
                      event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
                <Input
                  min={4}
                  max={16}
                  required
                  name="addressPostalCode"
                  id="settings_address_postal_code"
                  value={form?.addressPostalCode || ""}
                  label={t.settings.address_postal_code}
                  placeholder={t.settings.address_postal_code_placeholder}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.addressPostalCode =
                      event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
                <Input
                  max={64}
                  name="addressNeighborhood"
                  id="settings_address_neighborhood"
                  value={form?.addressNeighborhood || ""}
                  label={t.settings.address_neighborhood}
                  placeholder={t.settings.address_neighborhood_placeholder}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.addressNeighborhood =
                      event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
              </Horizontal>
              <Horizontal internal={1}>
                <Input
                  min={2}
                  max={64}
                  required
                  name="addressCity"
                  id="settings_address_city"
                  value={form?.addressCity || ""}
                  label={t.settings.address_city}
                  placeholder={t.settings.address_city_placeholder}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.addressCity = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
                <InputSelect
                  required
                  name="addressState"
                  empty={t.stacks.no_option}
                  id="settings_address_state"
                  value={form?.addressState || ""}
                  label={t.settings.address_state}
                  options={SettingsAddressState.map(function (state) {
                    return {
                      id: state.code,
                      value: state.code,
                      text: state.name,
                    };
                  })}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.addressState = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
              </Horizontal>
            </Vertical>
          </Wrapper>
          <Callout
            Icon={Asterisk}
            category="Warning"
            text={t.stacks.required_fields}
            styles={{ fontSize: "var(--textSmall)" }}
          />
          <Wrapper>
            <Horizontal internal={1} styles={{ justifyContent: "flex-end" }}>
              <Button category="Neutral" text={t.components.cancel} />
              <Button category="Success" text={t.components.save} />
            </Horizontal>
          </Wrapper>
        </Vertical>
      </div>
    </React.Fragment>
  );
};

export default SettingsPanel;
