import {
  Trash,
  Plus,
  CopySimple,
  PencilSimple,
  QuestionMark,
  DownloadSimple,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import React, { useState } from "react";
import { useDebounce } from "use-debounce";
import { useNavigate } from "react-router-dom";
import { endOfDay, startOfYear } from "date-fns";

//apis
import apis from "../../../apis";

// utils
import Download from "../../../utils/Download";
import Clipboard from "../../../utils/Clipboard";

// types
import { TypeService } from "../../../types/Service";
import { ApiResponsePaginate } from "../../../types/Api";
import { TypeInputInterval } from "../../../types/Components";

// hooks
import useAsync from "../../../hooks/useAsync";
import useSystem from "../../../hooks/useSystem";
import useSounds from "../../../hooks/useSounds";
import useCurrency from "../../../hooks/useCurrency";
import useDateTime from "../../../hooks/useDateTime";
import useTranslate from "../../../hooks/useTranslate";

// components
import { Input, InputInterval } from "../../../components/inputs/Input";
import Badge from "../../../components/badges/Badge";
import Button from "../../../components/buttons/Button";
import Profile from "../../../components/profiles/Profile";
import Tooltip from "../../../components/tooltips/Tooltip";
import { useDialog } from "../../../components/dialogs/Dialog";
import Table, { TableData } from "../../../components/tables/Table";
import Pagination from "../../../components/paginations/Pagination";
import Breadcrumb from "../../../components/breadcrumbs/Breadcrumb";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

const pageSize = 10;

const ServicesList = function () {
  const t = useTranslate();
  const play = useSounds();
  const navigate = useNavigate();
  const Currency = useCurrency();
  const { instanceDateTime } = useDateTime();
  const { OpenDialog, CloseDialog } = useDialog();
  const { users, token, instance, workspaces, workspaceId } = useSystem();

  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [services, setServices] = useState<TypeService[]>([]);
  const [interval, setInterval] = useState<TypeInputInterval>({
    start: startOfYear(new Date()),
    end: endOfDay(new Date()),
  });

  const [searchDebounced] = useDebounce(search, 500);

  const FetchServices = async function () {
    setLoading(true);
    try {
      const response = await apis.Service.list<
        ApiResponsePaginate<TypeService>
      >(
        token,
        instance.name,
        {
          pageSize,
          pageCurrent: page,
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
          "[src/pages/operational/services/ServicesList.tsx]",
          response.data,
        );
        return;
      }
      setServices(response.data.result.items);
      setTotal(response.data.result.pagination.total);
      return;
    } catch (err) {
      play("alert");
      toast.error(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("[src/pages/operational/services/ServicesList.tsx]", err);
      return;
    } finally {
      setLoading(false);
    }
  };

  // fetch services
  useAsync(FetchServices, [interval, workspaceId, page, searchDebounced]);

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
                id: "services",
                label: t.service.services,
                url: "/f/services",
              },
            ]}
          />
        </h2>
      </Horizontal>
      <Horizontal internal={1} styles={{ overflow: "hidden" }}>
        <Button
          Icon={Plus}
          category="Success"
          text={t.service.new}
          onClick={() => navigate("/f/services/inspect")}
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
        {/* <Button category="Neutral" text={t.components.import} /> */}
        <Button
          category="Neutral"
          disabled={!selected.length}
          text={t.components.export}
          onClick={function () {
            const data = services.filter(function (service) {
              return selected.includes(service.id);
            });
            Download.JSON(data, `services.json`);
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
      <Vertical internal={1} styles={{ flex: 1 }}>
        <Table
          border
          loading={loading}
          data={services as TableData[]}
          columns={{
            status: {
              label: t.components.status,
              maxWidth: "96px",
              handler: function (data) {
                return (
                  <Badge
                    category={data.status ? "Success" : "Danger"}
                    value={
                      data.status ? t.components.active : t.components.inactive
                    }
                  />
                );
              },
            },
            type: {
              label: t.service.type,
              maxWidth: "96px",
              handler: function (data) {
                return (
                  <Badge
                    category="Info"
                    value={
                      data.type === "physical"
                        ? t.service.physical
                        : t.service.digital
                    }
                  />
                );
              },
            },
            method: {
              label: t.service.pricing_method,
              maxWidth: "96px",
              handler: function (data) {
                return (
                  <Badge
                    category="Info"
                    value={
                      t.service[data.pricingMethod as keyof typeof t.service]
                    }
                  />
                );
              },
            },
            name: { label: t.service.name },
            description: {
              label: t.components.description,
              handler: function (data) {
                if (data.description) return data.description as string;
                return (
                  <i style={{ color: "var(--textLight)" }}>
                    {t.stacks.no_description}
                  </i>
                );
              },
            },
            pricingValue: {
              label: t.service.pricing_value,
              maxWidth: "128px",
              handler: function (data) {
                return <div>{Currency(data?.pricingValue as number)}</div>;
              },
            },
            user: {
              label: t.components.user,
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
              handler: function (data) {
                const datetime = instanceDateTime(data.createdAt as string);
                return datetime;
              },
            },
          }}
          selected={selected}
          setSelected={setSelected}
          options={[
            {
              id: "copy",
              Icon: CopySimple,
              label: t.components.copy_id,
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
              Icon: DownloadSimple,
              label: t.components.download,
              onClick: function (_: React.MouseEvent, data: unknown) {
                if (data && typeof data === "object" && "id" in data) {
                  Download.JSON(data, `service-${data.id}.json`);
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
              Icon: PencilSimple,
              label: t.components.edit,
              onClick: function (_: React.MouseEvent, data: unknown) {
                if (data && typeof data === "object" && "id" in data)
                  navigate(`/f/services/inspect/${data.id}`);
                return;
              },
            },
            {
              id: "delete",
              Icon: Trash,
              label: t.components.delete,
              IconColor: "var(--dangerColor",
              styles: { color: "var(--dangerColor)" },
              onClick: async function (_: React.MouseEvent, data: unknown) {
                if (!data || typeof data !== "object" || !("id" in data))
                  return;
                OpenDialog({
                  category: "Danger",
                  title: t.dialog.title_delete,
                  description: t.dialog.description_delete,
                  confirmText: t.components.delete,
                  onConfirm: async function () {
                    try {
                      const response = await apis.Service.delete(
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
                      await FetchServices();
                      return;
                    } catch (err) {
                      play("alert");
                      toast.error(t.toast.warning_error, {
                        description: t.toast.error_delete,
                      });
                      console.error(
                        "[src/pages/operational/services/ServicesList.tsx]",
                        err,
                      );
                      return;
                    }
                  },
                });
              },
            },
          ]}
        />
        <Pagination
          display
          pageCurrent={page}
          setPage={setPage}
          itemsTotal={total}
          pageSize={pageSize}
        />
      </Vertical>
    </React.Fragment>
  );
};

export default ServicesList;
