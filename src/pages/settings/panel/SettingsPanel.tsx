import { toast } from "sonner";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Asterisk } from "@phosphor-icons/react";

// apis
import apis from "../../../apis";

// types
import {
  TypeSettings,
  TypeSettingsTheme,
  TypeSettingsLanguage,
  TypeSettingsCurrency,
  TypeSettingsDateFormat,
} from "../../../types/Settings";

// assets
import {
  SettingsTheme,
  SettingsTimezone,
  SettingsLanguages,
  SettingsCurrencies,
  SettingsAddressState,
  SettingsCompanyActivities,
} from "../../../assets/Settings";
import { MaskPhone, MaskPostalCode } from "../../../assets/Mask";

// hooks
import useAsync from "../../../hooks/useAsync";
import useSystem from "../../../hooks/useSystem";
import useSchema from "../../../hooks/useSchema";
import useSounds from "../../../hooks/useSounds";
import useTranslate from "../../../hooks/useTranslate";

// components
import {
  Input,
  InputFile,
  InputMask,
  InputColor,
  InputSelect,
} from "../../../components/inputs/Input";
import Button from "../../../components/buttons/Button";
import Wrapper from "../../../components/wrapper/Wrapper";
import Callout from "../../../components/callouts/Callout";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

const SettingsPanel = function () {
  const t = useTranslate();
  const play = useSounds();
  const Schema = useSchema();
  const navigate = useNavigate();
  const { token, instance, saveInstance } = useSystem();

  const [loading, setLoading] = useState<boolean>(true);
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
    setLoading(true);
    const toastId = toast.loading(t.components.loading);
    try {
      const response = await apis.Settings.get(instance.name);
      if (!response.data?.result) {
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.toast.warning_find,
        });
        toast.dismiss(toastId);
        setLoading(false);
        return;
      }
      setForm(response.data.result);
      toast.dismiss(toastId);
      setLoading(false);
      return;
    } catch (err) {
      play("alert");
      toast.error(t.toast.warning_error, {
        description: t.toast.warning_find,
      });
      console.error("[src/pages/settings/SettingsPanel.tsx]", err);
      toast.dismiss(toastId);
      setLoading(false);
      return;
    }
  };

  useAsync(FetchSettings, []);

  const onCancel = function () {
    navigate("/f");
    return;
  };

  const onSubmit = async function (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const toastId = toast.loading(t.components.loading);
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
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.toast.warning_edit,
        });
        toast.dismiss(toastId);
        return;
      }
      saveInstance({
        ...instance,
        ...responseInstance.data.result,
      });
      play("ok");
      toast.success(t.toast.success, {
        description: t.toast.success_edit,
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.data?.result?.message === "schema_incorrect") {
          play("alert");
          Schema(err.response.data.result.err);
          toast.dismiss(toastId);
          return;
        }
      }
      play("alert");
      console.error("[src/pages/settings/SettingsPanel.tsx]", err);
      toast.error(t.toast.warning_error, {
        description: t.toast.error_edit,
      });
    }
    toast.dismiss(toastId);
    return;
  };

  return (
    <React.Fragment>
      <Horizontal>
        <h1 style={{ color: form.colorPrimary }}>{t.settings.settings}</h1>
      </Horizontal>
      <form onSubmit={onSubmit}>
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
                  disabled={loading}
                  empty={t.stacks.no_option}
                  label={t.components.theme}
                  value={form?.theme || "light"}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  value={logoTemp}
                  disabled={loading}
                  accept="image/png"
                  helper="PNG 512x512"
                  label={t.settings.logo}
                  id="settings_company_logo"
                  onChange={function (event) {
                    const file = event.currentTarget.files?.[0] || null;
                    if (!file) return;
                    if (file.size > 5 * 1024 * 1024) {
                      play("alert");
                      toast.error(t.toast.warning_error, {
                        description: t.stacks.limit_image_5mb,
                      });
                      return;
                    }
                    if (
                      file.type !== "image/png" ||
                      !file.name.includes(".png")
                    ) {
                      play("alert");
                      toast.error(t.toast.warning_error, {
                        description: t.stacks.wrong_file_format,
                      });
                      return;
                    }
                    setLogoTemp(file);
                    return;
                  }}
                />
                <InputFile
                  name="logoLarge"
                  disabled={loading}
                  accept="image/png"
                  value={logoLargeTemp}
                  helper="PNG 1024x512"
                  label={t.settings.logoLarge}
                  id="settings_company_logo_large"
                  onChange={function (event) {
                    const file = event.currentTarget.files?.[0] || null;
                    if (!file) return;
                    if (file.size > 5 * 1024 * 1024) {
                      play("alert");
                      toast.error(t.toast.warning_error, {
                        description: t.stacks.limit_image_5mb,
                      });
                      return;
                    }
                    if (
                      file.type !== "image/png" ||
                      !file.name.includes(".png")
                    ) {
                      play("alert");
                      toast.error(t.toast.warning_error, {
                        description: t.stacks.wrong_file_format,
                      });
                      return;
                    }
                    setLogoLargeTemp(file);
                    return;
                  }}
                />
                <InputFile
                  name="favicon"
                  helper="48x48"
                  disabled={loading}
                  value={faviconTemp}
                  label={t.settings.favicon}
                  id="settings_company_favicon"
                  accept="image/png, image/jpg, image/svg, image/x-icon"
                  onChange={function (event) {
                    const file = event.currentTarget.files?.[0] || null;
                    if (!file) return;
                    if (file.size > 5 * 1024 * 1024) {
                      play("alert");
                      toast.error(t.toast.warning_error, {
                        description: t.stacks.limit_image_5mb,
                      });
                      return;
                    }
                    if (
                      ![
                        "image/png",
                        "image/jpg",
                        "image/jpeg",
                        "image/svg",
                        "image/x-icon",
                      ].includes(file.type)
                    ) {
                      play("alert");
                      toast.error(t.toast.warning_error, {
                        description: t.stacks.wrong_file_format,
                      });
                      return;
                    }
                    setFaviconTemp(file);
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
                  min={4}
                  max={64}
                  required
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
                  mask={MaskPostalCode}
                  name="addressPostalCode"
                  id="settings_address_postal_code"
                  value={form?.addressPostalCode || ""}
                  label={t.components.address_postal_code}
                  placeholder={t.components.address_postal_code_placeholder}
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
                        play("ok");
                        toast.success(t.toast.success, {
                          description: t.toast.success_find,
                        });
                      } catch (err) {
                        console.error(
                          "[src/pages/settings/SettingsPanel.tsx]",
                          err,
                        );
                        toast.dismiss(toastId);
                        play("alert");
                        toast.warning(t.toast.warning_error, {
                          description: t.toast.warning_find,
                        });
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
                  disabled={loading}
                  name="addressStreet"
                  id="settings_address_street"
                  value={form?.addressStreet || ""}
                  label={t.components.address_street}
                  placeholder={t.components.address_street_placeholder}
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
                  disabled={loading}
                  name="addressNumber"
                  id="settings_address_number"
                  value={form?.addressNumber || ""}
                  label={t.components.address_number}
                  placeholder={t.components.address_number_placeholder}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.addressNumber = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
                <Input
                  max={32}
                  disabled={loading}
                  name="addressComplement"
                  id="settings_address_complement"
                  value={form?.addressComplement || ""}
                  label={t.components.address_complement}
                  placeholder={t.components.address_complement_placeholder}
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
                  disabled={loading}
                  name="addressNeighborhood"
                  id="settings_address_neighborhood"
                  value={form?.addressNeighborhood || ""}
                  label={t.components.address_neighborhood}
                  placeholder={t.components.address_neighborhood_placeholder}
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
                  disabled={loading}
                  name="addressCity"
                  id="settings_address_city"
                  value={form?.addressCity || ""}
                  label={t.components.address_city}
                  placeholder={t.components.address_city_placeholder}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.addressCity = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
                <InputSelect
                  required
                  disabled={loading}
                  name="addressState"
                  empty={t.stacks.no_option}
                  id="settings_address_state"
                  value={form?.addressState || ""}
                  label={t.components.address_state}
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
                type="button"
                onClick={onCancel}
                category="Neutral"
                text={t.components.cancel}
              />
              <Button
                type="submit"
                category="Success"
                text={t.components.edit}
              />
            </Horizontal>
          </Wrapper>

          <div style={{ height: 128 }}></div>
        </Vertical>
      </form>
    </React.Fragment>
  );
};

export default SettingsPanel;
