import { toast } from "sonner";
import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { UserList, Asterisk, MapTrifold } from "@phosphor-icons/react";

// apis
import apis from "../../../apis";

// types
import { TypeCustomer } from "../../../types/Customers";

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
  InputFile,
  InputText,
  InputMask,
  InputSelect,
} from "../../../components/inputs/Input";
import Avatar from "../../../components/avatars/Avatar";
import Button from "../../../components/buttons/Button";
import Wrapper from "../../../components/wrapper/Wrapper";
import Profile from "../../../components/profiles/Profile";
import Callout from "../../../components/callouts/Callout";
import { useDialog } from "../../../components/dialogs/Dialog";
import Breadcrumb from "../../../components/breadcrumbs/Breadcrumb";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

const CustomersInspect = function () {
  const t = useTranslate();
  const play = useSounds();
  const { id } = useParams();
  const Schema = useSchema();
  const navigate = useNavigate();
  const { instanceDateTime } = useDateTime();
  const { OpenDialog, CloseDialog } = useDialog();
  const { user, users, token, instance, workspaces, workspaceId } = useSystem();

  const [photoTemp, setPhotoTemp] = useState<File | null>(null);
  const [position, setPosition] = useState<[number, number] | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [form, setForm] = useState<Partial<TypeCustomer>>({
    id: "",
    status: true,

    name: "",
    description: "",
    document1: "",
    phone1: "",
    mobile: "",
    email: "",

    representativeName: "",
    representativeRole: "",
    phone2: "",
    document2: "",

    addresses: [],

    userId: user.id,
    workspaceId,
  });

  const userFinded = form.userId
    ? users.find(function (userLocal) {
        return form.userId === userLocal.id;
      })
    : null;

  // get position
  useAsync(
    async function () {
      const addressFirst = form.addresses?.[0];
      if (!addressFirst) return;
      if (!addressFirst.street || !addressFirst.number || !addressFirst.city)
        return;
      try {
        const response = await apis.AddressPosition(addressFirst);
        if (
          !response.data ||
          !response.data?.[0]?.lat ||
          !response.data?.[0]?.lon
        ) {
          console.warn(
            "[src/pages/administrative/customers/CustomersInspect.tsx]",
            response.data,
          );
          return;
        }
        setPosition([
          parseFloat(String(response.data[0].lat)),
          parseFloat(String(response.data[0].lon)),
        ]);
      } catch (err) {
        console.error(
          "[src/pages/administrative/customers/CustomersInspect.tsx]",
          err,
        );
      }
      return;
    },
    [
      form.addresses?.[0]?.street,
      form.addresses?.[0]?.number,
      form.addresses?.[0]?.city,
    ],
  );

  // fetch customer
  useAsync(async function () {
    if (!id) return;
    setLoading(true);
    try {
      const response = await apis.Customer.get(
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
        navigate("/f/customers");
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
        "[src/pages/administrative/customers/CustomersInspect.tsx]",
        err,
      );
      navigate("/f/customers");
      return;
    } finally {
      setLoading(false);
    }
  }, []);

  const onSubmit = async function (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      // is editing
      if (id) {
        // upload photo temp
        if (photoTemp) {
          const responseUploadImage = await apis.Upload.image<string>(
            instance.name,
            token,
            {
              file: photoTemp,
              path: `image/customer/${id}`,
              name: id,
              height: 256,
              width: 256,
              quality: 100,
            },
          );
          form.photo = responseUploadImage.data?.result || null;
        }
        const response = await apis.Customer.update<TypeCustomer>(
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
        navigate("/f/customers");
        return;
      }
      // is creating
      const response = await apis.Customer.create<TypeCustomer>(
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
      // upload photo temp
      if (photoTemp) {
        const responseUploadImage = await apis.Upload.image<string>(
          instance.name,
          token,
          {
            file: photoTemp,
            path: `image/customer/${response.data.result.id}`,
            name: response.data.result.id,
            height: 256,
            width: 256,
            quality: 100,
          },
        );
        form.photo = responseUploadImage.data?.result || null;
      }
      await apis.Customer.update(
        token,
        instance.name,
        response.data.result.id,
        {
          photo: form.photo,
        },
        workspaceId,
      );
      play("ok");
      toast.success(t.toast.success, {
        description: t.toast.success_create,
      });
      navigate("/f/customers");
      return;
    } catch (err) {
      play("alert");
      console.error(
        "[src/pages/administrative/customers/CustomersInspect.tsx]",
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
    } finally {
      // delay to not duplicate when save
      setTimeout(function () {
        setLoading(false);
      }, 500);
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
                id: "customers",
                label: t.customer.customers,
                url: "/f/customers",
              },
              {
                id: "customer",
                label: form?.name || t.components.empty_name,
                url: `/f/customers/inspect${id ? `/${id}` : ""}`,
              },
            ]}
          />
        </h2>
      </Horizontal>

      <form onSubmit={onSubmit}>
        <Vertical internal={1}>
          <Wrapper styles={{ minWidth: "40%" }}>
            <Horizontal internal={1} className="itemsCenter">
              <Avatar
                label=""
                size={14}
                Icon={UserList}
                photo={
                  photoTemp ? URL.createObjectURL(photoTemp) : form?.photo || ""
                }
              />

              <InputFile
                name="photo"
                value={photoTemp}
                disabled={loading}
                id="customer_photo"
                helper="PNG, JPG e JPEG"
                label={t.components.photo}
                accept="image/png, image/jpg, image/jpeg"
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
                  setPhotoTemp(file);
                  return;
                }}
              />
            </Horizontal>
          </Wrapper>

          <Wrapper
            title={id ? t.customer.title_edit : t.customer.title_create}
            description={t.customer.subtitle}
          >
            <Vertical internal={1}>
              <Horizontal internal={1}>
                <InputSelect
                  required
                  name="status"
                  id="customer_status"
                  empty={t.stacks.no_option}
                  value={String(form.status)}
                  label={t.components.status}
                  disabled={loading}
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
                  id="customer_name"
                  value={form?.name || ""}
                  label={t.customer.name}
                  disabled={loading}
                  placeholder={t.customer.name_placeholder}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.name = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
                <InputMask
                  name="document1"
                  mask={MaskDocument1}
                  id="customer_document_1"
                  label={t.customer.document_1}
                  value={form?.document1 || ""}
                  disabled={loading}
                  placeholder={t.customer.document_placeholder}
                  onChange={async function (event) {
                    const newForm = { ...form };
                    const document1Raw = event.currentTarget?.value || "";
                    const document1 = document1Raw.replace(/\D/g, "");
                    newForm.document1 = document1;
                    if (document1.length === 14) {
                      const toastId = toast.loading(t.components.loading);
                      try {
                        const response = await apis.CompanyData(document1);
                        newForm.phone1 = response.data?.ddd_telefone_1
                          ? `+55${response.data?.ddd_telefone_1}`
                          : newForm.phone1;
                        newForm.phone2 = response.data?.ddd_telefone_2
                          ? `+55${response.data?.ddd_telefone_2}`
                          : newForm.phone2;
                        newForm.name =
                          response.data?.nome_fantasia ||
                          response.data?.razao_social ||
                          newForm.name;
                        newForm.email = response.data?.email || newForm.email;
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
                          "[src/pages/administrative/customers/CustomerInspect.tsx]",
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
              </Horizontal>

              <Horizontal internal={1}>
                <InputMask
                  required
                  name="mobile"
                  mask={MaskPhone}
                  id="customer_mobile"
                  label={t.customer.mobile}
                  value={form?.mobile || ""}
                  disabled={loading}
                  placeholder={t.customer.mobile_placeholder}
                  onChange={async function (event) {
                    const newForm = { ...form };
                    const mobileRaw = event.currentTarget?.value || "";
                    const mobile = mobileRaw.replace(/\D/g, "");
                    if (mobile.length === 13) {
                      setLoading(true);
                      const toastId = toast.loading(t.components.loading);
                      try {
                        const responseWhatsApp = await apis.WhatsApp.contact({
                          number: mobile,
                        });
                        newForm.name =
                          !newForm.name?.length &&
                          responseWhatsApp.data.result?.name
                            ? responseWhatsApp.data.result?.name
                            : newForm.name;
                        newForm.description =
                          responseWhatsApp.data.result.description ||
                          newForm.description;
                        if (responseWhatsApp.data.result?.photoUrl) {
                          const responsePhoto = await axios.get(
                            responseWhatsApp.data.result?.photoUrl,
                            {
                              responseType: "blob",
                            },
                          );
                          const mimeType =
                            responsePhoto.headers["content-type"] ||
                            "image/jpeg";
                          const newPhoto = new File(
                            [responsePhoto.data],
                            "customer",
                            {
                              type: mimeType,
                            },
                          );
                          setPhotoTemp(newPhoto);
                        }
                        play("ok");
                        toast.dismiss(toastId);
                        toast.success(t.toast.success, {
                          description: t.toast.success_find,
                        });
                      } catch (err) {
                        console.error(
                          "[src/pages/administrative/customers/CustomerInspect.tsx]",
                          err,
                        );
                        toast.dismiss(toastId);
                        play("alert");
                        toast.warning(t.toast.warning_error, {
                          description: t.toast.warning_find,
                        });
                      } finally {
                        setLoading(false);
                      }
                    }
                    newForm.mobile = mobile;
                    setForm(newForm);
                    return;
                  }}
                />
                <InputMask
                  name="phone1"
                  mask={MaskPhone}
                  id="customer_phone_1"
                  label={t.customer.phone_1}
                  value={form?.phone1 || ""}
                  disabled={loading}
                  placeholder={t.customer.mobile_placeholder}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.phone1 = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
                <Input
                  min={4}
                  max={32}
                  type="email"
                  name="email"
                  id="customer_email"
                  value={form?.email || ""}
                  label={t.customer.email}
                  disabled={loading}
                  placeholder={t.customer.email_placeholder}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.email = event.currentTarget?.value || "";
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
                  id="customer_description"
                  value={form?.description || ""}
                  label={t.components.description}
                  disabled={loading}
                  placeholder={t.customer.description_placeholder}
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
                Icon={UserList}
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
            title={t.customer.title_representative}
            description={t.customer.subtitle_representative}
          >
            <Vertical internal={1}>
              <Horizontal internal={1}>
                <Input
                  max={32}
                  disabled={loading}
                  name="representativeName"
                  id="customer_representative_name"
                  value={form?.representativeName || ""}
                  label={t.customer.representative_name}
                  placeholder={t.customer.representative_name_placeholder}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.representativeName =
                      event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
                <Input
                  max={32}
                  disabled={loading}
                  name="representativeRole"
                  id="customer_representative_role"
                  value={form?.representativeRole || ""}
                  label={t.customer.representative_role}
                  placeholder={t.customer.representative_role_placeholder}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.representativeRole =
                      event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
              </Horizontal>

              <Horizontal internal={1}>
                <InputMask
                  name="document2"
                  mask={MaskDocument2}
                  id="customer_document_2"
                  label={t.customer.document_2}
                  value={form?.document2 || ""}
                  disabled={loading}
                  placeholder={t.customer.document_placeholder}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.document2 = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
                <InputMask
                  name="phone2"
                  mask={MaskPhone}
                  id="customer_phone_2"
                  label={t.customer.phone_2}
                  value={form?.phone2 || ""}
                  disabled={loading}
                  placeholder={t.customer.mobile_placeholder}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.phone2 = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
              </Horizontal>
            </Vertical>
          </Wrapper>

          <Wrapper
            title={t.customer.title_addresses}
            description={t.customer.subtitle_addresses}
          >
            <Horizontal internal={1}>
              <Vertical internal={1} className="flex1">
                {form.addresses?.map(function (_, index) {
                  return (
                    <Vertical internal={1} key={`address-${index}`}>
                      <Horizontal
                        internal={1}
                        styles={{ alignItems: "flex-end" }}
                      >
                        <InputMask
                          required
                          mask={MaskPostalCode}
                          disabled={loading}
                          name={`addresses[${index}].postalCode`}
                          label={t.components.address_postal_code}
                          id={`customer_addresses_${index}_postal_code`}
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
                              setLoading(true);
                              const toastId = toast.loading(
                                t.components.loading,
                              );
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
                                  "[src/pages/administrative/customers/CustomerInspect.tsx]",
                                  err,
                                );
                                toast.dismiss(toastId);
                                play("alert");
                                toast.warning(t.toast.warning_error, {
                                  description: t.toast.warning_find,
                                });
                              } finally {
                                setLoading(false);
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
                          name={`addresses[${index}].street`}
                          id={`customer_addresses_${index}_street`}
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
                          disabled={loading}
                          text={t.components.remove}
                          onClick={function () {
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
                          disabled={loading}
                          label={t.components.address_number}
                          name={`addresses[${index}].number`}
                          id={`customer_addresses_${index}_number`}
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
                          disabled={loading}
                          label={t.components.address_complement}
                          name={`addresses[${index}].complement`}
                          id={`customer_addresses_${index}_complement`}
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
                          disabled={loading}
                          label={t.components.address_neighborhood}
                          name={`addresses[${index}].neighborhood`}
                          id={`customer_addresses_${index}_neighborhood`}
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
                          disabled={loading}
                          name={`addresses[${index}].city`}
                          label={t.components.address_city}
                          id={`customer_addresses_${index}_city`}
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
                          disabled={loading}
                          name={`addresses[${index}].state`}
                          label={t.components.address_state}
                          id={`customer_addresses_${index}_state`}
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

                <Horizontal internal={1} styles={{ justifyContent: "center" }}>
                  <Button
                    type="button"
                    category="Success"
                    disabled={loading}
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

                  {form.addresses && form.addresses.length > 0 && (
                    <Callout
                      Icon={MapTrifold}
                      IconSize={16}
                      category="Info"
                      text={t.callout.postal_code_search}
                      styles={{ flex: 1, fontSize: "var(--textSmall)" }}
                    />
                  )}
                </Horizontal>
              </Vertical>

              {position && (
                <iframe
                  loading="lazy"
                  width="25%"
                  height={320}
                  src={`https://maps.google.com/maps?q=${position.join(",")}&z=15&output=embed&maptype=satellite`}
                ></iframe>
              )}
            </Horizontal>
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
                disabled={loading}
                text={t.components.cancel}
                onClick={function () {
                  navigate("/f/customers");
                  return;
                }}
              />
              <Button
                type="submit"
                disabled={loading}
                category={id ? "Info" : "Success"}
                text={id ? t.components.edit : t.components.save}
              />
            </Horizontal>
          </Wrapper>

          <div style={{ height: 128 }}></div>
        </Vertical>
      </form>
    </React.Fragment>
  );
};

export default CustomersInspect;
