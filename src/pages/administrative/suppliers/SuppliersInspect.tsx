import { toast } from "sonner";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Asterisk, MapTrifold, Storefront } from "@phosphor-icons/react";

// apis
import apis from "../../../apis";

// types
import { TypeSupplier } from "../../../types/Supplier";

// assets
import {
  MaskPhone,
  MaskDocument1,
  MaskDocument2,
  MaskPostalCode,
} from "../../../assets/Mask";
import { SettingsAddressState } from "../../../assets/Settings";

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
  InputText,
  InputMask,
  InputSelect,
} from "../../../components/inputs/Input";
import Button from "../../../components/buttons/Button";
import Wrapper from "../../../components/wrapper/Wrapper";
import Profile from "../../../components/profiles/Profile";
import Callout from "../../../components/callouts/Callout";
import { useDialog } from "../../../components/dialogs/Dialog";
import Breadcrumb from "../../../components/breadcrumbs/Breadcrumb";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

// TODO: add map viewer
const SuppliersInspect = function () {
  const t = useTranslate();
  const play = useSounds();
  const { id } = useParams();
  const Schema = useSchema();
  const navigate = useNavigate();
  const { instanceDateTime } = useDateTime();
  const { OpenDialog, CloseDialog } = useDialog();
  const { user, users, token, instance, workspaces, workspaceId } = useSystem();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<TypeSupplier>>({
    id: "",
    status: true,
    name: "",
    description: "",
    document1: "",
    document2: "",
    companyName: "",
    companyDocument: "",
    companyMobile: "",
    companyPhone: "",
    companyEmail: "",
    addresses: [
      {
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        postalCode: "",
        city: "",
        state: "SP",
      },
    ],
    userId: user.id,
    workspaceId,
  });

  const userFinded = form.userId
    ? users.find(function (userLocal) {
        return form.userId === userLocal.id;
      })
    : null;

  // fetch supplier
  useAsync(async function () {
    if (!id) return;
    setLoading(true);
    try {
      const response = await apis.Supplier.get(
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
        navigate("/f/suppliers");
        return;
      }
      setForm(response.data.result);
      return;
    } catch (err) {
      play("alert");
      toast.warning(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error(
        "[src/pages/administrative/suppliers/SuppliersInspect.tsx]",
        err,
      );
      navigate("/f/suppliers");
      return;
    } finally {
      setLoading(false);
    }
  }, []);

  const onSubmit = async function (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      // is editing
      if (id) {
        const response = await apis.Supplier.update<TypeSupplier>(
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
        navigate("/f/suppliers");
        return;
      }
      // is creating
      const response = await apis.Supplier.create<TypeSupplier>(
        token,
        instance.name,
        form,
        workspaceId,
      );
      if (!response.data?.result || response.status !== 201) {
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.toast.warning_create,
        });
        return;
      }
      play("ok");
      toast.success(t.toast.success, {
        description: t.toast.success_create,
      });
      navigate("/f/suppliers");
      return;
    } catch (err) {
      play("alert");
      console.error(
        "[src/pages/administrative/suppliers/SuppliersInspect.tsx]",
        err,
      );
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
        <h2>
          <Breadcrumb
            links={[
              {
                id: "workspace",
                label:
                  workspaces.find(function (workspace) {
                    return workspace.id === workspaceId;
                  })?.name || "",
                url: "/f/",
              },
              {
                id: "suppliers",
                label: t.supplier.suppliers,
                url: "/f/suppliers",
              },
              {
                id: "supplier",
                label: form?.name || t.components.empty_name,
                url: `/f/suppliers/inspect${id ? `/${id}` : ""}`,
              },
            ]}
          />
        </h2>
      </Horizontal>
      <form onSubmit={onSubmit}>
        <Vertical internal={1}>
          <Wrapper
            title={id ? t.supplier.title_edit : t.supplier.title_create}
            description={t.supplier.subtitle}
          >
            <Vertical internal={1}>
              <Horizontal internal={1}>
                <InputSelect
                  required
                  name="status"
                  id="supplier_status"
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
                  min={4}
                  max={32}
                  required
                  name="name"
                  id="supplier_name"
                  value={form?.name || ""}
                  label={t.supplier.name}
                  disabled={loading && Boolean(id)}
                  placeholder={t.supplier.name_placeholder}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.name = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
              </Horizontal>
              <Horizontal internal={1}>
                <InputMask
                  name="document1"
                  mask={MaskDocument1}
                  id="supplier_document_1"
                  label={t.supplier.document_1}
                  value={form?.document1 || ""}
                  disabled={loading && Boolean(id)}
                  placeholder={t.supplier.document_placeholder}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.document1 = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
                <InputMask
                  name="document2"
                  mask={MaskDocument2}
                  id="supplier_document_2"
                  label={t.supplier.document_2}
                  value={form?.document2 || ""}
                  disabled={loading && Boolean(id)}
                  placeholder={t.supplier.document_placeholder}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.document2 = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
              </Horizontal>
              <Horizontal internal={1}>
                <InputText
                  max={256}
                  height={4}
                  name="description"
                  id="supplier_description"
                  value={form?.description || ""}
                  label={t.components.description}
                  disabled={loading && Boolean(id)}
                  placeholder={t.supplier.description_placeholder}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.description = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
              </Horizontal>
              {Boolean(id) && (
                <Horizontal internal={1}>
                  <div
                    className="flex flex1"
                    style={{ alignItems: "flex-end" }}
                  >
                    <Profile
                      padding={false}
                      photo={userFinded?.photo || ""}
                      description={userFinded?.email || ""}
                      name={userFinded?.name || t.components.unknown}
                    />
                  </div>
                  <Input
                    readOnly
                    placeholder=""
                    name="createdAt"
                    id="service_created_at"
                    label={t.components.created_at}
                    value={instanceDateTime(form.createdAt)}
                    onChange={function () {
                      return;
                    }}
                  />
                  <Input
                    readOnly
                    placeholder=""
                    name="updatedAt"
                    id="service_updated_at"
                    label={t.components.updated_at}
                    value={
                      form?.updatedAt ? instanceDateTime(form.updatedAt) : "-"
                    }
                    onChange={function () {
                      return;
                    }}
                  />
                  <Input
                    readOnly
                    placeholder=""
                    name="deletedAt"
                    id="service_deleted_at"
                    label={t.components.deletedAt}
                    value={
                      form?.deletedAt ? instanceDateTime(form.deletedAt) : "-"
                    }
                    onChange={function () {
                      return;
                    }}
                  />
                </Horizontal>
              )}
              <Callout
                Icon={Storefront}
                IconSize={16}
                category="Info"
                text={
                  <Vertical internal={0.4}>
                    <div>{t.callout.person_mobile_search}</div>
                    <div>{t.callout.company_document_search}</div>
                  </Vertical>
                }
                styles={{ fontSize: "var(--textSmall)" }}
              />
            </Vertical>
          </Wrapper>

          <Wrapper
            title={t.supplier.title_company}
            description={t.supplier.subtitle_company}
          >
            <Vertical internal={1}>
              <Horizontal internal={1}>
                <Input
                  min={4}
                  max={32}
                  required
                  name="companyName"
                  id="supplier_company_name"
                  label={t.supplier.company_name}
                  value={form?.companyName || ""}
                  disabled={loading && Boolean(id)}
                  placeholder={t.supplier.company_name_placeholder}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.companyName = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
                <InputMask
                  mask={MaskDocument1}
                  name="companyDocument"
                  label={t.supplier.document_1}
                  id="supplier_company_document"
                  disabled={loading && Boolean(id)}
                  value={form?.companyDocument || ""}
                  placeholder={t.supplier.document_placeholder}
                  onChange={async function (event) {
                    const newForm = { ...form };
                    const companyDocumentRaw = event.currentTarget?.value || "";
                    const companyDocument = companyDocumentRaw.replace(
                      /\D/g,
                      "",
                    );
                    if (companyDocument.length === 14) {
                      const toastId = toast.loading(t.components.loading);
                      try {
                        const response =
                          await apis.CompanyData(companyDocument);
                        newForm.companyMobile = response.data?.ddd_telefone_1
                          ? `+55${response.data?.ddd_telefone_1}`
                          : newForm.companyMobile;
                        newForm.companyPhone = response.data?.ddd_telefone_2
                          ? `+55${response.data?.ddd_telefone_2}`
                          : newForm.companyPhone;
                        newForm.companyName =
                          response.data?.nome_fantasia ||
                          response.data?.razao_social ||
                          newForm.companyName;
                        newForm.companyMobile =
                          response.data?.email || newForm.companyMobile;
                        if (!newForm.addresses?.[0]) return;
                        newForm.addresses[0].street =
                          response.data?.logradouro || "";
                        newForm.addresses[0].number =
                          response.data?.numero || "";
                        newForm.addresses[0].complement =
                          response.data?.complemento || "";
                        newForm.addresses[0].neighborhood =
                          response.data?.bairro || "";
                        newForm.addresses[0].postalCode =
                          response.data?.cep || "";
                        newForm.addresses[0].city =
                          response.data?.municipio || "";
                        newForm.addresses[0].state =
                          response.data?.uf?.toUpperCase() || "";
                        toast.dismiss(toastId);
                        play("ok");
                        toast.success(t.toast.success, {
                          description: t.toast.success_find,
                        });
                      } catch (err) {
                        console.error(
                          "[src/pages/administrative/suppliers/SuppliersInspect.tsx]",
                          err,
                        );
                        toast.dismiss(toastId);
                        play("alert");
                        toast.warning(t.toast.warning_error, {
                          description: t.toast.warning_find,
                        });
                      }
                    }
                    newForm.companyDocument = companyDocument;
                    setForm(newForm);
                    return;
                  }}
                />
              </Horizontal>
              <Horizontal internal={1}>
                <InputMask
                  required
                  mask={MaskPhone}
                  name="companyMobile"
                  label={t.supplier.mobile}
                  id="supplier_company_mobile"
                  value={form?.companyMobile || ""}
                  disabled={loading && Boolean(id)}
                  placeholder={t.supplier.mobile_placeholder}
                  onChange={async function (event) {
                    const newForm = { ...form };
                    const companyMobileRaw = event.currentTarget?.value || "";
                    const companyMobile = companyMobileRaw.replace(/\D/g, "");
                    if (companyMobile.length === 13) {
                      const toastId = toast.loading(t.components.loading);
                      try {
                        const responseWhatsApp = await apis.WhatsApp.contact({
                          number: companyMobile,
                        });
                        newForm.name =
                          !newForm.name?.length &&
                          responseWhatsApp.data.result?.name
                            ? responseWhatsApp.data.result?.name
                            : newForm.name;
                        newForm.description =
                          responseWhatsApp.data.result.description ||
                          newForm.description;
                        play("ok");
                        toast.dismiss(toastId);
                        toast.success(t.toast.success, {
                          description: t.toast.success_find,
                        });
                      } catch (err) {
                        console.error(
                          "[src/pages/administrative/suppliers/SuppliersInspect.tsx]",
                          err,
                        );
                        toast.dismiss(toastId);
                        play("alert");
                        toast.warning(t.toast.warning_error, {
                          description: t.toast.warning_find,
                        });
                      }
                    }
                    newForm.companyMobile = companyMobile;
                    setForm(newForm);
                    return;
                  }}
                />
                <InputMask
                  mask={MaskPhone}
                  name="companyPhone"
                  label={t.supplier.phone_1}
                  id="supplier_company_phone"
                  value={form?.companyPhone || ""}
                  disabled={loading && Boolean(id)}
                  placeholder={t.supplier.mobile_placeholder}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.companyPhone = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
                <Input
                  min={4}
                  max={32}
                  type="email"
                  name="companyEmail"
                  label={t.supplier.email}
                  id="supplier_company_email"
                  value={form?.companyEmail || ""}
                  disabled={loading && Boolean(id)}
                  placeholder={t.supplier.email_placeholder}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.companyEmail = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
              </Horizontal>
            </Vertical>
          </Wrapper>

          <Wrapper
            title={t.supplier.title_addresses}
            description={t.supplier.subtitle_addresses}
          >
            <Vertical internal={1}>
              {form.addresses?.map(function (_, index) {
                return (
                  <Vertical key={`addresses-${index}`} internal={1}>
                    <Horizontal
                      internal={1}
                      styles={{ alignItems: "flex-end" }}
                    >
                      <div style={{ maxWidth: 96 }}>
                        <Input
                          readOnly
                          label="Id"
                          placeholder=""
                          value={String(index + 1)}
                          onChange={function () {
                            return;
                          }}
                        />
                      </div>
                      <InputMask
                        required
                        mask={MaskPostalCode}
                        disabled={loading && Boolean(id)}
                        name={`addresses[${index}].postalCode`}
                        label={t.components.address_postal_code}
                        id={`supplier_addresses_${index}_postal_code`}
                        value={form?.addresses?.[index].postalCode || ""}
                        placeholder={
                          t.components.address_postal_code_placeholder
                        }
                        onChange={async function (event) {
                          const newForm = { ...form };
                          if (!newForm.addresses?.[index]) return;
                          const postalCodeRaw =
                            event.currentTarget?.value || "";
                          const postalCode = postalCodeRaw.replace(/\D/g, "");
                          newForm.addresses[index].postalCode = postalCode;
                          if (postalCode.length === 8) {
                            const toastId = toast.loading(t.components.loading);
                            try {
                              const response =
                                await apis.PostalCode(postalCode);
                              newForm.addresses[index].street =
                                response.data?.street ||
                                newForm.addresses[index].street;
                              newForm.addresses[index].city =
                                response.data?.city ||
                                newForm.addresses[index].city;
                              newForm.addresses[index].neighborhood =
                                response.data?.neighborhood ||
                                newForm.addresses[index].neighborhood;
                              newForm.addresses[index].state =
                                response.data?.state ||
                                newForm.addresses[index].state;
                              toast.dismiss(toastId);
                              play("ok");
                              toast.success(t.toast.success, {
                                description: t.toast.success_find,
                              });
                            } catch (err) {
                              console.error(
                                "[src/pages/administrative/suppliers/SuppliersInspect.tsx]",
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
                        disabled={loading && Boolean(id)}
                        name={`addresses[${index}].street`}
                        id={`supplier_addresses_${index}_street`}
                        value={form?.addresses?.[index].street || ""}
                        label={t.components.address_street}
                        placeholder={t.components.address_street_placeholder}
                        onChange={function (event) {
                          const newForm = { ...form };
                          if (!newForm.addresses?.[index]) return;
                          newForm.addresses[index].street =
                            event.currentTarget?.value || "";
                          setForm(newForm);
                          return;
                        }}
                      />
                      <Button
                        type="button"
                        category="Danger"
                        text={t.components.remove}
                        onClick={function () {
                          if (index === 0) {
                            play("alert");
                            toast.warning(t.toast.warning_error, {
                              description: t.supplier.no_delete_address,
                            });
                            return;
                          }
                          OpenDialog({
                            category: "Danger",
                            title: t.dialog.title_delete,
                            description: t.dialog.description_delete,
                            confirmText: t.components.remove,
                            onConfirm: function () {
                              const newForm = { ...form };
                              newForm.addresses?.splice(index, 1);
                              setForm(newForm);
                              play("ok");
                              toast.success(t.toast.success, {
                                description: t.toast.success_delete,
                              });
                              CloseDialog();
                              return;
                            },
                          });
                        }}
                      />
                    </Horizontal>
                    <Horizontal internal={1}>
                      <Input
                        min={1}
                        max={8}
                        required
                        disabled={loading && Boolean(id)}
                        label={t.components.address_number}
                        name={`addresses[${index}].number`}
                        id={`supplier_addresses_${index}_number`}
                        value={form?.addresses?.[index].number || ""}
                        placeholder={t.components.address_number_placeholder}
                        onChange={function (event) {
                          const newForm = { ...form };
                          if (!newForm.addresses?.[index]) return;
                          newForm.addresses[index].number =
                            event.currentTarget?.value || "";
                          setForm(newForm);
                          return;
                        }}
                      />
                      <Input
                        max={32}
                        disabled={loading && Boolean(id)}
                        label={t.components.address_complement}
                        name={`addresses[${index}].complement`}
                        id={`supplier_addresses_${index}_complement`}
                        value={form?.addresses?.[index].complement || ""}
                        placeholder={
                          t.components.address_complement_placeholder
                        }
                        onChange={function (event) {
                          const newForm = { ...form };
                          if (!newForm.addresses?.[index]) return;
                          newForm.addresses[index].complement =
                            event.currentTarget?.value || "";
                          setForm(newForm);
                          return;
                        }}
                      />
                      <Input
                        max={64}
                        disabled={loading && Boolean(id)}
                        label={t.components.address_neighborhood}
                        name={`addresses[${index}].neighborhood`}
                        id={`supplier_addresses_${index}_neighborhood`}
                        value={form?.addresses?.[index].neighborhood || ""}
                        placeholder={
                          t.components.address_neighborhood_placeholder
                        }
                        onChange={function (event) {
                          const newForm = { ...form };
                          if (!newForm.addresses?.[index]) return;
                          newForm.addresses[index].neighborhood =
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
                        disabled={loading && Boolean(id)}
                        name={`addresses[${index}].city`}
                        label={t.components.address_city}
                        id={`supplier_addresses_${index}_city`}
                        value={form?.addresses?.[index].city || ""}
                        placeholder={t.components.address_city_placeholder}
                        onChange={function (event) {
                          const newForm = { ...form };
                          if (!newForm.addresses?.[index]) return;
                          newForm.addresses[index].city =
                            event.currentTarget?.value || "";
                          setForm(newForm);
                          return;
                        }}
                      />
                      <InputSelect
                        required
                        empty={t.stacks.no_option}
                        disabled={loading && Boolean(id)}
                        name={`addresses[${index}].state`}
                        label={t.components.address_state}
                        id={`supplier_addresses_${index}_state`}
                        value={form?.addresses?.[index].state || ""}
                        options={SettingsAddressState.map(function (state) {
                          return {
                            id: state.code,
                            value: state.code,
                            text: state.name,
                          };
                        })}
                        onChange={function (event) {
                          const newForm = { ...form };
                          if (!newForm.addresses?.[index]) return;
                          newForm.addresses[index].state =
                            event.currentTarget?.value || "";
                          setForm(newForm);
                          return;
                        }}
                      />
                    </Horizontal>
                    {index + 1 !== form.addresses?.length && (
                      <hr className="wFull" />
                    )}
                  </Vertical>
                );
              })}
              <Horizontal internal={1} className="itemsCenter">
                <Button
                  type="button"
                  category="Success"
                  text={t.components.add}
                  onClick={function () {
                    const newForm = { ...form };
                    newForm.addresses?.push({
                      street: "",
                      number: "",
                      complement: "",
                      neighborhood: "",
                      postalCode: "",
                      city: "",
                      state: "",
                    });
                    setForm(newForm);
                    return;
                  }}
                />
                <Callout
                  Icon={MapTrifold}
                  IconSize={16}
                  category="Info"
                  text={t.callout.postal_code_search}
                  styles={{ flex: 1, fontSize: "var(--textSmall)" }}
                />
              </Horizontal>

              <iframe
                src="https://maps.google.com/maps?q=-23.55052,-46.633308&z=15&output=embed&maptype=satellite"
                width="600"
                height="450"
                loading="lazy"
              ></iframe>
            </Vertical>
          </Wrapper>

          <Callout
            Icon={Asterisk}
            category="Warning"
            text={t.callout.required_fields}
            styles={{ fontSize: "var(--textSmall)" }}
          />

          <Wrapper>
            <Horizontal internal={1} styles={{ justifyContent: "flex-end" }}>
              <Button
                type="button"
                category="Neutral"
                text={t.components.cancel}
                onClick={function () {
                  navigate("/f/suppliers");
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

export default SuppliersInspect;
