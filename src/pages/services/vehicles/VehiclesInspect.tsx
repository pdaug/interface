import { toast } from "sonner";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { Asterisk, CarSimple } from "@phosphor-icons/react";
import { useNavigate, useParams } from "react-router-dom";

// apis
import apis from "../../../apis";

// types
import {
  TypeVehicle,
  TypeVehicleCategory,
  TypeVehiclePlateType,
} from "../../../types/Vehicle";

// assets
import {
  VehicleBrandsOptions,
  VehicleCategoryOptions,
} from "../../../assets/Vehicle";
import { MaskPlate, MaskPlateOld } from "../../../assets/Mask";

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
  InputColor,
  InputSelect,
  InputMaskV2,
} from "../../../components/inputs/Input";
import Avatar from "../../../components/avatars/Avatar";
import Button from "../../../components/buttons/Button";
import Wrapper from "../../../components/wrapper/Wrapper";
import Callout from "../../../components/callouts/Callout";
import Profile from "../../../components/profiles/Profile";
import Breadcrumb from "../../../components/breadcrumbs/Breadcrumb";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

// TODO: search fipe
// TODO: add outflow fuel
const VehiclesInspect = function () {
  const t = useTranslate();
  const play = useSounds();
  const { id } = useParams();
  const Schema = useSchema();
  const navigate = useNavigate();
  const { instanceDateTime } = useDateTime();
  const { user, users, token, instance, workspaces, workspaceId } = useSystem();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Partial<TypeVehicle>>({
    id: "",
    status: true,
    name: "",
    description: "",
    category: "passenger",
    document: "",
    plate: "",
    plateType: "brazil",
    chassi: "",
    color: "#000000",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    workspaceId,
    userId: user.id,
  });

  const userFinded = form.userId
    ? users.find(function (userLocal) {
        return form.userId === userLocal.id;
      })
    : null;

  // fetch vehicle
  useAsync(async function () {
    if (!id) return;
    const toastId = toast.loading(t.components.loading);
    setLoading(true);
    try {
      const response = await apis.Vehicle.get(
        token,
        instance.name,
        id,
        workspaceId,
      );
      if (!response.data?.result || response.status !== 200) {
        play("alert");
        toast.dismiss(toastId);
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        navigate("/f/vehicles");
        setLoading(false);
        return;
      }
      setForm(response.data.result);
      toast.dismiss(toastId);
      return;
    } catch (err) {
      play("alert");
      toast.dismiss(toastId);
      toast.error(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error(
        "[src/pages/operational/vehicles/VehiclesInspect.tsx]",
        err,
      );
      navigate("/f/vehicles");
      setLoading(false);
      return;
    } finally {
      toast.dismiss(toastId);
      setLoading(false);
    }
  }, []);

  const onSubmit = async function (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const toastId = toast.loading(t.components.loading);
    try {
      // is editing
      if (id && form.id) {
        const response = await apis.Vehicle.update(
          token,
          instance.name,
          id,
          form,
          workspaceId,
        );
        if (!response.data?.result || response.status !== 200) {
          play("alert");
          setLoading(false);
          toast.dismiss(toastId);
          toast.warning(t.toast.warning_error, {
            description: t.toast.warning_edit,
          });
          return;
        }
        play("ok");
        toast.dismiss(toastId);
        toast.success(t.toast.success, {
          description: t.toast.success_edit,
        });
        navigate("/f/vehicles");
        setLoading(false);
        return;
      }
      // is creating
      const response = await apis.Vehicle.create<TypeVehicle>(
        token,
        instance.name,
        form,
        workspaceId,
      );
      if (!response.data?.result || response.status !== 201) {
        play("alert");
        toast.dismiss(toastId);
        toast.warning(t.toast.warning_error, {
          description: t.toast.warning_create,
        });
        setLoading(false);
        return;
      }
      play("ok");
      toast.dismiss(toastId);
      toast.success(t.toast.success, {
        description: t.toast.success_create,
      });
      navigate("/f/vehicles");
      setLoading(false);
      return;
    } catch (err) {
      setLoading(false);
      play("alert");
      toast.dismiss(toastId);
      console.error(
        "[src/pages/operational/vehicles/VehiclesInspect.tsx]",
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
      setLoading(true);
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
                id: "vehicles",
                label: t.vehicle.vehicles,
                url: "/f/vehicles",
              },
              {
                id: "vehicle",
                label: form?.name || t.components.empty_name,
                url: `/f/vehicles/inspect${id ? `/${id}` : ""}`,
              },
            ]}
          />
        </h2>
      </Horizontal>

      <form onSubmit={onSubmit}>
        <Vertical internal={1}>
          <Wrapper
            title={id ? t.vehicle.title_edit : t.vehicle.title_create}
            description={t.vehicle.subtitle}
          >
            <Horizontal internal={1} className="itemsCenter">
              <Avatar
                label=""
                size={14}
                Icon={CarSimple}
                photo={
                  VehicleBrandsOptions.find(function (brand) {
                    return form.brand?.toLowerCase() === brand.name;
                  })?.image || ""
                }
              />

              <Vertical internal={1} className="flex1">
                <Horizontal internal={1}>
                  <InputSelect
                    required
                    name="status"
                    id="vehicle_status"
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
                    min={1}
                    max={32}
                    required
                    name="name"
                    id="vehicle_name"
                    value={form?.name || ""}
                    label={t.vehicle.name}
                    disabled={loading}
                    placeholder={t.vehicle.name_placeholder}
                    onChange={function (event) {
                      const newForm = { ...form };
                      newForm.name = event.currentTarget?.value || "";
                      setForm(newForm);
                      return;
                    }}
                  />
                  <InputSelect
                    required
                    name="category"
                    id="vehicle_category"
                    label={t.vehicle.category}
                    empty={t.stacks.no_option}
                    disabled={loading}
                    value={form?.category || "passenger"}
                    options={VehicleCategoryOptions.map(function (option) {
                      return {
                        id: option,
                        value: option,
                        text: t.vehicle[option as keyof typeof t.vehicle],
                      };
                    })}
                    onChange={function (event) {
                      const newForm = { ...form };
                      newForm.category = (event.currentTarget?.value ||
                        "passenger") as TypeVehicleCategory;
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
                    name="document"
                    id="vehicle_document"
                    value={form?.document || ""}
                    label={t.vehicle.document}
                    disabled={loading}
                    placeholder={t.vehicle.document_placeholder}
                    onChange={function (event) {
                      const newForm = { ...form };
                      newForm.document = event.currentTarget?.value || "";
                      setForm(newForm);
                      return;
                    }}
                  />
                  <InputSelect
                    empty={t.stacks.no_option}
                    styles={{ maxWidth: 180 }}
                    label={t.vehicle.plate_type}
                    value={form.plateType as TypeVehiclePlateType}
                    options={[
                      {
                        id: "brazil",
                        value: "brazil",
                        text: t.vehicle.plate_brazil,
                      },
                      {
                        id: "mercosul",
                        value: "mercosul",
                        text: t.vehicle.plate_mercosul,
                      },
                    ]}
                    onChange={function (event) {
                      const newForm = { ...form };
                      const newPlateType =
                        event.currentTarget?.value || "brazil";
                      newForm.plateType = newPlateType as TypeVehiclePlateType;
                      setForm(newForm);
                      return;
                    }}
                  />
                  <InputMaskV2
                    required
                    name="plate"
                    id="vehicle_plate"
                    label={t.vehicle.plate}
                    value={form?.plate || ""}
                    disabled={loading}
                    placeholder={
                      t.vehicle?.[
                        `plate_${form.plateType}_placeholder` as keyof typeof t.vehicle
                      ] || t.components.unknown
                    }
                    mask={
                      MaskPlate?.[form.plateType as TypeVehiclePlateType] ||
                      MaskPlateOld
                    }
                    onChange={function (event) {
                      const newForm = { ...form };
                      newForm.plate = (
                        event.currentTarget?.value || ""
                      ).toUpperCase();
                      setForm(newForm);
                      return;
                    }}
                  />
                  <Input
                    min={1}
                    max={32}
                    required
                    name="chassi"
                    id="vehicle_chassi"
                    value={form?.chassi || ""}
                    label={t.vehicle.chassi}
                    disabled={loading}
                    placeholder={t.vehicle.document_placeholder}
                    onChange={function (event) {
                      const newForm = { ...form };
                      newForm.chassi = event.currentTarget?.value || "";
                      setForm(newForm);
                      return;
                    }}
                  />
                </Horizontal>

                <Horizontal internal={1}>
                  <InputColor
                    name="color"
                    id="vehicle_color"
                    label={t.vehicle.color}
                    value={form?.color || "#000000"}
                    disabled={loading}
                    onChange={function (event) {
                      const newForm = { ...form };
                      newForm.color = event.currentTarget?.value || "#000000";
                      setForm(newForm);
                      return;
                    }}
                  />
                  <InputSelect
                    name="brand"
                    id="vehicle_brand"
                    label={t.vehicle.brand}
                    value={form?.brand?.toLowerCase() || ""}
                    empty={t.stacks.no_option}
                    disabled={loading}
                    options={[
                      ...VehicleBrandsOptions.map(function (brand) {
                        const brandName = brand.name.replace("_", " ");
                        const text = `${brandName.slice(0, 1).toUpperCase()}${brandName.slice(1)}`;
                        return {
                          id: brand.name,
                          value: brand.name,
                          text,
                        };
                      }),
                      {
                        id: "other",
                        value: "other",
                        text: t.components.others,
                      },
                    ]}
                    onChange={function (event) {
                      const newForm = { ...form };
                      newForm.brand = event.currentTarget?.value || "";
                      setForm(newForm);
                      return;
                    }}
                  />
                  <Input
                    max={32}
                    name="model"
                    id="vehicle_model"
                    value={form?.model || ""}
                    label={t.vehicle.model}
                    disabled={loading}
                    placeholder={t.vehicle.model_placeholder}
                    onChange={function (event) {
                      const newForm = { ...form };
                      newForm.model = event.currentTarget?.value || "";
                      setForm(newForm);
                      return;
                    }}
                  />
                  <Input
                    min={1900}
                    name="year"
                    type="number"
                    id="vehicle_year"
                    placeholder="2000"
                    label={t.vehicle.year}
                    disabled={loading}
                    value={String(form?.year || new Date().getFullYear())}
                    onChange={function (event) {
                      const newForm = { ...form };
                      newForm.year = Number(
                        event.currentTarget?.value || new Date().getFullYear(),
                      );
                      setForm(newForm);
                      return;
                    }}
                  />
                </Horizontal>

                <Horizontal>
                  <InputText
                    max={256}
                    height={4}
                    name="description"
                    id="vehicle_description"
                    value={form?.description || ""}
                    label={t.components.description}
                    disabled={loading}
                    placeholder={t.vehicle.description_placeholder}
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
                      id="product_created_at"
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
                      id="product_updated_at"
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
                      id="product_deleted_at"
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
                  navigate("/f/vehicles");
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
        </Vertical>
      </form>
    </React.Fragment>
  );
};

export default VehiclesInspect;
