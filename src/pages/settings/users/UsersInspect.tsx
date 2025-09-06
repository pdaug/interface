import { toast } from "sonner";
import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Asterisk, MapTrifold, User, UserList } from "@phosphor-icons/react";

// apis
import apis from "../../../apis";

// utils
import { GenerateId } from "../../../utils/GenerateId";

// types
import { TypeUser, TypeUserRole } from "../../../types/User";

// assets
import {
  MaskPhone,
  MaskDocument1,
  MaskDocument2,
  MaskPostalCode,
} from "../../../assets/Mask";
import { UserRoles } from "../../../assets/User";
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
  InputMask,
  InputSelect,
} from "../../../components/inputs/Input";
import Button from "../../../components/buttons/Button";
import Avatar from "../../../components/avatars/Avatar";
import Wrapper from "../../../components/wrapper/Wrapper";
import Callout from "../../../components/callouts/Callout";
import Breadcrumb from "../../../components/breadcrumbs/Breadcrumb";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

const UsersInspect = function () {
  const t = useTranslate();
  const play = useSounds();
  const { id } = useParams();
  const Schema = useSchema();
  const navigate = useNavigate();
  const { instanceDateTime } = useDateTime();
  const {
    user,
    users,
    token,
    instance,
    workspaces,
    workspaceId,
    setUsers,
    saveUser,
  } = useSystem();

  const [loading, setLoading] = useState<boolean>(false);
  const [photoTemp, setPhotoTemp] = useState<File | null>(null);
  const [position, setPosition] = useState<[number, number] | null>(null);

  const [form, setForm] = useState<Partial<TypeUser>>({
    id: "",
    status: true,
    name: "",
    password: "1234567890",
    document1: "",
    document2: "",
    phone: "",
    mobile: "",
    email: "",
    role: "collaborator",
    addressStreet: "",
    addressNumber: "",
    addressComplement: "",
    addressPostalCode: "",
    addressNeighborhood: "",
    addressCity: "",
    addressState: "",
  });

  // fetch users
  useAsync(async function () {
    if (!id) return;
    setLoading(true);
    try {
      const response = await apis.User.get(token, instance.name, id);
      if (!response.data?.result || response.status !== 200) {
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        navigate("/f/users");
        return;
      }
      setForm(response.data.result);
      return;
    } catch (err) {
      play("alert");
      toast.warning(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("[src/pages/settings/users/UsersInspect.tsx]", err);
      navigate("/f/users");
      return;
    } finally {
      setLoading(false);
    }
  }, []);

  // get position
  useAsync(
    async function () {
      if (!form.addressStreet || !form.addressNumber || !form.addressCity)
        return;
      try {
        const response = await apis.AddressPosition({
          street: form.addressStreet,
          number: form.addressNumber,
          city: form.addressCity,
        });
        if (
          !response.data ||
          !response.data?.[0]?.lat ||
          !response.data?.[0]?.lon
        ) {
          console.warn(
            "[src/pages/settings/users/UsersInspect.tsx]",
            response.data,
          );
          return;
        }
        setPosition([
          parseFloat(String(response.data[0].lat)),
          parseFloat(String(response.data[0].lon)),
        ]);
      } catch (err) {
        console.error("[src/pages/settings/users/UsersInspect.tsx]", err);
      }
      return;
    },
    [form.addressStreet, form.addressNumber, form.addressCity],
  );

  const onSubmit = async function (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const hash = GenerateId();
      // is editing
      if (id) {
        // upload photo temp
        if (photoTemp) {
          const responseUploadImage = await apis.Storage.image<string>(
            instance.name,
            token,
            {
              file: photoTemp,
              path: `image/user/${id}`,
              name: id,
              height: 256,
              width: 256,
              quality: 100,
            },
          );
          const userPhoto = responseUploadImage.data?.result;
          form.photo = userPhoto ? `${userPhoto}&hash=${hash}` : null;
        }
        const response = await apis.User.update<TypeUser>(
          token,
          instance.name,
          id,
          form,
        );
        if (!response.data?.result || response.status !== 200) {
          play("alert");
          toast.warning(t.toast.warning_error, {
            description: t.toast.warning_edit,
          });
          return;
        }
        // if user update it is yourself
        if (id === user.id) saveUser(response.data.result);
        // update user
        const usersClone = [...users];
        const userIndex = usersClone.findIndex(function (userLocal) {
          return userLocal.id === id;
        });
        if (userIndex > -1) {
          usersClone[userIndex] = {
            ...usersClone[userIndex],
            ...form,
          };
          setUsers(usersClone);
        }
        play("ok");
        toast.success(t.toast.success, {
          description: t.toast.success_edit,
        });
        navigate("/f/users");
        return;
      }
      // is creating
      const response = await apis.User.create<TypeUser>(
        token,
        instance.name,
        form,
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
        const responseUploadImage = await apis.Storage.image<string>(
          instance.name,
          token,
          {
            file: photoTemp,
            path: `image/user/${response.data.result.id}`,
            name: response.data.result.id,
            height: 256,
            width: 256,
            quality: 100,
          },
        );
        const userPhoto = responseUploadImage.data?.result;
        form.photo = userPhoto ? `${userPhoto}&hash=${hash}` : null;
      }
      await apis.User.update(token, instance.name, response.data.result.id, {
        photo: form.photo,
      });
      play("ok");
      toast.success(t.toast.success, {
        description: t.toast.success_create,
      });
      navigate("/f/users");
      return;
    } catch (err) {
      play("alert");
      console.error("[src/pages/settings/users/UsersInspect.tsx]", err);
      if (
        err instanceof AxiosError &&
        err.response?.data?.result?.message === "over_limit_user"
      ) {
        toast.error(t.toast.warning_error, {
          description: t.stacks.limit_user,
        });
        return;
      }
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
                id: "users",
                label: t.user.users,
                url: "/f/users",
              },
              {
                id: "user",
                label: form?.name || t.components.empty_name,
                url: `/f/users/inspect${id ? `/${id}` : ""}`,
              },
            ]}
          />
        </h2>
      </Horizontal>

      <form onSubmit={onSubmit}>
        <Vertical internal={1}>
          <Horizontal internal={1}>
            <Wrapper
              styles={{ maxWidth: "40%" }}
              contentStyles={{ display: "flex" }}
            >
              <Horizontal internal={1} className="flex1 itemsCenter">
                <Avatar
                  label=""
                  size={14}
                  Icon={User}
                  photo={
                    photoTemp
                      ? URL.createObjectURL(photoTemp)
                      : form?.photo || ""
                  }
                />
                <InputFile
                  name="photo"
                  value={photoTemp}
                  id="user_photo"
                  helper="PNG, JPG e JPEG"
                  label={t.user.photo}
                  disabled={loading}
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
              title={t.user.schedules_title}
              description={t.user.schedules_description}
            >
              <Vertical
                internal={0.4}
                className="itemsCenter"
                styles={{ height: 96 }}
              >
                <span
                  style={{
                    color: "var(--textLight)",
                    fontSize: "var(--textSmall)",
                  }}
                >
                  {t.stacks.no_items}
                </span>
              </Vertical>
            </Wrapper>
          </Horizontal>

          <Wrapper
            title={id ? t.user.title_edit : t.user.title_create}
            description={t.user.subtitle}
          >
            <Vertical internal={1}>
              <Horizontal internal={1}>
                <InputSelect
                  required
                  name="status"
                  disabled={loading}
                  id="user_status"
                  empty={t.stacks.no_option}
                  value={String(form.status)}
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
                  id="user_name"
                  value={form?.name || ""}
                  label={t.user.name}
                  disabled={loading}
                  placeholder={t.user.name_placeholder}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.name = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
                <InputSelect
                  required
                  name="role"
                  id="user_role"
                  label={t.user.role}
                  empty={t.stacks.no_option}
                  disabled={loading}
                  value={form?.role || "collaborator"}
                  options={UserRoles.map(function (option) {
                    return {
                      id: option,
                      value: option,
                      text: t.components[option as keyof typeof t.components],
                      disabled: option === "master",
                    };
                  })}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.role = (event.currentTarget?.value ||
                      "collaborator") as TypeUserRole;
                    setForm(newForm);
                    return;
                  }}
                />
              </Horizontal>

              <Horizontal internal={1}>
                <InputMask
                  required
                  name="document1"
                  mask={MaskDocument1}
                  id="user_document_1"
                  label={t.user.document_1}
                  value={form?.document1 || ""}
                  disabled={loading}
                  placeholder={t.user.document_placeholder}
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
                  id="user_document_2"
                  label={t.user.document_2}
                  value={form?.document2 || ""}
                  disabled={loading}
                  placeholder={t.user.document_placeholder}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.document2 = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
              </Horizontal>

              <Horizontal internal={1}>
                <InputMask
                  name="phone"
                  mask={MaskPhone}
                  id="user_phone"
                  label={t.user.phone}
                  value={form?.phone || ""}
                  disabled={loading}
                  placeholder={t.user.phone_placeholder}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.phone = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
                <InputMask
                  required
                  name="mobile"
                  mask={MaskPhone}
                  id="user_mobile"
                  label={t.user.mobile}
                  value={form?.mobile || ""}
                  disabled={loading}
                  placeholder={t.user.phone_placeholder}
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
                            "user",
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
                          "[src/pages/settings/users/UsersInspect.tsx]",
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
                <Input
                  min={4}
                  max={32}
                  required
                  type="email"
                  name="email"
                  id="user_email"
                  value={form?.email || ""}
                  label={t.user.email}
                  disabled={loading}
                  placeholder={t.user.email_placeholder}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.email = event.currentTarget?.value || "";
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
                text={t.callout.person_mobile_search}
                styles={{ fontSize: "var(--textSmall)" }}
              />
            </Vertical>
          </Wrapper>

          <Wrapper
            title={id ? t.user.title_address : t.user.title_address}
            description={t.user.subtitle_address}
          >
            <Horizontal internal={1}>
              <Vertical internal={1} className="flex1">
                <Horizontal internal={1}>
                  <InputMask
                    required
                    mask={MaskPostalCode}
                    name="addressPostalCode"
                    id="user_address_postal_code"
                    disabled={loading}
                    value={form?.addressPostalCode || ""}
                    label={t.components.address_postal_code}
                    placeholder={t.components.address_postal_code_placeholder}
                    onChange={async function (event) {
                      const newForm = { ...form };
                      const postalCodeRaw = event.currentTarget?.value || "";
                      const postalCode = postalCodeRaw.replace(/\D/g, "");
                      newForm.addressPostalCode = postalCode;
                      if (postalCode.length === 8) {
                        setLoading(true);
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
                            "[src/pages/settings/users/UsersInspect.tsx]",
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
                    name="addressStreet"
                    id="user_address_street"
                    disabled={loading}
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
                    name="addressNumber"
                    id="user_address_number"
                    disabled={loading}
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
                    name="addressComplement"
                    id="user_address_complement"
                    disabled={loading}
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
                    name="addressNeighborhood"
                    id="user_address_neighborhood"
                    disabled={loading}
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
                    name="addressCity"
                    id="user_address_city"
                    value={form?.addressCity || ""}
                    disabled={loading}
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
                    name="addressState"
                    empty={t.stacks.no_option}
                    id="user_address_state"
                    value={form?.addressState || ""}
                    disabled={loading}
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

                <Callout
                  Icon={MapTrifold}
                  IconSize={16}
                  category="Info"
                  text={t.callout.postal_code_search}
                  styles={{ fontSize: "var(--textSmall)" }}
                />
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
              {id && (
                <Button
                  type="button"
                  category="Neutral"
                  disabled={loading}
                  text={t.user.audit}
                  onClick={function () {
                    navigate(`/f/users/audit/${id}`);
                    return;
                  }}
                />
              )}
              <Button
                type="button"
                category="Neutral"
                disabled={loading}
                text={t.components.cancel}
                onClick={function () {
                  navigate("/f/users");
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

export default UsersInspect;
