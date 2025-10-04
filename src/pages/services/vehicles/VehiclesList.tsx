import {
  Plus,
  Trash,
  CarProfile,
  CopySimple,
  PencilSimple,
  QuestionMark,
  DownloadSimple,
  GasCan,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import React, { useState } from "react";
import { useDebounce } from "use-debounce";
import { useNavigate } from "react-router-dom";
import { endOfDay, isSameDay, startOfYear } from "date-fns";

//apis
import apis from "../../../apis";

// assets
import {
  VehicleBrandsOptions,
  VehicleGasStationOptions,
} from "../../../assets/Vehicle";

// utils
import Download from "../../../utils/Download";
import Clipboard from "../../../utils/Clipboard";

// types
import {
  TypeVehicle,
  TypeVehicleMaintenance,
  TypeVehicleRefuel,
} from "../../../types/Vehicle";
import { ApiResponsePaginate } from "../../../types/Api";
import { TypeInputInterval } from "../../../types/Components";

// hooks
import useAsync from "../../../hooks/useAsync";
import useSounds from "../../../hooks/useSounds";
import useSystem from "../../../hooks/useSystem";
import useCurrency from "../../../hooks/useCurrency";
import useDateTime from "../../../hooks/useDateTime";
import useTranslate from "../../../hooks/useTranslate";
import usePermission from "../../../hooks/usePermission";

// components
import Badge from "../../../components/badges/Badge";
import Button from "../../../components/buttons/Button";
import Profile from "../../../components/profiles/Profile";
import Tooltip from "../../../components/tooltips/Tooltip";
import { useDialog } from "../../../components/dialogs/Dialog";
import Table, { TableData } from "../../../components/tables/Table";
import Pagination from "../../../components/paginations/Pagination";
import Breadcrumb from "../../../components/breadcrumbs/Breadcrumb";
import { Horizontal, Vertical } from "../../../components/aligns/Align";
import { Input, InputInterval } from "../../../components/inputs/Input";

const pageSize = 10;

const VehiclesList = function () {
  const t = useTranslate();
  const play = useSounds();
  const navigate = useNavigate();
  const Currency = useCurrency();
  const { renderByPlan } = usePermission();
  const { OpenDialog, CloseDialog } = useDialog();
  const { instanceDate, instanceDateTime } = useDateTime();
  const { users, token, instance, workspaces, workspaceId } = useSystem();

  const [vehicles, setVehicles] = useState<TypeVehicle[]>([]);
  const [pageVehicles, setPageVehicles] = useState<number>(1);
  const [totalVehicles, setTotalVehicles] = useState<number>(0);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);

  const [refuels, setRefuels] = useState<TypeVehicleRefuel[]>([]);
  const [pageRefuels, setPageRefuels] = useState<number>(1);
  const [totalRefuels, setTotalRefuels] = useState<number>(0);

  const [maintenances, setMaintenances] = useState<TypeVehicleMaintenance[]>(
    [],
  );
  const [pageMaintenances, setPageMaintenances] = useState<number>(1);
  const [totalMaintenances, setTotalMaintenances] = useState<number>(0);

  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [interval, setInterval] = useState<TypeInputInterval>({
    start: startOfYear(new Date()),
    end: endOfDay(new Date()),
  });

  const [searchDebounced] = useDebounce(search, 500);

  const FetchVehicles = async function () {
    setLoading(true);
    try {
      const response = await apis.Vehicle.list<
        ApiResponsePaginate<TypeVehicle>
      >(
        token,
        instance.name,
        {
          pageSize,
          pageCurrent: searchDebounced ? 1 : pageVehicles,
          searchField: "name",
          search: searchDebounced,
          dateStart: interval.start ? interval.start.toISOString() : undefined,
          dateEnd: interval.end ? interval.end.toISOString() : undefined,
        },
        workspaceId,
      );
      if (!response.data?.result?.items) {
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        console.warn(
          "[src/pages/services/vehicles/VehiclesList.tsx]",
          response.data,
        );
        return;
      }
      setVehicles(response.data.result.items);
      setTotalVehicles(response.data.result.pagination.total);
      return;
    } catch (err) {
      play("alert");
      toast.error(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("[src/pages/services/vehicles/VehiclesList.tsx]", err);
      return;
    } finally {
      setLoading(false);
    }
  };

  const FetchRefuel = async function () {
    setLoading(true);
    try {
      const responseRefuel = await apis.VehicleRefuel.list<
        ApiResponsePaginate<TypeVehicleRefuel>
      >(
        token,
        instance.name,
        {
          pageSize,
          searchField: "gasStation",
          search: searchDebounced,
          pageCurrent: searchDebounced ? 1 : pageRefuels,
          orderField: "createdAt",
          orderSort: "desc",
          dateStart: interval.start ? interval.start.toISOString() : undefined,
          dateEnd: interval.end ? interval.end.toISOString() : undefined,
        },
        workspaceId,
      );
      if (
        !responseRefuel.data?.result?.items ||
        responseRefuel.status !== 200
      ) {
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        setLoading(false);
        return;
      }
      setRefuels(responseRefuel.data.result.items);
      setTotalRefuels(responseRefuel.data.result.pagination.total);
    } catch (err) {
      play("alert");
      toast.error(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("[src/pages/services/vehicles/VehiclesList.tsx]", err);
    } finally {
      setLoading(false);
    }
  };

  const FetchMaintenance = async function () {
    setLoading(true);
    try {
      const responseMaintenance = await apis.VehicleMaintenance.list<
        ApiResponsePaginate<TypeVehicleMaintenance>
      >(
        token,
        instance.name,
        {
          pageSize,
          pageCurrent: searchDebounced ? 1 : pageMaintenances,
          searchField: "name",
          search: searchDebounced,
        },
        workspaceId,
      );
      if (
        !responseMaintenance.data?.result?.items ||
        responseMaintenance.status !== 200
      ) {
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
      }
      setMaintenances(responseMaintenance.data.result.items);
      setTotalMaintenances(responseMaintenance.data.result.pagination.total);
    } catch (err) {
      play("alert");
      toast.error(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("[src/pages/services/vehicles/VehiclesList.tsx]", err);
    } finally {
      setLoading(false);
    }
  };

  // fetch vehicles
  useAsync(FetchVehicles, [
    interval,
    workspaceId,
    pageVehicles,
    searchDebounced,
  ]);

  // fetch refuel
  useAsync(FetchRefuel, [interval, workspaceId, pageRefuels, searchDebounced]);

  // fetch maintenance
  useAsync(FetchMaintenance, [
    interval,
    workspaceId,
    pageMaintenances,
    searchDebounced,
  ]);

  const getOptionsVehicles = [
    {
      id: "copy",
      label: t.components.copy_id,
      Icon: CopySimple,
      onClick: async function (_: React.MouseEvent, data: unknown) {
        if (data && typeof data === "object" && "id" in data) {
          const result = await Clipboard.copy(data.id as string);
          if (result) {
            play("ok");
            toast.success(t.toast.success, {
              description: t.toast.success_copy,
            });
            return;
          }
        }
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.toast.warning_copy,
        });
        return;
      },
    },
    {
      id: "download",
      label: t.components.download,
      Icon: DownloadSimple,
      onClick: function (_: React.MouseEvent, data: unknown) {
        if (data && typeof data === "object" && "id" in data) {
          Download.JSON(data, `vehicle-${data.id}.json`);
          play("ok");
          toast.success(t.toast.success, {
            description: t.toast.success_download,
          });
        }
        return;
      },
    },
    {
      id: "edit",
      label: t.components.edit,
      Icon: PencilSimple,
      onClick: function (_: React.MouseEvent, data: unknown) {
        if (data && typeof data === "object" && "id" in data)
          navigate(`/f/vehicles/inspect/${data.id}`);
        return;
      },
    },
    {
      id: "delete",
      label: t.components.delete,
      Icon: Trash,
      IconColor: "var(--dangerColor",
      styles: { color: "var(--dangerColor)" },
      onClick: async function (_: React.MouseEvent, data: unknown) {
        if (!data || typeof data !== "object" || !("id" in data)) return;
        OpenDialog({
          category: "Danger",
          title: t.dialog.title_delete,
          description: t.dialog.description_delete,
          confirmText: t.components.delete,
          onConfirm: async function () {
            try {
              const response = await apis.Vehicle.delete(
                token,
                instance.name,
                data.id as string,
                workspaceId,
              );
              if (!response.data?.result) {
                play("alert");
                toast.warning(t.toast.warning_error, {
                  description: t.toast.error_delete,
                });
                return;
              }
              play("ok");
              toast.success(t.toast.success, {
                description: t.toast.success_delete,
              });
              CloseDialog();
              await FetchVehicles();
              return;
            } catch (err) {
              play("alert");
              toast.error(t.toast.warning_error, {
                description: t.toast.error_delete,
              });
              console.error(
                "[src/pages/services/vehicles/VehiclesList.tsx]",
                err,
              );
              return;
            }
          },
        });
      },
    },
  ];

  const getOptionsRefuel = [
    {
      id: "edit",
      label: t.components.edit,
      Icon: PencilSimple,
      onClick: function (_: React.MouseEvent, data: unknown) {
        if (data && typeof data === "object" && "id" in data) {
          navigate(`/f/vehicles/refuel/${data.id}`);
        }
        return;
      },
    },
    {
      id: "delete",
      label: t.components.delete,
      Icon: Trash,
      IconColor: "var(--dangerColor",
      styles: { color: "var(--dangerColor)" },
      onClick: async function (_: React.MouseEvent, data: unknown) {
        if (!data || typeof data !== "object" || !("id" in data)) return;
        OpenDialog({
          category: "Danger",
          title: t.dialog.title_delete,
          description: t.dialog.description_delete,
          confirmText: t.components.delete,
          onConfirm: async function () {
            try {
              const response = await apis.VehicleRefuel.delete(
                token,
                instance.name,
                data.id as string,
                workspaceId,
              );
              if (!response.data?.result) {
                play("alert");
                toast.warning(t.toast.warning_error, {
                  description: t.toast.error_delete,
                });
                return;
              }
              play("ok");
              toast.success(t.toast.success, {
                description: t.toast.success_delete,
              });
              CloseDialog();
              await FetchRefuel();
              return;
            } catch (err) {
              play("alert");
              toast.error(t.toast.warning_error, {
                description: t.toast.error_delete,
              });
              console.error(
                "[src/pages/services/vehicles/VehiclesRefuel.tsx]",
                err,
              );
              return;
            }
          },
        });
      },
    },
  ];

  const getOptionsMaintenance = [
    {
      id: "edit",
      label: t.components.edit,
      Icon: PencilSimple,
      onClick: function (_: React.MouseEvent, data: unknown) {
        if (data && typeof data === "object" && "id" in data) {
          navigate(`/f/vehicles/maintenance/${data.id}`);
        }
        return;
      },
    },
    {
      id: "delete",
      label: t.components.delete,
      Icon: Trash,
      IconColor: "var(--dangerColor",
      styles: { color: "var(--dangerColor)" },
      onClick: async function (_: React.MouseEvent, data: unknown) {
        if (!data || typeof data !== "object" || !("id" in data)) return;
        OpenDialog({
          category: "Danger",
          title: t.dialog.title_delete,
          description: t.dialog.description_delete,
          confirmText: t.components.delete,
          onConfirm: async function () {
            try {
              const response = await apis.VehicleMaintenance.delete(
                token,
                instance.name,
                data.id as string,
                workspaceId,
              );
              if (!response.data?.result) {
                play("alert");
                toast.warning(t.toast.warning_error, {
                  description: t.toast.error_delete,
                });
                return;
              }
              play("ok");
              toast.success(t.toast.success, {
                description: t.toast.success_delete,
              });
              CloseDialog();
              await FetchMaintenance();
            } catch (err) {
              play("alert");
              toast.error(t.toast.warning_error, {
                description: t.toast.error_delete,
              });
              console.error(
                "[src/pages/services/vehicles/VehiclesList.tsx]",
                err,
              );
            }
            return;
          },
        });
        return;
      },
    },
  ];

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
            ]}
          />
        </h2>
      </Horizontal>

      <Horizontal internal={1}>
        <Button
          Icon={Plus}
          category="Success"
          text={t.vehicle.new}
          onClick={() => navigate("/f/vehicles/inspect")}
        />

        <Button
          category="Info"
          text={t.vehicle.maintenance}
          onClick={() => navigate("/f/vehicles/maintenance")}
        />

        <Button
          category="Info"
          text={t.vehicle.refuel}
          onClick={() => navigate("/f/vehicles/refuel")}
        />

        <div style={{ minWidth: 200, maxWidth: 256 }}>
          <InputInterval
            label=""
            value={[interval.start, interval.end]}
            onChange={function (interval) {
              const [start, end] = interval;
              setInterval({
                start: start ? new Date(start) : null,
                end: end ? new Date(end) : null,
              });
              return;
            }}
          />
        </div>
        <Input
          label=""
          value={search}
          placeholder={t.components.search}
          onChange={function (event) {
            setSearch(event.currentTarget?.value || "");
            return;
          }}
        />
        <Button
          category="Neutral"
          disabled={!selectedVehicles.length}
          text={t.components.export}
          onClick={function () {
            const data = vehicles.filter(function (vehicle) {
              return selectedVehicles.includes(vehicle.id);
            });
            Download.JSON(data, `vehicles.json`);
            play("ok");
            toast.success(t.toast.success, {
              description: t.toast.success_download,
            });
            return;
          }}
        />
        <Tooltip content={t.components.help}>
          <Button
            text=""
            onlyIcon
            category="Neutral"
            Icon={QuestionMark}
            onClick={function () {
              OpenDialog({
                width: 700,
                category: "Success",
                title: t.components.help,
                cancelText: t.components.close,
                description: (
                  <iframe
                    height={400}
                    style={{ border: "none", width: "100%" }}
                    src="https://www.youtube.com/embed/L-yA7-puosA"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  />
                ),
              });
              return;
            }}
          />
        </Tooltip>
      </Horizontal>

      <Vertical internal={1} styles={{ marginBottom: "1rem" }}>
        <Table
          border
          loading={loading}
          selected={selectedVehicles}
          setSelected={setSelectedVehicles}
          options={getOptionsVehicles}
          data={vehicles as TableData[]}
          columns={{
            status: {
              label: t.components.status,
              maxWidth: "96px",
              handler: function (data) {
                return (
                  <Badge
                    category={data.status ? "Success" : "Danger"}
                    value={String(data.status)}
                    options={[
                      {
                        id: "true",
                        value: "true",
                        label: t.components.active,
                      },
                      {
                        id: "false",
                        value: "false",
                        label: t.components.inactive,
                      },
                    ]}
                    onChange={async function (event) {
                      try {
                        const response = await apis.Vehicle.update(
                          token,
                          instance.name,
                          data.id,
                          {
                            status: event.currentTarget?.value === "true",
                          },
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
                        await FetchVehicles();
                      } catch (err) {
                        play("alert");
                        toast.error(t.toast.warning_error, {
                          description: t.toast.error_edit,
                        });
                        console.error(
                          "[src/pages/services/vehicles/VehiclesList.tsx]",
                          err,
                        );
                      }
                      return;
                    }}
                  />
                );
              },
            },
            category: {
              label: t.vehicle.category,
              maxWidth: "96px",
              handler: function (data) {
                return (
                  <Badge
                    category="Info"
                    value={
                      t.vehicle[data.category as keyof typeof t.vehicle] ||
                      t.components.unknown
                    }
                  />
                );
              },
            },
            name: {
              label: t.vehicle.name,
              handler: function (data) {
                return (
                  <div
                    className="cursor"
                    onClick={function () {
                      navigate(`/f/vehicles/inspect/${data.id}`);
                      return;
                    }}
                  >
                    {data.name as string}
                  </div>
                );
              },
            },
            plate: {
              label: t.vehicle.plate,
              maxWidth: 128,
            },
            brand: {
              label: t.vehicle.brand,
              maxWidth: 200,
              handler: function (data) {
                const brand = (data?.brand || "") as string;
                const brandFinded = VehicleBrandsOptions?.find(
                  function (option) {
                    return option.name === brand.toLowerCase();
                  },
                );
                return (
                  <Profile
                    padding={false}
                    photoIcon={CarProfile}
                    photo={brandFinded?.image || ""}
                    name={
                      brand.toLowerCase() === "other" ? (
                        t.components.other
                      ) : brand ? (
                        `${brand.slice(0, 1).toUpperCase()}${brand.slice(1)}`
                      ) : (
                        <i style={{ color: "var(--textLight)" }}>
                          {t.vehicle.no_brand}
                        </i>
                      )
                    }
                    description={
                      data.model ? (
                        (data.model as string)
                      ) : (
                        <i style={{ color: "var(--textLight)" }}>
                          {t.vehicle.no_model}
                        </i>
                      )
                    }
                  />
                );
              },
            },
            user: {
              label: t.components.user,
              maxWidth: 200,
              handler: function (data) {
                const userFinded = users?.find(function (user) {
                  return user.id === data.userId;
                });
                return (
                  <Tooltip
                    content={t.components[userFinded?.role || "collaborator"]}
                  >
                    <Profile
                      photoCircle
                      photoSize={3}
                      padding={false}
                      styles={{ lineHeight: 1 }}
                      photo={userFinded?.photo || ""}
                      description={userFinded?.email || ""}
                      name={userFinded?.name || t.components.unknown}
                    />
                  </Tooltip>
                );
              },
            },
            createdAt: {
              label: t.components.created_at,
              maxWidth: 180,
              handler: function (data) {
                const datetime = instanceDateTime(data.createdAt as string);
                return datetime;
              },
            },
          }}
        />

        <Pagination
          display
          pageCurrent={pageVehicles}
          setPage={setPageVehicles}
          itemsTotal={totalVehicles}
          pageSize={pageSize}
        />
      </Vertical>

      <Vertical internal={1} styles={{ marginBottom: "1rem" }}>
        <h2>{t.vehicle.refuel}</h2>

        <Table
          border
          noSelect
          loading={loading}
          options={getOptionsRefuel}
          data={refuels as TableData[]}
          columns={{
            fuel: {
              label: t.vehicle.fuel,
              maxWidth: 208,
              handler: function (data) {
                return (
                  <Badge
                    category="Info"
                    value={
                      t.vehicle[data.fuel as keyof typeof t.vehicle] ||
                      t.components.unknown
                    }
                  />
                );
              },
            },
            gas_station: {
              label: t.vehicle.gas_station,
              handler: function (data) {
                const gasBrandFinded = VehicleGasStationOptions.find(
                  function (gasStation) {
                    return gasStation.name === data.gasBrand;
                  },
                );
                return (
                  <Profile
                    padding={false}
                    photoIcon={GasCan}
                    name={
                      data?.gasStation ? (
                        <div
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            navigate(`/f/vehicles/refuel/${data.id}`)
                          }
                        >
                          {data.gasStation as string}
                        </div>
                      ) : (
                        <i style={{ color: "var(--textLight)" }}>
                          {t.vehicle.no_gas_station}
                        </i>
                      )
                    }
                    photo={gasBrandFinded?.image || ""}
                    description={
                      t.components?.[
                        gasBrandFinded?.name as keyof typeof t.components
                      ] ||
                      gasBrandFinded?.name ||
                      ""
                    }
                  />
                );
              },
            },
            vehicleId: {
              label: t.vehicle.vehicle,
              maxWidth: 200,
              handler: function (data) {
                const brandFinded = VehicleBrandsOptions?.find(
                  function (brand) {
                    return (
                      brand.name ===
                      ((data?.vehicleBrand as string) || "")?.toLowerCase()
                    );
                  },
                );
                return (
                  <Profile
                    padding={false}
                    photoIcon={CarProfile}
                    name={data?.vehicleName as string}
                    photo={brandFinded?.image || ""}
                    description={
                      brandFinded?.name?.toLowerCase() === "other" ? (
                        t.components.other
                      ) : brandFinded?.name ? (
                        `${brandFinded?.name?.slice(0, 1).toUpperCase()}${brandFinded?.name?.slice(1)}`
                      ) : (
                        <i style={{ color: "var(--textLight)" }}>
                          {t.vehicle.no_brand}
                        </i>
                      )
                    }
                  />
                );
              },
            },
            total: {
              label: t.components.total,
              maxWidth: 160,
              handler: function (data) {
                return <span>{Currency(data.total as string)}</span>;
              },
            },
            user: {
              label: t.components.user,
              maxWidth: 200,
              handler: function (data) {
                const userFinded = users?.find(function (user) {
                  return user.id === data.userId;
                });
                return (
                  <Tooltip
                    content={t.components[userFinded?.role || "collaborator"]}
                  >
                    <Profile
                      photoCircle
                      photoSize={3}
                      padding={false}
                      styles={{ lineHeight: 1 }}
                      photo={userFinded?.photo || ""}
                      description={userFinded?.email || ""}
                      name={userFinded?.name || t.components.unknown}
                    />
                  </Tooltip>
                );
              },
            },
            refuelAt: {
              label: t.vehicle.refuel_at,
              maxWidth: 180,
              handler: function (data) {
                const datetime = instanceDateTime(data.refuelAt as string);
                return datetime;
              },
            },
          }}
        />

        <Pagination
          display
          pageCurrent={pageRefuels}
          setPage={setPageRefuels}
          itemsTotal={totalRefuels}
          pageSize={pageSize}
        />
      </Vertical>

      <Vertical internal={1} styles={{ marginBottom: "1rem" }}>
        <h2>{t.vehicle.maintenance}</h2>

        <Table
          border
          noSelect
          loading={loading}
          options={getOptionsMaintenance}
          data={maintenances as TableData[]}
          columns={{
            type: {
              label: t.vehicle.type,
              maxWidth: 96,
              handler: function (data) {
                return (
                  <Badge
                    category="Neutral"
                    value={
                      t.vehicle[data.type as keyof typeof t.vehicle] ||
                      t.components.unknown
                    }
                  />
                );
              },
            },
            category: {
              label: t.vehicle.category,
              maxWidth: 96,
              handler: function (data) {
                return (
                  <Badge
                    category="Neutral"
                    value={
                      t.vehicle[data.category as keyof typeof t.vehicle] ||
                      t.components.unknown
                    }
                  />
                );
              },
            },
            name: {
              label: t.vehicle.maintenance,
              handler: function (data) {
                return (
                  <div
                    className="cursor"
                    onClick={() =>
                      navigate(`/f/vehicles/maintenance/${data.id}`)
                    }
                  >
                    {data.name as string}
                  </div>
                );
              },
            },
            vehicleId: {
              label: t.vehicle.vehicle,
              maxWidth: 200,
              handler: function (data) {
                const brandFinded = VehicleBrandsOptions?.find(
                  function (brand) {
                    return (
                      brand.name ===
                      ((data?.vehicleBrand as string) || "")?.toLowerCase()
                    );
                  },
                );
                return (
                  <Profile
                    padding={false}
                    photoIcon={CarProfile}
                    name={data?.vehicleName as string}
                    photo={brandFinded?.image || ""}
                    description={
                      brandFinded?.name?.toLowerCase() === "other" ? (
                        t.components.other
                      ) : brandFinded?.name ? (
                        `${brandFinded?.name?.slice(0, 1).toUpperCase()}${brandFinded?.name?.slice(1)}`
                      ) : (
                        <i style={{ color: "var(--textLight)" }}>
                          {t.vehicle.no_brand}
                        </i>
                      )
                    }
                  />
                );
              },
            },
            pricingTotal: {
              label: t.components.total,
              maxWidth: 160,
              handler: function (data) {
                return <span>{Currency(data.pricingTotal as string)}</span>;
              },
            },
            user: {
              label: t.components.user,
              maxWidth: 200,
              handler: function (data) {
                const userFinded = users?.find(function (user) {
                  return user.id === data.userId;
                });
                return (
                  <Tooltip
                    content={t.components[userFinded?.role || "collaborator"]}
                  >
                    <Profile
                      photoCircle
                      photoSize={3}
                      padding={false}
                      styles={{ lineHeight: 1 }}
                      photo={userFinded?.photo || ""}
                      description={userFinded?.email || ""}
                      name={userFinded?.name || t.components.unknown}
                    />
                  </Tooltip>
                );
              },
            },
            maintenanceStart: {
              label: t.vehicle.maintenance_start,
              maxWidth: 180,
              handler: function (data) {
                const dateEnd =
                  data.maintenanceEstimatedEnd || data.maintenanceEnd;

                const datetimeStart = instanceDate(
                  data.maintenanceStart as string,
                );
                const datetimeEnd = instanceDate(dateEnd as string);

                const startIsSameDayEnd = isSameDay(
                  data.maintenanceStart as string,
                  dateEnd as string,
                );

                return startIsSameDayEnd
                  ? datetimeStart
                  : `${datetimeStart} - ${datetimeEnd}`;
              },
            },
          }}
        />

        <Pagination
          display
          pageCurrent={pageMaintenances}
          setPage={setPageMaintenances}
          itemsTotal={totalMaintenances}
          pageSize={pageSize}
        />
      </Vertical>

      <div>
        <div style={{ height: 128 }}></div>
      </div>
    </React.Fragment>,
  );
};

export default VehiclesList;
