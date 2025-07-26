import { toast } from "sonner";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { Asterisk, User } from "@phosphor-icons/react";
import { useNavigate, useParams } from "react-router-dom";

// apis
import apis from "../../../apis";

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

const EmployeesInspect = function () {
  const t = useTranslate();
  const play = useSounds();
  const { id } = useParams();
  const Schema = useSchema();
  const navigate = useNavigate();
  const { instanceDateTime } = useDateTime();
  const { user, token, instance, workspaces, workspaceId, saveUser } =
    useSystem();

  const [photoTemp, setPhotoTemp] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
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

  // fetch employee
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
        navigate("/f/employees");
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
        "[src/pages/administrative/employees/EmployeesInspect.tsx]",
        err,
      );
      navigate("/f/employees");
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
        // upload photo temp
        if (photoTemp) {
          const responseUploadImage = await apis.Upload.image<string>(
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
          form.photo = responseUploadImage.data?.result || null;
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
        play("ok");
        toast.success(t.toast.success, {
          description: t.toast.success_edit,
        });
        navigate("/f/employees");
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
        const responseUploadImage = await apis.Upload.image<string>(
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
        form.photo = responseUploadImage.data?.result || null;
      }
      await apis.User.update(token, instance.name, response.data.result.id, {
        photo: form.photo,
      });
      play("ok");
      toast.success(t.toast.success, {
        description: t.toast.success_create,
      });
      navigate("/f/employees");
      return;
    } catch (err) {
      play("alert");
      console.error(
        "[src/pages/administrative/employees/EmployeesInspect.tsx]",
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
                id: "employees",
                label: t.employee.employees,
                url: "/f/employees",
              },
              {
                id: "employee",
                label: form?.name || t.components.empty_name,
                url: `/f/employees/inspect${id ? `/${id}` : ""}`,
              },
            ]}
          />
        </h2>
      </Horizontal>
      <form onSubmit={onSubmit}>
        <Vertical internal={1}>
          <Horizontal internal={1}>
            <Wrapper>
              <Horizontal internal={1} styles={{ alignItems: "center" }}>
                <Avatar
                  label=""
                  size={12}
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
                  id="employee_photo"
                  helper="PNG, JPG e JPEG"
                  label={t.employee.photo}
                  disabled={loading && Boolean(id)}
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
              title="Históricos"
              description="Aqui ficam todos os históricos desse colaborador"
            >
              <Vertical internal={0.4} styles={{ alignItems: "center" }}>
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
            title={id ? t.employee.title_edit : t.employee.title_create}
            description={t.employee.subtitle}
          >
            <Vertical internal={1}>
              <Horizontal internal={1}>
                <InputSelect
                  required
                  name="status"
                  id="employee_status"
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
                  id="employee_name"
                  value={form?.name || ""}
                  label={t.employee.name}
                  disabled={loading && Boolean(id)}
                  placeholder={t.employee.name_placeholder}
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
                  id="employee_role"
                  label={t.employee.role}
                  empty={t.stacks.no_option}
                  disabled={loading && Boolean(id)}
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
                  id="employee_document_1"
                  label={t.employee.document_1}
                  value={form?.document1 || ""}
                  disabled={loading && Boolean(id)}
                  placeholder={t.employee.document_placeholder}
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
                  id="employee_document_2"
                  label={t.employee.document_2}
                  value={form?.document2 || ""}
                  disabled={loading && Boolean(id)}
                  placeholder={t.employee.document_placeholder}
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
                  id="employee_phone"
                  label={t.employee.phone}
                  value={form?.phone || ""}
                  disabled={loading && Boolean(id)}
                  placeholder={t.employee.phone_placeholder}
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
                  id="employee_mobile"
                  label={t.employee.mobile}
                  value={form?.mobile || ""}
                  disabled={loading && Boolean(id)}
                  placeholder={t.employee.phone_placeholder}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.mobile = event.currentTarget?.value || "";
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
                  id="employee_email"
                  value={form?.email || ""}
                  label={t.employee.email}
                  disabled={loading && Boolean(id)}
                  placeholder={t.employee.email_placeholder}
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
            </Vertical>
          </Wrapper>

          <Wrapper
            title={id ? t.employee.title_address : t.employee.title_address}
            description={t.employee.subtitle_address}
          >
            <Vertical internal={1}>
              <Horizontal internal={1}>
                <InputMask
                  required
                  mask={MaskPostalCode}
                  name="addressPostalCode"
                  id="employee_address_postal_code"
                  disabled={loading && Boolean(id)}
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
                  name="addressStreet"
                  id="employee_address_street"
                  disabled={loading && Boolean(id)}
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
                  id="employee_address_number"
                  disabled={loading && Boolean(id)}
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
                  id="employee_address_complement"
                  disabled={loading && Boolean(id)}
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
                  id="employee_address_neighborhood"
                  disabled={loading && Boolean(id)}
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
                  id="employee_address_city"
                  value={form?.addressCity || ""}
                  disabled={loading && Boolean(id)}
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
                  id="employee_address_state"
                  value={form?.addressState || ""}
                  disabled={loading && Boolean(id)}
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
                category="Neutral"
                text={t.components.cancel}
                onClick={function () {
                  navigate("/f/employees");
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

export default EmployeesInspect;
