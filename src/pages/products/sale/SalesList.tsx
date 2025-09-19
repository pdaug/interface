import {
  Tag,
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
import { endOfDay, subDays } from "date-fns";
import { useNavigate } from "react-router-dom";

//apis
import apis from "../../../apis";

// assets
import { SaleStagesGroupped, SaleStagesCategory } from "../../../assets/Sale";

// utils
import Download from "../../../utils/Download";
import Clipboard from "../../../utils/Clipboard";
import Calculate from "../../../utils/Calculate";

// types
import { ApiResponsePaginate } from "../../../types/Api";
import { TypeInputInterval } from "../../../types/Components";
import { TypeSale, TypeSaleProduct, TypeSaleStage } from "../../../types/Sale";

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
import Stats from "../../../components/stats/Stats";
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
  const [seller, setSeller] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [stage, setStage] = useState<TypeSaleStage | "all">("all");
  const [interval, setInterval] = useState<TypeInputInterval>({
    start: subDays(new Date(), 30),
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
          dateStart: interval.start ? interval.start.toISOString() : undefined,
          dateEnd: interval.end ? interval.end.toISOString() : undefined,
          showDeleted: "true",
          filter: JSON.stringify({
            stage: stage !== "all" ? stage : undefined,
            $expr:
              seller !== "all"
                ? {
                    $eq: [{ $toString: "$sellerId" }, seller],
                  }
                : undefined,
            $and: [
              { $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }] },
              {
                $or: searchDebounced
                  ? [
                      {
                        saleId: searchDebounced,
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
        console.warn("[src/pages/products/sale/SalesList.tsx]", response.data);
        return;
      }
      setSales(response.data.result.items);
      setTotal(response.data.result.pagination.total);

      if (!interval.start || !interval.end) return;

      const responseStats = await apis.Sale.stats<Record<string, number>>(
        token,
        instance.name,
        {
          dateStart: new Date(interval.start).toISOString(),
          dateEnd: new Date(interval.end).toISOString(),
        },
        workspaceId,
      );
      if (!responseStats.data?.result) {
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        console.warn(
          "[src/pages/products/sale/SalesList.tsx]",
          responseStats.data,
        );
        return;
      }
      setStats(responseStats.data.result);

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
  useAsync(FetchSales, [
    interval,
    workspaceId,
    stage,
    page,
    seller,
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
          navigate(`/f/sales/inspect/${data.id}`);
          return;
        }
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.sale.no_products,
        });
        console.error(
          "[src/pages/products/sale/SalesList.tsx]",
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
          const urlShare = `https://${location.host}/share/sale/${data.id}`;
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
          description: t.sale.no_products,
        });
        console.error("[src/pages/products/sale/SalesList.tsx]", "no_share");
        return;
      },
    },
    {
      id: "documentProposal",
      label: t.sale.document_proposal,
      Icon: FileText,
      onClick: async function (_: React.MouseEvent, data: unknown) {
        if (
          data &&
          typeof data === "object" &&
          "id" in data &&
          "documentProposal" in data &&
          data.documentProposal
        ) {
          const url = `${window.location.origin}/share/sale/${data.id}/document/proposal`;
          window.open(url, "_blank");
          return;
        }
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_document,
        });
        console.error(
          "[src/pages/products/sale/SalesList.tsx]",
          "no_document_proposal",
        );
        return;
      },
    },
    {
      id: "documentContract",
      label: t.sale.document_contract,
      Icon: FileText,
      onClick: async function (_: React.MouseEvent, data: unknown) {
        if (
          data &&
          typeof data === "object" &&
          "id" in data &&
          "documentContract" in data &&
          data.documentContract
        ) {
          const url = `${window.location.origin}/share/sale/${data.id}/document/contract`;
          window.open(url, "_blank");
          return;
        }
        play("alert");
        toast.warning(t.toast.warning_error, {
          description: t.stacks.no_document,
        });
        console.error(
          "[src/pages/products/sale/SalesList.tsx]",
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
        <Stats
          Icon={Tag}
          title={t.sale.stats_quantity}
          value={stats?.quantity || 0}
          valueUnit={t.sale.sales.toLowerCase()}
          footer={t.sale.stats_quantity_description}
        />

        <Stats
          Icon={Tag}
          category="Success"
          title={t.sale.stats_value}
          value={stats?.salesWon || 0}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
          footer={t.sale.stats_value_description}
        />

        <Stats
          Icon={Tag}
          category="Warning"
          title={t.sale.stats_pending}
          value={stats?.salesPending || 0}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
          footer={t.sale.stats_pending_description}
        />

        <Stats
          Icon={Tag}
          category="Danger"
          title={t.sale.stats_lost}
          value={stats?.salesLost || 0}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
          footer={t.sale.stats_lost_description}
        />
      </Horizontal>

      <Horizontal internal={1}>
        <Button
          Icon={Plus}
          category="Success"
          text={t.sale.new}
          onClick={() => navigate("/f/sales/inspect")}
        />
        <div style={{ maxWidth: 160 }}>
          <InputSelect
            label=""
            value={stage}
            empty={t.sale.all_stage}
            options={[...SaleStagesGroupped, { value: "all", group: "" }].map(
              function (stage) {
                if (stage.value === "all")
                  return {
                    id: stage.value,
                    value: stage.value,
                    text: t.sale.all_stage,
                  };
                return {
                  id: stage.value,
                  value: stage.value,
                  text: t.sale[stage.value as keyof typeof t.sale],
                  group: t.sale[stage.group as keyof typeof t.sale],
                };
              },
            )}
            onChange={function (event) {
              const newStage =
                (event.currentTarget?.value as TypeSaleStage) || "";
              setStage(newStage);
              return;
            }}
          />
        </div>
        <div style={{ maxWidth: 256 }}>
          <InputSelect
            label=""
            value={seller}
            empty={t.sale.all_seller}
            options={[
              { id: "all", name: t.sale.all_seller, status: true },
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
              const newSeller = event.currentTarget?.value || "";
              setSeller(newSeller);
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
            saleId: {
              label: t.sale.id,
              maxWidth: 96,
              handler: function (data) {
                return (
                  <Badge
                    category="Neutral"
                    value={(data?.saleId as string) || ""}
                  />
                );
              },
            },
            stage: {
              label: t.sale.stage,
              maxWidth: 96,
              handler: function (data) {
                return (
                  <Badge
                    value={
                      t.sale?.[data.stage as keyof typeof t.sale] ||
                      t.components.unknown
                    }
                    category={
                      SaleStagesCategory?.[data.stage as TypeSaleStage] ||
                      "Neutral"
                    }
                  />
                );
              },
            },
            customerName: {
              label: t.sale.customer,
              handler: function (data) {
                return (
                  <div
                    className="cursor"
                    onClick={function () {
                      navigate(`/f/sales/inspect/${data.id}`);
                      return;
                    }}
                  >
                    {data?.customerName as string}
                  </div>
                );
              },
            },
            products: {
              label: t.sale.product_name,
              handler: function (data) {
                const productNamesFrequency = (
                  data?.products as TypeSaleProduct[]
                ).reduce(
                  function (acc, item) {
                    acc[item.productName] =
                      (acc[item.productName] || 0) + item.quantity;
                    return acc;
                  },
                  {} as Record<string, number>,
                );

                return (
                  <div>
                    {Object.entries(productNamesFrequency)?.map(function (
                      [productName, value],
                      index,
                    ) {
                      return (
                        <div key={`product-name-${index}`}>
                          {String(value)}x {productName}
                        </div>
                      );
                    })}
                  </div>
                );
              },
            },
            details: {
              label: t.sale.details,
              handler: function (data) {
                const {
                  subtotalDeductions,
                  subtotalAdditions,
                  subtotalShipping,
                } = Calculate.totalSale(data as TypeSale);

                return (
                  <Vertical
                    internal={0.4}
                    styles={{ alignItems: "flex-start" }}
                  >
                    {!subtotalAdditions &&
                      !subtotalDeductions &&
                      !subtotalShipping && (
                        <i style={{ opacity: 0.6 }}>{t.sale.empty_details}</i>
                      )}
                    {Boolean(subtotalShipping) && (
                      <Badge
                        category="Danger"
                        styles={{ justifyContent: "flex-start" }}
                        value={`${t.sale.shipping}: +${Currency(subtotalShipping)}`}
                      />
                    )}
                    {Boolean(subtotalAdditions) && (
                      <Badge
                        category="Danger"
                        styles={{ justifyContent: "flex-start" }}
                        value={`${t.sale.addition}: +${Currency(subtotalAdditions)}`}
                      />
                    )}
                    {Boolean(subtotalDeductions) && (
                      <Badge
                        category="Success"
                        styles={{ justifyContent: "flex-start" }}
                        value={`${t.sale.deduction}: +${Currency(subtotalDeductions)}`}
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
                const { total } = Calculate.totalSale(data as TypeSale);
                return <div>{Currency(total || 0)}</div>;
              },
            },
            user: {
              label: t.sale.seller,
              handler: function (data) {
                const userFinded = users?.find(function (user) {
                  return user.id === data.userId;
                });
                const sellerFinded =
                  users?.find(function (user) {
                    return user.id === data.sellerId;
                  }) || userFinded;
                return (
                  <Tooltip
                    content={t.components[sellerFinded?.role || "collaborator"]}
                  >
                    <Profile
                      photoCircle
                      photoSize={3}
                      padding={false}
                      styles={{ lineHeight: 1 }}
                      photo={sellerFinded?.photo || ""}
                      description={sellerFinded?.email || ""}
                      name={sellerFinded?.name || t.components.unknown}
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
