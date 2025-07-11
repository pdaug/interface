import { toast } from "sonner";
import { format } from "date-fns";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { Asterisk } from "@phosphor-icons/react";
import { useNavigate, useParams } from "react-router-dom";

// apis
import apis from "../../apis";

// utils
import Schema from "../../utils/Schema";

// types
import { TypeAccount } from "../../types/Account";

// assets
import { BanksSafely } from "../../assets/Banks";
import { MaskDocument1, MaskDocument2 } from "../../assets/Mask";

// hooks
import useAsync from "../../hooks/useAsync";
import useSystem from "../../hooks/useSystem";
import useTranslate from "../../hooks/useTranslate";

// components
import Button from "../../components/buttons/Button";
import Wrapper from "../../components/wrapper/Wrapper";
import Callout from "../../components/callouts/Callout";
import { Horizontal, Vertical } from "../../components/aligns/Align";
import { Input, InputMask, InputSelect } from "../../components/inputs/Input";

const AccountInspect = function () {
  const t = useTranslate();
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, instance, workspaceId } = useSystem();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<TypeAccount>>({
    status: true,
    name: "",
    isCoorporate: false,
    holder: "",
    holderDocument1: "",
    holderDocument2: "",
    bankCode: "",
    bankName: "",
    bankAgency: "",
    bankAccount: "",
  });

  // fetch account
  useAsync(async function () {
    if (!id) return;
    setLoading(true);
    try {
      const response = await apis.Account.get(
        token,
        instance.name,
        id,
        workspaceId,
      );
      if (!response.data?.result) return;
      setForm(response.data.result);
      return;
    } catch (err) {
      console.error("[src/pages/accounts/AccountInspect.tsx]", err);
      return;
    } finally {
      setLoading(false);
    }
  }, []);

  const onSubmit = async function () {
    try {
      // is editing
      if (id) {
        const response = await apis.Account.update(
          token,
          instance.name,
          id,
          form,
          workspaceId,
        );
        if (!response.data?.result) toast.warning(t.toast.warning_edit);
        if (response.data.state === "success") {
          toast.success(t.toast.success_edit);
          navigate("/f/accounts");
        }
        return;
      }
      // is creating
      const response = await apis.Account.create(
        token,
        instance.name,
        form,
        workspaceId,
      );
      if (!response.data?.result) toast.warning(t.toast.warning_create);
      if (response.data.state === "success") {
        toast.success(t.toast.success_create);
        navigate("/f/accounts");
      }
      return;
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.data?.result?.message === "schema_incorrect") {
          Schema(err.response.data.result.err);
          return;
        }
      }
      if (id) toast.error(t.toast.error_edit);
      else toast.error(t.toast.error_create);
      console.error("[src/pages/accounts/AccountInspect.tsx]", err);
      return;
    }
  };

  return (
    <React.Fragment>
      <Horizontal>
        <h1>{t.accounts.accounts}</h1>
      </Horizontal>
      <div>
        <Wrapper
          title={id ? t.accounts.title_edit : t.accounts.title_create}
          description={t.accounts.subtitle}
        >
          <Vertical internal={1}>
            <Horizontal internal={1}>
              <InputSelect
                required
                name="status"
                id="account_status"
                empty={t.stacks.no_option}
                value={String(form.status)}
                label={t.components.status}
                disabled={loading && Boolean(id)}
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
                onChange={function (event) {
                  const newForm = { ...form };
                  newForm.status = event.currentTarget?.value === "true";
                  setForm(newForm);
                  return;
                }}
              />
              <Input
                min={1}
                max={32}
                required
                name="name"
                id="account_name"
                value={form?.name || ""}
                label={t.accounts.name}
                disabled={loading && Boolean(id)}
                placeholder={t.accounts.name_placeholder}
                onChange={function (event) {
                  const newForm = { ...form };
                  newForm.name = event.currentTarget?.value || "";
                  setForm(newForm);
                  return;
                }}
              />
              <InputSelect
                name="isCoorporate"
                id="account_is_coorporate"
                empty={t.stacks.no_option}
                label={t.accounts.is_coorporate}
                disabled={loading && Boolean(id)}
                value={String(form?.isCoorporate)}
                options={[
                  {
                    id: "true",
                    value: "true",
                    text: t.accounts.corporate,
                  },
                  {
                    id: "false",
                    value: "false",
                    text: t.accounts.personal,
                  },
                ]}
                onChange={function (event) {
                  const newForm = { ...form };
                  newForm.isCoorporate = event.currentTarget?.value === "true";
                  setForm(newForm);
                  return;
                }}
              />
            </Horizontal>
            <Horizontal internal={1}>
              <Input
                min={1}
                max={32}
                required
                name="holder"
                id="account_holder"
                value={form?.holder || ""}
                label={t.accounts.holder}
                disabled={loading && Boolean(id)}
                placeholder={t.accounts.holder_placeholder}
                onChange={function (event) {
                  const newForm = { ...form };
                  newForm.holder = event.currentTarget?.value || "";
                  setForm(newForm);
                  return;
                }}
              />
              <InputMask
                required
                mask={MaskDocument1}
                name="holderDocument1"
                id="account_holder_document_1"
                disabled={loading && Boolean(id)}
                value={form?.holderDocument1 || ""}
                label={t.accounts.holder_document_1}
                placeholder={t.accounts.holder_document_placeholder}
                onChange={function (event) {
                  const newForm = { ...form };
                  newForm.holderDocument1 = event.currentTarget?.value || "";
                  setForm(newForm);
                  return;
                }}
              />
              <InputMask
                mask={MaskDocument2}
                name="holderDocument2"
                id="account_holder_document_2"
                disabled={loading && Boolean(id)}
                value={form?.holderDocument2 || ""}
                label={t.accounts.holder_document_2}
                placeholder={t.accounts.holder_document_placeholder}
                onChange={function (event) {
                  const newForm = { ...form };
                  newForm.holderDocument2 = event.currentTarget?.value || "";
                  setForm(newForm);
                  return;
                }}
              />
            </Horizontal>
            <Horizontal internal={1}>
              <Input
                readOnly
                name="bankCode"
                placeholder="123"
                id="account_bank_code"
                label={t.accounts.bank_code}
                value={form?.bankCode || ""}
                onChange={function () {
                  return;
                }}
              />
              <InputSelect
                required
                name="bankName"
                id="account_bank_name"
                empty={t.stacks.no_option}
                label={t.accounts.bank_name}
                value={form?.bankCode || ""}
                disabled={loading && Boolean(id)}
                options={BanksSafely.map(function (bank) {
                  return {
                    id: bank.code,
                    value: bank.code,
                    text: bank.name,
                  };
                })}
                onChange={function (event) {
                  const newForm = { ...form };
                  const bankCode = event.currentTarget?.value || "";
                  newForm.bankCode = bankCode;
                  newForm.bankName =
                    BanksSafely.find(function (bank) {
                      return bank.code === bankCode;
                    })?.name || "no_bank_name";
                  setForm(newForm);
                  return;
                }}
              />
              <Input
                min={1}
                max={16}
                required
                name="bankAgency"
                id="account_bank_agency"
                value={form?.bankAgency || ""}
                label={t.accounts.bank_agency}
                disabled={loading && Boolean(id)}
                placeholder={t.accounts.bank_number_placeholder}
                onChange={function (event) {
                  const newForm = { ...form };
                  newForm.bankAgency = event.currentTarget?.value || "";
                  setForm(newForm);
                  return;
                }}
              />
              <Input
                min={1}
                max={16}
                required
                name="bankAccount"
                id="account_bank_account"
                value={form?.bankAccount || ""}
                label={t.accounts.bank_account}
                disabled={loading && Boolean(id)}
                placeholder={t.accounts.bank_number_placeholder}
                onChange={function (event) {
                  const newForm = { ...form };
                  newForm.bankAccount = event.currentTarget?.value || "";
                  setForm(newForm);
                  return;
                }}
              />
            </Horizontal>
            {Boolean(id) && (
              <Horizontal internal={1}>
                <Input
                  readOnly
                  placeholder=""
                  name="createdAt"
                  id="workspace_created_at"
                  label={t.components.created_at}
                  value={format(
                    new Date(form?.createdAt || 0),
                    "dd/MM/yyyy HH:mm:ss",
                  )}
                  onChange={function () {
                    return;
                  }}
                />
                <Input
                  readOnly
                  placeholder=""
                  name="updatedAt"
                  id="workspace_updated_at"
                  label={t.components.updated_at}
                  value={
                    form?.updatedAt
                      ? format(new Date(form?.updatedAt), "dd/MM/yyyy HH:mm:ss")
                      : "-"
                  }
                  onChange={function () {
                    return;
                  }}
                />
                <Input
                  readOnly
                  placeholder=""
                  name="deletedAt"
                  id="workspace_deleted_at"
                  label={t.components.deletedAt}
                  value={
                    form?.deletedAt
                      ? format(new Date(form?.deletedAt), "dd/MM/yyyy HH:mm:ss")
                      : "-"
                  }
                  onChange={function () {
                    return;
                  }}
                />
              </Horizontal>
            )}
            <Horizontal internal={1} styles={{ justifyContent: "flex-end" }}>
              <Button
                category="Neutral"
                text={t.components.cancel}
                onClick={function () {
                  navigate("/f/accounts");
                  return;
                }}
              />
              <Button
                category="Success"
                onClick={onSubmit}
                text={id ? t.components.edit : t.components.save}
              />
            </Horizontal>
          </Vertical>
        </Wrapper>
      </div>
      <Callout
        Icon={Asterisk}
        category="Warning"
        text={t.stacks.required_fields}
        styles={{ fontSize: "var(--textSmall)" }}
      />
    </React.Fragment>
  );
};

export default AccountInspect;
