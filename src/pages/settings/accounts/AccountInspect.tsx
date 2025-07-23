import { toast } from "sonner";
import { AxiosError } from "axios";
import React, { FormEvent, useState } from "react";
import { Asterisk } from "@phosphor-icons/react";
import { useNavigate, useParams } from "react-router-dom";

// apis
import apis from "../../../apis";

// types
import { TypeAccount } from "../../../types/Account";

// assets
import { BanksSafely } from "../../../assets/Banks";
import { MaskDocument1, MaskDocument2 } from "../../../assets/Mask";

// hooks
import useAsync from "../../../hooks/useAsync";
import useSystem from "../../../hooks/useSystem";
import useSounds from "../../../hooks/useSounds";
import useSchema from "../../../hooks/useSchema";
import useDateTime from "../../../hooks/useDateTime";
import useTranslate from "../../../hooks/useTranslate";

// components
import {
  Input,
  InputMask,
  InputSelect,
} from "../../../components/inputs/Input";
import Button from "../../../components/buttons/Button";
import Wrapper from "../../../components/wrapper/Wrapper";
import Callout from "../../../components/callouts/Callout";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

const AccountInspect = function () {
  const t = useTranslate();
  const play = useSounds();
  const { id } = useParams();
  const Schema = useSchema();
  const navigate = useNavigate();
  const { instanceDateTime } = useDateTime();
  const { user, token, instance, workspaceId } = useSystem();

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
    userId: user.id,
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
      if (!response.data?.result || response.status !== 200) {
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        navigate("/f/accounts");
        return;
      }
      setForm(response.data.result);
      return;
    } catch (err) {
      play("alert");
      toast.warning(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("[src/pages/settings/accounts/AccountInspect.tsx]", err);
      navigate("/f/accounts");
      return;
    } finally {
      setLoading(false);
    }
  }, []);

  const onSubmit = async function (event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
        if (!response.data?.result || response.status !== 200) {
          play("alert");
          toast.warning(t.toast.warning_error, {
            description: t.toast.warning_edit,
          });
          return;
        }
        play("ok");
        toast.success(t.toast.success, {
          description: t.toast.success_edit,
        });
        navigate("/f/accounts");
        return;
      }
      // is creating
      const response = await apis.Account.create(
        token,
        instance.name,
        form,
        workspaceId,
      );
      if (!response.data?.result || response.status !== 201) {
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.toast.warning_edit,
        });
        return;
      }
      play("ok");
      toast.success(t.toast.success, {
        description: t.toast.success_create,
      });
      navigate("/f/accounts");
      return;
    } catch (err) {
      play("alert");
      console.error("[src/pages/settings/accounts/AccountInspect.tsx]", err);
      if (
        err instanceof AxiosError &&
        err.response?.data?.result?.message === "schema_incorrect"
      ) {
        Schema(err.response.data.result.err);
        return;
      }
      toast.error(t.toast.warning_error, {
        description: id ? t.toast.error_edit : t.toast.error_create,
      });
      return;
    }
  };

  return (
    <React.Fragment>
      <Horizontal>
        <h1>{t.accounts.accounts}</h1>
      </Horizontal>
      <form onSubmit={onSubmit}>
        <Vertical internal={1}>
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
                    newForm.isCoorporate =
                      event.currentTarget?.value === "true";
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
                    id="account_created_at"
                    label={t.components.created_at}
                    value={instanceDateTime(form.createdAt as string)}
                    onChange={function () {
                      return;
                    }}
                  />
                  <Input
                    readOnly
                    placeholder=""
                    name="updatedAt"
                    id="account_updated_at"
                    label={t.components.updated_at}
                    value={
                      form?.updatedAt
                        ? instanceDateTime(form.updatedAt as string)
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
                    id="account_deleted_at"
                    label={t.components.deletedAt}
                    value={
                      form?.deletedAt
                        ? instanceDateTime(form.deletedAt as string)
                        : "-"
                    }
                    onChange={function () {
                      return;
                    }}
                  />
                </Horizontal>
              )}
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
                category="Neutral"
                text={t.components.cancel}
                onClick={function () {
                  navigate("/f/accounts");
                  return;
                }}
              />
              <Button
                type="submit"
                category="Success"
                text={id ? t.components.edit : t.components.save}
              />
            </Horizontal>
          </Wrapper>
        </Vertical>
      </form>
    </React.Fragment>
  );
};

export default AccountInspect;
