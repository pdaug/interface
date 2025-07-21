import { toast } from "sonner";
import React, { useState } from "react";
import { useDebounce } from "use-debounce";
import { useNavigate } from "react-router-dom";
import { endOfDay, startOfDay, subMonths } from "date-fns";
import { Plus, QuestionMark } from "@phosphor-icons/react";

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
import useCurrency from "../../../hooks/useCurrency";
import useDateTime from "../../../hooks/useDateTime";
import useTranslate from "../../../hooks/useTranslate";

// components
import {
  Input,
  InputSelect,
  InputInterval,
} from "../../../components/inputs/Input";
import Badge from "../../../components/badges/Badge";
import Button from "../../../components/buttons/Button";
import Tooltip from "../../../components/tooltips/Tooltip";
import { useDialog } from "../../../components/dialogs/Dialog";
import Table, { TableData } from "../../../components/tables/Table";
import Pagination from "../../../components/paginations/Pagination";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

const pageSize = 10;

const ServicesList = function () {
  const t = useTranslate();
  const navigate = useNavigate();
  const Currency = useCurrency();
  const { instanceDateTime } = useDateTime();
  const { OpenDialog, CloseDialog } = useDialog();
  const { token, instance, workspaceId } = useSystem();

  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [services, setServices] = useState<TypeService[]>([]);
  const [interval, setInterval] = useState<TypeInputInterval>({
    start: subMonths(startOfDay(new Date()), 1),
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
        },
        workspaceId,
      );
      if (!response.data?.result?.items) return;
      setServices(response.data.result.items);
      setTotal(response.data.result.pagination.total);
      return;
    } catch (err) {
      console.error("[src/pages/operational/services/ServicesList.tsx]", err);
      return;
    } finally {
      setLoading(false);
    }
  };

  // fetch services
  useAsync(FetchServices, [workspaceId, page, searchDebounced]);

  return (
    <React.Fragment>
      <Horizontal>
        <h1>{t.service.services}</h1>
      </Horizontal>
      <Horizontal internal={1} styles={{ overflow: "hidden" }}>
        <Button
          Icon={Plus}
          category="Success"
          text={t.service.new}
          onClick={() => navigate("/f/services/inspect")}
        />
        <div>
          <InputSelect
            label=""
            empty=""
            value="all"
            options={[
              {
                id: "all",
                value: "all",
                text: t.components.all,
              },
              {
                id: "physical",
                value: "physical",
                text: t.service.physical,
              },
              {
                id: "digital",
                value: "digital",
                text: t.service.digital,
              },
            ]}
          />
        </div>
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
        <Input
          label=""
          value={search}
          placeholder={t.components.search}
          onChange={function (event) {
            setSearch(event.currentTarget?.value || "");
            return;
          }}
        />
        <div style={{ flex: 1 }}></div>
        <Button category="Neutral" text={t.components.import} />
        <Button category="Neutral" text={t.components.export} />
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
              label: t.components.copy_id,
              onClick: async function (_: React.MouseEvent, data: unknown) {
                if (data && typeof data === "object" && "id" in data) {
                  const result = await Clipboard.copy(data.id as string);
                  if (result) {
                    toast.success(t.toast.success, {
                      description: t.toast.success_copy,
                    });
                    return;
                  }
                }
                toast.warning(t.toast.warning_error, {
                  description: t.toast.warning_copy,
                });
                return;
              },
            },
            {
              id: "download",
              label: t.components.download,
              onClick: function (_: React.MouseEvent, data: unknown) {
                if (data && typeof data === "object" && "id" in data) {
                  Download.JSON(data, `service-${data.id}.json`);
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
              onClick: function (_: React.MouseEvent, data: unknown) {
                if (data && typeof data === "object" && "id" in data)
                  navigate(`/f/services/inspect/${data.id}`);
                return;
              },
            },
            {
              id: "delete",
              label: t.components.delete,
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
                        toast.warning(t.toast.warning_error, {
                          description: t.toast.error_delete,
                        });
                        return;
                      }
                      toast.success(t.toast.success, {
                        description: t.toast.success_delete,
                      });
                      CloseDialog();
                      await FetchServices();
                      return;
                    } catch (err) {
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
