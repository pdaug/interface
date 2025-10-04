import { toast } from "sonner";
import { format } from "date-fns";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { GasCan, Asterisk } from "@phosphor-icons/react";
import { useNavigate, useParams } from "react-router-dom";

// apis
import apis from "../../../apis";

// utils
import Convert from "../../../utils/Convert";

// assets
import { VehicleGasStationOptions } from "../../../assets/Vehicle";

// types
import {
  TypeVehicle,
  TypeVehicleRefuel,
  TypeVehicleRefuelFuel,
  TypeVehicleRefuelUnitType,
} from "../../../types/Vehicle";
import { ApiResponsePaginate } from "../../../types/Api";

// hooks
import useAsync from "../../../hooks/useAsync";
import useSystem from "../../../hooks/useSystem";
import useSounds from "../../../hooks/useSounds";
import useSchema from "../../../hooks/useSchema";
import useDateTime from "../../../hooks/useDateTime";
import useTranslate from "../../../hooks/useTranslate";
import usePermission from "../../../hooks/usePermission";

// components
import {
  Input,
  InputMoney,
  InputSelect,
} from "../../../components/inputs/Input";
import Avatar from "../../../components/avatars/Avatar";
import Wrapper from "../../../components/wrapper/Wrapper";
import Callout from "../../../components/callouts/Callout";
import Profile from "../../../components/profiles/Profile";
import Breadcrumb from "../../../components/breadcrumbs/Breadcrumb";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

