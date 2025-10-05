import { toast } from "sonner";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { Asterisk, Trash } from "@phosphor-icons/react";
import { useNavigate, useParams } from "react-router-dom";

// apis
import apis from "../../../apis";

// assets
import {
  VehicleMaintenanceTypeOptions,
  VehicleMaintenanceCategoryOptions,
} from "../../../assets/Vehicle";

// types
import {
  TypeVehicle,
  TypeVehicleMaintenance,
  TypeVehicleMaintenanceType,
  TypeVehicleMaintenanceCategory,
} from "../../../types/Vehicle";
import { TypeAccount } from "../../../types/Account";
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
import Button from "../../../components/buttons/Button";
import Wrapper from "../../../components/wrapper/Wrapper";
import Callout from "../../../components/callouts/Callout";
import Profile from "../../../components/profiles/Profile";
import { useDialog } from "../../../components/dialogs/Dialog";
import Breadcrumb from "../../../components/breadcrumbs/Breadcrumb";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

const VehiclesMaintenance = function () {
  const t = useTranslate();
  const play = useSounds();
  const { id } = useParams();
  const Schema = useSchema();
  const navigate = useNavigate();
  const { renderByPlan } = usePermission();
  const { instanceDateTime } = useDateTime();
  const { OpenDialog, CloseDialog } = useDialog();
  const { user, users, token, instance, workspaces, workspaceId } = useSystem();

  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState<TypeVehicle[]>([]);
  const [accounts, setAccounts] = useState<TypeAccount[]>([]);
  const [form, setForm] = useState<TypeVehicleMaintenance>({
    name: "",
    local: "",
    type: "corrective",
    category: "mechanic",
    inspection: [],
    repair: [],
    pricingInstallment: 0,
    pricingTotal: "0.00",
    maintenanceStart: "",
    maintenanceEstimatedEnd: "",
    userId: user.id,
    accountId: "",
    vehicleId: "",
    vehicleName: "",
    vehicleBrand: "",
    workspaceId,
    createdAt: new Date().toISOString(),
    updatedAt: null,
    deletedAt: null,
  });

  const userFinded = form.userId
    ? users.find(function (userLocal) {
        return form.userId === userLocal.id;
      })
    : null;

  // fetch vehicle
  useAsync(
    async function () {
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
      } catch (err) {
        play("alert");
        toast.error(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        console.error(
          "[src/pages/services/vehicles/VehiclesMaintenance.tsx]",
          err,
        );
        navigate("/f/vehicles");
      }
    },
    [workspaceId],
  );

  // fetch accounts
  useAsync(
    async function () {
      try {
        const response = await apis.Account.list<
          ApiResponsePaginate<TypeAccount>
        >(token, instance.name, {
          pageSize: 999,
          pageCurrent: 1,
          orderField: "name",
          orderSort: "asc",
        });
        if (!response.data?.result || response.status !== 200) {
          play("alert");
          toast.warning(t.toast.warning_error, {
            description: t.stacks.no_find_item,
          });
          return;
        }
        setAccounts(response.data.result.items);
      } catch (err) {
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        console.error(
          "[src/pages/services/vehicles/VehiclesMaintenance.tsx]",
          err,
        );
        navigate("/f/vehicles");
      }
    },
    [workspaceId],
  );

  const onSubmit = async function (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const toastId = toast.loading(t.components.loading);
    try {
      // is editing
      if (id) {
        const response = await apis.VehicleMaintenance.update(
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
        navigate(`/f/vehicles/inspect/${form.vehicleId}`);
        return;
      }
      // is creating
      const response =
        await apis.VehicleMaintenance.create<TypeVehicleMaintenance>(
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
      navigate(`/f/vehicles/inspect/${response.data.result.vehicleId}`);
      return;
    } catch (err) {
      play("alert");
      toast.dismiss(toastId);
      console.error(
        "[src/pages/services/vehicles/VehiclesMaintenance.tsx]",
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

  const FetchMaintenance = async function () {
    if (!id) return;
    const toastId = toast.loading(t.components.loading);
    try {
      const response =
        await apis.VehicleMaintenance.get<TypeVehicleMaintenance>(
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
      console.error(
        "[src/pages/services/vehicles/VehiclesMaintenance.tsx]",
        err,
      );
      navigate("/f/vehicles");
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  useAsync(FetchMaintenance, [id, token, instance.name, workspaceId]);

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
                id: "maintenance",
                label: t.vehicle.maintenance,
                url: `/f/vehicles/maintenance`,
              },
            ]}
          />
        </h2>
      </Horizontal>

      <form onSubmit={onSubmit}>
        <Vertical internal={1}>
          <Wrapper
            title={t.vehicle.title_maintenance}
            description={t.vehicle.subtitle_maintenance}
          >
            <Vertical internal={1} className="flex1">
              <Horizontal internal={1}>
                <Input
                  min={1}
                  max={64}
                  required
                  name="name"
                  id="vehicle_name"
                  disabled={loading}
                  value={form?.name || ""}
                  label={t.vehicle.name_maintenance}
                  placeholder={t.vehicle.name_maintenance_placeholder}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.name = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
                <Input
                  max={64}
                  name="local"
                  id="vehicle_local"
                  disabled={loading}
                  label={t.vehicle.local}
                  value={form?.local || ""}
                  placeholder={t.vehicle.local_placeholder}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.local = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
              </Horizontal>

              <Horizontal internal={1}>
                <InputSelect
                  name="type"
                  id="vehicle_type"
                  disabled={loading}
                  label={t.vehicle.type}
                  empty={t.stacks.no_option}
                  value={form.type || "corrective"}
                  options={VehicleMaintenanceTypeOptions.map(function (type) {
                    return {
                      id: type,
                      value: type,
                      text: t.vehicle[type as keyof typeof t.vehicle],
                    };
                  })}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.type = (event.currentTarget?.value ||
                      "corrective") as TypeVehicleMaintenanceType;
                    setForm(newForm);
                    return;
                  }}
                />
                <InputSelect
                  name="category"
                  id="vehicle_category"
                  label={t.vehicle.category}
                  empty={t.stacks.no_option}
                  value={form.category || "mechanic"}
                  options={VehicleMaintenanceCategoryOptions.map(
                    function (category) {
                      return {
                        id: category,
                        value: category,
                        text: t.vehicle[category as keyof typeof t.vehicle],
                      };
                    },
                  )}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.category = (event.currentTarget?.value ||
                      "mechanic") as TypeVehicleMaintenanceCategory;
                    setForm(newForm);
                    return;
                  }}
                />
                <InputSelect
                  required
                  name="vehicleId"
                  id="vehicle_vehicle_id"
                  label={t.vehicle.vehicle}
                  empty={t.stacks.no_option}
                  value={form.vehicleId || ""}
                  options={vehicles.map(function (vehicle) {
                    return {
                      id: vehicle.id,
                      value: vehicle.id,
                      text: vehicle.name,
                    };
                  })}
                  onChange={function (event) {
                    const newForm = { ...form };
                    const VehicleFinded = vehicles.find(function (vehicle) {
                      return vehicle.id === event.currentTarget?.value;
                    });
                    if (VehicleFinded) {
                      newForm.vehicleId = VehicleFinded.id || "";
                      newForm.vehicleName = VehicleFinded.name || "";
                      newForm.vehicleBrand = VehicleFinded.brand || "";
                    }
                    setForm(newForm);
                    return;
                  }}
                />
              </Horizontal>

              <Horizontal internal={1}>
                <Input
                  required
                  type="date"
                  placeholder="yyyy-MM-dd"
                  name="maintenanceStart"
                  id="vehicle_maintenance_start"
                  label={t.vehicle.maintenance_start}
                  value={
                    form.maintenanceStart
                      ? form.maintenanceStart.slice(0, 10)
                      : ""
                  }
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.maintenanceStart = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
                <Input
                  required
                  type="date"
                  placeholder="yyyy-MM-dd"
                  name="maintenanceEstimatedEnd"
                  id="vehicle_maintenance_estimated_end"
                  label={t.vehicle.maintenance_estimated_end}
                  value={
                    form.maintenanceEstimatedEnd
                      ? form.maintenanceEstimatedEnd.slice(0, 10)
                      : ""
                  }
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.maintenanceEstimatedEnd =
                      event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
                <Input
                  type="date"
                  name="maintenanceEnd"
                  placeholder="yyyy-MM-dd"
                  id="vehicle_maintenance_end"
                  label={t.vehicle.maintenance_end}
                  value={
                    form.maintenanceEnd ? form.maintenanceEnd.slice(0, 10) : ""
                  }
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.maintenanceEnd = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
              </Horizontal>

              <Horizontal internal={1}>
                <InputSelect
                  required
                  name="accountId"
                  id="vehicle_account_id"
                  label={t.account.account}
                  empty={t.stacks.no_option}
                  value={form.accountId || ""}
                  options={accounts.map(function (account) {
                    return {
                      id: account.id,
                      value: account.id,
                      text: account.name,
                    };
                  })}
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.accountId = event.currentTarget?.value || "";
                    setForm(newForm);
                    return;
                  }}
                />
                <Input
                  type="number"
                  placeholder="0"
                  name="pricingInstallment"
                  id="vehicle_pricing_installment"
                  label={t.vehicle.pricing_installment}
                  value={
                    typeof form.pricingInstallment === "number"
                      ? String(form.pricingInstallment)
                      : ""
                  }
                  onChange={function (event) {
                    const newForm = { ...form };
                    newForm.pricingInstallment = Number(
                      event.currentTarget?.value || 0,
                    );
                    setForm(newForm);
                    return;
                  }}
                />
                <InputMoney
                  required
                  placeholder="0.00"
                  name="pricingTotal"
                  id="vehicle_pricing_total"
                  label={t.vehicle.pricing_total}
                  value={form.pricingTotal || "0.00"}
                  onChange={function (value) {
                    const newForm = { ...form };
                    newForm.pricingTotal = value || "";
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
          </Wrapper>

          <Wrapper
            collapsible
            contentStyles={{ padding: 0 }}
            title={t.vehicle.title_details}
            description={t.vehicle.subtitle_details}
          >
            <Vertical internal={1} external={1}>
              <Horizontal internal={1} className="itemsCenter">
                <h3 style={{ flex: 1 }}>{t.vehicle.inspection}</h3>
                <Button
                  type="button"
                  category="Success"
                  text={t.vehicle.inspection_add}
                  onClick={function () {
                    const newForm = { ...form };
                    newForm.inspection.push({ name: "", reason: "" });
                    setForm(newForm);
                    return;
                  }}
                />
              </Horizontal>

              {form.inspection.length > 0 && (
                <Vertical internal={1}>
                  {form.inspection.map(function (inspection, index) {
                    return (
                      <Horizontal
                        key={`vehicle_inspection_${index}`}
                        internal={1}
                      >
                        <Input
                          max={64}
                          required
                          name="name"
                          value={inspection.name}
                          id={`vehicle_inspection_${index}_name`}
                          placeholder={t.vehicle.inspection_name_placeholder}
                          label={index === 0 ? t.vehicle.inspection_name : ""}
                          onChange={function (event) {
                            const newForm = { ...form };
                            if (!newForm.inspection?.[index]) return;
                            newForm.inspection[index].name =
                              event.currentTarget?.value || "";
                            setForm(newForm);
                            return;
                          }}
                        />

                        <Input
                          max={256}
                          required
                          name="reason"
                          value={inspection.reason}
                          id={`vehicle_inspection_${index}_reason`}
                          placeholder={t.vehicle.inspection_reason_placeholder}
                          label={index === 0 ? t.vehicle.inspection_reason : ""}
                          onChange={function (event) {
                            const newForm = { ...form };
                            if (!newForm.inspection?.[index]) return;
                            newForm.inspection[index].reason =
                              event.currentTarget?.value || "";
                            setForm(newForm);
                            return;
                          }}
                        />

                        <Vertical
                          internal={1}
                          styles={{ justifyContent: "flex-end" }}
                        >
                          <Button
                            text=""
                            onlyIcon
                            Icon={Trash}
                            type="button"
                            category="Danger"
                            onClick={function () {
                              OpenDialog({
                                category: "Danger",
                                title: t.dialog.title_delete,
                                description: t.dialog.description_delete,
                                confirmText: t.components.remove,
                                onConfirm: function () {
                                  const newForm = { ...form };
                                  newForm.inspection.splice(index, 1);
                                  setForm(newForm);
                                  CloseDialog();
                                  return;
                                },
                              });
                              return;
                            }}
                          />
                        </Vertical>
                      </Horizontal>
                    );
                  })}
                </Vertical>
              )}

              <Horizontal internal={1} className="itemsCenter">
                <h3 style={{ flex: 1 }}>{t.vehicle.repair}</h3>
                <Button
                  type="button"
                  category="Success"
                  text={t.vehicle.repair_add}
                  onClick={function () {
                    const newForm = { ...form };
                    newForm.repair.push({
                      name: "",
                      description: "",
                      pricing: "0.00",
                    });
                    setForm(newForm);
                    return;
                  }}
                />
              </Horizontal>

              {form.repair.length > 0 && (
                <Vertical internal={1}>
                  {form.repair.map(function (repair, index) {
                    return (
                      <Horizontal key={`vehicle_repair_${index}`} internal={1}>
                        <Input
                          max={64}
                          required
                          name="name"
                          value={repair.name}
                          label={index === 0 ? t.vehicle.repair_name : ""}
                          id={`vehicle_repair_${index}_name`}
                          placeholder={t.vehicle.repair_name_placeholder}
                          onChange={function (event) {
                            const newForm = { ...form };
                            if (!newForm.repair?.[index]) return;
                            newForm.repair[index].name =
                              event.currentTarget?.value || "";
                            setForm(newForm);
                            return;
                          }}
                        />
                        <Input
                          max={256}
                          name="description"
                          value={repair.description}
                          id={`vehicle_repair_${index}_description`}
                          placeholder={t.vehicle.repair_description_placeholder}
                          label={
                            index === 0 ? t.vehicle.repair_description : ""
                          }
                          onChange={function (event) {
                            const newForm = { ...form };
                            if (!newForm.repair?.[index]) return;
                            newForm.repair[index].description =
                              event.currentTarget?.value || "";
                            setForm(newForm);
                            return;
                          }}
                        />
                        <InputMoney
                          required
                          name="pricing"
                          placeholder="0.00"
                          value={repair.pricing || "0.00"}
                          id={`vehicle_repair_${index}_pricing`}
                          label={index === 0 ? t.vehicle.repair_pricing : ""}
                          onChange={function (value) {
                            const newForm = { ...form };
                            if (!newForm.repair?.[index]) return;
                            newForm.repair[index].pricing = value || "";
                            setForm(newForm);
                            return;
                          }}
                        />
                        <Vertical
                          internal={1}
                          styles={{ justifyContent: "flex-end" }}
                        >
                          <Button
                            text=""
                            onlyIcon
                            Icon={Trash}
                            type="button"
                            category="Danger"
                            onClick={function () {
                              OpenDialog({
                                category: "Danger",
                                title: t.dialog.title_delete,
                                description: t.dialog.description_delete,
                                confirmText: t.components.remove,
                                onConfirm: function () {
                                  const newForm = { ...form };
                                  newForm.repair.splice(index, 1);
                                  setForm(newForm);
                                  CloseDialog();
                                  return;
                                },
                              });
                              return;
                            }}
                          />
                        </Vertical>
                      </Horizontal>
                    );
                  })}
                </Vertical>
              )}
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
                disabled={loading}
                text={t.components.cancel}
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

        <div style={{ height: 128 }}></div>
      </form>
    </React.Fragment>,
  );
};

export default VehiclesMaintenance;
