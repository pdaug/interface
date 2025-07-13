import { toast } from "sonner";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Asterisk } from "@phosphor-icons/react";

// apis
import apis from "../../apis";

// types
import {
  TypeSettings,
  TypeSettingsTheme,
  TypeSettingsLanguage,
  TypeSettingsCurrency,
  TypeSettingsDateFormat,
} from "../../types/Settings";

// assets
import {
  SettingsTheme,
  SettingsTimezone,
  SettingsLanguages,
  SettingsCurrencies,
  SettingsAddressState,
  SettingsCompanyActivities,
} from "../../assets/Settings";
import { MaskPhone, MaskPostalCode } from "../../assets/Mask";

// hooks
import useAsync from "../../hooks/useAsync";
import useSystem from "../../hooks/useSystem";
import useTranslate from "../../hooks/useTranslate";

// components
import {
  Input,
  InputFile,
  InputMask,
  InputColor,
  InputSelect,
} from "../../components/inputs/Input";
import Button from "../../components/buttons/Button";
import Wrapper from "../../components/wrapper/Wrapper";
import Callout from "../../components/callouts/Callout";
import { Horizontal, Vertical } from "../../components/aligns/Align";

const SettingsPanel = function () {
  const t = useTranslate();
  const navigate = useNavigate();
  const { token, instance, saveInstance } = useSystem();

  const [logoTemp, setLogoTemp] = useState<File | null>(null);
  const [faviconTemp, setFaviconTemp] = useState<File | null>(null);
  const [logoLargeTemp, setLogoLargeTemp] = useState<File | null>(null);
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
    colorPrimary: "#fafafa",
    colorSecondary: "#fafafa",
    logo: "",
    logoLarge: "",
    favicon: "",
    dateFormat: "yyyy-MM-dd",
    theme: "light",
    language: "pt",
    timezone: 0,
    currency: "BRL",
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

  const onCancel = function () {
    navigate("/f");
    return;
  };

  const onSubmit = async function () {
    try {
      let logoUrl = null;
      let faviconUrl = null;
      let logoLargeUrl = null;
      // upload logo temp
      if (logoTemp) {
        const responseUploadImage = await apis.Upload.image<string>(
          instance.name,
          token,
          {
            file: logoTemp,
            name: "logo",
            height: 512,
            width: 512,
            quality: 100,
          },
        );
        logoUrl = responseUploadImage.data?.result || null;
      }
      // upload favicon temp
      if (faviconTemp) {
        const responseUploadImage = await apis.Upload.image<string>(
          instance.name,
          token,
          {
            file: faviconTemp,
            name: "favicon",
            height: 48,
            width: 48,
            quality: 100,
          },
        );
        faviconUrl = responseUploadImage.data?.result || null;
      }
      // upload logo large temp
      if (logoLargeTemp) {
        const responseUploadImage = await apis.Upload.image<string>(
          instance.name,
          token,
          {
            file: logoLargeTemp,
            name: "logoLarge",
            height: 512,
            width: 1024,
            quality: 100,
          },
        );
        logoLargeUrl = responseUploadImage.data?.result || null;
      }
      // save instance
      form.logo = logoUrl || instance.logo;
      form.favicon = faviconUrl || instance.favicon;
      form.logoLarge = logoLargeUrl || instance.logoLarge;
      const responseInstance = await apis.Settings.set(
        token,
        instance.name,
        form,
      );
      if (!responseInstance.data?.result) {
        toast.warning(t.toast.warning_edit);
        return;
      }
      saveInstance({
        ...instance,
        ...responseInstance.data.result,
      });
      toast.success(t.toast.success_edit);
      return;
    } catch (err) {
      console.error("[src/pages/settings/SettingsPanel.tsx]", err);
      toast.error(t.toast.error_edit);
      return;
    }
  };

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
                  options={SettingsTheme.map(function (theme) {
                    return {
                      id: theme,
                      value: theme,
                      text: t.components[
                        theme as (typeof SettingsTheme)[number]
                      ],
                    };
                  })}
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
                  options={SettingsLanguages}
                  value={form?.language || "en"}
                  label={t.components.language}
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
                  value={String(form?.timezone || 0)}
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
                  name="dateFormat"
                  id="settings_date_format"
                  empty={t.stacks.no_option}
                  label={t.components.date_format}
                  value={form?.dateFormat || "yyyy-MM-dd"}
                  options={[
                    {
                      id: "dd/MM/yyyy",
                      value: "dd/MM/yyyy",
                      text: t.components["dd/MM/yyyy"],
                    },
                    {
                      id: "MM/dd/yyyy",
                      value: "MM/dd/yyyy",
                      text: t.components["MM/dd/yyyy"],
                    },
                    {
                      id: "yyyy-MM-dd",
                      value: "yyyy-MM-dd",
                      text: t.components["yyyy-MM-dd"],
                    },
                  ]}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.dateFormat = (event.currentTarget?.value ||
                      "yyyy-MM-dd") as TypeSettingsDateFormat;
                    setForm(newForm);
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
                  options={SettingsCurrencies}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.currency = (event.currentTarget?.value ||
                      "USD") as TypeSettingsCurrency;
                    setForm(newForm);
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
            <Vertical internal={1} styles={{ flex: 1 }}>
              <Horizontal internal={1}>
                <InputColor
                  name="colorPrimary"
                  label={t.settings.color_primary}
                  value={form?.colorPrimary || "#fafafa"}
                  id="settings_company_color_primary"
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.colorPrimary =
                      event.currentTarget?.value || "#fafafa";
                    setForm(newForm);
                    return;
                  }}
                />
                <InputColor
                  name="colorSecondary"
                  label={t.settings.color_secondary}
                  value={form?.colorSecondary || "#fafafa"}
                  id="settings_company_color_secondary"
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.colorSecondary =
                      event.currentTarget?.value || "#fafafa";
                    setForm(newForm);
                    return;
                  }}
                />
              </Horizontal>
              <Horizontal internal={1}>
                <InputFile
                  name="logo"
                  helper="512px"
                  value={logoTemp}
                  label={t.settings.logo}
                  id="settings_company_logo"
                  accept="image/png, image/jpg"
                  onChange={function (event) {
                    setLogoTemp(event.currentTarget.files?.[0] || null);
                    return;
                  }}
                />
                <InputFile
                  name="logoLarge"
                  helper="1024x512"
                  value={logoLargeTemp}
                  label={t.settings.logoLarge}
                  accept="image/png, image/jpg"
                  id="settings_company_logo_large"
                  onChange={function (event) {
                    setLogoLargeTemp(event.currentTarget.files?.[0] || null);
                    return;
                  }}
                />
                <InputFile
                  name="favicon"
                  helper="48px"
                  value={faviconTemp}
                  label={t.settings.favicon}
                  id="settings_company_favicon"
                  accept="image/png, image/svg, imagem/x-icon"
                  onChange={function (event) {
                    setFaviconTemp(event.currentTarget.files?.[0] || null);
                    return;
                  }}
                />
              </Horizontal>
              <Horizontal internal={1}>
                <div
                  className="flex1"
                  style={{
                    alignItems: "center",
                    background: "var(--backgroundColor)",
                    backgroundColor: "var(--backgroundColor)",
                    border: "1px solid var(--borderColor)",
                    borderRadius: "var(--borderRadius)",
                    display: "flex",
                    justifyContent: "center",
                    padding: "0.4rem",
                  }}
                >
                  <img
                    height={96}
                    width={96}
                    src={
                      logoTemp
                        ? URL.createObjectURL(logoTemp)
                        : form?.logo || ""
                    }
                  />
                </div>
                <div
                  className="flex1"
                  style={{
                    alignItems: "center",
                    background: "var(--backgroundColor)",
                    backgroundColor: "var(--backgroundColor)",
                    border: "1px solid var(--borderColor)",
                    borderRadius: "var(--borderRadius)",
                    display: "flex",
                    justifyContent: "center",
                    padding: "0.4rem",
                  }}
                >
                  <img
                    height={96}
                    width={192}
                    src={
                      logoLargeTemp
                        ? URL.createObjectURL(logoLargeTemp)
                        : form?.logoLarge || ""
                    }
                  />
                </div>
                <div
                  className="flex1"
                  style={{
                    alignItems: "center",
                    background: "var(--backgroundColor)",
                    backgroundColor: "var(--backgroundColor)",
                    border: "1px solid var(--borderColor)",
                    borderRadius: "var(--borderRadius)",
                    display: "flex",
                    justifyContent: "center",
                    padding: "0.4rem",
                  }}
                >
                  <img
                    height={48}
                    width={48}
                    src={
                      faviconTemp
                        ? URL.createObjectURL(faviconTemp)
                        : form?.favicon || ""
                    }
                  />
                </div>
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
              </Horizontal>
              <Horizontal internal={1}>
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
                <Input
                  type="email"
                  name="companyEmail"
                  id="settings_company_email"
                  value={form?.companyEmail || ""}
                  label={t.settings.company_email}
                  placeholder={t.settings.company_email_placeholder}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.companyEmail = event.currentTarget?.value || "";
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
                <InputMask
                  required
                  mask={MaskPostalCode}
                  name="addressPostalCode"
                  id="settings_address_postal_code"
                  value={form?.addressPostalCode || ""}
                  label={t.settings.address_postal_code}
                  placeholder={t.settings.address_postal_code_placeholder}
                  onChange={async function (event) {
                    const newForm = { ...form };
                    const postalCodeRaw = event.currentTarget?.value || "";
                    const postalCode = postalCodeRaw.replace(/\D/g, "");
                    newForm.addressPostalCode = postalCode;
                    if (postalCode.length === 8) {
                      const toastId = toast.loading(t.components.loading);
                      try {
                        const response = await apis.PostalCode(postalCode);
                        newForm.addressStreet =
                          response.data?.street || newForm.addressStreet;
                        newForm.addressCity =
                          response.data?.city || newForm.addressCity;
                        newForm.addressNeighborhood =
                          response.data?.neighborhood ||
                          newForm.addressNeighborhood;
                        newForm.addressState =
                          response.data?.state || newForm.addressState;
                        toast.dismiss(toastId);
                        toast.success(t.toast.success_find);
                      } catch (err) {
                        console.error(
                          "[src/pages/settings/SettingsPanel.tsx]",
                          err,
                        );
                        toast.dismiss(toastId);
                        toast.warning(t.toast.warning_find);
                      }
                    }
                    setForm(newForm);
                    return;
                  }}
                />
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
              </Horizontal>
              <Horizontal internal={1}>
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
              <Button
                onClick={onCancel}
                category="Neutral"
                text={t.components.cancel}
              />
              <Button
                onClick={onSubmit}
                category="Success"
                text={t.components.edit}
              />
            </Horizontal>
          </Wrapper>
        </Vertical>
      </div>
    </React.Fragment>
  );
};

export default SettingsPanel;
