import {
  Plus,
  Trash,
  Receipt,
  FileText,
  CopySimple,
  PencilSimple,
  ShareNetwork,
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
import { OrderStages, OrderStagesCategory } from "../../../assets/Order";

// utils
import Download from "../../../utils/Download";
import Clipboard from "../../../utils/Clipboard";
import Calculate from "../../../utils/Calculate";

// types
import {
  TypeOrder,
  TypeOrderStage,
  TypeOrderService,
} from "../../../types/Order";
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

const OrdersList = function () {
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
  const [orders, setOrders] = useState<TypeOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [userFilter, setUserFilter] = useState<string>("all");
  const [stage, setStage] = useState<TypeOrderStage | "all">("all");
  const [interval, setInterval] = useState<TypeInputInterval>({
    start: startOfYear(new Date()),
    end: endOfDay(new Date()),
  });

  const [searchDebounced] = useDebounce(search, 500);

  const FetchOrders = async function () {
    setLoading(true);
    try {
      const response = await apis.Order.list<ApiResponsePaginate<TypeOrder>>(
        token,
        instance.name,
        {
          pageSize,
          pageCurrent: searchDebounced ? 1 : page,
          dateStart: interval.start ? interval.start.toISOString() : undefined,
          dateEnd: interval.end ? interval.end.toISOString() : undefined,
          showDeleted: "true",
          filter: JSON.stringify({
            stage: stage !== "all" ? stage : undefined,
            $expr:
              userFilter !== "all"
                ? {
                    $eq: [{ $toString: "$userId" }, userFilter],
                  }
                : undefined,
            $and: [
              { $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }] },
              {
                $or: searchDebounced
                  ? [
                      {
                        orderId: searchDebounced,
                      },
                      {
                        customerName: {
                          $regex: searchDebounced,
                          $options: "i",
                        },
                      },
                    ]
                  : undefined,
              },
            ],
          }),
        },
        workspaceId,
      );
      if (!response.data?.result?.items) {
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        console.warn(
          "[src/pages/products/order/OrdersList.tsx]",
          response.data,
        );
        return;
      }
      setOrders(response.data.result.items);
      setTotal(response.data.result.pagination.total);
      return;
    } catch (err) {
      play("alert");
      toast.error(t.toast.warning_error, {
        description: t.stacks.no_find_item,
      });
      console.error("[src/pages/products/order/OrdersList.tsx]", err);
      return;
    } finally {
      setLoading(false);
    }
  };

  // fetch orders
  useAsync(FetchOrders, [
    interval,
    workspaceId,
    stage,
    page,
    userFilter,
    searchDebounced,
  ]);

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
      id: "invoice",
      label: t.components.to_invoice,
      Icon: Receipt,
      onClick: async function (_: React.MouseEvent, data: unknown) {
        if (data && typeof data === "object" && "id" in data) {
          navigate(`/f/orders/inspect/${data.id}`);
          return;
        }
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_items,
        });
        console.error(
          "[src/pages/products/order/OrdersList.tsx]",
          "no_to_invoice",
        );
        return;
      },
    },
    {
      id: "share",
      label: t.components.share,
      Icon: ShareNetwork,
      onClick: async function (_: React.MouseEvent, data: unknown) {
        if (data && typeof data === "object" && "id" in data) {
          const urlShare = `https://${location.host}/share/order/${data.id}`;
          OpenDialog({
            category: "Success",
            title: t.dialog.title_share,
            description: (
              <Vertical internal={1}>
                <div>{t.dialog.description_share}</div>
                <a
                  href={urlShare}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {urlShare}
                </a>
              </Vertical>
            ),
            confirmText: t.components.copy,
            onConfirm: async function () {
              const result = await Clipboard.copy(urlShare);
              if (result) {
                play("ok");
                toast.success(t.toast.success, {
                  description: t.toast.success_copy,
                });
                CloseDialog();
                return;
              }
              play("alert");
              toast.warning(t.toast.warning_error, {
                description: t.toast.warning_copy,
              });
              CloseDialog();
              return;
            },
          });
          return;
        }
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_items,
        });
        console.error("[src/pages/products/order/OrdersList.tsx]", "no_share");
        return;
      },
    },
    {
      id: "documentQuotation",
      label: t.order.document_quotation,
      Icon: FileText,
      onClick: async function (_: React.MouseEvent, data: unknown) {
        if (
          data &&
          typeof data === "object" &&
          "id" in data &&
          "documentQuotation" in data &&
          data.documentQuotation
        ) {
          const url = `${window.location.origin}/share/order/${data.id}/document/quotation`;
          window.open(url, "_blank");
          return;
        }
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_document,
        });
        console.error(
          "[src/pages/products/order/OrdersList.tsx]",
          "no_document_quotation",
        );
        return;
      },
    },
    {
      id: "documentContract",
      label: t.order.document_contract,
      Icon: FileText,
      onClick: async function (_: React.MouseEvent, data: unknown) {
        if (
          data &&
          typeof data === "object" &&
          "id" in data &&
          "documentContract" in data &&
          data.documentContract
        ) {
          const url = `${window.location.origin}/share/order/${data.id}/document/contract`;
          window.open(url, "_blank");
          return;
        }
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_document,
        });
        console.error(
          "[src/pages/products/order/OrdersList.tsx]",
          "no_document_contract",
        );
        return;
      },
    },
    {
      id: "download",
      label: t.components.download,
      Icon: DownloadSimple,
      onClick: function (_: React.MouseEvent, data: unknown) {
        if (data && typeof data === "object" && "id" in data) {
          Download.JSON(data, `order-${data.id}.json`);
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
          navigate(`/f/orders/inspect/${data.id}`);
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
              const response = await apis.Order.delete(
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
              await FetchOrders();
              return;
            } catch (err) {
              play("alert");
              toast.error(t.toast.warning_error, {
                description: t.toast.error_delete,
              });
              console.error("[src/pages/products/order/OrdersList.tsx]", err);
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
                id: "orders",
                label: t.order.orders,
                url: "/f/orders",
              },
            ]}
          />
        </h2>
      </Horizontal>

      <Horizontal internal={1}>
        <Button
          Icon={Plus}
          category="Success"
          text={t.order.new}
          onClick={() => navigate("/f/orders/inspect")}
        />
        <div style={{ maxWidth: 160 }}>
          <InputSelect
            label=""
            value={stage}
            empty={t.order.all_stages}
            options={["all", ...OrderStages].map(function (stage) {
              if (stage === "all")
                return {
                  id: stage,
                  value: stage,
                  text: t.order.all_stages,
                };
              return {
                id: stage,
                value: stage,
                text: t.order[stage as keyof typeof t.order],
              };
            })}
            onChange={function (event) {
              const newStage =
                (event.currentTarget?.value as TypeOrderStage) || "";
              setStage(newStage);
              return;
            }}
          />
        </div>
        <div style={{ maxWidth: 256 }}>
          <InputSelect
            label=""
            value={userFilter}
            empty={t.order.all_users}
            options={[
              { id: "all", name: t.order.all_users, status: true },
              ...users,
            ].map(function (userLocal) {
              return {
                id: userLocal.id,
                value: userLocal.id,
                text: userLocal.name,
                disabled: !userLocal.status,
              };
            })}
            onChange={function (event) {
              const newUserFilter = event.currentTarget?.value || "";
              setUserFilter(newUserFilter);
              return;
            }}
          />
        </div>
        <div style={{ width: 200 }}>
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
            const data = orders.filter(function (order) {
              return selected.includes(order.id);
            });
            Download.JSON(data, `orders.json`);
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
          data={orders as TableData[]}
          columns={{
            orderId: {
              label: t.order.id,
              maxWidth: 96,
              handler: function (data) {
                return (
                  <Badge
                    category="Neutral"
                    value={(data?.orderId as string) || ""}
                  />
                );
              },
            },
            stage: {
              label: t.order.stage,
              maxWidth: 96,
              handler: function (data) {
                return (
                  <Badge
                    value={
                      t.order?.[data.stage as keyof typeof t.order] ||
                      t.components.unknown
                    }
                    category={
                      OrderStagesCategory?.[data.stage as TypeOrderStage] ||
                      "Neutral"
                    }
                  />
                );
              },
            },
            customerName: {
              label: t.order.customer,
              handler: function (data) {
                return (
                  <div
                    className="cursor"
                    onClick={function () {
                      navigate(`/f/orders/inspect/${data.id}`);
                      return;
                    }}
                  >
                    {data?.customerName as string}
                  </div>
                );
              },
            },
            services: {
              label: t.order.service_name,
              handler: function (data) {
                const serviceNamesFrequency = (
                  data?.services as TypeOrderService[]
                ).reduce(
                  function (acc, item) {
                    acc[item.serviceName] =
                      (acc[item.serviceName] || 0) + item.quantity;
                    return acc;
                  },
                  {} as Record<string, number>,
                );

                return (
                  <div>
                    {Object.entries(serviceNamesFrequency)?.map(function (
                      [serviceName, value],
                      index,
                    ) {
                      return (
                        <div key={`service-name-${index}`}>
                          {String(value)}x {serviceName}
                        </div>
                      );
                    })}
                  </div>
                );
              },
            },
            details: {
              label: t.order.details,
              handler: function (data) {
                const subtotalProducts = Calculate.products(
                  (data?.products as Record<string, unknown>[]) || [],
                );

                const subtotalAdditions = Calculate.details(
                  (data?.details as Record<string, unknown>[])?.filter(
                    function (detail) {
                      return (
                        detail?.type === "tax" ||
                        detail?.type === "fee" ||
                        detail?.type === "shipping"
                      );
                    },
                  ) || [],
                  subtotalProducts,
                );

                const subtotalDeductions = Calculate.details(
                  (data?.details as Record<string, unknown>[])?.filter(
                    function (detail) {
                      return (
                        detail?.type === "discount" ||
                        detail?.type === "promo" ||
                        detail?.type === "coupon" ||
                        detail?.type === "voucher"
                      );
                    },
                  ) || [],
                  subtotalProducts,
                );

                return (
                  <Vertical
                    internal={0.4}
                    styles={{ alignItems: "flex-start" }}
                  >
                    {!subtotalAdditions && !subtotalDeductions && (
                      <i style={{ opacity: 0.6 }}>{t.order.empty_details}</i>
                    )}
                    {Boolean(subtotalAdditions) && (
                      <Badge
                        category="Danger"
                        styles={{ justifyContent: "flex-start" }}
                        value={`${t.order.addition}: +${Currency(subtotalAdditions)}`}
                      />
                    )}
                    {Boolean(subtotalDeductions) && (
                      <Badge
                        category="Success"
                        styles={{ justifyContent: "flex-start" }}
                        value={`${t.order.deduction}: +${Currency(subtotalDeductions)}`}
                      />
                    )}
                  </Vertical>
                );
              },
            },
            total: {
              label: t.components.total,
              maxWidth: 128,
              handler: function (data) {
                const subtotalProducts = Calculate.products(
                  (data?.products as Record<string, unknown>[]) || [],
                );

                const subtotalAdditions = Calculate.details(
                  (data?.details as Record<string, unknown>[])?.filter(
                    function (detail) {
                      return (
                        detail?.type === "tax" ||
                        detail?.type === "fee" ||
                        detail?.type === "shipping"
                      );
                    },
                  ) || [],
                  subtotalProducts,
                );

                const subtotalDeductions = Calculate.details(
                  (data?.details as Record<string, unknown>[])?.filter(
                    function (detail) {
                      return (
                        detail?.type === "discount" ||
                        detail?.type === "promo" ||
                        detail?.type === "coupon" ||
                        detail?.type === "voucher"
                      );
                    },
                  ) || [],
                  subtotalProducts,
                );

                const total =
                  subtotalProducts + subtotalAdditions - subtotalDeductions;

                return <div>{Currency(total || 0)}</div>;
              },
            },
            user: {
              label: t.order.user,
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

export default OrdersList;