const VehiclesRefuel = function () {
  const t = useTranslate();
  const play = useSounds();
  const { id } = useParams();
  const Schema = useSchema();
  const navigate = useNavigate();
  const { renderByPlan } = usePermission();
  const { instanceDateTime } = useDateTime();
  const { user, users, token, instance, workspaces, workspaceId } = useSystem();

  const formInitial: TypeVehicleRefuel = {
    fuel: "gasoline",
    gasStation: "",
    gasBrand: "other",
    unitPrice: "0.00",
    unitType: "liter",
    unitQuantity: 0,
    total: "0.00",
    vehicleId: "",
    vehicleName: "",
    vehicleBrand: "",
    workspaceId,
    userId: user.id,
    refuelAt: "",
    createdAt: new Date().toISOString(),
    updatedAt: null,
    deletedAt: null,
  };

  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState<TypeVehicle[]>([]);
  const [form, setForm] = useState<Partial<TypeVehicleRefuel>>(formInitial);

  const userFinded = form.userId
    ? users.find(function (userLocal) {
        return form.userId === userLocal.id;
      })
    : null;

  const gasBrandFinded = VehicleGasStationOptions.find(function (gasStation) {
    return gasStation.name === form.gasBrand;
  });

  // fetch vehicle
  useAsync(async function () {
    try {
      const response = await apis.Vehicle.list<
        ApiResponsePaginate<TypeVehicle>
      >(
        token,
        instance.name,
        {
          pageSize: 999,
          pageCurrent: 1,
          orderField: "name",
          orderSort: "asc",
        },
        workspaceId,
      );
      if (!response.data?.result?.items || response.status !== 200) {
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        navigate("/f/vehicles");
        return;
      }
      setVehicles(response.data.result.items);
      return;
    } catch (err) {
      play("alert");
      toast.error(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("[src/pages/services/vehicles/VehiclesRefuel.tsx]", err);
      navigate("/f/vehicles");
      return;
    }
  }, []);

  const onSubmit = async function (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const toastId = toast.loading(t.components.loading);
    // fix date in refuel
    form.refuelAt = new Date(form.refuelAt || 0).toISOString();
    try {
      // is editing
      if (id) {
        const response = await apis.VehicleRefuel.update(
          token,
          instance.name,
          id,
          form,
          workspaceId,
        );
        if (!response.data?.result || response.status !== 200) {
          play("alert");
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
        return;
      }
      // is creating
      const response = await apis.VehicleRefuel.create<TypeVehicleRefuel>(
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
        return;
      }
      play("ok");
      toast.dismiss(toastId);
      toast.success(t.toast.success, {
        description: t.toast.success_create,
      });
      navigate("/f/vehicles");
      return;
    } catch (err) {
      play("alert");
      toast.dismiss(toastId);
      console.error("[src/pages/services/vehicles/VehiclesRefuel.tsx]", err);
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

  const FetchRefuel = async function () {
    if (!id) return;
    const toastId = toast.loading(t.components.loading);
    try {
      const response = await apis.VehicleRefuel.get(
        token,
        instance.name,
        id,
        workspaceId,
      );
      if (!response.data?.result || response.status !== 200) {
        play("alert");
        toast.dismiss(toastId);
        toast.error(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        navigate("/f/vehicles");
        setLoading(false);
        return;
      }
      setForm(response.data.result);
    } catch (err) {
      play("alert");
      toast.dismiss(toastId);
      toast.error(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("[src/pages/services/vehicles/VehiclesRefuel.tsx]", err);
      navigate("/f/vehicles");
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  useAsync(FetchRefuel, [id, token, instance.name, workspaceId]);

  return renderByPlan(
    "advanced",
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
                id: "refuel",
                label: t.vehicle.refuel,
                url: `/f/vehicles/refuel`,
              },
            ]}
          />
        </h2>
      </Horizontal>

      <form onSubmit={onSubmit}>
        <Vertical internal={1}>
          <Wrapper
            title={t.vehicle.title_refuel}
            description={t.vehicle.subtitle_refuel}
            onConfirmCategory={id ? "Info" : "Success"}
            onConfirmLabel={id ? t.components.edit : t.components.save}
            onConfirm={() => {}}
            onCancelLabel={t.components.cancel}
            onCancel={function () {
              navigate("/f/vehicles");
              return;
            }}
            actions={
              id
                ? [
                    {
                      category: "Neutral",
                      text: t.vehicle.new_refuel,
                      onClick: function () {
                        setForm(formInitial);
                        return;
                      },
                    },
                  ]
                : []
            }
          >
            <Horizontal internal={1} className="itemsCenter">
              <Avatar
                label=""
                size={14}
                Icon={GasCan}
                photo={gasBrandFinded?.image || ""}
              />

              <Vertical internal={1} className="flex1">
                <Horizontal internal={1}>
                  <InputSelect
                    name="fuel"
                    id="vehicle_fuel"
                    value={form.fuel || ""}
                    disabled={loading}
                    label={t.vehicle.fuel}
                    empty={t.stacks.no_option}
                    options={[
                      {
                        id: "gasoline",
                        value: "gasoline",
                        text: t.vehicle.gasoline,
                      },
                      {
                        id: "gasoline_additive",
                        value: "gasoline_additive",
                        text: t.vehicle.gasoline_additive,
                      },
                      {
                        id: "gasoline_premium",
                        value: "gasoline_premium",
                        text: t.vehicle.gasoline_premium,
                      },
                      {
                        id: "gasoline_octane",
                        value: "gasoline_octane",
                        text: t.vehicle.gasoline_octane,
                      },
                      {
                        id: "ethanol",
                        value: "ethanol",
                        text: t.vehicle.ethanol,
                      },
                      {
                        id: "ethanol_additive",
                        value: "ethanol_additive",
                        text: t.vehicle.ethanol_additive,
                      },
                      {
                        id: "diesel",
                        value: "diesel",
                        text: t.vehicle.diesel,
                      },
                      {
                        id: "diesel_s10",
                        value: "diesel_s10",
                        text: t.vehicle.diesel_s10,
                      },
                      {
                        id: "diesel_s500",
                        value: "diesel_s500",
                        text: t.vehicle.diesel_s500,
                      },
                      {
                        id: "gas",
                        value: "gas",
                        text: t.vehicle.gas,
                      },
                      {
                        id: "kerosene",
                        value: "kerosene",
                        text: t.vehicle.kerosene,
                      },
                      {
                        id: "arla",
                        value: "arla",
                        text: t.vehicle.arla,
                      },
                      {
                        id: "bioethanol",
                        value: "bioethanol",
                        text: t.vehicle.bioethanol,
                      },
                      {
                        id: "biodiesel",
                        value: "biodiesel",
                        text: t.vehicle.biodiesel,
                      },
                      {
                        id: "others",
                        value: "others",
                        text: t.components.others,
                      },
                    ]}
                    onChange={function (event) {
                      const newForm = { ...form };
                      const newFuel = event.currentTarget?.value || "gasoline";
                      newForm.fuel = newFuel as TypeVehicleRefuelFuel;
                      setForm(newForm);
                      return;
                    }}
                  />
                  <Input
                    min={1}
                    max={32}
                    name="gasStation"
                    disabled={loading}
                    id="vehicle_gas_station"
                    label={t.vehicle.gas_station}
                    value={form?.gasStation || ""}
                    placeholder={t.vehicle.gas_station_placeholder}
                    onChange={function (event) {
                      const newForm = { ...form };
                      newForm.gasStation = event.currentTarget?.value || "";
                      setForm(newForm);
                      return;
                    }}
                  />
                  <InputSelect
                    required
                    empty={t.stacks.no_option}
                    label={t.vehicle.vehicle}
                    value={form.vehicleId || ""}
                    options={vehicles.map(function (vehicle) {
                      return {
                        id: vehicle.id,
                        value: vehicle.id,
                        text: vehicle.name,
                        disabled: !vehicle?.status,
                      };
                    })}
                    onChange={function (event) {
                      const newForm = { ...form };
                      newForm.vehicleId = event.currentTarget?.value || "";
                      const vehicleFinded = vehicles.find(function (vehicle) {
                        return vehicle.id === newForm.vehicleId;
                      });
                      if (vehicleFinded) {
                        newForm.vehicleName = vehicleFinded.name;
                        newForm.vehicleBrand = vehicleFinded.brand;
                      }
                      setForm(newForm);
                      return;
                    }}
                  />
                </Horizontal>

                <Horizontal internal={1}>
                  <InputMoney
                    required
                    name="unitPrice"
                    placeholder="0.00"
                    disabled={loading}
                    id="vehicle_unit_price"
                    label={`${t.vehicle.unit_price} (${Convert.stringToCurrency(instance.currency)}/${t.vehicle?.[form.unitType as keyof typeof t.vehicle] || t.components.unknown})`}
                    value={form?.unitPrice || ""}
                    onChange={function (value) {
                      const newForm = { ...form };
                      newForm.unitPrice = value || "";

                      // calculate total
                      if (
                        Number(newForm.unitPrice) > 0 &&
                        newForm.unitQuantity
                      ) {
                        newForm.total = Number(
                          Number(newForm.unitPrice) * newForm.unitQuantity,
                        ).toFixed(2);
                      }

                      setForm(newForm);
                      return;
                    }}
                  />

                  <Input
                    min={1}
                    max={32}
                    required
                    step={0.01}
                    type="number"
                    placeholder="0"
                    disabled={loading}
                    name="unitQuantity"
                    id="vehicle_unity_quantity"
                    label={`${t.vehicle.unit_quantity} (${t.vehicle?.[form.unitType as keyof typeof t.vehicle] || t.components.unknown})`}
                    value={String(form?.unitQuantity || "")}
                    onChange={function (event) {
                      const newForm = { ...form };
                      newForm.unitQuantity = Number(
                        event.currentTarget?.value || 0,
                      );

                      // calculate total
                      if (
                        Number(newForm.unitPrice) > 0 &&
                        newForm.unitQuantity
                      ) {
                        newForm.total = Number(
                          Number(newForm.unitPrice) * newForm.unitQuantity,
                        ).toFixed(2);
                      }

                      setForm(newForm);
                      return;
                    }}
                  />
                  <InputMoney
                    required
                    name="total"
                    placeholder="0.00"
                    disabled={loading}
                    id="vehicle_total"
                    value={form?.total || ""}
                    label={t.components.total}
                    onChange={function (value) {
                      const newForm = { ...form };
                      newForm.total = value || "";

                      // calculate price
                      if (Number(newForm.total) > 0 && newForm.unitQuantity) {
                        newForm.unitPrice = Number(
                          Number(newForm.total) / newForm.unitQuantity,
                        ).toFixed(2);
                      }

                      setForm(newForm);
                      return;
                    }}
                  />
                </Horizontal>

                <Horizontal internal={1}>
                  <InputSelect
                    empty={t.stacks.no_option}
                    label={t.vehicle.gas_brand}
                    value={form.gasBrand || "other"}
                    options={VehicleGasStationOptions.map(
                      function (gasStation) {
                        return {
                          id: gasStation.name,
                          value: gasStation.name,
                          text:
                            t.components?.[
                              gasStation.name as keyof typeof t.components
                            ] || gasStation.name,
                        };
                      },
                    )}
                    onChange={function (event) {
                      const newForm = { ...form };
                      newForm.gasBrand = event.currentTarget?.value || "";
                      setForm(newForm);
                      return;
                    }}
                  />
                  <InputSelect
                    empty={t.stacks.no_option}
                    label={t.vehicle.unit_type}
                    value={form.unitType || ""}
                    options={[
                      {
                        id: "liter",
                        value: "liter",
                        text: t.vehicle.liter,
                      },
                      {
                        id: "gallon",
                        value: "gallon",
                        text: t.vehicle.gallon,
                      },
                      {
                        id: "kg",
                        value: "kg",
                        text: t.vehicle.kg,
                      },
                      {
                        id: "barrel",
                        value: "barrel",
                        text: t.vehicle.barrel,
                      },
                      {
                        id: "m3",
                        value: "m3",
                        text: t.vehicle.m3,
                      },
                    ]}
                    onChange={function (event) {
                      const newForm = { ...form };
                      const newUnitType = event.currentTarget?.value || "liter";
                      newForm.unitType =
                        newUnitType as TypeVehicleRefuelUnitType;
                      setForm(newForm);
                      return;
                    }}
                  />
                  <Input
                    required
                    name="refuelAt"
                    type="datetime-local"
                    id="vehicle_refuel_at"
                    placeholder="yyyy-MM-dd"
                    label={t.vehicle.refuel_at}
                    value={
                      form?.refuelAt
                        ? format(
                            new Date(form.refuelAt || 0),
                            "yyyy-MM-dd HH:mm",
                          )
                        : ""
                    }
                    onChange={function (event) {
                      const newForm = { ...form };
                      const newRefuelAt = `${event.currentTarget?.value}:00`;
                      newForm.refuelAt = newRefuelAt;
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
        </Vertical>
      </form>
    </React.Fragment>,
  );
};

export default VehiclesRefuel;
