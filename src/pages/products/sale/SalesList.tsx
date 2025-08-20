import {
  Plus,
  Trash,
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

// assets
import { SaleStages } from "../../../assets/Sale";

// utils
import Download from "../../../utils/Download";
import Clipboard from "../../../utils/Clipboard";

// types
import { TypeSale, TypeSaleStage } from "../../../types/Sale";
import { ApiResponsePaginate } from "../../../types/Api";
import { TypeInputInterval } from "../../../types/Components";

// hooks
import useAsync from "../../../hooks/useAsync";
import useSounds from "../../../hooks/useSounds";
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
import Profile from "../../../components/profiles/Profile";
import Tooltip from "../../../components/tooltips/Tooltip";
import { useDialog } from "../../../components/dialogs/Dialog";
import Table, { TableData } from "../../../components/tables/Table";
import Pagination from "../../../components/paginations/Pagination";
import Breadcrumb from "../../../components/breadcrumbs/Breadcrumb";
import { Horizontal, Vertical } from "../../../components/aligns/Align";

const pageSize = 10;

const SalesList = function () {
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
  const [sales, setSales] = useState<TypeSale[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [stage, setStage] = useState<TypeSaleStage | "">("");
  const [interval, setInterval] = useState<TypeInputInterval>({
    start: startOfYear(new Date()),
    end: endOfDay(new Date()),
  });

  const [searchDebounced] = useDebounce(search, 500);

  const FetchSales = async function () {
    setLoading(true);
    try {
      const response = await apis.Sale.list<ApiResponsePaginate<TypeSale>>(
        token,
        instance.name,
        {
          pageSize,
          pageCurrent: searchDebounced ? 1 : page,
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
        console.warn("[src/pages/products/sale/SalesList.tsx]", response.data);
        return;
      }
      setSales(response.data.result.items);
      setTotal(response.data.result.pagination.total);
      return;
    } catch (err) {
      play("alert");
      toast.error(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("[src/pages/products/sale/SalesList.tsx]", err);
      return;
    } finally {
      setLoading(false);
    }
  };

  // fetch sales
  useAsync(FetchSales, [interval, workspaceId, page, searchDebounced]);

  const getOptions = [
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
          Download.JSON(data, `sale-${data.id}.json`);
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
          navigate(`/f/sales/inspect/${data.id}`);
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
              const response = await apis.Sale.delete(
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
              await FetchSales();
              return;
            } catch (err) {
              play("alert");
              toast.error(t.toast.warning_error, {
                description: t.toast.error_delete,
              });
              console.error("[src/pages/products/sale/SalesList.tsx]", err);
              return;
            }
          },
        });
      },
    },
  ];

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
                id: "sales",
                label: t.sale.sales,
                url: "/f/sales",
              },
            ]}
          />
        </h2>
      </Horizontal>

      <Horizontal internal={1}>
        <Button
          Icon={Plus}
          category="Success"
          text={t.sale.new}
          onClick={() => navigate("/f/sales/inspect")}
        />
        <div style={{ maxWidth: 128 }}>
          <InputSelect
            label=""
            value={stage}
            empty={t.stacks.no_option}
            options={SaleStages.map(function (stage) {
              return {
                id: stage,
                value: stage,
                text: t.sale?.[stage as keyof typeof t.sale] || stage,
              };
            })}
            onChange={function (event) {
              const newStage =
                (event.currentTarget?.value as TypeSaleStage) || "";
              setStage(newStage);
              return;
            }}
          />
        </div>
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
          disabled={!selected.length}
          text={t.components.export}
          onClick={function () {
            const data = sales.filter(function (sale) {
              return selected.includes(sale.id);
            });
            Download.JSON(data, `sales.json`);
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
          data={sales as TableData[]}
          columns={{
            stage: {
              label: t.sale.stage,
              maxWidth: "96px",
              handler: function (data) {
                return (
                  <Badge
                    value={String(data.status)}
                    category={data.status ? "Success" : "Danger"}
                  />
                );
              },
            },
            customerName: {
              label: t.customer.name,
            },
            products: {
              label: t.product.products,
            },
            details: {
              label: t.sale.details,
            },
            price: {
              label: t.sale.price,
              handler: function (data) {
                if (!Array.isArray(data.variants)) return "";
                return <div>{Currency(data?.variants?.[0].price || 0)}</div>;
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
          options={getOptions}
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

export default SalesList;
